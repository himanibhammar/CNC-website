import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "editorial" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
  className?: string;
  showArrow?: boolean;
  external?: boolean;
}

export function Button({
  href,
  onClick,
  children,
  variant = "editorial",
  size = "md",
  className,
  showArrow = true,
  external = false,
}: ButtonProps) {
  const baseStyles =
    "group inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 select-none cursor-pointer";

  const variants = {
    editorial:
      "text-neutral-300 hover:text-white border border-white/15 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-sm",
    ghost:
      "text-neutral-400 hover:text-white border border-transparent hover:border-white/20 bg-transparent",
    solid:
      "text-black bg-white hover:bg-neutral-200 border border-white font-medium",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-[11px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-7 py-3 text-xs tracking-[0.2em]",
  };

  const combinedClass = clsx(baseStyles, variants[variant], sizes[size], className);

  const innerContent = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight
          className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClass}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClass}>
      {innerContent}
    </button>
  );
}
