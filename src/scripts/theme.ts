/* Modo claro/oscuro con revelado circular desde el botón (View Transitions API).
   El tema inicial lo aplica un script inline en <head> (Layout) para evitar parpadeos. */

const KEY = "theme";
const root = document.documentElement;

export const isDark = () => root.classList.contains("dark");

function apply(dark: boolean) {
  root.classList.toggle("dark", dark);
  try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch { /* modo privado */ }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0e0e0f" : "#f2f1ee");
  document.dispatchEvent(new CustomEvent("themechange", { detail: { dark } }));
}

async function toggle(button: HTMLElement) {
  const next = !isDark();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduced) return apply(next);

  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  const transition = document.startViewTransition(() => apply(next));
  await transition.ready;
  root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 750, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
  );
}

document.querySelectorAll<HTMLElement>("[data-theme-toggle]").forEach((b) =>
  b.addEventListener("click", () => toggle(b)),
);

// Si la persona no eligió tema, seguimos al sistema en vivo.
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  let saved: string | null = null;
  try { saved = localStorage.getItem(KEY); } catch { /* */ }
  if (!saved) {
    root.classList.toggle("dark", e.matches);
    document.dispatchEvent(new CustomEvent("themechange", { detail: { dark: e.matches } }));
  }
});
