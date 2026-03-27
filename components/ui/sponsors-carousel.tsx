"use client";

import { useRef, useState, useEffect } from "react";

type Sponsor = {
  id: string;
  name: string;
  tier: string;
  description?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
};

export function SponsorsCarousel({ sponsors }: { sponsors: Sponsor[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Velocidad del auto-scroll (px por frame)
  const SPEED = 0.5;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Ancho de 1/3 del track (usamos 3 copias)
    const getLoopWidth = () => track.scrollWidth / 3;

    const animate = () => {
      if (!isDraggingRef.current) {
        positionRef.current += SPEED;
        const loopWidth = getLoopWidth();
        if (positionRef.current >= loopWidth) {
          positionRef.current -= loopWidth;
        }
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // ── Mouse drag ────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startPosRef.current = positionRef.current;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = startXRef.current - e.clientX;
    const track = trackRef.current;
    if (!track) return;
    const loopWidth = track.scrollWidth / 3;
    let newPos = startPosRef.current + delta;
    // loop bounds
    if (newPos < 0) newPos += loopWidth;
    if (newPos >= loopWidth) newPos -= loopWidth;
    positionRef.current = newPos;
    track.style.transform = `translateX(-${positionRef.current}px)`;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // ── Touch drag ────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startPosRef.current = positionRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const delta = startXRef.current - e.touches[0].clientX;
    const track = trackRef.current;
    if (!track) return;
    const loopWidth = track.scrollWidth / 3;
    let newPos = startPosRef.current + delta;
    if (newPos < 0) newPos += loopWidth;
    if (newPos >= loopWidth) newPos -= loopWidth;
    positionRef.current = newPos;
    track.style.transform = `translateX(-${positionRef.current}px)`;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const isPremium = (tier: string) => tier === "PREMIUM";

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade izquierda */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #F8F8FA 0%, transparent 100%)" }}
        aria-hidden="true"
      />
      {/* Fade derecha */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, #F8F8FA 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Track — usamos transform en lugar de CSS animation para control manual */}
      <div
        ref={trackRef}
        className="flex gap-4 w-max px-4 will-change-transform"
        aria-label="Sponsors"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {[...sponsors, ...sponsors, ...sponsors].map((s, idx) => {
          const premium = isPremium(s.tier);
          return (
            <div
              key={`${s.id}-${idx}`}
              className={`relative flex-shrink-0 w-[240px] sm:w-[260px] rounded-2xl overflow-hidden select-none ${
                premium
                  ? "border-2 border-[#F8C927]/60 bg-white shadow-lg shadow-[#F8C927]/10"
                  : "border border-gray-200 bg-white shadow-sm"
              }`}
            >
              {/* Barra superior dorada — solo Premium */}
              {premium && (
                <div
                  className="h-1.5 w-full shrink-0"
                  style={{ background: "linear-gradient(90deg, #F5A623, #F8C927, #F5A623)" }}
                />
              )}

              {/* Glow orb — solo Premium */}
              {premium && (
                <div
                  className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(248,201,39,0.13), transparent 70%)" }}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 p-4 flex flex-col gap-3">
                {/* Logo + nombre + badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                      premium
                        ? "border-2 border-[#F8C927]/40 bg-[#FFFBEA]"
                        : "border border-gray-200 bg-gray-50"
                    }`}
                  >
                    {s.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="text-2xl font-black"
                        style={{ color: premium ? "#F8C927" : "#9CA3AF" }}
                      >
                        {s.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-extrabold text-[#0F1120] text-sm truncate leading-tight">
                      {s.name}
                    </span>
                    <span
                      className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-[3px] rounded-md uppercase tracking-wide ${
                        premium
                          ? "bg-[#F8C927] text-[#0F1120]"
                          : "bg-[#5C80BC]/10 text-[#5C80BC]"
                      }`}
                    >
                      {premium ? "★ Premium Partner" : "Sponsor oficial"}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                {s.description && (
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                )}

                {/* Botón llamar */}
                {s.phone && (
                  <a
                    href={`tel:${s.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-bold transition-colors ${
                      premium
                        ? "bg-[#F8C927]/15 text-[#0F1120] hover:bg-[#F8C927]/30"
                        : "bg-[#5C80BC]/10 text-[#5C80BC] hover:bg-[#5C80BC]/20"
                    }`}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Llamar: {s.phone}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}