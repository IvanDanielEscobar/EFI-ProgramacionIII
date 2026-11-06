"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Armchair, Store, AlertTriangle } from "lucide-react";
import { pedidosService } from "@/services/api";

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(valor) || 0);

const formatearFecha = (iso) =>
  iso
    ? new Intl.DateTimeFormat("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso))
    : "";

// Adapta la respuesta de GET /api/pedidos/:id/ a lo que usa la vista
function normalizarPedido(data) {
  return {
    id: data.id,
    numero: data.numero_pedido || data.id,
    fecha: data.fecha_creacion,
    estado: data.estado_display || data.estado,
    sucursal: data.sucursal?.nombre ?? data.sucursal_nombre ?? "Casa Central",
    items: (data.detalles ?? []).map((d) => ({
      id: d.id,
      nombre: d.mueble?.nombre ?? d.mueble_nombre ?? "Mueble",
      cantidad: d.cantidad,
      precioUnitario: d.precio_unitario,
      subtotal: d.subtotal,
    })),
    total: data.total,
  };
}

function MensajeEstado({ titulo, detalle }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border space-y-3 max-w-lg">
      <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <span>{titulo}</span>
      </h2>
      <p className="text-sm text-muted-foreground">{detalle}</p>
      <Link
        href="/dashboard/pedidos"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa dark:text-camel hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al listado</span>
      </Link>
    </div>
  );
}

export default function PedidoDetallePage({ params }) {
  const { id } = use(params);
  const { token, isLoading: authLoading } = useAuth();

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);

  useEffect(() => {
    if (authLoading || !token) return;

    const controller = new AbortController();

    async function cargarPedido() {
      try {
        const data = await pedidosService.getById(id, token);
        setPedido(normalizarPedido(data));
      } catch (err) {
        if (err.status === 404) {
          setNoEncontrado(true);
          return;
        }
        if (err.name !== "AbortError") {
          setError(err.message || "Error al conectar con el servidor.");
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    cargarPedido();
    return () => controller.abort();
  }, [id, token, authLoading]);

  // not-found.jsx
  if (noEncontrado) notFound();

  if (authLoading || (token && cargando)) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[40vh]">
        <div className="w-12 h-12 rounded-2xl bg-camel/15 text-cocoa dark:text-camel flex items-center justify-center animate-pulse">
          <Armchair className="w-6 h-6" />
        </div>
        <p className="text-sm text-muted-foreground">Cargando pedido...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <MensajeEstado
        titulo="Necesitás iniciar sesión"
        detalle="Iniciá sesión para consultar el detalle de esta orden."
      />
    );
  }

  if (error) {
    return <MensajeEstado titulo="No pudimos cargar el pedido" detalle={error} />;
  }

  if (!pedido) return null;

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="space-y-2">
        <Link
          href="/dashboard/pedidos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al listado</span>
        </Link>
        <span className="block text-xs font-bold text-camel uppercase tracking-wider">
          Detalle de la orden
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Pedido #{pedido.numero ?? pedido.id}
        </h1>
        <p className="text-xs text-muted-foreground">
          {formatearFecha(pedido.fecha)}
          {pedido.estado && (
            <>
              {" · "}
              <span className="font-semibold">{pedido.estado}</span>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artículos */}
        <section className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border space-y-4">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Armchair className="w-5 h-5 text-camel" />
            <span>Artículos comprados</span>
          </h2>

          {pedido.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Este pedido no tiene artículos.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {pedido.items.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.cantidad} × {formatearPrecio(item.precioUnitario)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0">
                    {formatearPrecio(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sucursal y total */}
        <aside className="space-y-6">
          <section className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Store className="w-5 h-5 text-camel" />
              <span>Sucursal de retiro</span>
            </h2>
            <p className="text-sm font-semibold text-foreground">
              {pedido.sucursal}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Total
            </span>
            <div className="text-3xl font-bold text-foreground">
              {formatearPrecio(pedido.total)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}