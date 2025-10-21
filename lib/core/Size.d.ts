/**
 * @ldesign/size - Core Size Class
 *
 * The main Size class for size operations
 */
import type { ScaleFactor, SizeCalculationOptions, SizeInput, SizeUnit, SizeValue } from '../types';
/**
 * Core Size class for size manipulation and conversion
 */
export declare class Size {
    private _value;
    private _rootFontSize;
    private _flags;
    private _cachedPixels?;
    private _cachedRem?;
    get _isPooled(): boolean;
    set _isPooled(value: boolean);
    constructor(input?: SizeInput, rootFontSize?: number);
    /**
     * 重置对象状态（供对象池使用）
     */
    reset(input?: SizeInput, rootFontSize?: number): void;
    /**
     * Create a Size from pixels
     */
    static fromPixels(value: number): Size;
    /**
     * Create a Size from rem
     */
    static fromRem(value: number, rootFontSize?: number): Size;
    /**
     * Create a Size from em
     */
    static fromEm(value: number, rootFontSize?: number): Size;
    /**
     * Create a Size from viewport width percentage
     */
    static fromViewportWidth(value: number): Size;
    /**
     * Create a Size from viewport height percentage
     */
    static fromViewportHeight(value: number): Size;
    /**
     * Create a Size from percentage
     */
    static fromPercentage(value: number): Size;
    /**
     * Parse a string to Size
     */
    static parse(input: string, rootFontSize?: number): Size;
    get value(): number;
    get unit(): SizeUnit;
    get pixels(): number;
    get rem(): number;
    get em(): number;
    /**
     * Convert to pixels
     */
    toPixels(): SizeValue;
    /**
     * Convert to rem
     */
    toRem(): SizeValue;
    /**
     * Convert to em
     */
    toEm(): SizeValue;
    /**
     * Convert to viewport width
     */
    toViewportWidth(): SizeValue;
    /**
     * Convert to viewport height
     */
    toViewportHeight(): SizeValue;
    /**
     * Convert to percentage
     */
    toPercentage(): SizeValue;
    /**
     * Convert to specific unit
     */
    to(unit: SizeUnit): SizeValue;
    /**
     * Convert to string
     */
    toString(): string;
    /**
     * Convert to CSS value string
     */
    toCss(): string;
    /**
     * Get numeric value in specific unit
     */
    valueOf(unit?: SizeUnit): number;
    /**
     * Scale the size by a factor
     */
    scale(factor: ScaleFactor): Size;
    /**
     * Increase size by a percentage
     */
    increase(percentage: number): Size;
    /**
     * Decrease size by a percentage
     */
    decrease(percentage: number): Size;
    /**
     * Add another size
     */
    add(other: SizeInput): Size;
    /**
     * Subtract another size
     */
    subtract(other: SizeInput): Size;
    /**
     * Multiply by a number
     */
    multiply(factor: number): Size;
    /**
     * Divide by a number
     */
    divide(divisor: number): Size;
    /**
     * Get the negative of the size
     */
    negate(): Size;
    /**
     * Get the absolute value
     */
    abs(): Size;
    /**
     * Round to specified precision
     */
    round(precision?: number): Size;
    /**
     * Clamp between min and max
     */
    clamp(min?: SizeInput, max?: SizeInput): Size;
    /**
     * Check if equal to another size
     */
    equals(other: SizeInput): boolean;
    /**
     * Check if greater than another size
     */
    greaterThan(other: SizeInput): boolean;
    /**
     * Check if greater than or equal to another size
     */
    greaterThanOrEqual(other: SizeInput): boolean;
    /**
     * Check if less than another size
     */
    lessThan(other: SizeInput): boolean;
    /**
     * Check if less than or equal to another size
     */
    lessThanOrEqual(other: SizeInput): boolean;
    /**
     * Get the minimum of this and another size
     */
    min(other: SizeInput): Size;
    /**
     * Get the maximum of this and another size
     */
    max(other: SizeInput): Size;
    /**
     * Calculate with options
     */
    calculate(options: SizeCalculationOptions): Size;
    /**
     * Interpolate between this and another size
     */
    interpolate(to: SizeInput, factor: number): Size;
    /**
     * Clone the size
     */
    clone(): Size;
    /**
     * 释放对象回池（手动管理）
     */
    dispose(): void;
    /**
     * Check if size is zero
     */
    isZero(): boolean;
    /**
     * Check if size is positive
     */
    isPositive(): boolean;
    /**
     * Check if size is negative
     */
    isNegative(): boolean;
    /**
     * Check if size is valid
     */
    isValid(): boolean;
    /**
     * Export as JSON
     */
    toJSON(): object;
    /**
     * Create CSS calc expression
     */
    static calc(expression: string): string;
    /**
     * Create CSS min expression
     */
    static cssMin(...sizes: SizeInput[]): string;
    /**
     * Create CSS max expression
     */
    static cssMax(...sizes: SizeInput[]): string;
    /**
     * Create CSS clamp expression
     */
    static cssClamp(min: SizeInput, preferred: SizeInput, max: SizeInput): string;
}
export declare const size: (input: SizeInput, rootFontSize?: number) => Size;
export declare const px: (value: number) => Size;
export declare const rem: (value: number, rootFontSize?: number) => Size;
export declare const em: (value: number, rootFontSize?: number) => Size;
export declare const vw: (value: number) => Size;
export declare const vh: (value: number) => Size;
export declare const percent: (value: number) => Size;
