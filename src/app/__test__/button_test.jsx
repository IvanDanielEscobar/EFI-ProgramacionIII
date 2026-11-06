import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/Button";

describe("Pruebas para el componente Button", () => {
  it("debe renderizar el texto children correctamente", () => {
    render(<Button>Guardar Mueble</Button>);

    expect(screen.getByText("Guardar Mueble")).toBeInTheDocument();
  });

  it("debe ejecutar la funcion onClick al hacer click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Guardar</Button>);

    const boton = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(boton);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("debe deshabilitarse y reemplazar el texto por 'Cargando...' cuando isLoading es true", () => {
    render(<Button isLoading>Guardar Mueble</Button>);

    const boton = screen.getByRole("button");

    // Revisa que el botón esté deshabilitado y marque aria-busy
    expect(boton).toBeDisabled();
    expect(boton).toHaveAttribute("aria-busy", "true");

    // Según el componente: si children es str y isLoading es true, muestra "Cargando..."
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("debe deshabilitarse cuando el prop disabled es true", () => {
    render(<Button disabled>Deshabilitado</Button>);

    const boton = screen.getByRole("button", { name: /deshabilitado/i });
    expect(boton).toBeDisabled();
  });

  it("debe renderizar correctamente los iconos leftIcon y rightIcon", () => {
    render(
      <Button leftIcon={Save} rightIcon={ArrowRight}>
        Continuar
      </Button>
    );

    const boton = screen.getByRole("button", { name: /continuar/i });
    expect(boton).toBeInTheDocument();
  });
});