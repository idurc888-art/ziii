import type { HeroSlide } from './HeroBanner';

export const mockHeroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Dune: Part Two',
    subtitle: 'Filme',
    description: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
    badge: 'Novo · Filme',
    backgroundImage: 'https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    type: 'movie'
  },
  {
    id: '2',
    title: 'Oppenheimer',
    subtitle: 'Filme',
    description: 'A história do cientista americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.',
    badge: 'Sucesso',
    backgroundImage: 'https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg',
    type: 'movie'
  },
  {
    id: '3',
    title: 'The Bear',
    subtitle: 'Temporada 3',
    description: 'Carmy se esforça para transformar a lanchonete da família e a si mesmo enquanto trabalha ao lado de uma equipe rústica.',
    badge: 'Série Original',
    backgroundImage: 'https://image.tmdb.org/t/p/w1280/wHNwlE6ftEpgjVbdhLXOtv1hLs0.jpg',
    type: 'series'
  },
  {
    id: '4',
    title: 'Stranger Things',
    subtitle: 'Temporada 5',
    description: 'Quando um garoto desaparece, a cidade inteira se envolve em um mistério com experimentos secretos e forças sobrenaturais.',
    badge: 'Em Breve',
    backgroundImage: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    type: 'series'
  },
  {
    id: '5',
    title: 'Planeta Terra III',
    subtitle: 'Documentário',
    description: 'Viaje para os lugares mais distantes e descubra histórias incríveis da natureza pelo mundo afora.',
    badge: 'Novo',
    backgroundImage: 'https://image.tmdb.org/t/p/w1280/3TOUvY2NZx8r31UHA3CQdRAY271.jpg',
    type: 'series'
  }
];

export const getHeroSlidesFromChannels = (channels: any[]): HeroSlide[] => {
  return channels.slice(0, 5).map((channel, index) => ({
    id: `channel-${channel.id || index}`,
    title: channel.name,
    subtitle: channel.group,
    description: `Assista ${channel.name} ao vivo com a melhor qualidade.`,
    badge: 'Ao Vivo',
    backgroundImage: channel.logo || `https://picsum.photos/1920/1080?random=${index + 100}`,
    type: 'live'
  }));
};
