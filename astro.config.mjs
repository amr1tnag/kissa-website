import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kissa.in',
  image: {
    // photos are pre-sized to 2000px; Astro generates responsive sizes at build
    responsiveStyles: false,
  },
});
