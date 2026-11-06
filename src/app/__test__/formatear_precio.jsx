import { describe, it, expect } from "vitest";

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);

describe("Prueba unitaria para: formatearPrecio", () => {
  it("debe formatear números enteros a formato de moneda ARS", () => {
    const resultado = formatearPrecio(385000);
    const textoLimpio = resultado.replace(/\s/g, " ");
    expect(textoLimpio).toContain("$ 385.000");
  });

  it("debe manejar correctamente entradas vacías o inválidas retornando $ 0", () => {
    const resultado = formatearPrecio(null);
    const textoLimpio = resultado.replace(/\s/g, " ");
    expect(textoLimpio).toContain("$ 0");
  });
});