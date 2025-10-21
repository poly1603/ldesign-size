/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createSizePlugin } from '../plugin/index.js';

const SIZE_MANAGER_KEY = Symbol.for("size-manager");
const SIZE_LOCALE_KEY = Symbol("size-locale");
const SIZE_CUSTOM_LOCALE_KEY = Symbol("size-custom-locale");
const sizePlugin = {
  install(app, options = {}) {
    const plugin = createSizePlugin(options);
    plugin.install(app);
  }
};

export { SIZE_CUSTOM_LOCALE_KEY, SIZE_LOCALE_KEY, SIZE_MANAGER_KEY, sizePlugin };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=plugin.js.map
