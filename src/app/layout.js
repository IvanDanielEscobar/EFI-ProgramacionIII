import "./globals.css";
import { Providers } from "@/context/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Home & Deco | Mueblería y Diseño de Interiores",
  description:
    "Mueblería de diseño, maderas nobles y piezas con estilo para transformar tu hogar.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Xmind:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <Providers>
          <a
            href="#contenido-principal"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl transition-all"
          >
            Saltar al contenido principal
          </a>
          <Navbar />
          <main id="contenido-principal" className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
