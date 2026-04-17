import type { TMDBResult } from '../../services/tmdbService';

export const mockTopMovies: TMDBResult[] = [
  {
    tmdbId: 1,
    title: 'Duna: Parte Dois',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nx1S8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    overview: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
    rating: 8.4,
    year: '2024',
    mediaType: 'movie',
    trailerKey: 'U2Qp5pL3ovA'
  },
  {
    tmdbId: 2,
    title: 'Oppenheimer',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n8ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    overview: 'A história do físico J. Robert Oppenheimer, seu papel no Projeto Manhattan e o desenvolvimento da bomba atômica.',
    rating: 8.1,
    year: '2023',
    mediaType: 'movie',
    trailerKey: 'uYPbbksJxIg'
  },
  {
    tmdbId: 3,
    title: 'Barbie',
    poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
    overview: 'Barbie vive no perfeito mundo de Barbieland até que uma crise existencial a leva ao mundo real.',
    rating: 7.0,
    year: '2023',
    mediaType: 'movie',
    trailerKey: 'pBk4NYhWNMM'
  },
  {
    tmdbId: 4,
    title: 'Interestelar',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    overview: 'Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.',
    rating: 8.6,
    year: '2014',
    mediaType: 'movie',
    trailerKey: 'zSWdZVtXT7E'
  },
  {
    tmdbId: 5,
    title: 'O Poderoso Chefão',
    poster: 'https://image.tmdb.org/t/p/w500/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',
    overview: 'O patriarca idoso de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.',
    rating: 8.7,
    year: '1972',
    mediaType: 'movie',
    trailerKey: 'sY1S34973zA'
  },
  {
    tmdbId: 6,
    title: 'Parasita',
    poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
    overview: 'Uma família coreana pobre se infiltra na casa de uma família rica, criando uma situação cada vez mais tensa.',
    rating: 8.6,
    year: '2019',
    mediaType: 'movie',
    trailerKey: '5xH0HfJHsaY'
  },
  {
    tmdbId: 7,
    title: 'Clube da Luta',
    poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    overview: 'Um homem insone e um vendedor de sabão formam um clube de luta underground que evolui para algo muito maior.',
    rating: 8.4,
    year: '1999',
    mediaType: 'movie',
    trailerKey: 'qtRKdVHc-cE'
  }
];

export const getTopMoviesFromTMDB = async (): Promise<TMDBResult[]> => {
  // Esta função pode ser usada para buscar filmes do TMDB API
  // Por enquanto retorna os dados mock
  return mockTopMovies;
};
