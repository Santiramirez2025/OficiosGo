import Link from "next/link";

const oficios = [
  { label: "Electricistas", href: "/electricista-villa-maria" },
  { label: "Plomeros", href: "/plomero-villa-maria" },
  { label: "Carpinteros", href: "/carpintero-villa-maria" },
  { label: "Pintores", href: "/pintor-villa-maria" },
  { label: "Gasistas", href: "/gasista-villa-maria" },
];

const empresa = [
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Preguntas frecuentes", href: "/faq" },
  { label: "Blog de consejos", href: "/blog" },
  { label: "Términos y privacidad", href: "/terminos" },
];

export function Footer() {
  return (
    <footer className="bg-[#0d0e14] text-white pt-14 pb-6 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Columna Marca */}
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="OficiosGo! inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="OficiosGo!" className="h-9" />
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Encontrá profesionales de oficios en Villa María, Córdoba.
            Verificados, con reseñas reales y disponibilidad inmediata.
          </p>
          {/* CTA conversión */}
          <Link
            href="/buscar"
            className="inline-block text-center text-sm font-semibold bg-[#F5A623] text-black rounded-lg px-4 py-2.5 hover:bg-[#e09612] transition-colors w-fit"
          >
            Buscar profesional ahora →
          </Link>
          {/* Redes sociales */}
          <div className="flex gap-3 mt-1">
            <a
              href="https://www.instagram.com/oficiosgo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram OficiosGo!"
              className="text-gray-500 hover:text-[#F5A623] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-1.569.072-3.048.44-4.204 1.596C1.693 2.824 1.325 4.303 1.253 5.872 1.195 7.152 1.181 7.56 1.181 12c0 4.44.014 4.848.072 6.128.072 1.569.44 3.048 1.596 4.204 1.156 1.156 2.635 1.524 4.204 1.596C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.569-.072 3.048-.44 4.204-1.596 1.156-1.156 1.524-2.635 1.596-4.204.058-1.28.072-1.688.072-6.128 0-4.44-.014-4.848-.072-6.128-.072-1.569-.44-3.048-1.596-4.204C19.975.512 18.496.144 16.927.072 15.667.014 15.259 0 12 0z" />
                <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324A6.162 6.162 0 0 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/oficiosgo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook OficiosGo!"
              className="text-gray-500 hover:text-[#F5A623] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.955.93-1.955 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Columna Oficios — SEO links locales */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-4">
            Oficios en Villa María
          </h4>
          <nav aria-label="Oficios disponibles" className="flex flex-col gap-2">
            {oficios.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Columna Para profesionales */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-4">
            Para Profesionales
          </h4>
          <div className="flex flex-col gap-2 mb-5">
            <Link href="/registro" className="text-sm text-gray-400 hover:text-white transition-colors">
              Registrarte gratis
            </Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Mi Panel
            </Link>
            <Link href="/planes" className="text-sm text-gray-400 hover:text-white transition-colors">
              Ver planes y precios
            </Link>
          </div>
          {/* Mini CTA profesionales */}
          <Link
            href="/registro"
            className="inline-block text-xs font-semibold border border-[#F5A623]/60 text-[#F5A623] rounded-lg px-3 py-2 hover:bg-[#F5A623]/10 transition-colors"
          >
            Publicá tu perfil gratis →
          </Link>
        </div>

        {/* Columna Empresa + Contacto */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-4">
            Empresa
          </h4>
          <nav aria-label="Información de empresa" className="flex flex-col gap-2 mb-6">
            {empresa.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-1.5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#F5A623] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Villa María, Córdoba
            </span>
            <a
              href="mailto:info@oficiosgo.com"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#F5A623] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@oficiosgo.com
            </a>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>© {new Date().getFullYear()} OficiosGo! — Hecho en Villa María, Córdoba 🇦🇷</span>
        <div className="flex gap-4">
          <Link href="/terminos" className="hover:text-gray-300 transition-colors">Términos</Link>
          <Link href="/privacidad" className="hover:text-gray-300 transition-colors">Privacidad</Link>
        </div>
      </div>
    </footer>
  );
}