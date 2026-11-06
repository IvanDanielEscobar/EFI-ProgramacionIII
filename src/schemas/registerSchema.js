import { z } from "zod";

export const registerSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre es obligatorio" })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(60, "El nombre no puede superar los 60 caracteres"),

    email: z
      .string({ required_error: "El correo electrónico es obligatorio" })
      .trim()
      .email("Ingresá un correo electrónico válido")
      .max(100, "El correo no puede superar los 100 caracteres"),

    dni_cuit: z
      .string({ required_error: "El DNI o CUIT es obligatorio" })
      .trim()
      .min(7, "El DNI o CUIT debe tener al menos 7 dígitos")
      .max(20, "El DNI o CUIT no puede superar los 20 caracteres")
      .regex(
        /^[0-9\-.]+$/,
        "El DNI o CUIT solo debe contener números, puntos o guiones"
      ),

    username: z
      .string({ required_error: "El nombre de usuario es obligatorio" })
      .trim()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(30, "El usuario no puede superar los 30 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "El usuario solo puede contener letras, números y guiones bajos"
      ),

    password: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña no puede superar los 50 caracteres"),

    confirmPassword: z
      .string({ required_error: "Debes confirmar la contraseña" })
      .min(1, "Debes confirmar la contraseña"),

    terminos: z.literal(true, {
      errorMap: () => ({
        message: "Debes aceptar los términos y condiciones para continuar",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

