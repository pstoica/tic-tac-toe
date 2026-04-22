import { animate, stagger, utils } from 'animejs';

/* ============================================================
   helpers
   ============================================================ */

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function pathLength(el: SVGGeometryElement): number {
  try { return el.getTotalLength(); } catch { return 100; }
}

/* ============================================================
   board entrance — staggered, from center, with spectrum sweep
   ============================================================ */

export function animateBoardIn(cellEls: SVGGElement[], gridLineEls: SVGLineElement[]) {
  if (prefersReducedMotion()) {
    cellEls.forEach(el => { el.style.opacity = '1'; });
    gridLineEls.forEach(el => { el.style.opacity = '1'; });
    return;
  }

  utils.set(cellEls, { opacity: 0, scale: 0.55, rotate: -10 });
  utils.set(gridLineEls, { opacity: 0 });

  animate(cellEls, {
    opacity: [0, 1],
    scale: [0.55, 1],
    rotate: [-10, 0],
    duration: 720,
    delay: stagger(55, { from: 'center', grid: [3, 3] }),
    ease: 'outBack(1.6)',
  });

  animate(gridLineEls, {
    opacity: [0, 1],
    duration: 540,
    delay: stagger(60, { start: 320 }),
    ease: 'outQuad',
  });
}

/* ============================================================
   mark pop-in — the main mark snaps in via a scale pop on the group.
   no stroke-dash trace; the ghost trail is the flourish.
   ============================================================ */

export function animateMarkGrow(groupEl: SVGGElement) {
  if (prefersReducedMotion()) return;
  utils.set(groupEl, { scale: 0, opacity: 0 });
  animate(groupEl, {
    opacity: [{ to: 1, duration: 90, ease: 'outQuad' }],
    scale: [
      { to: 1.14, duration: 180, ease: 'outBack(2.2)' },
      { to: 1,    duration: 180, ease: 'outQuad' },
    ],
  });
}

/* LERP trail on placement (iOS FaceID style): each ghost is a frozen pose
   sampled along a shared shrink-and-rotate trajectory. only opacity animates
   per ghost — the stagger of flashes creates the motion.

   the per-ghost pose layers four things so there's visible variation across
   the trail without breaking the LERP feel:
     1. knurl rotation on Z (0 → -90°, within one X-symmetry unit)
     2. scale shrink (0.92 → 0.10) toward the midpoint
     3. real 3D tilt (rotateX / rotateY sine waves) — only renders if the
        perspective context is preserved up the ancestor chain
     4. non-uniform scale oscillation (scaleX / scaleY phase-shifted sines),
        which reads as an aspect-ratio wobble and is the reliable fallback
        for engines that flatten SVG 3D transforms */
export function animateMarkGhosts(paths: SVGPathElement[]) {
  if (prefersReducedMotion()) return;
  const n = paths.length;
  if (n === 0) return;
  paths.forEach((el, i) => {
    const t = n === 1 ? 0 : i / (n - 1);                // 0 → 1 across ghosts
    const rotation = -90 * t;                            // knurl on Z
    const base     = 0.92 - 0.82 * t;                    // shrink to midpoint
    const rotateY  = 34 * Math.sin(t * Math.PI * 2);     // full wave ±34°
    const rotateX  = -18 * Math.sin(t * Math.PI);        // half wave, peak mid
    // phase-offset non-uniform scale so adjacent ghosts have distinctly
    // different aspect ratios — fake 3D lean, visible even when real
    // rotateX/Y gets flattened by the renderer.
    const scaleX = base * (1 + 0.22 * Math.sin(t * Math.PI * 2));
    const scaleY = base * (1 - 0.22 * Math.cos(t * Math.PI * 2));
    utils.set(el, {
      rotate: rotation,
      scaleX, scaleY,
      rotateX, rotateY,
      opacity: 0,
    });
    animate(el, {
      opacity: [
        { to: 0.55, duration: 50,  ease: 'outQuad' },
        { to: 0,    duration: 130, ease: 'outQuad' },
      ],
      delay: i * 38,
    });
  });
}

/* ============================================================
   win slash — eased grow from midpoint outward
   ============================================================ */

export function animateWinSlash(half1: SVGLineElement, half2: SVGLineElement) {
  const len1 = pathLength(half1);
  const len2 = pathLength(half2);
  half1.style.strokeDasharray = `${len1}`;
  half1.style.strokeDashoffset = `${len1}`;
  half2.style.strokeDasharray = `${len2}`;
  half2.style.strokeDashoffset = `${len2}`;

  if (prefersReducedMotion()) {
    half1.style.strokeDashoffset = '0';
    half2.style.strokeDashoffset = '0';
    return;
  }

  animate([half1, half2], {
    strokeDashoffset: 0,
    duration: 620,
    ease: 'outExpo',
  });
}

/* dim the non-winning marks so the slash + line shine */
export function dimNonWinningMarks(marks: SVGGElement[]) {
  if (prefersReducedMotion()) return;
  animate(marks, {
    opacity: [{ to: 0.28, duration: 480, ease: 'outQuad' }],
    delay: 220,
  });
}

export function highlightWinningMarks(marks: SVGGElement[]) {
  if (prefersReducedMotion()) return;
  animate(marks, {
    scale: [
      { to: 1.18, duration: 280, ease: 'outQuad' },
      { to: 1.0, duration: 480, ease: 'outElastic(1, 0.6)' },
    ],
    delay: stagger(80, { start: 200 }),
  });
}

/* ============================================================
   end screen — mario-style title reactions
   ============================================================ */

export function animateWinTitle(chars: HTMLElement[]) {
  if (prefersReducedMotion()) return () => {};
  // each char gets a hue offset for a rainbow wash
  chars.forEach((c, i) => {
    c.style.setProperty('--char-hue', String(120 + (i * 22) % 220));
  });
  const a = animate(chars, {
    translateY: [
      { to: -18, duration: 320, ease: 'outQuad' },
      { to: 0,   duration: 520, ease: 'outBounce' },
    ],
    rotate: [
      { to: -4, duration: 320 },
      { to: 0,  duration: 520, ease: 'outBack(1.4)' },
    ],
    delay: stagger(70),
    loop: true,
    loopDelay: 1400,
  });
  return () => a.pause();
}

export function animateLossTitle(chars: HTMLElement[]) {
  if (prefersReducedMotion()) return () => {};
  // each letter gets alternating-sign vertical jitter so the whole word looks
  // unsteady — wonky, not just shaking. rotate amplitude varies per letter too.
  const animations = chars.map((el, i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    const rotAmp = 5 + (i % 3) * 2; // 5, 7, 9 rotated degrees
    const yAmp   = 6 + (i % 2) * 2; // 6 or 8 px vertical
    return animate(el, {
      translateY: [
        { to: -yAmp * sign,     duration: 85,  ease: 'outQuad' },
        { to:  yAmp * 0.7 * sign, duration: 95,  ease: 'inOutQuad' },
        { to: -yAmp * 0.4 * sign, duration: 85,  ease: 'inOutQuad' },
        { to:  yAmp * 0.2 * sign, duration: 90,  ease: 'inOutQuad' },
        { to: 0,                duration: 140, ease: 'outQuad' },
      ],
      rotate: [
        { to: -rotAmp * sign,     duration: 85 },
        { to:  rotAmp * sign,     duration: 110 },
        { to: -rotAmp * 0.5 * sign, duration: 85 },
        { to: 0,                  duration: 140, ease: 'outBack(1.6)' },
      ],
      translateX: [
        { to: -1.5 * sign, duration: 100 },
        { to:  1.5 * sign, duration: 100 },
        { to: 0,           duration: 100 },
      ],
      delay: i * 48,
      loop: true,
      loopDelay: 1100,
    });
  });
  return () => animations.forEach(a => a.pause());
}

export function animateDrawTitle(chars: HTMLElement[]) {
  if (prefersReducedMotion()) return () => {};
  const a = animate(chars, {
    opacity: [
      { to: 0.55, duration: 700, ease: 'inOutSine' },
      { to: 1,    duration: 700, ease: 'inOutSine' },
    ],
    delay: stagger(60),
    loop: true,
  });
  return () => a.pause();
}

export function animateEndCardIn(cardEl: HTMLElement) {
  if (prefersReducedMotion()) {
    cardEl.style.opacity = '1';
    return;
  }
  utils.set(cardEl, { opacity: 0, scale: 0.92, translateY: 14 });
  animate(cardEl, {
    opacity: [0, 1],
    scale: [0.92, 1],
    translateY: [14, 0],
    duration: 480,
    ease: 'outBack(1.4)',
  });
}

/* ============================================================
   brand — per-letter hue wave on solid colors (no gradient)
   ============================================================ */

export function animateBrandHues(containerEl: HTMLElement) {
  if (prefersReducedMotion()) return () => {};
  const letters = Array.from(containerEl.children) as HTMLElement[];
  letters.forEach((el, i) => {
    el.style.setProperty('--letter-hue', String((i * 36) % 360));
  });
  const animations = letters.map((el, i) => animate(el, {
    '--letter-hue': [(i * 36) % 360, ((i * 36) % 360) + 360],
    duration: 9000,
    ease: 'linear',
    loop: true,
  }));
  return () => animations.forEach(a => a.pause());
}

/* ============================================================
   picker entrance
   ============================================================ */

export function animatePickerIn(cardEl: HTMLElement, optionEls: HTMLElement[]) {
  if (prefersReducedMotion()) return;
  utils.set(cardEl, { opacity: 0, translateY: 8 });
  utils.set(optionEls, { opacity: 0, translateX: -6 });
  animate(cardEl, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 220,
    ease: 'outQuart',
  });
  animate(optionEls, {
    opacity: [0, 1],
    translateX: [-6, 0],
    duration: 180,
    delay: stagger(28, { start: 60 }),
    ease: 'outQuart',
  });
}
