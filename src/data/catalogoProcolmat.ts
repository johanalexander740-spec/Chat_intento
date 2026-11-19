export interface ProductoProcolmatCSV {
  categoria: string;
  producto: string;
  presentacion: string;
  precio: string;
  moneda: string;
  observaciones: string;
}

export interface FuenteVerificable {
  id: "web" | "csv" | "pdf";
  etiqueta: string;
  url: string;
  descripcion: string;
}

export const EMPRESA_PROCOLMAT = {
  nombre: "PROCOLMAT",
  razonSocial: "Productora Colombiana de Materiales",
  ciudadBase: "Medellín, Colombia",
  experiencia: "Más de 7 años de experiencia",
  lema: "En Procolmat encuentras variedad, calidad y un equipo que te respalda.",
  perfil:
    "Empresa colombiana FABRICANTE de productos para acabados arquitectónicos y soluciones para la industria de la construcción.",
  sitioWeb: "www.procolmat.com",
  sitioWebUrl: "https://www.procolmat.com",
  whatsappNumero: "+57 317 5152559",
  whatsappUrl: "https://wa.me/573175152559",
} as const;

export const FUENTES_PROCOLMAT: Record<"web" | "csv" | "pdf", FuenteVerificable> = {
  web: {
    id: "web",
    etiqueta: "www.procolmat.com",
    url: "https://www.procolmat.com",
    descripcion: "Sitio web oficial de productos PROCOLMAT",
  },
  csv: {
    id: "csv",
    etiqueta: "Catálogo de precios y fichas (CSV)",
    url: "/assets/aistudio/Procolmat_precios_y_fichas_tecnicas_a087d091.csv",
    descripcion: "Procolmat_precios_y_fichas_tecnicas_a087d091.csv",
  },
  pdf: {
    id: "pdf",
    etiqueta: "Contexto corporativo y FAQ (PDF)",
    url: "/assets/aistudio/Contexto_para_el_chat_bot_0ef28ac8.pdf",
    descripcion: "Contexto_para_el_chat_bot_0ef28ac8.pdf",
  },
};

export function buildWhatsAppLink(mensajePrefill?: string): string {
  if (!mensajePrefill) return EMPRESA_PROCOLMAT.whatsappUrl;
  return `${EMPRESA_PROCOLMAT.whatsappUrl}?text=${encodeURIComponent(mensajePrefill)}`;
}

/* ============================================================================
 * BASE DE DATOS DE PRODUCTOS PROCOLMAT (EXACTA DEL ARCHIVO CSV OFICIAL)
 * Fuente: /assets/aistudio/Procolmat_precios_y_fichas_tecnicas_a087d091.csv
 *
 * Para actualizar desde Excel/CSV:
 * Reemplaza los objetos de este arreglo manteniendo los campos:
 * { categoria, producto, presentacion, precio, moneda, observaciones }
 * ============================================================================ */
export const CATALOGO_PROCOLMAT: ProductoProcolmatCSV[] = [
  // Pegantes
  { categoria: "Pegantes", producto: "Pegante Cerámico Látex", presentacion: "25 kg", precio: "$13,500", moneda: "COP", observaciones: "Precio publicado; confirmar vigencia" },
  { categoria: "Pegantes", producto: "Pegante Porcelánico", presentacion: "25 kg", precio: "$22,500", moneda: "COP", observaciones: "Precio publicado; confirmar vigencia" },
  { categoria: "Pegantes", producto: "Pegante Porcelánico Grandes Formatos", presentacion: "25 kg", precio: "$41,500", moneda: "COP", observaciones: "Precio publicado; confirmar variante/color" },
  { categoria: "Pegantes", producto: "Pegante Capa Gruesa", presentacion: "No especificada", precio: "$60,000", moneda: "COP", observaciones: "Presentación por confirmar" },
  { categoria: "Pegantes", producto: "Pegante para Piscinas Flex", presentacion: "25 kg", precio: "$70,000", moneda: "COP", observaciones: "Precio publicado; confirmar vigencia" },
  { categoria: "Pegantes", producto: "Pegante Alto Desempeño", presentacion: "25 kg", precio: "$90,000", moneda: "COP", observaciones: "Precio publicado; confirmar vigencia" },

  // Estucos y masillas
  { categoria: "Estucos y masillas", producto: "Estuco Plástico", presentacion: "Bolsa 1 kg", precio: "$2,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Estuco Plástico Interior", presentacion: "Galón", precio: "$14,500", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Estuco Plástico Interior", presentacion: "Balde 14 kg", precio: "$27,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Estuco en Polvo", presentacion: "25 kg", precio: "$37,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Estuco Plástico Interior", presentacion: "Cuñete 28 kg", precio: "$44,500", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Masilla para Drywall", presentacion: "Galón 5,6 kg", precio: "$19,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Estucos y masillas", producto: "Masilla para Drywall", presentacion: "Cuñete 28 kg", precio: "$52,500", moneda: "COP", observaciones: "Precio publicado" },

  // Impermeabilizantes
  { categoria: "Impermeabilizantes", producto: "Impermeabilizante Acrílico Gris", presentacion: "1/4", precio: "$16,500", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Impermeabilizantes", producto: "Impermeabilizante Acrílico Gris", presentacion: "Galón", precio: "$53,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Impermeabilizantes", producto: "Impermeabilizante Acrílico Gris", presentacion: "Balde", precio: "$138,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Impermeabilizantes", producto: "Impermeabilizante Acrílico Gris", presentacion: "Cuñete", precio: "$271,000", moneda: "COP", observaciones: "Precio publicado" },

  // Lechadas
  { categoria: "Lechadas", producto: "Lechada Cerámica", presentacion: "1 kg", precio: "$4,100", moneda: "COP", observaciones: "Precio publicado; confirmar color" },
  { categoria: "Lechadas", producto: "Lechada Cerámica", presentacion: "2 kg", precio: "$6,500", moneda: "COP", observaciones: "Hay variantes con precios diferentes; confirmar color" },
  { categoria: "Lechadas", producto: "Lechada Cerámica", presentacion: "5 kg", precio: "$13,000", moneda: "COP", observaciones: "Precio publicado; confirmar color" },

  // Pinturas
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 1", presentacion: "1/4", precio: "$14,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 1", presentacion: "Galón", precio: "$40,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 1", presentacion: "Balde", precio: "$91,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 1", presentacion: "Cuñete", precio: "$160,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 2", presentacion: "Galón", precio: "$32,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 2", presentacion: "Balde", precio: "$69,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 2", presentacion: "Cuñete", precio: "$116,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 3", presentacion: "Galón", precio: "$26,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 3", presentacion: "Balde", precio: "$48,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Premium Blanca Tipo 3", presentacion: "Cuñete", precio: "$91,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Pintura Epóxica + Catalizador", presentacion: "No especificada", precio: "$180,000", moneda: "COP", observaciones: "Presentación por confirmar" },
  { categoria: "Pinturas", producto: "Dicolore Anticorrosivo Negro", presentacion: "1/4", precio: "$19,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Dicolore Anticorrosivo Negro", presentacion: "Galón", precio: "$63,000", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Dicolore Antibacterial", presentacion: "Cuñete", precio: "$249,900", moneda: "COP", observaciones: "Precio publicado" },
  { categoria: "Pinturas", producto: "Dicolore Fachada Blanco", presentacion: "Cuñete", precio: "$300,000", moneda: "COP", observaciones: "Precio publicado" },
];

export interface GuiaTecnicaProducto {
  producto: string;
  resumenTecnico: string;
  alias: string[];
}

export const GUIAS_PRODUCTOS: GuiaTecnicaProducto[] = [
  {
    producto: "Pegante Cerámico Látex",
    resumenTecnico: "Diseñado para instalaciones convencionales de cerámica en pisos y muros interiores.",
    alias: ["ceramico", "ceramica", "latex", "baldosa", "enchape", "piso interior", "muro interior", "convencional"],
  },
  {
    producto: "Pegante Porcelánico",
    resumenTecnico: "Adhesivo formulado para instalación de porcelanato estándar.",
    alias: ["porcelanico", "porcelanato", "porcelana", "gres"],
  },
  {
    producto: "Pegante Porcelánico Grandes Formatos",
    resumenTecnico: "Recomendado para piezas de porcelanato y formatos grandes (mayores a 60x60 cm).",
    alias: ["grandes formatos", "gran formato", "formato grande", "60x60", "80x80", "120x60", "rectificado", "placa grande"],
  },
  {
    producto: "Pegante Capa Gruesa",
    resumenTecnico: "Solución de pegante para aplicaciones que requieren mayor espesor de cama o nivelación.",
    alias: ["capa gruesa", "gruesa", "espesor", "nivelacion"],
  },
  {
    producto: "Pegante para Piscinas Flex",
    resumenTecnico: "Especializado para inmersión permanente en agua, piscinas, tanques y zonas húmedas exigentes.",
    alias: ["piscina", "piscinas", "flex", "tanque", "alberca", "jacuzzi", "fuente", "inmersion", "sumergido"],
  },
  {
    producto: "Pegante Alto Desempeño",
    resumenTecnico: "Para aplicaciones de alta exigencia técnica como fachadas, zonas húmedas, exteriores y revestimientos complejos.",
    alias: ["alto desempeno", "alto rendimiento", "fachada", "exteriores", "exterior", "fibrocemento", "zona humeda", "exigente"],
  },
  {
    producto: "Estuco Plástico",
    resumenTecnico: "Estuco listo para preparar, nivelar y dar acabado liso a paredes (presentación Bolsa 1 kg).",
    alias: ["estuco plastico 1 kg", "bolsa 1 kg", "estuco bolsa", "estuco pequeno"],
  },
  {
    producto: "Estuco Plástico Interior",
    resumenTecnico: "Estuco plástico para preparación, nivelación y acabado liso en paredes y techos interiores.",
    alias: ["estuco plastico", "estuco interior", "estuco listo", "estuco", "pared", "alisar", "nivelar"],
  },
  {
    producto: "Estuco en Polvo",
    resumenTecnico: "Estuco en polvo en presentación de 25 kg para preparación y afinado de superficies.",
    alias: ["estuco en polvo", "estuco polvo", "polvo 25", "repello"],
  },
  {
    producto: "Masilla para Drywall",
    resumenTecnico: "Masilla formulada para juntas, tratamiento y acabado liso en placas de drywall.",
    alias: ["masilla", "drywall", "dry wall", "pladur", "junta drywall", "panel yeso", "gyplac"],
  },
  {
    producto: "Impermeabilizante Acrílico Gris",
    resumenTecnico: "Protección acrílica flexible contra humedad y filtraciones en cubiertas, techos, muros y terrazas.",
    alias: ["impermeabilizante", "impermeabilizar", "acrilico", "gris", "humedad", "filtracion", "gotera", "cubierta", "techo", "terraza", "bano"],
  },
  {
    producto: "Lechada Cerámica",
    resumenTecnico: "Lechada especializada para emboquillar y sellar juntas entre cerámicas y revestimientos (confirmar color).",
    alias: ["lechada", "boquilla", "emboquillador", "juntas", "fragua", "sella juntas"],
  },
  {
    producto: "Pintura Premium Blanca Tipo 1",
    resumenTecnico: "Pintura arquitectónica blanca Tipo 1 de alta calidad para protección y acabado superior.",
    alias: ["pintura tipo 1", "tipo 1", "vinilo tipo 1", "premium tipo 1", "lavable"],
  },
  {
    producto: "Pintura Premium Blanca Tipo 2",
    resumenTecnico: "Pintura arquitectónica blanca Tipo 2 para acabados interiores.",
    alias: ["pintura tipo 2", "tipo 2", "vinilo tipo 2", "premium tipo 2"],
  },
  {
    producto: "Pintura Premium Blanca Tipo 3",
    resumenTecnico: "Pintura blanca Tipo 3 para acabado económico en interiores o techos.",
    alias: ["pintura tipo 3", "tipo 3", "vinilo tipo 3", "premium tipo 3"],
  },
  {
    producto: "Pintura Epóxica + Catalizador",
    resumenTecnico: "Sistema epóxico de dos componentes con catalizador para recubrimientos de alta resistencia.",
    alias: ["epoxica", "epoxico", "epoxi", "catalizador", "industrial", "piso epoxico"],
  },
  {
    producto: "Dicolore Anticorrosivo Negro",
    resumenTecnico: "Recubrimiento anticorrosivo Dicolore color negro para protección de superficies metálicas.",
    alias: ["anticorrosivo", "dicolore negro", "oxido", "metal", "hierro", "reja", "negro"],
  },
  {
    producto: "Dicolore Antibacterial",
    resumenTecnico: "Pintura Dicolore con protección antibacterial para espacios que exigen higiene especializada.",
    alias: ["antibacterial", "dicolore antibacterial", "clinica", "hospital", "cocina", "asepsia"],
  },
  {
    producto: "Dicolore Fachada Blanco",
    resumenTecnico: "Pintura Dicolore diseñada para protección y acabado blanco en fachadas exteriores.",
    alias: ["dicolore fachada", "pintura fachada", "fachada blanco", "pintura exterior"],
  },
];
