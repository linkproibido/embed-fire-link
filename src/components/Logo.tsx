import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "responsive";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeStyles = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-5xl",
    xl: "text-4xl md:text-7xl",
    responsive: "text-2xl sm:text-3xl md:text-5xl"
  };

  return (
    <div
      className={cn(
        "font-heading font-black tracking-tight leading-none",
        sizeStyles[size],
        "flex items-center",
        className
      )}
      role="img"
      aria-label="Logo Link Proibido"
    >
      <span className="text-primary drop-shadow-glow">Link</span>
      <span className="text-foreground ml-1">Proibido</span>
    </div>
  );
};

export default Logo;
