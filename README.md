# किस्सा — website

The site for **किस्सा**, a Mumbai media agency: photography, films and edits for concerts, festivals, sports and brands.

Built with [Astro](https://astro.build) and [GSAP](https://gsap.com). The fonts (Archivo, Inter Tight, Anek Devanagari) are self-hosted through Fontsource.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Pages

| Page | File |
| --- | --- |
| Home | `src/pages/index.astro` |
| Work (photo archive + filters + lightbox) | `src/pages/work.astro` |
| Films (after movies, edits, reels) | `src/pages/films.astro` |
| About | `src/pages/about.astro` |

## Adding work

- **Photos:** drop a JPG (about 2000 px on the long side) into `src/assets/photos/<concert|cultural|sports|brand>/`. It appears on `/work` automatically, and Astro builds the responsive sizes. To control its position, add its file name to the `order` list in `src/lib/photos.ts`.
- **Films:** add three files to `public/media/video/`: `<slug>.mp4` (full edit, 720p H.264), `<slug>-loop.mp4` (6 s, muted, 360p) and `<slug>.jpg` (cover frame). Then add an entry in `src/data/films.ts`. Set `vertical: true` for 9:16 reels.

## Motion

Everything animated lives in `src/scripts/motion.ts`:

- the intro (once per visit) and red page wipes between pages
- word-by-word headline reveals, and the statement that lights up as you scroll
- hero parallax on the cropped किस्सा। wordmark, and a marquee that speeds up with scroll
- the pinned horizontal photo strip, hover-to-play film previews, and the floating image on category rows
- the custom cursor, the film player and the photo lightbox

All of it switches off for visitors who have asked their device to reduce motion.

## Brand

| Token | Value |
| --- | --- |
| Ink | `#0C0C0C` |
| Paper | `#F1EEE6` |
| Kissa Red | `#E5261C` |

The logo is **किस्सा।**: the पूर्ण विराम (।) is always red, and turns ink on red backgrounds.
