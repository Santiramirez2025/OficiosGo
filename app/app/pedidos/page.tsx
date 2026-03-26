"use client";

// ─── NOTE ────────────────────────────────────────────────────────────────────
// Replace `mockPedidos` with your real data-fetching logic.
// The component handles three states: loading, empty, and with data.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
type PedidoStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Pedido {
  id: string;
  professionalName: string;
  professionalSlug: string;
  category: string;
  status: PedidoStatus;
  createdAt: string;
  description: string;
  price?: number;
}

// ── Mock data — remove when wiring real API ──────────────────────────────────
const mockPedidos: Pedido[] = [
  // Uncomment to test with data:
  // {
  //   id: "1",
  //   professionalName: "Carlos Mendez",
  //   professionalSlug: "carlos-mendez",
  //   category: "Electricista",
  //   status: "IN_PROGRESS",
  //   createdAt: "2024-03-15T10:00:00Z",
  //   description: "Instalación de tablero eléctrico en cocina",
  //   price: 35000,
  // },
];

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  PedidoStatus,
  { label: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-400",
  },
  IN_PROGRESS: {
    label: "En curso",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Finalizado",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "active", label: "Activos" },
  { key: "completed", label: "Finalizados" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function filterByTab(pedidos: Pedido[], tab: TabKey): Pedido[] {
  if (tab === "active")
    return pedidos.filter((p) =>
      ["PENDING", "IN_PROGRESS"].includes(p.status)
    );
  return pedidos.filter((p) =>
    ["COMPLETED", "CANCELLED"].includes(p.status)
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function PedidoCard({ pedido }: { pedido: Pedido }) {
  const cfg = STATUS_CONFIG[pedido.status];
  const date = new Date(pedido.createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/app/pedidos/${pedido.id}`}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#F8C927]/50 transition-all active:scale-[0.99]"
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              {pedido.category}
            </p>
            <h3 className="text-sm font-extrabold text-[#1A1D2E] leading-snug line-clamp-2">
              {pedido.description}
            </h3>
          </div>
          {/* Status badge */}
          <span
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar placeholder */}
            <div className="w-6 h-6 rounded-full bg-[#1A1D2E]/10 flex items-center justify-center text-[10px] font-bold text-[#1A1D2E]">
              {pedido.professionalName.charAt(0)}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {pedido.professionalName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {pedido.price && (
              <span className="text-xs font-bold text-[#1A1D2E]">
                ${pedido.price.toLocaleString("es-AR")}
              </span>
            )}
            <span className="text-[10px] text-gray-400">{date}</span>
          </div>
        </div>
      </div>

      {/* Progress bar for IN_PROGRESS */}
      {pedido.status === "IN_PROGRESS" && (
        <div className="h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: "60%" }}
          />
        </div>
      )}
    </Link>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  const isActive = tab === "active";
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-[#F8C927]/15 flex items-center justify-center text-4xl">
          {isActive ? "🔍" : "✅"}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#1A1D2E] flex items-center justify-center text-sm">
          {isActive ? "📋" : "🗂️"}
        </div>
      </div>

      <h2 className="text-lg font-black text-[#1A1D2E] mb-2">
        {isActive ? "Ningún pedido activo" : "Sin historial todavía"}
      </h2>
      <p className="text-sm text-gray-400 leading-relaxed max-w-[240px] mb-6">
        {isActive
          ? "Encontrá un profesional y pedí tu presupuesto — tu pedido aparecerá acá."
          : "Los pedidos que finalices quedarán guardados acá para que puedas volver a contactar al profesional."}
      </p>

      {isActive && (
        <Link
          href="/app/buscar"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-sm font-extrabold shadow-sm hover:bg-yellow-300 transition-colors active:scale-95"
        >
          Buscar profesionales →
        </Link>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("active");

  const filtered = filterByTab(mockPedidos, activeTab);
  const activeCount = filterByTab(mockPedidos, "active").length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 bg-[#1A1D2E]">
        {/* Title row */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          {/* Back (if nested nav) */}
          <Link
            href="/app"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0"
            aria-label="Volver"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-[#F8C927] leading-tight">
              Mis Pedidos
            </h1>
            {mockPedidos.length > 0 && (
              <p className="text-[11px] text-white/50 mt-0.5">
                {activeCount} activo{activeCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* CTA top-right */}
          <Link
            href="/app/buscar"
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#F8C927] text-[#1A1D2E] text-xs font-extrabold"
          >
            + Nuevo
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex px-5 pb-0 gap-1 border-b border-white/10">
          {TABS.map((tab) => {
            const count =
              tab.key === "active"
                ? filterByTab(mockPedidos, "active").length
                : filterByTab(mockPedidos, "completed").length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-colors ${
                  activeTab === tab.key
                    ? "text-[#F8C927]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      activeTab === tab.key
                        ? "bg-[#F8C927] text-[#1A1D2E]"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {count}
                  </span>
                )}
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8C927] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 py-5">
        {filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-3">
            {filtered.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}