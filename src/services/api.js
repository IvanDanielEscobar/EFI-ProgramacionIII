export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://homedeco-backend.onrender.com/api";

/* Obtiene el token JWT desde la api o desde localStorage */
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

/* Mapeo de imágenes locales, cuando el mueble en la base de datos no tenga imagen cargada. */
export function getFallbackImage(categoria = "", id = 1) {
  const cat = String(categoria).toLowerCase();
  if (cat.includes("living") || cat.includes("sofá") || cat.includes("sofa")) {
    return "/images/prod-sofa.jpg";
  }
  if (cat.includes("comedor") || cat.includes("mesa")) {
    return id % 2 === 0 ? "/images/prod-silla.jpg" : "/images/prod-mesa.jpg";
  }
  if (cat.includes("dormitorio") || cat.includes("cama")) {
    return "/images/cat-dormitorio.jpg";
  }
  if (cat.includes("oficina") || cat.includes("escritorio") || cat.includes("office")) {
    return "/images/prod-escritorio.jpg";
  }
  if (cat.includes("exterior") || cat.includes("jardín") || cat.includes("jardin")) {
    return "/images/showroom.jpg";
  }
  return "/images/hero-lounge.jpg";
}

/* Normaliza un objeto de mueble de la API */
export function normalizarMueble(mueble) {
  if (!mueble) return null;

  const precio = mueble.caracteristicas?.precio
    ? Number(mueble.caracteristicas.precio)
    : mueble.precio
    ? Number(mueble.precio)
    : 0;

  const stock =
    mueble.caracteristicas?.stock !== undefined
      ? Number(mueble.caracteristicas.stock)
      : mueble.stock !== undefined
      ? Number(mueble.stock)
      : 0;

  const categoriaNombre =
    typeof mueble.categoria === "object" && mueble.categoria !== null
      ? mueble.categoria.nombre
      : mueble.categoria_nombre || mueble.categoria || "Living & Sala";

  const categoriaId =
    typeof mueble.categoria === "object" && mueble.categoria !== null
      ? mueble.categoria.id
      : typeof mueble.categoria === "number"
      ? mueble.categoria
      : null;

  const materialNombre =
    typeof mueble.material === "object" && mueble.material !== null
      ? mueble.material.nombre
      : mueble.material_nombre || mueble.material || "Madera Noble";

  const materialId =
    typeof mueble.material === "object" && mueble.material !== null
      ? mueble.material.id
      : typeof mueble.material === "number"
      ? mueble.material
      : null;

  const imagen = mueble.imagen || getFallbackImage(categoriaNombre, mueble.id);

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
    color: mueble.caracteristicas?.color || "Roble Natural",
    dimensiones:
      mueble.caracteristicas?.dimensiones_texto ||
      (mueble.caracteristicas?.alto
        ? `${mueble.caracteristicas.alto} x ${mueble.caracteristicas.ancho} x ${mueble.caracteristicas.profundidad} cm`
        : "Medidas estándar de catálogo"),
    alto: mueble.caracteristicas?.alto || null,
    ancho: mueble.caracteristicas?.ancho || null,
    profundidad: mueble.caracteristicas?.profundidad || null,
    peso: mueble.caracteristicas?.peso || null,
    caracteristica_id: mueble.caracteristicas?.id || null,
    imagen,
    activo: mueble.activo !== false,
    eliminado_logico: Boolean(mueble.eliminado_logico),
    total_vendido: mueble.total_vendido || 0,
    fecha_creacion: mueble.fecha_creacion,
    raw: mueble,
  };
}

/* Cliente HTTP base para realizar peticiones normalizadas a la API */
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
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const resolvedToken = getAuthToken(token);
  const headers = {
    "Content-Type": "application/json",
    ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
    ...customHeaders,
  };

  // Si enviamos FormData (archivos)
  if (customConfig.body instanceof (typeof FormData !== "undefined" ? FormData : Object)) {
    delete headers["Content-Type"];
  }

  let response;
  try {
    response = await fetch(url, {
      ...customConfig,
      headers,
    });
  } catch (netErr) {
    const error = new Error("No fue posible conectar con el servidor de la API.");
    error.status = 0;
    error.network = true;
    error.original = netErr;
    throw error;
  }

  // Respuesta 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const error = new Error(
      (data &&
        (data.detail ||
          data.non_field_errors?.[0] ||
          data.mensaje ||
          (typeof data === "object" ? JSON.stringify(data) : null))) ||
        `Error HTTP ${response.status}: ${response.statusText}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* SERVICIO DE MUEBLES (Catálogo y CRUD principal) */
export const mueblesService = {
  /* Obtiene listado paginado con filtros de búsqueda, categoría, precio y orden */
  async getAll({
    page = 1,
    search = "",
    categoria = "",
    precio_min = "",
    precio_max = "",
    ordering = "",
    limit = 10,
  } = {}) {
    const params = {
      page,
      ...(search ? { search } : {}),
      ...(categoria && categoria !== "todas" ? { categoria } : {}),
      ...(precio_min ? { precio_min } : {}),
      ...(precio_max ? { precio_max } : {}),
      ...(ordering ? { ordering } : {}),
      ...(limit ? { page_size: limit } : {}),
    };

    const data = await apiFetch("/muebles/", { params });
    const rawList = Array.isArray(data) ? data : data.results || [];

    return {
      count: data.count !== undefined ? data.count : rawList.length,
      next: data.next || null,
      previous: data.previous || null,
      results: rawList.map(normalizarMueble),
      raw: data,
    };
  },

  /* Obtiene los muebles más vendidos desde el endpoint especializado del backend */
  async getDestacados(limite = 5) {
    try {
      const data = await apiFetch("/muebles/destacados/", {
        params: { limite },
      });
      const list = Array.isArray(data) ? data : data.results || [];
      return list.map(normalizarMueble);
    } catch (err) {
      console.warn("Fallo al obtener destacados de la API, usando fallback:", err.message);
      return [];
    }
  },

  /* Obtiene el detalle de un mueble por ID */
  async getById(id) {
    const rawMueble = await apiFetch(`/muebles/${id}/`);

    // Si el backend retornó MuebleSerializer sin caracteristicas,
    // buscamos en el listado para completar precio, stock y dimensiones
    if (!rawMueble.caracteristicas) {
      try {
        const searchRes = await apiFetch("/muebles/", {
          params: { search: rawMueble.nombre },
        });
        const match = (searchRes?.results || []).find((m) => m.id === Number(id));
        if (match && match.caracteristicas) {
          rawMueble.caracteristicas = match.caracteristicas;
          if (!rawMueble.categoria && match.categoria) rawMueble.categoria = match.categoria;
          if (!rawMueble.material && match.material) rawMueble.material = match.material;
        }
      } catch {
        // Fallback silencioso si no logra enriquecer
      }
    }

    return normalizarMueble(rawMueble);
  },

  /* Crea un nuevo Mueble y sus Características asociadas */
  async create(formData, token = null) {
    const {
      nombre,
      descripcion,
      categoria,
      material,
      imagen = null,
      alto = 80,
      ancho = 100,
      profundidad = 60,
      peso = 15,
      precio = 0,
      stock = 1,
      color = "Madera Natural",
    } = formData;

    // Crear el Mueble
    const muebleCreado = await apiFetch("/muebles/", {
      method: "POST",
      token,
      body: JSON.stringify({
        nombre,
        descripcion,
        categoria: Number(categoria),
        material: Number(material),
        imagen,
      }),
    });

    // Crear las Características
    let caracteristicasCreadas = null;
    try {
      caracteristicasCreadas = await apiFetch("/caracteristicas/", {
        method: "POST",
        token,
        body: JSON.stringify({
          mueble: muebleCreado.id,
          alto: Number(alto),
          ancho: Number(ancho),
          profundidad: Number(profundidad),
          peso: peso ? Number(peso) : 10,
          precio: Number(precio),
          stock: Number(stock),
          color: color || "Madera Natural",
        }),
      });
    } catch (caracErr) {
      console.warn("No se pudieron asociar las características técnicas:", caracErr);
    }

    return normalizarMueble({
      ...muebleCreado,
      caracteristicas: caracteristicasCreadas,
    });
  },

  /* Actualiza los datos de un Mueble y sus Características */
  async update(id, formData, token = null) {
    const {
      nombre,
      descripcion,
      categoria,
      material,
      imagen,
      caracteristica_id,
      alto,
      ancho,
      profundidad,
      peso,
      precio,
      stock,
      color,
    } = formData;

    // Actualizar Mueble
    const mueblePayload = {};
    if (nombre !== undefined) mueblePayload.nombre = nombre;
    if (descripcion !== undefined) mueblePayload.descripcion = descripcion;
    if (categoria !== undefined) mueblePayload.categoria = Number(categoria);
    if (material !== undefined) mueblePayload.material = Number(material);
    if (imagen !== undefined) mueblePayload.imagen = imagen;

    const muebleActualizado = await apiFetch(`/muebles/${id}/`, {
      method: "PATCH",
      token,
      body: JSON.stringify(mueblePayload),
    });

    // Actualizar Características
    if (
      caracteristica_id &&
      (precio !== undefined ||
        stock !== undefined ||
        alto !== undefined ||
        color !== undefined)
    ) {
      const caracPayload = {};
      if (alto !== undefined) caracPayload.alto = Number(alto);
      if (ancho !== undefined) caracPayload.ancho = Number(ancho);
      if (profundidad !== undefined) caracPayload.profundidad = Number(profundidad);
      if (peso !== undefined) caracPayload.peso = Number(peso);
      if (precio !== undefined) caracPayload.precio = Number(precio);
      if (stock !== undefined) caracPayload.stock = Number(stock);
      if (color !== undefined) caracPayload.color = color;

      try {
        await apiFetch(`/caracteristicas/${caracteristica_id}/`, {
          method: "PATCH",
          token,
          body: JSON.stringify(caracPayload),
        });
      } catch (caracErr) {
        console.warn("Aviso al actualizar características:", caracErr);
      }
    }

    return normalizarMueble(muebleActualizado);
  },

  /* Elimina un Mueble (logico) */
  async delete(id, token = null) {
    return await apiFetch(`/muebles/${id}/`, {
      method: "DELETE",
      token,
    });
  },
};

/* SERVICIO DE CATEGORÍAS */
export const categoriasService = {
  async getAll() {
    const data = await apiFetch("/categorias/");
    const results = Array.isArray(data) ? data : data.results || [];
    return results;
  },
  async getById(id) {
    return await apiFetch(`/categorias/${id}/`);
  },
};

/* SERVICIO DE MATERIALES */
export const materialesService = {
  async getAll() {
    const data = await apiFetch("/materiales/");
    const results = Array.isArray(data) ? data : data.results || [];
    return results;
  },
  async getById(id) {
    return await apiFetch(`/materiales/${id}/`);
  },
};

/* SERVICIO DE SUCURSALES */
export const sucursalesService = {
  async getAll() {
    const data = await apiFetch("/sucursales/");
    const results = Array.isArray(data) ? data : data.results || [];
    return results;
  },
  async getById(id) {
    return await apiFetch(`/sucursales/${id}/`);
  },
};

/**
 * SERVICIO DE AUTENTICACIÓN
 */
export const authService = {
  async login(username, password) {
    return await apiFetch("/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  async refreshToken(refresh) {
    return await apiFetch("/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  },
};

/* SERVICIO DE PEDIDOS (ordenes de compra) */
export const pedidosService = {
  async getAll(token = null) {
    const data = await apiFetch("/pedidos/", { token });
    const results = Array.isArray(data) ? data : data.results || [];
    return results;
  },
  async getById(id, token = null) {
    return await apiFetch(`/pedidos/${id}/`, { token });
  },
  async cancel(id, token = null) {
    return await apiFetch(`/pedidos/${id}/`, {
      method: "DELETE",
      token,
    });
  },
};
