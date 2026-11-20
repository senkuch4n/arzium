import type { ImageMetadata } from "astro";
import factum from "../assets/work/factum.jpg";
import numa from "../assets/work/numa.jpg";
import juridico from "../assets/work/juridico.jpg";
import techmap from "../assets/work/techmap.jpg";

export const contact = {
  email: "arzium.dev@gmail.com",
  phones: [
    { label: "387 504-3021", wa: "5493875043021" },
    { label: "387 845-4460", wa: "5493878454460" },
  ],
} as const;

/** Agenda de Cal.com: `link` es lo que va después de cal.com/ (usuario/evento). */
export const cal = {
  link: "arzium-events/30min",
  namespace: "arzium",
} as const;
export const calUrl = `https://cal.com/${cal.link}`;

export const nav = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
] as const;

export interface Project {
  name: string;
  url: string;
  category: "Sistema" | "Landing page";
  year: number;
  tags: string[];
  /** Letras del ícono y sus clases de color. */
  icon: { text: string; className: string };
  /** Captura del sitio; si falta se muestra una portada tipográfica. */
  image?: { src: ImageMetadata; alt: string };
  cover?: { title: string; subtitle: string };
}

export const projects: Project[] = [
  {
    name: "Factum",
    url: "https://factum.arzium.com.ar",
    category: "Sistema",
    year: 2026,
    tags: ["Captura y preservación forense de evidencia digital", "Dispositivos móviles", "Acceso por agente", "Tema claro/oscuro"],
    icon: { text: "F", className: "bg-[#1b1d21] text-[#7fd858]" },
    image: { src: factum, alt: "Pantalla de acceso de Factum" },
  },
  {
    name: "Numa",
    url: "https://numa.arzium.com.ar",
    category: "Sistema",
    year: 2026,
    tags: ["Turnos y seguimiento nutricional", "Base de alimentos con valores nutricionales", "Acceso con Google", "Web app"],
    icon: { text: "N", className: "bg-[#e9f6e3] text-[#3a8f2c]" },
    image: { src: numa, alt: "Panel de Numa: base de alimentos con valores nutricionales" },
  },
  {
    name: "TechMap",
    url: "https://techmap.com.ar",
    category: "Landing page",
    year: 2026,
    tags: ["Seguridad electrónica", "Catálogo de servicios", "Contacto directo", "SEO local"],
    icon: { text: "T", className: "bg-[#0f1720] text-white" },
    image: { src: techmap, alt: "Portada del sitio de TechMap: cámaras de seguridad y alarmas" },
  },
  {
    name: "Federico & Asociados",
    url: "https://estudiojuridicofederico.netlify.app",
    category: "Landing page",
    year: 2026,
    tags: ["Estudio jurídico y pericial", "Áreas de práctica", "Formulario de consulta", "Reseñas", "FAQ"],
    icon: { text: "F&A", className: "bg-[#1a1612] text-[#d4b07a] text-[10px]" },
    image: { src: juridico, alt: "Portada del sitio de Federico & Asociados" },
  },
];

export interface Service {
  name: string;
  description: string;
  bullets: string[];
}

export const services: Service[] = [
  {
    name: "Sistemas",
    description: "Software a medida que reemplaza planillas, papeles y procesos manuales por una herramienta pensada para tu operación.",
    bullets: ["Paneles de gestión y back-office", "Usuarios, roles y permisos", "Integraciones y APIs", "Soporte y evolución continua"],
  },
  {
    name: "Landing pages",
    description: "Sitios rápidos y prolijos que explican lo que hacés en segundos y llevan a la persona correcta a escribirte.",
    bullets: ["Diseño a medida, sin plantillas", "Optimizadas para celular", "SEO y analítica desde el día uno", "Formularios y WhatsApp integrados"],
  },
  {
    name: "Capacitaciones",
    description: "Formación práctica para equipos que quieren adoptar herramientas nuevas sin perder tiempo ni miedo.",
    bullets: ["Uso de los sistemas que entregamos", "Herramientas digitales e IA", "Programación desde cero", "Modalidad presencial u online"],
  },
];

export const stack = [
  "Astro", "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL",
  "Supabase", "Tailwind CSS", "Vercel", "Netlify", "Figma", "Git",
];
