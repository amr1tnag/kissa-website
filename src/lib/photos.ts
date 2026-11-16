import type { ImageMetadata } from 'astro';

export type PhotoCategory = 'concert' | 'cultural' | 'sports' | 'brand';

export const categories: { id: PhotoCategory; label: string; hindi: string }[] = [
  { id: 'concert', label: 'Concerts', hindi: 'संगीत' },
  { id: 'cultural', label: 'Festivals & culture', hindi: 'उत्सव' },
  { id: 'sports', label: 'Sports', hindi: 'खेल' },
  { id: 'brand', label: 'Brand & product', hindi: 'ब्रांड' },
];

export interface Photo {
  id: string;
  cat: PhotoCategory;
  img: ImageMetadata;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*/*.jpg', { eager: true });

export const photos: Photo[] = Object.entries(files).map(([path, mod]) => {
  const parts = path.split('/');
  return {
    cat: parts[parts.length - 2] as PhotoCategory,
    id: parts[parts.length - 1].replace('.jpg', ''),
    img: mod.default,
  };
});

export const byId = (id: string) => {
  const p = photos.find((x) => x.id === id);
  if (!p) throw new Error(`Missing photo ${id}`);
  return p;
};

/** Hand-picked order for the archive: strongest frames first, categories interleaved. */
const order = [
  'dsc02029-1', 'zam8541', '5w6a1935', 'dsc01203', 'img-1596', 'img-6231', 'img-0804',
  'dsc07220-1', 'copy-of-img-8286', 'zam07948', 'dsc01089', 'img-0082', 'zam8482', 'dsc07895',
  'zam07990-3', 'img-5988', 'img-0822', 'img-9107', 'img-1011-1', 'zam8512', 'mg-0885',
  'img-1666', 'dsc-0201', 'dsc01210', 'zam07860', 'img-6514', 'dsc-0292', 'img-1107-1',
  'zam8644', 'mg-0493', 'img-9085', 'zam07882', 'copy-of-dsc-0182', 't5a5697', 'img-2188',
  'img-7096', 'zam03671', 'dsc01200', 'zam07807', 'mg-0463', 'img-0782', 'img-0222',
  'zam8483', 'dsc07965', 'img-9004-1', 'img-1773', 'img-6163', '5w6a1963', 'zam07835',
  'img-6199', 'dsc08155', 'img-1990', 'mg-0342', 'zam05361-2-copy', 'img-2038', '5w6a2138',
];
export const archive: Photo[] = [
  ...order.map(byId),
  ...photos.filter((p) => !order.includes(p.id)),
];

export const count = (cat: PhotoCategory) => photos.filter((p) => p.cat === cat).length;
