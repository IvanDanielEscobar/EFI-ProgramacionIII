"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles, AlertCircle, Image as ImageIcon } from "lucide-react";
import {
  mueblesService,
  categoriasService,
  materialesService,
} from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { muebleSchema } from "@/schemas/muebleSchema";
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

  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [caracteristicaId, setCaracteristicaId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(muebleSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      material: "",
      precio: "",
      stock: "1",
      color: "Madera Natural",
      imagen: "",
      alto: "80",
      ancho: "120",
      profundidad: "60",
      peso: "15",
      descripcion: "",
    },
    mode: "onTouched",
  });

  const imagenActual = watch("imagen");

  // Cargar categorías, materiales y datos iniciales del mueble (si es edición)
  useEffect(() => {
    let mounted = true;

    async function cargarDatos() {
      setIsLoading(true);
      setApiError(null);

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

          setCaracteristicaId(mueble.caracteristica_id);

          reset({
            nombre: mueble.nombre || "",
            categoria: String(mueble.categoria_id || catsData[0]?.id || ""),
            material: String(mueble.material_id || matsData[0]?.id || ""),
            precio: String(mueble.precio ?? ""),
            stock: String(mueble.stock ?? "0"),
            color: mueble.color || "Madera Natural",
            imagen: mueble.raw?.imagen || (typeof mueble.imagen === "string" && mueble.imagen.startsWith("http") ? mueble.imagen : ""),
            alto: String(mueble.alto ?? "80"),
            ancho: String(mueble.ancho ?? "120"),
            profundidad: String(mueble.profundidad ?? "60"),
            peso: String(mueble.peso ?? "15"),
            descripcion: mueble.descripcion || "",
          });
        } else {
          // Pre-seleccionar primera categoría y material disponibles en alta
          if (catsData.length > 0 && matsData.length > 0) {
            reset({
              nombre: "",
              categoria: String(catsData[0].id),
              material: String(matsData[0].id),
              precio: "",
              stock: "1",
              color: "Madera Natural",
              imagen: "",
              alto: "80",
              ancho: "120",
              profundidad: "60",
              peso: "15",
              descripcion: "",
            });
          }
        }
      } catch (err) {
        if (mounted) {
          setApiError(
            err.message || "Error al conectar con la API de Home & Deco."
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    cargarDatos();

    return () => {
      mounted = false;
    };
  }, [id, esNuevo, reset]);

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMsg(null);

    const payload = {
      ...data,
      caracteristica_id: caracteristicaId,
    };

    try {
      if (esNuevo) {
        await mueblesService.create(payload, token);
        setSuccessMsg("¡Mueble creado con éxito en la API!");
      } else {
        await mueblesService.update(id, payload, token);
        setSuccessMsg("¡Mueble actualizado con éxito en la API!");
      }

      // Redirección al inventario tras confirmación
      setTimeout(() => {
        router.push("/dashboard/muebles");
      }, 1200);
    } catch (err) {
      setApiError(
        err.message ||
          "Error al guardar los cambios en la API. Verificá que contás con permisos y token válido."
      );
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
            {esNuevo ? "Crear Nueva Pieza" : "Editar Ficha de Mueble"}
          </h1>
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

      {/* Alerta si no hay sesión iniciada */}
      {!isAuthenticated && (
        <Alert variant="warning" title="Autenticación requerida">
          No tenés una sesión iniciada. Para guardar cambios en la API necesitás autenticarte en{" "}
          <Link href="/login" className="underline font-bold">
            /login
          </Link>
          .
        </Alert>
      )}

      {/* Mensajes de Éxito o Error de la API */}
      {successMsg && (
        <Alert variant="success" title="Operación completada">
          {successMsg} Redirigiendo al inventario...
        </Alert>
      )}

      {apiError && (
        <Alert variant="danger" title="Error al guardar en el servidor">
          {apiError}
        </Alert>
      )}

      {/* Formulario Controlado con React Hook Form + Zod */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Nombre de la Pieza */}
          <Input
            label="Nombre de la Pieza"
            required
            placeholder="Ej: Sofá Rinconero Olala XXL"
            error={errors.nombre?.message}
            {...register("nombre")}
          />

          {/* Grid de Ambiente / Categoría y Material Principal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Ambiente / Categoría"
              required
              options={opcionesCategoria}
              placeholder="Seleccionar categoría..."
              error={errors.categoria?.message}
              {...register("categoria")}
            />

            <Select
              label="Material"
              required
              options={opcionesMaterial}
              placeholder="Seleccionar material..."
              error={errors.material?.message}
              {...register("material")}
            />
          </div>

          {/* Grid de Precio, Stock y Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Precio Contado ($)"
              type="number"
              step="any"
              required
              placeholder="Ej: 385000"
              error={errors.precio?.message}
              {...register("precio")}
            />

            <Input
              label="Stock Disponible"
              type="number"
              required
              placeholder="Ej: 10"
              error={errors.stock?.message}
              {...register("stock")}
            />

            <Input
              label="Tono / Color"
              placeholder="Ej: Lino Arena Natural"
              error={errors.color?.message}
              {...register("color")}
            />
          </div>

          {/* Imagen */}
          <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-linen/40 dark:bg-muted/20 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen">
                Imagen del Mueble
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full space-y-1">
                <Input
                  placeholder="https://ejemplo.com/imagenes/mueble.jpg"
                  error={errors.imagen?.message}
                  {...register("imagen")}
                />
              </div>

              {/* Vista previa miniatura */}
              <div className="relative w-28 h-20 rounded-xl border border-border bg-card overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                {imagenActual && imagenActual.trim() !== "" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={imagenActual}
                    alt="Vista previa de imagen"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center p-2 text-muted-foreground space-y-1">
                    <ImageIcon className="w-5 h-5 mx-auto opacity-50" />
                    <span className="text-[10px] block leading-tight font-medium">Sin imagen</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid de Medidas en cm (Números Positivos) */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Alto (cm)"
                type="number"
                step="any"
                required
                placeholder="Ej: 85"
                error={errors.alto?.message}
                {...register("alto")}
              />
              <Input
                label="Ancho (cm)"
                type="number"
                step="any"
                required
                placeholder="Ej: 210"
                error={errors.ancho?.message}
                {...register("ancho")}
              />
              <Input
                label="Profundidad (cm)"
                type="number"
                step="any"
                required
                placeholder="Ej: 95"
                error={errors.profundidad?.message}
                {...register("profundidad")}
              />
              <Input
                label="Peso estimado (kg)"
                type="number"
                step="any"
                placeholder="Ej: 45"
                error={errors.peso?.message}
                {...register("peso")}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso dark:text-linen">
              Descripción y Cualidades
            </label>
            <textarea
              rows={4}
              placeholder="Detallá las cualidades de diseño, confort, tapicería y acabado artesanal..."
              className={`w-full px-4 py-2.5 rounded-xl border bg-card text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                errors.descripcion
                  ? "border-red-500 focus:ring-red-400/40"
                  : "border-border focus:ring-camel/30 focus:border-camel"
              }`}
              {...register("descripcion")}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.descripcion.message}</span>
              </p>
            )}
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
              isLoading={isSubmitting}
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
