/**
 * @ldesign/size - CSS Optimizer
 *
 * 优化CSS生成，减少内存占用
 */
export declare class CSSOptimizer {
    private static readonly CSS_TEMPLATE;
    private static readonly VALUE_CACHE;
    private static isInitialized;
    /**
     * 初始化CSS模板（只执行一次）
     */
    private static initializeTemplates;
    /**
     * 预计算并缓存所有值（使用 Uint16Array）
     */
    private static getCachedValues;
    /**
     * 压缩CSS字符串，移除不必要的空白
     */
    static compressCSS(css: string): string;
    /**
     * 生成优化的CSS变量
     */
    static generateOptimizedCSS(baseSize: number): string;
    /**
     * 预计算所有需要的值
     */
    private static precomputeValues;
    /**
     * 添加size变量
     */
    private static appendSizeVariables;
    /**
     * 添加font变量
     */
    private static appendFontVariables;
    /**
     * 添加spacing变量
     */
    private static appendSpacingVariables;
    /**
     * 生成最小化的CSS（生产环境）
     */
    static generateMinifiedCSS(baseSize: number): string;
    /**
     * 估算CSS字符串的内存占用
     */
    static estimateMemoryUsage(css: string): number;
    /**
     * 比较优化前后的内存占用
     */
    static compareMemoryUsage(originalCSS: string, optimizedCSS: string): void;
}
