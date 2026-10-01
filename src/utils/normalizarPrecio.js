export function normalizarPrecio(valor) {
    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    const precioLimpio = String(valor).trim().replace(",", ".");
    const precio = Number(precioLimpio);

    if (Number.isNaN(precio) || precio < 0) {
        return null;
    }

    return precio;
}