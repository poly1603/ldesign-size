/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { createSizePlugin } from './index.js';

function createSizeEnginePlugin(options = {}) {
  const sizePlugin = createSizePlugin(options);
  return sizePlugin;
}
function useSizeFromEngine(engine) {
  return engine?.state?.get?.("plugins.size");
}

export { createSizeEnginePlugin, useSizeFromEngine };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=engine.js.map
