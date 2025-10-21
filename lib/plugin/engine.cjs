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

var index = require('./index.cjs');

function createSizeEnginePlugin(options = {}) {
  const sizePlugin = index.createSizePlugin(options);
  return sizePlugin;
}
function useSizeFromEngine(engine) {
  return engine?.state?.get?.("plugins.size");
}

exports.createSizeEnginePlugin = createSizeEnginePlugin;
exports.useSizeFromEngine = useSizeFromEngine;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=engine.cjs.map
