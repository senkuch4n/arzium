/* Ícono <a/> hecho de partículas: se arma al cargar, se dispersa con el cursor o el dedo
   y vuelve a su lugar. Canvas 2D, sin dependencias. */

interface Particle {
  x: number; y: number;   // posición actual
  hx: number; hy: number; // posición "casa" (dentro del ícono)
  vx: number; vy: number;
  color: string;
  phase: number;          // para la oscilación sutil en reposo
}

const VIOLET = "#4b05f8";
const INK = "#141414";

export function mountParticles(canvas: HTMLCanvasElement, src: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles: Particle[] = [];
  let w = 0, h = 0, dpr = 1, size = 2;
  let raf = 0, visible = true, t = 0;
  const pointer = { x: -9999, y: -9999, active: false };

  const img = new Image();
  img.src = src;

  /** Caja que encierra los píxeles visibles del ícono (se calcula una vez). */
  let cachedBox: { x: number; y: number; w: number; h: number } | null = null;
  function bounds() {
    if (cachedBox) return cachedBox;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const cx = c.getContext("2d", { willReadFrequently: true })!;
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++)
        if (d[(y * c.width + x) * 4 + 3]! > 140) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
    return (cachedBox = x1 > x0 ? { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 } : { x: 0, y: 0, w: c.width, h: c.height });
  }

  function build() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    if (!w || !h || !img.complete) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Recortamos el margen transparente del PNG y escalamos el contorno real al espacio disponible.
    const box = bounds();
    const scale = Math.min((w * (w < 640 ? 0.94 : 0.82)) / box.w, (h * 0.92) / box.h);
    const tw = Math.round(box.w * scale), th = Math.round(box.h * scale);
    const ox = (w - tw) / 2, oy = (h - th) / 2;
    const gap = w < 640 ? 5 : tw > 900 ? 8 : 7;
    size = gap * 0.62;

    const off = document.createElement("canvas");
    off.width = tw; off.height = th;
    const octx = off.getContext("2d", { willReadFrequently: true })!;
    octx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, tw, th);
    const data = octx.getImageData(0, 0, tw, th).data;

    const prev = particles;
    particles = [];
    for (let y = 0; y < th; y += gap) {
      for (let x = 0; x < tw; x += gap) {
        const i = (y * tw + x) * 4;
        if (data[i + 3]! < 140) continue;
        // Violeta si el azul domina; si no, tinta.
        const color = data[i + 2]! > data[i]! + 60 ? VIOLET : INK;
        const hx = ox + x, hy = oy + y;
        const old = prev[particles.length];
        particles.push({
          hx, hy, color,
          x: reduced ? hx : old?.x ?? Math.random() * w,
          y: reduced ? hy : old?.y ?? Math.random() * h,
          vx: 0, vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    if (reduced) draw();
  }

  function step() {
    t += 0.016;
    const r = Math.max(90, Math.min(w, h) * 0.18); // radio de repulsión
    for (const p of particles) {
      // resorte hacia casa + leve oscilación
      const tx = p.hx + Math.sin(t * 1.3 + p.phase) * 0.8;
      const ty = p.hy + Math.cos(t * 1.1 + p.phase) * 0.8;
      p.vx += (tx - p.x) * 0.045;
      p.vy += (ty - p.y) * 0.045;

      if (pointer.active) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r * r) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / r) * 9;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function draw() {
    ctx!.clearRect(0, 0, w, h);
    let current = "";
    for (const p of particles) {
      if (p.color !== current) { current = p.color; ctx!.fillStyle = current; }
      ctx!.fillRect(p.x, p.y, size, size);
    }
  }

  function loop() {
    raf = 0;
    if (!visible) return;
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }
  const start = () => { if (!reduced && !raf) raf = requestAnimationFrame(loop); };

  img.decode().then(() => { build(); start(); }).catch(() => {});

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 120);
  }).observe(canvas);

  new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible) start();
  }).observe(canvas);

  if (reduced) return;
  const move = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  };
  const leave = () => { pointer.active = false; };
  // Escuchamos en la sección entera para que el efecto empiece antes de tocar el canvas.
  const area = canvas.closest("section") ?? canvas;
  area.addEventListener("pointermove", move as EventListener, { passive: true });
  area.addEventListener("pointerdown", move as EventListener, { passive: true });
  area.addEventListener("pointerleave", leave);
  area.addEventListener("pointerup", (e) => { if ((e as PointerEvent).pointerType !== "mouse") leave(); });
}
