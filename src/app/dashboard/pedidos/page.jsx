import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  User,
  Clock,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Pedidos | Dashboard Home & Deco",
  description: "Control de órdenes de compra, pagos y estado logístico de envíos.",
};

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

async function obtenerPedidos() {
  try {
    const res = await fetch(`${API_BASE_URL}/pedidos/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        pedidos: [],
        error: `El servidor devolvió un error (${res.status}) al consultar pedidos.`,
      };
    }

    const data = await res.json();
    const lista = Array.isArray(data) ? data : data.results || [];
    return { pedidos: lista, error: null };
  } catch {
    return {
      pedidos: [],
      error: "No fue posible conectar con el servicio remoto de órdenes de compra.",
    };
  }
}

function BadgeEstado({ estado }) {
  switch (estado) {
    case "PAGADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Pagado</span>
        </span>
      );
    case "EN_PREPARACION":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>En taller</span>
        </span>
      );
    case "ENVIADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
          <Truck className="w-3 h-3" />
          <span>En camino</span>
        </span>
      );
    case "ENTREGADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-linen dark:bg-muted text-cocoa dark:text-khaki">
          <CheckCircle2 className="w-3 h-3 text-camel" />
          <span>Entregado</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground">
          <span>{estado || "Pendiente"}</span>
        </span>
      );
  }
}

export default async function DashboardPedidosPage() {
  const { pedidos, error } = await obtenerPedidos();

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Gestión de Pedidos
          </h1>
        </div>

        {!error && pedidos.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground">
              Total activos: {pedidos.length} órdenes
            </span>
          </div>
        )}
      </div>

      {/* Manejo de Error o Datos No Disponibles */}
      {error ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            Información de pedidos no disponible
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/pedidos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linen dark:bg-muted border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Reintentar
            </Link>
          </div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            No hay pedidos registrados
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Actualmente no hay órdenes de compra registradas en el sistema.
          </p>
        </div>
      ) : (
        /* Tabla con Columna Extra: Datos del Cliente */
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-linen/60 dark:bg-muted/40 border-b border-border text-espresso dark:text-linen font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Orden #</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Piezas Compradas</th>
                  <th className="py-3.5 px-4 text-right">Monto Total</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4">Entrega</th>
                  <th className="py-3.5 px-4 text-center">Datos del Cliente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pedidos.map((ped) => (
                  <tr
                    key={ped.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-espresso dark:text-linen">
                      #{ped.id}
                      {ped.fecha && (
                        <span className="block text-[10px] text-muted-foreground font-sans">
                          {ped.fecha}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-espresso dark:text-linen block">
                        {ped.cliente_nombre || ped.cliente || "Cliente"}
                      </span>
                      {ped.email && (
                        <span className="text-[11px] text-muted-foreground">
                          {ped.email}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-cocoa/90 dark:text-khaki">
                      <span className="font-medium">
                        {ped.items_resumen || ped.items?.length
                          ? `${ped.items.length} piezas`
                          : "Detalle de muebles"}
                      </span>
                      {ped.metodo_pago && (
                        <span className="block text-[11px] text-muted-foreground">
                          {ped.metodo_pago}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-espresso dark:text-linen font-mono">
                      ${Number(ped.total || 0).toLocaleString("es-AR")}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <BadgeEstado estado={ped.estado} />
                    </td>

                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {ped.direccion_envio || ped.entrega || "A coordinar"}
                    </td>

                    {/* Columna nueva: Botón para ver los datos del cliente */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        title={`Ver ficha del cliente ${ped.cliente_nombre || ped.cliente || ""}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-linen/50 dark:bg-muted/50 text-xs font-semibold text-cocoa dark:text-khaki hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Ver Cliente</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
