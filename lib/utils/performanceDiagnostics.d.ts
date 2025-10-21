/**
 * @ldesign/size - Performance Diagnostics
 *
 * 性能监控和诊断工具集
 */
export interface PerformanceMark {
    name: string;
    startTime: number;
    duration?: number;
    metadata?: Record<string, any>;
}
export interface PerformanceSnapshot {
    timestamp: number;
    marks: PerformanceMark[];
    memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
        percentage: number;
    };
    caches: {
        size: Map<string, number>;
        fluidSize: Map<string, number>;
        conversion: Map<string, number>;
        [key: string]: Map<string, number>;
    };
    fps?: number;
    longTasks?: number;
}
/**
 * 性能诊断器
 */
export declare class PerformanceDiagnostics {
    private static instance;
    private marks;
    private snapshots;
    private maxSnapshots;
    private fpsHistory;
    private lastFrameTime;
    private frameCount;
    private rafId;
    private isMonitoring;
    static getInstance(): PerformanceDiagnostics;
    /**
     * 开始性能标记
     */
    mark(name: string, metadata?: Record<string, any>): void;
    /**
     * 结束性能标记并计算持续时间
     */
    measure(name: string): number | null;
    /**
     * 获取内存使用情况
     */
    getMemoryUsage(): PerformanceSnapshot['memory'] | null;
    /**
     * 开始 FPS 监控
     */
    startFPSMonitoring(): void;
    /**
     * 停止 FPS 监控
     */
    stopFPSMonitoring(): void;
    /**
     * 获取平均 FPS
     */
    getAverageFPS(): number;
    /**
     * 创建性能快照
     */
    createSnapshot(caches?: Record<string, Map<string, any>>): PerformanceSnapshot;
    /**
     * 获取所有快照
     */
    getSnapshots(): PerformanceSnapshot[];
    /**
     * 清除所有数据
     */
    clear(): void;
    /**
     * 生成性能报告
     */
    generateReport(): string;
    /**
     * 控制台输出报告
     */
    logReport(): void;
    /**
     * 检测性能瓶颈
     */
    detectBottlenecks(): {
        type: string;
        severity: 'low' | 'medium' | 'high';
        message: string;
    }[];
}
export declare const perf: PerformanceDiagnostics;
export declare const perfDiagnostics: {
    mark: (name: string, metadata?: Record<string, any>) => void;
    measure: (name: string) => number | null;
    startFPS: () => void;
    stopFPS: () => void;
    snapshot: (caches?: Record<string, Map<string, any>>) => PerformanceSnapshot;
    report: () => void;
    bottlenecks: () => {
        type: string;
        severity: "low" | "medium" | "high";
        message: string;
    }[];
    clear: () => void;
};
