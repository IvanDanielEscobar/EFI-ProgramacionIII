import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "El nombre de usuario es obligatorio" })
    .trim()
    .min(1, "El nombre de usuario es obligatorio")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede superar los 50 caracteres"),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria")
    .min(4, "La contraseña debe tener al menos 4 caracteres"),
});

