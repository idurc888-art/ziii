export type Streaming = 'netflix' | 'amazon' | 'hbo' | 'disney' | 'paramount' | 'apple'

export interface CanonicalTitle {
  id: string
  slug: string
  title: string
  altTitles: string[]
  type: 'movie' | 'series'
  streaming: Streaming
  matchHints: string[]
}

export const CANONICAL_CATALOG: CanonicalTitle[] = [
  {
    "id": "netflix-resgate",
    "slug": "resgate",
    "title": "Resgate",
    "altTitles": [
      "extraction"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "resgate"
    ]
  },
  {
    "id": "netflix-resgate-2",
    "slug": "resgate-2",
    "title": "Resgate 2",
    "altTitles": [
      "extraction 2"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "resgate"
    ]
  },
  {
    "id": "netflix-agente-oculto",
    "slug": "agente-oculto",
    "title": "Agente Oculto",
    "altTitles": [
      "the gray man"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "agente",
      "oculto"
    ]
  },
  {
    "id": "netflix-alerta-vermelho",
    "slug": "alerta-vermelho",
    "title": "Alerta Vermelho",
    "altTitles": [
      "red notice"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "alerta",
      "vermelho"
    ]
  },
  {
    "id": "netflix-a-mae",
    "slug": "a-mae",
    "title": "A Mãe",
    "altTitles": [
      "the mother"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": []
  },
  {
    "id": "netflix-esquadrao-6",
    "slug": "esquadrao-6",
    "title": "Esquadrão 6",
    "altTitles": [
      "6 underground"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "esquadrão"
    ]
  },
  {
    "id": "netflix-the-old-guard",
    "slug": "the-old-guard",
    "title": "The Old Guard",
    "altTitles": [
      "a guarda imortal"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "guard"
    ]
  },
  {
    "id": "netflix-kate",
    "slug": "kate",
    "title": "Kate",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "kate"
    ]
  },
  {
    "id": "netflix-misterio-no-mediterraneo",
    "slug": "misterio-no-mediterraneo",
    "title": "Mistério no Mediterrâneo",
    "altTitles": [
      "murder mystery"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "mistério",
      "mediterrâneo"
    ]
  },
  {
    "id": "netflix-nao-olhe-para-cima",
    "slug": "nao-olhe-para-cima",
    "title": "Não Olhe Para Cima",
    "altTitles": [
      "dont look up"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "olhe",
      "cima"
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "netflix-bird-box",
    "slug": "bird-box",
    "title": "Bird Box",
    "altTitles": [
      "caixa de passaros"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "bird"
    ]
  },
  {
    "id": "netflix-enola-holmes",
    "slug": "enola-holmes",
    "title": "Enola Holmes",
    "altTitles": [],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "enola",
      "holmes"
    ]
  },
  {
    "id": "netflix-o-projeto-adam",
    "slug": "o-projeto-adam",
    "title": "O Projeto Adam",
    "altTitles": [
      "the adam project"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "projeto",
      "adam"
    ]
  },
  {
    "id": "netflix-donzela",
    "slug": "donzela",
    "title": "Donzela",
    "altTitles": [
      "damsel"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "donzela"
    ]
  },
  {
    "id": "netflix-a-fera-do-mar",
    "slug": "a-fera-do-mar",
    "title": "A Fera do Mar",
    "altTitles": [
      "the sea beast"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "fera"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "netflix-o-golpista-do-tinder",
    "slug": "o-golpista-do-tinder",
    "title": "O Golpista do Tinder",
    "altTitles": [
      "tinder swindler"
    ],
    "type": "movie",
    "streaming": "netflix",
    "matchHints": [
      "golpista",
      "tinder"
    ]
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
    ]
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
    ]
  },
  {
    "id": "netflix-stranger-things",
    "slug": "stranger-things",
    "title": "Stranger Things",
    "altTitles": [
      "st"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "stranger",
      "things"
    ]
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
    ]
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
    ]
  },
  {
    "id": "netflix-round-6",
    "slug": "round-6",
    "title": "Round 6",
    "altTitles": [
      "squid game"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "round"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "netflix-black-mirror",
    "slug": "black-mirror",
    "title": "Black Mirror",
    "altTitles": [
      "espelho negro"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "black",
      "mirror"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    "matchHints": []
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
    ]
  },
  {
    "id": "netflix-sex-education",
    "slug": "sex-education",
    "title": "Sex Education",
    "altTitles": [
      "educacao sexual"
    ],
    "type": "series",
    "streaming": "netflix",
    "matchHints": [
      "education"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-matador-de-aluguel",
    "slug": "matador-de-aluguel",
    "title": "Matador de Aluguel",
    "altTitles": [
      "killer"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "matador",
      "aluguel"
    ]
  },
  {
    "id": "amazon-a-guerra-do-amanha",
    "slug": "a-guerra-do-amanha",
    "title": "A Guerra do Amanhã",
    "altTitles": [
      "tomorrow war"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "guerra",
      "amanhã"
    ]
  },
  {
    "id": "amazon-sem-remorso",
    "slug": "sem-remorso",
    "title": "Sem Remorso",
    "altTitles": [
      "without remorse"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "remorso"
    ]
  },
  {
    "id": "amazon-beekeeper",
    "slug": "beekeeper",
    "title": "Beekeeper",
    "altTitles": [
      "beekeeper rede vinganca"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "beekeeper"
    ]
  },
  {
    "id": "amazon-saltburn",
    "slug": "saltburn",
    "title": "Saltburn",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "saltburn"
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-paddington-2",
    "slug": "paddington-2",
    "title": "Paddington 2",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "paddington"
    ]
  },
  {
    "id": "amazon-sonic-2",
    "slug": "sonic-2",
    "title": "Sonic 2",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "sonic"
    ]
  },
  {
    "id": "amazon-borat-2",
    "slug": "borat-2",
    "title": "Borat 2",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "borat"
    ]
  },
  {
    "id": "amazon-palm-springs",
    "slug": "palm-springs",
    "title": "Palm Springs",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "palm",
      "springs"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-hereditario",
    "slug": "hereditario",
    "title": "Hereditário",
    "altTitles": [
      "hereditary"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "hereditário"
    ]
  },
  {
    "id": "amazon-midsommar",
    "slug": "midsommar",
    "title": "Midsommar",
    "altTitles": [],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "midsommar"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-podres-de-ricos",
    "slug": "podres-de-ricos",
    "title": "Podres de Ricos",
    "altTitles": [
      "crazy rich asians"
    ],
    "type": "movie",
    "streaming": "amazon",
    "matchHints": [
      "podres",
      "ricos"
    ]
  },
  {
    "id": "amazon-the-boys",
    "slug": "the-boys",
    "title": "The Boys",
    "altTitles": [
      "os garotos"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "boys"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-o-senhor-dos-aneis-os-aneis-de-poder",
    "slug": "o-senhor-dos-aneis-os-aneis-de-poder",
    "title": "O Senhor dos Anéis Os Anéis de Poder",
    "altTitles": [
      "rings of power"
    ],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "senhor",
      "anéis",
      "anéis"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-mad-men",
    "slug": "mad-men",
    "title": "Mad Men",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": []
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "amazon-the-terror",
    "slug": "the-terror",
    "title": "The Terror",
    "altTitles": [],
    "type": "series",
    "streaming": "amazon",
    "matchHints": [
      "terror"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "hbo-blade-runner-2049",
    "slug": "blade-runner-2049",
    "title": "Blade Runner 2049",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "blade",
      "runner",
      "2049"
    ]
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
    ]
  },
  {
    "id": "hbo-tenet",
    "slug": "tenet",
    "title": "Tenet",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "tenet"
    ]
  },
  {
    "id": "hbo-invocacao-do-mal",
    "slug": "invocacao-do-mal",
    "title": "Invocação do Mal",
    "altTitles": [
      "conjuring"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "invocação"
    ]
  },
  {
    "id": "hbo-it-a-coisa",
    "slug": "it-a-coisa",
    "title": "IT A Coisa",
    "altTitles": [
      "it"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "coisa"
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "hbo-se7en",
    "slug": "se7en",
    "title": "Se7en",
    "altTitles": [
      "seven"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "se7en"
    ]
  },
  {
    "id": "hbo-lego-batman",
    "slug": "lego-batman",
    "title": "Lego Batman",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "lego",
      "batman"
    ]
  },
  {
    "id": "hbo-a-viagem-de-chihiro",
    "slug": "a-viagem-de-chihiro",
    "title": "A Viagem de Chihiro",
    "altTitles": [
      "spirited away"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "viagem",
      "chihiro"
    ]
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
    ]
  },
  {
    "id": "hbo-o-magico-de-oz",
    "slug": "o-magico-de-oz",
    "title": "O Mágico de Oz",
    "altTitles": [
      "wizard of oz"
    ],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "mágico"
    ]
  },
  {
    "id": "hbo-wonka",
    "slug": "wonka",
    "title": "Wonka",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "wonka"
    ]
  },
  {
    "id": "hbo-sherlock-holmes",
    "slug": "sherlock-holmes",
    "title": "Sherlock Holmes",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "sherlock",
      "holmes"
    ]
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
    ]
  },
  {
    "id": "hbo-in-the-heights",
    "slug": "in-the-heights",
    "title": "In the Heights",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "heights"
    ]
  },
  {
    "id": "hbo-hairspray",
    "slug": "hairspray",
    "title": "Hairspray",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "hairspray"
    ]
  },
  {
    "id": "hbo-sweeney-todd",
    "slug": "sweeney-todd",
    "title": "Sweeney Todd",
    "altTitles": [],
    "type": "movie",
    "streaming": "hbo",
    "matchHints": [
      "sweeney",
      "todd"
    ]
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
    ]
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
    ]
  },
  {
    "id": "hbo-the-last-of-us",
    "slug": "the-last-of-us",
    "title": "The Last of Us",
    "altTitles": [
      "tlou"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "last"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "hbo-band-of-brothers",
    "slug": "band-of-brothers",
    "title": "Band of Brothers",
    "altTitles": [
      "irmãos de sangue"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "band",
      "brothers"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "hbo-the-big-bang-theory",
    "slug": "the-big-bang-theory",
    "title": "The Big Bang Theory",
    "altTitles": [
      "tbbt"
    ],
    "type": "series",
    "streaming": "hbo",
    "matchHints": [
      "bang",
      "theory"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-pantera-negra",
    "slug": "pantera-negra",
    "title": "Pantera Negra",
    "altTitles": [
      "black panther"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "pantera",
      "negra"
    ]
  },
  {
    "id": "disney-deadpool-e-wolverine",
    "slug": "deadpool-e-wolverine",
    "title": "Deadpool e Wolverine",
    "altTitles": [
      "deadpool 3"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "deadpool",
      "wolverine"
    ]
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
    ]
  },
  {
    "id": "disney-shang-chi",
    "slug": "shang-chi",
    "title": "Shang-Chi",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "shang-chi"
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-star-wars-uma-nova-esperanca",
    "slug": "star-wars-uma-nova-esperanca",
    "title": "Star Wars Uma Nova Esperança",
    "altTitles": [
      "new hope"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "star",
      "wars",
      "nova"
    ]
  },
  {
    "id": "disney-avatar",
    "slug": "avatar",
    "title": "Avatar",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "avatar"
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-malevola",
    "slug": "malevola",
    "title": "Malévola",
    "altTitles": [
      "maleficent"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "malévola"
    ]
  },
  {
    "id": "disney-frozen",
    "slug": "frozen",
    "title": "Frozen",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "frozen"
    ]
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
    ]
  },
  {
    "id": "disney-moana",
    "slug": "moana",
    "title": "Moana",
    "altTitles": [],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "moana"
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-soul",
    "slug": "soul",
    "title": "Soul",
    "altTitles": [
      "alma"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "soul"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-high-school-musical",
    "slug": "high-school-musical",
    "title": "High School Musical",
    "altTitles": [
      "hsm"
    ],
    "type": "movie",
    "streaming": "disney",
    "matchHints": [
      "high",
      "school",
      "musical"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
  {
    "id": "disney-percy-jackson",
    "slug": "percy-jackson",
    "title": "Percy Jackson",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "percy",
      "jackson"
    ]
  },
  {
    "id": "disney-ahsoka",
    "slug": "ahsoka",
    "title": "Ahsoka",
    "altTitles": [],
    "type": "series",
    "streaming": "disney",
    "matchHints": [
      "ahsoka"
    ]
  }
]
