import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Eye,
  Filter,
  ArrowUpRight,
} from "lucide-react";

export const metadata = {
  title: "Gestión de Pedidos | Dashboard Home & Deco",
  description: "Control de órdenes de compra, pagos y estado logístico de envíos.",
};

const PEDIDOS_MOCK = [
  {
    id: "PED-1042",
    cliente: "Martina Rossi",
    email: "martina.rossi@gmail.com",
    fecha: "04 Nov 2026, 18:30",
    items: "Sofá Extensible 3c Beyond (x1)",
    total: 385000,
    metodo: "Transferencia Bancaria",
    estado: "PAGADO",
    entrega: "Retiro en Showroom Río Cuarto",
  },
  {
    id: "PED-1041",
    cliente: "Lucas Benítez",
    email: "lbenitez@outlook.com",
    fecha: "04 Nov 2026, 14:15",
    items: "Silla Vivire S01 Paraíso (x4)",
    total: 312000,
    metodo: "6 Cuotas Sin Interés",
    estado: "EN_PREPARACION",
    entrega: "Flete a Córdoba Capital",
  },
  {
    id: "PED-1040",
    cliente: "Sofía Gómez",
    email: "sofi.gomez@yahoo.com.ar",
    fecha: "03 Nov 2026, 21:05",
    items: "Mesa Comedor Extensible C01 (x1)",
    total: 460000,
    metodo: "6 Cuotas Sin Interés",
    estado: "ENVIADO",
    entrega: "Envío Nacional a Rosario",
  },
  {
    id: "PED-1039",
    cliente: "Esteban Morales",
    email: "esteban.m@empresa.com",
    fecha: "03 Nov 2026, 11:40",
    items: "Escritorio Elevable Altura Pro (x2)",
    total: 590000,
    metodo: "Transferencia Factura A",
    estado: "ENTREGADO",
    entrega: "Retiro en Showroom Río Cuarto",
  },
  {
    id: "PED-1038",
    cliente: "Camila Fernández",
    email: "camila.f@gmail.com",
    fecha: "02 Nov 2026, 16:50",
    items: "Respaldo Cama Nube Entelado (x1)",
    total: 165000,
    metodo: "Tarjeta de Débito",
    estado: "ENTREGADO",
    entrega: "Flete Local Río Cuarto",
  },
];

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
          <span>{estado}</span>
        </span>
      );
  }
}

export default function DashboardPedidosPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-camel uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Ventas & Despachos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Gestión de Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki mt-1">
            Seguimiento de órdenes de compra, cobranzas y coordinación logística.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground">
            Total activos: {PEDIDOS_MOCK.length} órdenes
          </span>
        </div>
      </div>

      {/* Tabla de Pedidos */}
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
                <th className="py-3.5 px-4">Modalidad de Entrega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {PEDIDOS_MOCK.map((ped) => (
                <tr
                  key={ped.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-espresso dark:text-linen">
                    {ped.id}
                    <span className="block text-[10px] text-muted-foreground font-sans">
                      {ped.fecha}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-espresso dark:text-linen block">
                      {ped.cliente}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {ped.email}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-cocoa/90 dark:text-khaki">
                    <span className="font-medium">{ped.items}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {ped.metodo}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-extrabold text-espresso dark:text-linen font-mono">
                    ${Number(ped.total).toLocaleString("es-AR")}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <BadgeEstado estado={ped.estado} />
                  </td>

                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {ped.entrega}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
