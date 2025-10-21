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

var DeviceDetector = require('../core/DeviceDetector.cjs');
var FluidSize = require('../core/FluidSize.cjs');

const mobileCompact = {
  metadata: {
    name: "mobile-compact",
    label: "\u79FB\u52A8\u7D27\u51D1",
    description: "\u9002\u7528\u4E8E\u4FE1\u606F\u5BC6\u96C6\u7684\u79FB\u52A8\u754C\u9762",
    category: "device",
    tags: ["mobile", "compact", "dense"],
    icon: "\u{1F4F1}"
  },
  scheme: {
    name: "mobile-compact",
    description: "Compact mobile preset with minimal spacing",
    fontSize: {
      tiny: "0.625rem",
      // 10px
      small: "0.75rem",
      // 12px  
      medium: "0.875rem",
      // 14px
      large: "1rem",
      // 16px - iOS minimum to prevent zoom
      huge: "1.125rem",
      // 18px
      giant: "1.25rem",
      // 20px
      h1: "1.5rem",
      h2: "1.25rem",
      h3: "1.125rem",
      h4: "1rem",
      h5: "0.875rem",
      h6: "0.8125rem",
      caption: "0.625rem",
      overline: "0.5625rem",
      code: "0.75rem"
    },
    spacing: {
      none: "0",
      tiny: "0.125rem",
      // 2px
      small: "0.25rem",
      // 4px
      medium: "0.375rem",
      // 6px
      large: "0.5rem",
      // 8px
      huge: "0.75rem",
      // 12px
      giant: "1rem",
      // 16px
      massive: "1.5rem",
      colossal: "2rem"
    },
    radius: {
      none: "0",
      small: "0.125rem",
      medium: "0.1875rem",
      large: "0.25rem",
      huge: "0.375rem",
      full: "9999px",
      circle: "50%"
    },
    lineHeight: {
      none: 1,
      tight: 1.2,
      snug: 1.3,
      normal: 1.4,
      relaxed: 1.5,
      loose: 1.6
    },
    letterSpacing: {
      tighter: "-0.03em",
      tight: "-0.015em",
      normal: "0",
      wide: "0.01em",
      wider: "0.02em",
      widest: "0.03em"
    },
    components: {
      button: {
        tiny: {
          height: "2rem",
          padding: "0 0.5rem",
          fontSize: "0.75rem"
        },
        small: {
          height: "2.25rem",
          padding: "0 0.625rem",
          fontSize: "0.875rem"
        },
        medium: {
          height: "2.75rem",
          padding: "0 0.875rem",
          fontSize: "1rem"
        },
        large: {
          height: "3rem",
          padding: "0 1rem",
          fontSize: "1rem"
        },
        huge: {
          height: "3.5rem",
          padding: "0 1.25rem",
          fontSize: "1.125rem"
        }
      },
      input: {
        small: {
          height: "2.25rem",
          padding: "0.375rem 0.5rem",
          fontSize: "1rem"
        },
        medium: {
          height: "2.75rem",
          padding: "0.5rem 0.75rem",
          fontSize: "1rem"
        },
        large: {
          height: "3rem",
          padding: "0.625rem 0.875rem",
          fontSize: "1rem"
        }
      },
      icon: {
        tiny: "0.75rem",
        small: "1rem",
        medium: "1.25rem",
        large: "1.5rem",
        huge: "1.75rem",
        giant: "2rem"
      },
      avatar: {
        tiny: "1.5rem",
        small: "1.75rem",
        medium: "2rem",
        large: "2.5rem",
        huge: "3rem",
        giant: "3.5rem"
      },
      card: {
        small: "0.5rem",
        medium: "0.75rem",
        large: "1rem"
      }
    },
    grid: {
      columns: 4,
      gutter: "0.5rem",
      margin: "0.5rem"
    },
    breakpoints: {
      xs: "320px",
      sm: "375px",
      md: "414px",
      lg: "768px"
    }
  }
};
const mobileTouch = {
  metadata: {
    name: "mobile-touch",
    label: "\u79FB\u52A8\u89E6\u63A7",
    description: "\u7B26\u5408 iOS/Android \u89E6\u63A7\u89C4\u8303\u7684\u79FB\u52A8\u9884\u8BBE",
    category: "device",
    tags: ["mobile", "touch", "accessibility"],
    icon: "\u{1F446}"
  },
  // 使用缓存避免重复计算
  scheme: /* @__PURE__ */ (() => {
    let cachedScheme = null;
    let lastTouchSize = null;
    return () => {
      const touchSize = DeviceDetector.getDeviceDetector().getTouchTargetSize();
      if (cachedScheme && lastTouchSize === touchSize) {
        return cachedScheme;
      }
      lastTouchSize = touchSize;
      cachedScheme = {
        name: "mobile-touch",
        description: "Touch-optimized mobile preset",
        fontSize: {
          tiny: "0.75rem",
          small: "0.875rem",
          medium: "1rem",
          // 16px minimum
          large: "1.125rem",
          huge: "1.25rem",
          giant: "1.5rem",
          h1: FluidSize.fluid.text("h1"),
          h2: FluidSize.fluid.text("h2"),
          h3: FluidSize.fluid.text("h3"),
          h4: FluidSize.fluid.text("h4"),
          h5: FluidSize.fluid.text("h5"),
          h6: FluidSize.fluid.text("h6"),
          display1: FluidSize.fluid.size(2, 3),
          display2: FluidSize.fluid.size(1.75, 2.5),
          display3: FluidSize.fluid.size(1.5, 2),
          caption: "0.75rem",
          overline: "0.6875rem",
          code: "0.875rem"
        },
        spacing: {
          none: "0",
          tiny: "0.25rem",
          small: "0.5rem",
          medium: "0.75rem",
          large: "1rem",
          huge: "1.5rem",
          giant: "2rem",
          massive: "3rem",
          colossal: "4rem",
          half: "0.375rem",
          quarter: "0.1875rem",
          double: "1.5rem"
        },
        radius: {
          none: "0",
          small: "0.25rem",
          medium: "0.375rem",
          large: "0.5rem",
          huge: "0.75rem",
          full: "9999px",
          circle: "50%"
        },
        lineHeight: {
          none: 1,
          tight: 1.3,
          snug: 1.4,
          normal: 1.5,
          relaxed: 1.6,
          loose: 1.75
        },
        letterSpacing: {
          tighter: "-0.025em",
          tight: "-0.0125em",
          normal: "0",
          wide: "0.0125em",
          wider: "0.025em",
          widest: "0.05em"
        },
        components: {
          button: {
            tiny: {
              height: `${Math.max(36, touchSize * 0.8)}px`,
              padding: "0 0.75rem",
              fontSize: "0.875rem"
            },
            small: {
              height: `${Math.max(40, touchSize * 0.9)}px`,
              padding: "0 1rem",
              fontSize: "0.9375rem"
            },
            medium: {
              height: `${touchSize}px`,
              padding: "0 1.25rem",
              fontSize: "1rem"
            },
            large: {
              height: `${touchSize * 1.1}px`,
              padding: "0 1.5rem",
              fontSize: "1.125rem"
            },
            huge: {
              height: `${touchSize * 1.25}px`,
              padding: "0 2rem",
              fontSize: "1.25rem"
            }
          },
          input: {
            small: {
              height: `${Math.max(40, touchSize * 0.9)}px`,
              padding: "0.5rem 0.75rem",
              fontSize: "1rem"
              // 16px to prevent iOS zoom
            },
            medium: {
              height: `${touchSize}px`,
              padding: "0.625rem 1rem",
              fontSize: "1rem"
            },
            large: {
              height: `${touchSize * 1.15}px`,
              padding: "0.75rem 1.25rem",
              fontSize: "1.125rem"
            }
          },
          icon: {
            tiny: "1rem",
            small: "1.25rem",
            medium: "1.5rem",
            large: "1.75rem",
            huge: "2rem",
            giant: "2.5rem"
          },
          avatar: {
            tiny: "2rem",
            small: "2.5rem",
            medium: "3rem",
            large: "3.5rem",
            huge: "4rem",
            giant: "5rem"
          },
          card: {
            small: "0.75rem",
            medium: "1rem",
            large: "1.5rem"
          }
        },
        grid: {
          columns: 6,
          gutter: "1rem",
          margin: "1rem"
        },
        breakpoints: {
          xs: "320px",
          sm: "375px",
          md: "414px",
          lg: "768px",
          xl: "1024px"
        }
      };
      return cachedScheme;
    };
  })()
};

exports.mobileCompact = mobileCompact;
exports.mobileTouch = mobileTouch;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=mobile.cjs.map
