/**
 * @ldesign/size - Accessibility Enhancer
 *
 * WCAG compliance checking and automatic adjustments
 */
export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export interface ComplianceReport {
    level: WCAGLevel;
    passed: boolean;
    violations: Array<{
        rule: string;
        severity: 'error' | 'warning';
        element?: HTMLElement;
        message: string;
        solution?: string;
    }>;
    score: number;
}
export interface ValidationResult {
    valid: boolean;
    issues: string[];
    recommendations: string[];
}
export interface ContrastRatio {
    ratio: number;
    passes: {
        AA: boolean;
        AAA: boolean;
    };
}
export declare class AccessibilityEnhancer {
    private currentLevel;
    private colorBlindnessMode;
    private styleElements;
    private svgElements;
    private elementCache;
    private isDestroyed;
    /**
     * Check WCAG compliance
     */
    checkWCAGCompliance(level?: WCAGLevel): ComplianceReport;
    /**
     * Check font sizes for WCAG compliance
     */
    private checkFontSizes;
    /**
     * Check touch target sizes
     */
    private checkTouchTargets;
    /**
     * Check contrast ratios
     */
    private checkContrastRatios;
    /**
     * Check focus indicators
     */
    private checkFocusIndicators;
    /**
     * Check line height
     */
    private checkLineHeight;
    /**
     * Auto-adjust for accessibility
     */
    autoAdjustForA11y(level?: WCAGLevel): void;
    /**
     * Apply fix for violation
     */
    private applyFix;
    /**
     * Adapt for color blindness
     */
    adaptForColorBlindness(type: ColorBlindnessType): void;
    /**
     * Add SVG filter for color blindness
     */
    private addColorBlindnessFilter;
    /**
     * Optimize focus indicators
     */
    optimizeFocusIndicators(): void;
    /**
     * Validate touch targets
     */
    validateTouchTargets(): ValidationResult;
    /**
     * Calculate contrast ratio between two colors
     */
    private calculateContrast;
    /**
     * Get luminance of RGB color
     */
    private getLuminance;
    /**
     * Parse color string to RGB
     */
    private parseColor;
    /**
     * Get computed background color of element
     */
    private getBackgroundColor;
    /**
     * Reset color blindness mode
     */
    resetColorBlindness(): void;
    /**
     * Get current accessibility status
     */
    getStatus(): {
        level: WCAGLevel;
        colorBlindnessMode: ColorBlindnessType | null;
        compliance: ComplianceReport;
    };
    /**
     * Destroy and clean up resources
     */
    destroy(): void;
}
/**
 * Get accessibility enhancer instance
 */
export declare function getAccessibilityEnhancer(): AccessibilityEnhancer;
/**
 * Quick access API
 */
export declare const a11y: {
    check: (level?: WCAGLevel) => ComplianceReport;
    autoAdjust: (level?: WCAGLevel) => void;
    colorBlindness: (type: ColorBlindnessType) => void;
    resetColorBlindness: () => void;
    focusIndicators: () => void;
    validateTouch: () => ValidationResult;
    status: () => {
        level: WCAGLevel;
        colorBlindnessMode: ColorBlindnessType | null;
        compliance: ComplianceReport;
    };
};
