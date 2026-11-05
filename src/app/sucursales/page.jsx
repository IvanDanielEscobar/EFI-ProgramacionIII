import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Store,
  Navigation,
  CheckCircle2,
  Calendar,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Sucursales & Showrooms | Home & Deco",
  description:
    "Visitanos en nuestro Showroom principal de Río Cuarto o en nuestro punto de entrega Córdoba Capital. Asesoramiento en diseño de interiores y retiro inmediato.",
};

const SUCURSALES = [
  {
    id: "rio-cuarto",
    nombre: "Showroom Central Río Cuarto",
    tipo: "Showroom & Venta al Público",
    direccion: "Wenceslao Tejerina Norte 783",
    localidad: "Río Cuarto, Córdoba",
    codigoPostal: "X5800",
    telefono: "+54 (11) 6668-1012",
    whatsapp: "+54 9 11 6668-1012",
    email: "riocuarto@homedeco.com.ar",
    horarios: [
      { dias: "Lunes a Viernes", horas: "9:00 a 13:00 hs y 16:30 a 20:30 hs" },
      { dias: "Sábados", horas: "9:30 a 13:30 hs" },
      { dias: "Domingos y Feriados", horas: "Cerrado" },
    ],
    servicios: [
      "Exhibición completa de Living, Comedores y Dormitorios",
      "Asesoramiento personalizado con diseñadores de interiores",
      "Muestrarios de maderas nobles y tapizados al tacto",
      "Punto de retiro gratis de compras online",
      "Estacionamiento exclusivo para clientes",
    ],
    imagen: "/images/showroom.jpg",
    destacada: true,
  },
  {
    id: "cordoba-capital",
    nombre: "Punto Logístico & Pick-Up Córdoba",
    tipo: "Punto de Retiro & Asesoramiento Comercial",
    direccion: "Av. Rafael Núñez 4210, Cerro de las Rosas",
    localidad: "Córdoba Capital",
    codigoPostal: "X5009",
    telefono: "+54 (351) 482-9901",
    whatsapp: "+54 9 11 6668-1012",
    email: "cordoba@homedeco.com.ar",
    horarios: [
      { dias: "Lunes a Viernes", horas: "10:00 a 18:00 hs (corrido)" },
      { dias: "Sábados", horas: "10:00 a 14:00 hs" },
    ],
    servicios: [
      "Retiro express de muebles embalados",
      "Catálogo físico de tapizados y acabados",
      "Coordinación de fletes y logística interprovincial",
    ],
    imagen: "/images/cat-living.jpg",
    destacada: false,
  },
];

export default function SucursalesPage() {
  return (
    <div className="w-full bg-background min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Encabezado */}
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-camel/15 text-camel text-xs font-bold uppercase tracking-widest border border-camel/20">
            <Store className="w-4 h-4" />
            <span>Espacios de Experiencia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Nuestras Sucursales & Showrooms
          </h1>
          <p className="text-sm sm:text-base text-cocoa/80 dark:text-khaki leading-relaxed">
            Vení a experimentar la nobleza de nuestras maderas, sentarte en
            nuestros sillones y conversar con nuestros asesores de diseño para
            armar tu hogar soñado.
          </p>
        </header>

        {/* Listado de Sucursales */}
        <div className="space-y-10">
          {SUCURSALES.map((sucursal) => (
            <article
              key={sucursal.id}
              className={`rounded-3xl bg-card border overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 ${
                sucursal.destacada
                  ? "border-camel/60 shadow-md ring-1 ring-camel/30"
                  : "border-border"
              }`}
            >
              {/* Imagen del Showroom */}
              <div className="relative lg:col-span-5 min-h-[260px] lg:min-h-full bg-linen dark:bg-espresso/20">
                <Image
                  src={sucursal.imagen}
                  alt={sucursal.nombre}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-card/90 backdrop-blur-md border border-border text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen px-3 py-1.5 rounded-lg">
                  {sucursal.tipo}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
                      {sucursal.nombre}
                    </h2>
                    <p className="flex items-center gap-2 text-sm text-camel font-medium mt-1">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {sucursal.direccion}, {sucursal.localidad} (CP: {sucursal.codigoPostal})
                      </span>
                    </p>
                  </div>

                  {/* Horarios */}
                  <div className="p-4 rounded-2xl bg-linen/50 dark:bg-muted/40 border border-border space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-camel" />
                      <span>Horarios de Atención</span>
                    </span>
                    <ul className="space-y-1 text-xs">
                      {sucursal.horarios.map((h, i) => (
                        <li key={i} className="flex justify-between text-muted-foreground">
                          <span className="font-medium text-espresso dark:text-linen">
                            {h.dias}:
                          </span>
                          <span>{h.horas}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Servicios ofrecidos */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                      Servicios en este espacio:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sucursal.servicios.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-cocoa/90 dark:text-khaki">
                          <CheckCircle2 className="w-4 h-4 text-camel shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Contacto y Botones */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                      <strong>Teléfono:</strong> {sucursal.telefono}
                    </p>
                    <p>
                      <strong>Email:</strong> {sucursal.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a
                      href={`https://wa.me/${sucursal.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hola Home & Deco! Quiero coordinar una visita al showroom de ${sucursal.nombre}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso text-xs font-semibold uppercase tracking-wider transition-all min-h-[42px] shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Escribinos</span>
                    </a>

                    <Link
                      href="/catalogo"
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors min-h-[42px]"
                    >
                      Ver Catálogo
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
