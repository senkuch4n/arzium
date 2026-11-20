# arzium

Landing de [arzium.com.ar](https://arzium.com.ar) — Astro + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build estático en dist/
npm run preview
```

- Contenido (proyectos, servicios, contacto, stack): `src/data/site.ts`
- Secciones: `src/components/*.astro`
- Tokens de diseño (colores, fuentes, animaciones): `src/styles/global.css` (`@theme`)
- Capturas de proyectos: `src/assets/work/` (Astro las optimiza a WebP)
