import { useEffect } from "react";
import "./ModalImagen.css";

export default function ModalImagen({ producto, alCerrar }) {
  useEffect(() => {
    if (!producto) return;

    // Bloquear scroll del fondo en móviles y pantallas completas
    const scrollOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Cerrar presionando tecla Escape
    const manejarKeyDown = (e) => {
      if (e.key === "Escape") {
        alCerrar();
      }
    };

    window.addEventListener("keydown", manejarKeyDown);

    return () => {
      document.body.style.overflow = scrollOriginal;
      window.removeEventListener("keydown", manejarKeyDown);
    };
  }, [producto, alCerrar]);

  if (!producto) return null;

  return (
    <div
      className="modal-imagen-overlay"
      onClick={alCerrar}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto de ${producto.nombre}`}
    >
      <div
        className="modal-imagen-tarjeta"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="modal-imagen-header">
          <span className="modal-badge-categoria">
            {producto.categoria || "Melamina"}
          </span>
          <button
            className="modal-btn-cerrar"
            onClick={alCerrar}
            aria-label="Cerrar vista previa"
          >
            ✕
          </button>
        </div>

        {/* Contenedor de la foto grande (object-fit: contain para evitar deformaciones) */}
        <div className="modal-imagen-cuerpo">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="modal-foto-grande"
          />
        </div>

        {/* Pie con detalles del producto */}
        <div className="modal-imagen-footer">
          <h3 className="modal-producto-nombre">{producto.nombre}</h3>
          
          {producto.descripcion ? (
            <div className="modal-dimension-box">
              <span className="modal-dimension-etiqueta">Dimensión:</span>
              <p className="modal-dimension-texto">{producto.descripcion}</p>
            </div>
          ) : null}

          <div className="modal-precio-fila">
            <span className="modal-precio-etiqueta">Precio:</span>
            <span className="modal-producto-precio">
              S/ {typeof producto.precio === "number" ? producto.precio.toFixed(2) : producto.precio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
