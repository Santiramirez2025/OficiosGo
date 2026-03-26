import Link from "next/link";
import { categoryRepository } from "@/server/repositories/category.repository";
import { searchService } from "@/server/services/search.service";
import { sponsorRepository } from "@/server/repositories/sponsor.repository";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { HomeCTAs } from "@/components/features/home-ctas";
import { InstallButton } from "@/components/pwa/install-button";

export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const INITIALS = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Gradients rotativos para avatares sin foto
const AVATAR_GRADIENTS = [
  ["#5C80BC", "#3a5a96"],
  ["#F5A623", "#c97d10"],
  ["#7A9263", "#506048"],
  ["#BC5C80", "#963a5a"],
  ["#5CBCBC", "#3a9696"],
  ["#9C5CBC", "#7a3a96"],
  ["#BC9C5C", "#967a3a"],
  ["#5C9C5C", "#3a7a3a"],
];

export default async function HomePage() {
  const [categories, featured, sponsors, total] = await Promise.all([
    categoryRepository.getAll(),
    searchService.getFeatured(8),
    sponsorRepository.getActive("Villa María"),
    professionalRepository.countAll(),
  ]);

  // Top 4 categories para el grid del header
  const topCategories = categories.slice(0, 4);
  // Resto para el carrusel de "más servicios"
  const moreCategories = categories.slice(4);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HEADER — búsqueda + categorías destacadas
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden rounded-b-[32px] px-5 pt-4 pb-6"
        style={{
          background: "linear-gradient(175deg, #0F1120 0%, #1E2035 100%)",
        }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />
        {/* Glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(248,201,39,0.12), transparent 70%)",
            filter: "blur(40px)",
          }}
          aria-hidden="true"
        />

        {/* ── Top bar ── */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <Link href="/app" aria-label="Ir al inicio de OficiosGo!">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.svg"
              alt="OficiosGo!"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-2">
            <InstallButton variant="small" />
            <Link
              href="/app/cuenta"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Mi cuenta"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Saludo contextual ── */}
        <p className="relative z-10 text-[13px] text-gray-400 mb-2 font-medium">
          ¿Qué problema resolvemos hoy? 👋
        </p>

        {/* ── Search bar ── */}
        <Link
          href="/app/buscar"
          className="relative z-10 flex items-center gap-3 w-full px-4 py-3.5 bg-white rounded-2xl shadow-lg shadow-black/20 active:scale-[0.98] transition-transform"
          aria-label="Buscar profesionales"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="text-sm text-gray-400 font-medium flex-1">
            Plomero, electricista, pintor…
          </span>
          <span className="text-[11px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded-md font-semibold shrink-0">
            Buscar
          </span>
        </Link>

        {/* ── HomeCTAs (componente externo) ── */}
        <HomeCTAs />

        {/* ── Top 4 category grid ── */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 mt-4">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/app/buscar?category=${cat.slug}`}
              className="group relative overflow-hidden flex items-center gap-3 p-3.5 rounded-2xl active:scale-[0.97] transition-transform"
              style={{
                background: "linear-gradient(145deg, #F8C927, #E8B800)",
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white/15"
                aria-hidden="true"
              />
              <span
                className="text-2xl drop-shadow-sm shrink-0 relative z-10"
                aria-hidden="true"
              >
                {cat.icon}
              </span>
              <div className="relative z-10 min-w-0">
                <div className="text-[13px] font-extrabold text-[#0F1120] leading-tight truncate">
                  {cat.name}
                </div>
                <div className="text-[10px] text-[#0F1120]/60 font-medium mt-0.5">
                  {cat._count.profiles}{" "}
                  {cat._count.profiles === 1 ? "profesional" : "disponibles"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Ver todas las categorías ── */}
        <Link
          href="/app/buscar"
          className="relative z-10 flex items-center justify-center gap-1.5 w-full mt-3 py-2.5 text-[13px] font-semibold text-white/70 bg-white/[0.07] rounded-xl border border-white/10 hover:bg-white/[0.12] transition-colors active:scale-[0.98]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Ver las {categories.length} categorías
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          FEATURED PROFESSIONALS — carrusel horizontal
      ════════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="featured-heading" className="mt-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2
              id="featured-heading"
              className="text-[17px] font-black text-[#0F1120] leading-tight"
            >
              Mejor valorados
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
              Calificados por vecinos de Villa María
            </p>
          </div>
          <Link
            href="/app/buscar"
            className="text-[12px] font-bold text-[#0F1120] bg-[#F8C927] px-3 py-1.5 rounded-lg active:scale-[0.97] transition-transform"
          >
            Ver todos
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="mx-5 py-10 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Pronto habrá profesionales destacados aquí 🔧
            </p>
          </div>
        ) : (
          <div
            className="flex gap-3 overflow-x-auto px-5 pb-3 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
            role="list"
            aria-label="Profesionales destacados"
          >
            {featured.map((pro, i) => {
              const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
              return (
                <Link
                  key={pro.id}
                  href={`/app/profesional/${pro.slug}`}
                  className="snap-start shrink-0 w-[152px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.97] transition-transform"
                  role="listitem"
                >
                  {/* Photo / avatar */}
                  <div className="relative h-[112px] overflow-hidden">
                    {pro.photos?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pro.photos[0].url}
                        alt={`Foto de ${pro.user.name}, ${pro.category.name} en Villa María`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-2xl font-black"
                        style={{
                          background: `linear-gradient(135deg, ${from}, ${to})`,
                        }}
                        aria-hidden="true"
                      >
                        {INITIALS(pro.user.name)}
                      </div>
                    )}
                    {/* Rating badge */}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 bg-black/65 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                      <span className="text-[#F8C927] text-[10px]" aria-hidden="true">★</span>
                      <span className="text-[11px] font-bold text-white">
                        {pro.averageRating.toFixed(1)}
                      </span>
                    </div>
                    {/* Premium badge */}
                    {pro.tier === "PREMIUM" && (
                      <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                        Premium
                      </div>
                    )}
                  </div>

                  <div className="p-2.5">
                    <div className="text-[13px] font-extrabold text-[#0F1120] leading-tight truncate">
                      {pro.user.name}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {pro.category.icon} {pro.category.name}
                    </div>
                    <div className="mt-2 py-1.5 rounded-xl bg-[#0F1120] text-center text-[11px] font-extrabold text-[#F8C927]">
                      Ver perfil →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ALL PROFESSIONALS — lista vertical con más detalle
      ════════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="all-pros-heading" className="mt-5 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2
            id="all-pros-heading"
            className="text-[17px] font-black text-[#0F1120]"
          >
            Todos los profesionales
          </h2>
          <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
            {total}+ activos
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {featured.map((pro, i) => {
            const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
            return (
              <Link
                key={pro.id}
                href={`/app/profesional/${pro.slug}`}
                className={`flex items-center gap-3 p-3 rounded-2xl bg-white border shadow-sm active:scale-[0.98] transition-transform ${
                  pro.tier === "PREMIUM"
                    ? "border-[#F8C927]/40 shadow-[#F8C927]/5"
                    : "border-gray-100"
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {pro.photos?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pro.photos[0].url}
                      alt={`${pro.user.name} — ${pro.category.name}`}
                      className="w-[52px] h-[52px] rounded-[14px] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-white text-base font-black"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                      }}
                      aria-hidden="true"
                    >
                      {INITIALS(pro.user.name)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[14px] font-extrabold text-[#0F1120] truncate">
                      {pro.user.name}
                    </span>
                    {pro.tier === "PREMIUM" && (
                      <span className="text-[8px] font-extrabold bg-gradient-to-r from-[#F5A623] to-[#F8C927] text-[#0F1120] px-1.5 py-[2px] rounded-md uppercase tracking-wide shrink-0">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-gray-500 mt-0.5 truncate">
                    {pro.category.name}
                    {pro.city ? ` · ${pro.city}` : ""}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[#F8C927] text-[11px]" aria-hidden="true">★</span>
                    <span className="text-[12px] font-bold text-[#0F1120]">
                      {pro.averageRating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      ({pro.totalReviews}{" "}
                      {pro.totalReviews === 1 ? "reseña" : "reseñas"})
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            );
          })}
        </div>

        {/* Ver más CTA */}
        <Link
          href="/app/buscar"
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-[13px] font-bold text-gray-400 hover:border-[#F8C927] hover:text-[#0F1120] transition-colors active:scale-[0.98]"
        >
          Ver los {total}+ profesionales →
        </Link>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SPONSORS + PUBLICITAR
      ════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="sponsors-heading"
        className="px-5 pt-6 pb-28"
      >
        {sponsors.length > 0 && (
          <>
            <h2
              id="sponsors-heading"
              className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 text-center mb-3"
            >
              Negocios que confían en OficiosGo!
            </h2>

            <div className="flex flex-col gap-2 mb-4">
              {sponsors.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border ${
                    s.tier === "PREMIUM"
                      ? "border-[#F8C927]/30 bg-gradient-to-br from-yellow-50/60 to-white shadow-sm"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-extrabold text-[#0F1120]">
                      {s.name}
                    </span>
                    <span
                      className={`text-[8px] font-extrabold uppercase px-1.5 py-[3px] rounded-md tracking-wide ${
                        s.tier === "PREMIUM"
                          ? "bg-[#F5A623]/15 text-[#E89015]"
                          : "bg-[#5C80BC]/10 text-[#5C80BC]"
                      }`}
                    >
                      {s.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {s.description}
                  </p>
                  {s.phone && (
                    <p className="text-xs text-[#5C80BC] font-semibold mt-2">
                      📞 {s.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA publicidad — WhatsApp directo */}
        <a
          href="https://wa.me/5493534127410?text=Hola%2C%20quiero%20publicitar%20mi%20negocio%20en%20OficiosGo!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-[13px] font-bold transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #0F1120, #1E2035)",
            color: "#F8C927",
            border: "1px solid rgba(248,201,39,0.2)",
          }}
        >
          {/* WhatsApp icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          Publicitá tu negocio en OficiosGo!
        </a>
      </section>
    </>
  );
}