import * as React from 'react';
import { Context } from 'create-react-context';

type DefaultTheme = object | null;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type WithThemeFactory<Theme> = <
    InnerProps extends { theme: NonNullable<Theme> },
    InnerComponent extends React.ComponentType<InnerProps>,
    OuterProps extends Omit<InnerProps, { theme: NonNullable<Theme> }> & { innerRef?: React.Ref<InnerComponent> },
>(comp: InnerComponent) => React.ComponentType<OuterProps>;

interface ThemeProviderProps<Theme> {
    theme: NonNullable<Theme> | ((outerTheme: Theme) => NonNullable<Theme>),
    children: React.ReactNode,
}

type ThemeProviderFactory<Theme> = React.ComponentType<ThemeProviderProps<Theme>>;

interface Theming<Theme> {
    context: Context<Theme>,
    withTheme: WithThemeFactory<Theme>,
    ThemeProvider: ThemeProviderFactory<Theme>,
}

declare function createTheming<Theme>(context: Context<Theme>): Theming<Theme>;

declare const withTheme: WithThemeFactory<DefaultTheme>;
declare const ThemeProvider: ThemeProviderFactory<DefaultTheme>;
declare const ThemeContext: Context<DefaultTheme>;

export {
    ThemeContext,
    createTheming,
    withTheme,
    ThemeProvider,
    ThemeProviderProps,
    Theming,
}