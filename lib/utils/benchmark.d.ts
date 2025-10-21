/**
 * @ldesign/size - Performance Benchmark
 *
 * 性能基准测试工具
 */
export interface BenchmarkResult {
    name: string;
    iterations: number;
    totalTime: number;
    avgTime: number;
    minTime: number;
    maxTime: number;
    opsPerSecond: number;
    memory?: {
        before: number;
        after: number;
        delta: number;
    };
}
export interface BenchmarkOptions {
    iterations?: number;
    warmup?: number;
    measureMemory?: boolean;
}
/**
 * 性能基准测试类
 */
export declare class Benchmark {
    private results;
    /**
     * 运行单个基准测试
     */
    run(name: string, fn: () => void | Promise<void>, options?: BenchmarkOptions): Promise<BenchmarkResult>;
    /**
     * 比较多个实现
     */
    compare(benchmarks: Array<{
        name: string;
        fn: () => void | Promise<void>;
    }>, options?: BenchmarkOptions): Promise<BenchmarkResult[]>;
    /**
     * 获取所有结果
     */
    getResults(): BenchmarkResult[];
    /**
     * 清除结果
     */
    clear(): void;
    /**
     * 获取内存使用
     */
    private getMemoryUsage;
    /**
     * 生成报告
     */
    generateReport(): string;
    /**
     * 输出报告到控制台
     */
    logReport(): void;
}
export declare const benchmark: Benchmark;
export declare function runBenchmark(name: string, fn: () => void | Promise<void>, options?: BenchmarkOptions): Promise<BenchmarkResult>;
export declare function compareBenchmarks(benchmarks: Array<{
    name: string;
    fn: () => void | Promise<void>;
}>, options?: BenchmarkOptions): Promise<BenchmarkResult[]>;
