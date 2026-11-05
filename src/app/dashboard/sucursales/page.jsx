import Link from "next/link";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Plus,
  ExternalLink,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Sucursales | Dashboard Home & Deco",
  description: "Administración de puntos de venta y showrooms físicos de Home & Deco.",
};

const SUCURSALES_ADMIN = [
  {
    id: "SC-01",
    nombre: "Showroom Central Río Cuarto",
    direccion: "Wenceslao Tejerina Norte 783, Río Cuarto",
    responsable: "Carlos Menéndez (Gerente de Showroom)",
    telefono: "+54 (11) 6668-1012",
    email: "riocuarto@homedeco.com.ar",
    capacidad: "450 m² de exhibición y depósito",
    estado: "OPERATIVO",
    turnosRetiro: "Disponible de Lun a Sáb",
  },
  {
    id: "SC-02",
    nombre: "Punto Logístico Córdoba Cerro",
    direccion: "Av. Rafael Núñez 4210, Córdoba Capital",
    responsable: "Valeria Duarte (Coordinadora Logística)",
    telefono: "+54 (351) 482-9901",
    email: "cordoba@homedeco.com.ar",
    capacidad: "180 m² punto pick-up",
    estado: "OPERATIVO",
    turnosRetiro: "Disponible de Lun a Vie",
  },
];

export default function DashboardSucursalesPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-camel uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Puntos Físicos & Retiro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Gestión de Sucursales
          </h1>
          <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki mt-1">
            Administración de espacios de atención, pick-up points y capacidad logística.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sucursales"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors min-h-[40px]"
          >
            <span>Ver vista pública</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid de Sucursales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SUCURSALES_ADMIN.map((suc) => (
          <div
            key={suc.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-camel uppercase tracking-wider">
                  {suc.id}
                </span>
                <h2 className="text-lg font-bold text-espresso dark:text-linen">
                  {suc.nombre}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-camel shrink-0" />
                  <span>{suc.direccion}</span>
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Activa</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-linen/50 dark:bg-muted/40 border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Responsable:</span>
                <span className="font-semibold text-espresso dark:text-linen">
                  {suc.responsable}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-mono text-espresso dark:text-linen">
                  {suc.telefono}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacidad:</span>
                <span className="text-espresso dark:text-linen font-medium">
                  {suc.capacidad}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Retiros:</span>
                <span className="text-camel font-semibold">
                  {suc.turnosRetiro}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Email: {suc.email}
              </span>
              <Link
                href="/sucursales"
                className="font-bold text-cocoa dark:text-camel hover:underline"
              >
                Información de contacto →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
