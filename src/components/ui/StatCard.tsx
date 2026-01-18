import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "positive" | "negative" | "primary";
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
  className,
}: StatCardProps) => {
  const variants = {
    default: "bg-card border-border",
    positive: "bg-funds-positive border-success/20",
    negative: "bg-funds-negative border-destructive/20",
    primary: "gradient-primary border-primary/20",
  };

  const iconVariants = {
    default: "bg-secondary text-secondary-foreground",
    positive: "bg-success/20 text-success",
    negative: "bg-destructive/20 text-destructive",
    primary: "bg-primary-foreground/20 text-primary-foreground",
  };

  const textVariants = {
    default: "text-foreground",
    positive: "text-success",
    negative: "text-destructive",
    primary: "text-primary-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "stat-card relative overflow-hidden",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium mb-1",
            variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold font-mono tabular-nums",
            textVariants[variant]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs mt-1",
              variant === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            )}>
              <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          iconVariants[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
