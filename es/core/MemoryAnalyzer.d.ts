/**
 * @ldesign/size - Memory Analyzer
 *
 * 深度内存分析工具，用于评估每个数据结构和操作的内存占用
 */
export interface MemoryEstimate {
    variable: string;
    type: string;
    sizeInBytes: number;
    description: string;
    optimization?: string;
}
export declare class MemoryAnalyzer {
    private static readonly SIZES;
    /**
     * 估算字符串内存占用
     */
    static estimateString(str: string): number;
    /**
     * 估算对象内存占用
     */
    static estimateObject(obj: any): number;
    /**
     * 估算数组内存占用
     */
    static estimateArray(arr: any[]): number;
    /**
     * 估算Map内存占用
     */
    static estimateMap(map: Map<any, any>): number;
    /**
     * 估算Set内存占用
     */
    static estimateSet(set: Set<any>): number;
    /**
     * 估算函数内存占用
     */
    static estimateFunction(fn: (...args: any[]) => any): number;
    /**
     * 估算任意值的内存占用
     */
    static estimateValue(value: any): number;
    /**
     * 分析Size类的内存占用
     */
    static analyzeSizeClass(): MemoryEstimate[];
    /**
     * 分析SizeManager的内存占用
     */
    static analyzeSizeManager(): MemoryEstimate[];
    /**
     * 分析字符串拼接的内存开销
     */
    static analyzeStringConcatenation(operations: number): MemoryEstimate;
    /**
     * 生成内存优化建议
     */
    static generateOptimizationReport(): string;
    /**
     * 实时内存监控
     */
    static monitorMemory(): void;
}
export declare const memoryAnalyzer: {
    estimate: (value: any) => number;
    analyzeSize: () => MemoryEstimate[];
    analyzeManager: () => MemoryEstimate[];
    report: () => string;
    monitor: () => void;
};
