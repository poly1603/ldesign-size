/*!
 * ***********************************
 * @ldesign/size v0.1.0            *
 * Built with rollup               *
 * Build time: 2024-10-21 14:33:38 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */
import { AnimationManager } from '../core/AnimationManager.js';

class GamifiedSizing {
  constructor(config = {}) {
    this.config = {
      enableAchievements: true,
      enableChallenges: true,
      enableLeaderboard: false,
      enableSounds: true,
      enableVisualEffects: true,
      saveProgress: true,
      storageKey: "gamified-sizing",
      ...config
    };
    this.userStats = this.loadUserStats();
    this.achievements = /* @__PURE__ */ new Map();
    this.challenges = /* @__PURE__ */ new Map();
    this.animationSystem = new AnimationManager();
    this.listeners = /* @__PURE__ */ new Set();
    this.interactiveModes = /* @__PURE__ */ new Map();
    this.sounds = /* @__PURE__ */ new Map();
    this.leaderboard = [];
    this.initializeAchievements();
    this.initializeChallenges();
    this.setupSounds();
  }
  /**
   * Initialize achievements
   */
  initializeAchievements() {
    const achievements = [{
      id: "first-adjustment",
      name: "First Steps",
      description: "Make your first size adjustment",
      icon: "\u{1F3AF}",
      points: 10,
      unlocked: false,
      condition: (stats) => stats.totalAdjustments >= 1,
      reward: {
        type: "unlock",
        value: "smooth-transitions",
        description: "Unlocked smooth transition effects"
      }
    }, {
      id: "size-explorer",
      name: "Size Explorer",
      description: "Try 10 different size adjustments",
      icon: "\u{1F50D}",
      points: 25,
      unlocked: false,
      condition: (stats) => stats.totalAdjustments >= 10,
      reward: {
        type: "boost",
        value: 1.1,
        description: "10% faster animations"
      }
    }, {
      id: "perfect-match",
      name: "Perfect Match",
      description: "Match the target size perfectly",
      icon: "\u2728",
      points: 50,
      unlocked: false,
      condition: (stats) => stats.perfectMatches >= 1,
      reward: {
        type: "effect",
        value: "golden-glow",
        description: "Golden glow effect for perfect matches"
      }
    }, {
      id: "size-master",
      name: "Size Master",
      description: "Reach level 10",
      icon: "\u{1F451}",
      points: 100,
      unlocked: false,
      condition: (stats) => stats.level >= 10,
      reward: {
        type: "theme",
        value: "master-theme",
        description: "Exclusive master theme unlocked"
      }
    }, {
      id: "experimenter",
      name: "The Experimenter",
      description: "Try 50 size experiments",
      icon: "\u{1F9EA}",
      points: 30,
      unlocked: false,
      condition: (stats) => stats.experimentsCount >= 50
    }, {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Complete a challenge in under 5 seconds",
      icon: "\u26A1",
      points: 40,
      unlocked: false,
      condition: (_stats) => false
      // Checked during challenge completion
    }, {
      id: "persistent",
      name: "Persistent",
      description: "Maintain a 7-day streak",
      icon: "\u{1F525}",
      points: 60,
      unlocked: false,
      condition: (stats) => stats.streakDays >= 7
    }, {
      id: "range-finder",
      name: "Range Finder",
      description: "Explore sizes from 8px to 72px",
      icon: "\u{1F4CF}",
      points: 35,
      unlocked: false,
      condition: (stats) => stats.sizeRange.min <= 8 && stats.sizeRange.max >= 72
    }];
    achievements.forEach((achievement) => {
      this.achievements.set(achievement.id, achievement);
    });
  }
  /**
   * Initialize challenges
   */
  initializeChallenges() {
    const challenges = [{
      id: "precise-picker",
      name: "Precise Picker",
      description: "Set the font size to exactly 16px",
      targetSize: 16,
      tolerance: 0,
      attempts: 0,
      completed: false,
      reward: {
        experience: 50,
        achievement: "perfect-match"
      }
    }, {
      id: "speed-sizer",
      name: "Speed Sizer",
      description: "Match 24px in under 5 seconds",
      targetSize: 24,
      tolerance: 1,
      timeLimit: 5,
      attempts: 0,
      completed: false,
      reward: {
        experience: 75,
        achievement: "speed-demon"
      }
    }, {
      id: "golden-ratio",
      name: "Golden Ratio",
      description: "Find the golden ratio size (1.618x base)",
      targetSize: 25.888,
      // 16 * 1.618
      tolerance: 0.5,
      attempts: 0,
      completed: false,
      reward: {
        experience: 100
      }
    }, {
      id: "responsive-ranger",
      name: "Responsive Ranger",
      description: "Set 3 different breakpoint sizes correctly",
      targetSize: 32,
      tolerance: 2,
      attempts: 0,
      completed: false,
      reward: {
        experience: 150
      }
    }];
    challenges.forEach((challenge) => {
      this.challenges.set(challenge.id, challenge);
    });
  }
  /**
   * Setup sound effects
   */
  setupSounds() {
    if (!this.config.enableSounds || typeof window === "undefined") return;
    this.createSound("adjust", 440, 0.1);
    this.createSound("achievement", 523.25, 0.2);
    this.createSound("perfect", 659.25, 0.3);
    this.createSound("levelup", 783.99, 0.4);
  }
  /**
   * Create a simple sound effect
   */
  createSound(name, _frequency, _duration) {
    const audio = new Audio();
    audio.volume = 0.3;
    this.sounds.set(name, audio);
  }
  /**
   * Play sound effect
   */
  playSound(name) {
    if (!this.config.enableSounds) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
      });
    }
  }
  // ============================================
  // Interactive Controls
  // ============================================
  /**
   * Enable drag-to-resize
   */
  enableDragResize(element, options) {
    const config = {
      min: 8,
      max: 72,
      step: 1,
      axis: "x",
      ...options
    };
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startSize = Number.parseInt(getComputedStyle(element).fontSize);
    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startSize = Number.parseInt(getComputedStyle(element).fontSize);
      element.style.cursor = "ew-resize";
      e.preventDefault();
    };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let delta = 0;
      if (config.axis === "x" || config.axis === "both") {
        delta += deltaX / 10;
      }
      if (config.axis === "y" || config.axis === "both") {
        delta -= deltaY / 10;
      }
      let newSize = startSize + delta;
      newSize = Math.round(newSize / config.step) * config.step;
      newSize = Math.max(config.min, Math.min(config.max, newSize));
      this.applySize(element, newSize, "drag");
    };
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = "";
      }
    };
    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    this.interactiveModes.set("drag", true);
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }
  /**
   * Enable scroll-to-resize
   */
  enableScrollResize(element, options) {
    const config = {
      min: 8,
      max: 72,
      step: 1,
      sensitivity: 0.5,
      ...options
    };
    const handleWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const currentSize = Number.parseInt(getComputedStyle(element).fontSize);
      const delta = -e.deltaY * config.sensitivity;
      let newSize = currentSize + delta;
      newSize = Math.round(newSize / config.step) * config.step;
      newSize = Math.max(config.min, Math.min(config.max, newSize));
      this.applySize(element, newSize, "scroll");
    };
    element.addEventListener("wheel", handleWheel, {
      passive: false
    });
    this.interactiveModes.set("scroll", true);
    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }
  /**
   * Enable gesture controls
   */
  enableGestureResize(element, options) {
    const config = {
      min: 8,
      max: 72,
      ...options
    };
    let initialDistance = 0;
    let initialSize = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        initialSize = Number.parseInt(getComputedStyle(element).fontSize);
      }
    };
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const scale = currentDistance / initialDistance;
        let newSize = initialSize * scale;
        newSize = Math.max(config.min, Math.min(config.max, newSize));
        this.applySize(element, Math.round(newSize), "gesture");
      }
    };
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false
    });
    element.addEventListener("touchmove", handleTouchMove, {
      passive: false
    });
    this.interactiveModes.set("gesture", true);
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
    };
  }
  // ============================================
  // Size Application
  // ============================================
  /**
   * Apply size with gamification
   */
  applySize(element, size, method) {
    const previousSize = Number.parseInt(getComputedStyle(element).fontSize);
    element.style.fontSize = `${size}px`;
    if (this.config.enableVisualEffects) {
      this.createVisualFeedback(element, size, previousSize);
    }
    this.playSound("adjust");
    const event = {
      element,
      previousSize,
      newSize: size,
      method,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.trackAdjustment(event);
    this.notifyListeners(event);
    this.checkAchievements();
    this.checkChallenges(size);
  }
  /**
   * Create visual feedback
   */
  createVisualFeedback(element, newSize, previousSize) {
    const diff = newSize - previousSize;
    const isGrowing = diff > 0;
    element.classList.add("size-changing");
    if (Math.abs(diff) > 5) {
      this.createParticleEffect(element, isGrowing);
    }
    setTimeout(() => {
      element.classList.remove("size-changing");
    }, 300);
  }
  /**
   * Create particle effect
   */
  createParticleEffect(element, isGrowing) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "size-particle";
      particle.style.position = "absolute";
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.width = "4px";
      particle.style.height = "4px";
      particle.style.backgroundColor = isGrowing ? "#4CAF50" : "#FF5722";
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "9999";
      document.body.appendChild(particle);
      const angle = i / particleCount * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const duration = 500 + Math.random() * 200;
      particle.animate([{
        transform: "translate(-50%, -50%) scale(1)",
        opacity: 1
      }, {
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
        opacity: 0
      }], {
        duration,
        easing: "ease-out"
      });
      setTimeout(() => {
        particle.remove();
      }, duration);
    }
  }
  // ============================================
  // Progress Tracking
  // ============================================
  /**
   * Track size adjustment
   */
  trackAdjustment(event) {
    this.userStats.totalAdjustments++;
    const size = event.newSize;
    this.userStats.sizeRange.min = Math.min(this.userStats.sizeRange.min, size);
    this.userStats.sizeRange.max = Math.max(this.userStats.sizeRange.max, size);
    this.addExperience(5);
    if (this.config.saveProgress) {
      this.saveUserStats();
    }
  }
  /**
   * Add experience points
   */
  addExperience(points) {
    this.userStats.experience += points;
    const requiredExp = this.getRequiredExperience(this.userStats.level);
    if (this.userStats.experience >= requiredExp) {
      this.levelUp();
    }
  }
  /**
   * Get required experience for level
   */
  getRequiredExperience(level) {
    return level * 100 + level ** 2 * 10;
  }
  /**
   * Level up
   */
  levelUp() {
    this.userStats.level++;
    this.userStats.experience = 0;
    this.playSound("levelup");
    if (this.config.enableVisualEffects) {
      this.showNotification(`Level Up! You're now level ${this.userStats.level}! \u{1F389}`);
    }
  }
  /**
   * Check achievements
   */
  checkAchievements() {
    this.achievements.forEach((achievement, id) => {
      if (!achievement.unlocked && achievement.condition(this.userStats)) {
        this.unlockAchievement(id);
      }
    });
  }
  /**
   * Unlock achievement
   */
  unlockAchievement(id) {
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.unlocked) return;
    achievement.unlocked = true;
    achievement.unlockedAt = /* @__PURE__ */ new Date();
    this.userStats.achievements.push(id);
    this.playSound("achievement");
    this.showNotification(`Achievement Unlocked: ${achievement.name} ${achievement.icon || "\u{1F3C6}"}`);
    if (achievement.reward) {
      this.applyReward(achievement.reward);
    }
    this.addExperience(achievement.points);
  }
  /**
   * Apply achievement reward
   */
  applyReward(reward) {
    switch (reward.type) {
      case "unlock":
        console.log(`Unlocked: ${reward.value}`);
        break;
      case "boost":
        console.log(`Boost applied: ${reward.value}x`);
        break;
      case "effect":
        console.log(`Effect enabled: ${reward.value}`);
        break;
      case "theme":
        console.log(`Theme unlocked: ${reward.value}`);
        break;
    }
  }
  /**
   * Check challenges
   */
  checkChallenges(currentSize) {
    this.challenges.forEach((challenge, id) => {
      if (challenge.completed) return;
      challenge.attempts++;
      const target = typeof challenge.targetSize === "number" ? challenge.targetSize : 0;
      if (Math.abs(currentSize - target) <= challenge.tolerance) {
        this.completeChallenge(id);
      }
    });
  }
  /**
   * Complete challenge
   */
  completeChallenge(id) {
    const challenge = this.challenges.get(id);
    if (!challenge || challenge.completed) return;
    challenge.completed = true;
    this.addExperience(challenge.reward.experience);
    if (challenge.reward.achievement) {
      this.unlockAchievement(challenge.reward.achievement);
    }
    this.showNotification(`Challenge Complete: ${challenge.name}! \u{1F3AF}`);
    this.playSound("perfect");
  }
  // ============================================
  // UI Helpers
  // ============================================
  /**
   * Show notification
   */
  showNotification(message) {
    if (typeof window === "undefined") return;
    const notification = document.createElement("div");
    notification.className = "gamified-notification";
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease-out";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3e3);
  }
  /**
   * Create progress bar
   */
  createProgressBar(container) {
    const progressBar = document.createElement("div");
    progressBar.className = "gamified-progress";
    progressBar.innerHTML = `
      <div class="level-info">
        <span class="level">Level ${this.userStats.level}</span>
        <span class="exp">${this.userStats.experience} XP</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
      </div>
      <div class="stats">
        <span>\u{1F3AF} ${this.userStats.totalAdjustments} adjustments</span>
        <span>\u{1F3C6} ${this.userStats.achievements.length} achievements</span>
      </div>
    `;
    container.appendChild(progressBar);
    return progressBar;
  }
  /**
   * Get progress percentage
   */
  getProgressPercentage() {
    const required = this.getRequiredExperience(this.userStats.level);
    return this.userStats.experience / required * 100;
  }
  // ============================================
  // Data Persistence
  // ============================================
  /**
   * Load user stats
   */
  loadUserStats() {
    if (!this.config.saveProgress || typeof window === "undefined") {
      return this.getDefaultStats();
    }
    const saved = localStorage.getItem(this.config.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return this.getDefaultStats();
      }
    }
    return this.getDefaultStats();
  }
  /**
   * Get default stats
   */
  getDefaultStats() {
    return {
      totalAdjustments: 0,
      perfectMatches: 0,
      experimentsCount: 0,
      timeSpent: 0,
      sizeRange: {
        min: 16,
        max: 16
      },
      streakDays: 0,
      level: 1,
      experience: 0,
      achievements: []
    };
  }
  /**
   * Save user stats
   */
  saveUserStats() {
    if (!this.config.saveProgress || typeof window === "undefined") return;
    localStorage.setItem(this.config.storageKey, JSON.stringify(this.userStats));
  }
  /**
   * Reset progress
   */
  resetProgress() {
    this.userStats = this.getDefaultStats();
    this.achievements.forEach((achievement) => {
      achievement.unlocked = false;
      achievement.unlockedAt = void 0;
    });
    this.challenges.forEach((challenge) => {
      challenge.completed = false;
      challenge.attempts = 0;
    });
    if (this.config.saveProgress) {
      this.saveUserStats();
    }
  }
  // ============================================
  // Public API
  // ============================================
  /**
   * Get user stats
   */
  getStats() {
    return {
      ...this.userStats
    };
  }
  /**
   * Get achievements
   */
  getAchievements() {
    return Array.from(this.achievements.values());
  }
  /**
   * Get challenges
   */
  getChallenges() {
    return Array.from(this.challenges.values());
  }
  /**
   * Subscribe to size adjustment events
   */
  onAdjustment(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  /**
   * Notify listeners
   */
  notifyListeners(event) {
    this.listeners.forEach((listener) => listener(event));
  }
  /**
   * Export progress data
   */
  exportProgress() {
    return JSON.stringify({
      stats: this.userStats,
      achievements: Array.from(this.achievements.entries()),
      challenges: Array.from(this.challenges.entries()),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, null, 2);
  }
  /**
   * Import progress data
   */
  importProgress(data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.stats) {
        this.userStats = parsed.stats;
      }
      if (parsed.achievements) {
        parsed.achievements.forEach(([id, achievement]) => {
          const existing = this.achievements.get(id);
          if (existing) {
            existing.unlocked = achievement.unlocked;
            existing.unlockedAt = achievement.unlockedAt;
          }
        });
      }
      if (parsed.challenges) {
        parsed.challenges.forEach(([id, challenge]) => {
          const existing = this.challenges.get(id);
          if (existing) {
            existing.completed = challenge.completed;
            existing.attempts = challenge.attempts;
          }
        });
      }
      if (this.config.saveProgress) {
        this.saveUserStats();
      }
      return true;
    } catch {
      return false;
    }
  }
}
function createGamifiedSizing(config) {
  return new GamifiedSizing(config);
}

export { GamifiedSizing, createGamifiedSizing };
/*! End of @ldesign/size | Powered by @ldesign/builder */
//# sourceMappingURL=GamifiedSizing.js.map
