"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "home-deco-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          setItems(parsed);
          setIsLoaded(true);
        });
        return;
      }
    } catch (err) {
      console.warn("No se pudo cargar el carrito desde localStorage:", err);
    }
    queueMicrotask(() => {
      setIsLoaded(true);
    });
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("No se pudo guardar el carrito en localStorage:", err);
    }
  }, [items, isLoaded]);

  // Agregar al carrito
  const addToCart = useCallback((mueble, cantidad = 1, color = null) => {
    if (!mueble) return;

    const precioUnitario = Number(mueble.precio) || 0;
    const stockMax = mueble.stock !== undefined ? Number(mueble.stock) : 99;
    const colorSeleccionado = color || mueble.color || "Estándar";

    setItems((prevItems) => {
      // Busca si ya existe el mismo mueble con el mismo color
      const index = prevItems.findIndex(
        (it) => it.id === mueble.id && it.color === colorSeleccionado
      );

      if (index >= 0) {
        const existente = prevItems[index];
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, stockMax);
        const actualizados = [...prevItems];
        actualizados[index] = {
          ...existente,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * precioUnitario,
        };
        return actualizados;
      }

      const cantidadFinal = Math.min(Math.max(cantidad, 1), stockMax);
      const nuevoItem = {
        id: mueble.id,
        nombre: mueble.nombre || "Mueble de Diseño",
        precio: precioUnitario,
        imagen: mueble.imagen || "/images/prod-sofa.jpg",
        categoria: mueble.categoria || "Living",
        madera: mueble.madera || mueble.material || "Madera Noble",
        color: colorSeleccionado,
        stock: stockMax,
        cantidad: cantidadFinal,
        subtotal: cantidadFinal * precioUnitario,
      };

      return [...prevItems, nuevoItem];
    });
  }, []);

  // Eliminar un producto
  const removeFromCart = useCallback((id, color = null) => {
    setItems((prev) =>
      prev.filter((it) => {
        if (color) {
          return !(it.id === id && it.color === color);
        }
        return it.id !== id;
      })
    );
  }, []);

  // Modificar cantidad
  const updateQuantity = useCallback((id, cantidad, color = null) => {
    setItems((prev) =>
      prev
        .map((it) => {
          const match = color ? it.id === id && it.color === color : it.id === id;
          if (!match) return it;

          const cantNum = Number(cantidad);
          if (cantNum <= 0) return null; // Señal para remover

          const cantAjustada = Math.min(cantNum, it.stock || 99);
          return {
            ...it,
            cantidad: cantAjustada,
            subtotal: cantAjustada * it.precio,
          };
        })
        .filter(Boolean)
    );
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Modales
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Totales
  const totalItems = items.reduce((acc, it) => acc + (it.cantidad || 0), 0);
  const totalPrecio = items.reduce((acc, it) => acc + (it.subtotal || 0), 0);

  const value = {
    items,
    totalItems,
    totalPrecio,
    isOpen,
    openCart,
    closeCart,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoaded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}