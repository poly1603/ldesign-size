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

var vue = require('vue');
var plugin = require('./plugin.cjs');

const DEFAULT_PRESETS = Object.freeze([Object.freeze({
  name: "small",
  baseSize: 12,
  label: "Small"
}), Object.freeze({
  name: "medium",
  baseSize: 14,
  label: "Medium"
}), Object.freeze({
  name: "large",
  baseSize: 16,
  label: "Large"
})]);
const managerCache = /* @__PURE__ */ new WeakMap();
function createSizeApi(actualManager) {
  const config = vue.shallowRef(actualManager?.getConfig?.() || {
    baseSize: 14
  });
  const currentPreset = vue.ref(actualManager?.getCurrentPreset?.() || "medium");
  let unsubscribe = () => {
  };
  try {
    const subscribe = actualManager?.subscribe;
    if (subscribe && typeof subscribe === "function") {
      unsubscribe = subscribe((newConfig) => {
        config.value = newConfig;
        currentPreset.value = actualManager?.getCurrentPreset?.() || "medium";
      });
    }
  } catch {
  }
  const presets = vue.computed(() => {
    try {
      if (actualManager?.getPresets) return actualManager.getPresets();
    } catch (error) {
      console.warn("getPresets failed:", error);
    }
    return DEFAULT_PRESETS;
  });
  return {
    config: vue.readonly(config),
    currentPreset: vue.readonly(currentPreset),
    presets,
    setBaseSize: (baseSize) => {
      try {
        if (actualManager?.setBaseSize) actualManager.setBaseSize(baseSize);
      } catch (error) {
        console.warn("setBaseSize failed:", error);
      }
    },
    applyPreset: (presetName) => {
      try {
        if (actualManager?.applyPreset) {
          actualManager.applyPreset(presetName);
          currentPreset.value = presetName;
        } else {
          console.warn("[useSize] applyPreset \u65B9\u6CD5\u4E0D\u5B58\u5728");
        }
      } catch (error) {
        console.warn("[useSize] applyPreset failed:", error);
      }
    },
    cleanup: unsubscribe
  };
}
function useSize() {
  let manager = vue.inject(plugin.SIZE_MANAGER_KEY);
  if (!manager) {
    if (!manager) {
      const defaultConfig = vue.shallowRef({
        baseSize: 14
      });
      const defaultPreset = vue.ref("medium");
      return {
        config: vue.readonly(defaultConfig),
        currentPreset: vue.readonly(defaultPreset),
        presets: vue.computed(() => DEFAULT_PRESETS),
        setBaseSize: () => {
          console.warn("[useSize] setBaseSize called but manager not available");
        },
        applyPreset: (name) => {
          console.warn("[useSize] applyPreset called but manager not available:", name);
          defaultPreset.value = name;
        },
        cleanup: () => {
        }
      };
    }
  }
  const actualManager = manager.manager || manager;
  let api = managerCache.get(actualManager);
  if (!api) {
    api = createSizeApi(actualManager);
    managerCache.set(actualManager, api);
  }
  vue.onBeforeUnmount(() => {
    api.cleanup();
  });
  return api;
}

exports.useSize = useSize;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=useSize.cjs.map
