/**
 * Gamified Sizing Module
 * Makes size adjustments fun and interactive with game-like elements
 */
import type { SizeValue } from '../types';
/**
 * Achievement definition
 */
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon?: string;
    points: number;
    unlocked: boolean;
    unlockedAt?: Date;
    condition: (stats: UserStats) => boolean;
    reward?: SizeReward;
}
/**
 * Size reward for achievements
 */
export interface SizeReward {
    type: 'unlock' | 'boost' | 'effect' | 'theme';
    value: any;
    description: string;
}
/**
 * User statistics
 */
export interface UserStats {
    totalAdjustments: number;
    perfectMatches: number;
    experimentsCount: number;
    timeSpent: number;
    favoriteSize?: number;
    sizeRange: {
        min: number;
        max: number;
    };
    streakDays: number;
    level: number;
    experience: number;
    achievements: string[];
}
/**
 * Challenge definition
 */
export interface SizeChallenge {
    id: string;
    name: string;
    description: string;
    targetSize: number | SizeValue;
    tolerance: number;
    timeLimit?: number;
    attempts: number;
    completed: boolean;
    reward: {
        experience: number;
        achievement?: string;
    };
}
/**
 * Interactive mode
 */
export type InteractiveMode = 'drag' | 'scroll' | 'gesture' | 'voice' | 'gamepad';
/**
 * Gamification configuration
 */
export interface GamificationConfig {
    enableAchievements: boolean;
    enableChallenges: boolean;
    enableLeaderboard: boolean;
    enableSounds: boolean;
    enableVisualEffects: boolean;
    saveProgress: boolean;
    storageKey?: string;
}
/**
 * Size adjustment event
 */
export interface SizeAdjustmentEvent {
    element: HTMLElement;
    previousSize: number;
    newSize: number;
    method: InteractiveMode;
    timestamp: Date;
    accuracy?: number;
}
/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    level: number;
    achievements: number;
    timestamp: Date;
}
/**
 * Gamified Sizing System
 */
export declare class GamifiedSizing {
    private config;
    private userStats;
    private achievements;
    private challenges;
    private animationSystem;
    private listeners;
    private interactiveModes;
    private sounds;
    private leaderboard;
    constructor(config?: Partial<GamificationConfig>);
    /**
     * Initialize achievements
     */
    private initializeAchievements;
    /**
     * Initialize challenges
     */
    private initializeChallenges;
    /**
     * Setup sound effects
     */
    private setupSounds;
    /**
     * Create a simple sound effect
     */
    private createSound;
    /**
     * Play sound effect
     */
    private playSound;
    /**
     * Enable drag-to-resize
     */
    enableDragResize(element: HTMLElement, options?: {
        min?: number;
        max?: number;
        step?: number;
        axis?: 'x' | 'y' | 'both';
    }): () => void;
    /**
     * Enable scroll-to-resize
     */
    enableScrollResize(element: HTMLElement, options?: {
        min?: number;
        max?: number;
        step?: number;
        sensitivity?: number;
    }): () => void;
    /**
     * Enable gesture controls
     */
    enableGestureResize(element: HTMLElement, options?: {
        min?: number;
        max?: number;
    }): () => void;
    /**
     * Apply size with gamification
     */
    private applySize;
    /**
     * Create visual feedback
     */
    private createVisualFeedback;
    /**
     * Create particle effect
     */
    private createParticleEffect;
    /**
     * Track size adjustment
     */
    private trackAdjustment;
    /**
     * Add experience points
     */
    private addExperience;
    /**
     * Get required experience for level
     */
    private getRequiredExperience;
    /**
     * Level up
     */
    private levelUp;
    /**
     * Check achievements
     */
    private checkAchievements;
    /**
     * Unlock achievement
     */
    private unlockAchievement;
    /**
     * Apply achievement reward
     */
    private applyReward;
    /**
     * Check challenges
     */
    private checkChallenges;
    /**
     * Complete challenge
     */
    private completeChallenge;
    /**
     * Show notification
     */
    private showNotification;
    /**
     * Create progress bar
     */
    createProgressBar(container: HTMLElement): HTMLElement;
    /**
     * Get progress percentage
     */
    private getProgressPercentage;
    /**
     * Load user stats
     */
    private loadUserStats;
    /**
     * Get default stats
     */
    private getDefaultStats;
    /**
     * Save user stats
     */
    private saveUserStats;
    /**
     * Reset progress
     */
    resetProgress(): void;
    /**
     * Get user stats
     */
    getStats(): UserStats;
    /**
     * Get achievements
     */
    getAchievements(): Achievement[];
    /**
     * Get challenges
     */
    getChallenges(): SizeChallenge[];
    /**
     * Subscribe to size adjustment events
     */
    onAdjustment(listener: (event: SizeAdjustmentEvent) => void): () => void;
    /**
     * Notify listeners
     */
    private notifyListeners;
    /**
     * Export progress data
     */
    exportProgress(): string;
    /**
     * Import progress data
     */
    importProgress(data: string): boolean;
}
/**
 * Create gamified sizing instance
 */
export declare function createGamifiedSizing(config?: Partial<GamificationConfig>): GamifiedSizing;
