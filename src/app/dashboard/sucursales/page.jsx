import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import { sucursalesService } from "@/services/api";
import { Alert } from "@/components/Alert";

export const metadata = {
  title: "Gestión de Sucursales | Dashboard Home & Deco",
  description: "Administración de puntos de venta y showrooms físicos de Home & Deco.",
};

export const dynamic = "force-dynamic";

export default async function DashboardSucursalesPage() {
  let sucursales = [];
  let error = null;

  try {
    sucursales = await sucursalesService.getAll();
  } catch (err) {
    error = err.message || "Error al conectar con la API de sucursales.";
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Sucursales
          </h1>
        </div>

        {!error && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground">
            {sucursales.length} {sucursales.length === 1 ? "sede activa" : "sedes activas"}
          </span>
        )}
      </div>

      {error ? (
        <Alert variant="warning" title="Aviso del Servidor">
          {error}
        </Alert>
      ) : sucursales.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <Building2 className="w-8 h-8 mx-auto text-muted-foreground" />
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            No hay sucursales registradas
          </h2>
          <p className="text-xs text-muted-foreground">
            No se encontraron puntos de atención en la base de datos.
          </p>
        </div>
      ) : (
        /* Grid de Sucursales */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sucursales.map((suc) => (
            <div
              key={suc.id}
              className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-espresso dark:text-linen">
                      {suc.nombre}
                    </h2>
                  </div>
                  {suc.direccion && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-camel shrink-0" />
                      <span>
                        {suc.direccion}
                        {suc.ciudad ? ` (${suc.ciudad})` : ""}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-linen/50 dark:bg-muted/40 border border-border space-y-2 text-xs">
                {suc.provincia && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Provincia:</span>
                    <span className="font-semibold text-espresso dark:text-linen">
                      {suc.provincia}
                    </span>
                  </div>
                )}
                {suc.telefono && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3 text-camel" />
                      Teléfono:
                    </span>
                    <span className="font-mono text-espresso dark:text-linen">
                      {suc.telefono}
                    </span>
                  </div>
                )}
                {suc.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3 text-camel" />
                      Email:
                    </span>
                    <span className="text-camel font-medium">
                      {suc.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
