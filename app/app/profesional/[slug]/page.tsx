import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ContactButtons } from "@/components/features/contact-buttons";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

// ── SEO ───────────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await professionalRepository.getBySlug(slug);
  if (!profile) return { title: "No encontrado" };

  const name = profile.user.name;
  const cat = profile.category.name;
  const city = profile.city ?? "Villa María";
  const rating = profile.averageRating.toFixed(1);

  return {
    // Pattern: [Nombre] — [Oficio] en [Ciudad] | OficiosGo
    title: `${name} — ${cat} en ${city} | OficiosGo`,
    description:
      profile.headline ??
      `${name} es ${cat} en ${city} con ${rating}★ de rating y ${profile.totalReviews} reseñas verificadas. Contactalo hoy en OficiosGo.`,
    openGraph: {
      title: `${name} — ${cat} en ${city}`,
      description: `${rating}★ · ${profile.totalReviews} reseñas · ${city}`,
      images: profile.photos[0] ? [{ url: profile.photos[0].url }] : [],
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            width="13"
            height="13"
            viewBox="0 0 12 12"
            fill={s <= Math.round(rating) ? "#F8C927" : "#E5E7EB"}
          >
            <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-black text-[#1A1D2E]">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-400">({count} reseñas)</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await professionalRepository.getBySlug(slug);
  if (!profile) notFound();

  // Fire-and-forget view count
  professionalRepository.incrementViews(profile.id).catch(() => {});

  const isPremium = profile.tier === "PREMIUM";
  const firstName = profile.user.name.split(" ")[0];
  const initials = profile.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-10">

      {/* ── Hero ── */}
      <div className="relative h-[280px] bg-[#1A1D2E]">
        {profile.photos[0] ? (
          <img
            src={profile.photos[0].url}
            alt={`Trabajos de ${profile.user.name} — ${profile.category.name} en ${profile.city}`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          // Fallback: branded gradient
          <div className="w-full h-full bg-gradient-to-br from-[#1A1D2E] via-[#252839] to-[#1A1D2E]">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #F8C927 0%, transparent 60%)" }}
            />
          </div>
        )}

        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Back button */}
        <Link
          href="/app/buscar"
          aria-label="Volver a resultados"
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>

        {/* Premium badge top-right */}
        {isPremium && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-[10px] font-extrabold uppercase tracking-wide">
            ★ Premium
          </div>
        )}

        {/* Photo count indicator */}
        {profile.photos.length > 1 && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.8">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#1A1D2E" />
              <polyline points="21 15 16 10 5 21" stroke="#1A1D2E" fill="none" strokeWidth="1.5" />
            </svg>
            <span className="text-[10px] text-white/80 font-semibold">
              {profile.photos.length} fotos
            </span>
          </div>
        )}
      </div>

      {/* ── Profile card (overlapping hero) ── */}
      <div className="mx-4 -mt-12 relative z-10">
        <div
          className={`rounded-[22px] bg-white p-5 shadow-xl ${
            isPremium
              ? "border-2 border-[#F8C927]"
              : "border border-gray-100"
          }`}
        >
          <div className="flex gap-3.5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5C80BC] to-[#7A9263] flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md border-[3px] border-white">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* H1 — nombre completo + categoría (SEO) */}
              <h1 className="text-[19px] font-black text-[#1A1D2E] leading-tight">
                {profile.user.name}
              </h1>

              {/* H2 implícito — categoría + ciudad (SEO local) */}
              <p className="text-[12px] text-[#5C80BC] font-bold mt-0.5 uppercase tracking-wide">
                {profile.category.name}
                {profile.city ? ` · ${profile.city}` : ""}
              </p>

              <div className="mt-2">
                <StarRow
                  rating={profile.averageRating}
                  count={profile.totalReviews}
                />
              </div>

              {/* Matrícula — señal de confianza */}
              {profile.matricula && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="#7A9263"
                    aria-hidden="true"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z" />
                  </svg>
                  <span className="text-[11px] text-[#7A9263] font-semibold">
                    Matr. {profile.matricula}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Headline — debajo del bloque nombre/avatar */}
          {profile.headline && (
            <p className="text-[13px] text-gray-500 leading-relaxed mt-3 pt-3 border-t border-gray-100">
              {profile.headline}
            </p>
          )}

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.city && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                📍 {profile.city}
              </span>
            )}
            {profile.availability && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                🕐 {profile.availability}
              </span>
            )}
            {profile.yearsExperience && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                🔨 {profile.yearsExperience} años de experiencia
              </span>
            )}
            {profile.totalContacts > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-[#5C80BC] bg-blue-50 px-2.5 py-1.5 rounded-lg font-semibold">
                👥 {profile.totalContacts} clientes contactaron
              </span>
            )}
          </div>

          {/* ── CTA — PRIMARY CONVERSION POINT ── */}
          <div className="mt-4">
            <ContactButtons
              profileId={profile.id}
              whatsapp={profile.whatsapp}
              phone={profile.user.phone}
              name={firstName}
            />
          </div>
        </div>
      </div>

      {/* ── About ── */}
      {profile.bio && (
        <section
          aria-labelledby="about-heading"
          className="mx-4 mt-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
        >
          <h2
            id="about-heading"
            className="text-[14px] font-extrabold text-[#1A1D2E] mb-2"
          >
            Sobre {firstName}
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed">{profile.bio}</p>
        </section>
      )}

      {/* ── Photo gallery ── */}
      {profile.photos.length > 1 && (
        <section
          aria-labelledby="gallery-heading"
          className="mx-4 mt-3"
        >
          <h2
            id="gallery-heading"
            className="text-[14px] font-extrabold text-[#1A1D2E] mb-2 px-0.5"
          >
            Trabajos realizados
          </h2>
          <div className="grid grid-cols-3 gap-1.5">
            {profile.photos.slice(0, 6).map((photo, i) => (
              <div
                key={photo.url}
                className={`rounded-xl overflow-hidden bg-gray-100 ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "auto" : "1/1" }}
              >
                <img
                  src={photo.url}
                  alt={`Trabajo ${i + 1} de ${profile.user.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      {profile.reviews.length > 0 && (
        <section
          aria-labelledby="reviews-heading"
          className="mx-4 mt-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
        >
          {/* Header con rating summary */}
          <div className="flex items-center justify-between mb-4">
            <h2
              id="reviews-heading"
              className="text-[14px] font-extrabold text-[#1A1D2E]"
            >
              Reseñas
            </h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFBEA] border border-[#F8C927]/30">
              <span className="text-[#F8C927] text-base leading-none">★</span>
              <span className="text-sm font-black text-[#1A1D2E]">
                {profile.averageRating.toFixed(1)}
              </span>
              <span className="text-[11px] text-gray-400">
                / {profile.reviews.length} reseña
                {profile.reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {profile.reviews.map((rev) => (
              <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Mini avatar */}
                    <div className="w-7 h-7 rounded-full bg-[#1A1D2E]/10 flex items-center justify-center text-[10px] font-black text-[#1A1D2E] shrink-0">
                      {rev.author.name.charAt(0)}
                    </div>
                    <span className="text-[13px] font-bold text-[#1A1D2E] truncate">
                      {rev.author.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 pt-0.5">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>

                <div className="flex gap-0.5 mt-1.5 ml-9">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill={s <= rev.rating ? "#F8C927" : "#E5E7EB"}
                    >
                      <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
                    </svg>
                  ))}
                </div>

                {rev.comment && (
                  <p className="text-[12px] text-gray-500 mt-1.5 ml-9 leading-relaxed">
                    {rev.comment}
                  </p>
                )}

                {rev.response && (
                  <div className="mt-2 ml-9 p-2.5 rounded-xl bg-[#FFFBEA] border-l-2 border-[#F8C927] text-[11px] text-gray-600 leading-relaxed">
                    <strong className="text-[#1A1D2E] font-bold">
                      Respuesta de {firstName}:
                    </strong>{" "}
                    {rev.response}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky bottom CTA (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA]/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <ContactButtons
            profileId={profile.id}
            whatsapp={profile.whatsapp}
            phone={profile.user.phone}
            name={firstName}
            variant="sticky"
          />
        </div>
      </div>

    </div>
  );
}