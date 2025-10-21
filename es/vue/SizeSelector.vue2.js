/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { defineComponent, computed, ref, inject, watch, onMounted, onBeforeUnmount, createElementBlock, createCommentVNode, openBlock, createElementVNode, createVNode, createStaticVNode, Transition, withCtx, toDisplayString, Fragment, renderList, normalizeClass, unref } from 'vue';
import { getLocale } from '../locales/index.js';
import { SIZE_LOCALE_KEY, SIZE_CUSTOM_LOCALE_KEY } from './plugin.js';
import { useSize } from './useSize.js';

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
var script = /* @__PURE__ */ defineComponent({
  __name: "SizeSelector",
  setup(__props) {
    const {
      currentPreset,
      applyPreset,
      presets: presetsRef
    } = useSize();
    const presets = computed(() => presetsRef.value || []);
    const isOpen = ref(false);
    const selectorRef = ref();
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
    const hasPresets = computed(() => presets.value.length > 0);
    const appLocale = inject("locale", null);
    const pluginLocale = inject(SIZE_LOCALE_KEY, "zh-CN");
    const customLocale = inject(SIZE_CUSTOM_LOCALE_KEY, void 0);
    const currentLocale = computed(() => {
      if (appLocale && appLocale.value) {
        return appLocale.value;
      }
      return pluginLocale;
    });
    const t = computed(() => {
      const baseLocale = getLocale(currentLocale.value);
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
    watch(currentLocale, () => {
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
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    return (_ctx, _cache) => {
      return hasPresets.value ? (openBlock(), createElementBlock(
        "div",
        {
          key: 0,
          ref_key: "selectorRef",
          ref: selectorRef,
          class: "size-selector"
        },
        [createCommentVNode(" \u89E6\u53D1\u6309\u94AE "), createElementVNode("button", {
          class: "size-trigger",
          "aria-expanded": isOpen.value,
          "aria-label": t.value?.ariaLabel || "\u8C03\u6574\u5C3A\u5BF8",
          onClick: togglePanel
        }, [..._cache[0] || (_cache[0] = [createStaticVNode('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarge-small-icon lucide-a-large-small" data-v-0c54c862><path d="m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16" data-v-0c54c862></path><path d="M15.697 14h5.606" data-v-0c54c862></path><path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" data-v-0c54c862></path><path d="M3.304 13h6.392" data-v-0c54c862></path></svg>', 1)])], 8, _hoisted_1), createCommentVNode(" \u5F39\u7A97\u9762\u677F "), createVNode(Transition, {
          name: "size-panel"
        }, {
          default: withCtx(() => [isOpen.value ? (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode(
            "h3",
            _hoisted_4,
            toDisplayString(t.value?.title || "\u9009\u62E9\u5C3A\u5BF8"),
            1
            /* TEXT */
          ), createElementVNode("button", {
            class: "size-panel-close",
            "aria-label": t.value?.close || "\u5173\u95ED",
            onClick: closePanel
          }, [..._cache[1] || (_cache[1] = [createElementVNode(
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
            [createElementVNode("path", {
              d: "M18 6 6 18"
            }), createElementVNode("path", {
              d: "m6 6 12 12"
            })],
            -1
            /* CACHED */
          )])], 8, _hoisted_5)]), createElementVNode("div", _hoisted_6, [(openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList(presets.value, (preset) => {
              return openBlock(), createElementBlock("div", {
                key: preset.name,
                class: normalizeClass(["size-option", {
                  "size-option-active": unref(currentPreset) === preset.name
                }]),
                onClick: ($event) => selectPreset(preset.name)
              }, [createElementVNode("div", _hoisted_8, [createElementVNode(
                "div",
                _hoisted_9,
                toDisplayString(getPresetLabel(preset.name)),
                1
                /* TEXT */
              ), createElementVNode(
                "div",
                _hoisted_10,
                toDisplayString(getPresetDescription(preset.name)),
                1
                /* TEXT */
              )]), createElementVNode(
                "div",
                _hoisted_11,
                toDisplayString(preset.baseSize) + "px ",
                1
                /* TEXT */
              ), unref(currentPreset) === preset.name ? (openBlock(), createElementBlock("svg", _hoisted_12, [..._cache[2] || (_cache[2] = [createElementVNode(
                "path",
                {
                  d: "M20 6 9 17l-5-5"
                },
                null,
                -1
                /* CACHED */
              )])])) : createCommentVNode("v-if", true)], 10, _hoisted_7);
            }),
            128
            /* KEYED_FRAGMENT */
          ))])])) : createCommentVNode("v-if", true)]),
          _: 1
          /* STABLE */
        })],
        512
        /* NEED_PATCH */
      )) : createCommentVNode("v-if", true);
    };
  }
});

export { script as default };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=SizeSelector.vue2.js.map
