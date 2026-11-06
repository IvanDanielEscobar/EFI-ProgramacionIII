import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { it, describe, expect, vi, beforeEach } from "vitest";
import EditarMueblePage from "@/app/dashboard/muebles/editar/[id]/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockCreateMueble = vi.fn();
vi.mock("@/services/api", () => ({
  mueblesService: {
    create: (...args) => mockCreateMueble(...args),
    getById: vi.fn(),
  },
  categoriasService: {
    getAll: vi.fn().mockResolvedValue([{ id: 1, nombre: "Living" }]),
  },
  materialesService: {
    getAll: vi.fn().mockResolvedValue([{ id: 1, nombre: "Paraíso" }]),
  },
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    token: "mock_token_123",
    isAuthenticated: true,
  }),
}));

describe("Prueba de integración para: EditarMueblePage (Nuevo)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe enviar el formulario de alta y redirigir al inventario", async () => {
    mockCreateMueble.mockResolvedValueOnce({ id: 1, nombre: "Sillón Canto" });

    // En Next.js 15 params es una Promise
    const paramsPromise = Promise.resolve({ id: "nuevo" });

    render(<EditarMueblePage params={paramsPromise} />);

    // Esperar a que cargue la vista
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre de la pieza/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/nombre de la pieza/i), {
      target: { value: "Sillón Canto 3 Cuerpos" },
    });

    fireEvent.change(screen.getByLabelText(/precio contado/i), {
      target: { value: "350000" },
    });

    fireEvent.change(screen.getByLabelText(/stock disponible/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /crear mueble/i }));

    await waitFor(() => {
      expect(mockCreateMueble).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/dashboard/muebles");
    });
  });
});