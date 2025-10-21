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
var index = require('../locales/index.cjs');
var plugin = require('./plugin.cjs');
var useSize = require('./useSize.cjs');

const _hoisted_1 = ["aria-expanded", "aria-label"];
const _hoisted_2 = {
  key: 0,
  class: "size-panel"
};
const _hoisted_3 = {
  class: "size-panel-header"
};
const _hoisted_4 = {
  class: "size-panel-title"
};
const _hoisted_5 = ["aria-label"];
const _hoisted_6 = {
  class: "size-panel-content"
};
const _hoisted_7 = ["onClick"];
const _hoisted_8 = {
  class: "size-option-main"
};
const _hoisted_9 = {
  class: "size-option-label"
};
const _hoisted_10 = {
  class: "size-option-desc"
};
const _hoisted_11 = {
  class: "size-option-badge"
};
const _hoisted_12 = {
  key: 0,
  class: "size-option-check",
  xmlns: "http://www.w3.org/2000/svg",
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
var script = /* @__PURE__ */ vue.defineComponent({
  __name: "SizeSelector",
  setup(__props) {
    const {
      currentPreset,
      applyPreset,
      presets: presetsRef
    } = useSize.useSize();
    const presets = vue.computed(() => presetsRef.value || []);
    const isOpen = vue.ref(false);
    const selectorRef = vue.ref();
    if (typeof globalThis !== "undefined" && globalThis.process?.env?.NODE_ENV === "development" || false) {
      console.info("[SizeSelector] \u521D\u59CB\u5316", {
        currentPreset: currentPreset.value,
        presetsCount: presets.value.length,
        presets: presets.value.map((p) => ({
          name: p.name,
          baseSize: p.baseSize
        }))
      });
    }
    const hasPresets = vue.computed(() => presets.value.length > 0);
    const appLocale = vue.inject("locale", null);
    const pluginLocale = vue.inject(plugin.SIZE_LOCALE_KEY, "zh-CN");
    const customLocale = vue.inject(plugin.SIZE_CUSTOM_LOCALE_KEY, void 0);
    const currentLocale = vue.computed(() => {
      if (appLocale && appLocale.value) {
        return appLocale.value;
      }
      return pluginLocale;
    });
    const t = vue.computed(() => {
      const baseLocale = index.getLocale(currentLocale.value);
      if (!customLocale) return baseLocale;
      return {
        ...baseLocale,
        title: customLocale.title || baseLocale.title,
        presets: {
          ...baseLocale.presets,
          ...customLocale.presets
        },
        descriptions: {
          ...baseLocale.descriptions,
          ...customLocale.descriptions
        }
      };
    });
    vue.watch(currentLocale, () => {
    });
    function getPresetLabel(name) {
      return t.value.presets[name] || name;
    }
    function getPresetDescription(name) {
      return t.value.descriptions[name] || "";
    }
    function togglePanel() {
      isOpen.value = !isOpen.value;
    }
    function closePanel() {
      isOpen.value = false;
    }
    function selectPreset(name) {
      if (typeof globalThis !== "undefined" && globalThis.process?.env?.NODE_ENV === "development" || false) {
        console.info("[SizeSelector] selectPreset \u88AB\u8C03\u7528:", name);
      }
      applyPreset(name);
      closePanel();
      if (typeof globalThis !== "undefined" && globalThis.process?.env?.NODE_ENV === "development" || false) {
        console.info("[SizeSelector] selectPreset \u5B8C\u6210");
      }
    }
    function handleClickOutside(event) {
      if (selectorRef.value && !selectorRef.value.contains(event.target)) {
        closePanel();
      }
    }
    vue.onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    vue.onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _cache) => {
      return hasPresets.value ? (vue.openBlock(), vue.createElementBlock(
        "div",
        {
          key: 0,
          ref_key: "selectorRef",
          ref: selectorRef,
          class: "size-selector"
        },
        [vue.createCommentVNode(" \u89E6\u53D1\u6309\u94AE "), vue.createElementVNode("button", {
          class: "size-trigger",
          "aria-expanded": isOpen.value,
          "aria-label": t.value?.ariaLabel || "\u8C03\u6574\u5C3A\u5BF8",
          onClick: togglePanel
        }, [..._cache[0] || (_cache[0] = [vue.createStaticVNode('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarge-small-icon lucide-a-large-small" data-v-0c54c862><path d="m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16" data-v-0c54c862></path><path d="M15.697 14h5.606" data-v-0c54c862></path><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" data-v-0c54c862></path><path d="M3.304 13h6.392" data-v-0c54c862></path></svg>', 1)])], 8, _hoisted_1), vue.createCommentVNode(" \u5F39\u7A97\u9762\u677F "), vue.createVNode(vue.Transition, {
          name: "size-panel"
        }, {
          default: vue.withCtx(() => [isOpen.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [vue.createElementVNode("div", _hoisted_3, [vue.createElementVNode(
            "h3",
            _hoisted_4,
            vue.toDisplayString(t.value?.title || "\u9009\u62E9\u5C3A\u5BF8"),
            1
            /* TEXT */
          ), vue.createElementVNode("button", {
            class: "size-panel-close",
            "aria-label": t.value?.close || "\u5173\u95ED",
            onClick: closePanel
          }, [..._cache[1] || (_cache[1] = [vue.createElementVNode(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            },
            [vue.createElementVNode("path", {
              d: "M18 6 6 18"
            }), vue.createElementVNode("path", {
              d: "m6 6 12 12"
            })],
            -1
            /* CACHED */
          )])], 8, _hoisted_5)]), vue.createElementVNode("div", _hoisted_6, [(vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(presets.value, (preset) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: preset.name,
                class: vue.normalizeClass(["size-option", {
                  "size-option-active": vue.unref(currentPreset) === preset.name
                }]),
                onClick: ($event) => selectPreset(preset.name)
              }, [vue.createElementVNode("div", _hoisted_8, [vue.createElementVNode(
                "div",
                _hoisted_9,
                vue.toDisplayString(getPresetLabel(preset.name)),
                1
                /* TEXT */
              ), vue.createElementVNode(
                "div",
                _hoisted_10,
                vue.toDisplayString(getPresetDescription(preset.name)),
                1
                /* TEXT */
              )]), vue.createElementVNode(
                "div",
                _hoisted_11,
                vue.toDisplayString(preset.baseSize) + "px ",
                1
                /* TEXT */
              ), vue.unref(currentPreset) === preset.name ? (vue.openBlock(), vue.createElementBlock("svg", _hoisted_12, [..._cache[2] || (_cache[2] = [vue.createElementVNode(
                "path",
                {
                  d: "M20 6 9 17l-5-5"
                },
                null,
                -1
                /* CACHED */
              )])])) : vue.createCommentVNode("v-if", true)], 10, _hoisted_7);
            }),
            128
            /* KEYED_FRAGMENT */
          ))])])) : vue.createCommentVNode("v-if", true)]),
          _: 1
          /* STABLE */
        })],
        512
        /* NEED_PATCH */
      )) : vue.createCommentVNode("v-if", true);
    };
  }
});

exports.default = script;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=SizeSelector.vue2.cjs.map
