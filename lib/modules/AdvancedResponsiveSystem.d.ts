/**
 * Advanced Responsive System Module
 * Supports container queries, complex layouts, and adaptive sizing strategies
 */
import type { SizeValue } from '../types';
/**
 * Container query type
 */
export type ContainerQueryType = 'inline-size' | 'block-size' | 'width' | 'height' | 'aspect-ratio';
/**
 * Layout type
 */
export type LayoutType = 'grid' | 'flex' | 'columns' | 'masonry' | 'custom';
/**
 * Size calculation strategy
 */
export type SizeStrategy = 'fluid' | 'stepped' | 'adaptive' | 'elastic' | 'hybrid';
/**
 * Container query configuration
 */
export interface ContainerQuery {
    container: string;
    type: ContainerQueryType;
    breakpoints: {
        name: string;
        min?: number;
        max?: number;
        sizeConfig: Record<string, SizeValue>;
    }[];
}
/**
 * Layout configuration
 */
export interface LayoutConfig {
    type: LayoutType;
    columns?: number | 'auto';
    gap?: SizeValue;
    itemSizing?: 'equal' | 'auto' | 'masonry';
    responsive?: boolean;
    containerBased?: boolean;
}
/**
 * Advanced breakpoint configuration
 */
export interface AdvancedBreakpoint {
    name: string;
    query: string;
    priority?: number;
    sizeModifiers?: {
        scale?: number;
        minSize?: number;
        maxSize?: number;
    };
    layoutOverrides?: Partial<LayoutConfig>;
}
/**
 * Responsive size configuration
 */
export interface ResponsiveSizeConfig {
    base: SizeValue;
    breakpoints?: Record<string, SizeValue>;
    containerQueries?: ContainerQuery[];
    strategy?: SizeStrategy;
    clamp?: {
        min: SizeValue;
        max: SizeValue;
        preferred?: SizeValue;
    };
}
/**
 * Element visibility configuration
 */
export interface VisibilityConfig {
    showOn?: string[];
    hideOn?: string[];
    displayType?: string;
    transition?: {
        duration: number;
        easing: string;
    };
}
/**
 * Advanced Responsive System
 */
export declare class AdvancedResponsiveSystem {
    private breakpoints;
    private activeBreakpoints;
    private containerObservers;
    private mediaQueries;
    private listeners;
    private listenerRefs;
    private detector;
    private layoutConfigs;
    private visibilityRules;
    private mediaQueryHandlers;
    constructor();
    /**
     * Initialize default breakpoints
     */
    private initializeDefaultBreakpoints;
    /**
     * Add custom breakpoint
     */
    addBreakpoint(breakpoint: AdvancedBreakpoint): void;
    /**
     * Remove breakpoint
     */
    removeBreakpoint(name: string): void;
    /**
     * Cleanup breakpoint handler
     */
    private cleanupBreakpointHandler;
    /**
     * Setup media query listeners
     */
    private setupMediaQueryListeners;
    /**
     * Handle breakpoint change
     */
    private handleBreakpointChange;
    /**
     * Notify listeners of breakpoint changes
     */
    private notifyListeners;
    /**
     * Setup container query observer
     */
    setupContainerQuery(containerSelector: string, queries: ContainerQuery['breakpoints'], callback: (matchedQuery: string | null) => void): () => void;
    /**
     * Apply container-based sizing
     */
    applyContainerSizing(element: HTMLElement, containerQuery: ContainerQuery): void;
    /**
     * Calculate responsive size
     */
    calculateResponsiveSize(config: ResponsiveSizeConfig): SizeValue;
    /**
     * Apply size strategy
     */
    private applySizeStrategy;
    /**
     * Calculate fluid size
     */
    private calculateFluidSize;
    /**
     * Calculate stepped size
     */
    private calculateSteppedSize;
    /**
     * Calculate adaptive size
     */
    private calculateAdaptiveSize;
    /**
     * Calculate elastic size
     */
    private calculateElasticSize;
    /**
     * Calculate hybrid size
     */
    private calculateHybridSize;
    /**
     * Create responsive layout
     */
    createResponsiveLayout(container: HTMLElement, config: LayoutConfig): void;
    /**
     * Apply grid layout
     */
    private applyGridLayout;
    /**
     * Apply flex layout
     */
    private applyFlexLayout;
    /**
     * Apply columns layout
     */
    private applyColumnsLayout;
    /**
     * Apply masonry layout
     */
    private applyMasonryLayout;
    /**
     * Make layout responsive
     */
    private makeLayoutResponsive;
    /**
     * Set element visibility rules
     */
    setVisibilityRules(element: HTMLElement, config: VisibilityConfig): void;
    /**
     * Update element visibility
     */
    private updateElementVisibility;
    /**
     * Check if element should be shown
     */
    private shouldShowElement;
    /**
     * Get active breakpoints
     */
    getActiveBreakpoints(): string[];
    /**
     * Get active breakpoint (highest priority)
     */
    getActiveBreakpoint(): string | null;
    /**
     * Check if breakpoint is active
     */
    isBreakpointActive(name: string): boolean;
    /**
     * Subscribe to breakpoint changes
     */
    onChange(listener: (breakpoints: string[]) => void): () => void;
    /**
     * Get CSS custom properties for current state
     */
    getCSSVariables(): Record<string, string>;
    /**
     * Apply CSS variables to element
     */
    applyCSSVariables(element?: HTMLElement): void;
    /**
     * Destroy the system
     */
    destroy(): void;
}
/**
 * Create responsive system instance
 */
export declare function createResponsiveSystem(): AdvancedResponsiveSystem;
/**
 * Default responsive system instance
 */
export declare const responsive: AdvancedResponsiveSystem;
