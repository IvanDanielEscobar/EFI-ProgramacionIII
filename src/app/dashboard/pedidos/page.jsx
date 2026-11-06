"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  User,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { pedidosService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/Alert";

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
          <span>En Preparacion</span>
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
    case "CANCELADO":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Cancelado</span>
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

export default function DashboardPedidosPage() {
  const { token, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getAll(token);
      setPedidos(data);
    } catch (err) {
      setError(
        err.message ||
          "Error al buscar órdenes de compra. Inicie sesión con un usuario con permisos."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    pedidosService
      .getAll(token)
      .then((data) => {
        if (isMounted) {
          setPedidos(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.message ||
              "Error al buscar órdenes de compra. Inicie sesión con un usuario con permisos."
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Gestión de Pedidos
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={cargarPedidos}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Recargar pedidos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {!error && pedidos.length > 0 && (
            <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-card border border-border text-foreground">
              Total: {pedidos.length} {pedidos.length === 1 ? "orden" : "órdenes"}
            </span>
          )}
        </div>
      </div>

      {/* sesión requerida */}
      {!isAuthenticated && (
        <Alert variant="warning" title="Acceso restringido">
          Requiere autenticación. Podés iniciar sesión en{" "}
          <Link href="/login" className="underline font-bold">
            login
          </Link>{" "}
          para sincronizar con tus credenciales.
        </Alert>
      )}

      {/* Manejo de Error o Datos No Disponibles */}
      {error ? (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            Información no disponible
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={cargarPedidos}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linen dark:bg-muted border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
          <div className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cargando órdenes...
          </p>
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
        /* Tabla con Datos del Pedido */
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-linen/60 dark:bg-muted/40 border-b border-border text-espresso dark:text-linen font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Orden #</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Piezas / Detalles</th>
                  <th className="py-3.5 px-4 text-right">Monto Total</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4">Sucursal / Entrega</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pedidos.map((ped) => {
                  const clienteNombre =
                    ped.cliente?.usuario_nombre_completo ||
                    ped.cliente?.usuario_username ||
                    `Cliente #${ped.cliente?.id || ped.id}`;
                  const clienteEmail = ped.cliente?.usuario_email || "";
                  const totalItems = (ped.detalles || []).reduce(
                    (acc, d) => acc + (d.cantidad || 1),
                    0
                  );

                  return (
                    <tr
                      key={ped.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-espresso dark:text-linen">
                        #{ped.numero_pedido || ped.id}
                        {ped.fecha_creacion && (
                          <span className="block text-[10px] text-muted-foreground font-sans">
                            {new Date(ped.fecha_creacion).toLocaleDateString("es-AR")}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-espresso dark:text-linen block">
                          {clienteNombre}
                        </span>
                        {clienteEmail && (
                          <span className="text-[11px] text-muted-foreground">
                            {clienteEmail}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-cocoa/90 dark:text-khaki">
                        <span className="font-medium block">
                          {totalItems} {totalItems === 1 ? "mueble" : "muebles"}
                        </span>
                        {ped.metodo_pago?.nombre && (
                          <span className="text-[11px] text-muted-foreground">
                            {ped.metodo_pago.nombre}
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
                        <span className="block font-medium text-foreground">
                          {ped.sucursal?.nombre || "Casa Central"}
                        </span>
                        <span className="text-[11px]">
                          {ped.direccion_entrega || "Retiro en sucursal"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
