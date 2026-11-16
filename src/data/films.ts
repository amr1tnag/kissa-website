// Every edit on the site. Files live in /public/media/video/<slug>{.mp4,-loop.mp4,.jpg}
export type FilmCategory = 'After movie' | 'Concert' | 'Cultural' | 'Sports' | 'Brand';

export interface Film {
  slug: string;
  title: string;
  category: FilmCategory;
  duration: string;
  vertical?: boolean;
}

export const films: Film[] = [
  { slug: 'horizon-after-movie', title: 'Horizon', category: 'After movie', duration: '4:09' },
  { slug: 'udaan-after-movie', title: 'Udaan 2025', category: 'After movie', duration: '1:56' },
  { slug: 'pcr-aftermovie', title: 'PCR', category: 'After movie', duration: '1:01' },
  { slug: 'hype-reel', title: 'Hype Reel', category: 'Concert', duration: '0:32' },
  { slug: 'avanti-patil-edit', title: 'Avanti Patil — Live', category: 'Concert', duration: '0:51' },
  { slug: 'mohammed-irfan-edit', title: 'Mohammed Irfan — Live', category: 'Concert', duration: '0:49' },
  { slug: 'hype-reel-1', title: 'Hype Reel II', category: 'Concert', duration: '0:19' },
  { slug: 'ganpati-aagman-final', title: 'Ganpati Aagman', category: 'Cultural', duration: '0:26' },
  { slug: 'dyt20-edit', title: 'DY Patil T20', category: 'Sports', duration: '0:27', vertical: true },
  { slug: '3-sisters-edit-1', title: '3 Sisters', category: 'Brand', duration: '0:30', vertical: true },
  { slug: 'video-801', title: 'Festive Reel', category: 'Cultural', duration: '0:38', vertical: true },
  { slug: 'video-642', title: 'Udaan 2025 — The Run', category: 'Sports', duration: '0:16', vertical: true },
];

export const media = (slug: string) => ({
  full: `/media/video/${slug}.mp4`,
  loop: `/media/video/${slug}-loop.mp4`,
  poster: `/media/video/${slug}.jpg`,
});
