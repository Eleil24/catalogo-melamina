import { useEffect, useState, useMemo, useDeferredValue, useRef } from "react";
import ProductoCard from "./components/ProductoCard";
import { obtenerProductos } from "./services/productosService";
import { filtrarProductos } from "./utils/filtrarProductos";
import "./App.css";

const PRODUCTOS_POR_PAGINA = 36;

function App() {
  const [productos, setProductos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const busquedaDiferida = useDeferredValue(busqueda);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS");
  const [limiteVisibles, setLimiteVisibles] = useState(PRODUCTOS_POR_PAGINA);
  const [mostrarObservaciones, setMostrarObservaciones] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [recargando, setRecargando] = useState(false);
  const [error, setError] = useState(null);

  const observadorRef = useRef(null);

  const refrescarCatalogo = (forzar = true) => {
    if (productos.length > 0) {
      setRecargando(true);
    } else {
      setCargando(true);
    }
    setError(null);

    obtenerProductos({ forzarRecarga: forzar })
      .then((datos) => {
        setProductos(datos.productos);
        setErrores(datos.errores);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setCargando(false);
        setRecargando(false);
      });
  };

  useEffect(() => {
    obtenerProductos({ forzarRecarga: false })
      .then((datos) => {
        setProductos(datos.productos);
        setErrores(datos.errores);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Extraer categorías únicas disponibles
  const categorias = useMemo(() => {
    const list = productos
      .map((p) => p.categoria?.trim())
      .filter((cat) => Boolean(cat));
    return ["TODOS", ...Array.from(new Set(list))];
  }, [productos]);

  // Total de productos disponibles en la categoría activa
  const totalEnCategoria = useMemo(() => {
    if (!categoriaSeleccionada || categoriaSeleccionada.toUpperCase() === "TODOS") {
      return productos.length;
    }
    const catFiltro = categoriaSeleccionada.trim().toLowerCase();
    return productos.filter((p) => {
      if (!p.activo) return false;
      const cat = p.categoriaLower ?? (p.categoria ? p.categoria.trim().toLowerCase() : "");
      return cat === catFiltro;
    }).length;
  }, [productos, categoriaSeleccionada]);

  // Filtrado optimizado con valor diferido para que el input no se trabe
  const productosFiltrados = useMemo(() => {
    return filtrarProductos(productos, busquedaDiferida, categoriaSeleccionada);
  }, [productos, busquedaDiferida, categoriaSeleccionada]);

  // Lista recortada para renderizado instantáneo en el DOM (36 en 36)
  const productosVisibles = useMemo(() => {
    return productosFiltrados.slice(0, limiteVisibles);
  }, [productosFiltrados, limiteVisibles]);

  const hayMasProductos = productosVisibles.length < productosFiltrados.length;

  // Carga automática al hacer scroll cerca del final
  useEffect(() => {
    if (!hayMasProductos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimiteVisibles((prev) => prev + PRODUCTOS_POR_PAGINA);
        }
      },
      { rootMargin: "350px" }
    );

    const elemento = observadorRef.current;
    if (elemento) {
      observer.observe(elemento);
    }

    return () => observer.disconnect();
  }, [hayMasProductos, productosVisibles.length]);

  if (cargando) {
    return (
      <div className="estado-contenedor">
        <div className="spinner"></div>
        <p className="estado-texto">Cargando catálogo de Inversiones Yonimr...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estado-contenedor">
        <div className="error-icono">⚠️</div>
        <p className="estado-texto">{error}</p>
        <button
          className="btn-reintentar"
          onClick={() => refrescarCatalogo(true)}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="catalogo-app">
      {/* Header móvil */}
      <header className="catalogo-header">
        <div className="header-badge">INVERSIONES YONIMR</div>
        <h1 className="header-titulo">Catálogo de Productos</h1>
      </header>

      {/* Barra de búsqueda móvil */}
      <div className="busqueda-wrapper">
        <div className="busqueda-caja">
          <svg
            className="busqueda-icono"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            className="busqueda-input"
            type="text"
            placeholder="Buscar herramienta, material..."
            value={busqueda}
            onChange={(evento) => {
              setBusqueda(evento.target.value);
              setLimiteVisibles(PRODUCTOS_POR_PAGINA);
            }}
          />

          {busqueda && (
            <button
              className="busqueda-limpiar"
              onClick={() => {
                setBusqueda("");
                setLimiteVisibles(PRODUCTOS_POR_PAGINA);
              }}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categorías deslizables estilo pills para celular */}
      {categorias.length > 1 && (
        <div className="categorias-scroll-container">
          <div className="categorias-scroll">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`categoria-pill ${categoriaSeleccionada === cat ? "activa" : ""
                  }`}
                onClick={() => {
                  setCategoriaSeleccionada(cat);
                  setLimiteVisibles(PRODUCTOS_POR_PAGINA);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Banner de Observaciones de datos (si existen) */}
      {errores.length > 0 && (
        <div className="observaciones-banner">
          <div className="observaciones-header">
            <span className="observaciones-alerta">
              ⚠️ <strong>{errores.length}</strong> {errores.length === 1 ? "observación" : "observaciones"} en datos del catálogo
            </span>
            <button
              className="observaciones-toggle"
              onClick={() => setMostrarObservaciones(!mostrarObservaciones)}
            >
              {mostrarObservaciones ? "Ocultar" : "Ver detalles"}
            </button>
          </div>

          {mostrarObservaciones && (
            <ul className="observaciones-lista">
              {errores.map((err, index) => (
                <li key={index} className="observacion-item">
                  <strong>{err.nombre || "Fila sin nombre"}:</strong> {err.mensaje}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="catalogo-info-bar">
        <span className="conteo-texto">
          Mostrando <strong>{productosFiltrados.length}</strong> de {totalEnCategoria} productos
          {categoriaSeleccionada !== "TODOS" && (
            <span className="conteo-total-filtro"> ({productos.length} totales)</span>
          )}
        </span>
        <div className="info-bar-acciones">
          <button
            className="btn-actualizar-catalogo"
            onClick={() => refrescarCatalogo(true)}
            title="Sincronizar cambios recientes de la hoja de cálculo"
            disabled={recargando}
          >
            <span className={recargando ? "icono-girando" : ""}>🔄</span>
            {recargando ? "Sincronizando..." : "Actualizar"}
          </button>
          {(busqueda || categoriaSeleccionada !== "TODOS") && (
            <button
              className="btn-limpiar-filtros"
              onClick={() => {
                setBusqueda("");
                setCategoriaSeleccionada("TODOS");
                setLimiteVisibles(PRODUCTOS_POR_PAGINA);
              }}
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de productos */}
      {productosVisibles.length > 0 ? (
        <>
          <main className="productos-grid">
            {productosVisibles.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </main>

          {hayMasProductos && (
            <div ref={observadorRef} className="cargar-mas-contenedor">
              <button
                className="btn-cargar-mas"
                onClick={() => setLimiteVisibles((prev) => prev + PRODUCTOS_POR_PAGINA)}
              >
                Cargar más productos ({productosFiltrados.length - productosVisibles.length} restantes)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="sin-resultados">
          <div className="sin-resultados-icono">🔍</div>
          <h3>No se encontraron productos</h3>
          <p>
            No hay resultados para "{busqueda}". Intenta con otra búsqueda o categoría.
          </p>
          <button
            className="btn-limpiar-filtros"
            onClick={() => {
              setBusqueda("");
              setCategoriaSeleccionada("TODOS");
              setLimiteVisibles(PRODUCTOS_POR_PAGINA);
            }}
          >
            Ver todos los productos
          </button>
        </div>
      )}

      <footer className="catalogo-pie">
        <p>© Inversiones Yonimr - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default App;