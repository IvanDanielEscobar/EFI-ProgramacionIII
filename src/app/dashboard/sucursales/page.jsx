import Link from "next/link";
import {
  Store,
  MapPin,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Sucursales | Dashboard Home & Deco",
  description: "Administración de puntos de venta y showrooms físicos de Home & Deco.",
};

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

async function obtenerSucursales() {
  try {
    const res = await fetch(`${API_BASE_URL}/sucursales/`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const lista = Array.isArray(data) ? data : data.results || [];
      if (lista.length > 0) {
        return lista;
      }
    }
  } catch (err) {
    throw new Error(
      `Error de conexión: No se pudo conectar con el servicio remoto de sucursales (${err.message}).`
    );
  }

  // Si no responde o no hay datos, lanzamos el error según lo requerido
  throw new Error(
    "No se encontraron sucursales registradas en el sistema o la API no devolvió datos."
  );
}

export default async function DashboardSucursalesPage() {
  const sucursales = await obtenerSucursales();

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Sucursales
          </h1>
        </div>
      </div>

      {/* Grid de Sucursales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sucursales.map((suc) => (
          <div
            key={suc.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-espresso dark:text-linen">
                  {suc.nombre}
                </h2>
                {suc.direccion && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-camel shrink-0" />
                    <span>{suc.direccion}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-linen/50 dark:bg-muted/40 border border-border space-y-2 text-xs">
              {suc.responsable && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responsable:</span>
                  <span className="font-semibold text-espresso dark:text-linen">
                    {suc.responsable}
                  </span>
                </div>
              )}
              {suc.telefono && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-mono text-espresso dark:text-linen">
                    {suc.telefono}
                  </span>
                </div>
              )}
              {suc.horarios && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Horarios:</span>
                  <span className="text-camel font-semibold">
                    {suc.horarios}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
