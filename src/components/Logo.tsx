import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeStyles = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
    xl: "text-7xl"
  };

  return (
    <div className={cn(
      "font-heading font-black tracking-tight",
      sizeStyles[size],
      className
    )}>
      <span className="text-primary drop-shadow-glow">Link</span>
      <span className="text-foreground ml-1">Proibido</span>
    </div>
  );
};

export default Logo;