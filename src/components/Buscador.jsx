"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";

function BuscadorInterno({
  className = "",
  placeholder = "Buscar por nombre, madera o color...",
  clearOtherFilters = false,
  onSearch: onSearchCallback,
  ...props
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (termino) => {
    const params = clearOtherFilters
      ? new URLSearchParams()
      : new URLSearchParams(searchParams ? searchParams.toString() : "");

    if (termino && termino.trim()) {
      params.set("search", termino.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? `/catalogo?${query}` : "/catalogo");
    onSearchCallback?.(termino);
  };

  const defaultValue = searchParams?.get("search") || "";

  return (
    <div className={`w-full ${className}`}>
      <SearchBar
        key={defaultValue}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onSearch={handleSearch}
        {...props}
      />
    </div>
  );
}

export function Buscador(props) {
  return (
    <Suspense
      fallback={
        <div className={`w-full ${props.className || ""}`}>
          <SearchBar placeholder={props.placeholder || "Buscar muebles..."} />
        </div>
      }
    >
      <BuscadorInterno {...props} />
    </Suspense>
  );
}

export const BuscadorCatalogo = Buscador;
export default Buscador;
