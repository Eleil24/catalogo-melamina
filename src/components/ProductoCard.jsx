import { useState, memo } from "react";
import "./ProductoCard.css";

function ProductoCard({ producto, onVerImagen }) {
  const [imgError, setImgError] = useState(false);
  const tieneImagen = Boolean(producto.imagen && !imgError);

  const manejarClickImagen = () => {
    if (tieneImagen && onVerImagen) {
      onVerImagen(producto);
    }
  };

  return (
    <article className="producto-card">
      <div
        className={`producto-imagen-contenedor ${tieneImagen ? "con-zoom" : ""}`}
        onClick={manejarClickImagen}
        role={tieneImagen ? "button" : undefined}
        tabIndex={tieneImagen ? 0 : undefined}
        aria-label={tieneImagen ? `Ver foto grande de ${producto.nombre}` : undefined}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && tieneImagen) {
            e.preventDefault();
            manejarClickImagen();
          }
        }}
      >
        {tieneImagen ? (
          <>
            <img
              className="producto-imagen"
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <span className="producto-zoom-hint" title="Toca para ampliar foto">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </span>
          </>
        ) : (
          <div className="producto-imagen-fallback">
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      <div className="producto-contenido">
        <span className="producto-categoria-badge">
          {producto.categoria || "General"}
        </span>

        <h2 className="producto-nombre" title={producto.nombre}>
          {producto.nombre}
        </h2>

        {producto.descripcion ? (
          <div className="producto-dimension-box">
            <span className="producto-dimension-label">Dimensión:</span>
            <p className="producto-dimension-texto">{producto.descripcion}</p>
          </div>
        ) : null}

        <div className="producto-footer">
          <div className="producto-precio-box">
            <span className="producto-precio-label">Precio</span>
            <p className="producto-precio">
              S/ {producto.precio.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductoCard);