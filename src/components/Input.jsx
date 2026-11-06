"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = "text",
    id,
    name,
    required = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = "",
    containerClassName = "",
    disabled = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-espresso dark:text-linen"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
            <LeftIcon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full bg-card text-foreground rounded-xl border transition-all text-sm min-h-[44px] px-3.5 py-2.5 outline-none placeholder:text-muted-foreground/70 disabled:opacity-50 disabled:cursor-not-allowed ${
            LeftIcon ? "pl-10" : ""
          } ${isPassword || RightIcon ? "pr-10" : ""} ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-400/40"
              : "border-border hover:border-khaki/80 focus:border-camel focus:ring-2 focus:ring-camel/30"
          } ${className}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            className="absolute right-3.5 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : RightIcon ? (
          <div className="absolute right-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
            <RightIcon className="w-4 h-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p
          id={`${inputId}-helper`}
          className="text-xs text-muted-foreground mt-1"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
