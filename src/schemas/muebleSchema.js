import { z } from "zod";

export const muebleSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre de la pieza es obligatorio" })
    .trim()
    .min(1, "El nombre de la pieza es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(120, "El nombre no puede superar los 120 caracteres"),

  categoria: z
    .string({ required_error: "Debes seleccionar una categoría" })
    .min(1, "Debes seleccionar una categoría"),

  material: z
    .string({ required_error: "Debes seleccionar un material principal" })
    .min(1, "Debes seleccionar un material principal"),

  precio: z
    .coerce
    .number({
      required_error: "El precio es obligatorio",
      invalid_type_error: "El precio debe ser un número válido",
    })
    .positive("El precio debe ser un número positivo mayor a 0"),

  stock: z
    .coerce
    .number({
      required_error: "El stock es obligatorio",
      invalid_type_error: "El stock debe ser un número entero",
    })
    .int("El stock debe ser un número entero sin decimales")
    .min(0, "El stock no puede ser un valor negativo"),

  alto: z
    .coerce
    .number({
      required_error: "La altura en cm es obligatoria",
      invalid_type_error: "La altura debe ser un número en centímetros",
    })
    .positive("La altura debe ser un número positivo en cm (mayor a 0)")
    .max(500, "La altura no puede superar los 500 cm"),

  ancho: z
    .coerce
    .number({
      required_error: "El ancho en cm es obligatorio",
      invalid_type_error: "El ancho debe ser un número en centímetros",
    })
    .positive("El ancho debe ser un número positivo en cm (mayor a 0)")
    .max(500, "El ancho no puede superar los 500 cm"),

  profundidad: z
    .coerce
    .number({
      required_error: "La profundidad en cm es obligatoria",
      invalid_type_error: "La profundidad debe ser un número en centímetros",
    })
    .positive("La profundidad debe ser un número positivo en cm (mayor a 0)")
    .max(500, "La profundidad no puede superar los 500 cm"),

  peso: z
    .coerce
    .number({ invalid_type_error: "El peso debe ser un número en kg" })
    .positive("El peso debe ser mayor a 0 kg")
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .trim()
    .max(50, "El tono/color no puede superar los 50 caracteres")
    .optional()
    .or(z.literal("")),

  imagen: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  descripcion: z
    .string()
    .trim()
    .max(1000, "La descripción no puede superar los 1000 caracteres")
    .optional()
    .or(z.literal("")),
});

