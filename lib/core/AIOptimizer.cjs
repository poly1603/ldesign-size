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

var DeviceDetector = require('./DeviceDetector.cjs');
var SizeManager = require('./SizeManager.cjs');

class AIOptimizer {
  constructor(config) {
    this.userBehaviorData = [];
    this.optimizationHistory = [];
    this.isLearning = false;
    this.eventListeners = [];
    this.intervalIds = [];
    this.timeoutIds = [];
    this.isDestroyed = false;
    this.config = {
      apiUrl: "https://api.deepseek.com/v1",
      model: "deepseek-chat",
      temperature: 0.7,
      maxTokens: 1e3,
      ...config
    };
    if (!this.config.apiKey) {
      console.warn("[AIOptimizer] No API key provided, AI features will be limited");
    }
  }
  /**
   * Auto-adjust sizes based on content
   */
  async autoAdjustByContent(element) {
    if (!this.config.apiKey) {
      console.warn("[AIOptimizer] API key required for AI features");
      return;
    }
    const content = this.analyzeContent(element);
    const suggestions = await this.getAISuggestions(content);
    if (suggestions.length > 0) {
      await this.applySuggestions(suggestions);
    }
  }
  /**
   * Analyze content structure
   */
  analyzeContent(element) {
    const text = element.textContent || "";
    const images = element.querySelectorAll("img");
    const tables = element.querySelectorAll("table");
    const code = element.querySelectorAll("code, pre");
    return {
      contentLength: text.length,
      hasImages: images.length > 0,
      hasTables: tables.length > 0,
      hasCode: code.length > 0,
      title: document.title,
      url: window.location.href
    };
  }
  /**
   * Get AI suggestions from DeepSeek
   */
  async getAISuggestions(context) {
    const prompt = this.buildPrompt(context);
    try {
      const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{
            role: "system",
            content: "You are a UI/UX expert specializing in typography and sizing optimization. Provide specific size recommendations in pixels, rem, or em units."
          }, {
            role: "user",
            content: prompt
          }],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          response_format: {
            type: "json_object"
          }
        })
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      return this.parseAIResponse(data);
    } catch (error) {
      console.error("[AIOptimizer] Failed to get AI suggestions:", error);
      return [];
    }
  }
  /**
   * Build prompt for AI
   */
  buildPrompt(context) {
    const device = DeviceDetector.getDeviceDetector().getDevice();
    const viewport = DeviceDetector.getDeviceDetector().getViewport();
    const currentConfig = SizeManager.sizeManager.getConfig();
    return `
      Analyze the following page context and suggest optimal size configurations:
      
      Device: ${device}
      Viewport: ${viewport.width}x${viewport.height}
      Current Base Size: ${currentConfig.baseSize}px
      
      Page Context:
      - Content Length: ${context.contentLength} characters
      - Has Images: ${context.hasImages}
      - Has Tables: ${context.hasTables}
      - Has Code Blocks: ${context.hasCode}
      
      Please provide size optimization suggestions in JSON format:
      {
        "suggestions": [
          {
            "property": "baseSize",
            "currentValue": "${currentConfig.baseSize}px",
            "suggestedValue": "suggested_value",
            "confidence": 0.0-1.0,
            "reason": "explanation"
          }
        ]
      }
      
      Consider:
      1. Readability for the device type
      2. Content density
      3. User experience best practices
      4. Accessibility guidelines (WCAG)
    `;
  }
  /**
   * Parse AI response
   */
  parseAIResponse(response) {
    try {
      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return parsed.suggestions.filter((s) => s.property && s.suggestedValue && s.confidence >= 0.5);
      }
    } catch (error) {
      console.error("[AIOptimizer] Failed to parse AI response:", error);
    }
    return [];
  }
  /**
   * Apply AI suggestions
   */
  async applySuggestions(suggestions) {
    for (const suggestion of suggestions) {
      if (suggestion.confidence >= 0.7) {
        console.info(`[AIOptimizer] Applying suggestion: ${suggestion.property} = ${suggestion.suggestedValue} (${suggestion.reason})`);
        if (suggestion.property === "baseSize") {
          const value = Number.parseFloat(suggestion.suggestedValue);
          if (!Number.isNaN(value) && value > 0 && value <= 32) {
            SizeManager.sizeManager.setBaseSize(value);
          }
        }
        this.optimizationHistory.push(suggestion);
        if (this.optimizationHistory.length > AIOptimizer.MAX_HISTORY_SIZE) {
          this.optimizationHistory = this.optimizationHistory.slice(-AIOptimizer.MAX_HISTORY_SIZE);
        }
      }
    }
  }
  /**
   * Optimize for readability
   */
  async optimizeReadability(options = {}) {
    const {
      targetAudience = "adults",
      contentType = "article",
      lightingConditions = "normal",
      viewingDistance = "normal"
    } = options;
    let baseSizeMultiplier = 1;
    switch (targetAudience) {
      case "children":
        baseSizeMultiplier *= 1.2;
        break;
      case "elderly":
        baseSizeMultiplier *= 1.3;
        break;
    }
    switch (contentType) {
      case "article":
        baseSizeMultiplier *= 1.1;
        break;
      case "dashboard":
        baseSizeMultiplier *= 0.95;
        break;
      case "mobile-app":
        baseSizeMultiplier *= 1.05;
        break;
    }
    switch (lightingConditions) {
      case "bright":
        baseSizeMultiplier *= 0.95;
        break;
      case "dim":
        baseSizeMultiplier *= 1.1;
        break;
    }
    switch (viewingDistance) {
      case "close":
        baseSizeMultiplier *= 0.9;
        break;
      case "far":
        baseSizeMultiplier *= 1.2;
        break;
    }
    const currentConfig = SizeManager.sizeManager.getConfig();
    const optimizedBaseSize = Math.round(currentConfig.baseSize * baseSizeMultiplier);
    if (Math.abs(optimizedBaseSize - currentConfig.baseSize) >= 1) {
      SizeManager.sizeManager.setBaseSize(optimizedBaseSize);
      console.info(`[AIOptimizer] Readability optimized: baseSize ${currentConfig.baseSize}px \u2192 ${optimizedBaseSize}px`);
    }
    if (this.config.apiKey) {
      const context = {
        contentType,
        userPreferences: {
          targetAudience,
          lightingConditions,
          viewingDistance
        }
      };
      const suggestions = await this.getAISuggestions(context);
      await this.applySuggestions(suggestions);
    }
  }
  /**
   * Learn from user behavior
   */
  learnFromUserBehavior() {
    if (!this.isLearning) {
      this.isLearning = true;
      this.startBehaviorTracking();
    }
  }
  /**
   * Start behavior tracking
   */
  startBehaviorTracking() {
    if (typeof window === "undefined") return;
    const behavior = {
      scrollPatterns: [],
      clickPatterns: [],
      zoomLevel: 1,
      sessionDuration: 0,
      bounceRate: 0
    };
    const startTime = Date.now();
    let scrollTimer = null;
    const scrollHandler = () => {
      if (this.isDestroyed) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (behavior.scrollPatterns.length > 100) {
          behavior.scrollPatterns = behavior.scrollPatterns.slice(-50);
        }
        behavior.scrollPatterns.push({
          position: window.scrollY,
          duration: Date.now() - startTime
        });
      }, 100);
    };
    window.addEventListener("scroll", scrollHandler, {
      passive: true
    });
    this.eventListeners.push({
      element: window,
      event: "scroll",
      handler: scrollHandler
    });
    const clickHandler = (e) => {
      if (this.isDestroyed) return;
      const target = e.target;
      const selector = this.getElementSelector(target);
      const existing = behavior.clickPatterns.find((p) => p.element === selector);
      if (existing) {
        existing.count++;
      } else {
        if (behavior.clickPatterns.length > 50) {
          behavior.clickPatterns = behavior.clickPatterns.slice(-25);
        }
        behavior.clickPatterns.push({
          element: selector,
          count: 1
        });
      }
    };
    document.addEventListener("click", clickHandler, {
      passive: true
    });
    this.eventListeners.push({
      element: document,
      event: "click",
      handler: clickHandler
    });
    const checkZoom = () => {
      behavior.zoomLevel = window.devicePixelRatio || 1;
    };
    const resizeHandler = () => {
      if (!this.isDestroyed) checkZoom();
    };
    window.addEventListener("resize", resizeHandler, {
      passive: true
    });
    this.eventListeners.push({
      element: window,
      event: "resize",
      handler: resizeHandler
    });
    checkZoom();
    const intervalId = setInterval(() => {
      if (this.isDestroyed) {
        clearInterval(intervalId);
        return;
      }
      behavior.sessionDuration = Date.now() - startTime;
      this.analyzeBehavior(behavior);
    }, 3e4);
    this.intervalIds.push(intervalId);
  }
  /**
   * Get element selector
   */
  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(" ")[0]}`;
    return element.tagName.toLowerCase();
  }
  /**
   * Analyze user behavior
   */
  async analyzeBehavior(behavior) {
    const behaviorCopy = {
      ...behavior,
      scrollPatterns: [...behavior.scrollPatterns].slice(-20),
      // Keep only last 20 scroll patterns
      clickPatterns: [...behavior.clickPatterns].slice(-20)
      // Keep only last 20 click patterns
    };
    this.userBehaviorData.push(behaviorCopy);
    if (this.userBehaviorData.length > AIOptimizer.MAX_BEHAVIOR_DATA) {
      this.userBehaviorData = this.userBehaviorData.slice(-AIOptimizer.MAX_BEHAVIOR_DATA);
    }
    const patterns = this.extractPatterns();
    if (patterns.needsLargerText) {
      console.info("[AIOptimizer] User behavior suggests larger text size needed");
      const currentSize = SizeManager.sizeManager.getConfig().baseSize;
      SizeManager.sizeManager.setBaseSize(Math.min(currentSize + 1, 24));
    }
    if (patterns.needsMoreSpacing) {
      console.info("[AIOptimizer] User behavior suggests more spacing needed");
    }
    if (this.config.apiKey) {
      await this.getPersonalizedSuggestions(patterns);
    }
  }
  /**
   * Extract behavior patterns
   */
  extractPatterns() {
    if (this.userBehaviorData.length === 0) return {};
    const avgZoom = this.userBehaviorData.reduce((sum, b) => sum + b.zoomLevel, 0) / this.userBehaviorData.length;
    const avgSessionDuration = this.userBehaviorData.reduce((sum, b) => sum + b.sessionDuration, 0) / this.userBehaviorData.length;
    return {
      needsLargerText: avgZoom > 1.1,
      needsMoreSpacing: avgSessionDuration < 6e4,
      // Less than 1 minute suggests difficulty
      frequentlyClickedElements: this.getMostClicked(),
      scrollDepth: this.getAverageScrollDepth()
    };
  }
  /**
   * Get most clicked elements
   */
  getMostClicked() {
    const allClicks = {};
    this.userBehaviorData.forEach((behavior) => {
      behavior.clickPatterns.forEach((pattern) => {
        allClicks[pattern.element] = (allClicks[pattern.element] || 0) + pattern.count;
      });
    });
    return Object.entries(allClicks).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([element]) => element);
  }
  /**
   * Get average scroll depth
   */
  getAverageScrollDepth() {
    if (this.userBehaviorData.length === 0) return 0;
    const depths = this.userBehaviorData.flatMap((b) => b.scrollPatterns.map((p) => p.position));
    if (depths.length === 0) return 0;
    const maxScroll = Math.max(...depths);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? maxScroll / docHeight * 100 : 0;
  }
  /**
   * Get personalized suggestions based on patterns
   */
  async getPersonalizedSuggestions(_patterns) {
    console.info("[AIOptimizer] Analyzing user patterns for personalization");
  }
  /**
   * Recommend preset based on context
   */
  async recommendPreset(context) {
    const device = DeviceDetector.getDeviceDetector().getDevice();
    const isTouch = DeviceDetector.getDeviceDetector().isTouch();
    if (device === "mobile") {
      return isTouch ? "comfortable" : "compact";
    } else if (device === "tablet") {
      return "comfortable";
    } else if (device === "desktop" || device === "laptop") {
      if (context.contentType === "dashboard") {
        return "compact";
      } else if (context.contentType === "article") {
        return "spacious";
      }
      return "default";
    } else {
      return "spacious";
    }
  }
  /**
   * Get optimization history
   */
  getHistory() {
    return [...this.optimizationHistory];
  }
  /**
   * Clear optimization history
   */
  clearHistory() {
    this.optimizationHistory = [];
  }
  /**
   * Stop learning
   */
  stopLearning() {
    this.isLearning = false;
    this.cleanup();
  }
  /**
   * Clean up resources
   */
  cleanup() {
    this.eventListeners.forEach(({
      element,
      event,
      handler
    }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }
  /**
   * Destroy the optimizer
   */
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.stopLearning();
    this.userBehaviorData = [];
    this.optimizationHistory = [];
  }
  /**
   * Export learned preferences
   */
  exportPreferences() {
    const preferences = {
      behaviorData: this.userBehaviorData,
      optimizationHistory: this.optimizationHistory,
      patterns: this.extractPatterns(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return JSON.stringify(preferences, null, 2);
  }
  /**
   * Import learned preferences
   */
  importPreferences(json) {
    try {
      const preferences = JSON.parse(json);
      this.userBehaviorData = preferences.behaviorData || [];
      this.optimizationHistory = preferences.optimizationHistory || [];
      console.info("[AIOptimizer] Preferences imported successfully");
    } catch (error) {
      console.error("[AIOptimizer] Failed to import preferences:", error);
    }
  }
}
AIOptimizer.MAX_HISTORY_SIZE = 50;
AIOptimizer.MAX_BEHAVIOR_DATA = 10;
let optimizer = null;
function getAIOptimizer(config) {
  if (!optimizer && config) {
    optimizer = new AIOptimizer(config);
  } else if (!optimizer) {
    optimizer = new AIOptimizer({
      apiKey: ""
    });
  }
  return optimizer;
}
const ai = {
  /**
   * Initialize with API key
   */
  init: (apiKey) => getAIOptimizer({
    apiKey
  }),
  /**
   * Auto-adjust by content
   */
  auto: (element) => getAIOptimizer().autoAdjustByContent(element),
  /**
   * Optimize readability
   */
  readability: (options) => getAIOptimizer().optimizeReadability(options),
  /**
   * Start learning
   */
  learn: () => getAIOptimizer().learnFromUserBehavior(),
  /**
   * Recommend preset
   */
  recommend: (context) => getAIOptimizer().recommendPreset(context),
  /**
   * Get history
   */
  history: () => getAIOptimizer().getHistory()
};

exports.AIOptimizer = AIOptimizer;
exports.ai = ai;
exports.getAIOptimizer = getAIOptimizer;
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=AIOptimizer.cjs.map
