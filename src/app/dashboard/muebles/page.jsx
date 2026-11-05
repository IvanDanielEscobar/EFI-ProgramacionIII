"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Armchair,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  Archive,
  RefreshCw,
} from "lucide-react";
import { mueblesService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";

export default function DashboardMueblesPage() {
  const { token } = useAuth();
  const [muebles, setMuebles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [vistaActual, setVistaActual] = useState("activos"); // 'activos' | 'inactivos'
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  // Estado para modal de confirmación de eliminación lógica
  const [muebleAEliminar, setMuebleAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarMuebles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mueblesService.getAll({ limit: 50 });
      setMuebles(data.results || []);
    } catch (err) {
      setError(err.message || "Error al conectar con la API de muebles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    mueblesService
      .getAll({ limit: 50 })
      .then((data) => {
        if (isMounted) {
          setMuebles(data.results || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Error al conectar con la API de muebles.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado según estado activo/inactivo y búsqueda de texto
  const listaFiltrada = useMemo(() => {
    return muebles.filter((m) => {
      const matchEstado =
        vistaActual === "inactivos"
          ? m.activo === false || m.eliminado_logico === true
          : m.activo !== false && !m.eliminado_logico;

      const q = filtroBusqueda.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.nombre?.toLowerCase().includes(q) ||
        m.categoria?.toLowerCase().includes(q) ||
        m.material?.toLowerCase().includes(q) ||
        String(m.id).includes(q);

      return matchEstado && matchSearch;
    });
  }, [muebles, vistaActual, filtroBusqueda]);

  const mueblesActivosCount = muebles.filter(
    (m) => m.activo !== false && !m.eliminado_logico
  ).length;

  const mueblesInactivosCount = muebles.filter(
    (m) => m.activo === false || m.eliminado_logico
  ).length;

  // Ejecutar baja lógica 
  const handleConfirmarEliminar = async () => {
    if (!muebleAEliminar) return;
    setIsDeleting(true);
    try {
      await mueblesService.delete(muebleAEliminar.id, token);
      setSuccessMessage(
        `El mueble "${muebleAEliminar.nombre}" (#${muebleAEliminar.id}) fue dado de baja lógicamente con éxito.`
      );
      // Actualizar estado a inactivo
      setMuebles((prev) =>
        prev.map((m) =>
          m.id === muebleAEliminar.id
            ? { ...m, activo: false, eliminado_logico: true }
            : m
        )
      );
      setMuebleAEliminar(null);
    } catch (err) {
      setError(
        err.message ||
          "No se pudo eliminar el mueble. Verifique permisos de empleado o token."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera y botón Crear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            Inventario
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cargarMuebles}
            disabled={isLoading}
            title="Recargar inventario"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/muebles/editar/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-semibold text-xs tracking-wider uppercase transition-all shadow-xs min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Mueble</span>
          </Link>
        </div>
      </div>

      {/* Alerta de éxito */}
      {successMessage && (
        <Alert
          variant="success"
          title="Operación exitosa"
          action={
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-bold underline"
            >
              Cerrar
            </button>
          }
        >
          {successMessage}
        </Alert>
      )}

      {/* Alerta de error */}
      {error && (
        <Alert
          variant="danger"
          title="Aviso de la API"
          action={
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-bold underline"
            >
              Descartar
            </button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Barra de Filtros y Selector de Pestañas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVistaActual("activos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              vistaActual === "activos"
                ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Activos ({mueblesActivosCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setVistaActual("inactivos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              vistaActual === "inactivos"
                ? "bg-espresso text-linen dark:bg-camel dark:text-espresso shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Inactivos ({mueblesInactivosCount})</span>
          </button>
        </div>

        {/* Buscador en Tabla */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
            placeholder="Buscar por nombre, ambiente, ID..."
            className="w-full bg-card text-foreground rounded-xl border border-border pl-10 pr-4 py-2 text-xs sm:text-sm outline-none focus:border-camel focus:ring-2 focus:ring-camel/30 transition-all min-h-[40px]"
          />
        </div>
      </div>

      {/* Listado / Tabla */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
          <div className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cargando inventario...
          </p>
        </div>
      ) : listaFiltrada.length === 0 ? (
        <div className="p-10 rounded-3xl bg-card border border-border text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            <Armchair className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-espresso dark:text-linen">
            {filtroBusqueda
              ? "No hay resultados para la búsqueda"
              : vistaActual === "inactivos"
              ? "No hay muebles dados de baja"
              : "No hay muebles activos disponibles"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {filtroBusqueda
              ? `No se encontraron coincidencias con "${filtroBusqueda}". Probá con otro término.`
              : vistaActual === "inactivos"
              ? "Todos los muebles del catálogo se encuentran en venta y activos."
              : "Comenzá agregando una pieza con el botón 'Agregar Mueble'."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-linen/60 dark:bg-muted/40 border-b border-border text-espresso dark:text-linen font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Pieza / Mueble</th>
                  <th className="py-3.5 px-4">Ambiente</th>
                  <th className="py-3.5 px-4">Material / Color</th>
                  <th className="py-3.5 px-4 text-right">Precio Contado</th>
                  <th className="py-3.5 px-4 text-center">Stock</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {listaFiltrada.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Foto y Nombre */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-linen dark:bg-espresso/30 border border-border shrink-0">
                          <Image
                            src={m.imagen}
                            alt={m.nombre}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-espresso dark:text-linen block group-hover:text-camel transition-colors">
                            {m.nombre}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            ID: #{m.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-linen dark:bg-muted border border-border text-[11px] font-semibold text-cocoa dark:text-khaki">
                        {m.categoria}
                      </span>
                    </td>

                    {/* Material & Color */}
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      <span className="block font-medium text-foreground">
                        {m.material}
                      </span>
                      {m.color && (
                        <span className="text-[11px] text-muted-foreground">
                          {m.color}
                        </span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="py-3 px-4 text-right font-extrabold text-espresso dark:text-linen font-mono">
                      ${Number(m.precio || 0).toLocaleString("es-AR")}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center">
                      <Badge stock={m.stock} size="sm" />
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/catalogo/${m.id}`}
                          target="_blank"
                          title="Ver en la tienda"
                          className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/dashboard/muebles/editar/${m.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-linen dark:bg-muted text-espresso dark:text-linen hover:bg-espresso hover:text-linen dark:hover:bg-camel dark:hover:text-espresso font-semibold text-xs tracking-wider transition-colors min-h-[36px]"
                        >
                          <Pencil className="w-3.5 h-3.5"/>
                        </Link>

                        {m.activo !== false && !m.eliminado_logico && (
                          <button
                            type="button"
                            onClick={() => setMuebleAEliminar(m)}
                            title="Eliminar"
                            className="p-2 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Baja */}
      <Modal
        isOpen={Boolean(muebleAEliminar)}
        onClose={() => setMuebleAEliminar(null)}
        title="Eliminar este Mueble"
        description="Esta acción quitara el mueble del catálogo."
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMuebleAEliminar(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmarEliminar}
              isLoading={isDeleting}
            >
              Confirmar Baja
            </Button>
          </div>
        }
      >
        {muebleAEliminar && (
          <div className="space-y-3 py-2 text-xs sm:text-sm">
            <p className="text-foreground">
              ¿Estás seguro de que deseás dar de baja la siguiente pieza?
            </p>
            <div className="p-3.5 rounded-xl bg-linen/60 dark:bg-muted/40 border border-border space-y-1">
              <span className="font-bold text-espresso dark:text-linen block">
                {muebleAEliminar.nombre}
              </span>
              <span className="text-muted-foreground block text-xs">
                Ambiente: {muebleAEliminar.categoria} | ID: #{muebleAEliminar.id}
              </span>
              <span className="font-mono text-espresso dark:text-linen text-xs font-semibold block">
                Precio: ${Number(muebleAEliminar.precio || 0).toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
