/**
 * @ldesign/size - Device Detection & Viewport Management
 *
 * Advanced device detection and responsive breakpoint management
 */
import type { DeviceOrientation, DeviceType, ResponsiveBreakpoints, Viewport } from '../types';
/**
 * Default responsive breakpoints
 */
export declare const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints;
/**
 * Device detection class
 */
export declare class DeviceDetector {
    private viewport;
    private breakpoints;
    private listeners;
    private resizeObserver;
    private mediaQueries;
    private mediaQueryHandlers;
    private resizeHandler;
    private isDestroyed;
    private resizeTimeout;
    private observerTimeout;
    constructor(breakpoints?: ResponsiveBreakpoints);
    /**
     * Detect current viewport information
     */
    private detectViewport;
    /**
     * Get device type based on width
     */
    private getDeviceType;
    /**
     * Get device orientation
     */
    private getDeviceOrientation;
    /**
     * Check if device supports touch
     */
    private isTouchDevice;
    /**
     * Get default viewport for SSR
     */
    private getDefaultViewport;
    /**
     * Setup viewport change listeners
     */
    private setupListeners;
    /**
     * Setup media query listeners
     */
    private setupMediaQueries;
    /**
     * Update viewport information
     */
    private updateViewport;
    /**
     * Notify listeners of viewport changes
     */
    private notifyListeners;
    /**
     * Get current viewport
     */
    getViewport(): Viewport;
    /**
     * Get current device type
     */
    getDevice(): DeviceType;
    /**
     * Get current orientation
     */
    getOrientation(): DeviceOrientation;
    /**
     * Check if viewport matches breakpoint
     */
    matchesBreakpoint(breakpoint: keyof ResponsiveBreakpoints): boolean;
    /**
     * Get active breakpoint
     */
    getActiveBreakpoint(): string | null;
    /**
     * Check if device is mobile
     */
    isMobile(): boolean;
    /**
     * Check if device is tablet
     */
    isTablet(): boolean;
    /**
     * Check if device is desktop
     */
    isDesktop(): boolean;
    /**
     * Check if device supports touch
     */
    isTouch(): boolean;
    /**
     * Check if device supports hover
     */
    supportsHover(): boolean;
    /**
     * Get pixel density
     */
    getPixelRatio(): number;
    /**
     * Check if high DPI screen
     */
    isRetina(): boolean;
    /**
     * Subscribe to viewport changes
     */
    onChange(listener: (viewport: Viewport) => void): () => void;
    /**
     * Get viewport size category
     */
    getSizeCategory(): 'small' | 'medium' | 'large' | 'extra-large';
    /**
     * Get recommended base font size
     */
    getBaseFontSize(): number;
    /**
     * Get recommended touch target size
     */
    getTouchTargetSize(): number;
    /**
     * Destroy detector
     */
    destroy(): void;
}
/**
 * Get device detector instance
 */
export declare function getDeviceDetector(): DeviceDetector;
/**
 * Destroy device detector instance
 * Should be called when app is unmounted
 */
export declare function destroyDeviceDetector(): void;
/**
 * Quick access helpers
 */
export declare const device: {
    readonly viewport: Viewport;
    readonly type: DeviceType;
    readonly orientation: DeviceOrientation;
    readonly isMobile: boolean;
    readonly isTablet: boolean;
    readonly isDesktop: boolean;
    readonly isTouch: boolean;
    readonly isRetina: boolean;
    readonly baseFontSize: number;
};
