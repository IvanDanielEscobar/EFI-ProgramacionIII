"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    fullWidth = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = "",
    type = "button",
    ...props
  },
  ref
) {
  // Variantes
  const variants = {
    primary:
      "bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso shadow-xs active:scale-[0.98]",
    secondary:
      "bg-linen hover:bg-khaki/40 text-espresso border border-khaki/60 dark:bg-card dark:hover:bg-muted dark:text-linen dark:border-border active:scale-[0.98]",
    outline:
      "border border-espresso/80 text-espresso hover:bg-espresso hover:text-linen dark:border-camel dark:text-camel dark:hover:bg-camel dark:hover:text-espresso active:scale-[0.98]",
    ghost:
      "text-espresso hover:bg-linen dark:text-linen dark:hover:bg-card/70 active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-xs active:scale-[0.98]",
    whatsapp:
      "bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md active:scale-[0.98]",
  };

  // Tamaños
  const sizes = {
    sm: "px-3.5 py-1.5 text-xs min-h-[38px] rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm min-h-[44px] rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base min-h-[48px] rounded-xl gap-2.5 font-semibold",
    icon: "p-2.5 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center",
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel focus-visible:ring-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{typeof children === "string" ? "Cargando..." : children}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" aria-hidden="true" />}
        </>
      )}
    </button>
  );
});

export default Button;
