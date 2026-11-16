import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(s));
const reduce = document.documentElement.classList.contains('reduce');
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

function store(key: string, value?: string) {
  try {
    if (value === undefined) return sessionStorage.getItem(key);
    sessionStorage.setItem(key, value);
  } catch {
    /* storage blocked — ignore */
  }
  return null;
}

/* ---------- split headings into masked words ---------- */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return [];
  el.dataset.splitDone = '1';
  const inner: HTMLElement[] = [];
  const walk = (node: Node, out: Node[]) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent || '').split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { out.push(document.createTextNode(' ')); return; }
          const line = document.createElement('span');
          line.className = 'line';
          line.style.display = 'inline-block';
          const w = document.createElement('span');
          w.textContent = part;
          line.appendChild(w);
          inner.push(w);
          out.push(line);
        });
      } else if (child.nodeName === 'BR') {
        out.push(child.cloneNode());
      } else {
        // wrap element (e.g. coloured ।) as one word
        const line = document.createElement('span');
        line.className = 'line';
        line.style.display = 'inline-block';
        const clone = child.cloneNode(true) as HTMLElement;
        clone.style.display = 'inline-block';
        line.appendChild(clone);
        inner.push(clone);
        out.push(line);
      }
    });
  };
  const out: Node[] = [];
  walk(el, out);
  el.replaceChildren(...out);
  return inner;
}

/* ---------- intro (home, once per session) ---------- */
function intro(): Promise<void> {
  const el = $('.intro');
  if (!el) return Promise.resolve();
  if (reduce || store('kissa-intro')) { el.remove(); return Promise.resolve(); }
  store('kissa-intro', '1');
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => { el.remove(); resolve(); } });
    tl.from('.intro-word .ch', { yPercent: 110, duration: 0.9, ease: EASE })
      .from('.intro-word .viram', { yPercent: -160, rotate: 12, duration: 0.7, ease: 'back.out(2.2)' }, '-=0.35')
      .to('.intro-word', { scale: 0.92, duration: 0.5, ease: 'power2.in' }, '+=0.25')
      .to(el, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.15');
  });
}

/* ---------- page wipe between pages ---------- */
function pageWipe() {
  const wipe = $('.wipe');
  if (!wipe || reduce) return;
  // GSAP owns the transform: clear the CSS offset so pixel y and yPercent never stack
  gsap.set(wipe, { y: 0, yPercent: 100 });
  if (store('kissa-wipe')) {
    store('kissa-wipe', '');
    gsap.fromTo(wipe, { yPercent: 0 }, {
      yPercent: -100, duration: 0.8, ease: 'expo.inOut', delay: 0.05,
      onComplete: () => { gsap.set(wipe, { yPercent: 100 }); },
    });
  }
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.hash && url.pathname === location.pathname) return;
    if (a.getAttribute('href')?.startsWith('#') || a.href.startsWith('mailto:')) return;
    e.preventDefault();
    store('kissa-wipe', '1');
    gsap.fromTo(wipe, { yPercent: 100 }, {
      yPercent: 0, duration: 0.6, ease: 'expo.inOut', onComplete: () => { location.href = url.href; },
    });
  });
  window.addEventListener('pageshow', (e) => { if ((e as PageTransitionEvent).persisted) gsap.set(wipe, { y: 0, yPercent: 100 }); });
}

/* ---------- hero ---------- */
function hero() {
  const title = $('[data-hero-title]');
  const mark = $('[data-hero-mark]');
  if (!title || !mark) return;
  const words = splitWords(title);
  const tl = gsap.timeline();
  tl.from(words, { yPercent: 115, duration: 1.2, stagger: 0.08, ease: EASE })
    .from(mark, { yPercent: 40, opacity: 0, duration: 1.4, ease: EASE }, 0.2)
    .from('[data-hero-fade]', { opacity: 0, y: 16, duration: 1, stagger: 0.1, ease: EASE }, 0.5);

  gsap.to(mark, { yPercent: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('[data-hero-media]', { scale: 1.12, yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to(title, { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: '70% top', scrub: true } });
}

/* ---------- generic reveals ---------- */
function reveals() {
  $$('[data-split]').forEach((el) => {
    if (el.matches('[data-hero-title]')) return;
    const words = splitWords(el);
    gsap.from(words, {
      yPercent: 115, duration: 1.1, stagger: 0.06, ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE, overwrite: true }),
  });
  $$('[data-clip]').forEach((el) => {
    gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  $$('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { scale: 1.15, yPercent: -6 }, { scale: 1.15, yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- statement: words light up while scrolling ---------- */
function scrubWords() {
  $$('[data-scrub-words]').forEach((el) => {
    const words: HTMLElement[] = [];
    const out: Node[] = [];
    (el.textContent || '').trim().split(/\s+/).forEach((w, i) => {
      if (i) out.push(document.createTextNode(' '));
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      if (w.includes('किस्सा')) s.style.color = 'var(--red)';
      words.push(s);
      out.push(s);
    });
    el.replaceChildren(...out);
    gsap.fromTo(words, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });
}

/* ---------- marquee speeds up with scroll velocity, flips with direction ---------- */
function marquee() {
  const track = $('[data-marquee]');
  if (!track) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  let dir = 1;
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      if (self.direction !== dir) { dir = self.direction; }
      gsap.to(loop, { timeScale: dir * Math.min(5, 1 + Math.abs(v) / 400), duration: 0.2, overwrite: true });
      gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'power2.out' });
    },
  });
}

/* ---------- pinned horizontal frames ---------- */
function horizontal() {
  const section = $('[data-hscroll-section]');
  const track = $('[data-hscroll-track]');
  if (!section || !track) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    $$('img', track).forEach((img) => {
      gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: true } });
    });
  });
}

/* ---------- film cards: hover / in-view preview loops ---------- */
function filmCards() {
  const cards = $$('[data-film]');
  const playLoop = (card: HTMLElement) => {
    const v = $<HTMLVideoElement>('video', card);
    if (!v) return;
    if (!v.src) v.src = card.dataset.loop || '';
    v.play().then(() => card.classList.add('playing')).catch(() => {});
  };
  const stopLoop = (card: HTMLElement) => {
    const v = $<HTMLVideoElement>('video', card);
    card.classList.remove('playing');
    v?.pause();
  };
  if (fine) {
    cards.forEach((c) => {
      c.addEventListener('mouseenter', () => playLoop(c));
      c.addEventListener('mouseleave', () => stopLoop(c));
      c.addEventListener('focus', () => playLoop(c));
      c.addEventListener('blur', () => stopLoop(c));
    });
  } else if (!reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? playLoop(e.target as HTMLElement) : stopLoop(e.target as HTMLElement)));
    }, { threshold: 0.6 });
    cards.forEach((c) => io.observe(c));
  }

  const dlg = $<HTMLDialogElement>('#player');
  const video = dlg ? $<HTMLVideoElement>('video', dlg) : null;
  const title = dlg ? $('[data-player-title]', dlg) : null;
  if (!dlg || !video) return;
  const close = () => { video.pause(); video.removeAttribute('src'); video.load(); dlg.close(); };
  cards.forEach((c) => c.addEventListener('click', () => {
    stopLoop(c);
    video.src = c.dataset.src || '';
    if (title) title.textContent = c.dataset.title || '';
    dlg.showModal();
    gsap.fromTo(dlg, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(video, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: EASE });
    video.play().catch(() => {});
  }));
  $('[data-close]', dlg)?.addEventListener('click', close);
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || (e.target as HTMLElement).classList.contains('viewer-inner')) close(); });
}

/* ---------- photo archive: filters + lightbox ---------- */
function gallery() {
  const grid = $('[data-gallery]');
  if (!grid) return;
  const shots = $$('.shot', grid);
  const buttons = $$<HTMLButtonElement>('[data-filter]');

  const apply = (cat: string, animate = true) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    const show = shots.filter((s) => cat === 'all' || s.dataset.cat === cat);
    const run = () => {
      shots.forEach((s) => s.classList.toggle('hide', !show.includes(s)));
      ScrollTrigger.refresh();
      if (animate && !reduce) gsap.fromTo(show.slice(0, 12), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04, ease: EASE });
    };
    if (animate && !reduce) gsap.to(shots.filter((s) => !s.classList.contains('hide')), { opacity: 0, duration: 0.2, onComplete: run });
    else run();
  };
  buttons.forEach((b) => b.addEventListener('click', () => {
    apply(b.dataset.filter || 'all');
    const u = new URL(location.href);
    if (b.dataset.filter === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', b.dataset.filter || '');
    history.replaceState(null, '', u);
  }));
  const initial = new URLSearchParams(location.search).get('cat');
  if (initial && buttons.some((b) => b.dataset.filter === initial)) apply(initial, false);

  if (!reduce) {
    ScrollTrigger.batch(shots, {
      start: 'top 95%', once: true,
      onEnter: (els) => gsap.from(els, { opacity: 0, y: 50, duration: 1, stagger: 0.06, ease: EASE }),
    });
  }

  const dlg = $<HTMLDialogElement>('#lightbox');
  const img = dlg ? $<HTMLImageElement>('img', dlg) : null;
  if (!dlg || !img) return;
  let list: HTMLElement[] = [];
  let i = 0;
  const show = (dir = 0) => {
    const s = list[i];
    img.src = s.dataset.full || '';
    $('[data-lb-count]', dlg)!.textContent = `${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
    $('[data-lb-cat]', dlg)!.textContent = s.querySelector('.shot-cat')?.textContent || '';
    if (!reduce) gsap.fromTo(img, { opacity: 0, x: dir * 60 }, { opacity: 1, x: 0, duration: 0.6, ease: EASE });
  };
  shots.forEach((s) => s.addEventListener('click', () => {
    list = shots.filter((x) => !x.classList.contains('hide'));
    i = list.indexOf(s);
    dlg.showModal();
    show(0);
  }));
  const step = (d: number) => { i = (i + d + list.length) % list.length; show(d); };
  $('[data-prev]', dlg)?.addEventListener('click', () => step(-1));
  $('[data-next]', dlg)?.addEventListener('click', () => step(1));
  $('[data-close]', dlg)?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || (e.target as HTMLElement).classList.contains('viewer-inner')) dlg.close(); });
  let sx = 0;
  dlg.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
}

/* ---------- cursor: red dot (the ।) that grows into a label ---------- */
function cursor() {
  const c = $('.cursor');
  const label = c ? $('.cursor-label', c) : null;
  if (!c || !label || !fine || reduce) return;
  const xTo = gsap.quickTo(c, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(c, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); gsap.to(c, { opacity: 1, duration: 0.2 }); });
  document.addEventListener('mouseleave', () => gsap.to(c, { opacity: 0 }));
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    c.classList.toggle('dark', !!target.closest('.on-red, .menu'));
    const t = target.closest<HTMLElement>('[data-cursor]');
    c.classList.toggle('ring', !t && !!target.closest('a, button'));
    if (t) {
      label.textContent = t.dataset.cursor || '';
      gsap.to(c, { width: 84, height: 84, margin: -42, duration: 0.4, ease: EASE });
      gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.1 });
    } else if ((e.target as HTMLElement).closest('a, button')) {
      gsap.to(c, { width: 36, height: 36, margin: -18, duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.1 });
    } else {
      gsap.to(c, { width: 14, height: 14, margin: -7, duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.1 });
    }
  });
}

/* ---------- mobile menu ---------- */
function menu() {
  const btn = $<HTMLButtonElement>('.nav .menu-btn');
  const panel = $('#menu');
  if (!btn || !panel) return;
  const links = $$('li a', panel);
  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    gsap.to(panel, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' });
    gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: EASE, delay: 0.3 });
    $<HTMLElement>('.menu-close', panel)?.focus();
  };
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    gsap.to(panel, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => panel.classList.remove('open') });
    btn.focus();
  };
  btn.addEventListener('click', open);
  $('.menu-close', panel)?.addEventListener('click', close);
  links.forEach((l) => l.addEventListener('click', close));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- footer mark rises as you reach the end ---------- */
function footer() {
  const mark = $('[data-footer-mark]');
  if (!mark) return;
  gsap.from(mark, { yPercent: 45, ease: 'none', scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

/* ---------- nav: solid after the top, hides on the way down ---------- */
function navState() {
  const nav = $('.nav');
  if (!nav) return;
  let last = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('solid', y > 80);
    nav.classList.toggle('hidden', !reduce && y > 400 && y > last + 4);
    if (y < last - 4) nav.classList.remove('hidden');
    last = y;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- boot ---------- */
navState();
menu();
if (reduce) {
  filmCards();
  gallery();
} else {
  pageWipe();
  cursor();
  intro().then(() => {
    hero();
  });
  reveals();
  scrubWords();
  marquee();
  horizontal();
  filmCards();
  gallery();
  footer();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
