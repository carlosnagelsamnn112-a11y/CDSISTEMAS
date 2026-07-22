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
  },
  {
    titulo: "Café & Aroma",
    categoria: "MENÚ DIGITAL / WEB",
    descripcion: "Menú interactivo digital para cafeterías y restaurantes. Permite ver platillos por categorías, armar un carrito de compras y generar un pedido automatizado y estructurado directo a WhatsApp.",
    archivo: "Ejemplo-menu-restaurante-whatsapp.html"
  },
  {
    titulo: "DentiSalud Citas",
    categoria: "PORTAL DE RESERVAS",
    descripcion: "Portal web de agendamiento para centros de salud y estética. Permite seleccionar especialista, elegir fecha en un calendario interactivo, seleccionar horario disponible y generar un ticket digital de confirmación.",
    archivo: "Ejemplo-agendamiento-citas-odontologia.html"
  },
  {
    titulo: "Innova CRM",
    categoria: "SISTEMA CRM / DASHBOARD",
    descripcion: "Panel de gestión de relaciones con clientes. Incluye tablero Kanban con etapas de ventas, métricas de conversión, gráficos de ingresos y gestión interactiva de leads con avance y retroceso entre etapas.",
    archivo: "Ejemplo-crm-dashboard-ventas.html"
  },
  {
    titulo: "FacTurApp",
    categoria: "SISTEMA DE FACTURACIÓN",
    descripcion: "Sistema de facturación electrónica con gestión de clientes, creación de facturas con cálculo automático de IVA, exportación a PDF y dashboard con métricas de cobro y pendientes.",
    archivo: "Ejemplo-sistema-facturacion.html"
  },
  {
    titulo: "UrbanFit Tienda",
    categoria: "TIENDA ONLINE / WEB",
    descripcion: "Tienda de ropa y calzado urbano con catálogo filtrable por categoría, selector de tallas, carrito de compras con drawer lateral y checkout integrado con WhatsApp.",
    archivo: "Ejemplo-tienda-ropa.html"
  },
  {
    titulo: "RápidoExpress",
    categoria: "APLICACIÓN MÓVIL",
    descripcion: "Aplicación de delivery y pedidos a domicilio con menú por categorías, carrito flotante, seguimiento de pedido en tiempo real y confirmación por WhatsApp.",
    archivo: "Ejemplo-app-delivery.html"
  },
  {
    titulo: "Hotel ManagePro",
    categoria: "SISTEMA DE GESTIÓN",
    descripcion: "Panel de gestión hotelera con control de habitaciones, reservas, huéspedes y dashboard de ocupación. Incluye calendario de reservas y toggle de estados de habitaciones.",
    archivo: "Ejemplo-panel-hotel.html"
  },
  {
    titulo: "SocialMetrics",
    categoria: "SISTEMA CRM / DASHBOARD",
    descripcion: "Dashboard de análisis de redes sociales con métricas de engagement, programador de contenido, gráficos de crecimiento de seguidores y calendario de publicaciones.",
    archivo: "Ejemplo-dashboard-redes.html"
  }
];
