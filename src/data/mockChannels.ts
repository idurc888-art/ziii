export interface Channel {
  name: string
  url: string
  logo: string
  group: string
}

export const mockChannels: Channel[] = [
  { name: 'Cinema HD', url: 'http://fake/1', logo: '', group: 'Filmes' },
  { name: 'Action Movies', url: 'http://fake/2', logo: '', group: 'Filmes' },
  { name: 'Drama Plus', url: 'http://fake/3', logo: '', group: 'Filmes' },
  { name: 'Comedy Central', url: 'http://fake/4', logo: '', group: 'Filmes' },
  { name: 'Horror Night', url: 'http://fake/5', logo: '', group: 'Filmes' },
  { name: 'Sci-Fi Channel', url: 'http://fake/6', logo: '', group: 'Filmes' },
  { name: 'Romance TV', url: 'http://fake/7', logo: '', group: 'Filmes' },

  { name: 'Netflix Series', url: 'http://fake/8', logo: '', group: 'Séries' },
  { name: 'HBO Max', url: 'http://fake/9', logo: '', group: 'Séries' },
  { name: 'Prime Originals', url: 'http://fake/10', logo: '', group: 'Séries' },
  { name: 'Apple TV+', url: 'http://fake/11', logo: '', group: 'Séries' },
  { name: 'Disney Series', url: 'http://fake/12', logo: '', group: 'Séries' },
  { name: 'Anime Zone', url: 'http://fake/13', logo: '', group: 'Séries' },
  { name: 'K-Drama', url: 'http://fake/14', logo: '', group: 'Séries' },

  { name: 'ESPN HD', url: 'http://fake/15', logo: '', group: 'Esportes' },
  { name: 'Fox Sports', url: 'http://fake/16', logo: '', group: 'Esportes' },
  { name: 'SporTV', url: 'http://fake/17', logo: '', group: 'Esportes' },
  { name: 'NBA TV', url: 'http://fake/18', logo: '', group: 'Esportes' },
  { name: 'NFL Network', url: 'http://fake/19', logo: '', group: 'Esportes' },
  { name: 'Combate', url: 'http://fake/20', logo: '', group: 'Esportes' },
]

export const mockGroups: Record<string, Channel[]> = mockChannels.reduce(
  (acc, ch) => ({ ...acc, [ch.group]: [...(acc[ch.group] || []), ch] }),
  {} as Record<string, Channel[]>
)
