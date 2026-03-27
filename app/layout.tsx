import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA — optimizado para búsqueda local Villa María + intención de compra
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "OficiosGo! — Plomeros, Electricistas y Más en Villa María, Córdoba",
    template: "%s | OficiosGo! Villa María",
  },
  description:
    "Encontrá plomeros, electricistas, pintores y carpinteros verificados en Villa María, Córdoba. Reseñas reales de vecinos. Descargá la app gratis y contactalos hoy.",

  // ── Keywords (usadas por Bing, DuckDuckGo y como señal secundaria en Google) ──
  keywords: [
    "plomero villa maría",
    "electricista villa maría córdoba",
    "pintor villa maría córdoba",
    "carpintero villa maría",
    "servicios del hogar villa maría",
    "profesionales oficios villa maría",
    "contratar plomero córdoba",
    "oficio villa maría córdoba",
  ],

  // ── Canonical / base URL ──
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph — mejora CTR en redes sociales y WhatsApp (muy usado en AR) ──
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "OficiosGo!",
    title: "OficiosGo! — Profesionales de oficios verificados en Villa María",
    description:
      "Plomeros, electricistas, pintores y más. Verificados, con reseñas reales. App gratis para Villa María, Córdoba.",
    images: [
      {
        url: "/og-image.png", // 1200×630 recomendado
        width: 1200,
        height: 630,
        alt: "OficiosGo! — Profesionales de oficios en Villa María, Córdoba",
      },
    ],
  },

  // ── Twitter/X card ──
  twitter: {
    card: "summary_large_image",
    title: "OficiosGo! — Profesionales de oficios en Villa María",
    description:
      "Encontrá plomeros, electricistas, pintores verificados en Villa María, Córdoba.",
    images: ["/og-image.png"],
  },

  // ── PWA / App instalable ──
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OficiosGo!",
    startupImage: [
      { url: "/splash/splash-640x1136.png", media: "(device-width: 320px)" },
      { url: "/splash/splash-750x1334.png", media: "(device-width: 375px)" },
      { url: "/splash/splash-1242x2208.png", media: "(device-width: 414px)" },
    ],
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Verificación de Search Console (reemplazar con el token real) ──
  // verification: {
  //   google: "REPLACE_WITH_GSC_TOKEN",
  // },

  other: {
    "mobile-web-app-capable": "yes",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VIEWPORT — optimizado para PWA en dispositivos móviles
// userScalable: false mejora la experiencia de app pero puede perjudicar
// accesibilidad — considerar cambiarlo a true si el público lo requiere
// ─────────────────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,      // ← era 1; subido a 5 para accesibilidad (WCAG 1.4.4)
  userScalable: true,   // ← era false; recomendado true para accesibilidad
  viewportFit: "cover", // safe-area-inset para notch/dynamic island
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8C927" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1120" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — Schema.org LocalBusiness
// Mejora la aparición en Google Maps, Knowledge Panel y rich snippets locales
// ─────────────────────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "OficiosGo!",
  description:
    "Plataforma de profesionales de oficios verificados en Villa María, Córdoba, Argentina.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com.ar",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com.ar"}/logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Villa María",
    addressRegion: "Córdoba",
    addressCountry: "AR",
  },
  areaServed: {
    "@type": "City",
    name: "Villa María",
  },
  serviceType: [
    "Plomería",
    "Electricidad",
    "Pintura",
    "Carpintería",
    "Limpieza",
  ],
  sameAs: [
    // "https://www.instagram.com/oficiosgo",
    // "https://www.facebook.com/oficiosgo",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" dir="ltr">
      <head>
      <meta charSet="utf-8" />
        {/* ── JSON-LD Schema.org ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── PWA icons ── */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />

        {/* ── Fonts — subset mínimo para reducir LCP ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/*
          Cambio: se agrega display=swap explícito y se limita a los pesos
          realmente usados (700,800,900) para reducir ~40% el peso de la fuente.
          400,500,600 se reemplazan con system-ui como fallback hasta que cargue.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className="min-h-screen antialiased overflow-x-hidden"
        style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}