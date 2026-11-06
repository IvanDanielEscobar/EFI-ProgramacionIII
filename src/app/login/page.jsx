"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  Lock,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const errorParam = searchParams.get("error");

  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLocal, setErrorLocal] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const destino = user?.es_empleado ? redirectTarget : "/";
      const timeout = setTimeout(() => {
        router.push(destino);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, user, redirectTarget, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal("");

    if (!username.trim() || !password.trim()) {
      setErrorLocal("Por favor completá tu usuario y contraseña.");
      return;
    }

    setEnviando(true);
    const result = await login(username.trim(), password);
    setEnviando(false);

    if (result?.success) {
      if (result.user?.es_empleado) {
        router.push(redirectTarget);
      } else {
        router.push("/");
      }
    } else {
      setErrorLocal(
        result?.error || "Credenciales inválidas. Verificá tu usuario y contraseña."
      );
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Cabecera */}
      <div className="text-center space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-camel rounded-xl"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-linen dark:bg-card p-1 border border-khaki/60 dark:border-border transition-transform group-hover:scale-105 shadow-2xs">
            <Image
              src="/logo-icon.jpg"
              alt="Home & Deco"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso dark:text-linen tracking-tight">
          Acceso al Sistema
        </h1>
        <p className="text-xs sm:text-sm text-cocoa/80 dark:text-khaki">
          Ingresá tus datos para acceder
        </p>
      </div>

      {/* Alerta de Rol No Autorizado proveniente del Middleware */}
      {errorParam === "unauthorized_role" && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-1 shadow-2xs"
        >
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Permisos denegados</span>
          </div>
        </div>
      )}

      {/* Tarjeta del Formulario */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-6">
        {isAuthenticated ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-espresso dark:text-linen">
              ¡Sesión iniciada como {user?.username}!
            </h2>
            <p className="text-xs text-muted-foreground">
              {user?.es_empleado
                ? "Redirigiendo al panel de administración..."
                : "Redirigiendo a la tienda..."}
            </p>
            <div className="pt-2">
              <Link
                href={user?.es_empleado ? redirectTarget : "/"}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-espresso text-linen dark:bg-camel dark:text-espresso text-xs font-semibold uppercase tracking-wider"
              >
                Continuar
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorLocal && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            {/* Campo Usuario */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: admin o vendedor1"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel focus:border-transparent transition-all min-h-[44px]"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-espresso dark:text-linen"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-linen/40 dark:bg-muted/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-camel focus:border-transparent transition-all min-h-[44px]"
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={enviando || authLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-espresso hover:bg-cocoa text-linen dark:bg-camel dark:hover:bg-khaki dark:text-espresso font-bold text-xs uppercase tracking-wider transition-all shadow-sm min-h-[44px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando || authLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-linen dark:border-espresso border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar al Sistema</span>
                </>
              )}
            </button>

            <div className="p-3.5 rounded-2xl bg-linen/60 dark:bg-muted/30 border border-border text-[11px] text-muted-foreground space-y-1.5">
              <p className="font-semibold text-espresso dark:text-linen flex items-center gap-1">
                <span>Usuarios de prueba del Backend:</span>
              </p>
              <p>
                • <strong>Admin (Superadmin):</strong> <code className="text-camel font-bold">admin</code> / <code className="text-camel">admin123</code>
              </p>
              <p>
                • <strong>Empleado (Ventas):</strong> <code className="text-camel font-bold">vendedor1</code> / <code className="text-camel">vendedor123</code>
              </p>
              <p>
                • <strong>Cliente (Sin acceso dashboard):</strong> <code className="text-camel font-bold">cliente_juan</code> / <code className="text-camel">cliente123</code>
              </p>
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

export default function LoginPage() {
  return (
    <div className="w-full bg-background min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Suspense
        fallback={
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-camel border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
