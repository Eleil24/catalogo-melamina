import { useState, memo } from "react";
import "./ProductoCard.css";

function ProductoCard({ producto }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="producto-card">
      <div className="producto-imagen-contenedor">
        {producto.imagen && !imgError ? (
          <img
            className="producto-imagen"
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImgError(true)}
          />
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