/**
 * Size Selector 内置国际化
 */
export interface SizeLocale {
    title: string;
    close: string;
    ariaLabel: string;
    presets: {
        compact: string;
        comfortable: string;
        default: string;
        spacious: string;
        [key: string]: string;
    };
    descriptions: {
        compact: string;
        comfortable: string;
        default: string;
        spacious: string;
        [key: string]: string;
    };
}
export declare const zhCN: SizeLocale;
export declare const enUS: SizeLocale;
export declare const jaJP: SizeLocale;
export declare const koKR: SizeLocale;
export declare const deDE: SizeLocale;
export declare const frFR: SizeLocale;
export declare const esES: SizeLocale;
export declare const itIT: SizeLocale;
export declare const ptBR: SizeLocale;
export declare const ruRU: SizeLocale;
export declare const locales: {
    'zh-CN': SizeLocale;
    'en-US': SizeLocale;
    'ja-JP': SizeLocale;
    'ko-KR': SizeLocale;
    'de-DE': SizeLocale;
    'fr-FR': SizeLocale;
    'es-ES': SizeLocale;
    'it-IT': SizeLocale;
    'pt-BR': SizeLocale;
    'ru-RU': SizeLocale;
    zh: SizeLocale;
    en: SizeLocale;
    ja: SizeLocale;
    ko: SizeLocale;
    de: SizeLocale;
    fr: SizeLocale;
    es: SizeLocale;
    it: SizeLocale;
    pt: SizeLocale;
    ru: SizeLocale;
};
export type LocaleKey = keyof typeof locales;
export declare function getLocale(locale: LocaleKey | string): SizeLocale;
