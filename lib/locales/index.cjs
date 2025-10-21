/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
'use strict';

const zhCN = {
  title: "\u8C03\u6574\u5C3A\u5BF8",
  close: "\u5173\u95ED",
  ariaLabel: "\u8C03\u6574\u5C3A\u5BF8",
  presets: {
    compact: "\u7D27\u51D1",
    comfortable: "\u8212\u9002",
    default: "\u9ED8\u8BA4",
    spacious: "\u5BBD\u677E",
    "extra-compact": "\u8D85\u7D27\u51D1",
    "extra-spacious": "\u8D85\u5BBD\u677E"
  },
  descriptions: {
    compact: "\u9AD8\u5BC6\u5EA6\uFF0C\u6700\u5927\u5316\u5185\u5BB9\u663E\u793A",
    comfortable: "\u5E73\u8861\u7684\u95F4\u8DDD\uFF0C\u65E5\u5E38\u4F7F\u7528",
    default: "\u6807\u51C6\u5C3A\u5BF8\u8BBE\u7F6E",
    spacious: "\u4F4E\u5BC6\u5EA6\uFF0C\u66F4\u597D\u7684\u53EF\u8BFB\u6027",
    "extra-compact": "\u8D85\u9AD8\u5BC6\u5EA6\uFF0C\u9002\u5408\u4FE1\u606F\u5BC6\u96C6\u573A\u666F",
    "extra-spacious": "\u8D85\u4F4E\u5BC6\u5EA6\uFF0C\u63D0\u5347\u53EF\u8BFB\u6027"
  }
};
const enUS = {
  title: "Adjust Size",
  close: "Close",
  ariaLabel: "Adjust Size",
  presets: {
    compact: "Compact",
    comfortable: "Comfortable",
    default: "Default",
    spacious: "Spacious",
    "extra-compact": "Extra Compact",
    "extra-spacious": "Extra Spacious"
  },
  descriptions: {
    compact: "High density for maximum content",
    comfortable: "Balanced spacing for everyday use",
    default: "Standard size settings",
    spacious: "Lower density for better readability",
    "extra-compact": "Very high density for maximum content",
    "extra-spacious": "Very low density for enhanced readability"
  }
};
const jaJP = {
  title: "\u30B5\u30A4\u30BA\u8ABF\u6574",
  close: "\u9589\u3058\u308B",
  ariaLabel: "\u30B5\u30A4\u30BA\u8ABF\u6574",
  presets: {
    compact: "\u30B3\u30F3\u30D1\u30AF\u30C8",
    comfortable: "\u5FEB\u9069",
    default: "\u30C7\u30D5\u30A9\u30EB\u30C8",
    spacious: "\u3086\u3063\u305F\u308A",
    "extra-compact": "\u8D85\u30B3\u30F3\u30D1\u30AF\u30C8",
    "extra-spacious": "\u8D85\u3086\u3063\u305F\u308A"
  },
  descriptions: {
    compact: "\u9AD8\u5BC6\u5EA6\u3067\u6700\u5927\u9650\u306E\u30B3\u30F3\u30C6\u30F3\u30C4\u3092\u8868\u793A",
    comfortable: "\u65E5\u5E38\u4F7F\u7528\u306B\u6700\u9069\u306A\u30D0\u30E9\u30F3\u30B9\u306E\u53D6\u308C\u305F\u9593\u9694",
    default: "\u6A19\u6E96\u30B5\u30A4\u30BA\u8A2D\u5B9A",
    spacious: "\u4F4E\u5BC6\u5EA6\u3067\u8AAD\u307F\u3084\u3059\u3055\u5411\u4E0A",
    "extra-compact": "\u8D85\u9AD8\u5BC6\u5EA6\u3067\u6700\u5927\u9650\u306E\u30B3\u30F3\u30C6\u30F3\u30C4\u3092\u8868\u793A",
    "extra-spacious": "\u8D85\u4F4E\u5BC6\u5EA6\u3067\u8AAD\u307F\u3084\u3059\u3055\u3092\u5F37\u5316"
  }
};
const koKR = {
  title: "\uD06C\uAE30 \uC870\uC815",
  close: "\uB2EB\uAE30",
  ariaLabel: "\uD06C\uAE30 \uC870\uC815",
  presets: {
    compact: "\uAC04\uACB0",
    comfortable: "\uD3B8\uC548\uD568",
    default: "\uAE30\uBCF8",
    spacious: "\uC5EC\uC720",
    "extra-compact": "\uCD08\uAC04\uACB0",
    "extra-spacious": "\uCD08\uC5EC\uC720"
  },
  descriptions: {
    compact: "\uCD5C\uB300 \uCF58\uD150\uCE20\uB97C \uC704\uD55C \uB192\uC740 \uBC00\uB3C4",
    comfortable: "\uC77C\uC0C1 \uC0AC\uC6A9\uC744 \uC704\uD55C \uADE0\uD615\uC7A1\uD78C \uAC04\uACA9",
    default: "\uD45C\uC900 \uD06C\uAE30 \uC124\uC815",
    spacious: "\uB354 \uB098\uC740 \uAC00\uB3C5\uC131\uC744 \uC704\uD55C \uB0AE\uC740 \uBC00\uB3C4",
    "extra-compact": "\uCD5C\uB300 \uCF58\uD150\uCE20\uB97C \uC704\uD55C \uB9E4\uC6B0 \uB192\uC740 \uBC00\uB3C4",
    "extra-spacious": "\uD5A5\uC0C1\uB41C \uAC00\uB3C5\uC131\uC744 \uC704\uD55C \uB9E4\uC6B0 \uB0AE\uC740 \uBC00\uB3C4"
  }
};
const deDE = {
  title: "Gr\xF6\xDFe anpassen",
  close: "Schlie\xDFen",
  ariaLabel: "Gr\xF6\xDFe anpassen",
  presets: {
    compact: "Kompakt",
    comfortable: "Komfortabel",
    default: "Standard",
    spacious: "Ger\xE4umig",
    "extra-compact": "Extra Kompakt",
    "extra-spacious": "Extra Ger\xE4umig"
  },
  descriptions: {
    compact: "Hohe Dichte f\xFCr maximalen Inhalt",
    comfortable: "Ausgewogener Abstand f\xFCr den t\xE4glichen Gebrauch",
    default: "Standard-Gr\xF6\xDFeneinstellungen",
    spacious: "Niedrigere Dichte f\xFCr bessere Lesbarkeit",
    "extra-compact": "Sehr hohe Dichte f\xFCr maximalen Inhalt",
    "extra-spacious": "Sehr niedrige Dichte f\xFCr verbesserte Lesbarkeit"
  }
};
const frFR = {
  title: "Ajuster la taille",
  close: "Fermer",
  ariaLabel: "Ajuster la taille",
  presets: {
    compact: "Compact",
    comfortable: "Confortable",
    default: "Par d\xE9faut",
    spacious: "Spacieux",
    "extra-compact": "Extra Compact",
    "extra-spacious": "Extra Spacieux"
  },
  descriptions: {
    compact: "Haute densit\xE9 pour un contenu maximal",
    comfortable: "Espacement \xE9quilibr\xE9 pour un usage quotidien",
    default: "Param\xE8tres de taille standard",
    spacious: "Densit\xE9 plus faible pour une meilleure lisibilit\xE9",
    "extra-compact": "Tr\xE8s haute densit\xE9 pour un contenu maximal",
    "extra-spacious": "Tr\xE8s faible densit\xE9 pour une lisibilit\xE9 am\xE9lior\xE9e"
  }
};
const esES = {
  title: "Ajustar tama\xF1o",
  close: "Cerrar",
  ariaLabel: "Ajustar tama\xF1o",
  presets: {
    compact: "Compacto",
    comfortable: "C\xF3modo",
    default: "Predeterminado",
    spacious: "Espacioso",
    "extra-compact": "Extra Compacto",
    "extra-spacious": "Extra Espacioso"
  },
  descriptions: {
    compact: "Alta densidad para m\xE1ximo contenido",
    comfortable: "Espaciado equilibrado para uso diario",
    default: "Configuraci\xF3n de tama\xF1o est\xE1ndar",
    spacious: "Menor densidad para mejor legibilidad",
    "extra-compact": "Muy alta densidad para m\xE1ximo contenido",
    "extra-spacious": "Muy baja densidad para legibilidad mejorada"
  }
};
const itIT = {
  title: "Regola dimensione",
  close: "Chiudi",
  ariaLabel: "Regola dimensione",
  presets: {
    compact: "Compatto",
    comfortable: "Confortevole",
    default: "Predefinito",
    spacious: "Spazioso",
    "extra-compact": "Extra Compatto",
    "extra-spacious": "Extra Spazioso"
  },
  descriptions: {
    compact: "Alta densit\xE0 per massimo contenuto",
    comfortable: "Spaziatura bilanciata per uso quotidiano",
    default: "Impostazioni dimensione standard",
    spacious: "Densit\xE0 inferiore per migliore leggibilit\xE0",
    "extra-compact": "Densit\xE0 molto alta per massimo contenuto",
    "extra-spacious": "Densit\xE0 molto bassa per leggibilit\xE0 migliorata"
  }
};
const ptBR = {
  title: "Ajustar tamanho",
  close: "Fechar",
  ariaLabel: "Ajustar tamanho",
  presets: {
    compact: "Compacto",
    comfortable: "Confort\xE1vel",
    default: "Padr\xE3o",
    spacious: "Espa\xE7oso",
    "extra-compact": "Extra Compacto",
    "extra-spacious": "Extra Espa\xE7oso"
  },
  descriptions: {
    compact: "Alta densidade para m\xE1ximo conte\xFAdo",
    comfortable: "Espa\xE7amento balanceado para uso di\xE1rio",
    default: "Configura\xE7\xF5es de tamanho padr\xE3o",
    spacious: "Densidade menor para melhor legibilidade",
    "extra-compact": "Densidade muito alta para m\xE1ximo conte\xFAdo",
    "extra-spacious": "Densidade muito baixa para legibilidade aprimorada"
  }
};
const ruRU = {
  title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440",
  close: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
  ariaLabel: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440",
  presets: {
    compact: "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439",
    comfortable: "\u041A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u044B\u0439",
    default: "\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
    spacious: "\u041F\u0440\u043E\u0441\u0442\u043E\u0440\u043D\u044B\u0439",
    "extra-compact": "\u041E\u0447\u0435\u043D\u044C \u043A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439",
    "extra-spacious": "\u041E\u0447\u0435\u043D\u044C \u043F\u0440\u043E\u0441\u0442\u043E\u0440\u043D\u044B\u0439"
  },
  descriptions: {
    compact: "\u0412\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0434\u043B\u044F \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430",
    comfortable: "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043E\u0442\u0441\u0442\u0443\u043F\u044B \u0434\u043B\u044F \u043F\u043E\u0432\u0441\u0435\u0434\u043D\u0435\u0432\u043D\u043E\u0433\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F",
    default: "\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0430\u0437\u043C\u0435\u0440\u0430",
    spacious: "\u041C\u0435\u043D\u044C\u0448\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0434\u043B\u044F \u043B\u0443\u0447\u0448\u0435\u0439 \u0447\u0438\u0442\u0430\u0435\u043C\u043E\u0441\u0442\u0438",
    "extra-compact": "\u041E\u0447\u0435\u043D\u044C \u0432\u044B\u0441\u043E\u043A\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0434\u043B\u044F \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430",
    "extra-spacious": "\u041E\u0447\u0435\u043D\u044C \u043D\u0438\u0437\u043A\u0430\u044F \u043F\u043B\u043E\u0442\u043D\u043E\u0441\u0442\u044C \u0434\u043B\u044F \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u043D\u043E\u0439 \u0447\u0438\u0442\u0430\u0435\u043C\u043E\u0441\u0442\u0438"
  }
};
const locales = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "de-DE": deDE,
  "fr-FR": frFR,
  "es-ES": esES,
  "it-IT": itIT,
  "pt-BR": ptBR,
  "ru-RU": ruRU,
  // Shortcuts
  "zh": zhCN,
  "en": enUS,
  "ja": jaJP,
  "ko": koKR,
  "de": deDE,
  "fr": frFR,
  "es": esES,
  "it": itIT,
  "pt": ptBR,
  "ru": ruRU
};
function getLocale(locale) {
  return locales[locale] || enUS;
}

exports.deDE = deDE;
exports.enUS = enUS;
exports.esES = esES;
exports.frFR = frFR;
exports.getLocale = getLocale;
exports.itIT = itIT;
exports.jaJP = jaJP;
exports.koKR = koKR;
exports.locales = locales;
exports.ptBR = ptBR;
exports.ruRU = ruRU;
exports.zhCN = zhCN;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
