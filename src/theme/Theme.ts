/**
 * Theme.ts: color themes for the editor.
 */

export type Theme = {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    foreground: string;
    foregroundAlt: string;
};

export const Cobalt = {
    primary: "#80a1b0",
    secondary: "#455a64",
    tertiary: "#2c404f",
    quaternary: "#172733",
    foreground: "#d3dee6",
    foregroundAlt: "#a7c2d6"
};

export const Opal = {
    primary: "#9dbcd1",
    secondary: "#78909c",
    tertiary: "#546e7a",
    quaternary: "#37474f",
    foreground: "#d3dee6",
    foregroundAlt: "#a7c2d6"
};

export function messageStyle(theme: Theme) {
    return {
        backgroundColor: theme.secondary,
        color: theme.foregroundAlt
    };
}
