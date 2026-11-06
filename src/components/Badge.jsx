// Server Component
export function Badge({
  children,
  variant,
  size = "md",
  dot,
  stock,
  estado,
  madera,
  descuento,
  preset,
  className = "",
  ...props
}) {
  let resolvedVariant = variant || "camel";
  let resolvedDot = dot;
  let resolvedText = children;

  // Preset por Nivel de Stock
  if (stock !== undefined && stock !== null) {
    const numStock = Number(stock);
    if (numStock > 3) {
      resolvedVariant = variant || "success";
      resolvedDot = dot !== undefined ? dot : true;
      resolvedText = children || `En Stock (${numStock})`;
    } else if (numStock > 0) {
      resolvedVariant = variant || "warning";
      resolvedDot = dot !== undefined ? dot : true;
      resolvedText = children || `Últimas ${numStock} unid.`;
    } else {
      resolvedVariant = variant || "danger";
      resolvedDot = dot !== undefined ? dot : true;
      resolvedText = children || "Agotado";
    }
  }

  // Preset por Estado de Pedido
  else if (estado) {
    const estadoNormalizado = estado.toLowerCase().trim();
    resolvedDot = dot !== undefined ? dot : true;

    switch (estadoNormalizado) {
      case "pendiente":
      case "pendiente_pago":
        resolvedVariant = variant || "warning";
        resolvedText = children || "Pendiente";
        break;
      case "en_preparacion":
      case "preparacion":
        resolvedVariant = variant || "khaki";
        resolvedText = children || "En Preparación";
        break;
      case "en_camino":
      case "enviado":
        resolvedVariant = variant || "camel";
        resolvedText = children || "En Camino";
        break;
      case "entregado":
      case "completado":
        resolvedVariant = variant || "success";
        resolvedText = children || "Entregado";
        break;
      case "cancelado":
        resolvedVariant = variant || "danger";
        resolvedText = children || "Cancelado";
        break;
      default:
        resolvedVariant = variant || "linen";
        resolvedText = children || estado;
    }
  }

  // Preset por Tipo de Madera
  else if (madera) {
    resolvedVariant = variant || "khaki";
    resolvedDot = dot !== undefined ? dot : false;
    resolvedText = children || madera;
  }

  // 4. Preset de Descuento
  else if (descuento) {
    resolvedVariant = variant || "espresso";
    resolvedDot = dot !== undefined ? dot : false;
    resolvedText = children || `-${descuento}% OFF`;
  }

  // 5. Presets Comerciales
  else if (preset) {
    const presetNormalizado = preset.toLowerCase().trim();
    switch (presetNormalizado) {
      case "nuevo":
        resolvedVariant = variant || "camel";
        resolvedText = children || "Nuevo Ingreso";
        break;
      case "destacado":
      case "top":
        resolvedVariant = variant || "camel";
        resolvedText = children || "Top Ventas";
        break;
      case "limitada":
      case "edicion_limitada":
        resolvedVariant = variant || "espresso";
        resolvedText = children || "Edición Limitada";
        break;
      default:
        resolvedVariant = variant || "camel";
        resolvedText = children || preset;
    }
  }

  // Clases de estilo segun variante
  const variants = {
    camel:
      "bg-camel/20 text-cocoa dark:text-camel border-camel/30",
    linen:
      "bg-linen text-espresso dark:bg-card dark:text-linen border-khaki/40 dark:border-border",
    khaki:
      "bg-khaki/30 text-espresso dark:text-khaki border-khaki/50",
    espresso:
      "bg-espresso text-linen dark:bg-camel dark:text-espresso border-transparent shadow-2xs",
    success:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    warning:
      "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    danger:
      "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800",
    outline:
      "bg-transparent text-espresso dark:text-linen border-khaki dark:border-border",
  };

  const sizes = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-xs px-3 py-1.5 gap-2 font-bold",
  };

  const dotColors = {
    camel: "bg-camel",
    linen: "bg-espresso",
    khaki: "bg-cocoa",
    espresso: "bg-linen",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    outline: "bg-camel",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border tracking-wide uppercase font-mono ${
        variants[resolvedVariant] || variants.camel
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {resolvedDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[resolvedVariant] || "bg-current"
          }`}
          aria-hidden="true"
        />
      )}
      <span>{resolvedText}</span>
    </span>
  );
}

export default Badge;