"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  placeholder = "Buscar muebles, maderas o ambientes...",
  onSearch,
  onChange,
  value: controlledValue,
  defaultValue = "",
  className = "",
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const searchTerm = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange?.("");
    onSearch?.("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full ${className}`}
      {...props}
    >
      <div className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>

      <input
        type="text"
        inputMode="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar en catálogo"
        className="w-full bg-card text-foreground rounded-xl border border-border pl-10 pr-10 py-2.5 text-sm min-h-[44px] transition-all outline-none placeholder:text-muted-foreground/70 hover:border-khaki/80 focus:border-camel focus:ring-2 focus:ring-camel/30 shadow-2xs [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}

export default SearchBar;
