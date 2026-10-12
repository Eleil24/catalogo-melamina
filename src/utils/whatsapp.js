/**
 * Genera el enlace de WhatsApp con el número configurado en VITE_WHATSAPP_NUMBER
 * y el mensaje predeterminado con los datos del producto seleccionado.
 */
export function generarLinkWhatsApp(producto) {
  if (!producto) return "#";

  const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "961708410";
  const digitos = String(rawNumber).replace(/\D/g, "");
  
  // Si tiene 9 dígitos (número móvil típico en Perú), agregar prefijo de país 51
  const telefono = digitos.length === 9 ? `51${digitos}` : digitos;

  const precioTexto =
    typeof producto.precio === "number"
      ? producto.precio.toFixed(2)
      : producto.precio || "0.00";

  const lineas = [
    "Hola, quisiera más información sobre este producto:",
    "",
    `• *Producto:* ${producto.nombre}`
  ];

  if (producto.descripcion && producto.descripcion.trim()) {
    lineas.push(`• *Descripción:* ${producto.descripcion.trim()}`);
  }

  lineas.push(`• *Precio:* S/ ${precioTexto}`);

  const mensaje = lineas.join("\n");
  return `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
}
