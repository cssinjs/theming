import * as React from 'react';
import { Context } from 'create-react-context';

type DefaultTheme = {};

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type WithThemeFactory<Theme> = <Props extends { theme: Theme }>(
    comp: React.ComponentType<Props>,
    name: string,
) => React.ComponentType<Omit<Props, { theme: Theme }>>;

type ThemeProviderFactory<Theme> = React.ComponentType<{
    theme: Theme | ((outerTheme: object) => Theme),
    children: React.ReactNode,
}>;

interface Theming<Theme> {
    withTheme: WithThemeFactory<Theme>,
    ThemeProvider: ThemeProviderFactory<Theme>,
}

declare function createTheming<Theme>(context: Context<Theme>): Theming<Theme>;

declare const withTheme: WithThemeFactory<DefaultTheme>;
declare const ThemeProvider: WithThemeFactory<DefaultTheme>;

export {
    createTheming,
    withTheme,
    ThemeProvider,
    Theming,
}