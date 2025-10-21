/**
 * @ldesign/size - Animation Manager
 *
 * Handles smooth transitions when changing size configurations
 */
export interface AnimationOptions {
    duration?: number;
    easing?: string;
    enabled?: boolean;
    properties?: string[];
}
export declare class AnimationManager {
    private options;
    private styleElement;
    private isTransitioning;
    private animationFrameId;
    private pendingPromises;
    private pendingTimeouts;
    private isDestroyed;
    constructor(options?: AnimationOptions);
    /**
     * Enable smooth transitions for size changes
     */
    enableTransitions(): void;
    /**
     * Disable transitions temporarily
     */
    disableTransitions(): void;
    /**
     * Perform a size change with animation
     */
    animateSizeChange(beforeChange: () => void, afterChange?: () => void): Promise<void>;
    /**
     * Wait for transitions to complete
     */
    private waitForTransition;
    /**
     * Generate CSS for transitions
     */
    private generateTransitionCSS;
    /**
     * Update animation options
     */
    setOptions(options: AnimationOptions): void;
    /**
     * Get current options
     */
    getOptions(): AnimationOptions;
    /**
     * Check if transitions are active
     */
    isActive(): boolean;
    /**
     * Destroy the animation manager
     */
    destroy(): void;
}
/**
 * Get animation manager instance
 */
export declare function getAnimationManager(): AnimationManager;
/**
 * Destroy animation manager instance
 * Should be called when app is unmounted
 */
export declare function destroyAnimationManager(): void;
/**
 * Quick animation helper
 */
export declare const animate: {
    /**
     * Enable animations
     */
    enable: () => void;
    /**
     * Disable animations
     */
    disable: () => void;
    /**
     * Animate a change
     */
    change: (fn: () => void, after?: () => void) => Promise<void>;
    /**
     * Set animation options
     */
    config: (options: AnimationOptions) => void;
};
