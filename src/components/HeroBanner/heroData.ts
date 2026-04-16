import type { HeroSlide } from './HeroBanner';

export const mockHeroSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Mulheres Imperfeitas',
    subtitle: 'Série Original',
    description: 'Os segredos de três melhores amigas vêm à tona neste escandaloso mistério de assassinato.',
    badge: 'Novo · Série',
    backgroundImage: 'https://picsum.photos/1920/1080?random=11',
    type: 'series'
  },
  {
    id: '2',
    title: 'Consequência',
    subtitle: 'Filme Original',
    description: 'Keanu Reeves estrela como um ícone de Hollywood chantageado por um vídeo misterioso.',
    badge: 'Novo · Filme',
    backgroundImage: 'https://picsum.photos/1920/1080?random=22',
    type: 'movie'
  },
  {
    id: '3',
    title: 'For All Mankind',
    subtitle: 'Temporada 4',
    description: 'A luta para dominar o espaço continua. Escolha um lado: Terra vs. Marte.',
    badge: 'Episódios às sextas',
    backgroundImage: 'https://picsum.photos/1920/1080?random=33',
    type: 'series'
  },
  {
    id: '4',
    title: 'Ruptura',
    subtitle: 'Série Original',
    description: 'Sua vida no trabalho e sua vida pessoal estão completamente separadas. Literalmente.',
    badge: 'Sucesso · Série',
    backgroundImage: 'https://picsum.photos/1920/1080?random=44',
    type: 'series'
  },
  {
    id: '5',
    title: 'Canais ao Vivo',
    subtitle: '24/7',
    description: 'Assista seus canais favoritos ao vivo com qualidade premium.',
    badge: 'Ao Vivo',
    backgroundImage: 'https://picsum.photos/1920/1080?random=55',
    type: 'live'
  }
];

export const getHeroSlidesFromChannels = (channels: any[]): HeroSlide[] => {
  // Esta função pode ser usada para converter canais em slides do hero
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
