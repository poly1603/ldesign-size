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

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var SizeManager = require('../core/SizeManager.cjs');
var index = require('../locales/index.cjs');

const SizePluginSymbol = Symbol("SizePlugin");
const isRef = (v) => {
  return v && typeof v === "object" && "value" in v && "_rawValue" in v;
};
function useSmartLocale(options) {
  if (options.locale) {
    return isRef(options.locale) ? options.locale : vue.ref(options.locale);
  }
  try {
    const injected = vue.inject("app-locale", null);
    if (injected && injected.value) {
      return injected;
    }
  } catch {
  }
  const locale = vue.ref(options.defaultLocale || "zh-CN");
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("app-locale");
    if (stored) {
      locale.value = stored;
    }
    const localeHandler = (e) => {
      const customEvent = e;
      if (customEvent.detail?.locale) {
        locale.value = customEvent.detail.locale;
      }
    };
    window.addEventListener("app:locale-changed", localeHandler);
    locale._cleanup = () => {
      window.removeEventListener("app:locale-changed", localeHandler);
    };
  }
  return locale;
}
function createSizePlugin(options = {}) {
  let currentLocale = useSmartLocale(options);
  let localeCache = null;
  const getLocaleData = () => {
    if (!localeCache || localeCache.key !== currentLocale.value) {
      localeCache = {
        key: currentLocale.value,
        data: index.getLocale(currentLocale.value)
      };
    }
    return localeCache.data;
  };
  const localeMessages = {
    get value() {
      return getLocaleData();
    }
  };
  const mergedOptions = {
    defaultSize: options.defaultSize || "default",
    presets: options.presets || [],
    storageKey: options.storageKey || "ldesign-size",
    persistence: options.persistence !== false,
    storage: options.storage,
    hooks: options.hooks,
    defaultLocale: options.defaultLocale || "zh-CN",
    autoDetect: options.autoDetect || false,
    cssVariables: options.cssVariables !== false,
    locale: options.locale || currentLocale.value
  };
  const manager = new SizeManager.SizeManager({
    presets: mergedOptions.presets,
    storageKey: mergedOptions.storageKey
  });
  const currentSize = vue.ref(mergedOptions.defaultSize);
  const storage = {
    async getItem(key) {
      try {
        if (mergedOptions.storage) {
          return await mergedOptions.storage.getItem(key);
        }
        if (typeof window === "undefined") return null;
        return localStorage.getItem(key);
      } catch (error) {
        mergedOptions.hooks?.onError?.(error);
        return null;
      }
    },
    async setItem(key, value) {
      try {
        if (mergedOptions.storage) {
          await mergedOptions.storage.setItem(key, value);
          return;
        }
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
      } catch (error) {
        mergedOptions.hooks?.onError?.(error);
      }
    },
    async removeItem(key) {
      try {
        if (mergedOptions.storage) {
          await mergedOptions.storage.removeItem(key);
          return;
        }
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
      } catch (error) {
        mergedOptions.hooks?.onError?.(error);
      }
    }
  };
  const setSize = async (size) => {
    const oldSize = manager.getCurrentSize();
    try {
      if (mergedOptions.hooks?.beforeChange) {
        const shouldContinue = await mergedOptions.hooks.beforeChange(size, oldSize);
        if (shouldContinue === false) {
          throw new Error("Size change cancelled by beforeChange hook");
        }
      }
      manager.setSize(size);
      currentSize.value = size;
      if (mergedOptions.persistence) {
        await storage.setItem(mergedOptions.storageKey, size);
      }
      await mergedOptions.hooks?.afterChange?.(size);
    } catch (error) {
      mergedOptions.hooks?.onError?.(error);
      throw error;
    }
  };
  const getSize = () => manager.getCurrentSize();
  const listeners = /* @__PURE__ */ new Set();
  const cleanupFunctions = [];
  const unsubscribe = manager.onChange(() => {
    const newSize = manager.getCurrentSize();
    currentSize.value = newSize;
    listeners.forEach((listener) => listener(newSize));
  });
  cleanupFunctions.push(unsubscribe);
  const onChange = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    listeners.clear();
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions.length = 0;
    if (currentLocale._cleanup) {
      currentLocale._cleanup();
    }
    if (manager.destroy) {
      manager.destroy();
    }
    localeCache = null;
  };
  const plugin = {
    manager,
    options: mergedOptions,
    currentLocale,
    localeMessages,
    currentSize,
    setSize,
    getSize,
    onChange,
    destroy,
    install(app) {
      if (!isRef(options.locale)) {
        const sharedLocale = app._context?.provides?.locale;
        if (sharedLocale && sharedLocale.value !== void 0) {
          currentLocale = sharedLocale;
          plugin.currentLocale = sharedLocale;
          localeCache = null;
        } else {
          app.provide("locale", currentLocale);
        }
      }
      app.provide(SizePluginSymbol, plugin);
      app.provide("size", plugin);
      const SIZE_MANAGER_KEY = Symbol.for("size-manager");
      app.provide(SIZE_MANAGER_KEY, {
        manager,
        getConfig: () => manager.getConfig(),
        getCurrentPreset: () => manager.getCurrentPreset(),
        setBaseSize: (baseSize) => manager.setBaseSize(baseSize),
        applyPreset: (presetName) => manager.applyPreset(presetName),
        getPresets: () => manager.getPresets(),
        subscribe: (listener) => {
          return manager.subscribe(listener);
        }
      });
      app.provide("size-locale", localeMessages);
      app.config.globalProperties.$size = plugin;
      app.config.globalProperties.$sizeManager = manager;
    }
  };
  return plugin;
}

exports.SizePluginSymbol = SizePluginSymbol;
exports.createSizePlugin = createSizePlugin;
exports.default = createSizePlugin;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
