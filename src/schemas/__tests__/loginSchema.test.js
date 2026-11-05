import { describe, it, expect } from "vitest";
import { loginSchema } from "../loginSchema";

describe("loginSchema", () => {
  it("valida exitosamente credenciales correctas", () => {
    const data = {
      username: "admin",
      password: "password123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("admin");
    }
  });

  it("falla si el username está vacío", () => {
    const data = {
      username: "",
      password: "password123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("falla si el username tiene menos de 3 caracteres", () => {
    const data = {
      username: "ab",
      password: "password123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("falla si la contraseña tiene menos de 4 caracteres", () => {
    const data = {
      username: "admin",
      password: "123",
    };
    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

