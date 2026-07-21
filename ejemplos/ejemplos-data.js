/**
 * Catálogo de ejemplos interactivos para CD Sistemas.
 * Para añadir un nuevo ejemplo, simplemente coloca el archivo HTML en esta carpeta
 * y añade un nuevo objeto al array con la siguiente estructura:
 * 
 * {
 *   titulo: "Nombre del negocio o aplicación",
 *   categoria: "Tipo de software (ej. PÁGINA WEB, APLICACIÓN, SISTEMA)",
 *   descripcion: "Breve explicación comercial de lo que hace el software y su utilidad.",
 *   archivo: "Nombre-del-archivo.html"
 * }
 */

const ejemplosData = [
  {
    titulo: "Ferretera del Norte",
    categoria: "SISTEMA DE INVENTARIO",
    descripcion: "Sistema de gestión de inventarios para ferreterías con control de stock en tiempo real, alertas de existencias bajas, registro de productos y simulación de ventas con facturación.",
    archivo: "Ejemplo-sistema-inventarios-ferreteria.html"
  },
  {
    titulo: "El Corte Barbería",
    categoria: "APLICACIÓN MÓVIL",
    descripcion: "Aplicación móvil para barberías y salones de belleza. Permite a los clientes agendar citas en línea, seleccionar barbero, ver servicios disponibles y gestionar turnos en tiempo real.",
    archivo: "Ejemplo-app-movil-barneria.html"
  },
  {
    titulo: "iStore Apple Shop",
    categoria: "TIENDA ONLINE / WEB",
    descripcion: "Página web tipo tienda de productos Apple. Cuenta con catálogo interactivo de dispositivos, carrito de compras dinámico, sección de ubicación y enlace de contacto directo.",
    archivo: "Ejemplo-tienda-apple.html"
  },
  {
    titulo: "Panadería El Trigal",
    categoria: "PÁGINA WEB COMERCIAL",
    descripcion: "Sitio web elegante y responsivo para panaderías y reposterías. Presentación de productos, menú interactivo con precios, historia y formulario integrado para cotizar pedidos especiales.",
    archivo: "Ejemplo-pagina-web-panaderia.html"
  }
];
