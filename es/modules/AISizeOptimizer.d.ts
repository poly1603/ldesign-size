/**
 * AI-Driven Size Optimization Module
 * Integrates with DeepSeek API for intelligent size recommendations
 */
import type { SizeScheme } from '../types';
/**
 * AI optimization configuration
 */
export interface AIOptimizationConfig {
    apiKey?: string;
    apiEndpoint?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    enableAutoOptimization?: boolean;
    cacheResponses?: boolean;
    cacheTTL?: number;
}
/**
 * Size optimization suggestion
 */
export interface SizeOptimizationSuggestion {
    element: string;
    currentSize: string;
    suggestedSize: string;
    reason: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    category: 'performance' | 'accessibility' | 'aesthetics' | 'usability';
}
/**
 * Design context for optimization
 */
export interface DesignContext {
    viewport: {
        width: number;
        height: number;
        device: string;
    };
    userPreferences?: {
        fontSize?: 'small' | 'medium' | 'large';
        colorScheme?: 'light' | 'dark';
        reducedMotion?: boolean;
    };
    contentType?: 'article' | 'dashboard' | 'form' | 'gallery' | 'landing';
    targetAudience?: 'general' | 'elderly' | 'children' | 'professional';
    performance?: {
        fps?: number;
        loadTime?: number;
        memoryUsage?: number;
    };
}
/**
 * AI optimization result
 */
export interface OptimizationResult {
    suggestions: SizeOptimizationSuggestion[];
    summary: string;
    totalImpact: number;
    estimatedImprovement: {
        performance?: number;
        accessibility?: number;
        userExperience?: number;
    };
}
/**
 * AI Size Optimizer
 */
export declare class AISizeOptimizer {
    private config;
    private cache;
    private patterns;
    private learningData;
    constructor(config?: AIOptimizationConfig);
    /**
     * Initialize common optimization patterns
     */
    private initializePatterns;
    /**
     * Analyze sizes using AI
     */
    analyzeSizes(sizeConfig: SizeScheme, context: DesignContext): Promise<OptimizationResult>;
    /**
     * Build analysis prompt for AI
     */
    private buildAnalysisPrompt;
    /**
     * Get AI recommendations
     */
    private getAIRecommendations;
    /**
     * Parse AI response into suggestions
     */
    private parseAIResponse;
    /**
     * Get rule-based recommendations (fallback)
     */
    private getRuleBasedRecommendations;
    /**
     * Apply learned patterns from user feedback
     */
    private applyLearnedPatterns;
    /**
     * Calculate optimization result
     */
    private calculateOptimizationResult;
    /**
     * Generate optimization summary
     */
    private generateSummary;
    /**
     * Apply suggestions automatically
     */
    applySuggestions(suggestions: SizeOptimizationSuggestion[], threshold?: number): Promise<Map<string, any>>;
    /**
     * Learn from user feedback
     */
    learnFromFeedback(context: DesignContext, appliedSuggestions: SizeOptimizationSuggestion[], feedback: number): void;
    /**
     * Get cache key for results
     */
    private getCacheKey;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Export learning data
     */
    exportLearningData(): string;
    /**
     * Import learning data
     */
    importLearningData(data: string): void;
}
/**
 * Create AI optimizer instance
 */
export declare function createAIOptimizer(config?: AIOptimizationConfig): AISizeOptimizer;
