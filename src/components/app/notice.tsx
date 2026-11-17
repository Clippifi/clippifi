import { AlertCircle, CheckCircle, Info, Warning } from "@/components/icons";
import { cn } from "@/lib/utils";

// A state banner: tinted fill, filled icon, one or two lines. Never an outlined box
// (DESIGN.md → Notices).
const tones = {
  info: { box: "bg-info-muted text-info", icon: Info },
  success: { box: "bg-success-muted text-success", icon: CheckCircle },
  warning: { box: "bg-warning-muted text-warning", icon: Warning },
  danger: { box: "bg-destructive-muted text-destructive", icon: AlertCircle },
} as const;

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: keyof typeof tones;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { box, icon: Icon } = tones[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-2xl px-4 py-3", box, className)}>
      <Icon className="mt-px size-5 shrink-0" />
      <div className="min-w-0 text-[14px] leading-5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-0.5", "text-foreground/80")}>{children}</div>}
      </div>
    </div>
  );
}
