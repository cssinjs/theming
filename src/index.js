// @flow

import {createContext, type Context} from 'react'

import createThemeProvider, {type ThemeProviderProps} from './create-theme-provider'
import createWithTheme from './create-with-theme'
import createUseTheme from './create-use-theme'

type ExtractReturnType<Theme> = <ReturnType>((context: Context<Theme>) => ReturnType) => ReturnType

interface Theming<Theme> {
  context: Context<Theme>;
  withTheme: $Call<ExtractReturnType<Theme>, typeof createWithTheme>;
  ThemeProvider: $Call<ExtractReturnType<Theme>, typeof createThemeProvider>;
  useTheme: $Call<ExtractReturnType<Theme>, typeof createUseTheme>;
}

function createTheming<Theme>(context: Context<Theme>): Theming<Theme> {
  return {
    context,
    withTheme: createWithTheme(context),
    useTheme: createUseTheme(context),
    ThemeProvider: createThemeProvider(context)
  }
}

type DefaultTheme = Object

const ThemeContext = createContext<DefaultTheme>()

const {withTheme, ThemeProvider, useTheme} = createTheming<DefaultTheme>(ThemeContext)

export type {Theming, ThemeProviderProps}

export {useTheme, ThemeContext, withTheme, createTheming, ThemeProvider}
