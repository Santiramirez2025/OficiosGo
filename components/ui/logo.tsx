import Image from "next/image";

type Props = {
  variant?: "white" | "dark" | "original";
  height?: number;
  className?: string;
};

/**
 * OficiosGo! logo component.
 * - variant="white" → white text, transparent bg (for dark backgrounds) — default
 * - variant="dark" → dark text, transparent bg (for light backgrounds)
 * - variant="original" → white text on black background
 */
export function Logo({ variant = "white", height = 48, className = "" }: Props) {
  const src = variant === "original" ? "/logo.svg" : variant === "dark" ? "/logo-dark.svg" : "/logo-white.svg";

  return (
    <Image
      src={src}
      alt="OficiosGo!"
      width={height}
      height={height}
      className={className}
      style={{ width: "auto", height }}
      priority
    />
  );
}