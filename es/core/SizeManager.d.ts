/**
 * @ldesign/size - Size Manager
 *
 * Manages size schemes, persistence, and CSS injection
 */
export interface SizeConfig {
    baseSize: number;
}
export type SizeScheme = SizeConfig;
export interface SizePreset {
    name: string;
    label: string;
    description?: string;
    baseSize: number;
    category?: string;
}
export type SizeChangeListener = (config: SizeConfig) => void;
export declare class SizeManager {
    private config;
    private presets;
    private listeners;
    private styleElement;
    private currentPresetName;
    private storageKey;
    private isDestroyed;
    private cssCache;
    private lastGeneratedCSS;
    private pendingListenerNotifications;
    private notificationScheduled;
    private readonly MAX_CACHE_SIZE;
    constructor(options?: {
        storageKey?: string;
        presets?: SizePreset[];
    });
    getConfig(): SizeConfig;
    setConfig(config: Partial<SizeConfig>): void;
    setBaseSize(baseSize: number): void;
    applyPreset(presetName: string): void;
    getCurrentPreset(): string;
    getCurrentSize(): string;
    setSize(size: string): void;
    getSizes(): string[];
    getPresets(): SizePreset[];
    addPreset(preset: SizePreset): void;
    private applySize;
    private generateCSS;
    private loadFromStorage;
    private saveToStorage;
    subscribe(listener: SizeChangeListener): () => void;
    onChange(listener: SizeChangeListener): () => void;
    private notifyListeners;
    destroy(): void;
}
export declare const sizeManager: SizeManager;
