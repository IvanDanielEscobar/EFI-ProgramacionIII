"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  Armchair,
  Check,
  Layers,
  Ruler,
  Weight,
  Palette,
  PackageCheck,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { mueblesService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { Alert } from "@/components/Alert";

export default function MuebleDetalleEmpleadoPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { token } = useAuth();

  const [mueble, setMueble] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal para baja lógica
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarMueble = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mueblesService.getById(id);
      if (!data) {
        setError("No se encontró la información del mueble solicitado.");
      } else {
        setMueble(data);
      }
    } catch (err) {
      setError(
        err.message || "Error al conectar con la API de Home & Deco."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    mueblesService
      .getById(id)
      .then((data) => {
        if (mounted) {
          if (!data) {
            setError("No se encontró la información del mueble solicitado.");
          } else {
            setMueble(data);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(
            err.message || "Error al conectar con la API de Home & Deco."
          );
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleConfirmarBaja = async () => {
    if (!mueble) return;
    setIsDeleting(true);
    try {
      await mueblesService.delete(mueble.id, token);
      setSuccessMessage(
        `El mueble "${mueble.nombre}" (#${mueble.id}) fue dado de baja lógicamente con éxito.`
      );
      setMueble((prev) => ({
        ...prev,
        activo: false,
        eliminado_logico: true,
      }));
      setShowDeleteModal(false);
    } catch (err) {
      setError(
        err.message || "No se pudo completar la baja. Compruebe credenciales."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/muebles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inventario</span>
          </Link>
        </div>
        <div className="p-16 text-center rounded-3xl bg-card border border-border space-y-3">
          <div className="w-9 h-9 border-3 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">
            Cargando ficha técnica del mueble...
          </p>
        </div>
      </div>
    );
  }

  if (error || !mueble) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/muebles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inventario</span>
          </Link>
        </div>
        <Alert
          variant="danger"
          title="Ficha no disponible"
          action={
            <button
              type="button"
              onClick={cargarMueble}
              className="text-xs font-bold underline cursor-pointer"
            >
              Reintentar
            </button>
          }
        >
          {error || "El mueble indicado no existe o fue eliminado."}
        </Alert>
      </div>
    );
  }

  const esInactivo = mueble.activo === false || mueble.eliminado_logico;

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Alerta de éxito */}
      {successMessage && (
        <Alert
          variant="success"
          title="Operación completada"
          action={
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-bold underline cursor-pointer"
            >
              Cerrar
            </button>
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* Breadcrumb y Controles Superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap"
          >
            <Link
              href="/dashboard"
              className="hover:text-espresso dark:hover:text-linen transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/dashboard/muebles"
              className="hover:text-espresso dark:hover:text-linen transition-colors"
            >
              Inventario
            </Link>
            <span>/</span>
            <span className="text-espresso dark:text-linen font-semibold">
              Ficha #{mueble.id}
            </span>
          </nav>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
              {mueble.nombre}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                esInactivo
                  ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40"
                  : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40"
              }`}
            >
              {esInactivo ? "Baja Lógica / Inactivo" : "Activo en Catálogo"}
            </span>
          </div>
        </div>

        {/* Botones de acción operativos */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/muebles/editar/${mueble.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso text-xs font-semibold tracking-wider uppercase transition-all shadow-xs min-h-[40px]"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar Mueble</span>
          </Link>

          <Link
            href={`/catalogo/${mueble.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors min-h-[40px]"
            title="Abrir vista pública del cliente en nueva pestaña"
          >
            <span>Ver en Tienda</span>
            <ExternalLink className="w-3.5 h-3.5 text-camel" />
          </Link>

          {!esInactivo && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors min-h-[40px] cursor-pointer"
              title="Dar de baja este mueble"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={cargarMueble}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors min-h-[40px] cursor-pointer"
            title="Recargar datos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Principal de Datos del Mueble */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Fotografía e Identificadores*/}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-linen dark:bg-card border border-border shadow-md">
            <Image
              src={mueble.imagen}
              alt={mueble.nombre}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge stock={mueble.stock} size="sm" />
              {mueble.material && <Badge madera={mueble.material} size="sm" />}
            </div>
          </div>

          {/* Tarjeta de Metadatos: Nombres y Clasificación */}
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-3 text-xs shadow-2xs">
            <span className="font-bold text-espresso dark:text-linen block uppercase tracking-wider text-[11px]">
              Metadatos y Clasificación
            </span>
            <div className="grid grid-cols-2 gap-3 text-muted-foreground">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Ambiente
                </span>
                <span className="font-bold text-espresso dark:text-linen block mt-0.5 text-xs sm:text-sm">
                  {mueble.categoria || "Living & Sala"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Madera / Material
                </span>
                <span className="font-bold text-espresso dark:text-linen block mt-0.5 text-xs sm:text-sm">
                  {mueble.material || "Madera Noble"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Tono / Acabado
                </span>
                <span className="font-bold text-espresso dark:text-linen block mt-0.5 text-xs sm:text-sm">
                  {mueble.color || "Madera Natural"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                  Estado Comercial
                </span>
                <span
                  className={`font-bold block mt-0.5 text-xs sm:text-sm ${
                    esInactivo
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {esInactivo ? "Baja Lógica / Inactivo" : "Activo en Tienda"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjetas Operativas, Stock, Precios y Medidas (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tarjetas de Métricas Comerciales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Precio Contado
              </span>
              <div className="text-2xl font-extrabold text-espresso dark:text-linen font-mono">
                ${Number(mueble.precio || 0).toLocaleString("es-AR")}
              </div>
              <span className="text-[10px] text-muted-foreground block">
                Precio unitario de lista
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Stock Físico
              </span>
              <div className="text-2xl font-extrabold text-espresso dark:text-linen font-mono">
                {mueble.stock} un.
              </div>
              <span
                className={`text-[10px] font-semibold block ${
                  mueble.stock > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                }`}
              >
                {mueble.stock > 0 ? "Disponible en depósito" : "Sin existencias"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Financiación
              </span>
              <div className="text-2xl font-extrabold text-camel font-mono">
                ${Math.round((mueble.precio || 0) / 6).toLocaleString("es-AR")}
              </div>
              <span className="text-[10px] text-muted-foreground block">
                6 cuotas sin interés
              </span>
            </div>
          </div>

          {/* Ficha Técnica: Dimensiones y Materiales */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-espresso dark:text-linen uppercase tracking-wider flex items-center gap-2">
                <Ruler className="w-4 h-4 text-camel" />
                <span>Medidas y Propiedades Físicas</span>
              </h3>
              <span className="text-xs text-muted-foreground">Unidades en cm / kg</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/30 border border-border">
                <span className="text-muted-foreground block text-[11px]">Alto</span>
                <span className="font-bold text-espresso dark:text-linen text-sm">
                  {mueble.alto ? `${mueble.alto} cm` : "—"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/30 border border-border">
                <span className="text-muted-foreground block text-[11px]">Ancho</span>
                <span className="font-bold text-espresso dark:text-linen text-sm">
                  {mueble.ancho ? `${mueble.ancho} cm` : "—"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/30 border border-border">
                <span className="text-muted-foreground block text-[11px]">Profundidad</span>
                <span className="font-bold text-espresso dark:text-linen text-sm">
                  {mueble.profundidad ? `${mueble.profundidad} cm` : "—"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-linen/50 dark:bg-muted/30 border border-border">
                <span className="text-muted-foreground block text-[11px]">Peso Aprox.</span>
                <span className="font-bold text-espresso dark:text-linen text-sm">
                  {mueble.peso ? `${mueble.peso} kg` : "—"}
                </span>
              </div>
            </div>

            {/* Datos Logísticos y Garantía */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                  Volumen Estimado
                </span>
                <span className="font-bold text-foreground text-xs mt-0.5 block">
                  {mueble.alto && mueble.ancho && mueble.profundidad
                    ? `${((Number(mueble.alto) * Number(mueble.ancho) * Number(mueble.profundidad)) / 1000000).toFixed(2)} m³`
                    : "Estándar"}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                  Garantía de Fábrica
                </span>
                <span className="font-bold text-foreground text-xs mt-0.5 block">
                  5 Años
                </span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card">
                <span className="text-muted-foreground block text-[10px] uppercase font-mono">
                  Logística
                </span>
                <span className="font-bold text-foreground text-xs mt-0.5 block">
                  {mueble.color || "Madera Natural"}
                  Retiro o Envío Nacional
                </span>
              </div>
            </div>
          </div>

          {/* Descripción Técnica */}
          <div className="p-5 rounded-3xl bg-card border border-border space-y-2 shadow-2xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-espresso dark:text-linen">
              Descripción de la Pieza
            </h3>
            <p className="text-xs sm:text-sm text-cocoa/90 dark:text-khaki leading-relaxed whitespace-pre-line">
              {mueble.descripcion || "Esta pieza no tiene descripción registrada."}
            </p>
          </div>

          {/* Acciones de Navegación Rápida */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/dashboard/muebles"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la tabla de inventario</span>
            </Link>

            <Link
              href={`/dashboard/muebles/editar/${mueble.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-camel hover:underline"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Modificar stock o precio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de baja lógica */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Dar de baja mueble"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              Estás por dar de baja lógica a <strong>{mueble.nombre}</strong> (#{mueble.id}). Dejará de mostrarse en la tienda web pero conservará el historial operativo en el sistema.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmarBaja}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isDeleting ? "Procesando..." : "Confirmar Baja"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
