export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

/* Obtiene el token JWT desde la peticion o desde localStorage */
export function getAuthToken(explicitToken = null) {
  if (explicitToken) return explicitToken;
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("home-deco-access-token");
    } catch {
      return null;
    }
  }
  return null;
}

/* Imagen de respaldo si el mueble en la base de datos no tiene una cargada */
export function getFallbackImage(categoria = "", id = 1) {
  const cat = String(categoria).toLowerCase();
  if (cat.includes("living") || cat.includes("sofá") || cat.includes("sofa")) return "/images/prod-sofa.jpg";
  if (cat.includes("comedor") || cat.includes("mesa")) return id % 2 === 0 ? "/images/prod-silla.jpg" : "/images/prod-mesa.jpg";
  if (cat.includes("dormitorio") || cat.includes("cama")) return "/images/cat-dormitorio.jpg";
  if (cat.includes("oficina") || cat.includes("escritorio") || cat.includes("office")) return "/images/prod-escritorio.jpg";
  if (cat.includes("exterior") || cat.includes("jardín") || cat.includes("jardin")) return "/images/showroom.jpg";
  return "/images/hero-lounge.jpg";
}

/* Normaliza un objeto unificando Mueble con sus Características técnicas */
export function normalizarMueble(mueble) {
  if (!mueble) return null;

  const c = mueble.caracteristicas || {};
  const precio = Number(c.precio ?? mueble.precio ?? 0);
  const stock = Number(c.stock ?? mueble.stock ?? 0);

  const categoriaNombre =
    typeof mueble.categoria === "object"
      ? mueble.categoria?.nombre
      : mueble.categoria_nombre || mueble.categoria || "Living & Sala";

  const categoriaId =
    typeof mueble.categoria === "object"
      ? mueble.categoria?.id
      : Number(mueble.categoria) || null;

  const materialNombre =
    typeof mueble.material === "object"
      ? mueble.material?.nombre
      : mueble.material_nombre || mueble.material || "Madera Noble";

  const materialId =
    typeof mueble.material === "object"
      ? mueble.material?.id
      : Number(mueble.material) || null;

  const dimensiones =
    c.dimensiones_texto ||
    (c.alto ? `${c.alto} x ${c.ancho} x ${c.profundidad} cm` : "Medidas estándar");

  return {
    id: mueble.id,
    nombre: mueble.nombre || "Mueble de Diseño",
    descripcion: mueble.descripcion || "",
    categoria: categoriaNombre,
    categoria_id: categoriaId,
    material: materialNombre,
    material_id: materialId,
    madera: materialNombre,
    precio,
    stock,
    en_stock: stock > 0,
    color: c.color || "Madera Natural",
    dimensiones,
    alto: c.alto ?? null,
    ancho: c.ancho ?? null,
    profundidad: c.profundidad ?? null,
    peso: c.peso ?? null,
    caracteristica_id: c.id ?? null,
    imagen: mueble.imagen || getFallbackImage(categoriaNombre, mueble.id),
    activo: mueble.activo !== false,
    eliminado_logico: Boolean(mueble.eliminado_logico),
    total_vendido: mueble.total_vendido || 0,
    fecha_creacion: mueble.fecha_creacion,
    raw: mueble,
  };
}

/* Cliente HTTP base para realizar peticiones normalizadas a la API DRF */
export async function apiFetch(endpoint, options = {}) {
  const { token, params, headers: customHeaders, ...customConfig } = options;

  let url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  }

  const resolvedToken = getAuthToken(token);
  const isFormData = typeof FormData !== "undefined" && customConfig.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...customHeaders,
  };

  let response;
  try {
    response = await fetch(url, { ...customConfig, headers });
  } catch (netErr) {
    const error = new Error("No fue posible conectar con el servidor de la API.");
    error.status = 0;
    error.network = true;
    error.original = netErr;
    throw error;
  }

  if (response.status === 204) return { success: true };

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    let errorMsg = null;
    if (data && typeof data === "object") {
      if (typeof data.detail === "string") {
        errorMsg = data.detail;
      } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        errorMsg = data.non_field_errors.join(", ");
      } else if (typeof data.mensaje === "string") {
        errorMsg = data.mensaje;
      } else {
        const fieldErrors = Object.entries(data)
          .filter(([_, val]) => val !== null && val !== undefined)
          .map(([field, msgs]) => {
            const msgStr = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
            return `${field}: ${msgStr}`;
          })
          .join(" | ");
        if (fieldErrors) errorMsg = fieldErrors;
      }
    }

    if (!errorMsg) {
      errorMsg =
        response.status === 404
          ? `Error intente nuevamente mas tarde.`
          : `Error HTTP ${response.status}: ${response.statusText}`;
    }

    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* func para búsqueda con palabras acentuadas estandares */
function aplicarVariantesAcento(texto) {
  if (!texto) return texto;
  return texto
    .replace(/\bsofa\b/gi, "sofá")
    .replace(/\bsofas\b/gi, "sofás")
    .replace(/\bsillon\b/gi, "sillón")
    .replace(/\bsillones\b/gi, "sillones")
    .replace(/\bcomoda\b/gi, "cómoda")
    .replace(/\bcomodas\b/gi, "cómodas")
    .replace(/\bjardin\b/gi, "jardín")
    .replace(/\bnordico\b/gi, "nórdico")
    .replace(/\bnordica\b/gi, "nórdica");
}

/* SERVICIO DE MUEBLES (Catalogo y CRUD) */
export const mueblesService = {
  /* Obtiene listado con filtros de búsqueda, categoría, precio y orden */
  async getAll({
    page = 1,
    search = "",
    categoria = "",
    precio_min = "",
    precio_max = "",
    ordering = "",
    limit = 10,
  } = {}) {
    const buildParams = (term) => ({
      page,
      ...(term ? { search: term } : {}),
      ...(categoria && categoria !== "todas" ? { categoria } : {}),
      ...(precio_min ? { precio_min } : {}),
      ...(precio_max ? { precio_max } : {}),
      ...(ordering ? { ordering } : {}),
      ...(limit ? { page_size: limit } : {}),
    });

    let data = await apiFetch("/muebles/", { params: buildParams(search) });
    let rawList = Array.isArray(data) ? data : data.results || [];

    // Reintento para palabras sin tilde si no hubo resultados
    if (search && (data.count === 0 || rawList.length === 0)) {
      const normalizado = aplicarVariantesAcento(search);
      if (normalizado !== search) {
        try {
          const retryData = await apiFetch("/muebles/", { params: buildParams(normalizado) });
          const retryList = Array.isArray(retryData) ? retryData : retryData.results || [];
          if ((retryData.count || retryList.length) > 0) {
            data = retryData;
            rawList = retryList;
          }
        } catch {
          // Conserva data previa
        }
      }
    }

    return {
      count: data.count !== undefined ? data.count : rawList.length,
      next: data.next || null,
      previous: data.previous || null,
      results: rawList.map(normalizarMueble),
      raw: data,
    };
  },

  /* Muebles mas vendidos desde el endpoint */
  async getDestacados(limite = 5) {
    try {
      const data = await apiFetch("/muebles/destacados/", { params: { limite } });
      const list = Array.isArray(data) ? data : data.results || [];
      return list.map(normalizarMueble);
    } catch {
      return [];
    }
  },

  /* Detalle de un mueble por ID */
  async getById(id) {
    const rawMueble = await apiFetch(`/muebles/${id}/`);

    if (!rawMueble.caracteristicas) {
      try {
        const listRes = await apiFetch(`/muebles/?search=${encodeURIComponent(rawMueble.nombre)}`);
        const match = (listRes?.results || []).find((m) => m.id === Number(id));
        if (match?.caracteristicas) {
          rawMueble.caracteristicas = match.caracteristicas;
        }
      } catch {
      }
    }

    return normalizarMueble(rawMueble);
  },

  /* Alta de Mueble y sus Caracteristicas asociadas */
  async create(formData, token = null) {
    const {
      nombre, descripcion, categoria, material, imagen = null,
      alto = 80, ancho = 100, profundidad = 60, peso = 15,
      precio = 0, stock = 1, color = "Madera Natural",
    } = formData;

    const muebleCreado = await apiFetch("/muebles/", {
      method: "POST",
      token,
      body: JSON.stringify({
        nombre,
        descripcion,
        categoria: Number(categoria),
        material: Number(material),
        imagen: imagen ? imagen : null,
      }),
    });

    let caracteristicas = null;
    try {
      caracteristicas = await apiFetch("/caracteristicas/", {
        method: "POST",
        token,
        body: JSON.stringify({
          mueble: muebleCreado.id,
          alto: Number(alto),
          ancho: Number(ancho),
          profundidad: Number(profundidad),
          peso: Number(peso) || 10,
          precio: Number(precio),
          stock: Number(stock),
          color: color || "Madera Natural",
        }),
      });
    } catch (err) {
      console.warn("Aviso al crear características:", err.message);
    }

    return normalizarMueble({ ...muebleCreado, caracteristicas });
  },

  /* Actualizar un Mueble y Características */
  async update(id, formData, token = null) {
    const {
      nombre, descripcion, categoria, material, imagen,
      caracteristica_id, alto, ancho, profundidad, peso, precio, stock, color,
    } = formData;

    const mueblePayload = {};
    if (nombre !== undefined) mueblePayload.nombre = nombre;
    if (descripcion !== undefined) mueblePayload.descripcion = descripcion;
    if (categoria !== undefined) mueblePayload.categoria = Number(categoria);
    if (material !== undefined) mueblePayload.material = Number(material);
    if (imagen !== undefined) mueblePayload.imagen = imagen ? imagen : null;

    const muebleActualizado = await apiFetch(`/muebles/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(mueblePayload),
    });

    if (caracteristica_id) {
      const caracPayload = {};
      if (alto !== undefined) caracPayload.alto = Number(alto);
      if (ancho !== undefined) caracPayload.ancho = Number(ancho);
      if (profundidad !== undefined) caracPayload.profundidad = Number(profundidad);
      if (peso !== undefined) caracPayload.peso = Number(peso);
      if (precio !== undefined) caracPayload.precio = Number(precio);
      if (stock !== undefined) caracPayload.stock = Number(stock);
      if (color !== undefined) caracPayload.color = color;

      if (Object.keys(caracPayload).length > 0) {
        try {
          await apiFetch(`/caracteristicas/${caracteristica_id}/`, {
            method: "PATCH",
            token,
            body: JSON.stringify(caracPayload),
          });
        } catch (err) {
          console.warn("Aviso al actualizar características:", err.message);
        }
      }
    }

    return normalizarMueble(muebleActualizado);
  },

  /* Eliminar un Mueble */
  delete(id, token = null) {
    return apiFetch(`/muebles/${id}/`, { method: "DELETE", token });
  },
};

/* SERVICIO DE CATEGORIAS */
export const categoriasService = {
  getAll: () => apiFetch("/categorias/").then((d) => (Array.isArray(d) ? d : d.results || [])),
  getById: (id) => apiFetch(`/categorias/${id}/`),
};

/* SERVICIO DE MATERIALES */
export const materialesService = {
  getAll: () => apiFetch("/materiales/").then((d) => (Array.isArray(d) ? d : d.results || [])),
  getById: (id) => apiFetch(`/materiales/${id}/`),
};

/* SERVICIO DE SUCURSALES */
export const sucursalesService = {
  getAll: () => apiFetch("/sucursales/").then((d) => (Array.isArray(d) ? d : d.results || [])),
  getById: (id) => apiFetch(`/sucursales/${id}/`),
};

/* SERVICIO DE AUTH */
export const authService = {
  login: (username, password) =>
    apiFetch("/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  refreshToken: (refresh) =>
    apiFetch("/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    }),
  register: (userData) =>
    apiFetch("/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

/* SERVICIO DE PEDIDOS */
export const pedidosService = {
  getAll: (token = null) =>
    apiFetch("/pedidos/", { token }).then((d) => (Array.isArray(d) ? d : d.results || [])),
  getById: (id, token = null) => apiFetch(`/pedidos/${id}/`, { token }),
  cancel: (id, token = null) => apiFetch(`/pedidos/${id}/`, { method: "DELETE", token }),
};
