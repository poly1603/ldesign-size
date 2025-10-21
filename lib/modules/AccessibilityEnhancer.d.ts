/**
 * Accessibility Enhancement Module
 * Provides WCAG 2.1 compliance and adaptive sizing for accessibility
 */
/**
 * WCAG compliance levels
 */
export type WCAGLevel = 'A' | 'AA' | 'AAA';
/**
 * User accessibility preferences
 */
export interface AccessibilityPreferences {
    fontSize: 'small' | 'normal' | 'large' | 'extra-large';
    contrast: 'normal' | 'high' | 'ultra-high';
    reducedMotion: boolean;
    colorBlind?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
    keyboardNavigation: boolean;
    screenReader: boolean;
    focusIndicator: 'default' | 'enhanced' | 'custom';
    zoomLevel?: number;
}
/**
 * Accessibility size configuration
 */
export interface AccessibilitySizeConfig {
    baseFontSize: number;
    scaleFactors: {
        small: number;
        normal: number;
        large: number;
        'extra-large': number;
    };
    minimumSizes: {
        text: number;
        clickTarget: number;
        touchTarget: number;
        spacing: number;
    };
    wcagLevel: WCAGLevel;
}
/**
 * Accessibility validation result
 */
export interface AccessibilityValidation {
    passed: boolean;
    level: WCAGLevel;
    issues: Array<{
        element: string;
        issue: string;
        severity: 'error' | 'warning' | 'info';
        recommendation: string;
        wcagCriteria: string;
    }>;
    score: number;
}
/**
 * Focus management configuration
 */
export interface FocusConfig {
    outlineWidth: number;
    outlineStyle: string;
    outlineColor: string;
    outlineOffset: number;
    customStyles?: Record<string, any>;
}
/**
 * Accessibility Enhancer
 */
export declare class AccessibilityEnhancer {
    private preferences;
    private config;
    private fontScaleListeners;
    private preferenceListeners;
    private detector;
    constructor(config?: Partial<AccessibilitySizeConfig>);
    /**
     * Detect user accessibility preferences
     */
    private detectUserPreferences;
    /**
     * Get default preferences
     */
    private getDefaultPreferences;
    /**
     * Detect font size preference
     */
    private detectFontSizePreference;
    /**
     * Detect contrast preference
     */
    private detectContrastPreference;
    /**
     * Detect reduced motion preference
     */
    private detectReducedMotion;
    /**
     * Detect screen reader usage
     */
    private detectScreenReader;
    /**
     * Detect zoom level
     */
    private detectZoomLevel;
    /**
     * Setup preference change listeners
     */
    private setupPreferenceListeners;
    /**
     * Update user preferences
     */
    updatePreferences(updates: Partial<AccessibilityPreferences>): void;
    /**
     * Get accessible font size
     */
    getFontSize(baseSize?: number): number;
    /**
     * Get accessible line height
     */
    getLineHeight(fontSize: number): number;
    /**
     * Get accessible spacing
     */
    getSpacing(baseSpacing?: number): number;
    /**
     * Get accessible click/touch target size
     */
    getTargetSize(isTouch?: boolean): number;
    /**
     * Get focus indicator styles
     */
    getFocusStyles(): FocusConfig;
    /**
     * Validate accessibility compliance
     */
    validateAccessibility(element: HTMLElement | null, wcagLevel?: WCAGLevel): AccessibilityValidation;
    /**
     * Validate text size
     */
    private validateTextSize;
    /**
     * Validate contrast ratios
     */
    private validateContrast;
    /**
     * Validate touch targets
     */
    private validateTouchTargets;
    /**
     * Validate focus indicators
     */
    private validateFocusIndicators;
    /**
     * Validate semantic HTML
     */
    private validateSemantics;
    /**
     * Calculate contrast ratio between two colors
     */
    private calculateContrastRatio;
    /**
     * Subscribe to font scale changes
     */
    onFontScaleChange(listener: (scale: number) => void): () => void;
    /**
     * Subscribe to preference changes
     */
    onPreferenceChange(listener: (prefs: AccessibilityPreferences) => void): () => void;
    /**
     * Get current preferences
     */
    getPreferences(): AccessibilityPreferences;
    /**
     * Get WCAG level
     */
    getWCAGLevel(): WCAGLevel;
    /**
     * Set WCAG level
     */
    setWCAGLevel(level: WCAGLevel): void;
    /**
     * Generate accessibility report
     */
    generateReport(element?: HTMLElement): string;
}
/**
 * Create accessibility enhancer instance
 */
export declare function createAccessibilityEnhancer(config?: Partial<AccessibilitySizeConfig>): AccessibilityEnhancer;
/**
 * Quick access helpers
 */
export declare const a11y: {
    getFontSize: (base?: number) => number;
    getTargetSize: (isTouch?: boolean) => number;
    validate: (element: HTMLElement, level?: WCAGLevel) => AccessibilityValidation;
};
