// Projects = how a client sees the work: one shoot or event, with its films and photos.
// Photo ids are file names in src/assets/photos/<category>/ ; film slugs are in data/films.ts.
export interface Project {
  slug: string;
  title: string;
  kind: string; // short type label
  summary: string; // one line for cards
  description: string; // a short paragraph for the project page
  cover: { photo?: string; film?: string };
  films: string[];
  photos: string[];
}

export const projects: Project[] = [
  {
    slug: 'live',
    title: 'Live — concert nights',
    kind: 'Concerts',
    summary: 'Stage, smoke and the crowd, shot from the pit.',
    description:
      'Concert coverage from the barricade: artists mid-song, light and smoke, phones in the air and the moment the crowd sings back, in stills, hype reels and artist edits.',
    cover: { photo: 'dsc02029-1', film: 'hype-reel' },
    films: ['hype-reel', 'avanti-patil-edit', 'mohammed-irfan-edit', 'hype-reel-1'],
    photos: [
      'dsc02029-1', 'img-1596', 'zam07948', 'dsc07220-1', 'zam07990-3', 'img-0082', 'img-1011-1',
      'img-1666', 'zam07860', 'img-1107-1', 'zam07882', 'img-2188', 'img-0222', 'zam07807',
      'img-1773', 'zam07835', 'img-1990', 'zam05361-2-copy', 'img-2038',
    ],
  },
  {
    slug: 'udaan-2025',
    title: 'Udaan 2025',
    kind: 'Sports · Run',
    summary: 'A city run, from warm-up to finish line.',
    description:
      'Udaan 2025 covered end to end: the warm-up, the start, runners on the road and the crowd at the finish. Cut into an after movie and a vertical reel, with a set of stills.',
    cover: { photo: 'mg-0885', film: 'udaan-after-movie' },
    films: ['udaan-after-movie', 'video-642'],
    photos: ['mg-0885', 'dsc07895', 't5a5697', 'dsc07965', 'zam03671', 'mg-0342', 'mg-0493', 'dsc08155'],
  },
  {
    slug: 'ganpati-aagman',
    title: 'Ganpati Aagman',
    kind: 'Festival',
    summary: 'Bikes, flags and the arrival of Bappa.',
    description:
      'The Aagman procession, from the bike rally and saffron flags to the idol’s arrival, told in a short film and close, colourful stills.',
    cover: { photo: 'zam8541', film: 'ganpati-aagman-final' },
    films: ['ganpati-aagman-final'],
    photos: ['zam8541', 'zam8482', 'zam8512', 'zam8644', 'zam8483', 'img-7096'],
  },
  {
    slug: 'dy-patil-t20',
    title: 'DY Patil T20',
    kind: 'Sports · Cricket',
    summary: 'Match days at DY Patil Stadium.',
    description:
      'Tournament coverage at DY Patil Stadium: team portraits, players between balls, wickets and the celebrations, plus a vertical edit for social.',
    cover: { photo: 'img-0804', film: 'dyt20-edit' },
    films: ['dyt20-edit'],
    photos: ['img-0804', 'dsc-0292', '5w6a1935', 'img-0822', '5w6a2138', 'img-0782', '5w6a1963'],
  },
  {
    slug: 'horizon',
    title: 'Horizon',
    kind: 'After movie',
    summary: 'Four minutes of the fest: stage, lights, crowd.',
    description: 'A four-minute after movie of Horizon: the build-up, the performances and the crowd under the lights.',
    cover: { film: 'horizon-after-movie' },
    films: ['horizon-after-movie'],
    photos: [],
  },
  {
    slug: '3-sisters',
    title: '3 Sisters Ginger Beer',
    kind: 'Brand · Product',
    summary: 'Studio stills and a short film for the feed.',
    description:
      'Studio product photography for 3 Sisters Ginger Beer, lit warm and moody to match the label, plus a short vertical film made for social.',
    cover: { photo: 'dsc01203', film: '3-sisters-edit-1' },
    films: ['3-sisters-edit-1'],
    photos: ['dsc01203', 'dsc01210', 'dsc01200'],
  },
  {
    slug: 'garba-and-culture',
    title: 'Garba & cultural nights',
    kind: 'Culture',
    summary: 'Costume, colour and movement.',
    description:
      'Garba nights and stage performances: dancers mid-step, traditional costume and the energy of the crowd, plus a festive reel.',
    cover: { photo: 'copy-of-img-8286', film: 'video-801' },
    films: ['video-801'],
    photos: ['copy-of-img-8286', 'img-6231', 'copy-of-dsc-0182', 'img-5988', 'dsc-0201', 'img-6514', 'mg-0463', 'img-6163', 'img-6199'],
  },
  {
    slug: 'product-stills',
    title: 'Aruba & café stills',
    kind: 'Brand · Product',
    summary: 'Cans on black, desserts on the table.',
    description: 'Product stills: Aruba cans shot on black, and a café table set with its bakes, jars and packaging.',
    cover: { photo: 'dsc01089' },
    films: [],
    photos: ['dsc01089', 'img-9107', 'img-9085', 'img-9004-1'],
  },
  {
    slug: 'pcr',
    title: 'PCR',
    kind: 'After movie',
    summary: 'A one-minute after movie.',
    description: 'A one-minute after movie of the PCR event.',
    cover: { film: 'pcr-aftermovie' },
    films: ['pcr-aftermovie'],
    photos: [],
  },
];

export const projectOfPhoto = (id: string) => projects.find((p) => p.photos.includes(id));
