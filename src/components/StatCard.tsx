import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "income" | "expense";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const iconBg =
    variant === "income"
      ? "bg-success/10 text-success"
      : variant === "expense"
        ? "bg-destructive/10 text-destructive"
        : "bg-primary/10 text-primary";

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}
