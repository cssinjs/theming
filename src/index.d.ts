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
    options: { forwardInnerRef: boolean },
) => React.ComponentType<OuterProps>;

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
declare const ThemeContext: Context<{}>;

export {
    ThemeContext,
    createTheming,
    withTheme,
    ThemeProvider,
    Theming,
}