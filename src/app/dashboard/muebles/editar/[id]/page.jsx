"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from "lucide-react";
import {
  mueblesService,
  categoriasService,
  materialesService,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";

export default function EditarMueblePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const esNuevo = id === "nuevo";
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    material: "",
    precio: "",
    stock: "",
    color: "",
    alto: "80",
    ancho: "120",
    profundidad: "60",
    peso: "15",
    descripcion: "",
    caracteristica_id: null,
  });

  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Carga de datos desde la API
  useEffect(() => {
    let mounted = true;

    async function cargarDatos() {
      setIsLoading(true);
      setError(null);
      try {
        const [catsData, matsData] = await Promise.all([
          categoriasService.getAll().catch(() => []),
          materialesService.getAll().catch(() => []),
        ]);

        if (!mounted) return;
        setCategorias(catsData);
        setMateriales(matsData);

        if (!esNuevo) {
          const mueble = await mueblesService.getById(id);
          if (!mounted) return;

          setFormData({
            nombre: mueble.nombre || "",
            categoria: String(mueble.categoria_id || catsData[0]?.id || "1"),
            material: String(mueble.material_id || matsData[0]?.id || "1"),
            precio: String(mueble.precio || ""),
            stock: String(mueble.stock ?? "0"),
            color: mueble.color || "",
            alto: String(mueble.alto || "80"),
            ancho: String(mueble.ancho || "120"),
            profundidad: String(mueble.profundidad || "60"),
            peso: String(mueble.peso || "15"),
            descripcion: mueble.descripcion || "",
            caracteristica_id: mueble.caracteristica_id,
          });
        } else {
          // Pre-seleccionar la primera categoría y material disponibles
          setFormData((prev) => ({
            ...prev,
            categoria: catsData[0]?.id ? String(catsData[0].id) : "1",
            material: matsData[0]?.id ? String(matsData[0].id) : "1",
          }));
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Error al conectar con la API de Home & Deco.");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    cargarDatos();

    return () => {
      mounted = false;
    };
  }, [id, esNuevo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    // Validaciones de campos obligatorios
    if (!formData.nombre.trim()) {
      setError("El nombre de la pieza es obligatorio.");
      setIsSaving(false);
      return;
    }
    if (!formData.categoria) {
      setError("Debe seleccionar un ambiente o categoría.");
      setIsSaving(false);
      return;
    }
    if (!formData.material) {
      setError("Debe seleccionar un material principal.");
      setIsSaving(false);
      return;
    }
    if (!formData.precio || Number(formData.precio) <= 0) {
      setError("El precio debe ser un número positivo.");
      setIsSaving(false);
      return;
    }

    try {
      if (esNuevo) {
        await mueblesService.create(formData, token);
        setSuccess("¡Mueble creado con éxito en la API!");
      } else {
        await mueblesService.update(id, formData, token);
        setSuccess("¡Datos actualizados con éxito en la API!");
      }

      // Redirigir al listado tras 1.2 segundos
      setTimeout(() => {
        router.push("/dashboard/muebles");
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Error al guardar los cambios. Verifique que cuenta con token de autenticación válido."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const opcionesCategoria = categorias.map((cat) => ({
    value: String(cat.id),
    label: cat.nombre,
  }));

  const opcionesMaterial = materiales.map((mat) => ({
    value: String(mat.id),
    label: mat.nombre,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl py-12 text-center">
        <div className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs sm:text-sm text-muted-foreground">
          Cargando ficha del mueble...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Botón Volver */}
      <div>
        <Link
          href="/dashboard/muebles"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cocoa dark:text-camel hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inventario</span>
        </Link>
      </div>

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-camel uppercase tracking-wider block">
            {esNuevo ? "Alta de Producto" : `Edición Mueble #${id}`}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
            {esNuevo ? "Crear Nueva Pieza" : formData.nombre}
          </h1>
          <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki mt-1">
            Los datos se sincronizan directamente con el backend Django REST Framework.
          </p>
        </div>

        {!esNuevo && (
          <Link
            href={`/catalogo/${id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <span>Ver en la tienda</span>
          </Link>
        )}
      </div>

      {/* Mensaje de Autenticación*/}
      {!isAuthenticated && (
        <Alert
          variant="warning"
          title="Autenticación requerida"
        >
          No tenés una sesión iniciada, Inicia Sesion en{" "}
          <Link href="/login" className="underline font-bold">
            /login
          </Link>
          .
        </Alert>
      )}

      {/* Alertas de Éxito o Error */}
      {success && (
        <Alert variant="success" title="Operación completada">
          {success} Redirigiendo al inventario...
        </Alert>
      )}

      {error && (
        <Alert variant="danger" title="Error al guardar">
          {error}
        </Alert>
      )}

      {/* Formulario */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de la Pieza */}
          <Input
            label="Nombre de la Pieza"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Sofá Rinconero Olala XXL"
          />

          {/* Grid de Ambiente y Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Ambiente / Categoría"
              name="categoria"
              required
              options={opcionesCategoria}
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Seleccionar categoría..."
            />

            <Select
              label="Material Principal"
              name="material"
              required
              options={opcionesMaterial}
              value={formData.material}
              onChange={handleChange}
              placeholder="Seleccionar material..."
            />
          </div>

          {/* Grid de Precio, Stock y Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Precio Contado ($)"
              type="number"
              name="precio"
              required
              value={formData.precio}
              onChange={handleChange}
              placeholder="Ej: 385000"
            />

            <Input
              label="Stock Disponible"
              type="number"
              name="stock"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="Ej: 10"
            />

            <Input
              label="Tono / Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Ej: Lino Arena Natural"
            />
          </div>

          {/* Grid de Dimensiones */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Alto (cm)"
              type="number"
              name="alto"
              value={formData.alto}
              onChange={handleChange}
              placeholder="Ej: 85"
            />
            <Input
              label="Ancho (cm)"
              type="number"
              name="ancho"
              value={formData.ancho}
              onChange={handleChange}
              placeholder="Ej: 210"
            />
            <Input
              label="Profundidad (cm)"
              type="number"
              name="profundidad"
              value={formData.profundidad}
              onChange={handleChange}
              placeholder="Ej: 95"
            />
            <Input
              label="Peso estimado (kg)"
              type="number"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              placeholder="Ej: 45"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso dark:text-linen">
              Descripción y Cualidades
            </label>
            <textarea
              name="descripcion"
              rows={4}
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detallá las cualidades de diseño, confort, tapicería y acabado artesanal..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-camel/30 focus:border-camel transition-all"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/dashboard/muebles"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors min-h-[42px] inline-flex items-center justify-center"
            >
              Cancelar
            </Link>

            <Button
              type="submit"
              variant="espresso"
              isLoading={isSaving}
              leftIcon={Save}
            >
              {esNuevo ? "Crear Mueble" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
