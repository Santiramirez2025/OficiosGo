import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { getCurrentUser } from "@/server/auth/session";
import { professionalRepository } from "@/server/repositories/professional.repository";
import { budgetRepository } from "@/server/repositories/budget.repository";
import { db } from "@/db/client";

// ─── Meta SEO ────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Panel de control – OficiosGo | Profesionales en Villa María, Córdoba",
  description:
    "Gestioná tu perfil profesional en OficiosGo: revisá vistas, contactos, reseñas y presupuestos de clientes en Villa María y Córdoba.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function TrendBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-gray-400">Sin datos este mes</span>;
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
        <path d="M5 2L9 8H1L5 2Z" fill="currentColor" />
      </svg>
      +{value} este mes
    </span>
  );
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de ${max} estrellas`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={i < rating ? "#F8C927" : "#E5E7EB"}
        >
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02l-2.78 1.54.53-3.1L1.5 4.27l3.11-.45L6 1z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await professionalRepository.getByUserId(user.id);
  if (!profile) redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEvents = await db.profileEvent.groupBy({
    by: ["eventType"],
    where: { profileId: profile.id, createdAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  const recentViews =
    recentEvents.find((e) => e.eventType === "view")?._count ?? 0;
  const recentContacts =
    recentEvents.find((e) => e.eventType === "contact")?._count ?? 0;

  const recentReviews = await db.review.findMany({
    where: { profileId: profile.id, isVisible: true, deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const budgetRequests = await budgetRepository.getForProfessional(
    profile.categoryId,
    1,
    5
  );

  const isPremium = profile.tier === "PREMIUM";
  const firstName = user.name.split(" ")[0];

  // ── Derived copy ──────────────────────────────────────────────────────────
  const greeting =
    new Date().getHours() < 12
      ? "Buenos días"
      : new Date().getHours() < 19
      ? "Buenas tardes"
      : "Buenas noches";

  const metrics = [
    {
      label: "Visitas al perfil",
      value: profile.totalViews,
      recent: recentViews,
      icon: "👁️",
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Contactos recibidos",
      value: profile.totalContacts,
      recent: recentContacts,
      icon: "📞",
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Rating promedio",
      value: profile.averageRating.toFixed(1),
      recent: null,
      icon: "⭐",
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Reseñas recibidas",
      value: profile.totalReviews,
      recent: null,
      icon: "💬",
      bg: "bg-violet-50",
      color: "text-violet-600",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-[#F7F8FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7 space-y-6">

          {/* ── H1 Header ── */}
          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400 font-medium mb-0.5">{greeting},</p>
              {/* H1 SEO: nombre + profesión implícita */}
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A1D2E] leading-tight">
                {firstName} 👋
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {recentViews > 0
                  ? `${recentViews} personas vieron tu perfil este mes — ¡seguí así!`
                  : "Completá tu perfil para aparecer en más búsquedas"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {profile.status === "PENDING" && (
                <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200">
                  ⏳ Perfil en revisión
                </span>
              )}
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  isPremium
                    ? "bg-[#F8C927] text-[#1A1D2E]"
                    : profile.tier === "STANDARD"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isPremium ? "★ Premium" : profile.tier === "STANDARD" ? "Standard" : "Free"}
              </span>
            </div>
          </header>

          {/* ── Pending banner (moved up, contextual) ── */}
          {profile.status === "PENDING" && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-900"
            >
              <span className="text-lg shrink-0">📋</span>
              <div>
                <strong className="font-bold">Tu perfil está en revisión.</strong>{" "}
                Mientras tanto, completá tu descripción y subí fotos de tus trabajos para
                causar una gran primera impresión cuando se apruebe.
              </div>
            </div>
          )}

          {/* ── Budget Requests (HIGH VALUE — above the fold) ── */}
          {budgetRequests.data.length > 0 && (
            <section aria-labelledby="budget-heading">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#F8C927]/40 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  {/* H2 semántico */}
                  <h2
                    id="budget-heading"
                    className="text-base font-extrabold text-[#1A1D2E] flex items-center gap-2"
                  >
                    📋 Clientes buscando tu servicio
                    <span className="px-2 py-0.5 rounded-full bg-[#F8C927] text-[#1A1D2E] text-[11px] font-extrabold">
                      {budgetRequests.total} nuevo{budgetRequests.total !== 1 ? "s" : ""}
                    </span>
                  </h2>
                  <Link
                    href="/app/presupuestos"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Ver todos →
                  </Link>
                </div>

                <div className="space-y-3">
                  {budgetRequests.data.map((req) => (
                    <article
                      key={req.id}
                      className="p-4 rounded-xl bg-[#FFFBEA] border border-yellow-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1A1D2E] line-clamp-2">
                            {req.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(req.createdAt).toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · "}
                            {req._count.responses} respuesta
                            {req._count.responses !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            req.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.status === "PENDING" ? "Nuevo" : "Activo"}
                        </span>
                      </div>

                      {/* CTA WhatsApp — min-h-[44px] para touch targets */}
                      <a
                        href={`https://wa.me/54${req.clientPhone ?? ""}?text=${encodeURIComponent(
                          `Hola ${req.clientName ?? ""}, soy ${user.name} de OficiosGo. Vi tu pedido de presupuesto y me gustaría ayudarte.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white text-sm font-bold transition-colors"
                        aria-label={`Contactar a ${req.clientName ?? "cliente"} por WhatsApp`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Responder ahora por WhatsApp
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Metrics ── */}
          <section aria-label="Métricas del perfil">
            {/* Mobile: 2 cols, Desktop: 4 cols */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center text-base mb-3`}
                    aria-hidden="true"
                  >
                    {m.icon}
                  </div>
                  <div className="text-2xl font-black text-[#1A1D2E] leading-none">
                    {m.value}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 leading-tight">
                    {m.label}
                  </div>
                  {m.recent !== null && (
                    <div className="mt-1.5">
                      <TrendBadge value={m.recent} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Two-col section: Plan + Reviews ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Plan card */}
            <section
              aria-labelledby="plan-heading"
              className="p-5 sm:p-6 rounded-2xl bg-[#1A1D2E] text-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    id="plan-heading"
                    className="text-base font-extrabold leading-tight"
                  >
                    Plan{" "}
                    {profile.tier === "FREE"
                      ? "Gratuito"
                      : profile.tier === "PREMIUM"
                      ? "Premium ★"
                      : "Standard"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 leading-snug">
                    {profile.tier === "FREE"
                      ? "Los clientes ven primero a quienes tienen Premium."
                      : "Tu perfil aparece destacado en todas las búsquedas."}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    profile.tier === "FREE"
                      ? "bg-gray-700 text-gray-400"
                      : "bg-[#F8C927] text-[#1A1D2E]"
                  }`}
                >
                  {profile.tier === "FREE" ? "Inactivo" : "Activo"}
                </span>
              </div>

              {profile.tier === "FREE" && (
                <>
                  <ul className="text-xs text-gray-300 space-y-1.5 mb-5">
                    <li className="flex items-center gap-2">
                      <span className="text-[#F8C927]">✓</span>
                      Aparecé en el top 3 de búsquedas locales
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#F8C927]">✓</span>
                      Badge Premium que genera confianza
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#F8C927]">✓</span>
                      Recibí más presupuestos directos
                    </li>
                  </ul>
                  {/* CTA con beneficio explícito */}
                  <button className="w-full min-h-[44px] py-3 rounded-xl bg-[#F8C927] hover:bg-yellow-300 text-[#1A1D2E] font-extrabold text-sm transition-colors">
                    Probar Premium por $4.990/mes →
                  </button>
                  <p className="text-center text-[10px] text-gray-500 mt-2">
                    Cancelá cuando quieras. Sin contratos.
                  </p>
                </>
              )}

              {profile.tier !== "FREE" && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
                  <div>
                    <div className="text-[11px] text-gray-400">Posición</div>
                    <div className="font-bold mt-0.5">
                      Top {isPremium ? "3" : "10"} en búsquedas
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-400">Badge</div>
                    <div className="font-bold mt-0.5">
                      {isPremium ? "★ Premium" : "Standard"}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Recent reviews */}
            <section
              aria-labelledby="reviews-heading"
              className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="reviews-heading"
                  className="text-base font-extrabold text-[#1A1D2E]"
                >
                  Últimas reseñas
                </h2>
                {recentReviews.length > 0 && (
                  <Link
                    href="/app/resenas"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Ver todas →
                  </Link>
                )}
              </div>

              {recentReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="text-3xl mb-2">💬</span>
                  <p className="text-sm font-semibold text-gray-700">
                    Todavía no tenés reseñas
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Pedile a tus clientes que te dejen una reseña para ganar más confianza.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentReviews.map((rev) => (
                    <div key={rev.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#1A1D2E] truncate">
                          {rev.author.name}
                        </span>
                        <StarRating rating={rev.rating} />
                      </div>
                      {rev.comment && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Quick actions ── */}
          <section aria-labelledby="actions-heading">
            <h2
              id="actions-heading"
              className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
            >
              Acciones rápidas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Editar perfil",
                  emoji: "✏️",
                  href: "/app/perfil/editar",
                  desc: "Datos y descripción",
                },
                {
                  label: "Subir fotos",
                  emoji: "📸",
                  href: "/app/perfil/fotos",
                  desc: "Mostrá tu trabajo",
                },
                {
                  label: "Ver reseñas",
                  emoji: "💬",
                  href: "/app/resenas",
                  desc: "Respondé clientes",
                },
                {
                  label: "Mi perfil público",
                  emoji: "👁️",
                  href: `/app/profesional/${profile.slug}`,
                  desc: "Lo que ven los clientes",
                },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-[#F8C927] hover:shadow-md transition-all group"
                >
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                    {a.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#1A1D2E] group-hover:text-[#1A1D2E] truncate">
                      {a.label}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {a.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}