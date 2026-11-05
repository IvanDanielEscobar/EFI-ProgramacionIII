// Server Component
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

export function Alert({
  children,
  title,
  variant = "info",
  icon: CustomIcon,
  action,
  className = "",
  ...props
}) {
  const config = {
    info: {
      container:
        "bg-camel/15 border-camel/40 text-espresso dark:bg-card dark:text-linen dark:border-camel/40",
      icon: Info,
      iconColor: "text-camel dark:text-camel",
    },
    success: {
      container:
        "bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    warning: {
      container:
        "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    danger: {
      container:
        "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200",
      icon: XCircle,
      iconColor: "text-red-600 dark:text-red-400",
    },
  };

  const selected = config[variant] || config.info;
  const Icon = CustomIcon || selected.icon;

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-2xs transition-colors ${selected.container} ${className}`}
      {...props}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${selected.iconColor}`} aria-hidden="true" />
      <div className="flex-1 space-y-1 text-sm">
        {title && (
          <h4 className="font-bold tracking-tight text-inherit">
            {title}
          </h4>
        )}
        <div className="text-xs sm:text-sm leading-relaxed opacity-90">
          {children}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default Alert;
