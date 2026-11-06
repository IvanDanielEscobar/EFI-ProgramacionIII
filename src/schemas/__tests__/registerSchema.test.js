import { describe, it, expect } from "vitest";
import { registerSchema } from "../registerSchema";

describe("registerSchema", () => {
  const validData = {
    nombre: "Juan Perez",
    email: "juan.perez@example.com",
    dni_cuit: "38123456",
    username: "juan_perez",
    password: "Password123",
    confirmPassword: "Password123",
    terminos: true,
  };

  it("valida exitosamente un registro con todos los datos correctos", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("falla si las contraseñas no coinciden", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword123",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toContain("confirmPassword");
    expect(result.error.issues[0].message).toBe("Las contraseñas no coinciden");
  });

  it("falla si la contraseña tiene menos de 6 caracteres", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "123",
      confirmPassword: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "La contraseña debe tener al menos 6 caracteres"
    );
  });

  it("falla si el correo electrónico no es válido", () => {
    const result = registerSchema.safeParse({
      ...validData,
      email: "correo-invalido",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toContain("email");
  });

  it("falla si no se aceptan los términos y condiciones", () => {
    const result = registerSchema.safeParse({
      ...validData,
      terminos: false,
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toContain("terminos");
  });

  it("falla si el DNI o CUIT tiene menos de 7 caracteres o formato inválido", () => {
    const result = registerSchema.safeParse({
      ...validData,
      dni_cuit: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toContain("dni_cuit");
  });

  it("falla si el nombre de usuario tiene caracteres no permitidos", () => {
    const result = registerSchema.safeParse({
      ...validData,
      username: "usuario con espacios!",
    });
    expect(result.success).toBe(false);
    expect(result.error.issues[0].path).toContain("username");
  });
});

