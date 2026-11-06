"use client";

import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import { CartProvider } from "./CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
