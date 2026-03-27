import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OficiosGo! - Plomeros, Electricistas y Mas en Villa Maria, Cordoba",
    template: "%s | OficiosGo! Villa Maria",
  },
  description:
    "Encontra plomeros, electricistas, pintores y carpinteros verificados en Villa Maria, Cordoba. Resenas reales de vecinos. Descarga la app gratis y contactalos hoy.",
  keywords: [
    "plomero villa maria",
    "electricista villa maria cordoba",
    "pintor villa maria cordoba",
    "carpintero villa maria",
    "servicios del hogar villa maria",
    "profesionales oficios villa maria",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "OficiosGo!",
    title: "OficiosGo! - Profesionales de oficios verificados en Villa Maria",
    description: "Plomeros, electricistas, pintores y mas. Verificados, con resenas reales. App gratis para Villa Maria, Cordoba.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "OficiosGo!" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OficiosGo! - Profesionales de oficios en Villa Maria",
    description: "Encontra plomeros, electricistas, pintores verificados en Villa Maria, Cordoba.",
    images: ["/icons/icon-512.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OficiosGo!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: { "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8C927" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1120" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "OficiosGo!",
  description: "Plataforma de profesionales de oficios verificados en Villa Maria, Cordoba, Argentina.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://oficiosgo.com"}/icons/icon-512.png`,
  address: { "@type": "PostalAddress", addressLocality: "Villa Maria", addressRegion: "Cordoba", addressCountry: "AR" },
  areaServed: { "@type": "City", name: "Villa Maria" },
  serviceType: ["Plomeria", "Electricidad", "Pintura", "Carpinteria", "Limpieza"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta charSet="utf-8" />

        {/* Capture PWA install prompt before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `window.__pwaInstallPrompt=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaInstallPrompt=e;});` }} />

        {/* JSON-LD Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>

      <body className="min-h-screen antialiased overflow-x-hidden" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}