import { describe, it, expect } from "vitest";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

describe("Pruebas para loginSchema", () => {
  it("debe fallar si el usuario esta vacio", () => {
    const invalidData = {
      username: "",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("El usuario es obligatorio");
    }
  });

  it("debe fallar si la contraseña tiene menos de 6 caracteres", () => {
    const invalidData = {
      username: "empleado@homedeco.com",
      password: "123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe("La contraseña debe tener al menos 6 caracteres");
    }
  });

  it("debe pasar la validacion si los datos son correctos", () => {
    const validData = {
      username: "empleado@homedeco.com",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});