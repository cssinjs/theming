import * as React from 'react';
import { Context } from 'create-react-context';

type DefaultTheme = object;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type WithThemeFactory<Theme> = <
    InnerProps extends { theme: Theme },
    InnerComponent extends React.ComponentType<InnerProps>,
    OuterProps extends Omit<InnerProps, { theme: Theme }> & {
        theme?: Theme,
        innerRef?: (ref: InnerComponent | null) => void,
    },
>(
    comp: InnerComponent,
    options?: { forwardInnerRef?: boolean },
) => React.ComponentType<OuterProps>;

interface ThemeProviderProps<Theme> {
    theme: Theme,
    children: React.ReactNode,
}

type ThemeProviderFactory<Theme> = React.ComponentType<ThemeProviderProps<Theme>>;

interface Theming<Theme> {
    withTheme: WithThemeFactory<Theme>,
    ThemeProvider: ThemeProviderFactory<Theme>,
}

declare function createTheming<Theme>(context: Context<Theme>): Theming<Theme>;

declare const withTheme: WithThemeFactory<DefaultTheme>;
declare const ThemeProvider: ThemeProviderFactory<DefaultTheme>;
declare const ThemeContext: Context<{}>;

export {
    ThemeContext,
    createTheming,
    withTheme,
    ThemeProvider,
    ThemeProviderProps,
    Theming,
}