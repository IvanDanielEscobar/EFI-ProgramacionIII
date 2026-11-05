"use client";

import { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    id,
    name,
    placeholder = "Seleccionar una opción...",
    required = false,
    className = "",
    containerClassName = "",
    disabled = false,
    ...props
  },
  ref
) {
  const selectId = id || name || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-espresso dark:text-linen"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={name}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          className={`w-full bg-card text-foreground rounded-xl border appearance-none transition-all text-sm min-h-[44px] pl-3.5 pr-10 py-2.5 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-400/40"
              : "border-border hover:border-khaki/80 focus:border-camel focus:ring-2 focus:ring-camel/30"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-muted-foreground">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const text = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-card text-foreground py-1">
                {text}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {error ? (
        <p
          id={`${selectId}-error`}
          role="alert"
          className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p
          id={`${selectId}-helper`}
          className="text-xs text-muted-foreground mt-1"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
