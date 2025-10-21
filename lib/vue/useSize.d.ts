export declare function useSize(): {
    config: Readonly<import("vue").Ref<{
        readonly baseSize: number;
    }, {
        readonly baseSize: number;
    }>>;
    currentPreset: Readonly<import("vue").Ref<string, string>>;
    presets: import("vue").ComputedRef<any>;
    setBaseSize: (baseSize: number) => void;
    applyPreset: (presetName: string) => void;
    cleanup: () => void;
};
