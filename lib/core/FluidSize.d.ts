/**
 * @ldesign/size - Fluid Typography & Responsive Sizing
 *
 * Advanced fluid sizing with clamp, calc, and viewport units
 */
import type { DeviceType, FluidSize, ResponsiveSize, SizeUnit } from '../types';
/**
 * Fluid size calculator
 */
export declare class FluidSizeCalculator {
    private viewport;
    private unsubscribe;
    private calculationCache;
    private static readonly MAX_CACHE_SIZE;
    private isDestroyed;
    private cacheHits;
    private cacheMisses;
    private lastViewport;
    private stats;
    private slopeCache;
    constructor();
    /**
     * Check if viewport has actually changed
     */
    private hasViewportChanged;
    /**
     * Partial cache clear - keep frequently used items
     */
    private partialCacheClear;
    /**
     * Create a fluid size using CSS clamp
     */
    createFluidSize(config: FluidSize): string;
    /**
     * Create fluid calc expression
     */
    private createFluidCalc;
    /**
     * Format size value
     */
    private formatSizeValue;
    /**
     * Create responsive size with breakpoints
     */
    createResponsiveSize(config: ResponsiveSize): string;
    /**
     * Generate modular scale
     */
    generateModularScale(base: number, ratio: number, steps: number, unit?: SizeUnit): string[];
    /**
     * Create fluid modular scale
     */
    createFluidModularScale(baseMin: number, baseMax: number, ratio: number, steps: number): string[];
    /**
     * Get optimal line height for font size
     */
    getOptimalLineHeight(fontSize: number, unit?: SizeUnit): number;
    /**
     * Calculate responsive spacing
     */
    calculateResponsiveSpacing(base: number, device: DeviceType, context: 'padding' | 'margin' | 'gap'): string;
    /**
     * Generate optimized cache key
     */
    private generateCacheKey;
    /**
     * Add to cache with LRU management
     */
    private addToCache;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        hits: number;
        misses: number;
        hitRate: number;
    };
    /**
     * Destroy and clean up resources
     */
    destroy(): void;
}
/**
 * Fluid typography presets
 */
export declare const fluidTypographyPresets: {
    h1: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    h2: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    h3: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    h4: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    h5: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    h6: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    body: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    small: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
    tiny: {
        min: {
            value: number;
            unit: SizeUnit;
        };
        max: {
            value: number;
            unit: SizeUnit;
        };
        viewportMin: number;
        viewportMax: number;
    };
};
/**
 * Modular scale ratios
 */
export declare const modularScaleRatios: {
    minorSecond: number;
    majorSecond: number;
    minorThird: number;
    majorThird: number;
    perfectFourth: number;
    augmentedFourth: number;
    perfectFifth: number;
    goldenRatio: number;
    majorSixth: number;
    minorSeventh: number;
    majorSeventh: number;
    octave: number;
    majorTenth: number;
    majorEleventh: number;
    majorTwelfth: number;
    doubleOctave: number;
};
/**
 * Get fluid size calculator instance
 */
export declare function getFluidSizeCalculator(): FluidSizeCalculator;
/**
 * Quick access helpers
 */
export declare const fluid: {
    /**
     * Create fluid size
     */
    size: (min: number, max: number, unit?: SizeUnit) => string;
    /**
     * Create fluid typography
     */
    text: (preset: keyof typeof fluidTypographyPresets) => string;
    /**
     * Create modular scale
     */
    scale: (base: number, ratio: keyof typeof modularScaleRatios | number, steps?: number) => string[];
    /**
     * Create fluid modular scale
     */
    fluidScale: (baseMin: number, baseMax: number, ratio: keyof typeof modularScaleRatios | number, steps?: number) => string[];
    /**
     * Get optimal line height
     */
    lineHeight: (fontSize: number, unit?: SizeUnit) => number;
};
