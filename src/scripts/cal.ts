import { cal } from "../data/site";
import { isDark } from "./theme";

/* Integración de Cal.com (https://cal.com/docs/developing/guides/embeds).
   El script de Cal se carga recién cuando hace falta: al acercarse al calendario
   embebido o al tocar un botón [data-cal-open]. Las llamadas previas quedan en cola. */

type CalFn = (...args: unknown[]) => void;
type CalGlobal = CalFn & { ns: Record<string, CalFn> };
declare global {
  interface Window { Cal?: CalGlobal }
}

const BRAND = "#4b05f8";
const PAGE_BG = "#f2f1ee";
const PAGE_BG_DARK = "#0e0e0f";
const BRAND_DARK = "#7d4bff";
let api: CalFn | null = null;

function loadCal(): CalFn {
  if (api) return api;

  // Snippet oficial de Cal.com (sin cambios).
  // prettier-ignore
  // @ts-expect-error -- código de terceros sin tipos
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

  window.Cal!("init", cal.namespace, { origin: "https://cal.com" });
  api = window.Cal!.ns[cal.namespace]!;
  api("ui", {
    theme: isDark() ? "dark" : "light",
    layout: "month_view",
    hideEventTypeDetails: false,
    cssVarsPerTheme: {
      // Fondo igual al de la página para que la agenda no sea un bloque blanco.
      light: { "cal-brand": BRAND, "cal-bg": PAGE_BG, "cal-bg-muted": PAGE_BG },
      dark: { "cal-brand": BRAND_DARK, "cal-bg": PAGE_BG_DARK, "cal-bg-muted": PAGE_BG_DARK },
    },
  });
  // Si cambia el tema con la agenda ya cargada, la actualizamos.
  document.addEventListener("themechange", () => api?.("ui", { theme: isDark() ? "dark" : "light" }));
  return api;
}

/* Botones/links que abren la agenda en un popup. Sin JS, el href lleva a cal.com. */
document.addEventListener("click", (e) => {
  const trigger = (e.target as Element).closest<HTMLElement>("[data-cal-open]");
  if (!trigger) return;
  e.preventDefault();
  loadCal()("modal", { calLink: cal.link, config: { layout: "month_view" } });
});

/* Agenda embebida: oculta por defecto; se despliega (y recién ahí se carga Cal) con [data-cal-toggle]. */
const toggle = document.querySelector<HTMLButtonElement>("[data-cal-toggle]");
const panel = toggle && document.getElementById(toggle.getAttribute("aria-controls") ?? "");
if (toggle && panel) {
  let mounted = false;
  toggle.addEventListener("click", () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open && !mounted) {
      mounted = true;
      loadCal()("inline", { elementOrSelector: "#cal-inline", calLink: cal.link, config: { layout: "month_view" } });
    }
    if (open) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
