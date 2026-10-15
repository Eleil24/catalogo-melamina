import { useEffect } from "react";
import { generarLinkWhatsApp } from "../utils/whatsapp";
import "./ModalImagen.css";

export default function ModalImagen({ producto, alCerrar }) {
  const whatsappUrl = generarLinkWhatsApp(producto);
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
              <div className="modal-dimension-header">
                <span className="dimension-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="7" y="2" width="10" height="20" rx="1.5" />
                    <line x1="7" y1="6" x2="11" y2="6" />
                    <line x1="7" y1="10" x2="13" y2="10" />
                    <line x1="7" y1="14" x2="11" y2="14" />
                    <line x1="7" y1="18" x2="13" y2="18" />
                  </svg>
                  <span>Alto</span>
                </span>

                <span className="dimension-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="5 9 2 12 5 15" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <polyline points="19 9 22 12 19 15" />
                  </svg>
                  <span>Ancho</span>
                </span>

                <span className="dimension-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>Fondo</span>
                </span>
              </div>
              <p className="modal-dimension-texto">{producto.descripcion}</p>
            </div>
          ) : null}

          <div className="modal-precio-fila">
            <div className="modal-precio-box">
              <span className="modal-precio-etiqueta">Precio:</span>
              <span className="modal-producto-precio">
                S/ {typeof producto.precio === "number" ? producto.precio.toFixed(2) : producto.precio}
              </span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-modal"
              title="Consultar por WhatsApp"
              aria-label={`Consultar por WhatsApp sobre ${producto.nombre}`}
            >
              <svg
                className="icono-whatsapp"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 15 3.8 13.48 3.8 11.91C3.8 7.37 7.49 3.67 12.05 3.67M9.11 7.44C8.94 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.76C7.62 10.96 8.5 12.12 8.62 12.28C8.74 12.44 10.33 14.9 12.8 15.96C15.26 17.03 15.26 16.68 15.7 16.64C16.14 16.6 17.11 16.07 17.31 15.51C17.51 14.95 17.51 14.47 17.45 14.37C17.39 14.27 17.22 14.21 16.96 14.08C16.7 13.95 15.44 13.33 15.21 13.25C14.98 13.16 14.81 13.12 14.64 13.38C14.47 13.63 13.99 14.21 13.84 14.37C13.7 14.54 13.55 14.56 13.29 14.43C13.03 14.31 12.2 14.03 11.21 13.16C10.44 12.48 9.92 11.63 9.77 11.37C9.62 11.11 9.75 10.98 9.88 10.85C10 10.74 10.15 10.55 10.28 10.39C10.41 10.23 10.45 10.11 10.54 9.94C10.63 9.78 10.58 9.63 10.52 9.51C10.45 9.39 9.97 8.21 9.77 7.73C9.57 7.24 9.37 7.31 9.22 7.31L9.11 7.44Z"/>
              </svg>
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
