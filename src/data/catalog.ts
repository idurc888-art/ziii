export type Streaming = 'netflix' | 'amazon' | 'hbo' | 'disney' | 'paramount' | 'apple' | 'globoplay' | 'star' | 'telecine' | 'crunchyroll'

export interface CanonicalTitle {
  id: string
  slug: string
  title: string
  altTitles: string[]
  type: 'movie' | 'series'
  streaming: Streaming
  matchHints: string[]
  tmdbId?: number | string
  year?: string | number
  rating?: number
  overview?: string
  poster?: string
  backdrop?: string
}

export const CANONICAL_CATALOG: CanonicalTitle[] = [
  {
    "id": "netflix-the-killer",
    "slug": "the-killer",
    "title": "The Killer",
    "altTitles": [
      "o assassino"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "killer",
      "assassino"
    ],
    "tmdbId": 1363600,
    "year": "2019",
    "rating": 10,
    "overview": "Um assassino brutal, condenado por seus crimes, escapa da prisão e começa uma caçada implacável para eliminar todos que o julgaram. Movido por ódio e desejo de vingança, ele não descansará até que todos os responsáveis por sua condenação paguem com a própria vida.",
    "poster": "https://image.tmdb.org/t/p/w342/vKHAVpNJG8q1s1Hl5ATopGp46eV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7QNzJ2hCoyQCsYyALlyxcKCGoYi.jpg"
  },
  {
    "id": "netflix-the-crown",
    "slug": "the-crown",
    "title": "The Crown",
    "altTitles": [
      "a coroa"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "crown"
    ],
    "tmdbId": 278573,
    "year": "2026",
    "rating": 9.1,
    "overview": "Na Coreia do Sul do século 21, governada por uma monarquia constitucional, uma herdeira chaebol com tudo, menos status, tenta controlar seu futuro após cruzar com o príncipe que não tem nada, apenas status. Unidos por um contrato de casamento, eles vivem um romance que desafia barreiras sociais.",
    "poster": "https://image.tmdb.org/t/p/w342/vS70MWKvCb6bT9kYj8OTmumcsWq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6ekykPwvAywJRjFEnUoCFWTO9O3.jpg"
  },
  {
    "id": "netflix-breaking-bad",
    "slug": "breaking-bad",
    "title": "Breaking Bad",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "breaking"
    ],
    "tmdbId": 1396,
    "year": "2008",
    "rating": 8.942,
    "overview": "Ao saber que tem câncer, um professor passa a fabricar metanfetamina pelo futuro da família, mudando o destino de todos.",
    "poster": "https://image.tmdb.org/t/p/w342/hGwm9Cj3CdbJIqQWNExQqiYmCd4.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg"
  },
  {
    "id": "netflix-avatar-a-lenda-de-aang",
    "slug": "avatar-a-lenda-de-aang",
    "title": "Avatar A Lenda de Aang",
    "altTitles": [
      "avatar last airbender"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "avatar",
      "lenda",
      "aang"
    ],
    "tmdbId": 246,
    "year": "2005",
    "rating": 8.756,
    "overview": "Aang é um menino de 12 anos que descobre ser o Avatar, mestre responsável por garantir o equilíbrio entre os quatro elementos e suas respectivas nações, mantendo o planeta em paz.",
    "poster": "https://image.tmdb.org/t/p/w342/7IJhby0sfQCN5ZIIseAWCw6j3xm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7oBGhqJIghRBvOwo5Qe0yM0cnMc.jpg"
  },
  {
    "id": "netflix-avatar-ultimo-mestre",
    "slug": "avatar-ultimo-mestre",
    "title": "Avatar: O Último Mestre do Ar",
    "altTitles": [
      "avatar the last airbender"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "avatar",
      "airbender"
    ],
    "tmdbId": 246,
    "year": "2005",
    "rating": 8.756,
    "overview": "Aang é um menino de 12 anos que descobre ser o Avatar, mestre responsável por garantir o equilíbrio entre os quatro elementos e suas respectivas nações, mantendo o planeta em paz.",
    "poster": "https://image.tmdb.org/t/p/w342/7IJhby0sfQCN5ZIIseAWCw6j3xm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7oBGhqJIghRBvOwo5Qe0yM0cnMc.jpg"
  },
  {
    "id": "netflix-arcane",
    "slug": "arcane",
    "title": "Arcane",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "arcane"
    ],
    "tmdbId": 94605,
    "year": "2021",
    "rating": 8.754,
    "overview": "Em meio ao conflito entre as cidades-gêmeas de Piltover e Zaun, duas irmãs lutam em lados opostos de uma guerra entre tecnologias mágicas e convicções incompatíveis.",
    "poster": "https://image.tmdb.org/t/p/w342/m3Tzf6k537PnhOEwaSRNCSxedLS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/q8eejQcg1bAqImEV8jh8RtBD4uH.jpg"
  },
  {
    "id": "netflix-better-call-saul",
    "slug": "better-call-saul",
    "title": "Better Call Saul",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "better",
      "call",
      "saul"
    ],
    "tmdbId": 60059,
    "year": "2015",
    "rating": 8.704,
    "overview": "Antes de se transformar no infame Saul Goodman, o advogado de Breaking Bad era mais inocente, mas não era santo.",
    "poster": "https://image.tmdb.org/t/p/w342/9IPVuAjodjc2FYluWnNvRdOPsCR.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/t15KHp3iNfHVQBNIaqUGW12xQA4.jpg"
  },
  {
    "id": "netflix-peaky-blinders",
    "slug": "peaky-blinders",
    "title": "Peaky Blinders",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "peaky",
      "blinders"
    ],
    "tmdbId": 60574,
    "year": "2013",
    "rating": 8.526,
    "overview": "Thomas Shelby e seus irmãos retornam a Birmingham depois de servir no exército britânico durante a Primeira Guerra Mundial. Os Peaky Blinders, a gangue na qual Thomas é líder, controlam a cidade de Birmingham. Mas, como as ambições de Shelby se estendem para além de Birmingham, ele planeja construir o império de negócios que criou e impedir qualquer um que atrapalhar.",
    "poster": "https://image.tmdb.org/t/p/w342/i0uajcHH9yogXMfDHpOXexIukG9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg"
  },
  {
    "id": "netflix-cyberpunk-edgerunners",
    "slug": "cyberpunk-edgerunners",
    "title": "Cyberpunk: Edgerunners",
    "altTitles": [
      "cyberpunk edgerunners"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "cyberpunk",
      "edgerunners"
    ],
    "tmdbId": 105248,
    "year": "2022",
    "rating": 8.47,
    "overview": "Para sobreviver em uma realidade distópica na qual a corrupção e os implantes cibernéticos controlam tudo, um jovem talentoso e impulsivo decide se tornar um mercenário.",
    "poster": "https://image.tmdb.org/t/p/w342/nWvAY8yHE873adMws83XqBPf7W2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bRE6zX4iOAejLOQCHryoV5WNu8G.jpg"
  },
  {
    "id": "netflix-o-gambito-da-rainha",
    "slug": "o-gambito-da-rainha",
    "title": "O Gambito da Rainha",
    "altTitles": [
      "queen's gambit"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "gambito",
      "rainha"
    ],
    "tmdbId": 87739,
    "year": "2020",
    "rating": 8.436,
    "overview": "Durante a Guerra Fria, em um orfanato do Kentucky, uma garota prodígio do xadrez luta contra o vício para se tornar a número um do mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/ubWpLTkwcms5PfZJMFZkNXVYXqJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg"
  },
  {
    "id": "netflix-lucifer",
    "slug": "lucifer",
    "title": "Lúcifer",
    "altTitles": [
      "lucifer"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "lucifer"
    ],
    "tmdbId": 63174,
    "year": "2016",
    "rating": 8.434,
    "overview": "Entediado com a vida nas trevas, o diabo se muda para Los Angeles, abre um piano-bar e empresta sua sabedoria a uma investigadora de assassinatos.",
    "poster": "https://image.tmdb.org/t/p/w342/hdKxcoV5CFc3sGOmbGXDXbx1cTZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ncftkNAjIz2PBbUMY7T0CHVJP8d.jpg"
  },
  {
    "id": "netflix-dark",
    "slug": "dark",
    "title": "Dark",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "dark"
    ],
    "tmdbId": 70523,
    "year": "2017",
    "rating": 8.422,
    "overview": "Quatro famílias iniciam uma desesperada busca por respostas quando uma criança desaparece e um complexo mistério envolvendo três gerações começa a se revelar.",
    "poster": "https://image.tmdb.org/t/p/w342/7yQyDCqSazrYTnmxdQLAZ8YDH87.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg"
  },
  {
    "id": "netflix-wandinha",
    "slug": "wandinha",
    "title": "Wandinha",
    "altTitles": [
      "wednesday"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "wandinha"
    ],
    "tmdbId": 119051,
    "year": "2022",
    "rating": 8.35,
    "overview": "Inteligente, sarcástica e meio morta por dentro. Wandinha Addams investiga uma onda de assassinatos e aproveita para fazer novos amigos e inimigos na Escola Nunca Mais.",
    "poster": "https://image.tmdb.org/t/p/w342/7rxiQrZjrer0RB9qNA8rHYFo53R.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg"
  },
  {
    "id": "netflix-outer-banks",
    "slug": "outer-banks",
    "title": "Outer Banks",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "outer",
      "banks"
    ],
    "tmdbId": 100757,
    "year": "2020",
    "rating": 8.268,
    "overview": "Em uma ilha com moradores pobres e ricos, John B e sua turma vivem aventuras cheias de mistério em busca de um tesouro perdido.",
    "poster": "https://image.tmdb.org/t/p/w342/ovDgO2LPfwdVRfvScAqo9aMiIW.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vHuoq8HAmBFge8aiiyhHVVtmQr3.jpg"
  },
  {
    "id": "netflix-castlevania",
    "slug": "castlevania",
    "title": "Castlevania",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "castlevania"
    ],
    "tmdbId": 71024,
    "year": "2017",
    "rating": 8.257,
    "overview": "Um caçador de vampiros luta para salvar uma cidade sitiada por um exército de criaturas controladas pelo próprio Drácula.",
    "poster": "https://image.tmdb.org/t/p/w342/WzFHnJY44uDERER0xi1jOdoafT.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jLE5bsPA9xOKzBWOaOmKbp1DWQS.jpg"
  },
  {
    "id": "netflix-the-last-kingdom",
    "slug": "the-last-kingdom",
    "title": "The Last Kingdom",
    "altTitles": [
      "ultimo reino"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "last",
      "kingdom"
    ],
    "tmdbId": 63333,
    "year": "2015",
    "rating": 8.246,
    "overview": "Enquanto Alfredo, o Grande, defende seu reino de invasões nórdicas, Uhtred - um saxão criado por vikings - planeja reivindicar o que é seu por direito.",
    "poster": "https://image.tmdb.org/t/p/w342/fMNJjzZUdc8pBVIQ85olSNaBKix.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/QbtctI8EzlhsyFDMUMyG3fli8B.jpg"
  },
  {
    "id": "netflix-klaus",
    "slug": "klaus",
    "title": "Klaus",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "klaus"
    ],
    "tmdbId": 508965,
    "year": "2019",
    "rating": 8.223,
    "overview": "Um carteiro egoísta e um fabricante de brinquedos solitário cultivam uma amizade improvável e levam alegria a uma cidade fria e sombria.",
    "poster": "https://image.tmdb.org/t/p/w342/guyZW9AQdTMp2F4esttjyIMMK1k.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cYQvXNPZLow73lhspVQ7CYlT3Mi.jpg"
  },
  {
    "id": "netflix-brooklyn-nine-nine",
    "slug": "brooklyn-nine-nine",
    "title": "Brooklyn Nine-Nine",
    "altTitles": [
      "b99"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "brooklyn",
      "nine-nine"
    ],
    "tmdbId": 48891,
    "year": "2013",
    "rating": 8.214,
    "overview": "O brilhante e imaturo detetive Jake Peralta precisa aprender a seguir as regras e trabalhar em equipe quando um capitão exigente assume o comando de seu esquadrão.",
    "poster": "https://image.tmdb.org/t/p/w342/A3SymGlOHefSKbz1bCOz56moupS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wyspZaGs7CXceV3Ct7NJhcKNDkn.jpg"
  },
  {
    "id": "netflix-ozark",
    "slug": "ozark",
    "title": "Ozark",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "ozark"
    ],
    "tmdbId": 69740,
    "year": "2017",
    "rating": 8.206,
    "overview": "Um consultor financeiro se muda com a família para as montanhas do Missouri com o objetivo de lavar quinhentos milhões de dólares e acalmar um violento traficante.",
    "poster": "https://image.tmdb.org/t/p/w342/epUO5w9nRmozR0iWCFwChT3ha6j.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aatG9iVAUL7U7OyFEmupESpOrD2.jpg"
  },
  {
    "id": "netflix-cobra-kai",
    "slug": "cobra-kai",
    "title": "Cobra Kai",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "cobra"
    ],
    "tmdbId": 77169,
    "year": "2018",
    "rating": 8.203,
    "overview": "Nesta aclamada série que é continuação dos filmes Karatê Kid, Daniel e Johnny retomam a rivalidade dos tempos de escola.",
    "poster": "https://image.tmdb.org/t/p/w342/6POBWybSBDBKjSs1VAQcnQC1qyt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5NrSIzfcBOFI9HRGV4nRYgMGhDU.jpg"
  },
  {
    "id": "netflix-love-death-robots",
    "slug": "love-death-robots",
    "title": "Love Death + Robots",
    "altTitles": [
      "love death and robots"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "love",
      "death",
      "robots"
    ],
    "tmdbId": 86831,
    "year": "2019",
    "rating": 8.2,
    "overview": "Criaturas aterrorizantes, surpresas bizarras e humor ácido habitam e florescem de cada um dos vários universos únicos criados para essa coletânea de curtas de animação, em que cada episódio apresenta sua própria narrativa e estilo visual.",
    "poster": "https://image.tmdb.org/t/p/w342/vL5BQvXH96cJzmNK5n7QliQxy90.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nBrkOZyI75artyizuBFeya48KbO.jpg"
  },
  {
    "id": "netflix-one-piece",
    "slug": "one-piece",
    "title": "One Piece",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "piece"
    ],
    "tmdbId": 111110,
    "year": "2023",
    "rating": 8.117,
    "overview": "O jovem pirata Monkey D. Luffy veste o chapéu de palha e, com sua tripulação atrapalhada, zarpa em uma jornada épica nesta adaptação em live-action do popular mangá.",
    "poster": "https://image.tmdb.org/t/p/w342/aesLt9fsKSA6KCgGxA60VVxjtLk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qD211Hb5XwFxrszzBBe5EUYJerh.jpg"
  },
  {
    "id": "netflix-mindhunter",
    "slug": "mindhunter",
    "title": "Mindhunter",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "mindhunter"
    ],
    "tmdbId": 67744,
    "year": "2017",
    "rating": 8.117,
    "overview": "Um agente da Unidade de Crimes em Série do FBI desenvolve avançadas técnicas de psicologia criminal ao perseguir notórios assassinos e estupradores.",
    "poster": "https://image.tmdb.org/t/p/w342/fbKE87mojpIETWepSbD5Qt741fp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/a906PH7CDmSOdS7kmnAgdWk5mhv.jpg"
  },
  {
    "id": "netflix-alice-in-borderland",
    "slug": "alice-in-borderland",
    "title": "Alice in Borderland",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "alice",
      "borderland"
    ],
    "tmdbId": 110316,
    "year": "2020",
    "rating": 8.103,
    "overview": "Um gamer e seus dois amigos são transportados para uma versão paralela de Tóquio, onde precisam participar de diversos jogos mortais caso queiram sobreviver.",
    "poster": "https://image.tmdb.org/t/p/w342/i0i7kGDrArtM1sCd8niZDC7iboV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/QZaPkNUvhdcKONuO2fXuqtcQRo.jpg"
  },
  {
    "id": "netflix-o-justiceiro",
    "slug": "o-justiceiro",
    "title": "O Justiceiro",
    "altTitles": [
      "the punisher",
      "punisher"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "justiceiro",
      "punisher"
    ],
    "tmdbId": 67178,
    "year": "2017",
    "rating": 8.1,
    "overview": "O ex-marine Frank Castle só quer punir os criminosos responsáveis pela morte da sua família, mas torna-se alvo de uma conspiração militar.",
    "poster": "https://image.tmdb.org/t/p/w342/sHwIjTM9YiNOltXD0Z20PO9JmkO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9czVEnJemvP6gcJlMEjUeuISL1c.jpg"
  },
  {
    "id": "netflix-a-maldicao-da-residencia-hill",
    "slug": "a-maldicao-da-residencia-hill",
    "title": "A Maldição da Residência Hill",
    "altTitles": [
      "haunting of hill house"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "maldicao",
      "hill",
      "house"
    ],
    "tmdbId": 72844,
    "year": "2018",
    "rating": 8.095,
    "overview": "Entre o passado e o presente, uma família dividida confronta memórias assustadoras do antigo lar e dos eventos aterrorizantes que os expulsaram de lá.",
    "poster": "https://image.tmdb.org/t/p/w342/mQQGdDgn4WpUL9PXssHecWkjfi1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sNtNXwtEbdw4LaCFxFQwL2Jv4yW.jpg"
  },
  {
    "id": "netflix-narcos",
    "slug": "narcos",
    "title": "Narcos",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "narcos"
    ],
    "tmdbId": 63351,
    "year": "2015",
    "rating": 8.074,
    "overview": "A notória série sobre o tráfico é baseada na história real de violência e poder dos cartéis colombianos.",
    "poster": "https://image.tmdb.org/t/p/w342/zzz1KiXWqr8SvqiAb1NmFtnV7Uu.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/y9ekzkPFmWSqUU3Kj0wHmYUM8qu.jpg"
  },
  {
    "id": "netflix-bridgerton",
    "slug": "bridgerton",
    "title": "Bridgerton",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "bridgerton"
    ],
    "tmdbId": 91239,
    "year": "2020",
    "rating": 8.068,
    "overview": "Um mundo sensual, luxuoso e competitivo da alta sociedade londrina no início do século XIX. Nesse período, a família Bridgerton, composta por oito irmãos, enfrenta o disputado mercado de casamentos, os bailes suntuosos de Mayfair e os palácios aristocráticos de Park Lane.",
    "poster": "https://image.tmdb.org/t/p/w342/eSrfwxnmMffTEI8gHTDde0iWuGB.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6umsRLI7t0ydFwCl0JNEIO0q2LH.jpg"
  },
  {
    "id": "netflix-demolidor",
    "slug": "demolidor",
    "title": "Demolidor",
    "altTitles": [
      "daredevil"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "demolidor",
      "daredevil"
    ],
    "tmdbId": 202555,
    "year": "2025",
    "rating": 8.034,
    "overview": "Matt Murdock, um advogado cego com habilidades fantásticas, luta por justiça através de seu agitado escritório de advocacia, enquanto o ex-chefe do crime Wilson Fisk busca seus próprios empreendimentos políticos em Nova Iorque. Quando suas identidades passadas começam a emergir, seus caminhos se cruzam perigosamente.",
    "poster": "https://image.tmdb.org/t/p/w342/r5hNFtkNAauxc2G4VUlnJOaVIb0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qrTAc0ZtQ859Qu5O8cixJzNJpQs.jpg"
  },
  {
    "id": "netflix-pinoquio-del-toro",
    "slug": "pinoquio-del-toro",
    "title": "Pinóquio",
    "altTitles": [
      "pinocchio del toro",
      "guillermo del toro's pinocchio"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "pinoquio",
      "pinocchio"
    ],
    "tmdbId": 555604,
    "year": "2022",
    "rating": 8.019,
    "overview": "Uma versão mais sombria do clássico conto de fadas infantil, onde um boneco de madeira se transforma em um menino vivo de verdade.",
    "poster": "https://image.tmdb.org/t/p/w342/x3IkO2sW4rSSVluFDz8isr6YDm8.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qXOxYzPSPY9viZTgs7O6vNBOB7Y.jpg"
  },
  {
    "id": "netflix-elite",
    "slug": "elite",
    "title": "Elite",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "elite"
    ],
    "tmdbId": 76669,
    "year": "2018",
    "rating": 8.009,
    "overview": "Após três jovens da escola pública serem transferidos para um conceituado colégio de elite, o conflito entre classes acaba levando a um assassinato.",
    "poster": "https://image.tmdb.org/t/p/w342/sfC3hM33pCenEjnmuITvhaUKSXU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uU6YW3N11qECNfz18LNGAGg3Uir.jpg"
  },
  {
    "id": "netflix-you",
    "slug": "you",
    "title": "You",
    "altTitles": [
      "voce"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [],
    "tmdbId": 78191,
    "year": "2018",
    "rating": 8.006,
    "overview": "Obsessivo e perigosamente charmoso, ele vai ao extremo para entrar na vida de quem o fascina. Você pode acabar fisgada sem nem perceber. Aí, pode ser tarde demais.",
    "poster": "https://image.tmdb.org/t/p/w342/ivqi64qY0S3ZAimvjlqXLEH7D6W.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/gzOIymABxmetAECXtazEYCpMmfb.jpg"
  },
  {
    "id": "netflix-swat",
    "slug": "swat",
    "title": "S.W.A.T.",
    "altTitles": [
      "swat"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "swat"
    ],
    "tmdbId": 71790,
    "year": "2017",
    "rating": 8,
    "overview": "Dividido entre a corporação e as ruas, o tenente Daniel Harrelson encara a missão de liderar uma unidade do Esquadrão de Armas e Táticas Especiais na comunidade onde cresceu.",
    "poster": "https://image.tmdb.org/t/p/w342/byFarhK0Wxmf9mSOOR9ZQ31sShJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7j4ug9B6JXVeh5HhQjjPScrdj4Z.jpg"
  },
  {
    "id": "netflix-the-good-place",
    "slug": "the-good-place",
    "title": "The Good Place",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "good",
      "place"
    ],
    "tmdbId": 66573,
    "year": "2016",
    "rating": 7.976,
    "overview": "A série é centrada em Eleanor (Kristen Bell), uma mulher do Arizona que descobre, através de uma série intrincada de acontecimentos sobrenaturais que a levam a visitar o pós-vida, que ela não é exatamente uma boa pessoa. Ela decide virar uma nova página e descobrir o que significa, de fato, ser uma pessoa boa ou ruim, e assim recompensar as pessoas pelo seu antigo comportamento.",
    "poster": "https://image.tmdb.org/t/p/w342/qIhsuhoIYR5yTnDta0IL4senbeN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tZmlWeFEMvxrjJhBJJcLNXpSRiG.jpg"
  },
  {
    "id": "netflix-a-sociedade-da-neve",
    "slug": "a-sociedade-da-neve",
    "title": "A Sociedade da Neve",
    "altTitles": [
      "society of the snow"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "sociedade",
      "neve"
    ],
    "tmdbId": 906126,
    "year": "2023",
    "rating": 7.975,
    "overview": "Em 13 de outubro de 1972, o voo 571 da Força Aérea Uruguaia, fretado para levar um time de rúgbi ao Chile, cai em uma geleira no coração da Cordilheira dos Andes.",
    "poster": "https://image.tmdb.org/t/p/w342/7fQTmvKgVGxifieVryqqlxohkoW.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/md848EEPm3dHZOqwGxxTVwH2vu5.jpg"
  },
  {
    "id": "netflix-dahmer",
    "slug": "dahmer",
    "title": "Dahmer",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "dahmer"
    ],
    "tmdbId": 113988,
    "year": "2022",
    "rating": 7.971,
    "overview": "Jeffrey Dahmer drogou, estuprou e matou 17 rapazes, além de devorar parte dos cadáveres. Conheça seu modus operandi e veja entrevistas com seu pai e com sobreviventes dos crimes.",
    "poster": "https://image.tmdb.org/t/p/w342/67ujv4O6AalmGu3UaVSNdcw8juT.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5vUux2vNUTqwCzb7tVcH18XnsF.jpg"
  },
  {
    "id": "netflix-ripley",
    "slug": "ripley",
    "title": "Ripley",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "ripley"
    ],
    "tmdbId": 94028,
    "year": "2024",
    "rating": 7.963,
    "overview": "Um trambiqueiro adentra no mundo da riqueza e do privilégio ao aceitar um trabalho na Itália. Mas, para aproveitar a vida boa, ele precisa criar uma teia de mentiras.",
    "poster": "https://image.tmdb.org/t/p/w342/rpSo8z9alultGVTqQ3dkLEyU8xx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/erpjqVdJLpDQJjsbxaSJmMwvcqd.jpg"
  },
  {
    "id": "netflix-the-witcher",
    "slug": "the-witcher",
    "title": "The Witcher",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "witcher"
    ],
    "tmdbId": 71912,
    "year": "2019",
    "rating": 7.927,
    "overview": "O mutante Geralt de Rívia é um caçador de monstros que luta para encontrar seu lugar num mundo onde as pessoas muitas vezes são mais perversas que as criaturas selvagens.",
    "poster": "https://image.tmdb.org/t/p/w342/uJ1kQWTY1nElMcrrbHtDitbV85K.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/foGkPxpw9h8zln81j63mix5B7m8.jpg"
  },
  {
    "id": "netflix-virgin-river",
    "slug": "virgin-river",
    "title": "Virgin River",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "virgin",
      "river"
    ],
    "tmdbId": 88324,
    "year": "2019",
    "rating": 7.921,
    "overview": "Uma enfermeira se muda de Los Angeles para uma cidadezinha no norte da Califórnia em busca de um recomeço. Mas a nova vida vai ser bem diferente do que ela imagina.",
    "poster": "https://image.tmdb.org/t/p/w342/o3p55Ipc3lk42n8EHJzRm1kUCjw.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/m1nuMHBCiNy6pMGzRAdH5frNesN.jpg"
  },
  {
    "id": "netflix-sandman",
    "slug": "sandman",
    "title": "Sandman",
    "altTitles": [
      "the sandman"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "sandman"
    ],
    "tmdbId": 90802,
    "year": "2022",
    "rating": 7.873,
    "overview": "Após anos aprisionado, Morpheus, o Rei dos Sonhos, embarca em uma jornada entre mundos para recuperar o que lhe foi roubado e restaurar seu poder.",
    "poster": "https://image.tmdb.org/t/p/w342/5k1PlMiep3mg1BwIc7P4RZlu3WI.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/i8taDLjpF8cCbp53N8kOFt1LSkW.jpg"
  },
  {
    "id": "netflix-professor-polvo",
    "slug": "professor-polvo",
    "title": "Professor Polvo",
    "altTitles": [
      "my octopus teacher"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "professor",
      "polvo"
    ],
    "tmdbId": 682110,
    "year": "2020",
    "rating": 7.872,
    "overview": "Em uma floresta subaquática na África do Sul, um cineasta desenvolve uma amizade improvável com um polvo e descobre mais sobre os mistérios do mundo submarino.",
    "poster": "https://image.tmdb.org/t/p/w342/fQICeppytmblDIZeDZZpiodn1VX.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sW7VOrkHKYIeV9PaYc5IqGU2XK8.jpg"
  },
  {
    "id": "netflix-nimona",
    "slug": "nimona",
    "title": "Nimona",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "nimona"
    ],
    "tmdbId": 961323,
    "year": "2023",
    "rating": 7.864,
    "overview": "Acusado de um crime trágico, um cavaleiro pede ajuda a uma adolescente para conseguir provar sua inocência. Mas o que acontecerá se ela for o monstro que ele jurou matar?",
    "poster": "https://image.tmdb.org/t/p/w342/4dcysbDOOvgBVxatQjJ89gbGpMT.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sidvlo7V8VMyskNKGwua0Tarbol.jpg"
  },
  {
    "id": "netflix-a-familia-mitchell",
    "slug": "a-familia-mitchell",
    "title": "A Família Mitchell",
    "altTitles": [
      "mitchells vs machines"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "família",
      "mitchell"
    ],
    "tmdbId": 501929,
    "year": "2021",
    "rating": 7.843,
    "overview": "Katie Mitchell é aceita na faculdade de cinema dos seus sonhos e seu pai decide aproveitar para realizar uma viagem em família para levá-la à universidade. Porém, seus planos são interrompidos por uma revolução robótica e agora os Mitchells terão que unir forças em família para trabalhar juntos para salvar o mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/k1p10mLm1uM1jqR7RlzB0SalD00.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vsZLf5uog08pAnfsMuDWrsLWUUF.jpg"
  },
  {
    "id": "netflix-glass-onion",
    "slug": "glass-onion",
    "title": "Glass Onion",
    "altTitles": [
      "knives out 2"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "glass",
      "onion"
    ],
    "tmdbId": 546554,
    "year": "2019",
    "rating": 7.839,
    "overview": "Após comemorar 85 anos de idade, o famoso escritor de histórias policiais Harlan Thrombey é encontrado morto dentro de sua propriedade. Logo, o detetive Benoit Blanc é contratado para investigar o caso e descobre que, entre os funcionários misteriosos e a família conflituosa de Harlan, todos podem ser considerados suspeitos do crime.",
    "poster": "https://image.tmdb.org/t/p/w342/9H8PNc4JJRjPnfSh8gGukD0CbqQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4HWAQu28e2yaWrtupFPGFkdNU7V.jpg"
  },
  {
    "id": "netflix-historia-de-um-casamento",
    "slug": "historia-de-um-casamento",
    "title": "História de um Casamento",
    "altTitles": [
      "marriage story"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "casamento"
    ],
    "tmdbId": 492188,
    "year": "2019",
    "rating": 7.733,
    "overview": "Nicole e seu marido Charlie estão passando por muitos problemas e decidem se divorciar. Os dois concordam em não contratar advogados para tratar do divórcio, mas Nicole muda de ideia após receber a indicação de Nora Fanshaw, especialista no assunto. Surpreso com a decisão da agora ex-esposa, Charlie precisa encontrar um advogado para tratar da custódia do filho deles, o pequeno Henry.",
    "poster": "https://image.tmdb.org/t/p/w342/LaZ5rwaMvVH20J8O2Nu9uuXGI5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wDwQXLDUuiEaaiuWIDBpbqnwYGX.jpg"
  },
  {
    "id": "netflix-lupin",
    "slug": "lupin",
    "title": "Lupin",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "lupin"
    ],
    "tmdbId": 96677,
    "year": "2021",
    "rating": 7.702,
    "overview": "Inspirado pelas aventuras de Arsène Lupin, o ladrão gentil Assane Diop quer se vingar de uma família rica por uma injustiça cometida contra o pai dele.",
    "poster": "https://image.tmdb.org/t/p/w342/sOUWRai0215iUSMackrZx3Y1j05.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aY7zv2pfk9H0QxaaL3PBjvalbKQ.jpg"
  },
  {
    "id": "netflix-o-agente-noturno",
    "slug": "o-agente-noturno",
    "title": "O Agente Noturno",
    "altTitles": [
      "the night agent"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "agente",
      "noturno"
    ],
    "tmdbId": 129552,
    "year": "2023",
    "rating": 7.7,
    "overview": "A série acompanha um agente de baixo escalão do FBI que trabalha no porão da Casa Branca, a postos para atender um telefone que nunca toca. Até que um dia, ele recebe uma ligação que acaba revelando uma perigosa conspiração contra o governo dos Estados Unidos.",
    "poster": "https://image.tmdb.org/t/p/w342/cFW7wVaStAOeI4WUKdHRtx0zx1g.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/gklrevVndG98GHGDwfm8y8kxESo.jpg"
  },
  {
    "id": "netflix-os-sete-de-chicago",
    "slug": "os-sete-de-chicago",
    "title": "Os Sete de Chicago",
    "altTitles": [
      "the trial of the chicago 7"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "sete",
      "chicago"
    ],
    "tmdbId": 556984,
    "year": "2020",
    "rating": 7.7,
    "overview": "O que era para ser um protesto pacífico se transformou em um confronto violento com a polícia, e o resultado foi um dos julgamentos mais famosos da história.",
    "poster": "https://image.tmdb.org/t/p/w342/xvJJmdHVmOOn258tkCe6z83AYuP.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/v8Nf6Y1qL1Q3PWTBezXNPPaXqza.jpg"
  },
  {
    "id": "netflix-altered-carbon",
    "slug": "altered-carbon",
    "title": "Altered Carbon",
    "altTitles": [],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "altered",
      "carbon"
    ],
    "tmdbId": 68421,
    "year": "2018",
    "rating": 7.641,
    "overview": "Após 250 anos no gelo, ele retorna em um novo corpo com uma missão: solucionar um complexo mistério e conquistar sua liberdade.",
    "poster": "https://image.tmdb.org/t/p/w342/66rKwpSexUZ3yTv5lBS1bjU4Ykk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/A6I3M4MIA2Pi2gS6vGdg2eVlVXT.jpg"
  },
  {
    "id": "netflix-roma",
    "slug": "roma",
    "title": "Roma",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "roma"
    ],
    "tmdbId": 426426,
    "year": "2018",
    "rating": 7.621,
    "overview": "Na década de 1970, uma jovem trabalhadora doméstica indígena Cleodegaria \"Cleo\" Gutiérrez trabalha para uma família abastada de classe média do bairro de Roma, Cidade do México. À medida que as lutas domésticas e as restrições da hierarquia social se desdobram em meio a um pano de fundo de poderosos terremotos, revoltas estudantis e agitação política, a família luta para permanecer unida enquanto essas forças ameaçam separá-los.",
    "poster": "https://image.tmdb.org/t/p/w342/veWGVw33lnifG10fpkz3QmimVaI.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/zl9uqCl5iUSb50sTk2BPzw6bJnU.jpg"
  },
  {
    "id": "netflix-tick-tick-boom",
    "slug": "tick-tick-boom",
    "title": "Tick Tick Boom",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "tick",
      "tick",
      "boom"
    ],
    "tmdbId": 537116,
    "year": "2021",
    "rating": 7.603,
    "overview": "Prestes a fazer 30 anos, o compositor Jonathan Larson reluta para levar adiante seu sonho de escrever um grande musical.",
    "poster": "https://image.tmdb.org/t/p/w342/DPmfcuR8fh8ROYXgdjrAjSGA0o.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rKe3MR2u4ZZ0y9uKivzKJRrqBCe.jpg"
  },
  {
    "id": "netflix-emily-em-paris",
    "slug": "emily-em-paris",
    "title": "Emily em Paris",
    "altTitles": [
      "emily in paris"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "emily",
      "paris"
    ],
    "tmdbId": 82596,
    "year": "2020",
    "rating": 7.589,
    "overview": "Novas paixões, novas roupas... Nova Emily? Uma impetuosa especialista em marketing conquista o emprego dos sonhos em Paris, ganhando independência na vida e no amor.",
    "poster": "https://image.tmdb.org/t/p/w342/2QeSY4fkl3tKRAg3HEiTHxSJg8j.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jXTZaHarR9TZiMoQwiQWsGYXqnS.jpg"
  },
  {
    "id": "netflix-o-irlandes",
    "slug": "o-irlandes",
    "title": "O Irlandês",
    "altTitles": [
      "the irishman"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "irlandês"
    ],
    "tmdbId": 398978,
    "year": "2019",
    "rating": 7.575,
    "overview": "Frank Sheeran é um veterano de guerra cheio de condecorações que concilia a vida de caminhoneiro com a de assassino de aluguel número um da máfia. Promovido a líder sindical, ele torna-se o principal suspeito quando o mais famoso ex-presidente da associação desaparece misteriosamente.",
    "poster": "https://image.tmdb.org/t/p/w342/9H1XgBZFoVnh7nSibGWZcJMOL6C.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1RDto0tLo8Fhq7OcwgDaM7nECb7.jpg"
  },
  {
    "id": "netflix-a-queda-da-casa-de-usher",
    "slug": "a-queda-da-casa-de-usher",
    "title": "A Queda da Casa de Usher",
    "altTitles": [
      "fall of the house of usher"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "usher",
      "queda"
    ],
    "tmdbId": 157065,
    "year": "2023",
    "rating": 7.56,
    "overview": "Para proteger a fortuna e o futuro, um casal de irmãos constrói uma dinastia familiar que começa a ruir quando cada um dos herdeiros morre misteriosamente.",
    "poster": "https://image.tmdb.org/t/p/w342/b5MzNAgs1baKi32ln3yQoaKIsgZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4qDlkEAKFb4pgIUbeJMLyHX2Xym.jpg"
  },
  {
    "id": "netflix-la-casa-de-papel",
    "slug": "la-casa-de-papel",
    "title": "La Casa de Papel",
    "altTitles": [
      "money heist"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "casa",
      "papel"
    ],
    "tmdbId": 146176,
    "year": "2023",
    "rating": 7.546,
    "overview": "Berlim se encontra com um grupo em Paris para planejar uma de suas missões mais ambiciosas: roubar 44 milhões de euros em joias em uma noite.",
    "poster": "https://image.tmdb.org/t/p/w342/aOv5c4PJmQn3sBdrGVThVIyxQpH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wJxZLiPbXrU601c6e9A6kYLejso.jpg"
  },
  {
    "id": "netflix-missa-maldita",
    "slug": "missa-maldita",
    "title": "Missa Maldita",
    "altTitles": [
      "midnight mass"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "missa",
      "maldita",
      "midnight",
      "mass"
    ],
    "tmdbId": 97400,
    "year": "2021",
    "rating": 7.53,
    "overview": "A chegada de um jovem sacerdote carismático traz milagres, mistérios e um fervor religioso renovado a uma cidade moribunda e desesperada por fé.",
    "poster": "https://image.tmdb.org/t/p/w342/rka8ibtD6HayiEJmb6rns47lyAL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/YauN3gyvgqktYhze4gXPWuoZBY.jpg"
  },
  {
    "id": "netflix-para-todos-os-garotos",
    "slug": "para-todos-os-garotos",
    "title": "Para Todos os Garotos",
    "altTitles": [
      "to all the boys"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "todos",
      "garotos"
    ],
    "tmdbId": 614409,
    "year": "2021",
    "rating": 7.5,
    "overview": "Lara Jean Covey está prestes a se formar e iniciar uma nova fase de sua vida. Durante duas viagens marcantes, ela começa a avaliar como ficará sua relação com a família, os amigos e o namorado após a formatura.",
    "poster": "https://image.tmdb.org/t/p/w342/zZ6rR0kXKlBRXGYjOTJx8j82sqs.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qjhcTGnjxYJqwBGlDzZkYWmne6e.jpg"
  },
  {
    "id": "netflix-para-todos-os-garotos",
    "slug": "para-todos-os-garotos",
    "title": "Para Todos os Garotos que Já Amei",
    "altTitles": [
      "to all the boys"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "garotos",
      "amei"
    ],
    "tmdbId": 614409,
    "year": "2021",
    "rating": 7.5,
    "overview": "Lara Jean Covey está prestes a se formar e iniciar uma nova fase de sua vida. Durante duas viagens marcantes, ela começa a avaliar como ficará sua relação com a família, os amigos e o namorado após a formatura.",
    "poster": "https://image.tmdb.org/t/p/w342/zZ6rR0kXKlBRXGYjOTJx8j82sqs.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qjhcTGnjxYJqwBGlDzZkYWmne6e.jpg"
  },
  {
    "id": "netflix-o-problema-dos-3-corpos",
    "slug": "o-problema-dos-3-corpos",
    "title": "O Problema dos 3 Corpos",
    "altTitles": [
      "3 body problem"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "problema",
      "3",
      "corpos"
    ],
    "tmdbId": 108545,
    "year": "2024",
    "rating": 7.456,
    "overview": "Um grupo de cientistas faz descobertas revolucionárias ao longo das décadas. Ao mesmo tempo, as leis da ciência começam a cair por terra.",
    "poster": "https://image.tmdb.org/t/p/w342/rqMYUtyrRJrZ1zKQvBfLgPh1c0T.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ciizJ9Okzt9tBBGK7Q3T14LFT2j.jpg"
  },
  {
    "id": "netflix-o-dilema-das-redes",
    "slug": "o-dilema-das-redes",
    "title": "O Dilema das Redes",
    "altTitles": [
      "the social dilemma"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "dilema",
      "redes"
    ],
    "tmdbId": 656690,
    "year": "2020",
    "rating": 7.453,
    "overview": "Especialistas em tecnologia e profissionais da área fazem um alerta: as redes sociais podem ter um impacto devastador sobre a democracia e a humanidade.",
    "poster": "https://image.tmdb.org/t/p/w342/4ca2o7afA65YGoc9hsmwobIivsQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iYqoT9VBGdGTuLl3cjfbG7ZXDkP.jpg"
  },
  {
    "id": "amazon-o-labirinto-do-fauno",
    "slug": "o-labirinto-do-fauno",
    "title": "O Labirinto do Fauno",
    "altTitles": [
      "pan's labyrinth"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "labirinto",
      "fauno"
    ],
    "tmdbId": 1425746,
    "year": "2024",
    "rating": 9,
    "overview": "",
    "poster": "https://image.tmdb.org/t/p/w342/859FANm1QhZSpCKd5kLEMRkcT5U.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/KPnlNg96bvFDmZsgTf0oQ60fMc.jpg"
  },
  {
    "id": "amazon-invencivel",
    "slug": "invencivel",
    "title": "Invencível",
    "altTitles": [
      "invincible"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "invencível"
    ],
    "tmdbId": 95557,
    "year": "2021",
    "rating": 8.628,
    "overview": "Uma animação de super-heróis para adultos e conta a história de Mark Grayson, de 17 anos, um cara como qualquer outro de sua idade, exceto que seu pai é o super-herói mais poderoso do planeta, Omni-Man. Porém, à medida que Mark desenvolve seus próprios poderes, ele descobre que o legado de seu pai pode não ser tão heroico quanto parece.",
    "poster": "https://image.tmdb.org/t/p/w342/qhb7RWU9ad9a5m3HbeRRXzjaMXf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9qrroces8C6R9aKr08hACNPVXdZ.jpg"
  },
  {
    "id": "amazon-hazbin-hotel",
    "slug": "hazbin-hotel",
    "title": "Hazbin Hotel",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "hazbin",
      "hotel"
    ],
    "tmdbId": 94954,
    "year": "2024",
    "rating": 8.593,
    "overview": "Charlie Morningstar, a Princesa do Inferno, tem dificuldades para convencer anjos e demônios de que toda alma pode ser redimida. Cante e xingue junto nessa comédia animada e musical para maiores sobre segundas chances.",
    "poster": "https://image.tmdb.org/t/p/w342/hdOeeEVqhvKR5sh8gDAp4WwSiHQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/muz4zF9dk1h7b9Nu8duOysvX823.jpg"
  },
  {
    "id": "amazon-the-office",
    "slug": "the-office",
    "title": "The Office",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "office"
    ],
    "tmdbId": 2316,
    "year": "2005",
    "rating": 8.592,
    "overview": "Michael Scott é o egocêntrico, insensível e incompetente gerente regional de uma subsidiária da Dunder Mifflin Paper Company. Michael acredita ser o cara mais engraçado do escritório, uma fonte de sabedoria para negócios e o melhor amigo de seus funcionários. Ele nem desconfia que a sua equipe o tolera apenas pelo fato dele assinar o contracheque deles. Sem saber o que os seus funcionários pensam a seu respeito, Michael acaba sempre alternando decisões absurdas ou patéticas, mas sempre hilárias.",
    "poster": "https://image.tmdb.org/t/p/w342/e7BoS8uUnew9ioS6reqtK9matqy.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mLyW3UTgi2lsMdtueYODcfAB9Ku.jpg"
  },
  {
    "id": "amazon-house-md",
    "slug": "house-md",
    "title": "House MD",
    "altTitles": [
      "dr house"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "house"
    ],
    "tmdbId": 1408,
    "year": "2004",
    "rating": 8.567,
    "overview": "O Dr. Gregory House é um médico genial, mas misantropo e viciado em analgésicos, que lidera uma equipe de diagnóstico em um hospital de Nova Jersey. Com um cinismo implacável e métodos pouco ortodoxos, ele trata os casos médicos mais raros e misteriosos como quebra-cabeças complexos, desafiando todos ao seu redor para chegar à verdade.",
    "poster": "https://image.tmdb.org/t/p/w342/lW7MvZ4m49IUj2UrUu4z0xVVl81.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/r0Q6eeN9L1ORL9QsV0Sg8ZV3vnv.jpg"
  },
  {
    "id": "amazon-clarksons-farm",
    "slug": "clarksons-farm",
    "title": "Clarkson's Farm",
    "altTitles": [
      "fazenda clarkson"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "clarkson",
      "farm"
    ],
    "tmdbId": 117648,
    "year": "2021",
    "rating": 8.5,
    "overview": "Siga Jeremy Clarkson enquanto ele tenta administrar uma fazenda no interior.",
    "poster": "https://image.tmdb.org/t/p/w342/soOXeA6OZLB597PkjvXwmgQNMdM.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/i50h4Gz6e9BMGak5l6gg5qfIjcv.jpg"
  },
  {
    "id": "amazon-interestelar",
    "slug": "interestelar",
    "title": "Interestelar",
    "altTitles": [
      "interstellar"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "interestelar"
    ],
    "tmdbId": 157336,
    "year": "2014",
    "rating": 8.47,
    "overview": "As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado de Brand, Jenkins e Doyle, ele seguirá em busca de um novo lar.",
    "poster": "https://image.tmdb.org/t/p/w342/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2ssWTSVklAEc98frZUQhgtGHx7s.jpg"
  },
  {
    "id": "amazon-homem-aranha-no-aranhaverso",
    "slug": "homem-aranha-no-aranhaverso",
    "title": "Homem-Aranha no Aranhaverso",
    "altTitles": [
      "spider verse"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "homem-aranha",
      "aranhaverso"
    ],
    "tmdbId": 569094,
    "year": "2023",
    "rating": 8.333,
    "overview": "Miles Morales retorna para o próximo capítulo da saga do Aranhaverso, uma aventura épica que transportará o Homem-Aranha em tempo integral e amigável do bairro do Brooklyn através do Multiverso para unir forças com Gwen Stacy e uma nova equipe de Homens-Aranha para enfrentar com um vilão mais poderoso do que qualquer coisa que eles já encontraram.",
    "poster": "https://image.tmdb.org/t/p/w342/4CwKj1fw33BXYzxvrpM3GlAhK4L.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9xfDWXAUbFXQK585JvByT5pEAhe.jpg"
  },
  {
    "id": "amazon-supernatural",
    "slug": "supernatural",
    "title": "Supernatural",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "supernatural"
    ],
    "tmdbId": 1622,
    "year": "2005",
    "rating": 8.306,
    "overview": "Os irmãos Dean e Sam vasculham o país em busca de atividades paranormais, brigando com demônios, fantasmas e monstros no caminho.",
    "poster": "https://image.tmdb.org/t/p/w342/eK4gEBWNGJoxCD67KFKzaKfSzWU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lirPqYLTtd6XZqGn4cS1wiesTq0.jpg"
  },
  {
    "id": "amazon-the-vampire-diaries",
    "slug": "the-vampire-diaries",
    "title": "The Vampire Diaries",
    "altTitles": [
      "diarios de um vampiro"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "vampire",
      "diaries"
    ],
    "tmdbId": 18165,
    "year": "2009",
    "rating": 8.305,
    "overview": "Elena tenta sobreviver entre os seres sobrenaturais que vivem em segredo. Ela se apaixona pelo misterioso Stefan, mas o retorno do seu irmão, Damon, ameaça essa paixão.",
    "poster": "https://image.tmdb.org/t/p/w342/lcGQaSrWkkxGuh0JJqyN2TkuNqb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cJYLon9ejKJV7ua03ab8Tj9u067.jpg"
  },
  {
    "id": "amazon-fleabag",
    "slug": "fleabag",
    "title": "Fleabag",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "fleabag"
    ],
    "tmdbId": 67070,
    "year": "2016",
    "rating": 8.3,
    "overview": "Uma mulher autêntica que tenta retomar sua vida, enquanto rejeita a ajuda de qualquer um que tente se manter ao seu lado durante a sua crise.",
    "poster": "https://image.tmdb.org/t/p/w342/27vEYsRKa3eAniwmoccOoluEXQ1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hXdQ4MWsEOX6qg6VydKrLb3YJ4g.jpg"
  },
  {
    "id": "amazon-fargo",
    "slug": "fargo",
    "title": "Fargo",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "fargo"
    ],
    "tmdbId": 60622,
    "year": "2014",
    "rating": 8.3,
    "overview": "Billy Bob Thornton será Lorne Malvo, um homem sem raízes e manipulador, que conhece e muda para sempre a vida de um vendedor de seguros de uma pequena cidade, Lester Nygaard, interpretado por Martin Freeman. Colin Hanks será o policial Gus Grimly, pai solteiro que deve escolher entre sua segurança pessoal e seu dever como agente da lei, ao ficar cara a cara com um assassino. Allison Tolman será Molly Solverson, uma ambiciosa policial.",
    "poster": "https://image.tmdb.org/t/p/w342/zu3rkBP4uxmfyOHstfr6KbEGUdz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4jrSbRpLqpvYJtLKncaxZVC47EW.jpg"
  },
  {
    "id": "amazon-grimm",
    "slug": "grimm",
    "title": "Grimm",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "grimm"
    ],
    "tmdbId": 39351,
    "year": "2011",
    "rating": 8.263,
    "overview": "Nick Burkhardt é um detetive de homicídios que recebe novas responsabilidades após descobrir que é descendente de Grimm, uma sociedade secreta. O seu principal objetivo é conseguir encontrar um ponto de equilíbrio entre a vida real e a mitologia. A nova rotina traz desafios e perigos, sobretudo à noiva de Nick, Juliette Silverton, e ao colega de trabalho, Hank Griffin.",
    "poster": "https://image.tmdb.org/t/p/w342/5hC8CertBqHbXNPcfm1LZ18VcjD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/oS3nip9GGsx5A7vWp8A1cazqJlF.jpg"
  },
  {
    "id": "amazon-mr-robot",
    "slug": "mr-robot",
    "title": "Mr Robot",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "robot"
    ],
    "tmdbId": 62560,
    "year": "2015",
    "rating": 8.261,
    "overview": "Elliot é um jovem programador que sofre de uma desordem que o torna anti-social. Acreditando que a única forma de se conectar com as pessoas é hackeando suas vidas, ele alia seu conhecimento ao fato de trabalhar em uma empresa de segurança online para proteger aqueles que ele ama daqueles que tentam, de alguma forma, prejudicá-los. Suas atividades chamam a atenção de Mr. Robot, um misterioso anarquista que convida Elliot a fazer parte de uma organização que atua na ilegalidade com o objetivo de derrubar as corporações americanas.",
    "poster": "https://image.tmdb.org/t/p/w342/1uS9tYSYXU5jshLx2WlnOLZrMgD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hZOuVkhAWX9viLJuaIsMh8cM3Jz.jpg"
  },
  {
    "id": "amazon-mr-robot",
    "slug": "mr-robot",
    "title": "Mr. Robot",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "mr",
      "robot"
    ],
    "tmdbId": 62560,
    "year": "2015",
    "rating": 8.261,
    "overview": "Elliot é um jovem programador que sofre de uma desordem que o torna anti-social. Acreditando que a única forma de se conectar com as pessoas é hackeando suas vidas, ele alia seu conhecimento ao fato de trabalhar em uma empresa de segurança online para proteger aqueles que ele ama daqueles que tentam, de alguma forma, prejudicá-los. Suas atividades chamam a atenção de Mr. Robot, um misterioso anarquista que convida Elliot a fazer parte de uma organização que atua na ilegalidade com o objetivo de derrubar as corporações americanas.",
    "poster": "https://image.tmdb.org/t/p/w342/1uS9tYSYXU5jshLx2WlnOLZrMgD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hZOuVkhAWX9viLJuaIsMh8cM3Jz.jpg"
  },
  {
    "id": "amazon-hannibal",
    "slug": "hannibal",
    "title": "Hannibal",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "hannibal"
    ],
    "tmdbId": 40008,
    "year": "2013",
    "rating": 8.251,
    "overview": "Will Graham é um investigador do FBI que tem o talento de se inserir nas cenas dos crimes e visualizar exatamente o que aconteceu. Tal capacidade ajuda a solucionar muitos casos, mas também exige muito dele, obrigando-o a consultar o psiquiatra Hannibal Lecter. Mal sabe Graham, que o dr. Lecter não é um psiquiatra comum.",
    "poster": "https://image.tmdb.org/t/p/w342/pbV2eLnKSIm1epSZt473UYfqaeZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vlG182ZY2WMzD5bjFZNnhyvv5V4.jpg"
  },
  {
    "id": "amazon-dexter",
    "slug": "dexter",
    "title": "Dexter",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "dexter"
    ],
    "tmdbId": 1405,
    "year": "2006",
    "rating": 8.229,
    "overview": "Renomado funcionário da Polícia de Miami, Dexter esconde de todos uma segunda identidade: ele é um assassino em série que mata os criminosos que a polícia não consegue prender.",
    "poster": "https://image.tmdb.org/t/p/w342/f1nV5NBIFwfQLw5g8FVrdt90FAy.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nS5ZSmrX92lu1GYAlXZye1mkDfd.jpg"
  },
  {
    "id": "amazon-this-is-us",
    "slug": "this-is-us",
    "title": "This Is Us",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "this"
    ],
    "tmdbId": 67136,
    "year": "2016",
    "rating": 8.227,
    "overview": "A série acompanha um grupo de pessoas cujos caminhos se cruzam, fazendo com que as suas histórias se entrelacem de maneira muito peculiar.",
    "poster": "https://image.tmdb.org/t/p/w342/huxmY6Dmzwpv5Q2hnNft0UMK7vf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/frNEERYvgDAThEcCR5FKzggktsR.jpg"
  },
  {
    "id": "amazon-a-lenda-de-vox-machina",
    "slug": "a-lenda-de-vox-machina",
    "title": "A Lenda de Vox Machina",
    "altTitles": [
      "legend of vox machina"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "vox",
      "machina"
    ],
    "tmdbId": 135934,
    "year": "2022",
    "rating": 8.204,
    "overview": "Desordeiros e maltrapilhos, são desajustados que viraram mercenários. O grupo Vox Machina está mais interessado em dinheiro fácil e cerveja barata do que em proteger o reino. Mas quando o reino é ameaçado pelo mal, esses encrenqueiros percebem que são os únicos capazes de restaurar a justiça. O que começou como um serviço simples agora é a história de origem dos mais novos heróis de Exandria.",
    "poster": "https://image.tmdb.org/t/p/w342/hgQ1sQybq3pvdQcaYE18TR3CqRL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xRQNXmR9HG32FJqaRh8TqVUMfTA.jpg"
  },
  {
    "id": "amazon-gato-de-botas-2",
    "slug": "gato-de-botas-2",
    "title": "Gato de Botas 2",
    "altTitles": [
      "puss in boots the last wish"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "gato",
      "botas",
      "2"
    ],
    "tmdbId": 315162,
    "year": "2022",
    "rating": 8.201,
    "overview": "O Gato de Botas descobre que sua paixão pela aventura cobrou seu preço: ele queimou oito de suas nove vidas, deixando-o com apenas uma vida restante. Gato parte em uma jornada épica para encontrar o mítico Último Desejo e restaurar suas nove vidas.",
    "poster": "https://image.tmdb.org/t/p/w342/atJxZfCaQ7kXRFSfbm8cqAKkns7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jr8tSoJGj33XLgFBy6lmZhpGQNu.jpg"
  },
  {
    "id": "amazon-ilha-do-medo",
    "slug": "ilha-do-medo",
    "title": "Ilha do Medo",
    "altTitles": [
      "shutter island"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "ilha",
      "medo"
    ],
    "tmdbId": 11324,
    "year": "2010",
    "rating": 8.2,
    "overview": "No verão de 1954, os agentes judiciais Teddy Daniels (DiCaprio) e Chuck Aule (Ruffalo) foram designados para uma ilha remota do porto de Boston para investigar o desaparecimento de uma perigosa assassina (Mortimer) que estava reclusa no hospital psiquiátrico Ashecliffe, um centro penitenciário para criminosos perturbados dirigido pelo sinistro médico John Cawley. (Kingsley). Logo eles descobrem que o centro guarda muitos segredos e que a ilha esconde algo mais perigoso que os pacientes.",
    "poster": "https://image.tmdb.org/t/p/w342/erl801HYIodoIBGZeFk0GTwCUBh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rbZvGN1A1QyZuoKzhCw8QPmf2q0.jpg"
  },
  {
    "id": "amazon-the-handmaid-s-tale",
    "slug": "the-handmaid-s-tale",
    "title": "The Handmaid's Tale",
    "altTitles": [
      "conto da aia"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "handmaid's",
      "tale"
    ],
    "tmdbId": 69478,
    "year": "2017",
    "rating": 8.145,
    "overview": "Situado em um futuro distópico, uma mulher é forçada a viver como uma concubina sob uma ditadura teocrática fundamentalista. Uma adaptação para a TV do romance de Margaret Atwood.",
    "poster": "https://image.tmdb.org/t/p/w342/eJJvzADsstZAz4tmE5qa3jjPUkF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/atb20IUkdYcZISq3DJ769nc3h1G.jpg"
  },
  {
    "id": "amazon-fallout",
    "slug": "fallout",
    "title": "Fallout",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "fallout"
    ],
    "tmdbId": 106379,
    "year": "2024",
    "rating": 8.121,
    "overview": "Baseada em uma das maiores séries de videogame de todos os tempos, Fallout é a história de quem tem e de quem não tem, em um mundo onde não existe quase nada para se ter. 200 anos após o apocalipse, uma habitante pacífica de um agradável refúgio é forçada a se aventurar na superfície e fica chocada quando descobre a terra devastada que a espera.",
    "poster": "https://image.tmdb.org/t/p/w342/tQRX6GbYooU7kUaarKf5YXDTONy.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cIgHBLTMbcIkS0yvIrUUVVKLdOz.jpg"
  },
  {
    "id": "amazon-mad-men",
    "slug": "mad-men",
    "title": "Mad Men",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [],
    "tmdbId": 1104,
    "year": "2007",
    "rating": 8.115,
    "overview": "Ambientada na Nova York dos anos 60, essa série mostra a realidade de uma agência de publicidade numa época em que a concorrência ferrenha tinha o seu glamour.",
    "poster": "https://image.tmdb.org/t/p/w342/wa7b51oQx1cFPUEMpNsb4b4c6Lu.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/A5lVyejMsP5G7rAJBwU9ug3Wzou.jpg"
  },
  {
    "id": "amazon-the-marvelous-mrs-maisel",
    "slug": "the-marvelous-mrs-maisel",
    "title": "The Marvelous Mrs Maisel",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "marvelous",
      "maisel"
    ],
    "tmdbId": 70796,
    "year": "2017",
    "rating": 8.1,
    "overview": "Miriam Midge Maisel gostaria de levar uma vida comum em Manhattan, mas seu talento como comediante stand-up transforma sua rotina de dona de casa.",
    "poster": "https://image.tmdb.org/t/p/w342/i61vpsczXOfrDbkdyVHo6nSmVfQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vQ77kC1amsZECKIxkUIsMJCtBVp.jpg"
  },
  {
    "id": "amazon-mrs-maisel",
    "slug": "mrs-maisel",
    "title": "The Marvelous Mrs. Maisel",
    "altTitles": [
      "maravilhosa sra maisel"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "maisel",
      "marvelous"
    ],
    "tmdbId": 70796,
    "year": "2017",
    "rating": 8.1,
    "overview": "Miriam Midge Maisel gostaria de levar uma vida comum em Manhattan, mas seu talento como comediante stand-up transforma sua rotina de dona de casa.",
    "poster": "https://image.tmdb.org/t/p/w342/i61vpsczXOfrDbkdyVHo6nSmVfQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vQ77kC1amsZECKIxkUIsMJCtBVp.jpg"
  },
  {
    "id": "amazon-the-summer-i-turned-pretty",
    "slug": "the-summer-i-turned-pretty",
    "title": "The Summer I Turned Pretty",
    "altTitles": [
      "o verao que mudou minha vida"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "summer",
      "turned",
      "pretty"
    ],
    "tmdbId": 194766,
    "year": "2022",
    "rating": 8.098,
    "overview": "Todo verão, Belly e sua família vão pra casa de praia dos Fishers em Cousins. Todo verão é igual... até Belly completar dezesseis anos. Relacionamentos novos surgirão, verdades dolorosas serão reveladas e Belly mudará para sempre. É um verão de primeiro amor, primeira desilusão amorosa e muito crescimento - é o verão em que ela fica bonita.",
    "poster": "https://image.tmdb.org/t/p/w342/49AV6vqypkekwI5kjKTvBokB9n1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jCQV3rHNbgHKo3N4G6CARbVEjPV.jpg"
  },
  {
    "id": "amazon-me-chame-pelo-seu-nome",
    "slug": "me-chame-pelo-seu-nome",
    "title": "Me Chame Pelo Seu Nome",
    "altTitles": [
      "call me by your name"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "chame",
      "pelo",
      "nome"
    ],
    "tmdbId": 398818,
    "year": "2017",
    "rating": 8.092,
    "overview": "O sensível e único filho da família americana com ascendência italiana e francesa Perlman, Elio está enfrentando outro verão preguiçoso na casa de seus pais na bela e lânguida paisagem italiana quando Oliver, um acadêmico que veio ajudar a pesquisa de seu pai, chega.",
    "poster": "https://image.tmdb.org/t/p/w342/qnf5Onsk236CdE5Lff93IX69gHf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fwf4L3r2ZU9ptOB9nOo5nuVLo1i.jpg"
  },
  {
    "id": "amazon-reacher",
    "slug": "reacher",
    "title": "Reacher",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "reacher"
    ],
    "tmdbId": 108978,
    "year": "2022",
    "rating": 8.071,
    "overview": "Quando o policial militar aposentado Jack Reacher é preso por um assassinato que não cometeu, ele se vê no meio de uma trama mortal cheia de policiais corruptos, empresários obscuros e políticos conspiradores. Só com sua inteligência, ele precisa descobrir o que está havendo em Margrave, Geórgia.",
    "poster": "https://image.tmdb.org/t/p/w342/c9JwFbaBWarL9fwo1NSqsiTj7Zh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/voKEhzb4ExOmR0WSvQgLTTqRUEu.jpg"
  },
  {
    "id": "amazon-the-expanse",
    "slug": "the-expanse",
    "title": "The Expanse",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "expanse"
    ],
    "tmdbId": 63639,
    "year": "2015",
    "rating": 8.065,
    "overview": "Duzentos anos no futuro, um detetive interespacial, o capitão de uma nave e uma diplomata antiguerra cruzam seus caminhos após uma jovem desaparecer misteriosamente.",
    "poster": "https://image.tmdb.org/t/p/w342/5vQlVWkIMPhZ88OWchJsgwGEK9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uUwnClwdMA12bpHgeKgkQrbu5Oe.jpg"
  },
  {
    "id": "amazon-parks-and-recreation",
    "slug": "parks-and-recreation",
    "title": "Parks and Recreation",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "parks",
      "recreation"
    ],
    "tmdbId": 8592,
    "year": "2009",
    "rating": 8.036,
    "overview": "Parks and Recreation gira  ao redor de Leslie Knope, uma funcionária do departamento de Parques e  Recreações de Pawnee, Indiana, que leva seu posto muito a sério e tem  como objetivo na vida ser a primeira mulher presidente dos Estados Unidos.",
    "poster": "https://image.tmdb.org/t/p/w342/5onJu1lfvbKgzJ35b2Qjrt2xjSD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/frwl2zBNAl5ZbFDJGoJv0mYo0rF.jpg"
  },
  {
    "id": "amazon-good-omens",
    "slug": "good-omens",
    "title": "Good Omens",
    "altTitles": [
      "bons presagios"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "good",
      "omens"
    ],
    "tmdbId": 71915,
    "year": "2019",
    "rating": 8.002,
    "overview": "Em 2019, o mundo está à beira de um apocalipse enquanto a humanidade se prepara para um julgamento final. Mas ocorrem loucuras - Aziraphale, um anjo um tanto exigente, e Crowley, um demônio, não estão entusiasmados com o fim do mundo, e parecem não encontrar o Anticristo.",
    "poster": "https://image.tmdb.org/t/p/w342/AiIydIuCHY1YDwBSAxSZMpKOJsb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4YIQAV5R2iGY8fGPNsbe77gUu4.jpg"
  },
  {
    "id": "amazon-oppenheimer",
    "slug": "oppenheimer",
    "title": "Oppenheimer",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "oppenheimer"
    ],
    "tmdbId": 872585,
    "year": "2023",
    "rating": 8,
    "overview": "A história do físico americano J. Robert Oppenheimer, seu papel no Projeto Manhattan e no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial, e o quanto isso mudaria a história do mundo para sempre.",
    "poster": "https://image.tmdb.org/t/p/w342/1OsQJEoSXBjduuCvDOlRhoEUaHu.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg"
  },
  {
    "id": "amazon-bosch",
    "slug": "bosch",
    "title": "Bosch",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "bosch"
    ],
    "tmdbId": 60585,
    "year": "2015",
    "rating": 7.91,
    "overview": "Quinze meses após levar o assassino de sua mãe à justiça, Bosch se vê em busca da verdade em duas frentes. Novas provas de um antigo caso faz todos se perguntarem se Bosch plantou provas para condenar o homem errado. E um homicídio em uma farmácia de Hollywood expõe um sofisticado tráfico de opioides, colocando Bosch em um sombrio e perigoso caminho na caça aos assassinos.",
    "poster": "https://image.tmdb.org/t/p/w342/vVwyo9fwHp5zhX96CzpuRBFl2SJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/23S5oKZjlXehjNLEhMQuxjwbyuA.jpg"
  },
  {
    "id": "amazon-questao-de-tempo",
    "slug": "questao-de-tempo",
    "title": "Questão de Tempo",
    "altTitles": [
      "about time"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "questão",
      "tempo"
    ],
    "tmdbId": 122906,
    "year": "2013",
    "rating": 7.907,
    "overview": "Ao completar 21 anos, Tim descobre que pode viajar no tempo e mudar o passado. Depois de usar o poder para conseguir uma namorada, ele precisa lidar com consequências inesperadas.",
    "poster": "https://image.tmdb.org/t/p/w342/uqEzxvGDYNzoQE7rayv7gRXBomt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/einbto9qLXFx9QXxEHylaxDbKPx.jpg"
  },
  {
    "id": "amazon-garota-exemplar",
    "slug": "garota-exemplar",
    "title": "Garota Exemplar",
    "altTitles": [
      "gone girl"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "garota",
      "exemplar"
    ],
    "tmdbId": 210577,
    "year": "2014",
    "rating": 7.9,
    "overview": "Amy Dunne desaparece no dia do seu aniversário de casamento, deixando o marido Nick em apuros. Ele começa a agir descontroladamente, abusando das mentiras, e se torna o suspeito número um da polícia. Com o apoio da sua irmã gêmea, Margo, Nick tenta provar a sua inocência e, ao mesmo tempo, procura descobrir o que aconteceu com Amy.",
    "poster": "https://image.tmdb.org/t/p/w342/54nI3vSKlPp42WhJmKVRdmMbkzl.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iWak7wT0j6ycCc8lKr4NBz9c7n5.jpg"
  },
  {
    "id": "amazon-la-la-land",
    "slug": "la-la-land",
    "title": "La La Land",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "land"
    ],
    "tmdbId": 313369,
    "year": "2016",
    "rating": 7.898,
    "overview": "O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.",
    "poster": "https://image.tmdb.org/t/p/w342/AvMietG6xuobpSSdmVnKuTjv4bL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg"
  },
  {
    "id": "amazon-o-rei-do-show",
    "slug": "o-rei-do-show",
    "title": "O Rei do Show",
    "altTitles": [
      "greatest showman"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "show"
    ],
    "tmdbId": 316029,
    "year": "2017",
    "rating": 7.862,
    "overview": "De origem humilde e desde a infância sonhando com um mundo mágico, P.T. Barnum desafia as barreiras sociais se casando com a filha do patrão do pai e dá o pontapé inicial na realização de seu maior desejo abrindo uma espécie de museu de curiosidades. O empreendimento fracassa, mas ele logo vislumbra uma ousada saída: produzir um grande show estrelado por freaks, fraudes, bizarrices e rejeitados de todos os tipos.",
    "poster": "https://image.tmdb.org/t/p/w342/NUce1PoO7j0CLLwUQRrBbyKveg.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lrNKm3HNvGdZoAfiBKu7b04FLHN.jpg"
  },
  {
    "id": "amazon-upload",
    "slug": "upload",
    "title": "Upload",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "upload"
    ],
    "tmdbId": 86248,
    "year": "2020",
    "rating": 7.785,
    "overview": "Em 2033, pessoas que estão próximas da morte podem fazer o \"upload\" em hotéis de realidade virtual de 6 empresas. Nora, mora no Brooklyn e trabalha com atendimento ao cliente para \"Lakeview\", empresa de pós-vida digital. Quando nathan, um programador playboy, sofre um acidente de carro, sua namorada faz o \"upload\" dele no mundo virtual de Nora.",
    "poster": "https://image.tmdb.org/t/p/w342/6TPGDrU9MyWbn2TpggJphVAVXiq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/moH3PdysmUl8vrsYVM4l2ZZiRAd.jpg"
  },
  {
    "id": "amazon-duna",
    "slug": "duna",
    "title": "Duna",
    "altTitles": [
      "dune"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "duna"
    ],
    "tmdbId": 438631,
    "year": "2021",
    "rating": 7.779,
    "overview": "Em um futuro distante, planetas são comandados por casas nobres que fazem parte de um império feudal intergalático. Paul Atreides é um jovem cuja família toma o controle do planeta deserto Arrakis, também conhecido como Duna. A única fonte da especiaria Melange, a substância mais importante do cosmos, Arrakis se mostra ser um planeta nem um pouco fácil de governar.",
    "poster": "https://image.tmdb.org/t/p/w342/uzERcfV2rSHNhW5eViQiO9hNiA7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qVgZu5BTx6pu4owCvVOm4zjTfOi.jpg"
  },
  {
    "id": "amazon-a-baleia",
    "slug": "a-baleia",
    "title": "A Baleia",
    "altTitles": [
      "the whale"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "baleia"
    ],
    "tmdbId": 785084,
    "year": "2022",
    "rating": 7.775,
    "overview": "Um professor de inglês recluso que sofre de obesidade severa tenta se reconectar com sua filha adolescente distante para uma última chance de redenção.",
    "poster": "https://image.tmdb.org/t/p/w342/toM19i88jddoMa3mSBeg9T6E9MO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/46FRuCeAn6TrS4F1P4F9zhyCpyo.jpg"
  },
  {
    "id": "amazon-shrek",
    "slug": "shrek",
    "title": "Shrek",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "shrek"
    ],
    "tmdbId": 808,
    "year": "2001",
    "rating": 7.759,
    "overview": "Há muito tempo, em um pântano muito remoto, vivia um ogro feroz chamado Shrek. Um dia, sua solidão é interrompida por uma invasão de personagens surpreendentes. Há pequenos ratos cegos em sua comida, um enorme e péssimo lobo em sua cama, três porquinhos sem teto e outros seres que foram deportados de suas terras pelo maligno lorde Farquaad. Para salvar seu território, Shrek faz um pacto com Farquaad e parte em uma jornada para fazer a linda princesa Fiona concordar em ser a noiva do Senhor. Em uma missão tão importante, ele é acompanhado por um burro divertido, pronto para fazer qualquer coisa por Shrek: tudo, exceto ficar em silêncio.",
    "poster": "https://image.tmdb.org/t/p/w342/wxeqfC221YMptRRdzxlijAh7q8l.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/40Wtp7kMG6mZ4d5T1jfrd8qrvD4.jpg"
  },
  {
    "id": "amazon-tudo-em-todo-lugar",
    "slug": "tudo-em-todo-lugar",
    "title": "Tudo em Todo o Lugar ao Mesmo Tempo",
    "altTitles": [
      "everything everywhere all at once"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "tudo",
      "todo",
      "lugar"
    ],
    "tmdbId": 545611,
    "year": "2022",
    "rating": 7.719,
    "overview": "Uma imigrante chinesa parte rumo a uma aventura onde, sozinha, precisará salvar o mundo, explorando outros universos e outras vidas que poderia ter vivido. Contudo, as coisas se complicam quando ela fica presa nessa infinidade de possibilidades sem conseguir retornar para casa.",
    "poster": "https://image.tmdb.org/t/p/w342/2dSZQGwijlXvMSyuGe0FSgrXnv0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg"
  },
  {
    "id": "amazon-past-lives",
    "slug": "past-lives",
    "title": "Past Lives",
    "altTitles": [
      "vidas passadas"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "past",
      "lives"
    ],
    "tmdbId": 666277,
    "year": "2023",
    "rating": 7.713,
    "overview": "Nora e Hae Sung são amigos de infância profundamente conectados que se separam quando a família de Nora emigra da Coreia do Sul. Duas décadas depois, se reencontram em Nova York numa semana fatídica enquanto confrontam noções de destino, amor e as escolhas que fazem uma vida, neste romance moderno comovente.",
    "poster": "https://image.tmdb.org/t/p/w342/toSI71gFF11VnLfz2uiNx6jjNUF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7HR38hMBl23lf38MAN63y4pKsHz.jpg"
  },
  {
    "id": "amazon-john-wick-4",
    "slug": "john-wick-4",
    "title": "John Wick 4",
    "altTitles": [
      "john wick chapter 4"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "john",
      "wick",
      "4"
    ],
    "tmdbId": 603692,
    "year": "2023",
    "rating": 7.706,
    "overview": "Com o preço por sua cabeça cada vez maior, John Wick leva sua luta contra a alta mesa global enquanto procura os jogadores mais poderosos do submundo, de Nova York a Paris, de Osaka a Berlim.",
    "poster": "https://image.tmdb.org/t/p/w342/rXTqhpkpj6E0YilQ49PK1SSqLhm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7I6VUdPj6tQECNHdviJkUHD2u89.jpg"
  },
  {
    "id": "amazon-o-som-do-silencio",
    "slug": "o-som-do-silencio",
    "title": "O Som do Silêncio",
    "altTitles": [
      "sound of metal"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "silêncio"
    ],
    "tmdbId": 502033,
    "year": "2020",
    "rating": 7.698,
    "overview": "Um jovem baterista teme por seu futuro quando percebe que está gradualmente ficando surdo. Duas paixões estão em jogo: a música e sua namorada, que é integrante da mesma banda de heavy metal. Essa mudança drástica acarreta em muita tensão e angústia na vida do baterista, atormentado lentamente pelo silêncio.",
    "poster": "https://image.tmdb.org/t/p/w342/gjKlQJlWtP61ZN4WKbcSVHzjqq8.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7b5R8FfGUzlxfhOkPpL3xyIeuyF.jpg"
  },
  {
    "id": "amazon-sound-of-metal",
    "slug": "sound-of-metal",
    "title": "Sound of Metal",
    "altTitles": [
      "som do metal"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "sound",
      "metal"
    ],
    "tmdbId": 502033,
    "year": "2020",
    "rating": 7.698,
    "overview": "Um jovem baterista teme por seu futuro quando percebe que está gradualmente ficando surdo. Duas paixões estão em jogo: a música e sua namorada, que é integrante da mesma banda de heavy metal. Essa mudança drástica acarreta em muita tensão e angústia na vida do baterista, atormentado lentamente pelo silêncio.",
    "poster": "https://image.tmdb.org/t/p/w342/gjKlQJlWtP61ZN4WKbcSVHzjqq8.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7b5R8FfGUzlxfhOkPpL3xyIeuyF.jpg"
  },
  {
    "id": "amazon-carnival-row",
    "slug": "carnival-row",
    "title": "Carnival Row",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "carnival",
      "row"
    ],
    "tmdbId": 90027,
    "year": "2019",
    "rating": 7.687,
    "overview": "Com um serial killer solto no Carnival Row, Rycroft Philostrate, um investigador endurecido pela guerra, é a única pessoa disposta a parar com os assassinatos e manter a frágil paz.",
    "poster": "https://image.tmdb.org/t/p/w342/jyhxT10e2z9IDsKoIQDKhyxSQJt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7gfLuaqVBdtNxKIxp9uc8sOUlQg.jpg"
  },
  {
    "id": "amazon-jack-ryan",
    "slug": "jack-ryan",
    "title": "Jack Ryan",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "jack",
      "ryan"
    ],
    "tmdbId": 73375,
    "year": "2018",
    "rating": 7.675,
    "overview": "Quando o analista da CIA Jack Ryan esbarra em uma série de transferências bancárias suspeitas, sua busca por respostas o afasta da segurança de sua mesa de trabalho e o joga em um jogo mortal de gato e rato pela Europa e pelo Oriente Médio, com um terrorista em ascensão preparando um grande ataque contra os EUA e seus aliados.",
    "poster": "https://image.tmdb.org/t/p/w342/sUQS9Uks2UNdFc1Io2U0ulTDGsr.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2y2TbzeKZHYqTN5gb4nBv9dKk1f.jpg"
  },
  {
    "id": "amazon-perifericos",
    "slug": "perifericos",
    "title": "Periféricos",
    "altTitles": [
      "the peripheral"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "perifericos",
      "peripheral"
    ],
    "tmdbId": 95403,
    "year": "2022",
    "rating": 7.66,
    "overview": "Flynne Fisher É uma garota que tenta juntar os cacos de sua família destruída, em um canto esquecido dos Estados Unidos de amanhã. Flynne é sagaz, ambiciosa e está condenada. Ela não tem futuro. Até que o futuro vem convocá-la.",
    "poster": "https://image.tmdb.org/t/p/w342/8sDaiKVFPx1MSKn5Qsa4Z2J2cfJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hIZFG7MK4leU4axRFKJWqrjhmxZ.jpg"
  },
  {
    "id": "amazon-a-chegada",
    "slug": "a-chegada",
    "title": "A Chegada",
    "altTitles": [
      "arrival"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "chegada"
    ],
    "tmdbId": 329865,
    "year": "2016",
    "rating": 7.624,
    "overview": "Quando seres interplanetários deixam marcas na Terra, a Dra. Louise Banks, uma linguista especialista no assunto, é procurada por militares para traduzir os sinais e desvendar se os alienígenas representam uma ameaça. No entanto, a resposta para todas as perguntas e mistérios coloca em risco  a vida de Louise e a de toda a humanidade.",
    "poster": "https://image.tmdb.org/t/p/w342/3rDwbFpn6z5HJUgDjpfhEePx8VI.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uKPbFF08QkRMvIAsgCh1soeyPhZ.jpg"
  },
  {
    "id": "amazon-a-roda-do-tempo",
    "slug": "a-roda-do-tempo",
    "title": "A Roda do Tempo",
    "altTitles": [
      "wheel of time"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "roda",
      "tempo"
    ],
    "tmdbId": 71914,
    "year": "2021",
    "rating": 7.607,
    "overview": "As vidas de cinco jovens camponeses mudam para sempre quando uma mulher estranha e poderosa chega dizendo que um deles é a criança de uma antiga profecia, com o poder de alterar o equilíbrio entre Luz e Trevas para sempre. Eles precisam decidir se confiam na desconhecida – e uns nos outros – para mudar o destino do mundo antes que o Tenebroso consiga se libertar de sua prisão.",
    "poster": "https://image.tmdb.org/t/p/w342/dCEIpgPohZK7f3FsXLPhG0aprGr.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1P3QtW1IkivqDrKbbwuR0zCYIf8.jpg"
  },
  {
    "id": "amazon-black-sails",
    "slug": "black-sails",
    "title": "Black Sails",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "black",
      "sails"
    ],
    "tmdbId": 47665,
    "year": "2014",
    "rating": 7.607,
    "overview": "A população da ilha tomada pelo Capitão Flint e seus piratas pode não ser a mais exemplar, mas ai daquele que tentar invadi-la.",
    "poster": "https://image.tmdb.org/t/p/w342/x5eig1VHG1a5dSx5cwkFeQh3SCa.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/A7lo83g09i3cDmLRKtDiiYN8w0z.jpg"
  },
  {
    "id": "amazon-the-good-wife",
    "slug": "the-good-wife",
    "title": "The Good Wife",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "good",
      "wife"
    ],
    "tmdbId": 1435,
    "year": "2009",
    "rating": 7.6,
    "overview": "Quando um escândalo de corrupção muito público afeta e leva à cadeia seu marido, Alicia Florrick precisa dar a volta por cima sobre humilhações e traições, assumir as responsabilidades e cuidar de sua família.",
    "poster": "https://image.tmdb.org/t/p/w342/d2kFoQpYTFMp5OI55OIwi7cn4Qe.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uinrziSwEmS6s8VvGBad5sed7bF.jpg"
  },
  {
    "id": "amazon-goliath",
    "slug": "goliath",
    "title": "Goliath",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "goliath"
    ],
    "tmdbId": 67384,
    "year": "2016",
    "rating": 7.6,
    "overview": "Billy McBride, antes um advogado poderoso, hoje parece um caso perdido que passa mais tempo no bar do que nos tribunais. Quando ele, relutantemente, aceita processar por negligência o maior cliente da gigantesca firma que ajudou a criar, Billy e sua desorganizada equipe descobrem uma vasta e mortal conspiração, que os lança em uma disputa que remete à luta entre Davi e Golias.",
    "poster": "https://image.tmdb.org/t/p/w342/yiTTeFYdfQqkBLJLbuyZqnXC2kE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rcw9qVY8fmbjyCZv3idjrC1TkvW.jpg"
  },
  {
    "id": "amazon-blade-runner-2049",
    "slug": "blade-runner-2049",
    "title": "Blade Runner 2049",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "blade",
      "runner",
      "2049"
    ],
    "tmdbId": 335984,
    "year": "2017",
    "rating": 7.591,
    "overview": "Trinta anos após os acontecimentos do primeiro filme, um novo blade runner, o oficial K da polícia de Los Angeles, desenterra um segredo há muito enterrado que tem o potencial de mergulhar o que resta da sociedade no caos. A descoberta de K o leva a uma busca para encontrar Rick Deckard, um ex-blade runner do LAPD que está desaparecido há 30 anos.",
    "poster": "https://image.tmdb.org/t/p/w342/49pANIZXRAdHUiWjjBv4vxPeqRC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/askFH4GSk2u9z3ZE5ypdKIMeqLJ.jpg"
  },
  {
    "id": "amazon-them",
    "slug": "them",
    "title": "Them",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "them"
    ],
    "tmdbId": 120462,
    "year": "2021",
    "rating": 7.585,
    "overview": "Série antológica que explora o terror nos Estados Unidos.",
    "poster": "https://image.tmdb.org/t/p/w342/qo8fpes33rSCjaqbpo85lmFSqQj.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nleG20xwqGsEbCEHnIRRwZmz3l6.jpg"
  },
  {
    "id": "amazon-manchester-a-beira-mar",
    "slug": "manchester-a-beira-mar",
    "title": "Manchester à Beira-Mar",
    "altTitles": [
      "manchester by the sea"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "manchester",
      "beira",
      "mar"
    ],
    "tmdbId": 334541,
    "year": "2016",
    "rating": 7.553,
    "overview": "Lee Chandler, zelador de prédios em Boston, Massachusetts, é forçado a retornar a sua cidade natal, Manchester na Inglaterra, para assumir a guarda de seu sobrinho adolescente Patrick após o pai do rapaz, seu irmão Joe, falecer precocemente. Este retorno ficará ainda mais complicado quando Lee precisar enfrentar as razões que o fizeram ir embora e deixar sua família para trás, anos antes.",
    "poster": "https://image.tmdb.org/t/p/w342/cy7fOIXX0MO2HXnTE3Lf0NwjQfN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fjk4eE8Ypke4YLv5A3ArDH4GzYH.jpg"
  },
  {
    "id": "amazon-anatomy-of-a-fall",
    "slug": "anatomy-of-a-fall",
    "title": "Anatomy of a Fall",
    "altTitles": [
      "anatomia de uma queda"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "anatomy",
      "fall"
    ],
    "tmdbId": 915935,
    "year": "2023",
    "rating": 7.523,
    "overview": "Uma mulher é suspeita do assassinato de seu marido, e seu filho cego enfrenta um dilema moral como única testemunha.",
    "poster": "https://image.tmdb.org/t/p/w342/woXYl0DJTx6TsfYWPkSfNHTsoOx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kszooR7v1TLFM4pzx6IkKq2jDAN.jpg"
  },
  {
    "id": "amazon-good-night-oppy",
    "slug": "good-night-oppy",
    "title": "Good Night Oppy",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "good",
      "night",
      "oppy"
    ],
    "tmdbId": 972545,
    "year": "2022",
    "rating": 7.5,
    "overview": "O filme segue Opportunity, o Mars Exploration Rover carinhosamente apelidado de Oppy por seus criadores e cientistas da NASA. Originalmente, esperava-se que Oppy vivesse apenas 90 dias, mas ele explorou Marte por quase 15 anos. O documentário retrata a equipe de cientistas e engenheiros que fizeram da nave parte de sua família aeroespacial.",
    "poster": "https://image.tmdb.org/t/p/w342/7DTWN79hsN5AZEhW8w4SOquSI4D.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bfYDeFDmoweRdmTt0ifHPOMgNXV.jpg"
  },
  {
    "id": "hbo-um-sonho-de-liberdade",
    "slug": "um-sonho-de-liberdade",
    "title": "Um Sonho de Liberdade",
    "altTitles": [
      "the shawshank redemption"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "sonho",
      "liberdade",
      "shawshank"
    ],
    "tmdbId": 278,
    "year": "1994",
    "rating": 8.718,
    "overview": "Em 1946, Andy Dufresne, um banqueiro jovem e bem sucedido, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela. Ele é mandado para uma prisão que é o pesadelo de qualquer detento, a Penitenciária Estadual de Shawshank, no Maine. Lá ele irá cumprir a pena perpétua. Andy logo será apresentado a Warden Norton, o corrupto e cruel agente penitenciário, que usa a Bíblia como arma de controle e ao Capitão Byron Hadley que trata os internos como animais. Andy faz amizade com Ellis Boyd Redding, um prisioneiro que cumpre pena há 20 anos e controla o mercado negro da instituição.",
    "poster": "https://image.tmdb.org/t/p/w342/umX3lBhHoTV7Lsci140Yr8VpXyN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg"
  },
  {
    "id": "hbo-chernobyl",
    "slug": "chernobyl",
    "title": "Chernobyl",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "chernobyl"
    ],
    "tmdbId": 87108,
    "year": "2019",
    "rating": 8.705,
    "overview": "Aqui é contada a história da explosão que aconteceu na Usina Nuclear de Chernobyl. Em 1986, na Ucrânia, o acidente dizimou dezenas de pessoas e acabou por se tornar o maior desastre nuclear da história. Enquanto o mundo lamentava o ocorrido, o cientista Valery Legasov (Jared Harris), a física Ulana Khomyuk (Emily Watson) e o vice-presidente do Conselho de Ministros Boris Shcherbina (Stellan Skarsgård) tentam descobrir as causas do acidente.",
    "poster": "https://image.tmdb.org/t/p/w342/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3URK0z9PzpVNJrGE7XOuyy6KFzk.jpg"
  },
  {
    "id": "hbo-rick-and-morty",
    "slug": "rick-and-morty",
    "title": "Rick and Morty",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "rick",
      "morty"
    ],
    "tmdbId": 60625,
    "year": "2013",
    "rating": 8.676,
    "overview": "O brilhante cientista beberrão Rick sequestra Morty, seu neto aborrescente, para viver loucuras em outros mundos e dimensões alternativas.",
    "poster": "https://image.tmdb.org/t/p/w342/5qfd0e2uMbVInX3YdeFbDsfxi1t.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/Ao5pBFuWY32cVuh6iYjEjZMEscN.jpg"
  },
  {
    "id": "hbo-familia-soprano",
    "slug": "familia-soprano",
    "title": "Família Soprano",
    "altTitles": [
      "sopranos"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "família",
      "soprano"
    ],
    "tmdbId": 1398,
    "year": "1999",
    "rating": 8.662,
    "overview": "Chefe da máfia e pai de família, Tony Soprano começa a ter ataques de pânico e decide procurar a ajuda de uma profissional, Dra. Jennifer Melfi. Ele discute sua intimidade e a vida no crime, revelando o desconforto da mulher, Carmela Soprano, com as suas atividades profissionais. Enquanto tenta proteger os filhos, Meadow e Anthony Junior, o mafioso irá enfrentar uma investigação federal e a possível traição de um membro da família.",
    "poster": "https://image.tmdb.org/t/p/w342/xmn4PfUivHztFdJBMtijhLU4KTD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lNpkvX2s8LGB0mjGODMT4o6Up7j.jpg"
  },
  {
    "id": "hbo-primal",
    "slug": "primal",
    "title": "Primal",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "primal"
    ],
    "tmdbId": 89456,
    "year": "2019",
    "rating": 8.643,
    "overview": "No início da evolução, um homem das cavernas e um dinossauro à beira da extinção se unem em tragédias infelizes e tornam-se a única esperança de sobrevivência um do outro em um mundo traiçoeiro.",
    "poster": "https://image.tmdb.org/t/p/w342/mf12pRakr3eYdJtv6klQtoznnbU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tbHQDtoDZGJsfe7Kx6BEShcrZAa.jpg"
  },
  {
    "id": "hbo-the-wire",
    "slug": "the-wire",
    "title": "The Wire",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "wire"
    ],
    "tmdbId": 1438,
    "year": "2002",
    "rating": 8.63,
    "overview": "Uma série que acompanha o desenrolar de uma investigação policial, a partir do ponto de vista dos agentes policiais e também dos criminosos procurados.",
    "poster": "https://image.tmdb.org/t/p/w342/iLmoND7FpDKFwucLjS7lkM4ZX1p.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/layPSOJGckJv3PXZDIVluMq69mn.jpg"
  },
  {
    "id": "hbo-irmaos-de-sangue",
    "slug": "irmaos-de-sangue",
    "title": "Irmãos de Sangue",
    "altTitles": [
      "band of brothers"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "irmaos",
      "sangue",
      "band",
      "brothers"
    ],
    "tmdbId": 4613,
    "year": "2001",
    "rating": 8.583,
    "overview": "A trajetória dos integrantes da Easy Company, grupo de elite da infantaria de paraquedistas dos Estados Unidos, desde o treinamento até os combates na histórica invasão da Europa, na Segunda Guerra Mundial.",
    "poster": "https://image.tmdb.org/t/p/w342/zReOJYste13Qq3T3B5OyXPWjv1O.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2yDV0xLyqW88dn5qE7YCRnoYmfy.jpg"
  },
  {
    "id": "hbo-batman-a-serie-animada",
    "slug": "batman-a-serie-animada",
    "title": "Batman A Série Animada",
    "altTitles": [
      "batman animated"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "batman",
      "série",
      "animada"
    ],
    "tmdbId": 2098,
    "year": "1992",
    "rating": 8.568,
    "overview": "Jurando vingar o assassinato dos seus pais, Bruce Wayne dedica a sua vida a acabar com o crime em Gotham City como o vigilante mascarado \"Batman\".",
    "poster": "https://image.tmdb.org/t/p/w342/nmL9VZi6eTX1zhhGRUVMOycS7bx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jszr5nLTaK946h85MBl1K2dkvKN.jpg"
  },
  {
    "id": "hbo-batman-o-cavaleiro-das-trevas",
    "slug": "batman-o-cavaleiro-das-trevas",
    "title": "Batman O Cavaleiro das Trevas",
    "altTitles": [
      "dark knight"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "batman",
      "cavaleiro",
      "trevas"
    ],
    "tmdbId": 155,
    "year": "2008",
    "rating": 8.528,
    "overview": "Após dois anos desde o surgimento do Batman, os criminosos de Gotham City têm muito o que temer. Com a ajuda do tenente James Gordon e do promotor público Harvey Dent, Batman luta contra o crime organizado. Acuados com o combate, os chefes do crime aceitam a proposta feita pelo Coringa e o contratam para combater o Homem-Morcego.",
    "poster": "https://image.tmdb.org/t/p/w342/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg"
  },
  {
    "id": "hbo-batman-cavaleiro-das-trevas",
    "slug": "batman-cavaleiro-das-trevas",
    "title": "Batman: O Cavaleiro das Trevas",
    "altTitles": [
      "the dark knight"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "batman",
      "cavaleiro",
      "trevas",
      "dark",
      "knight"
    ],
    "tmdbId": 155,
    "year": "2008",
    "rating": 8.528,
    "overview": "Após dois anos desde o surgimento do Batman, os criminosos de Gotham City têm muito o que temer. Com a ajuda do tenente James Gordon e do promotor público Harvey Dent, Batman luta contra o crime organizado. Acuados com o combate, os chefes do crime aceitam a proposta feita pelo Coringa e o contratam para combater o Homem-Morcego.",
    "poster": "https://image.tmdb.org/t/p/w342/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cfT29Im5VDvjE0RpyKOSdCKZal7.jpg"
  },
  {
    "id": "hbo-hora-de-aventura",
    "slug": "hora-de-aventura",
    "title": "Hora de Aventura",
    "altTitles": [
      "adventure time"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "hora",
      "aventura"
    ],
    "tmdbId": 15260,
    "year": "2010",
    "rating": 8.5,
    "overview": "Com 12 anos de idade, Finn combate o mal na terra de Ooo na companhia de seu cachorro mágico, Jake. Quando estes dois grandes amigos se juntam e dizem as palavras mágicas \"Hora de Aventura\", tudo pode acontecer.",
    "poster": "https://image.tmdb.org/t/p/w342/2EMpiF1GireQHs3f9JKCFoKElju.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3uE9SUywNbj1qSAuYCGgbTTYku5.jpg"
  },
  {
    "id": "hbo-senhor-dos-aneis-1",
    "slug": "senhor-dos-aneis-1",
    "title": "O Senhor dos Anéis: A Sociedade do Anel",
    "altTitles": [
      "lord of the rings fellowship"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "senhor",
      "aneis",
      "lord",
      "rings"
    ],
    "tmdbId": 120,
    "year": "2001",
    "rating": 8.431,
    "overview": "O hobbit Frodo herda a missão de salvar a Terra-Média do perverso Sauron. Ele precisa conduzir o Um Anel até a Montanha da Perdição e destruí-lo para sempre e, para isso, conta com a aliança de oito bravos companheiros.",
    "poster": "https://image.tmdb.org/t/p/w342/tlvsNCwWEIgwAM23aNzTmMIcPEZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/a0lfia8tk8ifkrve0Tn8wkISUvs.jpg"
  },
  {
    "id": "hbo-friends",
    "slug": "friends",
    "title": "Friends",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "friends"
    ],
    "tmdbId": 1668,
    "year": "1994",
    "rating": 8.416,
    "overview": "Seis jovens são unidos por laços familiares, românticos e, principalmente, de amizade, enquanto tentam vingar em Nova York.",
    "poster": "https://image.tmdb.org/t/p/w342/oY3ck2Sdu8qsEWFnuiX2HEfr65k.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/m3Jev59mJLyUp5bXhY5SVfIBZI0.jpg"
  },
  {
    "id": "hbo-a-origem",
    "slug": "a-origem",
    "title": "A Origem",
    "altTitles": [
      "inception"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "origem"
    ],
    "tmdbId": 27205,
    "year": "2010",
    "rating": 8.4,
    "overview": "Cobb é um ladrão habilidoso que comete espionagem corporativa infiltrando-se no subconsciente de seus alvos durante o estado de sono. Impedido de retornar para sua família, ele recebe a oportunidade de se redimir ao realizar uma tarefa aparentemente impossível: plantar uma ideia na mente do herdeiro de um império. Para realizar o crime perfeito, ele conta com a ajuda do parceiro Arthur, o discreto Eames e a arquiteta de sonhos Ariadne. Juntos, eles correm para que o inimigo não antecipe seus passos.",
    "poster": "https://image.tmdb.org/t/p/w342/9e3Dz7aCANy5aRUQF745IlNloJ1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg"
  },
  {
    "id": "hbo-samurai-jack",
    "slug": "samurai-jack",
    "title": "Samurai Jack",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "samurai",
      "jack"
    ],
    "tmdbId": 2723,
    "year": "2001",
    "rating": 8.4,
    "overview": "Um samurai enviado através do tempo luta para voltar para casa e salvar o mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/ddZ7Q2WZ0xAHkVXYvcEgNGFgVkw.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/CrVAqxtdmvelqVcj8pVeQg7wNV.jpg"
  },
  {
    "id": "hbo-spider-verse",
    "slug": "spider-verse",
    "title": "Homem-Aranha: Através do Aranhaverso",
    "altTitles": [
      "spider-man across the spider-verse"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "spider",
      "verse",
      "aranhaverso"
    ],
    "tmdbId": 569094,
    "year": "2023",
    "rating": 8.333,
    "overview": "Miles Morales retorna para o próximo capítulo da saga do Aranhaverso, uma aventura épica que transportará o Homem-Aranha em tempo integral e amigável do bairro do Brooklyn através do Multiverso para unir forças com Gwen Stacy e uma nova equipe de Homens-Aranha para enfrentar com um vilão mais poderoso do que qualquer coisa que eles já encontraram.",
    "poster": "https://image.tmdb.org/t/p/w342/4CwKj1fw33BXYzxvrpM3GlAhK4L.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9xfDWXAUbFXQK585JvByT5pEAhe.jpg"
  },
  {
    "id": "hbo-a-casa-do-dragao",
    "slug": "a-casa-do-dragao",
    "title": "A Casa do Dragão",
    "altTitles": [
      "house of the dragon"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "casa",
      "dragão"
    ],
    "tmdbId": 94997,
    "year": "2022",
    "rating": 8.3,
    "overview": "200 anos antes dos eventos de \"Game of Thrones\", os Targaryen estavam no ápice de seu poder, tendo inúmeros dragões sob seu comando, mas nem tudo dura para sempre. O início do fim da dinastia Targaryen.",
    "poster": "https://image.tmdb.org/t/p/w342/xEC4nyJvcWcOu7QaobLcqz6iRUL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2xGcSLyTAzConiHAByWqhfLiatT.jpg"
  },
  {
    "id": "hbo-succession",
    "slug": "succession",
    "title": "Succession",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "succession"
    ],
    "tmdbId": 76331,
    "year": "2018",
    "rating": 8.3,
    "overview": "Acompanhe a história da família Roy, composta por Logan e seus quatro filhos, que controla um dos maiores conglomerados de meios de comunicação e entretenimento do mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bcdUYUFk8GdpZJPiSAas9UeocLH.jpg"
  },
  {
    "id": "hbo-harley-quinn",
    "slug": "harley-quinn",
    "title": "Harley Quinn",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "harley",
      "quinn"
    ],
    "tmdbId": 74440,
    "year": "2019",
    "rating": 8.3,
    "overview": "Baseada na personagem da DC, se concentra em Arlequina, que finalmente rompeu de uma vez por todas seu relacionamento abusivo com o Coringa e agora tenta lidar com sua emancipação e uma vida de independência sendo a verdadeira rainha de Gotham. A série apresenta um novo olhar cômico sobre Arlequina, Hera Venenosa, Coringa e todo um elenco de heróis e vilões, antigos e novos, do Universo DC.",
    "poster": "https://image.tmdb.org/t/p/w342/bl4hQISOR5QNu4cITDuN1E4zLAJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sNHoOagykUU0WpVBa162w1NP0mP.jpg"
  },
  {
    "id": "hbo-true-detective",
    "slug": "true-detective",
    "title": "True Detective",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "true",
      "detective"
    ],
    "tmdbId": 46648,
    "year": "2014",
    "rating": 8.286,
    "overview": "Mostrando diferentes perspectivas tanto no passado como no presente, a narrativa se foca na investigação dos crimes supostamente cometidos por um serial killer no ano de 1995 feita pelos detetives Rust Cohle e Martin Hart. Nos dias atuais, o caso é aberto novamente e ambos são questionados pelos atuais detetives, já que a polícia tenta novamente prender o mesmo assassino. A série mostrará ao público o que acontece atualmente, ao mesmo tempo em que revela flashbacks da investigação nos anos 90.",
    "poster": "https://image.tmdb.org/t/p/w342/1fxr55V72a2gtqyn2b8pf6FslOf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/v8YFr8BbU9qsO8PYIulzTeM6Qk.jpg"
  },
  {
    "id": "hbo-euphoria",
    "slug": "euphoria",
    "title": "Euphoria",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "euphoria"
    ],
    "tmdbId": 85552,
    "year": "2019",
    "rating": 8.281,
    "overview": "Um grupo de estudantes do ensino médio lida com diferentes situações típicas da idade como drogas, sexo, busca pela identidade, traumas, comportamento nas redes sociais e amizade.",
    "poster": "https://image.tmdb.org/t/p/w342/aJrG7OkoTMPWG5c8opz8a93AZPY.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/GN2KFXiHPVV6sIw4v2P2pqCJty.jpg"
  },
  {
    "id": "hbo-it-a-coisa",
    "slug": "it-a-coisa",
    "title": "IT: A Coisa",
    "altTitles": [
      "it chapter one",
      "it 2017"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "it",
      "coisa"
    ],
    "tmdbId": 661286,
    "year": "2019",
    "rating": 8.25,
    "overview": "",
    "poster": "https://image.tmdb.org/t/p/w342/awFM888QgS0PB3SZXMD5HikNXNQ.jpg",
    "backdrop": ""
  },
  {
    "id": "hbo-matrix",
    "slug": "matrix",
    "title": "Matrix",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "matrix"
    ],
    "tmdbId": 603,
    "year": "1999",
    "rating": 8.242,
    "overview": "O jovem programador Thomas Anderson é atormentado por estranhos pesadelos em que está sempre conectado por cabos a um imenso sistema de computadores do futuro. À medida que o sonho se repete, ele começa a desconfiar da realidade. Thomas conhece os misteriosos Morpheus e Trinity e descobre que é vítima de um sistema inteligente e artificial chamado Matrix, que manipula a mente das pessoas e cria a ilusão de um mundo real enquanto usa os cérebros e corpos dos indivíduos para produzir energia.",
    "poster": "https://image.tmdb.org/t/p/w342/lDqMDI3xpbB9UQRyeXfei0MXhqb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg"
  },
  {
    "id": "hbo-rome",
    "slug": "rome",
    "title": "Rome",
    "altTitles": [
      "roma"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "rome"
    ],
    "tmdbId": 1891,
    "year": "2005",
    "rating": 8.234,
    "overview": "Série retrata acontecimentos que datam de 52 a.C., quatrocentos anos depois da fundação da república na principal metrópole mundial da época, marcada por rivalidades, traições e guerras. Os episódios da primeira temporada mostram desde a vitória de Júlio César na batalha de Alésia até seu assassinato por conspiradores do Senado por causa de medidas populistas.",
    "poster": "https://image.tmdb.org/t/p/w342/yzRt2ISorcvApXFUNJFQfMKGclL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/b2fhZk0xB2TgMsDXT6goR28PoHX.jpg"
  },
  {
    "id": "hbo-o-iluminado",
    "slug": "o-iluminado",
    "title": "O Iluminado",
    "altTitles": [
      "the shining"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "iluminado"
    ],
    "tmdbId": 694,
    "year": "1980",
    "rating": 8.205,
    "overview": "Durante o inverno, um homem é contratado para ficar como vigia em um hotel no Colorado e vai para lá com a esposa e seu filho. Porém, o contínuo isolamento começa a lhe causar problemas mentais sérios e ele vai se tornado cada vez mais agressivo e perigoso, ao mesmo tempo que seu filho passa a ter visões de acontecimentos ocorridos no passado, que também foram causados pelo isolamento excessivo.",
    "poster": "https://image.tmdb.org/t/p/w342/47BdQqDWnj3VIzpH9bd2agho2PN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mmd1HnuvAzFc4iuVJcnBrhDNEKr.jpg"
  },
  {
    "id": "hbo-ilha-do-medo",
    "slug": "ilha-do-medo",
    "title": "Ilha do Medo",
    "altTitles": [
      "shutter island"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "ilha",
      "medo",
      "shutter",
      "island"
    ],
    "tmdbId": 11324,
    "year": "2010",
    "rating": 8.2,
    "overview": "No verão de 1954, os agentes judiciais Teddy Daniels (DiCaprio) e Chuck Aule (Ruffalo) foram designados para uma ilha remota do porto de Boston para investigar o desaparecimento de uma perigosa assassina (Mortimer) que estava reclusa no hospital psiquiátrico Ashecliffe, um centro penitenciário para criminosos perturbados dirigido pelo sinistro médico John Cawley. (Kingsley). Logo eles descobrem que o centro guarda muitos segredos e que a ilha esconde algo mais perigoso que os pacientes.",
    "poster": "https://image.tmdb.org/t/p/w342/erl801HYIodoIBGZeFk0GTwCUBh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rbZvGN1A1QyZuoKzhCw8QPmf2q0.jpg"
  },
  {
    "id": "hbo-gossip-girl",
    "slug": "gossip-girl",
    "title": "Gossip Girl",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "gossip",
      "girl"
    ],
    "tmdbId": 1395,
    "year": "2007",
    "rating": 8.2,
    "overview": "Um grupo de alunos de uma escola rica de Manhattan parece se safar de tudo, menos de uma blogueira anônima que acompanha cada passo que dão.",
    "poster": "https://image.tmdb.org/t/p/w342/sbxqT0TixODWRYzuaw6JFba0KKO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5RWAjCYhu3D8Ai2QBYP7GjaxFb3.jpg"
  },
  {
    "id": "hbo-pacificador",
    "slug": "pacificador",
    "title": "Pacificador",
    "altTitles": [
      "peacemaker"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "pacificador",
      "peacemaker"
    ],
    "tmdbId": 110492,
    "year": "2022",
    "rating": 8.196,
    "overview": "A série explorará as origens do Pacificador, um homem que acredita na paz a qualquer custo - não importa quantas pessoas ele tenha que matar para obtê-la.",
    "poster": "https://image.tmdb.org/t/p/w342/fbW4ym5rgMRkNjNAzpZQX5vkxMf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aJcUU3LMlqMKBi8L3eaxGfAbd4G.jpg"
  },
  {
    "id": "hbo-mare-of-easttown",
    "slug": "mare-of-easttown",
    "title": "Mare of Easttown",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "mare",
      "easttown"
    ],
    "tmdbId": 115004,
    "year": "2021",
    "rating": 8.189,
    "overview": "Mare Sheehan é uma detetive de uma pequena cidade na Pensilvânia que deve investigar um violento assassinato local. Conforme o lado sombrio da pequena comunidade vem à luz, a vida de Mare desmorona e relacionamentos familiares e tragédias do passado ressurgem para definir o presente.",
    "poster": "https://image.tmdb.org/t/p/w342/4oVWbd2NKglFG9UO46VhW4v6nFD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7X1IGIl1JMJ9YFzJymCVoqZbvTR.jpg"
  },
  {
    "id": "hbo-os-infiltrados",
    "slug": "os-infiltrados",
    "title": "Os Infiltrados",
    "altTitles": [
      "departed"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "infiltrados"
    ],
    "tmdbId": 1422,
    "year": "2006",
    "rating": 8.16,
    "overview": "Billy Costigan, um jovem policial, recebe a missão de se infiltrar na máfia, mais especificamente no grupo comandado por Frank Costello. Billy conquista sua confiança ao mesmo tempo em que Colin Sullivan, um criminoso que atuou na polícia como informante de Costello, também ascende dentro da corporação. Tanto Billy quanto Colin se sentem aflitos devido à vida dupla que levam. Mas quando a máfia e a polícia descobrem que há um espião entre eles, a vida de ambos passa a correr perigo.",
    "poster": "https://image.tmdb.org/t/p/w342/qtnAwzDapzOML4Q9p7lv2bk5gvz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6WRrGYalXXveItfpnipYdayFkQB.jpg"
  },
  {
    "id": "hbo-silicon-valley",
    "slug": "silicon-valley",
    "title": "Silicon Valley",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "silicon",
      "valley"
    ],
    "tmdbId": 60573,
    "year": "2014",
    "rating": 8.138,
    "overview": "Ambientada no Vale do Silício, região da Califórnia fértil em inovações tecnológicas e científicas, a série mostra um grupo de desenvolvedores que cria novo um programa com o objetivo de impressionar um bilionário excêntrico do ramo tecnológico.",
    "poster": "https://image.tmdb.org/t/p/w342/4ptpmWBVD9HY9hMh8Cbs6SMiy7p.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4pfXAnWxOfEJsUgDPW0zqzs5UWv.jpg"
  },
  {
    "id": "hbo-duna-parte-2",
    "slug": "duna-parte-2",
    "title": "Duna: Parte 2",
    "altTitles": [
      "dune part two",
      "dune 2"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "duna",
      "dune",
      "2"
    ],
    "tmdbId": 693134,
    "year": "2024",
    "rating": 8.128,
    "overview": "A jornada de Paul Atreides continua. Ele está determinado a buscar vingança contra aqueles que destruíram sua família e seu lar. Com a ajuda de Chani e dos Fremen, ele embarca em uma jornada espiritual, mística e marcial. Se torna Muad'Dib, o líder messiânico dos Fremen, enquanto luta para evitar um futuro sombrio que ele testemunhou em visões. No entanto, suas ações inadvertidamente desencadeiam uma Guerra Santa em seu nome, que se espalha pelo universo conhecido. Enquanto enfrenta escolhas difíceis entre o amor por Chani e o destino de seu povo, Paul precisa usar suas habilidades e conhecimentos para evitar o terrível futuro que previu.",
    "poster": "https://image.tmdb.org/t/p/w342/8LJJjLjAzAwXS40S5mx79PJ2jSs.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/eZ239CUp1d6OryZEBPnO2n87gMG.jpg"
  },
  {
    "id": "hbo-coringa",
    "slug": "coringa",
    "title": "Coringa",
    "altTitles": [
      "joker"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "coringa"
    ],
    "tmdbId": 475557,
    "year": "2019",
    "rating": 8.126,
    "overview": "Isolado, intimidado e desconsiderado pela sociedade, o fracassado comediante Arthur Fleck inicia seu caminho como uma mente criminosa após assassinar três homens em pleno metrô. Sua ação inicia um movimento popular contra a elite de Gotham City, da qual Thomas Wayne é seu maior representante.",
    "poster": "https://image.tmdb.org/t/p/w342/xLxgVxFWvb9hhUyCDDXxRPPnFck.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg"
  },
  {
    "id": "hbo-meu-vizinho-totoro",
    "slug": "meu-vizinho-totoro",
    "title": "Meu Vizinho Totoro",
    "altTitles": [
      "totoro"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "vizinho",
      "totoro"
    ],
    "tmdbId": 8392,
    "year": "1988",
    "rating": 8.1,
    "overview": "Duas irmãs se mudam para o campo com o pai para ficarem mais próximas da mãe hospitalizada e descobrem que as árvores ao redor são habitadas por Totoros, espíritos mágicos da floresta. Quando a mais nova foge de casa, a irmã mais velha busca a ajuda dos espíritos para encontrá-la.",
    "poster": "https://image.tmdb.org/t/p/w342/23KKTxDg6rxZVc66bloQQdPSr29.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6O1mOoTXuc1WqjKd2R7MFQHZ7Eb.jpg"
  },
  {
    "id": "hbo-2001-odisseia",
    "slug": "2001-odisseia",
    "title": "2001: Uma Odisseia no Espaço",
    "altTitles": [
      "2001 a space odyssey"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "2001",
      "odisseia",
      "odyssey"
    ],
    "tmdbId": 62,
    "year": "1968",
    "rating": 8.1,
    "overview": "Desde a “Aurora do Homem” (a pré-história), um misterioso monólito negro parece emitir sinais de outra civilização, assim interferindo no nosso planeta. Quatro milhões de anos depois, no século XXI, uma equipe de astronautas liderados pelo experiente David Bowman e Frank Poole é enviada ao planeta Júpiter para investigar o enigmático monólito na nave Discovery, totalmente controlada pelo computador HAL-9000. Entretanto, no meio da viagem, HAL-9000 entra em pane e tenta assumir o controle da nave, eliminando um a um os tripulantes.",
    "poster": "https://image.tmdb.org/t/p/w342/pVCmLuATJ0lQs4Vx1zUJUN0if2A.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/30XRuUQGk5P9XB6mlfEF1eoWFgq.jpg"
  },
  {
    "id": "hbo-game-of-thrones",
    "slug": "game-of-thrones",
    "title": "Game of Thrones",
    "altTitles": [
      "got"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "game",
      "thrones"
    ],
    "tmdbId": 245318,
    "year": "2026",
    "rating": 8.094,
    "overview": "Filha de uma ex-garçonete do Hooters e de um ex-lutador profissional, Margo abandonou a faculdade há pouco tempo e aspira a ser escritora. Com um bebê recém-nascido, uma pilha crescente de contas e cada vez menos recursos para pagá-las, Margo precisa encontrar um caminho a seguir.",
    "poster": "https://image.tmdb.org/t/p/w342/hXDWh5QlixELKXmkUswg6Rjursc.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/yZjaZJSW2Fbm4Hi1Y8p8f4FGCJw.jpg"
  },
  {
    "id": "hbo-westworld",
    "slug": "westworld",
    "title": "Westworld",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "westworld"
    ],
    "tmdbId": 63247,
    "year": "2016",
    "rating": 8.024,
    "overview": "Num parque temático, visitantes mergulham num universo onde qualquer desejo pode ser realizado por robôs cuidadosamente programados. Mas algumas destas máquinas desviam do padrão de programação com comportamentos anormais.",
    "poster": "https://image.tmdb.org/t/p/w342/3xwpiixCoif2cf7MUofd3Xxob6I.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rX5hvSRB2k4YoIvRg6Zky52rWk0.jpg"
  },
  {
    "id": "hbo-boardwalk-empire",
    "slug": "boardwalk-empire",
    "title": "Boardwalk Empire",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "boardwalk",
      "empire"
    ],
    "tmdbId": 1621,
    "year": "2010",
    "rating": 8.019,
    "overview": "Estados Unidos nos anos 1920: depois do fim da Primeira Guerra, parecia que só havia bons tempos pela frente, com a economia em alta, o avanço de novas tecnologias e a efervescência das operações ilegais que satisfaziam os desejos de todas as classes sociais, principalmente quando se tratava de contrabando de bebidas em tempos de Lei Seca. Nesse contexto, acompanhamos a trajetória de Enoch \"Nucky\" Thompson, o tesoureiro de Atlantic City e grande chefe do crime organizado. Parte político, parte gângster, Nucky se sente confortável nas duas posições e nada o impedirá de expandir o seu império - até que um de seus seguidores comete atos impensados para obter mais poder, o que pode colocar tudo a perder. Steve Buscemi, astro de Cães de Aluguel, Fargo, Con Air e outros, é o protagonista da nova série de época da HBO. Por trás das câmeras monstros do cinema e da televisão comandam a nova série: os premiados Martin Scorsese e Terence Winter, roteirista de A Família Soprano.",
    "poster": "https://image.tmdb.org/t/p/w342/ola5CT2hDKwS3Y3tDXlq1Luqmo1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7Yj4QbECkH3JavlZxw4NWReoN7B.jpg"
  },
  {
    "id": "hbo-antes-do-amanhecer",
    "slug": "antes-do-amanhecer",
    "title": "Antes do Amanhecer",
    "altTitles": [
      "before sunrise"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "antes",
      "amanhecer",
      "before",
      "sunrise"
    ],
    "tmdbId": 76,
    "year": "1995",
    "rating": 7.973,
    "overview": "Jesse (Ethan Hawke), um jovem americano, e Celine (Julie Delpy), uma estudante francesa, se encontram casualmente no trem para Viena e logo começam a conversar. Ele a convence a desembarcar em Viena e gradativamente vão se envolvendo em uma paixão crescente. Mas existe uma verdade inevitável: no dia seguinte ela irá para Paris e ele voltará ao Estados Unidos. Com isso, resta aos dois apaixonados aproveitar o máximo o pouco tempo que lhes resta.",
    "poster": "https://image.tmdb.org/t/p/w342/gUD2xpkiWaCUabnwMgopECylsKc.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qA2TyqPldTtoTVY3LKrNIG5g6bH.jpg"
  },
  {
    "id": "hbo-warrior",
    "slug": "warrior",
    "title": "Warrior",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "warrior"
    ],
    "tmdbId": 73544,
    "year": "2019",
    "rating": 7.968,
    "overview": "Inspirada nos escritos do falecido Bruce Lee, Warrior é uma intensa e pulsante série ambientada durante as brutais Guerras Tong na Chinatown de San Francisco no final do século XIX. A série segue Ah Sahm, um jovem prodígio das artes marciais chinesas que chega a São Francisco e passa a trabalhar como capanga de uma das mais poderosas famílias do crime organizado de Chinatown.",
    "poster": "https://image.tmdb.org/t/p/w342/hR9qPFMI6BoR63XK6BBX5Ueghan.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/akshc6F3VmhJpvniRRlgqDt1ndT.jpg"
  },
  {
    "id": "hbo-banshee",
    "slug": "banshee",
    "title": "Banshee",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "banshee"
    ],
    "tmdbId": 41727,
    "year": "2013",
    "rating": 7.963,
    "overview": "Um ex-detento assume a identidade de Lucas Hood, o novo delegado de Banshee. Lá vive Carrie, ex-parceira no amor e no crime, que hoje leva uma vida pacata ao lado do marido, o promotor local. A marca da registrada da cidade é a corrupção, graças ao líder amish Kai Proctor. Ele, porém, não é o único problema para Lucas, já que um mafioso de Nova York quer vingança.",
    "poster": "https://image.tmdb.org/t/p/w342/5nXFiz8Rn8eezVjSTZBd7HmnF1G.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cwosIp9M9B6TcLnv0bBg86s0WUx.jpg"
  },
  {
    "id": "hbo-barry",
    "slug": "barry",
    "title": "Barry",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "barry"
    ],
    "tmdbId": 73107,
    "year": "2018",
    "rating": 7.9,
    "overview": "Barry Berkman, um matador de aluguel contratado para matar um aspirante a ator. Ao seguir seu alvo a uma aula de atuação, Barry se sente atraído pelo grupo e decide mudar de carreira. Mas o passado criminoso não o deixará.",
    "poster": "https://image.tmdb.org/t/p/w342/j1XpwD11f0BAEI7pX6UdMhUVX2F.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cj0zZiJfFj3xn9p0K3kx8qHSyng.jpg"
  },
  {
    "id": "hbo-la-la-land",
    "slug": "la-la-land",
    "title": "La La Land",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "land"
    ],
    "tmdbId": 313369,
    "year": "2016",
    "rating": 7.898,
    "overview": "O pianista Sebastian conhece a atriz Mia, e os dois se apaixonam perdidamente. Em busca de oportunidades para suas carreiras na competitiva Los Angeles, os jovens tentam fazer o relacionamento amoroso dar certo, enquanto perseguem fama e sucesso.",
    "poster": "https://image.tmdb.org/t/p/w342/AvMietG6xuobpSSdmVnKuTjv4bL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nlPCdZlHtRNcF6C9hzUH4ebmV1w.jpg"
  },
  {
    "id": "hbo-harry-potter-1",
    "slug": "harry-potter-1",
    "title": "Harry Potter e a Pedra Filosofal",
    "altTitles": [
      "harry potter sorcerers stone",
      "harry potter 1"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "harry",
      "potter"
    ],
    "tmdbId": 671,
    "year": "2001",
    "rating": 7.898,
    "overview": "Harry Potter é um garoto órfão que vive infeliz com seus tios, os Dursley. Em seu aniversário de 11 anos ele recebe uma carta que mudará sua vida: um convite para ingressar em Hogwarts.",
    "poster": "https://image.tmdb.org/t/p/w342/4rtsbE9aQ1qw4gv7yYwaNYfWFoS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1XAC6RPT01UX9EQGy2JVn5c8pgy.jpg"
  },
  {
    "id": "hbo-big-little-lies",
    "slug": "big-little-lies",
    "title": "Big Little Lies",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "little",
      "lies"
    ],
    "tmdbId": 66292,
    "year": "2017",
    "rating": 7.883,
    "overview": "A série, baseada no best-seller homônimo de Liane Moriarty, conta as histórias de três mulheres que moram em Pirriwee, na Austrália, cujas vidas se conectam de uma maneira inesperada, com consequências dramáticas.",
    "poster": "https://image.tmdb.org/t/p/w342/tlyvx2sgSdDgxP1a9JLMngOpOGG.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/8Wo2Pqjxn7Xmd7p2dxRMIJtyMV7.jpg"
  },
  {
    "id": "hbo-tokyo-vice",
    "slug": "tokyo-vice",
    "title": "Tokyo Vice",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "tokyo",
      "vice"
    ],
    "tmdbId": 90296,
    "year": "2022",
    "rating": 7.842,
    "overview": "Inspirado no relato de Jake Adelstein (Ansel Elgort), este drama criminal acompanha o jovem jornalista americano enquanto ele mergulha no submundo do final dos anos 90 em Tóquio, onde nada e ninguém é o que parece.",
    "poster": "https://image.tmdb.org/t/p/w342/za5QWRfCLwgRLLVXUkx3NUSAm6G.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/34RM2aSBqWpNhVzMupTq6QHF6uU.jpg"
  },
  {
    "id": "hbo-penny-dreadful",
    "slug": "penny-dreadful",
    "title": "Penny Dreadful",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "penny",
      "dreadful"
    ],
    "tmdbId": 54671,
    "year": "2014",
    "rating": 7.8,
    "overview": "Frankenstein, Conde Drácula, Dorian Gray e outros personagens clássicos da literatura vivem na Londres da Revolução Industrial, uma cidade repleta de mistérios sobrenaturais.",
    "poster": "https://image.tmdb.org/t/p/w342/hQSdrXBYTbLGHYDIseHkBOPXTgL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3bViM60LioKQJwsExm5oyLRYagC.jpg"
  },
  {
    "id": "hbo-the-pacific",
    "slug": "the-pacific",
    "title": "The Pacific",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "pacific"
    ],
    "tmdbId": 16997,
    "year": "2010",
    "rating": 7.784,
    "overview": "A série acompanha a jornada de três membros do Corpo de Fuzileiros Navais dos Estados Unidos, desde a primeira batalha contra o Japão, em Guadalcanal, até seu retorno após o grande triunfo que deu fim à Segunda Guerra Mundial.",
    "poster": "https://image.tmdb.org/t/p/w342/7bsZXJ90sesqdL4qDzkMvUSMWln.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nWfpVLgioDXQsAbfL6UJxYz6d3d.jpg"
  },
  {
    "id": "hbo-duna",
    "slug": "duna",
    "title": "Duna",
    "altTitles": [
      "dune"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "duna"
    ],
    "tmdbId": 438631,
    "year": "2021",
    "rating": 7.779,
    "overview": "Em um futuro distante, planetas são comandados por casas nobres que fazem parte de um império feudal intergalático. Paul Atreides é um jovem cuja família toma o controle do planeta deserto Arrakis, também conhecido como Duna. A única fonte da especiaria Melange, a substância mais importante do cosmos, Arrakis se mostra ser um planeta nem um pouco fácil de governar.",
    "poster": "https://image.tmdb.org/t/p/w342/uzERcfV2rSHNhW5eViQiO9hNiA7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qVgZu5BTx6pu4owCvVOm4zjTfOi.jpg"
  },
  {
    "id": "hbo-duna-parte-1",
    "slug": "duna-parte-1",
    "title": "Duna: Parte 1",
    "altTitles": [
      "dune part one",
      "dune 2021"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "duna",
      "dune"
    ],
    "tmdbId": 438631,
    "year": "2021",
    "rating": 7.779,
    "overview": "Em um futuro distante, planetas são comandados por casas nobres que fazem parte de um império feudal intergalático. Paul Atreides é um jovem cuja família toma o controle do planeta deserto Arrakis, também conhecido como Duna. A única fonte da especiaria Melange, a substância mais importante do cosmos, Arrakis se mostra ser um planeta nem um pouco fácil de governar.",
    "poster": "https://image.tmdb.org/t/p/w342/uzERcfV2rSHNhW5eViQiO9hNiA7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qVgZu5BTx6pu4owCvVOm4zjTfOi.jpg"
  },
  {
    "id": "hbo-sharp-objects",
    "slug": "sharp-objects",
    "title": "Sharp Objects",
    "altTitles": [
      "objetos cortantes"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "sharp",
      "objects"
    ],
    "tmdbId": 70453,
    "year": "2018",
    "rating": 7.755,
    "overview": "Camille, uma repórter criminalística recém-saída de um hospital psicológico devido a anos de violência auto-infligida, que retorna à sua cidade natal para investigar os assassinatos de duas meninas pequenas.",
    "poster": "https://image.tmdb.org/t/p/w342/9Yipm8X7jp2BJ84jlYL07IsvUHj.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/b9cCIwtT0gD42wEMMZwMdY8zfgS.jpg"
  },
  {
    "id": "hbo-o-exorcista",
    "slug": "o-exorcista",
    "title": "O Exorcista",
    "altTitles": [
      "exorcist"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "exorcista"
    ],
    "tmdbId": 9552,
    "year": "1973",
    "rating": 7.74,
    "overview": "Em Georgetown, Washington, uma atriz vai gradativamente tomando consciência que a sua filha de doze anos está tendo um comportamento completamente assustador. Deste modo, ela pede ajuda a um padre, que também um psiquiatra, e este chega a conclusão de que a garota está possuída pelo demônio. Ele solicita então a ajuda de um segundo sacerdote, especialista em exorcismo, para tentar livrar a menina desta terrível possessão.",
    "poster": "https://image.tmdb.org/t/p/w342/bYTMDg3eGFuO7emXbQip02a8zvQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xcjJ5khg2yzOa282mza39Lbrm7j.jpg"
  },
  {
    "id": "hbo-the-outsider",
    "slug": "the-outsider",
    "title": "The Outsider",
    "altTitles": [
      "o estranho"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "outsider",
      "estranho"
    ],
    "tmdbId": 2673,
    "year": "2003",
    "rating": 7.73,
    "overview": "Nas mansões por trás dos muros, tudo parece ser perfeito. Quando Ryan Atwood, um adolescente problemático que vive se metendo em roubadas, chega em Orange County com o advogado Sandy Cohen, ele começa a descobrir que nem tudo ali naquele lugar é tão perfeito como aparenta.",
    "poster": "https://image.tmdb.org/t/p/w342/elkSBWzyZZzHeKqNQnQ6ymZDIzq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5WVAGHTNMWhNwk5l3FoeAScmw7M.jpg"
  },
  {
    "id": "hbo-the-vow",
    "slug": "the-vow",
    "title": "The Vow",
    "altTitles": [
      "o voto"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "vow"
    ],
    "tmdbId": 217088,
    "year": "2023",
    "rating": 7.691,
    "overview": "As pessoas estão ocupadas olhando para a tela. \"Gaetal\", a pessoa usando uma máscara misteriosa, aparece, e o Voto de Morte começa.",
    "poster": "https://image.tmdb.org/t/p/w342/f7nOq3QoKiClcKadvPMVqKpCwTm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5b7VwobdAhp7NFCxxcEXSQNmaNe.jpg"
  },
  {
    "id": "hbo-the-batman",
    "slug": "the-batman",
    "title": "The Batman",
    "altTitles": [
      "batman 2022"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "batman"
    ],
    "tmdbId": 414906,
    "year": "2022",
    "rating": 7.658,
    "overview": "Em seu segundo ano de combate ao crime, Batman descobre corrupção em Gotham City que se conecta à sua própria família enquanto enfrenta um serial killer conhecido como Charada.",
    "poster": "https://image.tmdb.org/t/p/w342/wd7b4Nv9QBHDTIjc2m7sr0IUMoh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg"
  },
  {
    "id": "hbo-watchmen",
    "slug": "watchmen",
    "title": "Watchmen",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "watchmen"
    ],
    "tmdbId": 79788,
    "year": "2019",
    "rating": 7.637,
    "overview": "Uma visão atualizada do mundo, onde justiceiros mascarados transitam constantemente pela delicada linha que separa o bem do mal em uma sociedade que os despreza.",
    "poster": "https://image.tmdb.org/t/p/w342/m8rWq3j73ZGhDuSCZWMMoE9ePH1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fh2CStc3fKFYhkKOFyUHBGksRWj.jpg"
  },
  {
    "id": "hbo-mad-max-estrada-da-furia",
    "slug": "mad-max-estrada-da-furia",
    "title": "Mad Max Estrada da Fúria",
    "altTitles": [
      "fury road"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "estrada",
      "fúria"
    ],
    "tmdbId": 76341,
    "year": "2015",
    "rating": 7.632,
    "overview": "Em um mundo apocalíptico, Max Rockatansky acredita que a melhor forma de sobreviver é não depender de ninguém. Porém, após ser capturado pelo tirano Immortan Joe e seus rebeldes, Max se vê no meio de uma guerra mortal, iniciada pela imperatriz Furiosa que tenta salvar um grupo de garotas. Também tentando fugir, Max aceita ajudar Furiosa. Dessa vez, o tirano Joe está ainda mais implacável pois teve algo insubstituível roubado.",
    "poster": "https://image.tmdb.org/t/p/w342/tH64gzAHDFg7EFcgfkkZyHdGM5P.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uT895WNwm0aIJRtGizcQhrejWUo.jpg"
  },
  {
    "id": "hbo-mad-max-estrada-da-furia",
    "slug": "mad-max-estrada-da-furia",
    "title": "Mad Max: Estrada da Fúria",
    "altTitles": [
      "mad max fury road"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "mad",
      "max",
      "fury",
      "road"
    ],
    "tmdbId": 76341,
    "year": "2015",
    "rating": 7.632,
    "overview": "Em um mundo apocalíptico, Max Rockatansky acredita que a melhor forma de sobreviver é não depender de ninguém. Porém, após ser capturado pelo tirano Immortan Joe e seus rebeldes, Max se vê no meio de uma guerra mortal, iniciada pela imperatriz Furiosa que tenta salvar um grupo de garotas. Também tentando fugir, Max aceita ajudar Furiosa. Dessa vez, o tirano Joe está ainda mais implacável pois teve algo insubstituível roubado.",
    "poster": "https://image.tmdb.org/t/p/w342/tH64gzAHDFg7EFcgfkkZyHdGM5P.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uT895WNwm0aIJRtGizcQhrejWUo.jpg"
  },
  {
    "id": "hbo-true-blood",
    "slug": "true-blood",
    "title": "True Blood",
    "altTitles": [
      "sangue fresco"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "true",
      "blood"
    ],
    "tmdbId": 10545,
    "year": "2008",
    "rating": 7.612,
    "overview": "Cientistas japoneses criam um tipo de sangue sintético, permitindo aos vampiros a vida na sociedade, sem que isso represente uma ameaça aos cidadãos comuns. A descoberta científica, porém, não impede que os humanos ainda se sintam inseguros em relação a estas criaturas e a série vai mostrar como é a convivência entre os dois grupos numa pequena cidade de Lousiana.",
    "poster": "https://image.tmdb.org/t/p/w342/37KATZAbNWAZ34yQHWxuoX8rjII.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nGhC6P0lgcrY57NRB9nweu4nWaK.jpg"
  },
  {
    "id": "hbo-the-white-lotus",
    "slug": "the-white-lotus",
    "title": "The White Lotus",
    "altTitles": [],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "white",
      "lotus"
    ],
    "tmdbId": 111803,
    "year": "2021",
    "rating": 7.603,
    "overview": "Uma sátira social através dos funcionários e hóspedes de um aparentemente idílico resort.",
    "poster": "https://image.tmdb.org/t/p/w342/sQ35C3pjM8xCBT87xI90DuzizZD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rCTLaPwuApDx8vLGjYZ9pRl7zRB.jpg"
  },
  {
    "id": "disney-a-casa-coruja",
    "slug": "a-casa-coruja",
    "title": "A Casa Coruja",
    "altTitles": [
      "the owl house"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "casa",
      "coruja",
      "owl",
      "house"
    ],
    "tmdbId": 92685,
    "year": "2020",
    "rating": 8.7,
    "overview": "Luz, uma adolescente humana segura de si, tropeça acidentalmente em um portal para um reino mágico, onde faz amizade com uma bruxa rebelde.",
    "poster": "https://image.tmdb.org/t/p/w342/c3ygNz5qEETOUSAWa7v6B7gT8JS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bGqKaVROpz7pWUNuBxgU8hbcXYn.jpg"
  },
  {
    "id": "disney-os-feiticeiros-de-waverly",
    "slug": "os-feiticeiros-de-waverly",
    "title": "Os Feiticeiros de Waverly Place",
    "altTitles": [
      "wizards of waverly place"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "feiticeiros",
      "waverly"
    ],
    "tmdbId": 3498,
    "year": "2007",
    "rating": 8.631,
    "overview": "Alex, Justin e Max são irmãos que precisam aperfeiçoar os poderes mágicos que herdaram ou irão perdê-los para sempre. Os três feiticeiros se envolvem nas mais loucas situações enfrentando os típicos desafios de adolescentes, como escola, amigos, família e a magia.",
    "poster": "https://image.tmdb.org/t/p/w342/kRZh4XeKbHXJgzFk1Te0butQFxO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7CVy5uTj3JNF8wqb2VnfQdjL07V.jpg"
  },
  {
    "id": "disney-gravity-falls",
    "slug": "gravity-falls",
    "title": "Gravity Falls",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "gravity",
      "falls"
    ],
    "tmdbId": 40075,
    "year": "2012",
    "rating": 8.612,
    "overview": "Os gêmeos Dipper e Mabel ficam desapontados ao ter que passar o verão com seu tio-avô, mas a cidade onde ele vive acaba se revelando um lugar estranho e maravilhoso.",
    "poster": "https://image.tmdb.org/t/p/w342/21WVSbe9BB3GYnlxr4UF9H4DmO6.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lhg7eA6CTOCL10QNVdKiyxkgPsL.jpg"
  },
  {
    "id": "disney-bluey",
    "slug": "bluey",
    "title": "Bluey",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "bluey"
    ],
    "tmdbId": 82728,
    "year": "2018",
    "rating": 8.573,
    "overview": "As aventuras na vida de um filhote de cachorro Boiadeiro-australiano azul enquanto ele se diverte com sua família e amigos em situações cotidianas.",
    "poster": "https://image.tmdb.org/t/p/w342/b9mY0X5T20ZM073hoa5n0dgmbfN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/g88VMPtog8sl8riaIRtz4U80dMK.jpg"
  },
  {
    "id": "disney-love-victor",
    "slug": "love-victor",
    "title": "Love, Victor",
    "altTitles": [
      "love victor"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "love",
      "victor"
    ],
    "tmdbId": 97186,
    "year": "2020",
    "rating": 8.571,
    "overview": "A série segue Victor, um novato na escola Creekwood High, em sua própria jornada de autodescoberta, enfrentando desafios em casa, ajustando-se a uma nova cidade e batalhando com sua orientação sexual. Quando tudo parece demais, ele estende a mão para Simon para ajudá-lo a navegar pelos altos e baixos do ensino médio.",
    "poster": "https://image.tmdb.org/t/p/w342/8iie5Q0aXy5Ynr2M3iRmozqWfPJ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/s77W7avppGDWFL6ZZs813jQ6we6.jpg"
  },
  {
    "id": "disney-x-men-97",
    "slug": "x-men-97",
    "title": "X-Men 97",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "x-men"
    ],
    "tmdbId": 138502,
    "year": "2024",
    "rating": 8.5,
    "overview": "X-Men ’97 revisita a era icônica dos anos 1990, quando os X-Men, um grupo de mutantes que usam seus dons extraordinários para proteger um mundo que os odeia e teme, são desafiados como nunca antes, forçados a enfrentar um novo futuro perigoso e inesperado.",
    "poster": "https://image.tmdb.org/t/p/w342/yvqC5hw3rkW9vputtZ8PlwYhJRp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iDnTAeR2WNA62XQG0ivtteDSjd5.jpg"
  },
  {
    "id": "disney-x-men-97",
    "slug": "x-men-97",
    "title": "X-Men '97",
    "altTitles": [
      "x-men 97",
      "xmen 97"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "x-men",
      "xmen",
      "97"
    ],
    "tmdbId": 138502,
    "year": "2024",
    "rating": 8.5,
    "overview": "X-Men ’97 revisita a era icônica dos anos 1990, quando os X-Men, um grupo de mutantes que usam seus dons extraordinários para proteger um mundo que os odeia e teme, são desafiados como nunca antes, forçados a enfrentar um novo futuro perigoso e inesperado.",
    "poster": "https://image.tmdb.org/t/p/w342/yvqC5hw3rkW9vputtZ8PlwYhJRp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iDnTAeR2WNA62XQG0ivtteDSjd5.jpg"
  },
  {
    "id": "disney-star-wars-the-clone-wars",
    "slug": "star-wars-the-clone-wars",
    "title": "Star Wars The Clone Wars",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "star",
      "wars",
      "clone"
    ],
    "tmdbId": 4194,
    "year": "2008",
    "rating": 8.465,
    "overview": "A guerra dos clones se expande por toda a galáxia, e os heróis Jedi lutam desesperadamente a fim de manter a ordem e a paz. Sistemas sucumbem perante o lado negro da força e a República Galáctica está sofrendo contínua pressão dos Separatistas e seu infinito exército de dróides.",
    "poster": "https://image.tmdb.org/t/p/w342/pvDFqSHSdyWiPu0ihJJkDXxnBM9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/m6eRgkR1KC6Mr6gKx6gKCzSn6vD.jpg"
  },
  {
    "id": "disney-star-wars-clone-wars",
    "slug": "star-wars-clone-wars",
    "title": "Star Wars: The Clone Wars",
    "altTitles": [
      "clone wars"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "clone",
      "wars"
    ],
    "tmdbId": 4194,
    "year": "2008",
    "rating": 8.465,
    "overview": "A guerra dos clones se expande por toda a galáxia, e os heróis Jedi lutam desesperadamente a fim de manter a ordem e a paz. Sistemas sucumbem perante o lado negro da força e a República Galáctica está sofrendo contínua pressão dos Separatistas e seu infinito exército de dróides.",
    "poster": "https://image.tmdb.org/t/p/w342/pvDFqSHSdyWiPu0ihJJkDXxnBM9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/m6eRgkR1KC6Mr6gKx6gKCzSn6vD.jpg"
  },
  {
    "id": "disney-only-murders-in-the-building",
    "slug": "only-murders-in-the-building",
    "title": "Only Murders in the Building",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "only",
      "murders",
      "building"
    ],
    "tmdbId": 107113,
    "year": "2021",
    "rating": 8.463,
    "overview": "Três desconhecidos que compartilham uma obsessão por crimes e de repente, se veem envolvidos em um quando investigam a misteriosa morte de um vizinho no prédio em que moram em Nova York.",
    "poster": "https://image.tmdb.org/t/p/w342/8uYitjfCqJLdehIj0Q6RcMfyI8V.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/WCnEPf4ZNPjszndmrFlDxZ5Uvd.jpg"
  },
  {
    "id": "disney-sons-of-anarchy",
    "slug": "sons-of-anarchy",
    "title": "Sons of Anarchy",
    "altTitles": [
      "filhos da anarquia"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "sons",
      "anarchy"
    ],
    "tmdbId": 1409,
    "year": "2008",
    "rating": 8.416,
    "overview": "Uma gangue de motoqueiros segue suas próprias leis e comanda, por debaixo dos panos, o tráfico de armas na região da aparentemente pacata da cidade de Charming, protegendo-a contra forasteiros hostis.",
    "poster": "https://image.tmdb.org/t/p/w342/sa9VPlQneBi5xDz69kp7EJReUC1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mcgZDwhMlrFsfpbvCeg5RY5mhiu.jpg"
  },
  {
    "id": "disney-o-mandaloriano",
    "slug": "o-mandaloriano",
    "title": "O Mandaloriano",
    "altTitles": [
      "mandalorian"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "mandaloriano"
    ],
    "tmdbId": 82856,
    "year": "2019",
    "rating": 8.406,
    "overview": "A saga de um guerreiro solitário, que também é um mercenário e pistoleiro, viajando pelos territórios esquecidos e marginais do espaço, logo após a queda do Império e antes da criação da temida Primeira Ordem.",
    "poster": "https://image.tmdb.org/t/p/w342/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg"
  },
  {
    "id": "disney-futurama",
    "slug": "futurama",
    "title": "Futurama",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "futurama"
    ],
    "tmdbId": 615,
    "year": "1999",
    "rating": 8.371,
    "overview": "Fry era um entregador de pizza de 25 anos, cuja vida não tinha o  menor significado. Depois de congelar-se acidentalmente na véspera do  Ano Novo de 1999, ele acorda mil anos mais tarde, tendo a chance de  começar tudo de novo em um futuro repleto de alienígenas misteriosos e  de robôs ameaçadores.",
    "poster": "https://image.tmdb.org/t/p/w342/6ZS8SOno6kTmWz4eQ8lX8EBXOMv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4xKG4S1IyLIglHbCYGJDsptgQNh.jpg"
  },
  {
    "id": "disney-arquivo-x",
    "slug": "arquivo-x",
    "title": "Arquivo X",
    "altTitles": [
      "x files"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "arquivo"
    ],
    "tmdbId": 4087,
    "year": "1993",
    "rating": 8.37,
    "overview": "Dana Scully e Fox Mulder são dois agentes do FBI que investigam casos não solucionados, estranhos e inexplicáveis que envolvem fenômenos paranormais.",
    "poster": "https://image.tmdb.org/t/p/w342/bA4XkQR5VAuiszhbfDhR0siZgiI.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/w00lfexrsOeR25dO4hsWhbcUnmD.jpg"
  },
  {
    "id": "disney-criminal-minds",
    "slug": "criminal-minds",
    "title": "Criminal Minds",
    "altTitles": [
      "mentes criminosas"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "criminal",
      "minds"
    ],
    "tmdbId": 4057,
    "year": "2005",
    "rating": 8.3,
    "overview": "Um esquadrão de elite do FBI estuda as maiores mentes criminosas, antecipando seus próximos passos, antes que eles ataquem novamente. A fim de identificar as motivações dos criminosos e detê-los, cada membro da equipe usa a experiência que possui.",
    "poster": "https://image.tmdb.org/t/p/w342/trZTeHWcWDn6adkBBuSwfIhxAJn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/w88B4ooZ2LSYPw5107JOkjvI8PI.jpg"
  },
  {
    "id": "disney-andor",
    "slug": "andor",
    "title": "Andor",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "andor"
    ],
    "tmdbId": 83867,
    "year": "2022",
    "rating": 8.285,
    "overview": "Numa era repleta de perigos, enganos e intriga, Cassian Andor vai descobrir a diferença que pode fazer na luta contra o tirânico Império Galático. Embarca numa jornada destinada a torná-lo um herói da Rebelião.",
    "poster": "https://image.tmdb.org/t/p/w342/jWw20ofO2Yn4gCWmPqrCrMYiu2G.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ajztm40qDPqMONaSJhQ2PaNe2Xd.jpg"
  },
  {
    "id": "disney-o-rei-leao",
    "slug": "o-rei-leao",
    "title": "O Rei Leão",
    "altTitles": [
      "lion king"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "leão"
    ],
    "tmdbId": 8587,
    "year": "1994",
    "rating": 8.252,
    "overview": "Mufasa, o Rei Leão, e a rainha Sarabi apresentam ao reino o herdeiro do trono, Simba. O recém-nascido recebe a bênção do sábio babuíno Rafiki, mas ao crescer é envolvido nas artimanhas de seu tio Scar, o invejoso e maquiavélico irmão de Mufasa, que planeja livrar-se do sobrinho e herdar o trono.",
    "poster": "https://image.tmdb.org/t/p/w342/8aIvm8OaJISOpVTt7rMIh7X35G5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6GF9uJs7AnbcJvyfoZyjZv063Oo.jpg"
  },
  {
    "id": "disney-vingadores-ultimato",
    "slug": "vingadores-ultimato",
    "title": "Vingadores Ultimato",
    "altTitles": [
      "avengers endgame"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "vingadores",
      "ultimato"
    ],
    "tmdbId": 299534,
    "year": "2019",
    "rating": 8.234,
    "overview": "Após os eventos devastadores de \"Vingadores: Guerra Infinita\", o universo está em ruínas devido aos esforços do Titã Louco, Thanos. Com a ajuda de aliados remanescentes, os Vingadores devem se reunir mais uma vez a fim de desfazer as ações de Thanos e restaurar a ordem no universo de uma vez por todas, não importando as consequências.",
    "poster": "https://image.tmdb.org/t/p/w342/9fRX8UKlIW7Lb9GqNsJVakWWFCi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
  },
  {
    "id": "disney-vingadores-ultimato",
    "slug": "vingadores-ultimato",
    "title": "Vingadores: Ultimato",
    "altTitles": [
      "avengers endgame"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "vingadores",
      "ultimato",
      "avengers",
      "endgame"
    ],
    "tmdbId": 299534,
    "year": "2019",
    "rating": 8.234,
    "overview": "Após os eventos devastadores de \"Vingadores: Guerra Infinita\", o universo está em ruínas devido aos esforços do Titã Louco, Thanos. Com a ajuda de aliados remanescentes, os Vingadores devem se reunir mais uma vez a fim de desfazer as ações de Thanos e restaurar a ordem no universo de uma vez por todas, não importando as consequências.",
    "poster": "https://image.tmdb.org/t/p/w342/9fRX8UKlIW7Lb9GqNsJVakWWFCi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
  },
  {
    "id": "disney-white-collar",
    "slug": "white-collar",
    "title": "White Collar",
    "altTitles": [
      "colarinho branco"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "white",
      "collar"
    ],
    "tmdbId": 21510,
    "year": "2009",
    "rating": 8.234,
    "overview": "O charmoso vigarista Neal Caffrey escapa de uma prisão de segurança máxima, mas é recapturado por seu inimigo, o agente do FBI, Peter Burke. Com poucas opções, Caffrey ajuda o FBI a capturar outros criminosos ardilosos em troca de sua eventual liberdade. Mas em pouco tempo, Caffrey percebe que está brincando de gato e rato com aqueles que o querem de volta na prisão, ou morto.",
    "poster": "https://image.tmdb.org/t/p/w342/lXTp46LOqMV19WxN8cTUnnV4N96.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aUyweq31etaay92oF4crwdDcnoT.jpg"
  },
  {
    "id": "disney-grey-s-anatomy",
    "slug": "grey-s-anatomy",
    "title": "Grey's Anatomy",
    "altTitles": [
      "greys"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "grey's",
      "anatomy"
    ],
    "tmdbId": 1416,
    "year": "2005",
    "rating": 8.2,
    "overview": "Os médicos do Grey Sloan Memorial Hospital lidam diariamente com casos e consequências de vida ou morte. É um no outro que eles encontram apoio, conforto, amizade e, às vezes, até mais que amizade... Juntos, eles descobrem o quanto a vida profissional e a pessoal podem ser complicadas e se misturarem no meio do caminho.",
    "poster": "https://image.tmdb.org/t/p/w342/vrChGRs0DsoCoaeHif8PlZY637Q.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jP0Rhj9OTPDAwQlHQwOLFDdeE8t.jpg"
  },
  {
    "id": "disney-wandavision",
    "slug": "wandavision",
    "title": "WandaVision",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "wandavision"
    ],
    "tmdbId": 85271,
    "year": "2021",
    "rating": 8.193,
    "overview": "Wanda Maximoff  e Visão, um casal de super-heróis com uma vida perfeita, que começa a suspeitar que nem tudo é o que parece.",
    "poster": "https://image.tmdb.org/t/p/w342/8mAyDNSCZDiejPTm4lwgbztut7y.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lOr9NKxh4vMweufMOUDJjJhCRHW.jpg"
  },
  {
    "id": "disney-loki",
    "slug": "loki",
    "title": "Loki",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "loki"
    ],
    "tmdbId": 84958,
    "year": "2021",
    "rating": 8.171,
    "overview": "Começando imediatamente depois que Loki rouba o Tesseract (de novo), ele se encontra diante da Autoridade de Variação Temporal, uma organização burocrática que existe fora do tempo e espaço. Forçado a responder por seus crimes contra a linha do tempo, ele recebe uma escolha: Ser deletado da realidade ou ajudar a capturar uma ameaça ainda maior.",
    "poster": "https://image.tmdb.org/t/p/w342/2TwPJfPiBI2lVrofggw3H0b4cDC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/N1hWzVPpZ8lIQvQskgdQogxdsc.jpg"
  },
  {
    "id": "disney-alien-1979",
    "slug": "alien-1979",
    "title": "Alien",
    "altTitles": [
      "alien 1979"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "alien"
    ],
    "tmdbId": 348,
    "year": "1979",
    "rating": 8.169,
    "overview": "Quando a tripulação da sonda espacial Nostromo responde a um pedido de socorro vindo de um planeta inóspito, eles descobrem uma forma de vida mortal que se reproduz dentro de humanos. Agora, a tripulação deve lutar para permanecer viva e impedir que a criatura chegue até a Terra.",
    "poster": "https://image.tmdb.org/t/p/w342/rFHzJrkO1kNIezb6rFog5oCJUEn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/AmR3JG1VQVxU8TfAvljUhfSFUOx.jpg"
  },
  {
    "id": "disney-the-bad-batch",
    "slug": "the-bad-batch",
    "title": "The Bad Batch",
    "altTitles": [
      "star wars bad batch"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "bad",
      "batch"
    ],
    "tmdbId": 105971,
    "year": "2021",
    "rating": 8.162,
    "overview": "Meses depois dos acontecimentos em Kamino, os Mal Feitos continuam sua jornada, navegando pelo Império após a queda da República. Eles encontrarão amigos e inimigos, alguns novos, outros conhecidos, em diferentes missões mercenárias e eletrizantes que os levarão a lugares novos e perigosos.",
    "poster": "https://image.tmdb.org/t/p/w342/mMDYVkdrhTqpLSnmzF4MQ5pmrU4.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sjxtIUCWR74yPPcZFfTsToepfWm.jpg"
  },
  {
    "id": "disney-the-bear",
    "slug": "the-bear",
    "title": "The Bear",
    "altTitles": [
      "o urso"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "bear"
    ],
    "tmdbId": 136315,
    "year": "2022",
    "rating": 8.16,
    "overview": "Carmy, um jovem chefe requintado, volta para Chicago para administrar a lanchonete de sua família. Enquanto ele luta para transformar a loja e a si mesmo, ele trabalha ao lado de uma equipe medíocre que acaba se transformando na sua família.",
    "poster": "https://image.tmdb.org/t/p/w342/tAJYUFaWot3jn5vtDUoxNNIw9aF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wHNwlE6ftEpgjVbdhLXOtv1hLs0.jpg"
  },
  {
    "id": "disney-o-urso",
    "slug": "o-urso",
    "title": "O Urso",
    "altTitles": [
      "the bear"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "urso",
      "bear"
    ],
    "tmdbId": 136315,
    "year": "2022",
    "rating": 8.16,
    "overview": "Carmy, um jovem chefe requintado, volta para Chicago para administrar a lanchonete de sua família. Enquanto ele luta para transformar a loja e a si mesmo, ele trabalha ao lado de uma equipe medíocre que acaba se transformando na sua família.",
    "poster": "https://image.tmdb.org/t/p/w342/tAJYUFaWot3jn5vtDUoxNNIw9aF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wHNwlE6ftEpgjVbdhLXOtv1hLs0.jpg"
  },
  {
    "id": "disney-how-i-met-your-mother",
    "slug": "how-i-met-your-mother",
    "title": "How I Met Your Mother",
    "altTitles": [
      "himym"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "your",
      "mother"
    ],
    "tmdbId": 1100,
    "year": "2005",
    "rating": 8.132,
    "overview": "No ano de 2030, Ted Mosby, um arquiteto, decide explicar a seus filhos a história de como ele conheceu a mãe deles.",
    "poster": "https://image.tmdb.org/t/p/w342/578tlvbrpFwc959bQTT93W2RYA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3f8aW6vcYRP6mTZdgXm83BiuB9t.jpg"
  },
  {
    "id": "disney-wall-e",
    "slug": "wall-e",
    "title": "Wall-E",
    "altTitles": [
      "walle"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "wall",
      "e",
      "walle"
    ],
    "tmdbId": 10681,
    "year": "2008",
    "rating": 8.11,
    "overview": "No ano 2800, num planeta Terra devastado e sem vida, depois de centenas de anos solitários a fazer aquilo para que foi construído - limpar o planeta de lixo - o pequeno robô WALL-E descobre uma nova missão na sua vida quando conhece uma moderna e brilhante robô exploradora chamada EVE. Os dois vão viajar pela galáxia e viver uma aventura emocionante e inesquecível.",
    "poster": "https://image.tmdb.org/t/p/w342/qNiwJPVCO4cgiM8LVtxwPV2HxHS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nYs4ZwnJBK4AgljhvzwNz7fpr3E.jpg"
  },
  {
    "id": "disney-the-punisher",
    "slug": "the-punisher",
    "title": "The Punisher",
    "altTitles": [
      "punisher marvel"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "punisher"
    ],
    "tmdbId": 67178,
    "year": "2017",
    "rating": 8.1,
    "overview": "O ex-marine Frank Castle só quer punir os criminosos responsáveis pela morte da sua família, mas torna-se alvo de uma conspiração militar.",
    "poster": "https://image.tmdb.org/t/p/w342/sHwIjTM9YiNOltXD0Z20PO9JmkO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9czVEnJemvP6gcJlMEjUeuISL1c.jpg"
  },
  {
    "id": "disney-the-walking-dead",
    "slug": "the-walking-dead",
    "title": "The Walking Dead",
    "altTitles": [
      "walking dead"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "walking",
      "dead"
    ],
    "tmdbId": 1402,
    "year": "2010",
    "rating": 8.1,
    "overview": "Nos Estados Unidos pós-apocalíptico, um pequeno grupo de sobreviventes segue viajando à procura de uma nova casa longe dos mortos-vivos. O desespero por segurança e suprimentos os coloca constantemente à beira da sanidade.",
    "poster": "https://image.tmdb.org/t/p/w342/9lb02gTh4LLB17yAEXFd4C3R4JP.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rAOjnEFTuNysY7bot8zonhImGMh.jpg"
  },
  {
    "id": "disney-what-if",
    "slug": "what-if",
    "title": "What If...?",
    "altTitles": [
      "what if marvel"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "what",
      "if"
    ],
    "tmdbId": 91363,
    "year": "2021",
    "rating": 8.1,
    "overview": "\"What If…?\" reinventa os acontecimentos do UCM, mudando a história de forma surpreendente.",
    "poster": "https://image.tmdb.org/t/p/w342/kJQWrrwtu0TAsIKq8Adgzeg4bFt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jnzoh5qoxRLFRIQAxnl6D3RStPC.jpg"
  },
  {
    "id": "disney-prison-break",
    "slug": "prison-break",
    "title": "Prison Break",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "prison",
      "break"
    ],
    "tmdbId": 2288,
    "year": "2005",
    "rating": 8.067,
    "overview": "Lincoln Burrows é condenado injustamente à pena de morte. Só lhe resta confiar no irmão Michael Scofield, que executa um plano de fuga e se vê no meio de uma perigosa conspiração.",
    "poster": "https://image.tmdb.org/t/p/w342/rK3Vwe0Wm0VXxf4IJCdlHeEREYx.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/n3Brk7roueE9HOwVmYlJx5j462g.jpg"
  },
  {
    "id": "disney-beatles-get-back",
    "slug": "beatles-get-back",
    "title": "The Beatles: Get Back",
    "altTitles": [
      "beatles get back"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "beatles",
      "get",
      "back"
    ],
    "tmdbId": 923403,
    "year": "2022",
    "rating": 8.048,
    "overview": "Em 1969, Paul McCartney, John Lennon, George Harrison e Ringo Starr subiram no terraço do prédio da Apple Corps, localizado na Savile Row, em Londres, e cantaram pela última vez ao vivo como os Beatles.",
    "poster": "https://image.tmdb.org/t/p/w342/4MPsj31FTnfXg1NO93lzr3PqNuE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/koO1QBG9FcuO3BuY09tDQz0XLfn.jpg"
  },
  {
    "id": "disney-os-simpsons",
    "slug": "os-simpsons",
    "title": "Os Simpsons",
    "altTitles": [
      "simpsons"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "simpsons"
    ],
    "tmdbId": 456,
    "year": "1989",
    "rating": 8.014,
    "overview": "Uma animação sobre uma típica família dos Estados Unidos. Homer é o pai de família nada saudável ou inteligente, que adora beber cerveja. Marge é a esposa e mãe de família dedicada. Bart é o filho de 10 anos, que não leva a escola a sério e tem orgulho disso. Lisa é a garota de 8 anos, um gênio não apreciado. E Maggie é a bebê que não larga a chupeta.",
    "poster": "https://image.tmdb.org/t/p/w342/1jGPgDDcmg3Xgs3WO8sfYfbnFoA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jIArNHIekrCSVgdMbKPAXpPY03Y.jpg"
  },
  {
    "id": "disney-ford-vs-ferrari",
    "slug": "ford-vs-ferrari",
    "title": "Ford vs Ferrari",
    "altTitles": [
      "le mans 66"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "ford",
      "ferrari"
    ],
    "tmdbId": 359724,
    "year": "2019",
    "rating": 8.005,
    "overview": "O designer de carros americano Carroll Shelby e o destemido piloto britânico Ken Miles juntos combatem a interferência corporativa e as leis da física para construir um carro de corrida revolucionário e enfrentar Enzo Ferrari nas 24 horas de Le Mans na França em 1966.",
    "poster": "https://image.tmdb.org/t/p/w342/t8L9dqNMclXJHP0TesPsPS2RvB1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2vq5GTJOahE03mNYZGxIynlHcWr.jpg"
  },
  {
    "id": "disney-o-que-fazemos-nas-sombras",
    "slug": "o-que-fazemos-nas-sombras",
    "title": "O Que Fazemos nas Sombras",
    "altTitles": [
      "what we do in the shadows"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "fazemos",
      "sombras",
      "shadows"
    ],
    "tmdbId": 83631,
    "year": "2019",
    "rating": 8.005,
    "overview": "Um olhar sobre a vida cotidiana de quatro vampiros que estão juntos há centenas de anos. Após a visita de seu senhor e líder sombrio, eles são lembrados de seu propósito em vir a Nova York há mais de um século.",
    "poster": "https://image.tmdb.org/t/p/w342/cWsC3SWssTIBVxA2nZenacBgYh2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mKikck71CvVISUSTLk29fwRbH4y.jpg"
  },
  {
    "id": "disney-lost",
    "slug": "lost",
    "title": "Lost",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "lost"
    ],
    "tmdbId": 4607,
    "year": "2004",
    "rating": 8,
    "overview": "Os sobreviventes de um voo que estava milhas fora do curso caem em uma ilha que abriga um sistema de segurança monstruoso, uma série de abrigos subterrâneos e um grupo de sobrevivencialistas violentos escondidos nas sombras.",
    "poster": "https://image.tmdb.org/t/p/w342/h0AIjSt9u2yjSzgTBhuQZVCXwCv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/yUOFocKDW7MCC5isx4FK8A68QFp.jpg"
  },
  {
    "id": "disney-high-school-musical-serie",
    "slug": "high-school-musical-serie",
    "title": "High School Musical: A Série",
    "altTitles": [
      "high school musical the musical the series",
      "hsmtmts"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "high",
      "school",
      "musical"
    ],
    "tmdbId": 85801,
    "year": "2019",
    "rating": 8,
    "overview": "Treze anos após \"High School Musical\" ter sido filmado na East High, o departamento de teatro está criando uma nova montagem ambiciosa: \"High School Musical: O Musical\"! Uma nova turma de jovens irá encarar os papeis de Grabiela, Troy, Ryan, Sharpay e todos os outros – com bastante drama escolar dentro e fora do palco!",
    "poster": "https://image.tmdb.org/t/p/w342/66rTi7wHI8IZ9lWClY876hTegNi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uUojnsT9WVrGG4eiQheaDkPUI9M.jpg"
  },
  {
    "id": "disney-castle",
    "slug": "castle",
    "title": "Castle",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "castle"
    ],
    "tmdbId": 1419,
    "year": "2009",
    "rating": 7.975,
    "overview": "Richard Castle é um dos autores de livros de crimes mais bem-sucedidos do mundo. Mas quando seu estilo de vida de estrela de rock não é suficiente, este bad boy encontra a bela e inteligente detetive Kate Beckett.",
    "poster": "https://image.tmdb.org/t/p/w342/diXBeMzvfJb2iJg3G0kCUaMCzEc.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/zOnLMRD3PIhwO5KZmWMVEnLokMo.jpg"
  },
  {
    "id": "disney-cruella",
    "slug": "cruella",
    "title": "Cruella",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "cruella"
    ],
    "tmdbId": 337404,
    "year": "2021",
    "rating": 7.972,
    "overview": "Na Londres dos anos 70 em meio à revolução do punk rock, Estella, uma garota inteligente e criativa determinada a fazer um nome para si através de seus designs. Ela faz amizade com uma dupla de jovens ladrões e, juntos, constroem uma vida para si nas ruas de Londres. Um dia, o talento de Estella para a moda chama a atenção da Baronesa Von Hellman, uma lenda fashion que é devastadoramente chique e assustadora. Mas o relacionamento delas desencadeia um curso de eventos e revelações que farão com que Estella abrace seu lado rebelde e se torne a Cruella má, elegante e voltada para a vingança.",
    "poster": "https://image.tmdb.org/t/p/w342/ljPHd7WiPVKmuXi1hgQUpZQslbC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg"
  },
  {
    "id": "disney-toy-story",
    "slug": "toy-story",
    "title": "Toy Story",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "story"
    ],
    "tmdbId": 862,
    "year": "1995",
    "rating": 7.971,
    "overview": "Buzz Lightyear é o novo e sofisticado astronauta de brinquedo do garoto Andy. Buzz não imaginava que encontraria um rival: Woody, um cowboy de brinquedo que, dominado pelo ciúme, acredita ter perdido um lugar precioso no coração do seu dono. Os dois brinquedos vivem brigando até que vão parar nas garras do vizinho, um verdadeiro destruidor de brinquedos. Agora, mais do que nunca, Buzz e Woody precisam precisam se unir para escapar do perigo. Com a ajuda de seus amigos da caixa de brinquedos, eles vão viver uma incrível aventura.",
    "poster": "https://image.tmdb.org/t/p/w342/6AafgfifXkFS4g2xGJZIwsPQK6P.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg"
  },
  {
    "id": "disney-o-sexto-sentido",
    "slug": "o-sexto-sentido",
    "title": "O Sexto Sentido",
    "altTitles": [
      "the sixth sense"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "sexto",
      "sentido",
      "sixth",
      "sense"
    ],
    "tmdbId": 745,
    "year": "1999",
    "rating": 7.95,
    "overview": "Dr. Malcolm Crowe é um conceituado psicólogo infantil, que vive atormentado pela terrível lembrança de um jovem paciente que ele não foi capaz de ajudar. Quando ele encontra Cole Sear, um garoto de 8 anos assustado e confuso, com um problema similar, Dr. Crowe procura redimir seu erro do passado, fazendo tudo que pode pelo menino. Apesar disso, Malcolm não está preparado para descobrir a verdade que aterroriza Cole.",
    "poster": "https://image.tmdb.org/t/p/w342/ds7jw0WYCd6k7hBzMnzgFsTfg96.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6TjllWT3cGrPFyqDXurVZ3L8bBi.jpg"
  },
  {
    "id": "disney-guardioes-galaxia-3",
    "slug": "guardioes-galaxia-3",
    "title": "Guardiões da Galáxia Vol. 3",
    "altTitles": [
      "guardians of the galaxy vol 3"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "guardioes",
      "galaxia",
      "3"
    ],
    "tmdbId": 447365,
    "year": "2023",
    "rating": 7.923,
    "overview": "Peter Quill, que ainda está se recuperando da perda de Gamora, tem que reunir a sua equipe para defender o universo e proteger um dos seus. Uma missão que, se não for concluída com sucesso, pode levar ao fim dos Guardiões como os conhecemos.",
    "poster": "https://image.tmdb.org/t/p/w342/4yycSPnchdNAZirGkmCYQwTd3cr.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
  },
  {
    "id": "disney-divertida-mente",
    "slug": "divertida-mente",
    "title": "Divertida Mente",
    "altTitles": [
      "inside out"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "divertida",
      "mente"
    ],
    "tmdbId": 150540,
    "year": "2015",
    "rating": 7.909,
    "overview": "Quando Riley, de 11 anos, se muda para uma nova cidade, suas Emoções - Alegria, Medo, Raiva, Nojinho e Tristeza trabalham juntas para ajudá-la na transição. Porém, uma série de eventos faz com que Alegria e Tristeza se envolvam em uma perigosa aventura que virará o mundo de Riley de cabeça para baixo.",
    "poster": "https://image.tmdb.org/t/p/w342/62SAZfLfzhxJWUFJvfIPMw6QUpE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/o3i6AfTcWAuNvzAUV3q5lOmi6Gx.jpg"
  },
  {
    "id": "disney-modern-family",
    "slug": "modern-family",
    "title": "Modern Family",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "modern",
      "family"
    ],
    "tmdbId": 1421,
    "year": "2009",
    "rating": 7.906,
    "overview": "Você consegue acreditar que todos eles são parentes? Nem eles! Modern Family nos traz uma divertida e inovadora visão do que significa criar uma família nesta época doida em que vivemos. Relacionamentos multiculturais, adoção e casamento de pessoas do mesmo sexo são apenas alguns dos assuntos atuais abordados por esta série que os analisa de modo divertido e sensível. Não importa o tamanho ou a formação, a família sempre vem no primeiro neste hilário modo de olhar \"moderno\" que foca a vida, o amor e as gargalhadas.",
    "poster": "https://image.tmdb.org/t/p/w342/gGOZeGx3ggP5O9qvswRPN7PRVWn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nO7EzksrBzlNpAg5rgv8HzaBIkx.jpg"
  },
  {
    "id": "disney-guardioes-galaxia-1",
    "slug": "guardioes-galaxia-1",
    "title": "Guardiões da Galáxia",
    "altTitles": [
      "guardians of the galaxy"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "guardioes",
      "galaxia",
      "guardians"
    ],
    "tmdbId": 118340,
    "year": "2014",
    "rating": 7.905,
    "overview": "Abduzido da Terra quando ainda era criança, Peter Quill fez carreira como saqueador e se auto denominou \"Senhor das Estrelas\". Quando rouba uma esfera, na qual o poderoso vilão Ronan, da raça kree, está interessado, passa a ser procurado por vários caçadores de recompensas. Para escapar do perigo, Quill une forças com quatro personagens fora do sistema: Groot, uma árvore humanóide (Vin Diesel), a sombria e perigosa Gamora, o guaxinim rápido no gatilho Rocket Racoon e o vingativo Drax, o Destruidor. A esfera roubada é capaz de mudar o destino de todo o universo.",
    "poster": "https://image.tmdb.org/t/p/w342/xaY92XMToaSnBuvCui3LHzNGqZB.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uLtVbjvS1O7gXL8lUOwsFOH4man.jpg"
  },
  {
    "id": "disney-titanic",
    "slug": "titanic",
    "title": "Titanic",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "titanic"
    ],
    "tmdbId": 597,
    "year": "1997",
    "rating": 7.902,
    "overview": "Um artista pobre e uma jovem rica se conhecem e se apaixonam na fatídica jornada do Titanic, em 1912. Embora esteja noiva do arrogante herdeiro de uma siderúrgica, a jovem desafia sua família e amigos em busca do verdadeiro amor.",
    "poster": "https://image.tmdb.org/t/p/w342/As0zX43h3w6kD2NS4uVHu9HKdEh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qBChUbS8ksbJoPTfZpogsnxG5tY.jpg"
  },
  {
    "id": "disney-desperate-housewives",
    "slug": "desperate-housewives",
    "title": "Desperate Housewives",
    "altTitles": [
      "esposas desesperadas"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "desperate",
      "housewives"
    ],
    "tmdbId": 693,
    "year": "2004",
    "rating": 7.898,
    "overview": "Atrás da fachada perfeita de cartão postal de um condomínio fechado vivem quatro mulheres cujas vidas podem ser qualquer coisa, menos idílicas. A desajeitada Susan é divorciada e mãe da adolescente Julie. Lynette é casada com Tom e a mãe estressada de quatro filhos indisciplinados. Bree é a Martha Stewart da vizinhança, mas sua perfeição mascara seus desajustes. A ex-modelo Gabrielle, casada com o bonitão e bem-sucedido Carlos, quer ter tudo sem abrir mão de nada. Assistindo a tudo isso está Mary Alice, que se suicidou mas comenta sobre a vida de seus ex-vizinhos.",
    "poster": "https://image.tmdb.org/t/p/w342/q7pPKBq79FwgPRA8jaETWrURd5R.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kub3bZS2sOGviEjo4p1ohREboVb.jpg"
  },
  {
    "id": "disney-phineas-e-ferb",
    "slug": "phineas-e-ferb",
    "title": "Phineas e Ferb",
    "altTitles": [
      "phineas and ferb"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "phineas",
      "ferb"
    ],
    "tmdbId": 1877,
    "year": "2007",
    "rating": 7.894,
    "overview": "Todos os dias, dois meio-irmãos nas férias de verão embarcam em um grande novo projeto, o que irrita sua irmã controladora, Candace, que sempre tenta entrega-los para sua mãe. Enquanto isso, seu animal de estimação Perry o ornitorrinco luta contra o malvado Dr. Doofenshmirtz.",
    "poster": "https://image.tmdb.org/t/p/w342/cu2nJgERq8ZmRUlBFPsamdJb7rh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5MWFjQ3NuNtNeOE9FdrVLeNMNPs.jpg"
  },
  {
    "id": "disney-o-grande-showman",
    "slug": "o-grande-showman",
    "title": "O Grande Showman",
    "altTitles": [
      "the greatest showman"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "grande",
      "showman",
      "greatest"
    ],
    "tmdbId": 316029,
    "year": "2017",
    "rating": 7.862,
    "overview": "De origem humilde e desde a infância sonhando com um mundo mágico, P.T. Barnum desafia as barreiras sociais se casando com a filha do patrão do pai e dá o pontapé inicial na realização de seu maior desejo abrindo uma espécie de museu de curiosidades. O empreendimento fracassa, mas ele logo vislumbra uma ousada saída: produzir um grande show estrelado por freaks, fraudes, bizarrices e rejeitados de todos os tipos.",
    "poster": "https://image.tmdb.org/t/p/w342/NUce1PoO7j0CLLwUQRrBbyKveg.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lrNKm3HNvGdZoAfiBKu7b04FLHN.jpg"
  },
  {
    "id": "disney-indiana-jones",
    "slug": "indiana-jones",
    "title": "Indiana Jones",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "indiana",
      "jones"
    ],
    "tmdbId": 89,
    "year": "1989",
    "rating": 7.851,
    "overview": "O arqueólogo Indiana Jones tem acesso à um misterioso envelope que contém informações sobre a localização do lendário Santo Graal, o cálice que Jesus Cristo teria utilizado na Última Ceia. Quando seu pai, o professor Henry Jones, é sequestrado pelos nazistas, o aventureiro irá embarcar numa missão perigosa para salvá-lo e impedir que a relíquia sagrada caia em mãos erradas.",
    "poster": "https://image.tmdb.org/t/p/w342/cJP4wT4RB85E3gbwRe3LWJORXXM.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/12fvZHskx57kQfNEUXJ3v0flWYQ.jpg"
  },
  {
    "id": "disney-ratatouille",
    "slug": "ratatouille",
    "title": "Ratatouille",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "ratatouille"
    ],
    "tmdbId": 2062,
    "year": "2007",
    "rating": 7.838,
    "overview": "Remy, morador de Paris, aprecia boa comida e tem um paladar bastante sofisticado. Ele adoraria se tornar um chef para poder criar e desfrutar de obras-primas culinárias para o deleite de seu coração. O único problema é que Remy é um rato. Quando acaba no esgoto debaixo de um dos melhores restaurantes de Paris, o roedor gourmet encontra-se na posição ideal para realizar o seu sonho.",
    "poster": "https://image.tmdb.org/t/p/w342/41Co0TRUJNyvjr2vHBEcAKAEFpX.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xgDj56UWyeWQcxQ44f5A3RTWuSs.jpg"
  },
  {
    "id": "disney-chucky",
    "slug": "chucky",
    "title": "Chucky",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "chucky"
    ],
    "tmdbId": 90462,
    "year": "2021",
    "rating": 7.821,
    "overview": "Depois que um boneco Chucky \"vintage\" aparece em uma venda de quintal, uma pequena e pacata cidade do interior norte americano é lançada no caos enquanto uma série de assassinatos horríveis começa a expor os segredos da localidade.",
    "poster": "https://image.tmdb.org/t/p/w342/sdCJbGkvnIsIKLxaFQrviriODVq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lyZmMTwpr6ZCXKA7lszpXcDwNOM.jpg"
  },
  {
    "id": "disney-piratas-do-caribe",
    "slug": "piratas-do-caribe",
    "title": "Piratas do Caribe: A Maldição do Pérola Negra",
    "altTitles": [
      "pirates of the caribbean"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "piratas",
      "caribe",
      "pirates",
      "caribbean"
    ],
    "tmdbId": 22,
    "year": "2003",
    "rating": 7.82,
    "overview": "O pirata Jack Sparrow tem seu navio saqueado e roubado pelo capitão Barbossa e sua tripulação. Com o navio de Sparrow, Barbossa invade a cidade de Port Royal, levando consigo Elizabeth Swann, filha do governador. Para recuperar sua embarcação, Sparrow recebe a ajuda de Will Turner, um grande amigo de Elizabeth. Eles desbravam os mares em direção à misteriosa Ilha da Morte, tentando impedir que os piratas-esqueleto derramem o sangue de Elizabeth para desfazer a maldição que os assola.",
    "poster": "https://image.tmdb.org/t/p/w342/9Xcg7Ar4ketv4rl8yeK32yp9zQA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uRNgkJSkNBFbbn9fPsEjDIy8Sh3.jpg"
  },
  {
    "id": "disney-duro-de-matar",
    "slug": "duro-de-matar",
    "title": "Duro de Matar",
    "altTitles": [
      "die hard"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "duro",
      "matar",
      "die",
      "hard"
    ],
    "tmdbId": 562,
    "year": "1988",
    "rating": 7.809,
    "overview": "O policial de Nova York John McClane está visitando sua família no Natal. Ele participa de uma confraternização de fim de ano na sede da empresa japonesa em que a esposa trabalha. A festa é interrompida por terroristas que invadem o edifício de luxo. McClane não demora a perceber que não há ninguém para salvá-los, a não ser ele próprio.",
    "poster": "https://image.tmdb.org/t/p/w342/2PD0HHoyVVAEUhep9JhlKtgyl8m.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bvk2AAH64lP2YZs02Q3jskfHT8j.jpg"
  },
  {
    "id": "disney-logan",
    "slug": "logan",
    "title": "Logan",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "logan"
    ],
    "tmdbId": 263115,
    "year": "2017",
    "rating": 7.8,
    "overview": "Em um futuro próximo, um cansado Logan cuida do doente Professor Xavier em um esconderijo na fronteira mexicana. Mas as tentativas de Logan de se esconder do mundo e de seu legado são interrompidas com a chegada de uma jovem mutante, perseguida por forças sombrias.",
    "poster": "https://image.tmdb.org/t/p/w342/f0CtZbae9cXj8bkWdCHzUHx5lsR.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4DZxWNSAyksN6N3JkvpJ53Yq6zU.jpg"
  },
  {
    "id": "disney-gaviao-arqueiro",
    "slug": "gaviao-arqueiro",
    "title": "Gavião Arqueiro",
    "altTitles": [
      "hawkeye"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "gavião",
      "arqueiro"
    ],
    "tmdbId": 88329,
    "year": "2021",
    "rating": 7.8,
    "overview": "O ex-vingador Clint Barton tem uma missão aparentemente simples: voltar para sua família no Natal. Será possível? Talvez com a ajuda de Kate Bishop, uma arqueira de 22 anos que sonha em se tornar uma super-heroína. Os dois são forçados a trabalhar juntos quando uma presença do passado de Barton ameaça descarrilar muito mais do que o espírito festivo.",
    "poster": "https://image.tmdb.org/t/p/w342/yPRl1dvc0FHi8Syy1XhsoMumw9J.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1R68vl3d5s86JsS2NPjl8UoMqIS.jpg"
  },
  {
    "id": "disney-24-horas",
    "slug": "24-horas",
    "title": "24 Horas",
    "altTitles": [
      "24"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "horas"
    ],
    "tmdbId": 1973,
    "year": "2001",
    "rating": 7.8,
    "overview": "O Agente federal Jack Bauer não se pode dar ao luxo de jogar pelas  regras. Como membro da UCT (Unidade Contra Terrorismo), Jack deve parar  bombas, vírus, tentativas de assassinato, e geralmente salvar alguém que  lhe é próximo. Cada temporada da série tem 24 episódios, cada um, em  desdobramento em tempo real, de uma hora consecutiva num dia muito ruim.",
    "poster": "https://image.tmdb.org/t/p/w342/nmR2wQIilYPzX0xXVcHyJCT8RTI.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/be6mDIMv7cg8duWkcYVnTB8rphO.jpg"
  },
  {
    "id": "disney-bem-vindos-ao-wrexham",
    "slug": "bem-vindos-ao-wrexham",
    "title": "Bem-Vindos ao Wrexham",
    "altTitles": [
      "welcome to wrexham"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "wrexham",
      "bem",
      "vindos"
    ],
    "tmdbId": 126929,
    "year": "2022",
    "rating": 7.8,
    "overview": "Rob McElhenney e Ryan Reynolds dirigem o Wrexham Football Club enquanto tentam criar uma história de azarão pela qual o mundo possa torcer. De Hollywood ao País de Gales, a série documental acompanha o curso intensivo em comandar um clube de futebol e os destinos intimamente conectados de uma equipe e de uma cidade que conta com os dois atores para trazer esperança e mudanças.",
    "poster": "https://image.tmdb.org/t/p/w342/2FmgHo3CoaMqMBlAScjNlXIrK6u.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/dA6innktqCBLE1kpGW1W1XGaRd0.jpg"
  },
  {
    "id": "disney-ducktales",
    "slug": "ducktales",
    "title": "DuckTales",
    "altTitles": [
      "patoaventuras"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "ducktales",
      "patoaventuras"
    ],
    "tmdbId": 72350,
    "year": "2017",
    "rating": 7.8,
    "overview": "Baseado no clássico dos anos 1980 e 1990, Ducktales acompanha as andanças do Tio Patinhas com Pato Donald e os trigêmeos Huguinho, Zezinho e Luizinho. Juntos, eles irão atrás do tesouro escondido da família.",
    "poster": "https://image.tmdb.org/t/p/w342/9FsIGJeCS3lCiXU7gICBSgjOPIW.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tco0lyOHy3bjy2hyishbuCk0Yvg.jpg"
  },
  {
    "id": "disney-luca",
    "slug": "luca",
    "title": "Luca",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "luca"
    ],
    "tmdbId": 508943,
    "year": "2021",
    "rating": 7.783,
    "overview": "Ambientado na bela Riviera Italiana, este longa-metragem da Disney e da Pixar acompanha as aventuras do garoto Luca durante um verão inesquecível repleto de macarronadas, gelatos e passeios incríveis de motoneta ao lado de seu novo amigo Alberto. Mas um grande segredo ameaça colocar fim à diversão: abaixo da superfície da água, eles são monstros marinhos!",
    "poster": "https://image.tmdb.org/t/p/w342/m6Ockf2oYhxXoBIBaRLDwCOE410.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/620hnMVLu6RSZW6a5rwO8gqpt0t.jpg"
  },
  {
    "id": "disney-star-wars-rebels",
    "slug": "star-wars-rebels",
    "title": "Star Wars Rebels",
    "altTitles": [
      "rebels star wars"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "rebels",
      "star",
      "wars"
    ],
    "tmdbId": 60554,
    "year": "2014",
    "rating": 7.716,
    "overview": "Os Jedi foram exterminados e o Império espalha tirania pela galáxia. A  esperança é quase inexistente. Mas no pequeno planeta de Lothal uma  grande mudança está próxima. Um grupo de rebeldes encontram um garoto de  14 anos de idade chamado Ezra e logo fica claro que os seus destinos  estão ligados. A bordo de sua nave, Ghost, Ezra e os rebeldes embarcam  em uma aventura para iniciar uma rebelião e contra-atacar o Império.",
    "poster": "https://image.tmdb.org/t/p/w342/eLrScs6Bs26JMcS8hiZhf7YRROr.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/8BNjxMJMFp0BgqMh4PyuwZMXxh1.jpg"
  },
  {
    "id": "disney-hamilton",
    "slug": "hamilton",
    "title": "Hamilton",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "hamilton"
    ],
    "tmdbId": 556574,
    "year": "2025",
    "rating": 7.697,
    "overview": "Hamilton é um musical que conta a história da América por vozes americanas. Por meio da história de um dos principais fundadores americanos e primeiro secretário do Tesouro, Alexander Hamilton, a trilha sonora que mistura hip-hop, jazz, R&B e Broadway revoluciona o teatro no The Richard Rodgers Theatre, na Broadway, em junho de 2016.",
    "poster": "https://image.tmdb.org/t/p/w342/h1B7tW0t399VDjAcWJh8m87469b.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uWVkEo9PWHu9algZsiLPi6sRU64.jpg"
  },
  {
    "id": "disney-homem-de-ferro",
    "slug": "homem-de-ferro",
    "title": "Homem de Ferro",
    "altTitles": [
      "iron man"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "homem",
      "ferro"
    ],
    "tmdbId": 1726,
    "year": "2008",
    "rating": 7.657,
    "overview": "Tony Stark é um industrial bilionário, que também é um brilhante inventor. Ao ser sequestrado ele é obrigado por terroristas a construir uma arma devastadora mas, ao invés disto, constrói uma armadura de alta tecnologia que permite que fuja de seu cativeiro. A partir de então ele passa a usá-la para combater o crime, sob o alter ego do Homem de Ferro.",
    "poster": "https://image.tmdb.org/t/p/w342/mqN7RxojEiPoh3FTSTwOtwg7KAu.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cKvDv2LpwVEqbdXWoQl4XgGN6le.jpg"
  },
  {
    "id": "disney-capitao-america-o-soldado-invernal",
    "slug": "capitao-america-o-soldado-invernal",
    "title": "Capitão América O Soldado Invernal",
    "altTitles": [
      "winter soldier"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "capitão",
      "américa",
      "soldado"
    ],
    "tmdbId": 100402,
    "year": "2014",
    "rating": 7.653,
    "overview": "Após os eventos catastróficos em Nova York com Os Vingadores, Steve Rogers segue tentando se ajustar ao mundo moderno. Porém, quando um colega da agência S.H.I.E.L.D. é atacado, Steve se vê preso em uma rede de intrigas que ameaça colocar o mundo em risco. Em parceria com a Viúva Negra e Falcão, seu novo aliado, o Capitão América tem que enfrentar um misterioso e inesperado inimigo, o Soldado Invernal.",
    "poster": "https://image.tmdb.org/t/p/w342/9sTDXtIIfHza1rAbmHU2djyzEXA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1RWLMyC9KcFfcaoViMiJGSSZzzr.jpg"
  },
  {
    "id": "disney-capitao-america-soldado",
    "slug": "capitao-america-soldado",
    "title": "Capitão América: O Soldado Invernal",
    "altTitles": [
      "captain america winter soldier"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "capitao",
      "america",
      "soldado",
      "invernal"
    ],
    "tmdbId": 100402,
    "year": "2014",
    "rating": 7.653,
    "overview": "Após os eventos catastróficos em Nova York com Os Vingadores, Steve Rogers segue tentando se ajustar ao mundo moderno. Porém, quando um colega da agência S.H.I.E.L.D. é atacado, Steve se vê preso em uma rede de intrigas que ameaça colocar o mundo em risco. Em parceria com a Viúva Negra e Falcão, seu novo aliado, o Capitão América tem que enfrentar um misterioso e inesperado inimigo, o Soldado Invernal.",
    "poster": "https://image.tmdb.org/t/p/w342/9sTDXtIIfHza1rAbmHU2djyzEXA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1RWLMyC9KcFfcaoViMiJGSSZzzr.jpg"
  },
  {
    "id": "disney-cavaleiro-da-lua",
    "slug": "cavaleiro-da-lua",
    "title": "Cavaleiro da Lua",
    "altTitles": [
      "moon knight"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "cavaleiro"
    ],
    "tmdbId": 92749,
    "year": "2022",
    "rating": 7.649,
    "overview": "A série acompanha Steven Grant, um gentil e educado funcionário de uma loja de souvenir, que é atormentado com apagões e memórias de outra vida. Steven descobre que tem transtorno dissociativo de identidade e divide o corpo com o mercenário Marc Spector. À medida que os inimigos de Steven/Marc se voltam para eles, ambos devem navegar em suas complexas identidades enquanto mergulham em um mistério mortal entre os poderosos deuses do Egito.",
    "poster": "https://image.tmdb.org/t/p/w342/tkc7AVyUoG9VEeDvukN0TVqa24C.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/iux1vKPT7Vw1AzetZb4Jz6wfYsm.jpg"
  },
  {
    "id": "disney-kingsman",
    "slug": "kingsman",
    "title": "Kingsman: Serviço Secreto",
    "altTitles": [
      "the kingsman secret service"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "kingsman"
    ],
    "tmdbId": 207703,
    "year": "2015",
    "rating": 7.619,
    "overview": "Eggsy é um jovem com problemas de disciplina que parece perto de se tornar um criminoso. Determinado dia, ele entra em contato com Harry, que lhe apresenta à agência de espionagem Kingsman. O jovem se une a um time de recrutas em busca de uma vaga na agência. Ao mesmo tempo, Harry tenta impedir a ascensão do vilão Valentine.",
    "poster": "https://image.tmdb.org/t/p/w342/wDhy1Ga9BoLwkHOI0jJISQem28v.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qzUIOTk0E3F1zjvYjcBRTKUTgf9.jpg"
  },
  {
    "id": "disney-falcao-e-o-soldado-invernal",
    "slug": "falcao-e-o-soldado-invernal",
    "title": "Falcão e o Soldado Invernal",
    "altTitles": [
      "falcon winter soldier"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "falcão",
      "soldado",
      "invernal"
    ],
    "tmdbId": 88396,
    "year": "2021",
    "rating": 7.602,
    "overview": "Após os eventos de \"Vingadores: Ultimato\", Sam Wilson/Falcão e Bucky Barnes/Soldado Invernal se unem em uma aventura que testa suas habilidades - e a paciência.",
    "poster": "https://image.tmdb.org/t/p/w342/oF9njYCN6lBdrsi6wfulcxTggvn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aTjbqMONy77fHJrIYu14g1F0d5h.jpg"
  },
  {
    "id": "disney-avatar-o-caminho-da-agua",
    "slug": "avatar-o-caminho-da-agua",
    "title": "Avatar O Caminho da Água",
    "altTitles": [
      "way of water"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "avatar",
      "caminho",
      "água"
    ],
    "tmdbId": 76600,
    "year": "2022",
    "rating": 7.593,
    "overview": "12 anos depois de explorar Pandora e se juntar aos Na'vi, Jake Sully formou uma família com Neytiri e se estabeleceu entre os clãs do novo mundo. Porém, a paz não durará para sempre.",
    "poster": "https://image.tmdb.org/t/p/w342/hm6nONQOgVpKmRK5YUX9EqfJ0NH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kJsPVzdyBrYHLomuNv5SJDXUQ2f.jpg"
  },
  {
    "id": "disney-avatar-caminho-da-agua",
    "slug": "avatar-caminho-da-agua",
    "title": "Avatar: O Caminho da Água",
    "altTitles": [
      "avatar the way of water",
      "avatar 2"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "avatar",
      "caminho",
      "agua"
    ],
    "tmdbId": 76600,
    "year": "2022",
    "rating": 7.593,
    "overview": "12 anos depois de explorar Pandora e se juntar aos Na'vi, Jake Sully formou uma família com Neytiri e se estabeleceu entre os clãs do novo mundo. Porém, a paz não durará para sempre.",
    "poster": "https://image.tmdb.org/t/p/w342/hm6nONQOgVpKmRK5YUX9EqfJ0NH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kJsPVzdyBrYHLomuNv5SJDXUQ2f.jpg"
  },
  {
    "id": "disney-a-culpa-e-das-estrelas",
    "slug": "a-culpa-e-das-estrelas",
    "title": "A Culpa é das Estrelas",
    "altTitles": [
      "fault in our stars"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "culpa",
      "estrelas"
    ],
    "tmdbId": 222935,
    "year": "2014",
    "rating": 7.591,
    "overview": "Hazel e Gus dividem um senso de humor sarcástico, um desgosto por convenções sociais e, por fim uma amor que vai levá-lo para uma jornada transformadora e inesquecível. Embora os dois adolescentes enfrentem desafios extraordinários, sua coragem e dedicação ao outro provam que a vida pode não ser perfeita, mas o amor é.",
    "poster": "https://image.tmdb.org/t/p/w342/bzI1Fmh5FakSB1MEf4OVwgILRvz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/oQaVV7p916HO5MDI820zzs1pin9.jpg"
  },
  {
    "id": "disney-homeland",
    "slug": "homeland",
    "title": "Homeland",
    "altTitles": [
      "homeland seguranca nacional"
    ],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "homeland"
    ],
    "tmdbId": 1407,
    "year": "2011",
    "rating": 7.589,
    "overview": "Um soldado americano a quem acreditavam ter sido morto no Iraque volta depois de oito anos de seu desaparecimento. Mas, depois de sua volta para casa, surgem suspeitas a respeito de ele ser realmente um herói americano ou parte de uma célula adormecida que planeja um ataque terrorista.",
    "poster": "https://image.tmdb.org/t/p/w342/1hFGIgADHv24zyuDpByQNqspED5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/391ixi0wVbFtFLQnOy8ZncWv2io.jpg"
  },
  {
    "id": "disney-thor-ragnarok",
    "slug": "thor-ragnarok",
    "title": "Thor: Ragnarok",
    "altTitles": [
      "thor ragnarok"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "thor",
      "ragnarok"
    ],
    "tmdbId": 284053,
    "year": "2017",
    "rating": 7.581,
    "overview": "Thor está preso do outro lado do universo. Ele precisa correr contra o tempo para voltar a Asgard e parar Ragnarok, a destruição de seu mundo, que está nas mãos da poderosa e implacável vilã Hela.",
    "poster": "https://image.tmdb.org/t/p/w342/2K45Fp6koAVoeeYS6aMb9BeNt4F.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6G2fLCVm9fiLyHvBrccq6GSe2ih.jpg"
  },
  {
    "id": "disney-encanto",
    "slug": "encanto",
    "title": "Encanto",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "encanto"
    ],
    "tmdbId": 568124,
    "year": "2021",
    "rating": 7.57,
    "overview": "Uma garota chamada Mirabel Madrigal cresce como o único membro não mágico de sua família, que vivem escondidos em uma vibrante casa encantada nas montanhas da Colômbia.",
    "poster": "https://image.tmdb.org/t/p/w342/uWwgb89vSbNNtSPCpIKdbxqi5if.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3G1Q5xF40HkUBJXxt2DQgQzKTp5.jpg"
  },
  {
    "id": "disney-mary-poppins",
    "slug": "mary-poppins",
    "title": "Mary Poppins",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "mary",
      "poppins"
    ],
    "tmdbId": 433,
    "year": "1964",
    "rating": 7.542,
    "overview": "Na Londres de 1910, o banqueiro Mr. Banks, um homem frio que trata com rigidez Jane e Michael, seus filhos sapecas, não consegue contratar uma babá, pois elas desistem facilmente do emprego. Em uma noite, enquanto redige com sua esposa um anúncio de jornal procurando uma babá, sua filha Jane aparece com uma carta mostrando como seria uma babá perfeita. Esta carta acaba chegando nas mãos de Mary Poppins, que é tudo aquilo que está descrito na carta. Mary Poppins possui poderes mágicos e, com seu amigo faz-tudo Bert, transforma a vida daquela família, com muita música, magia e diversão.",
    "poster": "https://image.tmdb.org/t/p/w342/pHyWpWn2pRIfhS3Arcn4SKtKKW4.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uS9QP9WfHMjNW65BYdY4nL80SRP.jpg"
  },
  {
    "id": "disney-x-men-dias",
    "slug": "x-men-dias",
    "title": "X-Men: Dias de um Futuro Esquecido",
    "altTitles": [
      "x-men days of future past"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "x-men",
      "xmen",
      "futuro"
    ],
    "tmdbId": 127585,
    "year": "2014",
    "rating": 7.529,
    "overview": "O Dr. Bolivar Trask acredita que os mutantes são uma ameaça para a humanidade. Ele desenvolve gigantescos robôs chamados Sentinelas, que perseguem impiedosamente os mutantes. Os poucos sobreviventes precisam viver escondidos. Wolverine viaja no tempo para procurar os jovens Xavier e Magneto e impedir que eles sejam caçados e aniquilados no futuro.",
    "poster": "https://image.tmdb.org/t/p/w342/cAGrjXVQoNyqHgxPoXr68JGqmp0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fctQU5MoXgJ5pNMljFzlEFXwfSu.jpg"
  },
  {
    "id": "disney-star-wars-rogue-one",
    "slug": "star-wars-rogue-one",
    "title": "Rogue One: Uma História Star Wars",
    "altTitles": [
      "rogue one"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "rogue",
      "one",
      "star",
      "wars"
    ],
    "tmdbId": 330459,
    "year": "2016",
    "rating": 7.505,
    "overview": "Ainda criança, Jyn Erso foi afastada de seu pai, devido à exigência do diretor Krennic de que ele trabalhasse na construção da arma mais poderosa do Império, a Estrela da Morte. Criada por Saw Gerrera, ela teve que aprender a sobreviver por conta própria ao completar 16 anos. Já adulta, Jyn é resgatada da prisão pela Aliança Rebelde, que deseja ter acesso a uma mensagem enviada por seu pai a Gerrera. Com a promessa de liberdade ao término da missão, ela aceita trabalhar para os rebeldes ao lado do capitão Cassian Andor e do robô K-2SO.",
    "poster": "https://image.tmdb.org/t/p/w342/74C2YX0NLWnozVMRS56d5CKDdEv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6t8ES1d12OzWyCGxBeDYLHoaDrT.jpg"
  },
  {
    "id": "disney-divertida-mente-2",
    "slug": "divertida-mente-2",
    "title": "Divertida Mente 2",
    "altTitles": [
      "inside out 2"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "divertida",
      "mente",
      "2",
      "inside",
      "out"
    ],
    "tmdbId": 1022789,
    "year": "2024",
    "rating": 7.5,
    "overview": "\"Divertida Mente 2\", da Disney e da Pixar, retorna à mente da adolescente Riley, e o faz no momento em que a sala de comando está passando por uma demolição repentina para dar lugar a algo totalmente inesperado: novas emoções! Alegria, Tristeza, Raiva, Medo e Nojinho não sabem bem como reagir quando Ansiedade aparece, e tudo indica que ela não está sozinha.",
    "poster": "https://image.tmdb.org/t/p/w342/lHKNS35r4RTa9GO72vdadMLxoiV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg"
  },
  {
    "id": "paramount-poderoso-chefao",
    "slug": "poderoso-chefao",
    "title": "O Poderoso Chefão",
    "altTitles": [
      "the godfather"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "poderoso",
      "chefao",
      "godfather"
    ],
    "tmdbId": 238,
    "year": "1972",
    "rating": 8.7,
    "overview": "Em 1945, Don Corleone é o chefe de uma mafiosa família italiana de Nova York. Ele costuma apadrinhar várias pessoas, realizando importantes favores para elas, em troca de favores futuros. Com a chegada das drogas, as famílias começam uma disputa pelo promissor mercado. Quando Corleone se recusa a facilitar a entrada dos narcóticos na cidade, não oferecendo ajuda política e policial, sua família começa a sofrer atentados para que mudem de posição. É nessa complicada época que Michael, um herói de guerra nunca envolvido nos negócios da família, vê a necessidade de proteger o seu pai e tudo o que ele construiu ao longo dos anos.",
    "poster": "https://image.tmdb.org/t/p/w342/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg"
  },
  {
    "id": "paramount-pulp-fiction",
    "slug": "pulp-fiction",
    "title": "Pulp Fiction",
    "altTitles": [
      "tempo de violencia"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "pulp",
      "fiction"
    ],
    "tmdbId": 680,
    "year": "1994",
    "rating": 8.485,
    "overview": "Vincent Vega e Jules Winnfield são dois assassinos profissionais que trabalham fazendo cobranças para Marsellus Wallace, um poderosos gângster. Vega é forçado a sair com a garota do chefe, temendo passar dos limites. Enquanto isso, o pugilista Butch Coolidge se mete em apuros por ganhar uma luta que deveria perder.",
    "poster": "https://image.tmdb.org/t/p/w342/tptjnB2LDbuUWya9Cx5sQtv5hqb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg"
  },
  {
    "id": "paramount-interestelar",
    "slug": "interestelar",
    "title": "Interestelar",
    "altTitles": [
      "interstellar"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "interestelar",
      "interstellar"
    ],
    "tmdbId": 157336,
    "year": "2014",
    "rating": 8.47,
    "overview": "As reservas naturais da Terra estão chegando ao fim e um grupo de astronautas recebe a missão de verificar possíveis planetas para receberem a população mundial, possibilitando a continuação da espécie. Cooper é chamado para liderar o grupo e aceita a missão sabendo que pode nunca mais ver os filhos. Ao lado de Brand, Jenkins e Doyle, ele seguirá em busca de um novo lar.",
    "poster": "https://image.tmdb.org/t/p/w342/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2ssWTSVklAEc98frZUQhgtGHx7s.jpg"
  },
  {
    "id": "paramount-forrest-gump",
    "slug": "forrest-gump",
    "title": "Forrest Gump",
    "altTitles": [],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "forrest",
      "gump"
    ],
    "tmdbId": 13,
    "year": "1994",
    "rating": 8.464,
    "overview": "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump, um rapaz com QI abaixo da média e com boas intenções. Por obra do acaso, ele consegue participar de momentos cruciais, como a Guerra do Vietnã e o Caso Watergate, mas continua pensando no seu amor de infância, Jenny Curran.",
    "poster": "https://image.tmdb.org/t/p/w342/d74WpIsH8379TIL4wUxDneRCYv2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/67HggiWaP9ZLv5sPYmyRV37yAJM.jpg"
  },
  {
    "id": "paramount-clube-da-luta",
    "slug": "clube-da-luta",
    "title": "Clube da Luta",
    "altTitles": [
      "fight club"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "clube",
      "luta",
      "fight",
      "club"
    ],
    "tmdbId": 550,
    "year": "1999",
    "rating": 8.438,
    "overview": "Um homem deprimido que sofre de insônia conhece um estranho vendedor de sabonetes chamado Tyler Durden. Eles formam um clube clandestino com regras rígidas onde lutam com outros homens cansados de suas vidas mundanas. Mas sua parceria perfeita é comprometida quando Marla chama a atenção de Tyler.",
    "poster": "https://image.tmdb.org/t/p/w342/mCICnh7QBH0gzYaTQChBDDVIKdm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/c6OLXfKAk5BKeR6broC8pYiCquX.jpg"
  },
  {
    "id": "paramount-twin-peaks",
    "slug": "twin-peaks",
    "title": "Twin Peaks",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "twin",
      "peaks"
    ],
    "tmdbId": 1920,
    "year": "1990",
    "rating": 8.4,
    "overview": "A misteriosa morte de Laura Palmer na pacata cidade de Twin Peaks dá início a uma série de problemas ao agente do FBI Dale Cooper e ao xerife Harry Truman. Eles são os responsáveis pela investigação do crime e acabam percebendo que várias pessoas da cidade estão envolvidas e que segredos obscuros estão por trás do caso.",
    "poster": "https://image.tmdb.org/t/p/w342/lA9CNSdo50iQPZ8A2fyVpMvJZAf.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/j5w04XEuFv85N3RIovXBJIHxjSb.jpg"
  },
  {
    "id": "paramount-south-park",
    "slug": "south-park",
    "title": "South Park",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "south",
      "park"
    ],
    "tmdbId": 2190,
    "year": "1997",
    "rating": 8.335,
    "overview": "Série animada que satiriza com muito humor negro a sociedade estadounidense ao apresentar situações bizarras e surreais protagonizadas por Stan, Kyle, Eric e Kenny, as crianças mais travessas de South Park.",
    "poster": "https://image.tmdb.org/t/p/w342/ojwZ7dO7CUVUjbUDW81XaBjqy6h.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3UviYOlhn8EgXMBuiT6MnUuo1w9.jpg"
  },
  {
    "id": "paramount-1883",
    "slug": "1883",
    "title": "1883",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "1883"
    ],
    "tmdbId": 118357,
    "year": "2021",
    "rating": 8.3,
    "overview": "Uma prequela de \"Yellowstone\", \"1883\" segue a família Dutton enquanto eles fogem da pobreza no Texas e embarcam em uma jornada pelas Grandes Planícies em busca de um futuro melhor em Montana.",
    "poster": "https://image.tmdb.org/t/p/w342/waLbm384SQDwLTCn6ttPqQS5kfV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uQUHCqxHsG9blvtCoL7vluMG9Jp.jpg"
  },
  {
    "id": "paramount-tulsa-king",
    "slug": "tulsa-king",
    "title": "Tulsa King",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "tulsa",
      "king"
    ],
    "tmdbId": 153312,
    "year": "2022",
    "rating": 8.28,
    "overview": "Depois de cumprir 25 anos de prisão, Dwight Manfredi é exilado sem cerimônia por seu chefe da máfia para se estabelecer em Oklahoma. Dwight lentamente constrói um novo império criminoso em Tulsa.",
    "poster": "https://image.tmdb.org/t/p/w342/rOYLWCdAifpUtPlTf1WHxyaxeMt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mNHRGO1gFpR2CYZdANe72kcKq7G.jpg"
  },
  {
    "id": "paramount-dexter",
    "slug": "dexter",
    "title": "Dexter",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "dexter"
    ],
    "tmdbId": 1405,
    "year": "2006",
    "rating": 8.229,
    "overview": "Renomado funcionário da Polícia de Miami, Dexter esconde de todos uma segunda identidade: ele é um assassino em série que mata os criminosos que a polícia não consegue prender.",
    "poster": "https://image.tmdb.org/t/p/w342/f1nV5NBIFwfQLw5g8FVrdt90FAy.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/nS5ZSmrX92lu1GYAlXZye1mkDfd.jpg"
  },
  {
    "id": "paramount-gladiador",
    "slug": "gladiador",
    "title": "Gladiador",
    "altTitles": [
      "gladiator"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "gladiador",
      "gladiator"
    ],
    "tmdbId": 98,
    "year": "2000",
    "rating": 8.224,
    "overview": "Nos dias finais do reinado de Marcus Aurelius, o imperador desperta a ira de seu filho Commodus ao tornar pública sua predileção em deixar o trono para Maximus, o comandante do exército romano. Sedento pelo poder, Commodus mata seu pai, assume a coroa e ordena a morte de Maximus, que consegue fugir antes de ser pego e passa a se esconder sob a identidade de um escravo e gladiador do Império Romano.",
    "poster": "https://image.tmdb.org/t/p/w342/4DUClyGA6OqjXv6yC0Imf6THGfp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jhk6D8pim3yaByu1801kMoxXFaX.jpg"
  },
  {
    "id": "paramount-resgate-soldado-ryan",
    "slug": "resgate-soldado-ryan",
    "title": "O Resgate do Soldado Ryan",
    "altTitles": [
      "saving private ryan"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "resgate",
      "soldado",
      "ryan"
    ],
    "tmdbId": 857,
    "year": "1998",
    "rating": 8.223,
    "overview": "Ao desembarcar na Normandia, no dia 6 de junho de 1944, o capitão Miller recebe a missão de comandar um grupo do segundo batalhão para o resgate do soldado James Ryan, caçula de quatro irmãos, dentre os quais três morreram em combate. Por ordens do chefe George C. Marshall, eles precisam procurar o soldado e garantir o seu retorno, com vida, para casa.",
    "poster": "https://image.tmdb.org/t/p/w342/hMLxNLCXRDd62acfCBn6mIyW1HU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bdD39MpSVhKjxarTxLSfX6baoMP.jpg"
  },
  {
    "id": "paramount-1923",
    "slug": "1923",
    "title": "1923",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "1923"
    ],
    "tmdbId": 157744,
    "year": "2022",
    "rating": 8.219,
    "overview": "Siga uma nova geração da família Dutton durante o início do século XX, quando pandemias, secas históricas, o fim da Lei Seca e a Grande Depressão assolam o oeste montanhoso e os Duttons que o chamam de lar.",
    "poster": "https://image.tmdb.org/t/p/w342/t2BpkYRH8GRX9sSDirXQGPz58aG.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vIioWssbxRtEkIzgj8r0pCWYkYM.jpg"
  },
  {
    "id": "paramount-halo",
    "slug": "halo",
    "title": "Halo",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "halo"
    ],
    "tmdbId": 52814,
    "year": "2022",
    "rating": 8.203,
    "overview": "Um drama de ficção científica humano e ricamente imaginado, que se passa na colonização interestelar do século XXVI.",
    "poster": "https://image.tmdb.org/t/p/w342/4UmNhZCEu8Vt3byMvNxNEPyf8EY.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/zW0v2YT74C6tRafzqqBkfSqLAN0.jpg"
  },
  {
    "id": "paramount-top-gun-maverick",
    "slug": "top-gun-maverick",
    "title": "Top Gun: Maverick",
    "altTitles": [],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "top",
      "gun",
      "maverick"
    ],
    "tmdbId": 361743,
    "year": "2022",
    "rating": 8.2,
    "overview": "Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete \"Maverick\" Mitchell está de volta, rompendo os limites como um piloto de testes corajoso. No mundo contemporâneo das guerras tecnológicas, Maverick enfrenta drones e prova que o fator humano ainda é essencial.",
    "poster": "https://image.tmdb.org/t/p/w342/8v3lrllHYRrqEdYWLyscH4RGFDO.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/AaV1YIdWKnjAIAOe8UUKBFm327v.jpg"
  },
  {
    "id": "paramount-todo-mundo-odeia-chris",
    "slug": "todo-mundo-odeia-chris",
    "title": "Todo Mundo Odeia o Chris",
    "altTitles": [
      "everybody hates chris"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "todo",
      "mundo",
      "odeia",
      "chris"
    ],
    "tmdbId": 252,
    "year": "2005",
    "rating": 8.1,
    "overview": "Para Chris, fazer 13 anos não tem nada de maravilhoso. Ele é o único negro da turma do ensino médio, onde tem uma educação medíocre. É amigo de Greg, e é frequentemente abusado por Joey Caruso. Ambos os pais trabalham e ele cuida de seus dois irmãos. Parece trágico, mas é hilário.",
    "poster": "https://image.tmdb.org/t/p/w342/dXyy1e3TJ5ut6DRCrQQT3TcsrGU.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qji729gwCW88RpIIWidlaLTul3V.jpg"
  },
  {
    "id": "paramount-your-honor",
    "slug": "your-honor",
    "title": "Your Honor",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "your",
      "honor"
    ],
    "tmdbId": 86430,
    "year": "2020",
    "rating": 8.064,
    "overview": "O filho de um respeitado juiz se envolve em uma disputa que leva a um arriscado jogo de mentiras, enganações e escolhas impossíveis.",
    "poster": "https://image.tmdb.org/t/p/w342/1rWWgTEDFdV330aLgCoaq7I56lk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/t73x5Pb81mIGZR417aeGwbkR520.jpg"
  },
  {
    "id": "paramount-lobo-wall-street",
    "slug": "lobo-wall-street",
    "title": "O Lobo de Wall Street",
    "altTitles": [
      "the wolf of wall street"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "lobo",
      "wall",
      "street"
    ],
    "tmdbId": 106646,
    "year": "2013",
    "rating": 8.027,
    "overview": "Durante seis meses, Jordan Belfort trabalhou duro em uma corretora de Wall Street, seguindo os ensinamentos de seu mentor Mark Hanna. Quando finalmente consegue ser contratado como corretor da firma, acontece o Black Monday, que faz com que as bolsas de vários países caiam repentinamente. Sem emprego e bastante ambicioso, ele acaba trabalhando para uma empresa de fundo de quintal que lida com papéis de baixo valor, que não estão na bolsa de valores. É lá que Belfort tem a idéia de montar uma empresa focada neste tipo de negócio, cujas vendas são de valores mais baixos mas, em compensação, o retorno para o corretor é bem mais vantajoso. Ao lado de Donnie e outros amigos dos velhos tempos, ele cria a Stratton Oakmont, uma empresa que faz com que todos enriqueçam rapidamente e, também, levem uma vida dedicada ao prazer.",
    "poster": "https://image.tmdb.org/t/p/w342/sIy0jXDkaMf3SDZGaWcmkC2IOl.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7Nwnmyzrtd0FkcRyPqmdzTPppQa.jpg"
  },
  {
    "id": "paramount-star-trek-strange",
    "slug": "star-trek-strange",
    "title": "Star Trek: Strange New Worlds",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "star",
      "trek",
      "strange"
    ],
    "tmdbId": 103516,
    "year": "2022",
    "rating": 7.979,
    "overview": "Em Star Trek: Strange New Worlds, o capitão Christopher Pike (Anson Mount) lidera a equipe do USS Enterprise pelos confins do universo em aventuras perigosas e intensas. Passando-se antes da trama da série original, Strange New Worlds explora mais profundamente o universo Star Trek antes da chegada do icônico Capitão Kirk (William Shatner). Pike, ainda inexperiente em liderar toda a Enterprise por conta própria, se apoia na ajuda de seus companheiros da nave, em especial Una Chin-Riley (Rebecca Romjin), segunda em comando depois dele. Além disso, ele conta a inteligência ímpar do popular personagem Spock (Ethan Peck), um alienígena meio humano meio vulcano. Os passageiros da USS Enterprise irão se aventurar por lugares inimagináveis e viverão uma jornada intensa pela galáxica, encontrando aliados fiéis, mas também fazendo inúmeros inimigos perigosos pelo caminho. Mas com o apoio de cada um, poderão completar suas missões com sucesso.",
    "poster": "https://image.tmdb.org/t/p/w342/bxuUbcM9GqvmQY1EDm5sMtLdcTv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fZJs6xgU9dqIg9phIXjZAZOInzy.jpg"
  },
  {
    "id": "paramount-prenda-me",
    "slug": "prenda-me",
    "title": "Prenda-Me Se For Capaz",
    "altTitles": [
      "catch me if you can"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "prenda",
      "catch"
    ],
    "tmdbId": 640,
    "year": "2002",
    "rating": 7.977,
    "overview": "Frank Abagnale Jr. já foi médico, advogado e co-piloto, tudo isso com apenas 18 anos. Mestre na arte do disfarce, ele aproveita suas habilidades para viver a vida como quer e praticar golpes milionários, que fazem com que se torne o ladrão de banco mais bem-sucedido da história dos Estados Unidos com apenas 17 anos. Mas em seu encalço está o agente do FBI Carl Hanratty, que usa todos os meios que tem ao seu dispor para encontrá-lo e capturá-lo.",
    "poster": "https://image.tmdb.org/t/p/w342/pSaqcj3pwTKt34cyn6NrBE7V4eH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ggC3Brchf4RqPitEh7cROFoeAWn.jpg"
  },
  {
    "id": "paramount-lioness",
    "slug": "lioness",
    "title": "Operação Lioness",
    "altTitles": [
      "special ops lioness"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "lioness",
      "operacao"
    ],
    "tmdbId": 113962,
    "year": "2023",
    "rating": 7.971,
    "overview": "Joe, uma agente da CIA, tenta conciliar a maternidade com o comando de uma equipe secreta em missões perigosas ao enviar a nova recruta Cruz Manuelos para a linha de frente. Inspirado por um programa militar americano, Lioness segue as agentes na perigosa missão secreta para impedir o próximo 11 de setembro.",
    "poster": "https://image.tmdb.org/t/p/w342/vAWbuHR9u9mHI9CjP3JBpRxtdRZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/r0Zg70jpcDAD7IMDhVqajSnG9vb.jpg"
  },
  {
    "id": "paramount-icarly",
    "slug": "icarly",
    "title": "iCarly",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "icarly"
    ],
    "tmdbId": 5371,
    "year": "2007",
    "rating": 7.966,
    "overview": "Carly Shay tem sua vida radicalmente mudada quando seu programa na internet torna-se um sucesso entre os jovens. Como seus pais estão viajando, Carly precisa contar com a ajuda de seu irmão e amigos para administrar sua recente fama.",
    "poster": "https://image.tmdb.org/t/p/w342/vX5q7GqGWJOgR2r0kAyWAtGWfD0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/u3rph1KVUOKbOtrPIgCb27H08Fy.jpg"
  },
  {
    "id": "paramount-dexter-new-blood",
    "slug": "dexter-new-blood",
    "title": "Dexter: New Blood",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "dexter",
      "new",
      "blood"
    ],
    "tmdbId": 131927,
    "year": "2021",
    "rating": 7.9,
    "overview": "Dexter está desaparecido e dado como morto. Sob um nome fictício, vive uma vida livre de violência até que seu filho aparece. Dexter logo descobre que seu Passageiro Sombrio ainda existe e que está acompanhado de pessoas muito perigosas em Iron Lake, NY.",
    "poster": "https://image.tmdb.org/t/p/w342/v95YfP2MvoGOC7FrBD1v5nlWBHv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/e6v08948EZVvLrx0sWpmglguY9e.jpg"
  },
  {
    "id": "paramount-penny-dreadful",
    "slug": "penny-dreadful",
    "title": "Penny Dreadful",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "penny",
      "dreadful"
    ],
    "tmdbId": 54671,
    "year": "2014",
    "rating": 7.8,
    "overview": "Frankenstein, Conde Drácula, Dorian Gray e outros personagens clássicos da literatura vivem na Londres da Revolução Industrial, uma cidade repleta de mistérios sobrenaturais.",
    "poster": "https://image.tmdb.org/t/p/w342/hQSdrXBYTbLGHYDIseHkBOPXTgL.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3bViM60LioKQJwsExm5oyLRYagC.jpg"
  },
  {
    "id": "paramount-billions",
    "slug": "billions",
    "title": "Billions",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "billions"
    ],
    "tmdbId": 62852,
    "year": "2016",
    "rating": 7.74,
    "overview": "Um procurador federal ambicioso inicia uma investigação implacável contra Bobby Axelrod, um bilionário que não joga para perder.",
    "poster": "https://image.tmdb.org/t/p/w342/edwYPQdZE998d748AdwWLsfy0rl.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/51Hw58fMwJQKYJ6XYJIRQBP9EPA.jpg"
  },
  {
    "id": "paramount-bob-esponja",
    "slug": "bob-esponja",
    "title": "Bob Esponja",
    "altTitles": [
      "spongebob"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "bob",
      "esponja",
      "spongebob"
    ],
    "tmdbId": 387,
    "year": "1999",
    "rating": 7.7,
    "overview": "Uma esponja-do-mar chamada Bob Esponja Calça Quadrada mora com seu caracol de estimação na Fenda do Biquíni, no fundo do oceano. Bob trabalha no Siri Cascudo e, nas horas vagas, vive arrumando confusões com seu melhor amigo, a estrela-do-mar Patrick.",
    "poster": "https://image.tmdb.org/t/p/w342/yXrtQINkVRyNmfUQFyVG2LuoTqm.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aasp5EmwclAQbwfGABWLTNLhjwB.jpg"
  },
  {
    "id": "paramount-frasier",
    "slug": "frasier",
    "title": "Frasier",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "frasier"
    ],
    "tmdbId": 3452,
    "year": "1993",
    "rating": 7.689,
    "overview": "Um psiquiatra que apresenta um programa de rádio, e transmite sagacidade e sabedoria aos ouvintes, tem dificuldades em lidar com seus próprios problemas: o pai, o irmão pretensioso, seus amigos e colegas de trabalho.",
    "poster": "https://image.tmdb.org/t/p/w342/gYAb6GCVEFsU9hzMCG5rxaxoIv3.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4FqKFhF4BrNsrK3EdRpVJofVqCp.jpg"
  },
  {
    "id": "paramount-californication",
    "slug": "californication",
    "title": "Californication",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "californication"
    ],
    "tmdbId": 1215,
    "year": "2007",
    "rating": 7.645,
    "overview": "Hank Moody, um romancista alcoólatra e mulherengo, tenta criar sua filha adolescente e reatar com sua ex-mulher enquanto lida com a fama e seus percalços.",
    "poster": "https://image.tmdb.org/t/p/w342/jPqOY8cq9KXQN4bD7zJGHCNvcb4.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9o9SS26mUY4cp4iSFk7iwBeAQuP.jpg"
  },
  {
    "id": "paramount-homeland",
    "slug": "homeland",
    "title": "Homeland",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "homeland"
    ],
    "tmdbId": 1407,
    "year": "2011",
    "rating": 7.589,
    "overview": "Um soldado americano a quem acreditavam ter sido morto no Iraque volta depois de oito anos de seu desaparecimento. Mas, depois de sua volta para casa, surgem suspeitas a respeito de ele ser realmente um herói americano ou parte de uma célula adormecida que planeja um ataque terrorista.",
    "poster": "https://image.tmdb.org/t/p/w342/1hFGIgADHv24zyuDpByQNqspED5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/391ixi0wVbFtFLQnOy8ZncWv2io.jpg"
  },
  {
    "id": "paramount-the-borgias",
    "slug": "the-borgias",
    "title": "The Borgias",
    "altTitles": [
      "os borgias"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "borgias"
    ],
    "tmdbId": 33025,
    "year": "2011",
    "rating": 7.579,
    "overview": "A família Bórgia foi uma proeminente dinastia italiana que ganhou muito destaque durante o período Renascentista. Rodrigo Bórgia (Jeremy Irons) é o Papa Alexandre VI, que se utiliza de suborno e várias artimanhas para manter sua posição na Igreja. Com a ajuda dos filhos, ele acaba ganhando muitos inimigos no Colégio de Cardeais, e precisa encontrar novas alianças.",
    "poster": "https://image.tmdb.org/t/p/w342/kGCigVew4gZAwAvYrDnPJWX2L1y.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mbQi8FC2Gk762plIcZfYCE2Kcmj.jpg"
  },
  {
    "id": "paramount-yellowjackets",
    "slug": "yellowjackets",
    "title": "Yellowjackets",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "yellowjackets"
    ],
    "tmdbId": 117488,
    "year": "2021",
    "rating": 7.5,
    "overview": "A trama foca em um time de talentosas jogadoras de futebol do ensino médio de Nova Jersey, que viaja para Seattle por conta de um torneio nacional. No entanto, o avião que levava o grupo de atletas cai no distante deserto de Ontário, no Canadá. As jovens sobrevivem ao acidente, mas acabam presas em uma região inóspita, onde são obrigadas a se transformar em um clã selvagem se quiserem sobreviver. Com duas linhas temporais, a série salta para 2021, onde apresenta as personagens adultas tentando reconstruir suas vidas, apesar de o passado ser difícil de ignorar.",
    "poster": "https://image.tmdb.org/t/p/w342/xRnGrn7Z7SC0KIBodocoU1QgDZF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ibFWJDWS8cTO6s2vZVd2uKDm8p.jpg"
  },
  {
    "id": "paramount-missao-impossivel-7",
    "slug": "missao-impossivel-7",
    "title": "Missão: Impossível - Acerto de Contas",
    "altTitles": [
      "dead reckoning"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "missao",
      "impossivel",
      "dead",
      "reckoning"
    ],
    "tmdbId": 575264,
    "year": "2023",
    "rating": 7.5,
    "overview": "Ethan Hunt e sua equipe embarcam em sua missão mais perigosa: rastrear uma nova arma aterrorizante que ameaça toda a humanidade antes que caia em mãos erradas. Com o controle do futuro e o destino do mundo em jogo e as forças sombrias do passado de Ethan se aproximando, uma corrida mortal ao redor do globo começa. Confrontado por um inimigo misterioso e todo-poderoso, Ethan é forçado a considerar que nada pode importar mais do que sua missão – nem mesmo a vida daqueles com quem ele mais se importa.",
    "poster": "https://image.tmdb.org/t/p/w342/hBKxN5Z8gRo2am0whMeQlPv19K4.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/628Dep6AxEtDxjZoGP78TsOxYbK.jpg"
  },
  {
    "id": "paramount-ray-donovan",
    "slug": "ray-donovan",
    "title": "Ray Donovan",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "ray",
      "donovan"
    ],
    "tmdbId": 1423,
    "year": "2013",
    "rating": 7.495,
    "overview": "Ray Donovan mantém uma agência de detetives em Los Angeles para resolver problemas de ricos e famosos. Enquanto lida com celebridades, ele precisa cuidar da família problemática.",
    "poster": "https://image.tmdb.org/t/p/w342/cwJ6nLNvX62By0yoLYWFhRelPkF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/k1UpU2cfa4PbDUBnJtr43TpdNBg.jpg"
  },
  {
    "id": "paramount-sonic-2",
    "slug": "sonic-2",
    "title": "Sonic 2: O Filme",
    "altTitles": [
      "sonic the hedgehog 2"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "sonic",
      "2"
    ],
    "tmdbId": 675353,
    "year": "2022",
    "rating": 7.432,
    "overview": "Depois de se estabelecer em Green Hills, Sonic está pronto para mais liberdade e deixar sua marca como um herói, e Tom e Maddie concordam em deixá-lo em casa enquanto vão de férias. Mas, assim que eles se foram, Dr. Robotnik volta, desta vez com um novo parceiro, Knuckles, em busca de uma esmeralda que tem o poder de construir e destruir civilizações. Sonic se une a um novo companheiro, Tails, e juntos eles embarcam em uma jornada para encontrar a esmeralda antes que ela caia nas mãos erradas.",
    "poster": "https://image.tmdb.org/t/p/w342/aT2vdnR3qifI21f7fHTqYW5iAAz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xuLA0pii2IMJW2puT7EvJtgpg0H.jpg"
  },
  {
    "id": "paramount-rei-da-tv",
    "slug": "rei-da-tv",
    "title": "O Rei da TV",
    "altTitles": [
      "the loudest voice"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "rei",
      "tv",
      "loudest"
    ],
    "tmdbId": 80443,
    "year": "2019",
    "rating": 7.374,
    "overview": "A história do escândalo envolvendo Roger Ailes  e a série de assédios sexuais cometidos por ele. Em 2016, o fundador do canal jornalístico Fox News foi acusado pela jornalista Gretchen Carlson, que trabalhou por dez anos no canal, de tê-la assediado sexualmente. Na sequência, dezenas de vítimas começaram a se pronunciar, o que o obrigou a deixar seu cargo de CEO.",
    "poster": "https://image.tmdb.org/t/p/w342/vjUqQyQMFRlugsQakV84BU3sOIk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mXkbeRiKpThbNHSOMppn0gVBUQ3.jpg"
  },
  {
    "id": "paramount-babilonia",
    "slug": "babilonia",
    "title": "Babilônia",
    "altTitles": [
      "babylon"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "babilonia",
      "babylon"
    ],
    "tmdbId": 615777,
    "year": "2022",
    "rating": 7.362,
    "overview": "Durante a era de ouro de Hollywood, em Los Angeles da década de 1920, um jovem latino está determinado a conseguir uma carreira enquanto o cinema entra em fase de transição dos filmes mudos para produções com falas.",
    "poster": "https://image.tmdb.org/t/p/w342/qZUmMxJbGmkIYwnS7qRfSOREmvC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5fxTB08O7CW1hAcN2MWOKodp1h1.jpg"
  },
  {
    "id": "paramount-dungeons-dragons",
    "slug": "dungeons-dragons",
    "title": "Dungeons & Dragons: Honra Entre Rebeldes",
    "altTitles": [
      "honor among thieves"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "dungeons",
      "dragons"
    ],
    "tmdbId": 493529,
    "year": "2023",
    "rating": 7.327,
    "overview": "Um ladrão charmoso e um grupo de aventureiros improváveis empreendem um assalto épico para recuperar uma relíquia perdida, mas as coisas dão perigosamente errado quando eles entram em conflito com as pessoas erradas.",
    "poster": "https://image.tmdb.org/t/p/w342/tt23D7Mkg0dHhsWn3aN0hbslaFw.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/AdBXP8e6K3FYdDrMx3Wr6WZqCYF.jpg"
  },
  {
    "id": "paramount-the-curse",
    "slug": "the-curse",
    "title": "The Curse",
    "altTitles": [
      "a maldicao"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "curse",
      "maldicao"
    ],
    "tmdbId": 60603,
    "year": "2014",
    "rating": 7.3,
    "overview": "Na sequência de um sonho de infância, os irmãos Rick e Marty Lagina, embarcam em uma missão para encontrar o tesouro em Oak Island, ao largo da costa sul de Nova Scotia, no Canadá. Com a família, os exploradores locais e especialistas históricos, eles exploram a paisagem da ilha e mitologia. Conhecida por seus buracos e cavernas, Oak Island se presta a muitos mistérios, e possivelmente está ligado a piratas, os Cavaleiros Templários, tesouro enterrado, armadilhas secretas, e uma maldição da morte. Não há mistério aqui, mas o que é? Por mais de dois séculos, as pessoas têm explorado os segredos desta ilha, mas todos falharam; alguns já morreram. Esta série documental segue os irmãos Lagina como eles vasculhar os escombros de terra, mar e lendas para encontrar a resposta.",
    "poster": "https://image.tmdb.org/t/p/w342/xFOxYucdxa7Tw2QqQN6939pdcq5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/5pN8ouV9pWL5M7pSbz22IEXtNO8.jpg"
  },
  {
    "id": "paramount-star-trek-picard",
    "slug": "star-trek-picard",
    "title": "Star Trek: Picard",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "star",
      "trek",
      "picard"
    ],
    "tmdbId": 85949,
    "year": "2020",
    "rating": 7.254,
    "overview": "Jornada nas Estrelas: Picard apresenta o Sir Patrick Stewart revivendo seu icônico papel como Jean-Luc Picard, que ele interpretou durante sete temporadas em Jornada nas Estrelas: A Nova Geração. A nova série acompanhará este personagem icônico no capítulo seguinte de sua vida.",
    "poster": "https://image.tmdb.org/t/p/w342/aiMnGnyNYxp1DSYN0LIPl6UxlWZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lodNd9ITHf32q8ybHArHqoWOcXf.jpg"
  },
  {
    "id": "paramount-tartarugas-ninja",
    "slug": "tartarugas-ninja",
    "title": "Tartarugas Ninja: Caos Mutante",
    "altTitles": [
      "mutant mayhem"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "tartarugas",
      "ninja",
      "mutante"
    ],
    "tmdbId": 614930,
    "year": "2023",
    "rating": 7.215,
    "overview": "Depois de anos sendo protegidos do mundo humano, os irmãos tartarugas saem para ganhar os corações dos nova yorkinos e serem aceitos como adolescentes normais através de seus atos heroicos. Sua nova amiga, April O’Neil, vai ajudá-los a derrotar um misterioso sindicado do crime, mas eles logo se veem em maus lençóis quando um exército de mutantes vai atrás deles.",
    "poster": "https://image.tmdb.org/t/p/w342/gwrFZLMPox82lsPT8MHpAYmFjw9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2Cpg8hUn60PK9CW9d5SWf605Ah8.jpg"
  },
  {
    "id": "paramount-transformers-despertar",
    "slug": "transformers-despertar",
    "title": "Transformers: O Despertar das Feras",
    "altTitles": [
      "rise of the beasts"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "transformers",
      "despertar",
      "feras"
    ],
    "tmdbId": 667538,
    "year": "2023",
    "rating": 7.173,
    "overview": "Optimus Prime e os Autobots enfrentam seu maior desafio até agora. Quando uma nova ameaça capaz de destruir todo o planeta surge, eles devem se unir a uma poderosa facção de Transformers conhecida como os Maximals para salvar a Terra.",
    "poster": "https://image.tmdb.org/t/p/w342/9PSKoY98olv7Sru1PWnLpFDqat9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg"
  },
  {
    "id": "paramount-patrulha-canina",
    "slug": "patrulha-canina",
    "title": "Patrulha Canina",
    "altTitles": [
      "paw patrol"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "patrulha",
      "canina",
      "paw",
      "patrol"
    ],
    "tmdbId": 57532,
    "year": "2013",
    "rating": 6.999,
    "overview": "Seis cachorrinhos heroicos liderados por um garoto de 10 anos realizam arriscadas missões de resgate sempre com bom humor, habilidades especiais e veículos muito legais!",
    "poster": "https://image.tmdb.org/t/p/w342/pQ0bBHR9Q3wurjNMjnqal0gJaYo.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7OrV2aAH5Yp7hA9zCCvUloLvZtl.jpg"
  },
  {
    "id": "paramount-star-trek-discovery",
    "slug": "star-trek-discovery",
    "title": "Star Trek: Discovery",
    "altTitles": [],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "star",
      "trek",
      "discovery"
    ],
    "tmdbId": 67198,
    "year": "2017",
    "rating": 6.982,
    "overview": "Após um século de isolamento, a Federação e o Império Klingon entram em guerra, e as ações de uma oficial da Frota Estelar estão no centro do conflito.",
    "poster": "https://image.tmdb.org/t/p/w342/tMM1Kwz6h1ebYSQL5V1hqC1QGCA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ePr0k72sypMpZYubz6w34dcW68Y.jpg"
  },
  {
    "id": "paramount-panico-6",
    "slug": "panico-6",
    "title": "Pânico VI",
    "altTitles": [
      "scream vi"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "panico",
      "scream",
      "vi"
    ],
    "tmdbId": 934433,
    "year": "2023",
    "rating": 6.948,
    "overview": "Sam, Tara, Chad e Mindy, os quatro sobreviventes do massacre realizado pelo Ghostface, decidem deixar Woodsboro para trás em busca de um novo começo em uma cidade diferente. Mas não demora muito para eles se tornarem alvo de um novo serial killer mascarado.",
    "poster": "https://image.tmdb.org/t/p/w342/vSCqFktU5FzjtkW5XRlp8JndRdV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/44immBwzhDVyjn87b3x3l9mlhAD.jpg"
  },
  {
    "id": "paramount-sorria",
    "slug": "sorria",
    "title": "Sorria",
    "altTitles": [
      "smile"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "sorria",
      "smile"
    ],
    "tmdbId": 882598,
    "year": "2022",
    "rating": 6.664,
    "overview": "Após testemunhar um acidente traumático e bizarro envolvendo um paciente, a Dra. Rose Cotter começa a vivenciar eventos assustadores que ela não consegue explicar.",
    "poster": "https://image.tmdb.org/t/p/w342/3LfJ1kQZv6OX687rJMOAMzFJlc9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kMZIMqEXO5MFd5Y1Ha2jZZF4pvF.jpg"
  },
  {
    "id": "paramount-bob-marley",
    "slug": "bob-marley",
    "title": "Bob Marley: One Love",
    "altTitles": [],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "bob",
      "marley"
    ],
    "tmdbId": 802219,
    "year": "2024",
    "rating": 6.607,
    "overview": "O jamaicano Bob Marley supera as adversidades para se tornar um dos músicos mais famosos do mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/7RXyg2jBgItk0wG5eNbYHb23qXt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lHPap2xBR7DgWLiu6RsfKESgzAi.jpg"
  },
  {
    "id": "paramount-yellowstone",
    "slug": "yellowstone",
    "title": "Yellowstone",
    "altTitles": [
      "yellowstone s01",
      "yellowstone s02"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "yellowstone"
    ]
  },
  {
    "id": "paramount-mayor-of-kingstown",
    "slug": "mayor-of-kingstown",
    "title": "Mayor of Kingstown",
    "altTitles": [
      "prefeito de kingstown"
    ],
    "type": "series",
    "streaming": "paramount",
    "matchHints": [
      "mayor",
      "kingstown"
    ]
  },
  {
    "id": "paramount-meninas-malvadas-2024",
    "slug": "meninas-malvadas-2024",
    "title": "Meninas Malvadas",
    "altTitles": [
      "mean girls 2024"
    ],
    "type": "movie",
    "streaming": "paramount",
    "matchHints": [
      "meninas",
      "malvadas",
      "mean",
      "girls"
    ]
  },
  {
    "id": "apple-drops-of-god",
    "slug": "drops-of-god",
    "title": "Gotas de Deus",
    "altTitles": [
      "drops of god"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "gotas",
      "deus",
      "drops"
    ],
    "tmdbId": 306121,
    "year": "2026",
    "rating": 9,
    "overview": "Quando o crítico de vinhos de renome mundial Kanzaki falece, seu testamento revela que sua fortuna em forma de coleção de vinhos não será herdada naturalmente por seu único filho que, em um ato de rebeldia, foi trabalhar no departamento de vendas de uma cervejaria… Para receber a herança, Shizuku deve identificar, numa competição com um jovem crítico brilhante, 12 vinhos divinos cujas impressões são descritas em termos elogiosos no testamento de seu pai.",
    "poster": "https://image.tmdb.org/t/p/w342/eJngpqzGzppVkR5XoM9uuPFOukn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ufMZIGHhSl5DUxv5Km2jLfkvEW5.jpg"
  },
  {
    "id": "apple-dickinson",
    "slug": "dickinson",
    "title": "Dickinson",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "dickinson"
    ],
    "tmdbId": 89901,
    "year": "2019",
    "rating": 8.519,
    "overview": "Poetisa. Filha. Completa rebelde. Ela está determinada a tornar-se a maior poetisa do mundo e superar os limites impostos pela sociedade e por sua família.",
    "poster": "https://image.tmdb.org/t/p/w342/dDdcAfHBZ6Aalv53iR6o35CSLWA.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jrFL1KBSDO5vTM7AB6sXnx6Flc0.jpg"
  },
  {
    "id": "apple-severance",
    "slug": "severance",
    "title": "Ruptura",
    "altTitles": [
      "severance"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "ruptura",
      "severance"
    ],
    "tmdbId": 95396,
    "year": "2022",
    "rating": 8.4,
    "overview": "Mark lidera uma equipe de funcionários de escritório cujas memórias foram divididas cirurgicamente entre a vida no trabalho e a vida pessoal. Quando um colega de trabalho misterioso aparece fora do escritório, ele começa uma jornada para descobrir a verdade sobre seu trabalho.",
    "poster": "https://image.tmdb.org/t/p/w342/3DjOAUBR8Hra4R9kK9U8jDaoqyC.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ixgFmf1X59PUZam2qbAfskx2gQr.jpg"
  },
  {
    "id": "apple-ted-lasso",
    "slug": "ted-lasso",
    "title": "Ted Lasso",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "ted",
      "lasso"
    ],
    "tmdbId": 97546,
    "year": "2020",
    "rating": 8.344,
    "overview": "Ted Lasso, um técnico de futebol americano que se muda para a Inglaterra para treinar um time de futebol, apesar da falta de experiência. Com jogadores e cidade desconfiados, será que ele vai conseguir conquistá-los?",
    "poster": "https://image.tmdb.org/t/p/w342/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/gEQkOMmnJcoh9Hh1vk7fpVYnksR.jpg"
  },
  {
    "id": "apple-planeta-pre-historico",
    "slug": "planeta-pre-historico",
    "title": "Planeta Pré-Histórico",
    "altTitles": [
      "prehistoric planet"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "planeta",
      "pre",
      "historico"
    ],
    "tmdbId": 95171,
    "year": "2022",
    "rating": 8.305,
    "overview": "Experimente como nunca antes as maravilhas do nosso mundo nesta série documental épica de Jon Favreau e dos produtores de Planeta Terra. Viaje 66 milhões de anos para quando dinossauros majestosos e criaturas extraordinárias habitavam terras, mares e céus.",
    "poster": "https://image.tmdb.org/t/p/w342/i2FxS4LjBlzLH2h1aFfZgwVqyBi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6EmuYBkQnCcf5dB9iuz0SmjEt5s.jpg"
  },
  {
    "id": "apple-defending-jacob",
    "slug": "defending-jacob",
    "title": "Em Defesa de Jacob",
    "altTitles": [
      "defending jacob"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "defesa",
      "jacob",
      "defending"
    ],
    "tmdbId": 87784,
    "year": "2020",
    "rating": 8.249,
    "overview": "Uma família sofre um grande baque quando o filho é acusado de matar um colega de classe.",
    "poster": "https://image.tmdb.org/t/p/w342/xu3eBwkqK3CGpepcbFQjuiqHRHV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wGPbGjNmFhkT9uTWDX4b06FMd45.jpg"
  },
  {
    "id": "apple-lessons-chemistry",
    "slug": "lessons-chemistry",
    "title": "Lições de Química",
    "altTitles": [
      "lessons in chemistry"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "licoes",
      "quimica",
      "lessons"
    ],
    "tmdbId": 117303,
    "year": "2023",
    "rating": 8.211,
    "overview": "Na década de 1950, o sonho de Elizabeth Zott de ser uma cientista é desafiado por uma sociedade que diz que as mulheres pertencem apenas à esfera doméstica. Ela aceita um emprego em um programa de culinária na TV e se propõe a ensinar a uma nação de donas de casa subestimadas muito mais do que receitas.",
    "poster": "https://image.tmdb.org/t/p/w342/9lN9uhgH2YTIubfQTd2f0rtqnmp.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sPE6RlcIdK7i5Z991cQQkoO2R6t.jpg"
  },
  {
    "id": "apple-wolfwalkers",
    "slug": "wolfwalkers",
    "title": "Wolfwalkers",
    "altTitles": [],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "wolfwalkers"
    ],
    "tmdbId": 441130,
    "year": "2020",
    "rating": 8.195,
    "overview": "A chegada de um caçador de lobos a uma cidadezinha irlandesa é o começo de uma grande aventura para Robyn, quando ela conhece na floresta uma menina com um estranho dom.",
    "poster": "https://image.tmdb.org/t/p/w342/gCa0yDjBb6zHgy2dhbud9mfsTLK.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3zTbERSBLh7waK9811RTKGAcG86.jpg"
  },
  {
    "id": "apple-palmer",
    "slug": "palmer",
    "title": "Palmer",
    "altTitles": [],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "palmer"
    ],
    "tmdbId": 458220,
    "year": "2021",
    "rating": 8.12,
    "overview": "Após 12 anos na prisão, Eddie Palmer volta para casa para reconstruir sua vida. Ele cria uma ligação inesperada com Sam, um rapaz marginalizado que vem de uma família problemática e, agora, o passado de Eddie ameaça arruinar a sua nova vida.",
    "poster": "https://image.tmdb.org/t/p/w342/xSDdRAjxKAGi8fUBLOqSrBhJmF0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mlBmnjDJfsAhvqRVc2aFOjsfh8M.jpg"
  },
  {
    "id": "apple-silo",
    "slug": "silo",
    "title": "Silo",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "silo"
    ],
    "tmdbId": 125988,
    "year": "2023",
    "rating": 8.1,
    "overview": "Em um futuro destruído e tóxico, existe uma comunidade que vive dentro de um gigantesco silo subterrâneo com centenas de andares de profundidade. Lá, homens e mulheres vivem numa sociedade cheia de regras que acreditam existir para protegê-los.",
    "poster": "https://image.tmdb.org/t/p/w342/n1mtrn5NpyzToGvaPJMtNipejQz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4XccmjsOmQZw8S2iW1wvlvmb5v1.jpg"
  },
  {
    "id": "apple-see",
    "slug": "see",
    "title": "See",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "see"
    ],
    "tmdbId": 80752,
    "year": "2019",
    "rating": 8.083,
    "overview": "Em um futuro distante, um vírus dizima a humanidade deixando seus sobreviventes cegos. Baba Voss, pai de gêmeos nascidos séculos mais tarde com o mítico dom da visão. Com a ajuda de Paris, ele deve proteger sua tribo contra uma poderosa rainha.",
    "poster": "https://image.tmdb.org/t/p/w342/lKDIhc9FQibDiBQ57n3ELfZCyZg.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/u5N8tXgGDY6jS7R8Xn42LDeL0Dk.jpg"
  },
  {
    "id": "apple-black-bird",
    "slug": "black-bird",
    "title": "Black Bird",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "black",
      "bird"
    ],
    "tmdbId": 155537,
    "year": "2022",
    "rating": 8.068,
    "overview": "Quando Jimmy Keene começa a cumprir uma sentença de 10 anos de prisão, ele recebe uma oferta incrível: se ele conseguir obter uma confissão do suspeito de assassinato Larry Hall, Jimmy será libertado. Completar esta missão torna-se o desafio de sua vida.",
    "poster": "https://image.tmdb.org/t/p/w342/qu312pwM61NPTr7nexvovCClDNP.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/o2C222QdW4dmoyd2dgPlnCcI3cW.jpg"
  },
  {
    "id": "apple-slow-horses",
    "slug": "slow-horses",
    "title": "Slow Horses",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "slow",
      "horses"
    ],
    "tmdbId": 95480,
    "year": "2022",
    "rating": 7.998,
    "overview": "Este drama perspicaz acompanha uma equipe disfuncional de agentes da MI5 – e seu chefe arrogante, o notório Jackson Lamb – enquanto navegam os mistérios e ilusões do mundo da espionagem para proteger a Inglaterra de forças sinistras.",
    "poster": "https://image.tmdb.org/t/p/w342/rdNvIaPXpkUZl5tQLsTP15osfu2.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bDfboQUb45Cv9MYyVBDZw8M8xSM.jpg"
  },
  {
    "id": "apple-pachinko",
    "slug": "pachinko",
    "title": "Pachinko",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "pachinko"
    ],
    "tmdbId": 110382,
    "year": "2022",
    "rating": 7.904,
    "overview": "Esta saga arrebatadora narra as esperanças e sonhos de uma família de imigrantes coreanos ao longo de quatro gerações, ao deixar sua terra natal em uma busca indomável para sobreviver e prosperar.",
    "poster": "https://image.tmdb.org/t/p/w342/wUTXdmL6oNjhiStGveOaPeuFOYQ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vVKlL4HyrQYAcJuaaUW49FrRqY5.jpg"
  },
  {
    "id": "apple-coda",
    "slug": "coda",
    "title": "No Ritmo do Coração",
    "altTitles": [
      "coda"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "ritmo",
      "coracao",
      "coda"
    ],
    "tmdbId": 776503,
    "year": "2021",
    "rating": 7.89,
    "overview": "Como CODA (Filhos de Adultos Surdos), Ruby é a única pessoa com audição em sua família. Quando o negócio de pesca da família é ameaçado, Ruby se vê dividida entre seguir seu amor pela música e seu medo de abandonar seus pais.",
    "poster": "https://image.tmdb.org/t/p/w342/fXeWSHLlAEsINva6SJgb5hCLBzy.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/v85FlkbMYKa5du1glm0YfYNsL2n.jpg"
  },
  {
    "id": "apple-presumed-innocent",
    "slug": "presumed-innocent",
    "title": "Acima de Qualquer Suspeita",
    "altTitles": [
      "presumed innocent"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "acima",
      "suspeita",
      "presumed"
    ],
    "tmdbId": 156933,
    "year": "2024",
    "rating": 7.86,
    "overview": "Um assassinato hediondo deixa o escritório da Promotoria de Justiça de Chicago de cabeça para baixo quando um dos funcionários é suspeito do crime, o que deixa o acusado lutando para manter sua família unida.",
    "poster": "https://image.tmdb.org/t/p/w342/bBX1PjeHpm00bhz6AbEcY0a41Ir.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/dzsg5Akwfw1lsVoaPmvLcLSrKkh.jpg"
  },
  {
    "id": "apple-shrinking",
    "slug": "shrinking",
    "title": "Falando a Real",
    "altTitles": [
      "shrinking"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "falando",
      "real",
      "shrinking"
    ],
    "tmdbId": 136311,
    "year": "2023",
    "rating": 7.828,
    "overview": "Jimmy luta para lidar com a perda da esposa enquanto tenta ser pai, amigo e terapeuta. Ele decide adotar uma nova postura com todos ao seu redor: ser brutalmente sincero e sem filtros. Será que isso vai melhorar as coisas ou desencadear um caos total?",
    "poster": "https://image.tmdb.org/t/p/w342/oaYi4n3pgBLeQ6FH3SU8G3XcSqq.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hI9z1UuNhBthvkm3iJ8m3zv43Pf.jpg"
  },
  {
    "id": "apple-finch",
    "slug": "finch",
    "title": "Finch",
    "altTitles": [],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "finch"
    ],
    "tmdbId": 522402,
    "year": "2021",
    "rating": 7.803,
    "overview": "Eu um mundo pós-apocalíptico, um robô construído para proteger o cachorro do seu criado, que está a beira da morte, aprende sobre a vida, amor e amizade, aprendendo o que significa ser humano.",
    "poster": "https://image.tmdb.org/t/p/w342/eEJtzD1F05xDipFEDY98CTH5yZn.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uoc358GH6Yl7TufbUKHkETPu64B.jpg"
  },
  {
    "id": "apple-emancipation",
    "slug": "emancipation",
    "title": "Emancipação",
    "altTitles": [
      "emancipation"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "emancipacao",
      "emancipation"
    ],
    "tmdbId": 715931,
    "year": "2022",
    "rating": 7.8,
    "overview": "Inspirado na emocionante história real de um homem que faria qualquer coisa por sua família e pela liberdade. Quando Peter, um homem escravizado, arrisca sua vida para escapar e voltar para sua família, ele embarca em uma perigosa jornada de amor e resistência.",
    "poster": "https://image.tmdb.org/t/p/w342/izTIOynukDcN9dp7uPlwBjHr8f5.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1jZ3wNpON50whGEH7YOcTQrU45B.jpg"
  },
  {
    "id": "apple-masters-of-the-air",
    "slug": "masters-of-the-air",
    "title": "Mestres do Ar",
    "altTitles": [
      "masters of the air"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "mestres",
      "ar",
      "masters"
    ],
    "tmdbId": 46518,
    "year": "2024",
    "rating": 7.756,
    "overview": "Durante a Segunda Guerra Mundial, os aviadores arriscam suas vidas com o 100º Grupo de Bombardeiros, uma irmandade forjada pela coragem, perda e triunfo.",
    "poster": "https://image.tmdb.org/t/p/w342/wUIUzCouKHc0PjfMdTB9q9J8Z5G.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/6snBXmgkscLEJQmxx46qEIlqYlB.jpg"
  },
  {
    "id": "apple-morning-show",
    "slug": "morning-show",
    "title": "The Morning Show",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "morning",
      "show"
    ],
    "tmdbId": 90282,
    "year": "2019",
    "rating": 7.732,
    "overview": "Entre no universo do noticiário da manhã na TV. Estrelando Reese Witherspoon, Jennifer Aniston e Steve Carell, este drama autêntico mostra os bastidores da TV sob a perspectiva de quem ajuda a América a acordar.",
    "poster": "https://image.tmdb.org/t/p/w342/y9x2R87yt2U616736NJrP0d56dt.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/uMsTtNaUEWOE2q64m8zthBIMgen.jpg"
  },
  {
    "id": "apple-monarch",
    "slug": "monarch",
    "title": "Monarch: Legado de Monstros",
    "altTitles": [
      "monarch legacy of monsters"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "monarch",
      "monstros"
    ],
    "tmdbId": 202411,
    "year": "2023",
    "rating": 7.71,
    "overview": "Após sobreviver ao ataque do Godzilla em São Francisco, Cate é abalada novamente por um segredo chocante. Em meio a ameaças monstruosas, ela embarca em uma aventura pelo mundo para descobrir a verdade sobre sua família—e a organização misteriosa conhecida como Monarch.",
    "poster": "https://image.tmdb.org/t/p/w342/reJ0kHd3DIp2bHQZAmLiqoTPnfw.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7IY4wELVMvtUc78vPiuL8kQV2iA.jpg"
  },
  {
    "id": "apple-foundation",
    "slug": "foundation",
    "title": "Fundação",
    "altTitles": [
      "foundation"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "fundacao",
      "foundation"
    ],
    "tmdbId": 93740,
    "year": "2021",
    "rating": 7.706,
    "overview": "Inspirada nas obras de romance de Isaac Asimov, Foundation retrata a épica jornada espacial de um grupo de exilados tentando salvar a humanidade durante a queda do Império Galáctico.",
    "poster": "https://image.tmdb.org/t/p/w342/6qRIQqWwnxVemvvDfFuK3kkIqpS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7NNNXo0qG2SqH4JoG7GPvJ2hzes.jpg"
  },
  {
    "id": "apple-for-all-mankind",
    "slug": "for-all-mankind",
    "title": "For All Mankind",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "for",
      "all",
      "mankind"
    ],
    "tmdbId": 87917,
    "year": "2019",
    "rating": 7.7,
    "overview": "Imagine um mundo em que a corrida espacial global nunca chegou ao fim. Essa série dramática de Ronald D. Moore é contada através das vidas dos astronautas da NASA e de suas famílias.",
    "poster": "https://image.tmdb.org/t/p/w342/JP3DItWMbrrLiKR5AYUfpsNf2b.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9OQ5BIITkJwRJo9JA6AlCfJIGBQ.jpg"
  },
  {
    "id": "apple-crowded-room",
    "slug": "crowded-room",
    "title": "Entre Estranhos",
    "altTitles": [
      "the crowded room"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "entre",
      "estranhos",
      "crowded"
    ],
    "tmdbId": 123192,
    "year": "2023",
    "rating": 7.639,
    "overview": "Um suspense psicológico que se passa em Manhattan no verão de 1979, quando um jovem é preso por um crime chocante, e uma investigadora improvável deve solucionar o mistério por trás dele.",
    "poster": "https://image.tmdb.org/t/p/w342/kjgM6baJMb4889MxHLwFAePowcb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kv9KH67hsVJ8RLplUBoc1kZlAtY.jpg"
  },
  {
    "id": "apple-tetris",
    "slug": "tetris",
    "title": "Tetris",
    "altTitles": [],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "tetris"
    ],
    "tmdbId": 726759,
    "year": "2023",
    "rating": 7.633,
    "overview": "Em 1988, o vendedor americano de vídeo games Henk Rogers descobre o Tetris. Quando ele se propõe a levar o jogo para o mundo e se depara com uma perigosa teia de mentiras e corrupção por trás da Cortina de Ferro.",
    "poster": "https://image.tmdb.org/t/p/w342/4F2QwCOYHJJjecSvdOjStuVLkpu.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4avmIRBBOs9b4DKoenf8SWWJJP7.jpg"
  },
  {
    "id": "apple-the-banker",
    "slug": "the-banker",
    "title": "O Banqueiro",
    "altTitles": [
      "the banker"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "banqueiro",
      "banker"
    ],
    "tmdbId": 627725,
    "year": "2020",
    "rating": 7.621,
    "overview": "Nos anos 60, dois afro-americanos traçam um plano de negócios engenhoso para lutar pela igualdade de acesso ao sonho americano.",
    "poster": "https://image.tmdb.org/t/p/w342/vwGI1Cxos7hnLj7BiV0pbMJTLlV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3ciAiEBD4yxZYoXMxEnZF6Q0u58.jpg"
  },
  {
    "id": "apple-servant",
    "slug": "servant",
    "title": "Servant",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "servant"
    ],
    "tmdbId": 88055,
    "year": "2019",
    "rating": 7.53,
    "overview": "A série de M. Night Shyamalan mostra o luto de um casal da Filadélfia depois que uma grande tragédia abala o casamento e permite que uma força misteriosa entre na casa da família.",
    "poster": "https://image.tmdb.org/t/p/w342/aMLUWhLtpSo45ibaWvE7ws3iyy7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7nsRpSCYcDGLcDmFAISHC8zMQ0D.jpg"
  },
  {
    "id": "apple-bad-sisters",
    "slug": "bad-sisters",
    "title": "Mal de Família",
    "altTitles": [
      "bad sisters"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "mal",
      "familia",
      "bad",
      "sisters"
    ],
    "tmdbId": 199318,
    "year": "2022",
    "rating": 7.517,
    "overview": "As unidas irmãs Garvey sempre cuidaram umas das outras. Mas quando o cunhado tóxico que todas queriam morto realmente morre, suas vidas são viradas de ponta-cabeça e seus laços são testados como nunca antes.",
    "poster": "https://image.tmdb.org/t/p/w342/yAkwOx16FaLFon6XmOhgyzQ7j0c.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aAVRi7XqkJZE6uUEn2Enbhj8rPx.jpg"
  },
  {
    "id": "apple-passos-gigante",
    "slug": "passos-gigante",
    "title": "Passos de Gigante",
    "altTitles": [
      "the greatest beer run ever"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "passos",
      "gigante",
      "beer"
    ],
    "tmdbId": 597922,
    "year": "2022",
    "rating": 7.514,
    "overview": "Chickie quer apoiar seus amigos que estão lutando na guerra do Vietnã e resolve fazer algo inusitado - pessoalmente levar cerveja americana para eles. O que começa como uma jornada bem intencionada, muda rapidamente a vida e as perspectivas de Chickie.",
    "poster": "https://image.tmdb.org/t/p/w342/jp3KDoyADU0eVPLQagBjXcaNO2d.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7bjaAcbrJDVvdF2Uew6rGp9Tp05.jpg"
  },
  {
    "id": "apple-tehran",
    "slug": "tehran",
    "title": "Teerã",
    "altTitles": [
      "tehran"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "teeran",
      "tehran"
    ],
    "tmdbId": 103913,
    "year": "2020",
    "rating": 7.5,
    "overview": "Tamar é uma agente e hacker infiltrada em Teerã tentando destruir um reator nuclear. Quando a missão falha e ela fica presa em sua nova vida, Tamar deve planejar uma operação que colocará seus entes queridos em perigo.",
    "poster": "https://image.tmdb.org/t/p/w342/l7V6xd2JX4Wihd4FWNC4PNafVyd.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2hpvEPS5ckA00g0H55gsxLWynNt.jpg"
  },
  {
    "id": "apple-snoopy-espaco",
    "slug": "snoopy-espaco",
    "title": "Snoopy no Espaço",
    "altTitles": [
      "snoopy in space"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "snoopy",
      "espaco"
    ],
    "tmdbId": 91249,
    "year": "2019",
    "rating": 7.5,
    "overview": "Decole com Snoopy em uma jornada a uma nova fronteira: o espaço! Com Charlie Brown, Woodstock, e o resto da turminha dos Peanuts, Snoopy embarca em aventuras épicas de exploração e descobertas interestelares.",
    "poster": "https://image.tmdb.org/t/p/w342/tYMq2eOct1LeVwJE8XAaFwr6ClF.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/rKAMgHfUpT7Xc5jFMOuG9G6jumG.jpg"
  },
  {
    "id": "apple-greyhound",
    "slug": "greyhound",
    "title": "Greyhound: Na Mira do Inimigo",
    "altTitles": [
      "greyhound"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "greyhound",
      "mira",
      "inimigo"
    ],
    "tmdbId": 516486,
    "year": "2020",
    "rating": 7.408,
    "overview": "O Capitão Ernest Krause lidera uma frota de 37 navios pelo Atlântico para entregar soldados e mantimentos indispensáveis às forças aliadas.",
    "poster": "https://image.tmdb.org/t/p/w342/5l1DwjqjZVJzv4ecE2yPnXIIU3C.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xXBnM6uSTk6qqCf0SRZKXcga9Ba.jpg"
  },
  {
    "id": "apple-killers-flower-moon",
    "slug": "killers-flower-moon",
    "title": "Assassinos da Lua das Flores",
    "altTitles": [
      "killers of the flower moon"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "assassinos",
      "lua",
      "flores",
      "killers"
    ],
    "tmdbId": 466420,
    "year": "2023",
    "rating": 7.398,
    "overview": "Na década de 1920, em Oklahoma, o povo da tribo Osage começa a ser assassinado após petróleo ser descoberto sob suas terras. O mistério começa a ser investigado por uma organização que ficaria conhecida como FBI.",
    "poster": "https://image.tmdb.org/t/p/w342/kBLMPD5BCmcrHKIhjZ86uWHZG5K.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1X7vow16X7CnCoexXh4H4F2yDJv.jpg"
  },
  {
    "id": "apple-cherry",
    "slug": "cherry",
    "title": "Cherry: Inocência Perdida",
    "altTitles": [
      "cherry"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "cherry",
      "inocencia"
    ],
    "tmdbId": 544401,
    "year": "2021",
    "rating": 7.308,
    "overview": "Cherry deixa a faculdade para servir no Iraque, apoiado por sua amada, Emily. Ao voltar da guerra com estresse pós-traumático, ele se envolve com crimes e drogas enquanto luta para reconquistar seu lugar no mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/qbSsR0IfnxdXZqfRMpH2PgLAbPV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kzXUQnrUnHUGHuwWbgf9KpoU3qr.jpg"
  },
  {
    "id": "apple-luck",
    "slug": "luck",
    "title": "Luck",
    "altTitles": [
      "sorte"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "luck",
      "sorte"
    ],
    "tmdbId": 248543,
    "year": "2014",
    "rating": 7.3,
    "overview": "João é internado em uma clínica psiquiátrica pela família. Lá ele se apaixona por Judite. Ela não tem muito tempo de vida, mas isso não impede que vivam um intenso romance.",
    "poster": "https://image.tmdb.org/t/p/w342/jj9nHVm6qtvb39na21C6vEs6rn8.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/zWHM8DzbIJ1xxOgmAg28yJ9N3X7.jpg"
  },
  {
    "id": "apple-sugar",
    "slug": "sugar",
    "title": "Sugar",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "sugar"
    ],
    "tmdbId": 203744,
    "year": "2024",
    "rating": 7.276,
    "overview": "Um detetive particular enigmático luta com seus demônios pessoais enquanto investiga o desaparecimento da neta de um produtor de Hollywood.",
    "poster": "https://image.tmdb.org/t/p/w342/dNrk52Rt13MxwahLneTZJezM6qD.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7sV0OgNkPiY9XPzr0f3rATFrGje.jpg"
  },
  {
    "id": "apple-family-plan",
    "slug": "family-plan",
    "title": "Plano em Família",
    "altTitles": [
      "the family plan"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "plano",
      "familia",
      "family",
      "plan"
    ],
    "tmdbId": 1029575,
    "year": "2023",
    "rating": 7.221,
    "overview": "Dan Morgan é muitas coisas: um marido dedicado, um pai amoroso, um reconhecido vendedor de carros. Ele também é um ex-assassino. E quando seu passado encontra seu presente, ele é forçado a levar sua desavisada família em uma viagem diferente de qualquer outra.",
    "poster": "https://image.tmdb.org/t/p/w342/3CezGI4ORSgVKk5Ch3UUWtL7SET.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/arNhhBd88bP3Bjoe4HT8MFE1JQA.jpg"
  },
  {
    "id": "apple-invasion",
    "slug": "invasion",
    "title": "Invasão",
    "altTitles": [
      "invasion"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "invasao",
      "invasion"
    ],
    "tmdbId": 127235,
    "year": "2021",
    "rating": 7.1,
    "overview": "Uma visita extraterrestre ameaça a existência humana. Os impactos dessa chegada são acompanhados em tempo real por cinco pessoas comuns. Em cantos diferentes do planeta, elas tentam encontrar sentido em meio ao caos.",
    "poster": "https://image.tmdb.org/t/p/w342/wDR8diLNJdlH5d4KzNnZXur9A6.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/i9IEOD1Li1y89xRHKH9kiE8dt9z.jpg"
  },
  {
    "id": "apple-truth-be-told",
    "slug": "truth-be-told",
    "title": "Truth Be Told",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "truth",
      "be",
      "told"
    ],
    "tmdbId": 80054,
    "year": "2019",
    "rating": 7.1,
    "overview": "Desvende o mundo dos podcasts sobre crimes reais. Novas evidências obrigam a podcaster Poppy Parnell a reabrir o caso de assassinato que fez dela uma sensação nacional.",
    "poster": "https://image.tmdb.org/t/p/w342/3T2TJ61ems7ArVGwb6kiVuKcdUk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cXjRGoYFAFkwPzhOZXFARPuYQ00.jpg"
  },
  {
    "id": "apple-macbeth",
    "slug": "macbeth",
    "title": "A Tragédia de Macbeth",
    "altTitles": [
      "the tragedy of macbeth"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "tragedia",
      "macbeth"
    ],
    "tmdbId": 591538,
    "year": "2021",
    "rating": 6.9,
    "overview": "Três bruxas convencem Lord Macbeth de que ele se tornará o próximo rei da Escócia e sua ambiciosa esposa está disposta a tudo para ajudá-lo em seu plano de conquistar o poder.",
    "poster": "https://image.tmdb.org/t/p/w342/pIKT6a3bD44a5sY4vVdP4xSPm9f.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lMjY6kMBOHhloz2Ul16fLJn8xuw.jpg"
  },
  {
    "id": "apple-ghosted",
    "slug": "ghosted",
    "title": "Ghosted: Sem Resposta",
    "altTitles": [
      "ghosted"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "ghosted",
      "sem",
      "resposta"
    ],
    "tmdbId": 868759,
    "year": "2023",
    "rating": 6.88,
    "overview": "O corretíssimo Cole se apaixona pela enigmática Sadie, mas logo enfrenta a chocante descoberta de que ela é uma agente secreta. Antes que eles possam decidir se terão ou não um segundo encontro, Cole e Sadie são arrastados para uma aventura internacional para salvar o mundo.",
    "poster": "https://image.tmdb.org/t/p/w342/89p7MQ3I5wKzOEO0OCCXEdUqX9R.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/pp3QUzMXfP7q0ocmE1b15FH6PQ6.jpg"
  },
  {
    "id": "apple-echo-3",
    "slug": "echo-3",
    "title": "Falcão Negro na Veia",
    "altTitles": [
      "echo 3"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "falcao",
      "negro",
      "echo"
    ],
    "tmdbId": 106116,
    "year": "2022",
    "rating": 6.786,
    "overview": "Quando a brilhante cientista Amber Chesborough desaparece perto da fronteira da Colômbia com a Venezuela, seu irmão e seu marido - ambos soldados americanos de elite - tem dificuldades em encontrar ela no meio de uma guerra de guerrilhas, e descobrindo que a mulher que eles amam pode ter um segredo.",
    "poster": "https://image.tmdb.org/t/p/w342/qaNu2gdgmeXcVfHFib4y2SlrgiH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/hTGqvVsvvCQGMOKUfNZ6n371QHG.jpg"
  },
  {
    "id": "apple-dark-matter",
    "slug": "dark-matter",
    "title": "Matéria Escura",
    "altTitles": [
      "dark matter"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "materia",
      "escura",
      "dark",
      "matter"
    ],
    "tmdbId": 62425,
    "year": "2015",
    "rating": 6.777,
    "overview": "Em Dark Matter, a tripulação de uma nave espacial abandonada é despertada da êxtase sem memórias de quem eles são ou como eles chegaram a bordo. Diante de ameaças, eles têm que trabalhar em conjunto para sobreviver a uma viagem carregada com vingança, traição e segredos escondidos. O elenco inclui Zoie Palmer (Lost Girl), Roger Cross (The Strain), Marc Bendavid (Bitten), Anthony Lemke (O Ataque), Melissa O’Neil (Les Miserables), Jodelle Ferland (Crepúsculo) e Alex Mallari, Jr (Robocop). Dark Matter é baseado na graphic novel Dark Matter por Joseph Mallozzi e Paul Mullie (da franquia Stargate).",
    "poster": "https://image.tmdb.org/t/p/w342/oWYOFBvIMkW64n51uD4mdje6k2u.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4wwWDjLfJVMt2hh8DIa2rzEx5VS.jpg"
  },
  {
    "id": "apple-physical",
    "slug": "physical",
    "title": "Physical",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "physical"
    ],
    "tmdbId": 119181,
    "year": "2021",
    "rating": 6.5,
    "overview": "Sheila Rubin é uma atormentada dona de casa na Califórnia dos anos 80, que enfrenta seus demônios e uma voz interior cruel. Mas tudo muda quando descobre a ginástica aeróbica, inaugurando uma jornada rumo ao sucesso.",
    "poster": "https://image.tmdb.org/t/p/w342/rViN9CbQcR1QB04c2D34m1O6KvX.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/g7dUj2TTXht4bQ4yxc9r5o0Yntq.jpg"
  },
  {
    "id": "apple-causeway",
    "slug": "causeway",
    "title": "Passagem",
    "altTitles": [
      "causeway"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "passagem",
      "causeway"
    ],
    "tmdbId": 595586,
    "year": "2022",
    "rating": 6.486,
    "overview": "Lynsey é uma militar que luta para se ajustar na volta para casa, em Nova Orleans, após uma lesão traumática. Quando ela conhece o mecânico local, James, a dupla começa a estabelecer um vínculo inesperado.",
    "poster": "https://image.tmdb.org/t/p/w342/81eQIYIR7i5W0XsB2PtvZAt4I9w.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/e3GJaLTXrKzFAMB2kIQtzgadBHw.jpg"
  },
  {
    "id": "apple-napoleao",
    "slug": "napoleao",
    "title": "Napoleão",
    "altTitles": [
      "napoleon"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "napoleao",
      "napoleon"
    ],
    "tmdbId": 753342,
    "year": "2023",
    "rating": 6.304,
    "overview": "Um olhar pessoal sobre as origens do líder militar francês e sua rápida e implacável ascensão a imperador. A história é vista através do prisma do relacionamento dependente e volátil de Napoleão com sua esposa e amor verdadeiro, Josefina.",
    "poster": "https://image.tmdb.org/t/p/w342/2UY2xfkgw9EgOOyA7ro3eyGJ9V9.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/33pMXav77ICRnceEBLhL8lXTywv.jpg"
  },
  {
    "id": "apple-big-door-prize",
    "slug": "big-door-prize",
    "title": "A Máquina do Destino",
    "altTitles": [
      "the big door prize"
    ],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "maquina",
      "destino",
      "big",
      "door"
    ],
    "tmdbId": 194704,
    "year": "2023",
    "rating": 6.2,
    "overview": "Uma cidade pequena é transformada pra sempre quando uma máquina misteriosa aparece prometendo revelar o potencial verdadeiro de todos. Rapidamente, os habitantes começam a mudar de emprego, repensar o relacionamento e a questionar valores arraigados - tudo em busca de um futuro melhor.",
    "poster": "https://image.tmdb.org/t/p/w342/h87tsF7a8hIoBqQSQNXpFYS5Doo.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2rfO7zh6e7rKaKCCvU4QrQwXLgv.jpg"
  },
  {
    "id": "apple-palm-royale",
    "slug": "palm-royale",
    "title": "Palm Royale",
    "altTitles": [],
    "type": "series",
    "streaming": "apple",
    "matchHints": [
      "palm",
      "royale"
    ],
    "tmdbId": 157367,
    "year": "2024",
    "rating": 6.103,
    "overview": "Em 1969, uma mulher ambiciosa aspira cruzar a linha que separa aqueles que têm e aqueles que não têm, buscando garantir seu lugar na mesa mais exclusiva, elegante e traiçoeira dos Estados Unidos: a alta sociedade de Palm Beach.",
    "poster": "https://image.tmdb.org/t/p/w342/68kLR2HM0RywZIOTYjLKiUlqErh.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/4dUTs2xkExkG3yKPNzxgGwRX6NF.jpg"
  },
  {
    "id": "apple-argylle",
    "slug": "argylle",
    "title": "Argylle: O Superespião",
    "altTitles": [
      "argylle"
    ],
    "type": "movie",
    "streaming": "apple",
    "matchHints": [
      "argylle",
      "superespiao"
    ],
    "tmdbId": 848538,
    "year": "2024",
    "rating": 5.994,
    "overview": "Quando os enredos dos romances de espionagem da reclusa autora Elly Conway começam a refletir as ações secretas de uma organização de espionagem da vida real, as noites tranquilas em casa tornam-se uma coisa do passado.  Acompanhada por seu gato Alfie e Aiden, um espião alérgico a gatos, Elly corre pelo mundo para ficar um passo à frente dos assassinos enquanto a linha entre o mundo fictício de Conway e o mundo real começa a se confundir.",
    "poster": "https://image.tmdb.org/t/p/w342/1ojCiMpYmCciIFuEcgLOOGLbUND.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mY3CRicUMaX3Btxv8yspud75UJu.jpg"
  },
  {
    "id": "globo-a-viagem",
    "slug": "a-viagem",
    "title": "A Viagem",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "viagem"
    ],
    "tmdbId": 283108,
    "year": "1975",
    "rating": 9.5,
    "overview": "Alexandre Veloso é um rapaz inconsequente e arruaceiro que matou um homem em uma tentativa de roubo. Ao fugir da polícia, é delatado pelo irmão Raul e pelo cunhado Téo. O famoso criminalista César Jordão não aceita defendê-lo nos tribunais, pois a vítima era um amigo pessoal. Para ajudá-lo, Alexandre conta apenas com a irmã mais velha, Diná, mulher de Téo, que luta para livrá-lo da cadeia. Até mesmo a namorada Lisa o abandona. Condenado, ele comete suicídio na prisão, amaldiçoando todos que o traíram.",
    "poster": "https://image.tmdb.org/t/p/w342/viKh6lODr48CMjYbTHXGGCANN6r.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/u2qa9JMr4PoPZGVSMJ3WAqVeBo0.jpg"
  },
  {
    "id": "globo-dpa",
    "slug": "dpa",
    "title": "DPA - Detetives do Prédio Azul",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "dpa",
      "detetives",
      "predio",
      "azul"
    ],
    "tmdbId": 71171,
    "year": "2012",
    "rating": 9.2,
    "overview": "Tom, Mila e Capim vivem no Prédio Azul. A cada episódio, vestem suas capas de detetives e investigam situações inesperadas, enfrentando a ira da síndica Leocádia.",
    "poster": "https://image.tmdb.org/t/p/w342/rrfp63IFXcQLXdR0xlFRwmt2F3h.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1h35EwwV836hwh8oPwFMPiXxD0o.jpg"
  },
  {
    "id": "globo-caso-evandro",
    "slug": "caso-evandro",
    "title": "O Caso Evandro",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "caso",
      "evandro"
    ],
    "tmdbId": 124407,
    "year": "2021",
    "rating": 9.1,
    "overview": "A série conta a história real de Evandro Ramos Caetano, uma criança de 6 anos de idade que desapareceu em abril de 1992, no litoral do Paraná. O corpo do garoto foi encontrado pouco tempo depois sem as mãos, cabelos e vísceras e um grupo confirmou que usou a criança em um ritual macabro. O caso na época ficou conhecido como “As Bruxas de Guaratuba”. Dois episódios semanais toda quinta-feira.",
    "poster": "https://image.tmdb.org/t/p/w342/90xXYiJ8BxCVsJkt3r8b0KVFZaM.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/AhJ0DZavpUUduWvU1q9R07dpTOW.jpg"
  },
  {
    "id": "globo-vale-escrito",
    "slug": "vale-escrito",
    "title": "Vale o Escrito - A Guerra do Jogo do Bicho",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "vale",
      "escrito",
      "jogo",
      "bicho"
    ],
    "tmdbId": 236267,
    "year": "2023",
    "rating": 8.8,
    "overview": "O jogo do bicho no Rio de Janeiro é controlado por famílias cujos chefes são também patronos de escolas de samba. Duas dessas famílias vivem sangrentas guerras de sucessão.",
    "poster": "https://image.tmdb.org/t/p/w342/qtlckAfiU6OLGTfSCTmtBoNxh1g.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7RIqtQknlyNQ3guppZjiCX2Qx0M.jpg"
  },
  {
    "id": "globo-grande-familia",
    "slug": "grande-familia",
    "title": "A Grande Família",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "grande",
      "familia"
    ],
    "tmdbId": 16183,
    "year": "2001",
    "rating": 8.4,
    "overview": "Um retrato bem-humorado do cotidiano repleto de conflitos, crises conjugais, dificuldades profissionais e financeiras e também de muito amor e união de uma família suburbana.",
    "poster": "https://image.tmdb.org/t/p/w342/draJzGrnfB8gEqCGJrPhNORu0nz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/tHrXHeIP62d14mi3PWZE06olVzo.jpg"
  },
  {
    "id": "globo-castelo-ra-tim-bum",
    "slug": "castelo-ra-tim-bum",
    "title": "Castelo Rá-Tim-Bum",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "castelo",
      "ra",
      "tim",
      "bum"
    ],
    "tmdbId": 35254,
    "year": "1994",
    "rating": 8.4,
    "overview": "Nino, um menino de 300 anos, vive no Castelo com seus tios Victor, um grande inventor, e Morgana, uma feiticeira de 5999 anos. Junto aos seus novos amigos, Biba, Pedro e Zequinha, eles vivem grandes aventuras.",
    "poster": "https://image.tmdb.org/t/p/w342/p9Yo9plrovUUl8sa3UFt3Q9bxpE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/bWIcKlkIge0AGYIxlB7AuyUJ5y5.jpg"
  },
  {
    "id": "globo-sai-de-baixo",
    "slug": "sai-de-baixo",
    "title": "Sai de Baixo",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "sai",
      "de",
      "baixo"
    ],
    "tmdbId": 20724,
    "year": "1996",
    "rating": 8.32,
    "overview": "Um apartamento no Largo do Arouche é o cenário para as confusões de uma divertida família!",
    "poster": "https://image.tmdb.org/t/p/w342/s5ZehoCj2uuHGHn9Xz1lZ3KfkmZ.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/SKkZ5NXx39eKwprD3bjWgDlTrx.jpg"
  },
  {
    "id": "globo-sessao-terapia",
    "slug": "sessao-terapia",
    "title": "Sessão de Terapia",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "sessao",
      "terapia"
    ],
    "tmdbId": 57553,
    "year": "2012",
    "rating": 8.3,
    "overview": "O terapeuta Caio Barone atende um paciente por dia da semana e, às sextas, passa por uma sessão com sua supervisora, Sofia.",
    "poster": "https://image.tmdb.org/t/p/w342/4Quq4DQoMgy3Q6Wdtn1SLYvnXG.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2LIDL5LWiLXTXs5nMqjtGgwu5JJ.jpg"
  },
  {
    "id": "globo-carcereiros",
    "slug": "carcereiros",
    "title": "Carcereiros",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "carcereiros"
    ],
    "tmdbId": 74175,
    "year": "2017",
    "rating": 8.3,
    "overview": "Adriano é um carcereiro responsável por passar o cadeado e controlar o acesso às celas de um presídio. Íntegro e avesso à violência, ele tenta garantir a tranquilidade no ambiente de trabalho, enquanto os dilemas em casa tomam proporções inesperadas.",
    "poster": "https://image.tmdb.org/t/p/w342/odn7gdoSfOwXZbm3Tf1JBOkAkdr.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/7hKVJT7ru9TeMOpj1w9dNDALN3U.jpg"
  },
  {
    "id": "globo-tapas-beijos",
    "slug": "tapas-beijos",
    "title": "Tapas e Beijos",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "tapas",
      "beijos"
    ],
    "tmdbId": 46021,
    "year": "2011",
    "rating": 8.3,
    "overview": "Grandes amigas, Fátima e Sueli tentam achar suas caras-metades enquanto trabalham em uma loja de aluguel de vestidos de noiva, ajudando mulheres a realizarem seus sonhos.",
    "poster": "https://image.tmdb.org/t/p/w342/7STF15AEhpBsIErShwlonj8klQa.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/aKTOzXOdFdLmvqzyUPn1YuD5TIV.jpg"
  },
  {
    "id": "globo-a-divisao",
    "slug": "a-divisao",
    "title": "A Divisão",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "divisao"
    ],
    "tmdbId": 91296,
    "year": "2019",
    "rating": 8.143,
    "overview": "O Rio de Janeiro está acuado por uma onda de sequestros nos anos 90. As forças de segurança chamam agentes de fama controversa para salvar a cidade de bandidos e até da polícia.",
    "poster": "https://image.tmdb.org/t/p/w342/An3TOHOWXIhAUnZ5O7pDzpnZTMz.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/wpCq9vD1of69h1wb57lu2gp5eal.jpg"
  },
  {
    "id": "globo-avenida-brasil",
    "slug": "avenida-brasil",
    "title": "Avenida Brasil",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "avenida",
      "brasil"
    ],
    "tmdbId": 45815,
    "year": "2012",
    "rating": 8.1,
    "overview": "Rita é abandonada no lixão pela madrasta após seu pai morrer. Anos depois e sob nova identidade, a menina se infiltra na mansão da nova família de Carminha para se vingar dela.",
    "poster": "https://image.tmdb.org/t/p/w342/p8uzK1Lngu9q9dpnn4SwPKIT1H7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/cQDSKcsqNQZFPXjMGvV50foXgUf.jpg"
  },
  {
    "id": "globo-o-clone",
    "slug": "o-clone",
    "title": "O Clone",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "clone"
    ],
    "tmdbId": 14853,
    "year": "2001",
    "rating": 8,
    "overview": "Lucas e Jade se apaixonam no Marrocos. Lucas é irmão gêmeo de Diogo, que morre em um acidente. Albieri tentar fazer a primeira clonagem humana para trazer Diogo de volta.",
    "poster": "https://image.tmdb.org/t/p/w342/7lurHhkwgz4xrFvplmHrMqqjwkV.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/jdzd5rTeUi1njP4SPJf43SpDSUf.jpg"
  },
  {
    "id": "globo-mulheres-areia",
    "slug": "mulheres-areia",
    "title": "Mulheres de Areia",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "mulheres",
      "areia"
    ],
    "tmdbId": 282658,
    "year": "1973",
    "rating": 8,
    "overview": "De passagem pela cidadezinha praiana onde sua família tem negócios, Marcos conhece e se apaixona pela doce Ruth, filha de pescadores. Porém, acaba envolvido por Raquel, a irmã gêmea dela, que lhe rouba o namorado. As irmãs são idênticas fisicamente, mas de personalidades opostas. Enquanto Ruth ama Marcos, Raquel ambiciona sua fortuna e mantem um caso amoroso com Wanderley, um mau-caráter.",
    "poster": "https://image.tmdb.org/t/p/w342/z2Rya5O5o1hCMGK8A3E4olugCv1.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/mRQPmFVX0i9RVfHixYiSPUAHQQv.jpg"
  },
  {
    "id": "globo-chocolate-pimenta",
    "slug": "chocolate-pimenta",
    "title": "Chocolate com Pimenta",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "chocolate",
      "pimenta"
    ],
    "tmdbId": 17674,
    "year": "2003",
    "rating": 8,
    "overview": "Uma doce e humilde moça, ridicularizada por todos, se transforma em uma linda milionária ao se casar com um grande e generoso amigo.",
    "poster": "https://image.tmdb.org/t/p/w342/vPh5Fo4ptnHrI8Ku0QplHrSoeDe.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/2XGClQjMgz317DM0FpIjlU7qK49.jpg"
  },
  {
    "id": "globo-arcanjo-renegado",
    "slug": "arcanjo-renegado",
    "title": "Arcanjo Renegado",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "arcanjo",
      "renegado"
    ],
    "tmdbId": 99125,
    "year": "2020",
    "rating": 8,
    "overview": "Mikhael é o líder da principal equipe do BOPE. Quando um dos seus amigos é ferido em uma operação, ele busca vingança e acaba em conflito com a alta cúpula política do estado.",
    "poster": "https://image.tmdb.org/t/p/w342/p7gsnKeSQsyNYO7QrW5xedd3QTe.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/pWOIRfG9auWSXRDL1QIajQ1cyuM.jpg"
  },
  {
    "id": "globo-toma-la-da-ca",
    "slug": "toma-la-da-ca",
    "title": "Toma Lá, Dá Cá",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "toma",
      "la",
      "da",
      "ca"
    ],
    "tmdbId": 17109,
    "year": "2007",
    "rating": 8,
    "overview": "Duas famílias separadas por um corredor, mas que participam ativamente da vida uns dos outros.",
    "poster": "https://image.tmdb.org/t/p/w342/d00Hpwh70yAapKSmaIhBhTFn3HN.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/j46YBxcV9LiOY2eKgbSHuAvaJpI.jpg"
  },
  {
    "id": "globo-linha-direta",
    "slug": "linha-direta",
    "title": "Linha Direta",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "linha",
      "direta"
    ],
    "tmdbId": 17113,
    "year": "1990",
    "rating": 8,
    "overview": "A cada semana, o programa apresenta um crime já solucionado com o auxílio da dramatização de atores, e outro com desfecho ainda em aberto, com foragidos da justiça.",
    "poster": "https://image.tmdb.org/t/p/w342/7FcRnh2wVrFdRoWFDf2P64UgfbR.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/epSwv8waFbMxFIwt6fAzCPGlTcx.jpg"
  },
  {
    "id": "globo-senhora-destino",
    "slug": "senhora-destino",
    "title": "Senhora do Destino",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "senhora",
      "destino"
    ],
    "tmdbId": 46101,
    "year": "2004",
    "rating": 7.9,
    "overview": "Em 1968, a jovem Maria do Carmo muda-se para o Rio de Janeiro vinda de Pernambuco, a fim de fugir à miséria e encontrar o marido. Porém, mal chega à cidade cai em meio a uma revolta, com a polícia e o exército envolvidos em confrontos com manifestantes. No meio da confusão, a sua filha bebé, Lindalva, é roubada por uma outra mulher, Nazaré. Trinta anos depois, Maria do Carmo ainda não desistiu de procurar a sua filha desaparecida e se vingar da sua inimiga.",
    "poster": "https://image.tmdb.org/t/p/w342/x74oguhQltDFw8rUZX5C0Li9N56.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/p5D492rqjQmrcc8rQPLkcJ9FPpa.jpg"
  },
  {
    "id": "globo-celebridade",
    "slug": "celebridade",
    "title": "Celebridade",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "celebridade"
    ],
    "tmdbId": 46100,
    "year": "2003",
    "rating": 7.9,
    "overview": "A rivalidade entre duas mulheres: a bem-sucedida empresária e ex-modelo Maria Clara, e a dissimulada e ardilosa Laura, que se aproxima da rival dizendo ser sua maior admiradora. Na verdade, ela trama tomar posse de tudo que é de Maria Clara.",
    "poster": "https://image.tmdb.org/t/p/w342/w1ROW7YvjoPVkQJ6P1yp6rLNOTS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ciwJBJo9eAs1eZVOdFA4d1S8v4E.jpg"
  },
  {
    "id": "globo-pcc",
    "slug": "pcc",
    "title": "PCC: Poder Secreto",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "pcc",
      "poder",
      "secreto"
    ],
    "tmdbId": 201320,
    "year": "2022",
    "rating": 7.9,
    "overview": "A série apresenta o Primeiro Comando da Capital através de antigos participantes e famílias que tiveram algum tipo de contato com os criminosos.",
    "poster": "https://image.tmdb.org/t/p/w342/jatkeB0a9RvlGJhhaeeZCekEKd0.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/r8obOnHqrjOgeHBc7MAgZoGvfvG.jpg"
  },
  {
    "id": "globo-verdades-secretas",
    "slug": "verdades-secretas",
    "title": "Verdades Secretas",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "verdades",
      "secretas"
    ],
    "tmdbId": 62917,
    "year": "2015",
    "rating": 7.819,
    "overview": "Um triângulo amoroso envolvendo mãe e filha é o foco incendiário de Verdades Secretas, que traz como pano de fundo o lado obscuro do mundo da moda e explora os limites de cada um.",
    "poster": "https://image.tmdb.org/t/p/w342/js4ME0psGSLwJQs3zbiYN2fhlEE.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lU28XFV7ITJLnWAqRJpvK10deA6.jpg"
  },
  {
    "id": "globo-a-favorita",
    "slug": "a-favorita",
    "title": "A Favorita",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "favorita"
    ],
    "tmdbId": 7448,
    "year": "2008",
    "rating": 7.8,
    "overview": "Duas mulheres. Uma dupla sertaneja. Um crime no passado. Duas versões de uma mesma história. Quem está dizendo a verdade?",
    "poster": "https://image.tmdb.org/t/p/w342/sp6VyduIK2FnRQOALEAHF9D0jAb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/fDBIVzxxtQ6jA0AindKKTkWEMq2.jpg"
  },
  {
    "id": "globo-os-normais",
    "slug": "os-normais",
    "title": "Os Normais",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "os",
      "normais"
    ],
    "tmdbId": 15166,
    "year": "2001",
    "rating": 7.8,
    "overview": "Rui e Vani são um casal de classe média com manias, preconceitos e falhas de caráter. Noivos há anos, têm teorias absurdas e podem tornar qualquer fator da vida a dois em confusão.",
    "poster": "https://image.tmdb.org/t/p/w342/1ULaMBSsEB3jArOe19jxgJvpW8N.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/1NUOus0JFdQ3pCScP4uQVRTXQKS.jpg"
  },
  {
    "id": "globo-boate-kiss",
    "slug": "boate-kiss",
    "title": "Boate Kiss: A Tragédia de Santa Maria",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "boate",
      "kiss",
      "santa",
      "maria"
    ],
    "tmdbId": 217218,
    "year": "2023",
    "rating": 7.8,
    "overview": "Marcelo Canellas conta a história de luta por justiça protagonizada por familiares das vítimas de uma das maiores tragédias do Brasil: o incêndio da Boate Kiss.",
    "poster": "https://image.tmdb.org/t/p/w342/wOCdlxYhYrDZ9SgCjfK7lSVQ6vB.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/ipVnQnQscN2B3Ieag5VnZ6Mm2g2.jpg"
  },
  {
    "id": "globo-rei-do-gado",
    "slug": "rei-do-gado",
    "title": "O Rei do Gado",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "rei",
      "gado"
    ],
    "tmdbId": 41731,
    "year": "1996",
    "rating": 7.7,
    "overview": "A trama conta a saga de Bruno Mezenga e Luana Berdinazi, descendentes de duas famílias de imigrantes italianos rivais. Ao se envolverem, os dois redimem o ódio entre suas famílias.",
    "poster": "https://image.tmdb.org/t/p/w342/gnRalif7ym8ovyDMr3glYVEq1tk.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/xrJR8Yvw4l6004spZo5MBW17Q2W.jpg"
  },
  {
    "id": "globo-daniella-perez",
    "slug": "daniella-perez",
    "title": "Daniella Perez: Pacto Brutal",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "daniella",
      "perez",
      "pacto"
    ],
    "tmdbId": 204774,
    "year": "2022",
    "rating": 7.6,
    "overview": "Nos anos 90, Daniella Perez, uma das estrelas da novela de maior sucesso do Brasil é assassinada por seu companheiro de cena. Sua mãe se transformou em uma investigadora incansável e hoje compartilha os detalhes da sua saga pela justiça.",
    "poster": "https://image.tmdb.org/t/p/w342/7tE21vgcDLCxRd5LpuMC0tJPqYH.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/dGuXi7jssttxramkFvYjKWlFBvp.jpg"
  },
  {
    "id": "globo-caminho-indias",
    "slug": "caminho-indias",
    "title": "Caminho das Índias",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "caminho",
      "indias"
    ],
    "tmdbId": 7979,
    "year": "2009",
    "rating": 7.5,
    "overview": "Ambientada na Índia e no Brasil, a trama conta a saga de Maya e Raj, que têm um casamento arranjado. Primeira novela brasileira a vencer o Prêmio Emmy Internacional.",
    "poster": "https://image.tmdb.org/t/p/w342/xyix3KOYBZd1zqwy051Bhtwe3Vv.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vYAkx4BQeIb9OkGCMZe5xL1RUeV.jpg"
  },
  {
    "id": "globo-os-outros",
    "slug": "os-outros",
    "title": "Os Outros",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "os",
      "outros"
    ],
    "tmdbId": 196421,
    "year": "2023",
    "rating": 7.4,
    "overview": "Dois casais vizinhos entram em choque após a briga de seus filhos, com consequências absurdas.",
    "poster": "https://image.tmdb.org/t/p/w342/qXeqUSGQi7Ld91t1xpJGy12laY7.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/lfUPe1AlBcjTLYER6bxkBOhDJ8F.jpg"
  },
  {
    "id": "globo-sob-pressao",
    "slug": "sob-pressao",
    "title": "Sob Pressão",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "sob",
      "pressao"
    ],
    "tmdbId": 73010,
    "year": "2017",
    "rating": 7.4,
    "overview": "Acompanhe a rotina de entrega, esforço e muita pressão pela qual os médicos de um hospital público passam todos os dias. Em comum, o desejo de salvar vidas.",
    "poster": "https://image.tmdb.org/t/p/w342/lGWf1lqeHOhuKZX9bQPeAKttxnb.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/sql1v8szmHZNPCRfNhSwNpMqOnn.jpg"
  },
  {
    "id": "globo-justica",
    "slug": "justica",
    "title": "Justiça",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "justica"
    ],
    "tmdbId": 67535,
    "year": "2016",
    "rating": 7.3,
    "overview": "Traição, desejo de vingança, assassinatos e armações são alguns dos temas de quatro histórias nas quais há sempre um dilema moral envolvido.",
    "poster": "https://image.tmdb.org/t/p/w342/2Jit3hR4CY4LrU06fiLdF0L7SPS.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/gBeU79pyqJVGdweG1Mt3YxXeNI0.jpg"
  },
  {
    "id": "globo-todas-flores",
    "slug": "todas-flores",
    "title": "Todas as Flores",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "todas",
      "flores"
    ],
    "tmdbId": 196429,
    "year": "2022",
    "rating": 7.1,
    "overview": "Maíra, uma jovem cega, será usada pela mãe para doar a medula para a irmã. O que seria um recomeço feliz vira uma perigosa jornada para ela sobreviver e ficar com seu grande amor.",
    "poster": "https://image.tmdb.org/t/p/w342/zAqaycJCuBKHiyHkvhxpjRM2Cmi.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/kRgLSJv2TGLEDc9XLh6RGWSEvKz.jpg"
  },
  {
    "id": "globo-cravo-rosa",
    "slug": "cravo-rosa",
    "title": "O Cravo e a Rosa",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "cravo",
      "rosa"
    ],
    "tmdbId": 8361,
    "year": "2000",
    "rating": 7.1,
    "overview": "Para salvar sua fazenda, o rude Petruchio corteja a geniosa Catarina, filha do banqueiro Nicanor. Os dois acabam se apaixonando de verdade, mas nenhum dá o braço a torcer.",
    "poster": "https://image.tmdb.org/t/p/w342/kMNNvkzoLIk8NjIegwq7mNI721O.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/c7HyfB3VPIxN5M54IVs9GxZTOrI.jpg"
  },
  {
    "id": "globo-tititi",
    "slug": "tititi",
    "title": "Tititi",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "tititi"
    ],
    "tmdbId": 46182,
    "year": "2010",
    "rating": 7.1,
    "overview": "Inimigos desde a infância, André Spina e Ariclenes Martins se transformaram em Jacques Leclair e Victor Valentim e agora disputam os holofotes do mundo da moda.",
    "poster": "https://image.tmdb.org/t/p/w342/hWT4jF2Z45kET7AALnOhWyOXP9A.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/3iJfrk24QtZ0mLEyAZ1WiBjoyla.jpg"
  },
  {
    "id": "globo-desalma",
    "slug": "desalma",
    "title": "Desalma",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "desalma"
    ],
    "tmdbId": 97711,
    "year": "2020",
    "rating": 7.1,
    "overview": "Em Brígida, cidade brasileira colonizada por ucranianos, uma festa pagã é banida após tragédia. Trinta anos depois, ela está de volta, mas eventos sombrios afligem a cidade. ",
    "poster": "https://image.tmdb.org/t/p/w342/iup4ism2LHRueXyoQ7kZCRnQiuT.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/geNfmuMuyYPqbC10MLKNJxHsqHy.jpg"
  },
  {
    "id": "globo-cilada",
    "slug": "cilada",
    "title": "Cilada",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "cilada"
    ],
    "tmdbId": 255087,
    "year": "2024",
    "rating": 7,
    "overview": "Bruno vive diferentes situações em que tudo dá errado. Viagens com amigos, churrascos, relações nas redes sociais e até procurar um emprego se transformam em verdadeiras ciladas.",
    "poster": "https://image.tmdb.org/t/p/w342/xHg419wNwWViZyVMbqgTDVGS4hl.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/vSbTfYMXpeDIZpgOrzF3VfSqntU.jpg"
  },
  {
    "id": "globo-xuxa-doc",
    "slug": "xuxa-doc",
    "title": "Xuxa, o Documentário",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "xuxa",
      "documentario"
    ],
    "tmdbId": 223318,
    "year": "2023",
    "rating": 7,
    "overview": "A trajetória de Maria da Graça Xuxa Meneghel e como ela conquistou o Brasil e se consagrou a Rainha dos Baixinhos.",
    "poster": "https://image.tmdb.org/t/p/w342/v0766HNvljZ4PY6ghG57h2hva6x.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qXiVzw1Oc3jM0QgCyjFUSqHxljh.jpg"
  },
  {
    "id": "globo-lacos-familia",
    "slug": "lacos-familia",
    "title": "Laços de Família",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "lacos",
      "familia"
    ],
    "tmdbId": 34957,
    "year": "2000",
    "rating": 6.9,
    "overview": "O amor incondicional de uma mãe pela filha direciona a crônica urbana na qual o autor Manoel Carlos fala de temas universais com doses equilibradas de folhetim e realismo.",
    "poster": "https://image.tmdb.org/t/p/w342/tx2oX3AZ5UMXLsOH7TtLjRVeO7f.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/e57B00sgDb71aDmfGyOOWjN2FlI.jpg"
  },
  {
    "id": "globo-alma-gemea",
    "slug": "alma-gemea",
    "title": "Alma Gêmea",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "alma",
      "gemea"
    ],
    "tmdbId": 16120,
    "year": "2005",
    "rating": 6.8,
    "overview": "Nos anos 1920, Rafael e Luna se apaixonam. Assassinada a mando da invejosa Cristina, Luna reencarna como Serena e novamente se apaixona por Rafael, confirmando o amor eterno.",
    "poster": "https://image.tmdb.org/t/p/w342/2HxNkrtEOgP4VEKzVBdBHHsnO6o.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/qgxBIKr9M2UXzMm6DhFQexdiWli.jpg"
  },
  {
    "id": "globo-ilha-ferro",
    "slug": "ilha-ferro",
    "title": "Ilha de Ferro",
    "altTitles": [],
    "type": "series",
    "streaming": "globoplay",
    "matchHints": [
      "ilha",
      "ferro"
    ],
    "tmdbId": 84104,
    "year": "2018",
    "rating": 6.7,
    "overview": "Os homens e mulheres que trabalham em uma plataforma de petróleo vivem duas vidas: uma na terra, outra no mar, onde passam semanas confinados na \"ilha de ferro\", enfrentando riscos e desafios. Em alto-mar, eles são heróis; no continente, nem tanto.",
    "poster": "https://image.tmdb.org/t/p/w342/jN03YxeJ4eylVbUuavYUdL84N4T.jpg",
    "backdrop": "https://image.tmdb.org/t/p/w780/9jfHo1CwLj0EwDDILnjVP2AxWnB.jpg"
  }
]
