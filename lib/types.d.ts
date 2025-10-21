/**
 * @ldesign/size - Advanced Type Definitions
 *
 * Complete type system for responsive size management
 */
/**
 * Device categories
 */
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'widescreen' | 'tv';
/**
 * Device orientation
 */
export type DeviceOrientation = 'portrait' | 'landscape';
/**
 * Viewport information
 */
export interface Viewport {
    width: number;
    height: number;
    device: DeviceType;
    orientation: DeviceOrientation;
    pixelRatio: number;
    touch: boolean;
}
/**
 * Breakpoint definition
 */
export interface Breakpoint {
    name: string;
    min?: number;
    max?: number;
    unit?: 'px' | 'em' | 'rem';
    device?: DeviceType;
}
/**
 * Responsive breakpoints
 */
export interface ResponsiveBreakpoints {
    xs: Breakpoint;
    sm: Breakpoint;
    md: Breakpoint;
    lg: Breakpoint;
    xl: Breakpoint;
    xxl: Breakpoint;
    xxxl?: Breakpoint;
}
/**
 * Size unit representation
 */
export interface SizeValue {
    value: number;
    unit: SizeUnit;
    context?: SizeContext;
}
/**
 * Size units with modern additions
 */
export type SizeUnit = 'px' | 'rem' | 'em' | 'vw' | 'vh' | 'vmin' | 'vmax' | 'vi' | 'vb' | 'svw' | 'svh' | 'lvw' | 'lvh' | 'dvw' | 'dvh' | '%' | 'ch' | 'ex' | 'cap' | 'lh' | 'rlh' | 'cqw' | 'cqh' | 'cqi' | 'cqb' | 'cqmin' | 'cqmax' | 'pt' | 'pc' | 'in' | 'cm' | 'mm';
/**
 * Size context for intelligent unit selection
 */
export interface SizeContext {
    type: 'font' | 'spacing' | 'layout' | 'component' | 'border' | 'icon';
    responsive?: boolean;
    scalable?: boolean;
    device?: DeviceType;
    container?: string;
}
/**
 * Unit strategy for different contexts
 */
export interface UnitStrategy {
    default: SizeUnit;
    mobile?: SizeUnit;
    tablet?: SizeUnit;
    desktop?: SizeUnit;
    print?: SizeUnit;
    fallback?: SizeUnit;
}
/**
 * Fluid size configuration
 */
export interface FluidSize {
    min: SizeValue;
    max: SizeValue;
    preferredUnit?: SizeUnit;
    viewportMin?: number;
    viewportMax?: number;
    clamp?: boolean;
}
/**
 * Responsive size value
 */
export interface ResponsiveSize {
    base: SizeInput;
    xs?: SizeInput;
    sm?: SizeInput;
    md?: SizeInput;
    lg?: SizeInput;
    xl?: SizeInput;
    xxl?: SizeInput;
    fluid?: FluidSize;
}
/**
 * Size scale factor
 */
export type ScaleFactor = number;
/**
 * Size input types
 */
export type SizeInput = string | number | SizeValue;
/**
 * Advanced preset scheme types
 */
export type PresetScheme = 'mobile-compact' | 'mobile-comfortable' | 'mobile-touch' | 'tablet-portrait' | 'tablet-landscape' | 'desktop-compact' | 'desktop-normal' | 'desktop-spacious' | 'tv-interface' | 'dashboard' | 'article' | 'app-ios' | 'app-android' | 'website' | 'admin' | 'ecommerce' | 'a11y-normal' | 'a11y-large' | 'elderly' | 'auto' | 'custom';
/**
 * Size category for semantic sizing
 */
export type SizeCategory = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'giant';
/**
 * Size scale configuration
 */
export interface SizeScale {
    base: number;
    ratio: number;
    steps: number;
    unit?: SizeUnit;
}
/**
 * Font size configuration
 */
export interface FontSizeConfig {
    tiny: SizeInput;
    small: SizeInput;
    medium: SizeInput;
    large: SizeInput;
    huge: SizeInput;
    giant: SizeInput;
    h1: SizeInput;
    h2: SizeInput;
    h3: SizeInput;
    h4: SizeInput;
    h5: SizeInput;
    h6: SizeInput;
    display1?: SizeInput;
    display2?: SizeInput;
    display3?: SizeInput;
    caption?: SizeInput;
    overline?: SizeInput;
    code?: SizeInput;
}
/**
 * Spacing configuration (padding, margin)
 */
export interface SpacingConfig {
    none: SizeInput;
    tiny: SizeInput;
    small: SizeInput;
    medium: SizeInput;
    large: SizeInput;
    huge: SizeInput;
    giant: SizeInput;
    massive?: SizeInput;
    colossal?: SizeInput;
    half?: SizeInput;
    quarter?: SizeInput;
    double?: SizeInput;
}
/**
 * Border radius configuration
 */
export interface RadiusConfig {
    none: SizeInput;
    small: SizeInput;
    medium: SizeInput;
    large: SizeInput;
    huge: SizeInput;
    full: SizeInput;
    circle?: SizeInput;
    square?: SizeInput;
}
/**
 * Line height configuration
 */
export interface LineHeightConfig {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
}
/**
 * Letter spacing configuration
 */
export interface LetterSpacingConfig {
    tighter: SizeInput;
    tight: SizeInput;
    normal: SizeInput;
    wide: SizeInput;
    wider: SizeInput;
    widest: SizeInput;
}
/**
 * Component size configuration
 */
export interface ComponentSizeConfig {
    button: {
        tiny: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        small: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        medium: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        large: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        huge: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
    };
    input: {
        small: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        medium: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
        large: {
            height: SizeInput;
            padding: SizeInput;
            fontSize: SizeInput;
        };
    };
    icon: {
        tiny: SizeInput;
        small: SizeInput;
        medium: SizeInput;
        large: SizeInput;
        huge: SizeInput;
        giant: SizeInput;
    };
    avatar: {
        tiny: SizeInput;
        small: SizeInput;
        medium: SizeInput;
        large: SizeInput;
        huge: SizeInput;
        giant: SizeInput;
    };
    card?: {
        small: SizeInput;
        medium: SizeInput;
        large: SizeInput;
    };
}
/**
 * Complete size scheme configuration
 */
export interface SizeScheme {
    name: string;
    description?: string;
    fontSize: FontSizeConfig;
    spacing: SpacingConfig;
    radius: RadiusConfig;
    lineHeight: LineHeightConfig;
    letterSpacing: LetterSpacingConfig;
    components: ComponentSizeConfig;
    grid?: {
        columns: number;
        gutter: SizeInput;
        margin: SizeInput;
    };
    breakpoints?: {
        xs?: SizeInput;
        sm?: SizeInput;
        md?: SizeInput;
        lg?: SizeInput;
        xl?: SizeInput;
        xxl?: SizeInput;
    };
    custom?: Record<string, SizeInput>;
}
/**
 * Size manager options
 */
export interface SizeManagerOptions {
    /** Current scheme */
    scheme?: PresetScheme | SizeScheme;
    /** CSS variable prefix */
    prefix?: string;
    /** Root font size for rem calculations */
    rootFontSize?: number;
    /** Auto-inject CSS variables */
    autoInject?: boolean;
    /** Storage key for persistence */
    storageKey?: string;
    /** Enable responsive adjustments */
    responsive?: boolean;
    /** Custom schemes */
    customSchemes?: Record<string, SizeScheme>;
}
/**
 * Size manager state
 */
export interface SizeManagerState {
    currentScheme: string;
    scheme: SizeScheme;
    cssVariables: Record<string, string>;
    isDirty: boolean;
}
/**
 * Size calculation options
 */
export interface SizeCalculationOptions {
    precision?: number;
    unit?: SizeUnit;
    clamp?: {
        min?: SizeInput;
        max?: SizeInput;
    };
}
/**
 * Size animation configuration
 */
export interface SizeAnimationConfig {
    from: SizeInput;
    to: SizeInput;
    duration: number;
    easing?: EasingFunction;
    onUpdate?: (value: string) => void;
    onComplete?: () => void;
}
/**
 * Easing function type
 */
export type EasingFunction = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | ((t: number) => number);
/**
 * CSS variable options
 */
export interface CSSVariableOptions {
    prefix?: string;
    selector?: string;
    important?: boolean;
    scheme?: SizeScheme;
}
/**
 * Generated CSS content
 */
export interface GeneratedCSS {
    variables: string;
    utilities?: string;
    components?: string;
    responsive?: string;
    full: string;
}
/**
 * Deep partial type
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Size modifier function
 */
export type SizeModifier = (value: SizeValue) => SizeValue;
/**
 * Size validator function
 */
export type SizeValidator = (value: SizeInput) => boolean;
/**
 * Size change event
 */
export interface SizeChangeEvent {
    previousScheme: string;
    currentScheme: string;
    timestamp: number;
    source: 'user' | 'system' | 'api';
}
/**
 * Size error event
 */
export interface SizeErrorEvent {
    error: Error;
    context: string;
    timestamp: number;
}
/**
 * Size plugin interface
 */
export interface SizePlugin {
    name: string;
    version: string;
    install: (manager: any) => void;
    uninstall?: () => void;
}
/**
 * Plugin options
 */
export interface PluginOptions {
    [key: string]: any;
}
