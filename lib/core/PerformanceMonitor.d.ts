/**
 * @ldesign/size - Performance Monitor
 *
 * Tracks and reports performance metrics for optimization
 */
export interface PerformanceMetrics {
    memoryUsage: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
    };
    cacheStats: {
        sizePoolHitRate: number;
        cssCache: number;
        fluidSizeCache: number;
    };
    timing: {
        cssGeneration: number;
        sizeCalculation: number;
        viewportUpdate: number;
    };
    counts: {
        domNodes: number;
        cssRules: number;
        listeners: number;
        pooledObjects: number;
    };
}
export declare class PerformanceMonitor {
    private static instance;
    private metrics;
    private startTimes;
    static getInstance(): PerformanceMonitor;
    /**
     * Start timing an operation
     */
    startTiming(operation: string): void;
    /**
     * End timing and record the duration
     */
    endTiming(operation: string): number;
    /**
     * Record a metric value
     */
    recordMetric(name: string, value: number): void;
    /**
     * Get memory usage information
     */
    private getMemoryUsage;
    /**
     * Count DOM nodes
     */
    private countDOMNodes;
    /**
     * Count CSS rules
     */
    private countCSSRules;
    /**
     * Get comprehensive performance report
     */
    getReport(): PerformanceMetrics;
    /**
     * Log performance report to console
     */
    logReport(): void;
    /**
     * Reset all metrics
     */
    reset(): void;
    /**
     * Compare two performance snapshots
     */
    static compareSnapshots(before: PerformanceMetrics, after: PerformanceMetrics): void;
}
export declare const performanceMonitor: PerformanceMonitor;
export declare const perf: {
    start: (operation: string) => void;
    end: (operation: string) => number;
    record: (name: string, value: number) => void;
    report: () => PerformanceMetrics;
    log: () => void;
    reset: () => void;
};
