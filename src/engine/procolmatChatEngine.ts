import {
  CATALOGO_PROCOLMAT,
  EMPRESA_PROCOLMAT,
  FUENTES_PROCOLMAT,
  FuenteVerificable,
  GUIAS_PRODUCTOS,
  ProductoProcolmatCSV,
  buildWhatsAppLink,
} from "../data/catalogoProcolmat";

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  productos?: ProductoProcolmatCSV[];
  fuentes?: FuenteVerificable[];
  whatsappCta?: {
    label: string;
    url: string;
  };
  sugerencias?: string[];
  esFallback?: boolean;
}

export const SUGERENCIAS_INICIALES: string[] = [
  "¿Qué pegante sirve para porcelanato?",
  "Precios de impermeabilizante acrílico",
  "Estuco y masilla para drywall",
  "Pinturas Tipo 1, 2, 3 y Dicolore",
  "¿Realizan envíos a domicilio?",
  "¿Qué es PROCOLMAT?",
];

// Normalización básica sin tildes ni puntuación
function normalizeBase(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/(.)\1{2,}/g, "$1$1")
    .replace(/[^\w\s/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Normalización fonética tolerante a errores ortográficos comunes en español
function phoneticKey(word: string): string {
  return word
    .replace(/h/g, "")
    .replace(/v/g, "b")
    .replace(/z/g, "s")
    .replace(/c(?=[ei])/g, "s")
    .replace(/qu/g, "k")
    .replace(/c(?=[aou])/g, "k")
    .replace(/ll/g, "y")
    .replace(/(.)\1+/g, "$1");
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[n];
}

// Verifica si un texto del usuario contiene una frase o palabra clave incluso con errores de escritura
function fuzzyIncludes(normalizedInput: string, inputTokens: string[], phrase: string): boolean {
  const normPhrase = normalizeBase(phrase);
  if (!normPhrase) return false;

  if (normalizedInput.includes(normPhrase)) return true;

  const phraseTokens = normPhrase.split(" ").filter((t) => t.length >= 2);
  if (phraseTokens.length === 0) return false;

  // Cada palabra relevante de la frase debe coincidir de forma exacta, fonética o por distancia Levenshtein
  return phraseTokens.every((pToken) => {
    if (pToken.length <= 2) {
      return inputTokens.includes(pToken);
    }
    const pPhonetic = phoneticKey(pToken);
    const maxDist = pToken.length >= 10 ? 2 : pToken.length >= 5 ? 1 : 0;

    return inputTokens.some((uToken) => {
      if (uToken === pToken) return true;
      if (uToken.length >= 5 && pToken.length >= 5) {
        if (uToken.includes(pToken) || pToken.includes(uToken)) return true;
      }
      const uPhonetic = phoneticKey(uToken);
      if (uPhonetic === pPhonetic && pPhonetic.length >= 4) return true;
      if (
        maxDist > 0 &&
        uPhonetic[0] === pPhonetic[0] &&
        Math.abs(uToken.length - pToken.length) <= maxDist
      ) {
        if (levenshtein(uToken, pToken) <= maxDist) return true;
        if (levenshtein(uPhonetic, pPhonetic) <= maxDist) return true;
      }
      return false;
    });
  });
}

function getUniqueProductsByCategory(categoria: string): ProductoProcolmatCSV[] {
  return CATALOGO_PROCOLMAT.filter((p) => p.categoria === categoria);
}

function getProductsByName(productName: string): ProductoProcolmatCSV[] {
  return CATALOGO_PROCOLMAT.filter((p) => p.producto === productName);
}

export function generateBotResponse(rawInput: string): Omit<ChatMessage, "id" | "timestamp"> {
  const normalized = normalizeBase(rawInput);
  const tokens = normalized.split(" ").filter(Boolean);

  const anyMatch = (terms: string[]) =>
    terms.some((term) => fuzzyIncludes(normalized, tokens, term));

  // 1. Escalamiento explícito a asesor / contacto / cita
  if (
    anyMatch([
      "asesor",
      "humano",
      "persona real",
      "agendar",
      "llamar",
      "telefono",
      "whatsapp",
      "cotizacion formal",
      "hablar con alguien",
    ]) &&
    !anyMatch(["precio", "pegante", "estuco", "pintura", "impermeabilizante", "lechada"])
  ) {
    return {
      sender: "bot",
      text: `Puedes comunicarte directamente con un asesor comercial de ${EMPRESA_PROCOLMAT.nombre} para recibir orientación de obra, confirmar vigencia de precios o coordinar tu pedido.`,
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web],
      whatsappCta: {
        label: `Agendar / Hablar con asesor (${EMPRESA_PROCOLMAT.whatsappNumero})`,
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, deseo hablar con un asesor comercial para mi proyecto."
        ),
      },
      sugerencias: [
        "Ver catálogo de productos",
        "Pegante para porcelanato",
        "¿Realizan envíos a domicilio?",
      ],
    };
  }

  // 2. Preguntas frecuentes específicas del PDF (FAQ)
  // FAQ 4: Diferencia entre pegante cerámico y alto desempeño
  if (
    anyMatch(["diferencia"]) &&
    anyMatch(["ceramico", "alto desempeno", "pegante"])
  ) {
    const ceramico = getProductsByName("Pegante Cerámico Látex");
    const alto = getProductsByName("Pegante Alto Desempeño");
    return {
      sender: "bot",
      text: "Según nuestra documentación técnica: el Pegante Cerámico Látex está diseñado para instalaciones convencionales de cerámica en pisos y muros interiores, mientras que el Pegante Alto Desempeño ofrece propiedades técnicas superiores para aplicaciones más exigentes como fachadas, zonas húmedas, exteriores y revestimientos de baja absorción.",
      productos: [...ceramico, ...alto],
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Confirmar cuál aplica a tu obra",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, necesito confirmar si mi proyecto requiere Pegante Cerámico Látex o Pegante Alto Desempeño."
        ),
      },
    };
  }

  // FAQ 9: Envíos a domicilio / entregas
  if (anyMatch(["envio", "envios", "domicilio", "despacho", "entrega", "flete", "transporte"])) {
    return {
      sender: "bot",
      text: "Sí, en PROCOLMAT contamos con opciones de entrega según la ubicación y las condiciones del pedido. Para conocer cobertura exacta, costos y tiempos de entrega hacia tu obra, comunícate con nuestro equipo comercial.",
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web],
      whatsappCta: {
        label: `Consultar cobertura de envío (${EMPRESA_PROCOLMAT.whatsappNumero})`,
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, quisiera consultar cobertura, costos y tiempos de envío a domicilio."
        ),
      },
    };
  }

  // FAQ 8: Cómo comprar / métodos de compra
  if (
    anyMatch(["como comprar", "donde comprar", "como compro", "comprar productos", "adquirir"]) &&
    !anyMatch(["pegante", "estuco", "pintura", "impermeabilizante", "lechada"])
  ) {
    return {
      sender: "bot",
      text: `Puedes comunicarte con nuestro equipo comercial a través de WhatsApp (${EMPRESA_PROCOLMAT.whatsappNumero}) o consultar nuestros canales oficiales en ${EMPRESA_PROCOLMAT.sitioWeb} para conocer disponibilidad, vigencia de precios y opciones de compra directa de fábrica.`,
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web],
      whatsappCta: {
        label: "Comprar / Cotizar con equipo comercial",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, quiero conocer las opciones de compra y disponibilidad de productos."
        ),
      },
    };
  }

  // FAQ 5: Exteriores y zonas húmedas
  if (
    anyMatch(["exterior", "exteriores", "zona humeda", "zonas humedas", "intemperie"]) &&
    !anyMatch(["pintura", "dicolore", "impermeabilizante"])
  ) {
    const recomendados = [
      ...getProductsByName("Pegante Alto Desempeño"),
      ...getProductsByName("Pegante para Piscinas Flex"),
      ...getProductsByName("Impermeabilizante Acrílico Gris").slice(0, 2),
      ...getProductsByName("Dicolore Fachada Blanco"),
    ];
    return {
      sender: "bot",
      text: "Sí. PROCOLMAT dispone de soluciones especializadas para piscinas, fachadas, exteriores y zonas húmedas. Es clave seleccionar la referencia según la exigencia de cada superficie:",
      productos: recomendados,
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Validar especificación con asesor",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, necesito asesoría para una aplicación en exterior o zona húmeda."
        ),
      },
    };
  }

  // FAQ 1 & Identidad corporativa: Qué es PROCOLMAT / Quiénes son / Ubicación / Tienda-Ferretería
  if (
    anyMatch([
      "que es procolmat",
      "quienes son",
      "quien es procolmat",
      "sobre procolmat",
      "que hace procolmat",
      "fabricante",
      "medellin",
      "tienda",
      "ferreteria",
      "empresa",
      "problemas resuelve",
    ]) &&
    !anyMatch(["pegante", "estuco", "pintura", "impermeabilizante", "lechada", "catalogo"])
  ) {
    return {
      sender: "bot",
      text: `${EMPRESA_PROCOLMAT.nombre} (${EMPRESA_PROCOLMAT.razonSocial}) es una empresa colombiana FABRICANTE con sede en ${EMPRESA_PROCOLMAT.ciudadBase} y ${EMPRESA_PROCOLMAT.experiencia}. No es simplemente una tienda o ferretería: fabricamos soluciones especializadas en pegantes, estucos, masillas, impermeabilizantes, lechadas y pinturas para constructores, distribuidores, contratistas, maestros de obra y clientes particulares.\n\n"${EMPRESA_PROCOLMAT.lema}"`,
      fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web],
      whatsappCta: {
        label: "Contactar equipo PROCOLMAT",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, quisiera recibir información corporativa y portafolio de fábrica."
        ),
      },
      sugerencias: [
        "Ver catálogo de productos",
        "Pegante Alto Desempeño",
        "Pinturas Dicolore y Premium",
      ],
    };
  }

  // 3. Búsqueda inteligente y tolerante de PRODUCTOS específicos en el CSV
  // Ordenamos la prioridad de coincidencia del más específico al más general
  const specificMatches: { producto: string; score: number; resumen: string }[] = [];

  for (const guia of GUIAS_PRODUCTOS) {
    let score = 0;
    // Coincidencia con el nombre exacto del producto
    if (fuzzyIncludes(normalized, tokens, guia.producto)) {
      score += 10;
    }
    // Coincidencia con cada alias o sinónimo tolerante a errores ortográficos
    for (const alias of guia.alias) {
      if (fuzzyIncludes(normalized, tokens, alias)) {
        score += alias.includes(" ") ? 5 : 3;
      }
    }
    if (score > 0) {
      specificMatches.push({
        producto: guia.producto,
        score,
        resumen: guia.resumenTecnico,
      });
    }
  }

  // Ordenar por mayor puntaje
  specificMatches.sort((a, b) => b.score - a.score);

  // Casos especiales donde el usuario pregunta por una familia completa sin especificar variante
  const asksAllPegantes =
    anyMatch(["pegante", "pegantes", "adhesivo", "adhesivos", "pegar", "enchape", "enchapar"]) &&
    specificMatches.length === 0;

  if (asksAllPegantes) {
    const pegantes = getUniqueProductsByCategory("Pegantes");
    return {
      sender: "bot",
      text: "En PROCOLMAT fabricamos 6 líneas de pegantes según el tipo de pieza, superficie y exigencia de la obra. Aquí tienes las referencias y precios publicados en nuestro catálogo:",
      productos: pegantes,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Cotizar pegante con asesor",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, necesito asesoría para elegir el pegante adecuado para mi obra."
        ),
      },
      sugerencias: [
        "Pegante Porcelánico Grandes Formatos",
        "Pegante para Piscinas Flex",
        "Pegante Cerámico Látex",
      ],
    };
  }

  // Si pregunta genéricamente por "pintura" o "pinturas" o "vinilo" sin especificar Tipo 1/2/3 o Dicolore
  const asksGenericPinturas =
    anyMatch(["pintura", "pinturas", "vinilo", "vinilos", "dicolore"]) &&
    !anyMatch([
      "tipo 1",
      "tipo 2",
      "tipo 3",
      "epoxica",
      "epoxico",
      "catalizador",
      "anticorrosivo",
      "negro",
      "antibacterial",
      "fachada",
    ]);

  if (asksGenericPinturas) {
    const pinturas = getUniqueProductsByCategory("Pinturas");
    return {
      sender: "bot",
      text: "Contamos con la línea Pintura Premium Blanca (Tipos 1, 2 y 3), Pintura Epóxica + Catalizador y nuestra línea especializada Dicolore (Anticorrosivo Negro, Antibacterial y Fachada Blanco). Consulta las presentaciones disponibles:",
      productos: pinturas,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Cotizar pinturas con asesor",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, solicito información y cotización de su línea de pinturas."
        ),
      },
    };
  }

  // Si pregunta genéricamente por "estuco" o "estucos y masillas" sin especificar cuál
  const asksGenericEstucos =
    anyMatch(["estuco", "estucos"]) &&
    !anyMatch(["polvo", "bolsa 1", "1 kg", "drywall", "masilla"]);

  if (asksGenericEstucos) {
    const estucos = getUniqueProductsByCategory("Estucos y masillas");
    return {
      sender: "bot",
      text: "En la categoría de Estucos y Masillas fabricamos Estuco Plástico (1 kg e Interior en Galón, Balde 14 kg y Cuñete 28 kg), Estuco en Polvo (25 kg) y Masilla para Drywall. Aquí tienes las presentaciones y precios publicados:",
      productos: estucos,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Cotizar estucos con asesor",
        url: buildWhatsAppLink(
          "Hola PROCOLMAT, estoy interesado en sus estucos y masillas."
        ),
      },
    };
  }

  // Si hubo coincidencia específica de uno o más productos
  if (specificMatches.length > 0) {
    const topScore = specificMatches[0].score;
    // Si el primero es porcelanato y el usuario no dijo "gran formato", mostramos ambos porcelánicos para mayor claridad
    let selectedMatches = specificMatches.filter((m) => m.score >= topScore - 1);
    if (
      selectedMatches.some((m) => m.producto === "Pegante Porcelánico") &&
      !anyMatch(["grande", "grandes", "60x60", "80x80", "120"])
    ) {
      const hasGranFormato = selectedMatches.some(
        (m) => m.producto === "Pegante Porcelánico Grandes Formatos"
      );
      if (!hasGranFormato) {
        const gfGuide = GUIAS_PRODUCTOS.find(
          (g) => g.producto === "Pegante Porcelánico Grandes Formatos"
        );
        if (gfGuide) {
          selectedMatches.push({
            producto: gfGuide.producto,
            score: topScore,
            resumen: gfGuide.resumenTecnico,
          });
        }
      }
    }

    // Limitar a máximo 3 nombres de producto distintos para no saturar al usuario
    const topProducts = selectedMatches.slice(0, 3);
    const matchedRows = topProducts.flatMap((m) => getProductsByName(m.producto));
    const descriptionLines = topProducts
      .map((m) => `• ${m.producto}: ${m.resumen}`)
      .join("\n");

    const nombresConcat = topProducts.map((m) => m.producto).join(" / ");

    return {
      sender: "bot",
      text: `Encontré esta información en el catálogo oficial de ${EMPRESA_PROCOLMAT.nombre}:\n\n${descriptionLines}`,
      productos: matchedRows,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv],
      whatsappCta: {
        label: "Confirmar vigencia y cotizar por WhatsApp",
        url: buildWhatsAppLink(
          `Hola PROCOLMAT, solicito confirmar vigencia de precio y ficha técnica de: ${nombresConcat}.`
        ),
      },
      sugerencias: [
        "¿Realizan envíos a domicilio?",
        "Ver todos los productos",
        "Hablar con un asesor",
      ],
    };
  }

  // 4. Solicitud de catálogo completo o lista de precios general
  if (
    anyMatch([
      "catalogo",
      "portafolio",
      "productos",
      "lista de precios",
      "todos los precios",
      "que venden",
      "que fabrican",
      "que tienen",
      "fichas tecnicas",
    ])
  ) {
    return {
      sender: "bot",
      text: `En ${EMPRESA_PROCOLMAT.nombre} fabricamos 5 categorías principales de soluciones para la construcción: Pegantes, Estucos y masillas, Impermeabilizantes, Lechadas y Pinturas. Dime cuál categoría o material necesitas consultar para mostrarte sus presentaciones y precios exactos:`,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.csv, FUENTES_PROCOLMAT.pdf],
      sugerencias: [
        "Pegantes",
        "Estucos y masillas",
        "Impermeabilizante Acrílico Gris",
        "Lechada Cerámica",
        "Pinturas y Dicolore",
      ],
    };
  }

  // 5. Saludos simples
  if (
    anyMatch(["hola", "buenos dias", "buenas tardes", "buenas noches", "buen dia", "saludos"]) &&
    tokens.length <= 4
  ) {
    return {
      sender: "bot",
      text: `Hola. Soy el asistente virtual de ${EMPRESA_PROCOLMAT.nombre} (${EMPRESA_PROCOLMAT.razonSocial}). Puedo ayudarte a consultar precios, presentaciones y especificaciones de nuestros pegantes, estucos, masillas, impermeabilizantes, lechadas y pinturas. ¿Qué producto o información necesitas?`,
      fuentes: [FUENTES_PROCOLMAT.web, FUENTES_PROCOLMAT.pdf],
      sugerencias: SUGERENCIAS_INICIALES.slice(0, 4),
    };
  }

  // 6. FALLBACK OBLIGATORIO POR FALTA DE INFORMACIÓN O CONSULTA FUERA DE ALCANCE
  return {
    sender: "bot",
    text: "Ahora no puedo ayudarte con eso, pero te puedo agendar con un asesor",
    esFallback: true,
    fuentes: [FUENTES_PROCOLMAT.pdf, FUENTES_PROCOLMAT.web],
    whatsappCta: {
      label: `Agendar con un asesor (${EMPRESA_PROCOLMAT.whatsappNumero})`,
      url: buildWhatsAppLink(
        `Hola PROCOLMAT, tengo la siguiente consulta que el asistente virtual no pudo responder: "${rawInput}"`
      ),
    },
    sugerencias: [
      "Ver catálogo de productos",
      "Pegante para porcelanato",
      "¿Qué es PROCOLMAT?",
    ],
  };
}
