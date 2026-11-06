import { describe, it, expect } from "vitest";
import { muebleSchema } from "../muebleSchema";

describe("muebleSchema", () => {
  const muebleValido = {
    nombre: "Mesa Comedor Extensible Petiribí",
    categoria: "1",
    material: "2",
    precio: "460000",
    stock: "8",
    alto: "78",
    ancho: "180",
    profundidad: "90",
    peso: "35",
    color: "Petiribí Natural",
    descripcion: "Mesa de madera maciza con terminación poliuretánica mate.",
  };

  it("valida exitosamente un mueble con medidas positivas y campos completos", () => {
    const result = muebleSchema.safeParse(muebleValido);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.precio).toBe(460000);
      expect(result.data.stock).toBe(8);
      expect(result.data.alto).toBe(78);
      expect(result.data.ancho).toBe(180);
      expect(result.data.profundidad).toBe(90);
    }
  });

  it("falla si el precio es menor o igual a 0", () => {
    const resultCero = muebleSchema.safeParse({ ...muebleValido, precio: "0" });
    const resultNegativo = muebleSchema.safeParse({ ...muebleValido, precio: "-500" });

    expect(resultCero.success).toBe(false);
    expect(resultNegativo.success).toBe(false);
  });

  it("falla si las medidas en cm son menores o iguales a 0", () => {
    const altoInvalido = muebleSchema.safeParse({ ...muebleValido, alto: "0" });
    const anchoInvalido = muebleSchema.safeParse({ ...muebleValido, ancho: "-120" });
    const profundidadInvalida = muebleSchema.safeParse({ ...muebleValido, profundidad: "0" });

    expect(altoInvalido.success).toBe(false);
    expect(anchoInvalido.success).toBe(false);
    expect(profundidadInvalida.success).toBe(false);
  });

  it("falla si el stock es negativo o decimal", () => {
    const stockNegativo = muebleSchema.safeParse({ ...muebleValido, stock: "-1" });
    const stockDecimal = muebleSchema.safeParse({ ...muebleValido, stock: "4.5" });

    expect(stockNegativo.success).toBe(false);
    expect(stockDecimal.success).toBe(false);
  });

  it("permite stock en 0 para productos agotados", () => {
    const result = muebleSchema.safeParse({ ...muebleValido, stock: "0" });
    expect(result.success).toBe(true);
  });

  it("falla si falta el nombre, la categoría o el material", () => {
    const sinNombre = muebleSchema.safeParse({ ...muebleValido, nombre: "" });
    const sinCategoria = muebleSchema.safeParse({ ...muebleValido, categoria: "" });
    const sinMaterial = muebleSchema.safeParse({ ...muebleValido, material: "" });

    expect(sinNombre.success).toBe(false);
    expect(sinCategoria.success).toBe(false);
    expect(sinMaterial.success).toBe(false);
  });

  it("permite registrar un mueble con URL de imagen opcional o vacía", () => {
    const conImagen = muebleSchema.safeParse({
      ...muebleValido,
      imagen: "https://ejemplo.com/muebles/mesa.jpg",
    });
    const sinImagen = muebleSchema.safeParse({
      ...muebleValido,
      imagen: "",
    });

    expect(conImagen.success).toBe(true);
    expect(sinImagen.success).toBe(true);
    if (conImagen.success) {
      expect(conImagen.data.imagen).toBe("https://ejemplo.com/muebles/mesa.jpg");
    }
  });
});

