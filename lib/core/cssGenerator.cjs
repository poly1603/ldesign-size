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

var index = require('../utils/index.cjs');

function generateCSSVariables(scheme, options = {}) {
  const {
    prefix = "size"
  } = options;
  const vars = {};
  generateBaseSizeTokens(vars, prefix);
  Object.entries(scheme.fontSize).forEach(([key, value]) => {
    vars[index.getCSSVarName(`font-${key}`, prefix)] = String(value);
  });
  Object.entries(scheme.spacing).forEach(([key, value]) => {
    vars[index.getCSSVarName(`space-${key}`, prefix)] = String(value);
    vars[index.getCSSVarName(`spacing-${key}`, prefix)] = String(value);
  });
  Object.entries(scheme.radius).forEach(([key, value]) => {
    vars[index.getCSSVarName(`radius-${key}`, prefix)] = String(value);
  });
  Object.entries(scheme.lineHeight).forEach(([key, value]) => {
    vars[index.getCSSVarName(`line-${key}`, prefix)] = String(value);
  });
  Object.entries(scheme.letterSpacing).forEach(([key, value]) => {
    vars[index.getCSSVarName(`letter-${key}`, prefix)] = String(value);
  });
  Object.entries(scheme.components.button).forEach(([size, config]) => {
    vars[index.getCSSVarName(`btn-${size}-height`, prefix)] = String(config.height);
    vars[index.getCSSVarName(`btn-${size}-padding`, prefix)] = String(config.padding);
    vars[index.getCSSVarName(`btn-${size}-font`, prefix)] = String(config.fontSize);
  });
  Object.entries(scheme.components.input).forEach(([size, config]) => {
    vars[index.getCSSVarName(`input-${size}-height`, prefix)] = String(config.height);
    vars[index.getCSSVarName(`input-${size}-padding`, prefix)] = String(config.padding);
    vars[index.getCSSVarName(`input-${size}-font`, prefix)] = String(config.fontSize);
  });
  Object.entries(scheme.components.icon).forEach(([size, value]) => {
    vars[index.getCSSVarName(`icon-${size}`, prefix)] = String(value);
  });
  Object.entries(scheme.components.avatar).forEach(([size, value]) => {
    vars[index.getCSSVarName(`avatar-${size}`, prefix)] = String(value);
  });
  if (scheme.components.card) {
    Object.entries(scheme.components.card).forEach(([size, value]) => {
      vars[index.getCSSVarName(`card-${size}-padding`, prefix)] = String(value);
    });
  }
  if (scheme.grid) {
    vars[index.getCSSVarName("grid-columns", prefix)] = String(scheme.grid.columns);
    vars[index.getCSSVarName("grid-gutter", prefix)] = String(scheme.grid.gutter);
    vars[index.getCSSVarName("grid-margin", prefix)] = String(scheme.grid.margin);
  }
  if (scheme.breakpoints) {
    Object.entries(scheme.breakpoints).forEach(([key, value]) => {
      vars[index.getCSSVarName(`breakpoint-${key}`, prefix)] = String(value);
    });
  }
  generateComponentSizeTokens(vars, scheme, prefix);
  generatePaddingTokens(vars, scheme, prefix);
  generateMarginTokens(vars, scheme, prefix);
  generateTypographyTokens(vars, scheme, prefix);
  if (scheme.custom) {
    Object.entries(scheme.custom).forEach(([key, value]) => {
      vars[index.getCSSVarName(key, prefix)] = String(value);
    });
  }
  return vars;
}
function generateBaseSizeTokens(vars, prefix) {
  const baseSizes = {
    "0": "0px",
    "1": "2px",
    "2": "4px",
    "3": "6px",
    "4": "8px",
    "5": "12px",
    "6": "16px",
    "7": "20px",
    "8": "24px",
    "9": "28px",
    "10": "32px",
    "11": "36px",
    "12": "40px",
    "13": "48px",
    "14": "56px",
    "15": "64px",
    "16": "72px",
    "17": "80px",
    "18": "96px",
    "19": "112px",
    "20": "128px",
    "24": "192px",
    "32": "256px",
    "40": "320px",
    "48": "384px",
    "56": "448px",
    "64": "512px"
  };
  Object.entries(baseSizes).forEach(([key, value]) => {
    vars[index.getCSSVarName(`size-${key}`, prefix)] = value;
  });
}
function generateComponentSizeTokens(vars, scheme, prefix) {
  const compSizes = {
    "xxxs": `var(${index.getCSSVarName("size-6", prefix)})`,
    // 16px
    "xxs": `var(${index.getCSSVarName("size-7", prefix)})`,
    // 20px
    "xs": `var(${index.getCSSVarName("size-8", prefix)})`,
    // 24px
    "s": `var(${index.getCSSVarName("size-9", prefix)})`,
    // 28px
    "m": `var(${index.getCSSVarName("size-10", prefix)})`,
    // 32px
    "l": `var(${index.getCSSVarName("size-11", prefix)})`,
    // 36px
    "xl": `var(${index.getCSSVarName("size-12", prefix)})`,
    // 40px
    "xxl": `var(${index.getCSSVarName("size-13", prefix)})`,
    // 48px
    "xxxl": `var(${index.getCSSVarName("size-14", prefix)})`,
    // 56px
    "xxxxl": `var(${index.getCSSVarName("size-15", prefix)})`,
    // 64px
    "xxxxxl": `var(${index.getCSSVarName("size-16", prefix)})`
    // 72px
  };
  Object.entries(compSizes).forEach(([key, value]) => {
    vars[index.getCSSVarName(`comp-size-${key}`, prefix)] = value;
  });
}
function generatePaddingTokens(vars, scheme, prefix) {
  const popPadding = {
    "s": `var(${index.getCSSVarName("size-2", prefix)})`,
    "m": `var(${index.getCSSVarName("size-3", prefix)})`,
    "l": `var(${index.getCSSVarName("size-4", prefix)})`,
    "xl": `var(${index.getCSSVarName("size-5", prefix)})`,
    "xxl": `var(${index.getCSSVarName("size-6", prefix)})`
  };
  Object.entries(popPadding).forEach(([key, value]) => {
    vars[index.getCSSVarName(`pop-padding-${key}`, prefix)] = value;
  });
  const paddingLR = {
    "xxs": `var(${index.getCSSVarName("size-1", prefix)})`,
    "xs": `var(${index.getCSSVarName("size-2", prefix)})`,
    "s": `var(${index.getCSSVarName("size-4", prefix)})`,
    "m": `var(${index.getCSSVarName("size-5", prefix)})`,
    "l": `var(${index.getCSSVarName("size-6", prefix)})`,
    "xl": `var(${index.getCSSVarName("size-8", prefix)})`,
    "xxl": `var(${index.getCSSVarName("size-10", prefix)})`
  };
  Object.entries(paddingLR).forEach(([key, value]) => {
    vars[index.getCSSVarName(`comp-paddingLR-${key}`, prefix)] = value;
  });
  const paddingTB = {
    "xxs": `var(${index.getCSSVarName("size-1", prefix)})`,
    "xs": `var(${index.getCSSVarName("size-2", prefix)})`,
    "s": `var(${index.getCSSVarName("size-3", prefix)})`,
    "m": `var(${index.getCSSVarName("size-4", prefix)})`,
    "l": `var(${index.getCSSVarName("size-5", prefix)})`,
    "xl": `var(${index.getCSSVarName("size-6", prefix)})`,
    "xxl": `var(${index.getCSSVarName("size-8", prefix)})`
  };
  Object.entries(paddingTB).forEach(([key, value]) => {
    vars[index.getCSSVarName(`comp-paddingTB-${key}`, prefix)] = value;
  });
}
function generateMarginTokens(vars, scheme, prefix) {
  const margins = {
    "xxs": `var(${index.getCSSVarName("size-1", prefix)})`,
    "xs": `var(${index.getCSSVarName("size-2", prefix)})`,
    "s": `var(${index.getCSSVarName("size-4", prefix)})`,
    "m": `var(${index.getCSSVarName("size-5", prefix)})`,
    "l": `var(${index.getCSSVarName("size-6", prefix)})`,
    "xl": `var(${index.getCSSVarName("size-7", prefix)})`,
    "xxl": `var(${index.getCSSVarName("size-8", prefix)})`,
    "xxxl": `var(${index.getCSSVarName("size-10", prefix)})`,
    "xxxxl": `var(${index.getCSSVarName("size-12", prefix)})`
  };
  Object.entries(margins).forEach(([key, value]) => {
    vars[index.getCSSVarName(`comp-margin-${key}`, prefix)] = value;
  });
}
function generateTypographyTokens(vars, scheme, prefix) {
  vars[index.getCSSVarName("font-family", prefix)] = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  vars[index.getCSSVarName("font-family-mono", prefix)] = '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const weights = {
    "thin": "100",
    "extralight": "200",
    "light": "300",
    "regular": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700",
    "extrabold": "800",
    "black": "900"
  };
  Object.entries(weights).forEach(([key, value]) => {
    vars[index.getCSSVarName(`font-weight-${key}`, prefix)] = value;
  });
  vars[index.getCSSVarName("border-width-thin", prefix)] = "1px";
  vars[index.getCSSVarName("border-width-medium", prefix)] = "2px";
  vars[index.getCSSVarName("border-width-thick", prefix)] = "3px";
  vars[index.getCSSVarName("shadow-1", prefix)] = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  vars[index.getCSSVarName("shadow-2", prefix)] = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
  vars[index.getCSSVarName("shadow-3", prefix)] = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
  vars[index.getCSSVarName("shadow-4", prefix)] = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
  vars[index.getCSSVarName("shadow-5", prefix)] = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
  vars[index.getCSSVarName("shadow-6", prefix)] = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
  vars[index.getCSSVarName("z-dropdown", prefix)] = "1000";
  vars[index.getCSSVarName("z-sticky", prefix)] = "1020";
  vars[index.getCSSVarName("z-fixed", prefix)] = "1030";
  vars[index.getCSSVarName("z-modal-backdrop", prefix)] = "1040";
  vars[index.getCSSVarName("z-modal", prefix)] = "1050";
  vars[index.getCSSVarName("z-popover", prefix)] = "1060";
  vars[index.getCSSVarName("z-tooltip", prefix)] = "1070";
  vars[index.getCSSVarName("z-notification", prefix)] = "1080";
  vars[index.getCSSVarName("duration-instant", prefix)] = "0ms";
  vars[index.getCSSVarName("duration-fast", prefix)] = "150ms";
  vars[index.getCSSVarName("duration-normal", prefix)] = "300ms";
  vars[index.getCSSVarName("duration-slow", prefix)] = "450ms";
  vars[index.getCSSVarName("duration-slower", prefix)] = "600ms";
  vars[index.getCSSVarName("ease-linear", prefix)] = "linear";
  vars[index.getCSSVarName("ease-in", prefix)] = "cubic-bezier(0.4, 0, 1, 1)";
  vars[index.getCSSVarName("ease-out", prefix)] = "cubic-bezier(0, 0, 0.2, 1)";
  vars[index.getCSSVarName("ease-in-out", prefix)] = "cubic-bezier(0.4, 0, 0.2, 1)";
}
function generateCSSString(variables, options = {}) {
  const {
    selector = ":root",
    important = false
  } = options;
  const importantFlag = important ? " !important" : "";
  const lines = [`${selector} {`];
  for (const [key, value] of Object.entries(variables)) {
    lines.push(`  ${key}: ${value}${importantFlag};`);
  }
  lines.push("}");
  return lines.join("\n");
}
function generateCSS(scheme, options = {}) {
  const variables = generateCSSVariables(scheme, options);
  const variablesCSS = generateCSSString(variables, options);
  const utilities = generateUtilityClasses(scheme, options);
  const components = generateComponentClasses(scheme, options);
  const responsive = generateResponsiveUtilities(scheme, options);
  return {
    variables: variablesCSS,
    utilities,
    components,
    responsive,
    full: [variablesCSS, utilities, components, responsive].filter(Boolean).join("\n\n")
  };
}
const utilityClassesCache = /* @__PURE__ */ new WeakMap();
function generateUtilityClasses(scheme, options = {}) {
  if (utilityClassesCache.has(scheme)) {
    return utilityClassesCache.get(scheme);
  }
  const {
    prefix = "size"
  } = options;
  const classes = [];
  const spaceVar = (key) => `var(${index.getCSSVarName(`space-${key}`, prefix)})`;
  for (const key of Object.keys(scheme.spacing)) {
    const sv = spaceVar(key);
    classes.push(`.p-${key} { padding: ${sv}; }`, `.px-${key} { padding-left: ${sv}; padding-right: ${sv}; }`, `.py-${key} { padding-top: ${sv}; padding-bottom: ${sv}; }`, `.pt-${key} { padding-top: ${sv}; }`, `.pr-${key} { padding-right: ${sv}; }`, `.pb-${key} { padding-bottom: ${sv}; }`, `.pl-${key} { padding-left: ${sv}; }`);
    classes.push(`.m-${key} { margin: ${sv}; }`, `.mx-${key} { margin-left: ${sv}; margin-right: ${sv}; }`, `.my-${key} { margin-top: ${sv}; margin-bottom: ${sv}; }`, `.mt-${key} { margin-top: ${sv}; }`, `.mr-${key} { margin-right: ${sv}; }`, `.mb-${key} { margin-bottom: ${sv}; }`, `.ml-${key} { margin-left: ${sv}; }`, `.gap-${key} { gap: ${sv}; }`);
  }
  for (const key of Object.keys(scheme.fontSize)) {
    classes.push(`.text-${key} { font-size: var(${index.getCSSVarName(`font-${key}`, prefix)}); }`);
  }
  for (const key of Object.keys(scheme.radius)) {
    classes.push(`.rounded-${key} { border-radius: var(${index.getCSSVarName(`radius-${key}`, prefix)}); }`);
  }
  for (const key of Object.keys(scheme.lineHeight)) {
    classes.push(`.leading-${key} { line-height: var(${index.getCSSVarName(`line-${key}`, prefix)}); }`);
  }
  for (const key of Object.keys(scheme.letterSpacing)) {
    classes.push(`.tracking-${key} { letter-spacing: var(${index.getCSSVarName(`letter-${key}`, prefix)}); }`);
  }
  const result = classes.join("\n");
  utilityClassesCache.set(scheme, result);
  return result;
}
function generateComponentClasses(scheme, options = {}) {
  const {
    prefix = "size"
  } = options;
  const classes = [];
  Object.keys(scheme.components.button).forEach((size) => {
    classes.push(`
.btn-${size} {
  height: var(${index.getCSSVarName(`btn-${size}-height`, prefix)});
  padding: var(${index.getCSSVarName(`btn-${size}-padding`, prefix)});
  font-size: var(${index.getCSSVarName(`btn-${size}-font`, prefix)});
}`);
  });
  Object.keys(scheme.components.input).forEach((size) => {
    classes.push(`
.input-${size} {
  height: var(${index.getCSSVarName(`input-${size}-height`, prefix)});
  padding: var(${index.getCSSVarName(`input-${size}-padding`, prefix)});
  font-size: var(${index.getCSSVarName(`input-${size}-font`, prefix)});
}`);
  });
  Object.keys(scheme.components.icon).forEach((size) => {
    classes.push(`
.icon-${size} {
  width: var(${index.getCSSVarName(`icon-${size}`, prefix)});
  height: var(${index.getCSSVarName(`icon-${size}`, prefix)});
}`);
  });
  Object.keys(scheme.components.avatar).forEach((size) => {
    classes.push(`
.avatar-${size} {
  width: var(${index.getCSSVarName(`avatar-${size}`, prefix)});
  height: var(${index.getCSSVarName(`avatar-${size}`, prefix)});
}`);
  });
  return classes.join("\n");
}
function generateResponsiveUtilities(scheme, _options = {}) {
  if (!scheme.breakpoints) return "";
  const breakpoints = scheme.breakpoints;
  const media = [];
  Object.entries(breakpoints).forEach(([key, value]) => {
    media.push(`
@media (min-width: ${value}) {
  .${key}\\:p-0 { padding: 0; }
  .${key}\\:m-0 { margin: 0; }
  /* Add more responsive utilities as needed */
}`);
  });
  return media.join("\n");
}
function injectCSS(css, id = "ldesign-size-styles") {
  if (typeof window === "undefined" || !document) return;
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
  const style = document.createElement("style");
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}
function removeCSS(id = "ldesign-size-styles") {
  if (typeof window === "undefined" || !document) return;
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

exports.generateCSS = generateCSS;
exports.generateCSSString = generateCSSString;
exports.generateCSSVariables = generateCSSVariables;
exports.injectCSS = injectCSS;
exports.removeCSS = removeCSS;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=cssGenerator.cjs.map
