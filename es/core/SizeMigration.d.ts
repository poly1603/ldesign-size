/**
 * @ldesign/size - Size Migration Tool
 *
 * Helps migrate from other CSS frameworks to ldesign size system
 */
export type Framework = 'bootstrap' | 'tailwind' | 'antd' | 'material-ui' | 'bulma' | 'custom';
export interface MigrationConfig {
    from: Framework;
    to?: 'ldesign';
    customMappings?: Record<string, string>;
    preserveOriginal?: boolean;
    autoApply?: boolean;
}
export interface MigrationReport {
    framework: Framework;
    timestamp: Date;
    statistics: {
        totalClasses: number;
        migratedClasses: number;
        unmappedClasses: string[];
        warnings: string[];
    };
    mappings: Record<string, string>;
    rollbackData?: string;
}
export interface MigrationMapping {
    pattern: RegExp;
    replacement: string | ((match: string) => string);
    description?: string;
}
export declare class SizeMigration {
    private config;
    private rollbackData;
    private report;
    private mappingsCache;
    constructor(config: MigrationConfig);
    /**
     * Migrate HTML classes
     */
    migrateHTML(html: string): string;
    /**
     * Migrate CSS styles
     */
    migrateCSS(css: string): string;
    /**
     * Batch convert multiple files
     */
    convertBatch(files: Array<{
        path: string;
        content: string;
        type: 'html' | 'css';
    }>): Promise<Array<{
        path: string;
        content: string;
        report: MigrationReport;
    }>>;
    /**
     * Generate migration report
     */
    generateReport(): MigrationReport | null;
    /**
     * Rollback migration
     */
    rollback(): string | null;
    /**
     * Get framework mappings
     */
    private getMappings;
    /**
     * Generate warnings for unmapped classes
     */
    private generateWarnings;
    /**
     * Optimize CSS for ldesign
     */
    private optimizeForLDesign;
    /**
     * Export migration configuration
     */
    exportConfig(): string;
    /**
     * Import migration configuration
     */
    static importConfig(configJSON: string): SizeMigration;
    /**
     * Analyze framework usage in code
     */
    analyzeFrameworkUsage(code: string): {
        framework: Framework | null;
        confidence: number;
        patterns: string[];
    };
    /**
     * Generate migration guide
     */
    generateMigrationGuide(): string;
}
export declare function migrateFrom(framework: Framework, code: string, type?: 'html' | 'css'): string;
export declare function detectFramework(code: string): Framework | null;
export declare function createMigrationGuide(framework: Framework): string;
