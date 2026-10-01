export function filtrarProductos(productos, busqueda = "", categoriaSeleccionada = "TODOS") {
    const texto = busqueda.toLowerCase().trim();
    const categoriaFiltro = categoriaSeleccionada ? categoriaSeleccionada.trim().toLowerCase() : "todos";
    const filtrarPorCategoria = Boolean(categoriaFiltro && categoriaFiltro !== "todos");

    return productos.filter((producto) => {
        if (!producto.activo) return false;

        if (filtrarPorCategoria) {
            const cat = producto.categoriaLower ?? (producto.categoria ? producto.categoria.trim().toLowerCase() : "");
            if (cat !== categoriaFiltro) {
                return false;
            }
        }

        if (!texto) return true;

        const strBusqueda = producto._busqueda ?? `${producto.nombre} ${producto.categoria}`.toLowerCase();
        return strBusqueda.includes(texto);
    });
}