import { normalizarPrecio } from "../utils/normalizarPrecio";

const API_URL = import.meta.env.VITE_API_URL;
const CACHE_KEY = "catalogo_productos_yonimr_v4";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos en sesión

export function limpiarCacheProductos() {
    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch (e) {
        console.warn("[Sesión Local] Error al limpiar caché:", e);
    }
}

export async function obtenerProductos({ forzarRecarga = false } = {}) {
    const inicio = performance.now();

    // 1. Intentar obtener desde la sesión local si no se fuerza la recarga
    if (!forzarRecarga) {
        try {
            const cacheString = sessionStorage.getItem(CACHE_KEY);
            if (cacheString) {
                const { timestamp, datos } = JSON.parse(cacheString);
                const ahora = Date.now();

                if (ahora - timestamp < CACHE_TTL_MS && datos && Array.isArray(datos.productos)) {
                    const fin = performance.now();
                    console.log(
                        `[Sesión Local] ${datos.productos.length} productos cargados instantáneamente desde sessionStorage en ${(fin - inicio).toFixed(2)} ms`
                    );
                    return datos;
                }
            }
        } catch (e) {
            console.warn("[Sesión Local] No se pudo leer el caché de sesión:", e);
        }
    }

    // 2. Si no hay caché válido o se solicitó forzar recarga, consultar a la API
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();

    const productos = [];
    const errores = [];
    const idsExistentes = new Set();

    datos.forEach((producto, index) => {
        let itemNombre = String(producto.nombre || "").trim();
        let itemDescripcion = producto.descripcion ?? producto["descripción"] ?? producto.dimension ?? producto.dimensiones ?? "";
        let itemCategoria = producto.categoria;
        let itemPrecioRaw = producto.precio;
        let itemImagen = producto.imagen;
        let itemActivoRaw = producto.activo;

        // Auto-detección por si las columnas estuvieran desplazadas en versiones antiguas
        const columnasDesplazadas =
            producto.descripcion === undefined &&
            producto["descripción"] === undefined &&
            typeof itemPrecioRaw === "string" &&
            isNaN(Number(itemPrecioRaw)) &&
            normalizarPrecio(itemImagen) !== null &&
            typeof itemActivoRaw === "string" &&
            (itemActivoRaw.startsWith("http://") || itemActivoRaw.startsWith("https://"));

        if (columnasDesplazadas) {
            itemDescripcion = producto.categoria || "";
            itemCategoria = producto.precio || "";
            itemPrecioRaw = producto.imagen;
            itemImagen = producto.activo || "";
            itemActivoRaw = "SI";
        }

        const precio = normalizarPrecio(itemPrecioRaw);

        if (precio === null) {
            errores.push({
                nombre: itemNombre || `Fila ${index + 2}`,
                campo: "precio",
                mensaje: `El precio "${itemPrecioRaw}" no es válido.`
            });
            return;
        }

        // Manejo y validación de ID único
        let rawId = producto.id;
        let id = rawId !== undefined && rawId !== null && rawId !== "" ? Number(rawId) : index + 1;

        if (isNaN(id) || idsExistentes.has(id)) {
            const idOriginal = rawId ?? "sin ID";
            id = `item-${index + 1}`;
            errores.push({
                nombre: itemNombre || `Fila ${index + 2}`,
                campo: "id",
                mensaje: `El ID "${idOriginal}" está repetido o no es válido (fila ${index + 2}). Se le asignó un identificador único seguro.`
            });
        }
        idsExistentes.add(id);

        const nombreLimpio = itemNombre;
        const descripcionLimpia = String(itemDescripcion || "").trim();
        const categoriaLimpia = String(itemCategoria || "").trim();

        productos.push({
            id: id,
            nombre: nombreLimpio,
            descripcion: descripcionLimpia,
            categoria: categoriaLimpia,
            precio: precio,
            imagen: String(itemImagen || "").trim(),
            activo: String(itemActivoRaw || "").trim().toUpperCase() === "SI",
            categoriaLower: categoriaLimpia.toLowerCase(),
            _busqueda: `${nombreLimpio} ${categoriaLimpia} ${descripcionLimpia}`.toLowerCase()
        });
    });

    const resultado = {
        productos,
        errores
    };

    // 3. Guardar en sesión local para próximas visitas/navegaciones
    try {
        sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                datos: resultado
            })
        );
    } catch (e) {
        console.warn("[Sesión Local] No se pudo almacenar en sessionStorage:", e);
    }

    const fin = performance.now();
    console.log(
        `[API Red] Tiempo total de descarga y procesamiento: ${(fin - inicio).toFixed(2)} ms`
    );

    return resultado;
}