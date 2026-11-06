"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/registerSchema";
import { authService } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const toast = useToast();

  const [apiError, setApiError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [registradoExitoso, setRegistradoExitoso] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      email: "",
      dni_cuit: "",
      username: "",
      password: "",
      confirmPassword: "",
      terminos: false,
    },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setApiError("");

    try {
      const partes = (data.nombre || "").trim().split(/\s+/);
      const first_name = partes[0] || data.nombre;
      const last_name = partes.slice(1).join(" ") || "";

      await authService.register({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        dni_cuit: data.dni_cuit.trim(),
        first_name,
        last_name,
      });

      setRegistradoExitoso(true);
      toast.success(
        `¡Registro completado! Bienvenido/a a Home & Deco, ${first_name}.`
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setApiError(
        err?.message ||
          "No se pudo completar el registro. Comprobá los datos ingresados."
      );
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Cabecera */}
      <div className="text-center space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-xl"
        >
          <div className="relative h-12 w-12 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/logo-icon-transparent.png"
              alt="Home & Deco"
              fill
              sizes="48px"
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo-icon-light-stroke.png"
              alt="Home & Deco"
              fill
              sizes="48px"
              className="object-contain hidden dark:block"
            />
          </div>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
          Crear una Cuenta
        </h1>
        <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki">
          Registrate para comprar piezas exclusivas y seguir tus pedidos
        </p>
      </div>

      {/* Tarjeta del Formulario */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-5">
        {registradoExitoso ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-espresso dark:text-linen">
              ¡Cuenta creada con éxito!
            </h2>
            <p className="text-xs text-muted-foreground">
              Redirigiendo a la pantalla de inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Alerta de Error */}
            {apiError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Nombre Completo */}
            <div className="space-y-1">
              <label
                htmlFor="nombre"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Nombre y Apellido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Sofía Martínez"
                  aria-invalid={errors.nombre ? "true" : "false"}
                  {...register("nombre")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.nombre
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
              </div>
              {errors.nombre && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="sofia@ejemplo.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* DNI o CUIT */}
            <div className="space-y-1">
              <label
                htmlFor="dni_cuit"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                DNI / CUIT
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  id="dni_cuit"
                  type="text"
                  placeholder="Ej: 38123456"
                  aria-invalid={errors.dni_cuit ? "true" : "false"}
                  {...register("dni_cuit")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.dni_cuit
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
              </div>
              {errors.dni_cuit && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.dni_cuit.message}
                </p>
              )}
            </div>

            {/* Nombre de Usuario */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="sofia_m"
                  aria-invalid={errors.username ? "true" : "false"}
                  {...register("username")}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.username
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {mostrarPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={mostrarConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repetí tu contraseña"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all min-h-[42px] ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-border focus:ring-camel focus:border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirm(!mostrarConfirm)}
                  aria-label={mostrarConfirm ? "Ocultar contraseña" : "Ver contraseña"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {mostrarConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("terminos")}
                  className="mt-0.5 rounded border-border text-camel focus:ring-camel w-4 h-4"
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  Acepto los términos y condiciones de compra y privacidad de Home & Deco.
                </span>
              </label>
              {errors.terminos && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.terminos.message}
                </p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-xs uppercase tracking-wider transition-all shadow-sm min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-linen dark:border-espresso border-t-transparent rounded-full animate-spin" />
                  <span>Creando cuenta...</span>
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>

            {/* Acceso a Login */}
            <div className="pt-2 text-center text-xs text-muted-foreground border-t border-border">
              <span>¿Ya tenés una cuenta registrada? </span>
              <Link
                href="/login"
                className="font-bold text-espresso dark:text-camel hover:underline"
              >
                Iniciá sesión acá
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Volver */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-cocoa dark:text-khaki hover:text-espresso dark:hover:text-linen transition-colors min-h-[36px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la tienda principal</span>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="w-full bg-background min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Suspense
        fallback={
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}

