/**
 * @ldesign/size - Unit Strategy System
 *
 * Intelligent unit selection based on context and device
 */
import type { SizeContext, SizeUnit, SizeValue, UnitStrategy } from '../types';
/**
 * Unit strategy manager
 */
export declare class UnitStrategyManager {
    private strategies;
    constructor();
    /**
     * Initialize default strategies for different contexts
     */
    private initializeDefaultStrategies;
    /**
     * Get recommended unit for context
     */
    getRecommendedUnit(context: SizeContext): SizeUnit;
    /**
     * Get responsive unit for context
     */
    private getResponsiveUnit;
    /**
     * Get default strategy
     */
    private getDefaultStrategy;
    /**
     * Register custom strategy
     */
    registerStrategy(contextType: string, strategy: UnitStrategy): void;
    /**
     * Convert value between units with context awareness
     */
    convertWithContext(value: number, fromUnit: SizeUnit, toContext: SizeContext, rootFontSize?: number): SizeValue;
    /**
     * Get best unit for accessibility
     */
    getAccessibleUnit(context: SizeContext): SizeUnit;
    /**
     * Check if unit is appropriate for context
     */
    isAppropriateUnit(unit: SizeUnit, context: SizeContext): boolean;
    /**
     * Get unit recommendations for context
     */
    getRecommendations(context: SizeContext): {
        recommended: SizeUnit;
        accessible: SizeUnit;
        alternatives: SizeUnit[];
        avoid: SizeUnit[];
    };
}
/**
 * Get unit strategy manager instance
 */
export declare function getUnitStrategyManager(): UnitStrategyManager;
/**
 * Quick access helpers
 */
export declare const units: {
    /**
     * Get recommended unit for context
     */
    recommend: (context: SizeContext) => SizeUnit;
    /**
     * Get accessible unit
     */
    accessible: (context: SizeContext) => SizeUnit;
    /**
     * Check if unit is appropriate
     */
    isAppropriate: (unit: SizeUnit, context: SizeContext) => boolean;
    /**
     * Get all recommendations
     */
    getRecommendations: (context: SizeContext) => {
        recommended: SizeUnit;
        accessible: SizeUnit;
        alternatives: SizeUnit[];
        avoid: SizeUnit[];
    };
    /**
     * Convert with context
     */
    convert: (value: number, fromUnit: SizeUnit, toContext: SizeContext) => SizeValue;
};
