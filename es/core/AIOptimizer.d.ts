/**
 * @ldesign/size - AI-Powered Size Optimizer
 *
 * Uses DeepSeek AI to optimize size configurations
 */
export interface AIOptimizerConfig {
    apiKey: string;
    apiUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface ReadabilityOptions {
    targetAudience?: 'children' | 'adults' | 'elderly';
    contentType?: 'article' | 'interface' | 'dashboard' | 'mobile-app';
    lightingConditions?: 'bright' | 'normal' | 'dim';
    viewingDistance?: 'close' | 'normal' | 'far';
}
export interface PageContext {
    url?: string;
    title?: string;
    contentLength?: number;
    hasImages?: boolean;
    hasTables?: boolean;
    hasCode?: boolean;
    userAge?: number;
    userPreferences?: Record<string, unknown>;
    contentType?: 'article' | 'interface' | 'dashboard' | 'mobile-app';
}
export interface UserBehavior {
    scrollPatterns: Array<{
        position: number;
        duration: number;
    }>;
    clickPatterns: Array<{
        element: string;
        count: number;
    }>;
    zoomLevel: number;
    sessionDuration: number;
    bounceRate: number;
}
export interface OptimizationSuggestion {
    property: string;
    currentValue: string;
    suggestedValue: string;
    confidence: number;
    reason: string;
}
export declare class AIOptimizer {
    private config;
    private userBehaviorData;
    private optimizationHistory;
    private isLearning;
    private eventListeners;
    private intervalIds;
    private timeoutIds;
    private isDestroyed;
    private static readonly MAX_HISTORY_SIZE;
    private static readonly MAX_BEHAVIOR_DATA;
    constructor(config: AIOptimizerConfig);
    /**
     * Auto-adjust sizes based on content
     */
    autoAdjustByContent(element: HTMLElement): Promise<void>;
    /**
     * Analyze content structure
     */
    private analyzeContent;
    /**
     * Get AI suggestions from DeepSeek
     */
    private getAISuggestions;
    /**
     * Build prompt for AI
     */
    private buildPrompt;
    /**
     * Parse AI response
     */
    private parseAIResponse;
    /**
     * Apply AI suggestions
     */
    private applySuggestions;
    /**
     * Optimize for readability
     */
    optimizeReadability(options?: ReadabilityOptions): Promise<void>;
    /**
     * Learn from user behavior
     */
    learnFromUserBehavior(): void;
    /**
     * Start behavior tracking
     */
    private startBehaviorTracking;
    /**
     * Get element selector
     */
    private getElementSelector;
    /**
     * Analyze user behavior
     */
    private analyzeBehavior;
    /**
     * Extract behavior patterns
     */
    private extractPatterns;
    /**
     * Get most clicked elements
     */
    private getMostClicked;
    /**
     * Get average scroll depth
     */
    private getAverageScrollDepth;
    /**
     * Get personalized suggestions based on patterns
     */
    private getPersonalizedSuggestions;
    /**
     * Recommend preset based on context
     */
    recommendPreset(context: PageContext): Promise<string>;
    /**
     * Get optimization history
     */
    getHistory(): OptimizationSuggestion[];
    /**
     * Clear optimization history
     */
    clearHistory(): void;
    /**
     * Stop learning
     */
    stopLearning(): void;
    /**
     * Clean up resources
     */
    private cleanup;
    /**
     * Destroy the optimizer
     */
    destroy(): void;
    /**
     * Export learned preferences
     */
    exportPreferences(): string;
    /**
     * Import learned preferences
     */
    importPreferences(json: string): void;
}
/**
 * Get AI optimizer instance
 */
export declare function getAIOptimizer(config?: AIOptimizerConfig): AIOptimizer;
/**
 * Quick access API
 */
export declare const ai: {
    /**
     * Initialize with API key
     */
    init: (apiKey: string) => AIOptimizer;
    /**
     * Auto-adjust by content
     */
    auto: (element: HTMLElement) => Promise<void>;
    /**
     * Optimize readability
     */
    readability: (options?: ReadabilityOptions) => Promise<void>;
    /**
     * Start learning
     */
    learn: () => void;
    /**
     * Recommend preset
     */
    recommend: (context: PageContext) => Promise<string>;
    /**
     * Get history
     */
    history: () => OptimizationSuggestion[];
};
