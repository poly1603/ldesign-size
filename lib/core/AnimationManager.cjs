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

const DEFAULT_OPTIONS = {
  duration: 300,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  enabled: true,
  properties: ["font-size", "padding", "margin", "width", "height", "border-radius", "gap", "line-height", "letter-spacing"]
};
class AnimationManager {
  constructor(options = {}) {
    this.styleElement = null;
    this.isTransitioning = false;
    this.animationFrameId = null;
    this.pendingPromises = /* @__PURE__ */ new WeakSet();
    this.pendingTimeouts = /* @__PURE__ */ new Set();
    this.isDestroyed = false;
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }
  /**
   * Enable smooth transitions for size changes
   */
  enableTransitions() {
    if (!this.options.enabled || typeof document === "undefined") return;
    const css = this.generateTransitionCSS();
    if (!this.styleElement) {
      this.styleElement = document.createElement("style");
      this.styleElement.id = "ldesign-size-transitions";
      document.head.appendChild(this.styleElement);
    }
    this.styleElement.textContent = css;
    this.isTransitioning = true;
  }
  /**
   * Disable transitions temporarily
   */
  disableTransitions() {
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
    this.isTransitioning = false;
  }
  /**
   * Perform a size change with animation
   */
  async animateSizeChange(beforeChange, afterChange) {
    if (!this.options.enabled || this.isDestroyed) {
      beforeChange();
      afterChange?.();
      return;
    }
    this.disableTransitions();
    if (typeof document !== "undefined") {
      void document.body.offsetHeight;
    }
    this.enableTransitions();
    beforeChange();
    const transitionPromise = this.waitForTransition();
    this.pendingPromises.add(transitionPromise);
    try {
      await transitionPromise;
    } finally {
    }
    if (afterChange) {
      afterChange();
    }
  }
  /**
   * Wait for transitions to complete
   */
  async waitForTransition() {
    return new Promise((resolve, reject) => {
      if (this.isDestroyed) {
        reject(new Error("AnimationManager is destroyed"));
        return;
      }
      const timeoutId = setTimeout(() => {
        this.pendingTimeouts.delete(timeoutId);
        if (!this.isDestroyed) {
          resolve();
        } else {
          reject(new Error("AnimationManager was destroyed during transition"));
        }
      }, this.options.duration || 300);
      this.pendingTimeouts.add(timeoutId);
      if (this.isDestroyed) {
        clearTimeout(timeoutId);
        this.pendingTimeouts.delete(timeoutId);
        reject(new Error("AnimationManager is destroyed"));
      }
    });
  }
  /**
   * Generate CSS for transitions
   */
  generateTransitionCSS() {
    const properties = this.options.properties?.join(", ") || "all";
    const duration = this.options.duration || 300;
    const easing = this.options.easing || "ease";
    return `
      * {
        transition-property: ${properties};
        transition-duration: ${duration}ms;
        transition-timing-function: ${easing};
      }
      
      /* Specific optimized transitions */
      :root {
        transition: none !important;
      }
      
      body,
      body * {
        transition-property: ${properties};
        transition-duration: ${duration}ms;
        transition-timing-function: ${easing};
      }
      
      /* Disable transitions for certain elements */
      img,
      video,
      iframe,
      canvas,
      svg {
        transition: none !important;
      }
      
      /* Performance optimization */
      .no-transition,
      .no-transition * {
        transition: none !important;
      }
    `;
  }
  /**
   * Update animation options
   */
  setOptions(options) {
    this.options = {
      ...this.options,
      ...options
    };
    if (this.isTransitioning) {
      this.enableTransitions();
    }
  }
  /**
   * Get current options
   */
  getOptions() {
    return {
      ...this.options
    };
  }
  /**
   * Check if transitions are active
   */
  isActive() {
    return this.isTransitioning;
  }
  /**
   * Destroy the animation manager
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.pendingTimeouts.clear();
    this.disableTransitions();
    this.options = Object.freeze({
      ...DEFAULT_OPTIONS
    });
  }
}
let animationManager = null;
function getAnimationManager() {
  if (!animationManager) {
    animationManager = new AnimationManager();
  }
  return animationManager;
}
function destroyAnimationManager() {
  if (animationManager) {
    animationManager.destroy();
    animationManager = null;
  }
}
const animate = {
  /**
   * Enable animations
   */
  enable: () => getAnimationManager().enableTransitions(),
  /**
   * Disable animations
   */
  disable: () => getAnimationManager().disableTransitions(),
  /**
   * Animate a change
   */
  change: (fn, after) => getAnimationManager().animateSizeChange(fn, after),
  /**
   * Set animation options
   */
  config: (options) => getAnimationManager().setOptions(options)
};

exports.AnimationManager = AnimationManager;
exports.animate = animate;
exports.destroyAnimationManager = destroyAnimationManager;
exports.getAnimationManager = getAnimationManager;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=AnimationManager.cjs.map
