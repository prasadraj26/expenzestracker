import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "income" | "expense";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const glowBorder =
    variant === "income"
      ? "hover:border-success/50 hover:shadow-success/20"
      : variant === "expense"
        ? "hover:border-destructive/50 hover:shadow-destructive/20"
        : "hover:border-primary/50 hover:shadow-primary/20";

  const iconBg =
    variant === "income"
      ? "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground"
      : variant === "expense"
        ? "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground"
        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground";

  return (
    <div className={`glass-card p-5 group ${glowBorder}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 shadow-sm ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {trend && <p className="mt-2 text-xs font-medium text-muted-foreground">{trend}</p>}
    </div>
  );
}
