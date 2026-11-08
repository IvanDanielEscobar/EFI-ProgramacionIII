import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Store,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { sucursalesService } from "@/services/api";
import { Badge } from "@/components/Badge";
import { Alert } from "@/components/Alert";
import { EmptyState } from "@/components/EmptyState";

export const metadata = {
  title: "Sucursales & Showrooms | Home & Deco",
  description:
    "Puntos de atención y showrooms oficiales de Home & Deco. Asesoramiento en diseño de interiores y retiro de compras.",
};

export const dynamic = "force-dynamic";

export default async function SucursalesPage() {
  let sucursales = [];
  let error = null;

  try {
    sucursales = await sucursalesService.getAll();
  } catch (err) {
    error = err.message || "No fue posible conectar con el servidor para obtener las sucursales.";
  }

  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Encabezado */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
      
          <h1 className="text-3xl sm:text-5xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Nuestras Sucursales
          </h1>
          <p className="text-sm sm:text-base text-cocoa/80 dark:text-khaki leading-relaxed">
            Acercate a nuestros locales para experimentar la calidad de nuestros muebles y recibir asesoramiento personalizado.
          </p>
        </header>

        {/* Error si la API falla */}
        {error && (
          <div className="max-w-3xl mx-auto">
            <Alert
              variant="warning"
              title="Aviso de Sucursales"
              action={
                <Link
                  href="/sucursales"
                  className="text-xs font-bold underline hover:opacity-80"
                >
                  Reintentar
                </Link>
              }
            >
              Tuvimos una dificultad al cargar los locales. Por favor, intentá nuevamente en unos instantes.
            </Alert>
          </div>
        )}

        {/* Estado Vacío */}
        {!error && sucursales.length === 0 && (
          <EmptyState
            icon={Store}
            title="No hay sucursales disponibles"
            description="En este momento no se encontraron puntos de atención disponibles. Podés consultarnos por WhatsApp."
            action={
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-espresso text-linen dark:bg-camel dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-cocoa shadow-2xs"
              >
                Volver al Inicio
              </Link>
            }
          />
        )}

        {/* Listado de Sucursales de la Base de Datos */}
        {!error && sucursales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sucursales.map((sucursal) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${sucursal.direccion}, ${sucursal.ciudad || ""}, ${sucursal.provincia || "Córdoba"}`
              )}`;

              const whatsappUrl = `https://wa.me/5491166681012?text=${encodeURIComponent(
                `Hola Home & Deco! Quiero consultar sobre la sede ${sucursal.nombre} (${sucursal.direccion})`
              )}`;

              return (
                <article
                  key={sucursal.id}
                  className="rounded-3xl bg-card border border-border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Imagen */}
                  <div className="relative h-48 w-full bg-linen dark:bg-card">
                    <Image
                      src="/images/showroom.jpg"
                      alt={sucursal.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                    </div>
                  </div>

                  {/* Datos */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-espresso dark:text-linen tracking-tight">
                        {sucursal.nombre}
                      </h2>

                      <div className="space-y-2 text-xs text-cocoa/90 dark:text-khaki">
                        {/* Dirección */}
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                          <span>
                            {sucursal.direccion}
                            {sucursal.ciudad && `, ${sucursal.ciudad}`}
                            {sucursal.provincia && `, ${sucursal.provincia}`}
                          </span>
                        </div>

                        {/* Teléfono */}
                        {sucursal.telefono && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-camel shrink-0" />
                            <a
                              href={`tel:${sucursal.telefono}`}
                              className="hover:text-espresso dark:hover:text-linen hover:underline"
                            >
                              {sucursal.telefono}
                            </a>
                          </div>
                        )}

                        {/* Email */}
                        {sucursal.email && (
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-camel shrink-0" />
                            <a
                              href={`mailto:${sucursal.email}`}
                              className="hover:text-espresso dark:hover:text-linen hover:underline truncate"
                            >
                              {sucursal.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-900" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                        title="Ver ubicación en Google Maps"
                      >
                        <span>Cómo llegar</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
