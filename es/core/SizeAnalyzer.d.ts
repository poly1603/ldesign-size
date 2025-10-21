/**
 * @ldesign/size - Size Analyzer & Debug Tools
 *
 * Provides comprehensive analysis and debugging capabilities
 */
import type { SizeConfig, SizePreset } from './SizeManager';
export interface SizeUsageReport {
    variables: {
        total: number;
        used: number;
        unused: string[];
        mostUsed: Array<{
            name: string;
            count: number;
        }>;
    };
    presets: {
        current: string;
        history: Array<{
            preset: string;
            timestamp: number;
            duration: number;
        }>;
    };
    performance: {
        cssGenerationTime: number;
        applyTime: number;
        memoryUsage: number;
    };
}
export interface ValidationReport {
    errors: Array<{
        type: string;
        message: string;
        element?: HTMLElement;
    }>;
    warnings: Array<{
        type: string;
        message: string;
        suggestion?: string;
    }>;
    passed: boolean;
}
export interface PerformanceMetrics {
    renderTime: number;
    recalcTime: number;
    memoryUsage: number;
    domNodes: number;
    cssRules: number;
    unusedCss: number;
}
export interface SizeSpecDoc {
    version: string;
    generated: Date;
    config: SizeConfig;
    presets: SizePreset[];
    variables: Record<string, string>;
    usage: SizeUsageReport;
}
export declare class SizeAnalyzer {
    private usageMap;
    private performanceObserver;
    private debugPanel;
    private panelStyleEl;
    private variableObserver;
    private rafId;
    private isMonitoring;
    constructor();
    /**
     * Show visual debug panel
     */
    showDebugPanel(): void;
    /**
     * Hide debug panel
     */
    hideDebugPanel(): void;
    /**
     * Create debug panel UI
     */
    private createDebugPanel;
    /**
     * Update debug panel content
     */
    private updateDebugPanel;
    /**
     * Start monitoring
     */
    private startMonitoring;
    /**
     * Stop monitoring
     */
    private stopMonitoring;
    /**
     * Track CSS variable usage
     */
    private trackVariableUsage;
    /**
     * Scan for variable usage
     */
    private scanVariableUsage;
    /**
     * Get usage statistics
     */
    getUsageStats(): SizeUsageReport;
    /**
     * Get all CSS variables
     */
    private getAllCSSVariables;
    /**
     * Measure performance
     */
    measurePerformance(): PerformanceMetrics;
    /**
     * Count CSS rules
     */
    private countCSSRules;
    /**
     * Count unused CSS
     */
    private countUnusedCSS;
    /**
     * Validate consistency
     */
    validateConsistency(): ValidationReport;
    /**
     * Generate specification document
     */
    generateSpecification(): SizeSpecDoc;
    /**
     * Get all CSS variables with values
     */
    private getAllCSSVariablesWithValues;
    /**
     * Export specification as JSON
     */
    exportSpecification(): string;
    /**
     * Export specification as Markdown
     */
    exportSpecificationAsMarkdown(): string;
    /**
     * Setup performance observer
     */
    private setupPerformanceObserver;
    /**
     * Cleanup
     */
    destroy(): void;
}
/**
 * Get analyzer instance
 */
export declare function getSizeAnalyzer(): SizeAnalyzer;
/**
 * Quick access API
 */
export declare const analyze: {
    show: () => void;
    hide: () => void;
    stats: () => SizeUsageReport;
    performance: () => PerformanceMetrics;
    validate: () => ValidationReport;
    export: () => string;
    exportMarkdown: () => string;
};
