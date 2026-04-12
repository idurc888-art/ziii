export function createM3UWorker(): Worker {
  const code = `
const smartCategories = {
  'Filmes': /filme|movie|cinema/i,
  'Séries': /serie|series|tv show/i,
  'Esportes': /sport|espn|fox sports|combate|premiere/i,
  'Notícias': /news|noticia|jornalismo|globo news|cnn|band news/i,
  'Infantil': /kids|infantil|cartoon|disney|nick|gloob/i,
  'Documentários': /discovery|natgeo|history|animal planet|doc/i,
  'Música': /music|mtv|multishow/i,
  'Variedades': /entretenimento|variety|gnt|canal off/i,
  'Religiosos': /gospel|religioso|catholic|evangelico/i,
  'Adultos': /adult|xxx|playboy/i,
  'Abertos': /globo|sbt|record|band|redetv/i,
  'Internacionais': /hbo|fox|fx|amc|tnt|warner|universal|sony|axn|space|paramount/i
};

function parseM3U(raw, maxChannels) {
  const lines = raw.split('\\n');
  const channels = [];
  const grouped = {};
  let current = null;

  for (let i = 0; i < lines.length && channels.length < maxChannels; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      current = {
        name: nameMatch ? nameMatch[1].trim() : 'Sem nome',
        logo: logoMatch ? logoMatch[1] : '',
        group: groupMatch ? groupMatch[1] : 'Outros',
        url: ''
      };
    } else if (line && !line.startsWith('#') && current) {
      current.url = line;
      channels.push(current);
      
      let cat = current.group || 'Outros';
      for (const [key, regex] of Object.entries(smartCategories)) {
        if (regex.test(current.name) || regex.test(current.group)) {
          cat = key;
          break;
        }
      }
      
      if (!grouped[cat]) grouped[cat] = [];
      if (grouped[cat].length < 500) grouped[cat].push(current);
      
      current = null;
    }
  }
  
  return { channels, grouped };
}

self.onmessage = function(e) {
  const { type, payload, maxChannels } = e.data;
  if (type === 'PARSE') {
    try {
      self.postMessage({ type: 'PROGRESS', percent: 50 });
      const result = parseM3U(payload, maxChannels || 10000);
      self.postMessage({ type: 'DONE', payload: result });
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: err.message });
    }
  }
};
`;

  const blob = new Blob([code], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}
