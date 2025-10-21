/**
 * @ldesign/size - Theme Manager
 *
 * Manages theme-specific size adjustments
 */
export type Theme = 'light' | 'dark' | 'auto' | 'high-contrast' | string;
export interface ThemeConfig {
    name: string;
    baseSizeAdjustment?: number;
    spacingScale?: number;
    radiusScale?: number;
    lineHeightScale?: number;
    cssVariables?: Record<string, string>;
}
export interface ThemeManagerOptions {
    defaultTheme?: Theme;
    themes?: Record<string, ThemeConfig>;
    autoDetect?: boolean;
    storageKey?: string;
}
export declare class ThemeManager {
    private currentTheme;
    private themes;
    private styleElement;
    private options;
    private mediaQuery;
    private hcQuery;
    private listeners;
    private mediaHandlers;
    private isDestroyed;
    private cssCache;
    private generatedCSSCache;
    private maxCacheSize;
    constructor(options?: ThemeManagerOptions);
    /**
     * Detect initial theme
     */
    private detectInitialTheme;
    /**
     * Get system theme preference
     */
    private getSystemTheme;
    /**
     * Setup auto detection for theme changes
     */
    private setupAutoDetection;
    /**
     * Set theme
     */
    setTheme(theme: Theme): void;
    /**
     * Apply theme adjustments
     */
    private applyTheme;
    /**
     * Generate theme CSS
     */
    private generateThemeCSS;
    /**
     * Save theme to storage
     */
    private saveToStorage;
    /**
     * Get current theme
     */
    getTheme(): Theme;
    /**
     * Get theme config
     */
    getThemeConfig(theme?: Theme): ThemeConfig | undefined;
    /**
     * Register custom theme
     */
    registerTheme(name: string, config: ThemeConfig): void;
    /**
     * Get all available themes
     */
    getAvailableThemes(): string[];
    /**
     * Subscribe to theme changes
     */
    onChange(listener: (theme: Theme) => void): () => void;
    /**
     * Notify listeners
     */
    private notifyListeners;
    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void;
    /**
     * Destroy theme manager
     */
    destroy(): void;
}
/**
 * Get theme manager instance
 */
export declare function getThemeManager(): ThemeManager;
/**
 * Destroy theme manager singleton
 */
export declare function destroyThemeManager(): void;
/**
 * Theme utilities
 */
export declare const theme: {
    /**
     * Set theme
     */
    set: (t: Theme) => void;
    /**
     * Get current theme
     */
    get: () => string;
    /**
     * Toggle theme
     */
    toggle: () => void;
    /**
     * Register custom theme
     */
    register: (name: string, config: ThemeConfig) => void;
    /**
     * Listen to theme changes
     */
    onChange: (fn: (theme: Theme) => void) => () => void;
};
