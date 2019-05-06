# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

### v3.2.0 (2019-05-06)

- Upgrade flow, fix types
- Add prettier config, fix formatting

### v3.1.0 (2019-02-11)

- Improve bundle size ([#83](https://github.com/cssinjs/theming/pull/83))
- Add useTheme hook ([#84](https://github.com/cssinjs/theming/pull/84))
- Upgrade hoist-non-react-statics to 3.3.0 ([#86](https://github.com/cssinjs/theming/pull/86))

### 3.0.3 (2019-01-20)

- Fix @types/react dependency ([#81](https://github.com/cssinjs/theming/pull/81))

### 3.0.2 (2019-01-16)

- Republish with new build

### 3.0.1 (2019-01-13)

- Use tiny-warning instead of warning package ([#78](https://github.com/cssinjs/theming/pull/78))

### 3.0.0 (2018-12-20)

- Upgrade to React 16.3 and cache the calculation of the theme object ([#74](https://github.com/cssinjs/theming/pull/74))
- Add support for the new forward ref API and deprecate the `innerRef` prop ([#75](https://github.com/cssinjs/theming/pull/75))

### 2.2.0 (2018-11-16)

- Make the default theme undefined so when a ThemeProvider is not nested, it will not merge the themes ([#70](https://github.com/cssinjs/theming/pull/70))
- Save the context on the theming object ([#69](https://github.com/cssinjs/theming/pull/69))

### 2.1.2 (2018-11-2)

- Added exporting of ThemeProviderProps ([#67](https://github.com/cssinjs/theming/pull/67))

### 2.1.1 (2018-11-1)

- Fix ts types ([#65](https://github.com/cssinjs/theming/pull/65))

### 2.1.0 (2018-10-31)

- Align flow and TypeScript types so they export the same interfaces ([#60](https://github.com/cssinjs/theming/pull/60))
- Improve withTheme HoC, added support for innerRef and improved typings ([#61](https://github.com/cssinjs/theming/pull/61))
- Export the default ThemeContext ([#62](https://github.com/cssinjs/theming/pull/62))

### 2.0.0 (2018-10-24)

- Use new React Context API ([#54](https://github.com/cssinjs/theming/pull/54))
- Switched build system to rollup for building esm, cjs and umd ([#55](https://github.com/cssinjs/theming/pull/55))
- Added flow types ([#54](https://github.com/cssinjs/theming/pull/54))
- Added TypeScript types ([#58](https://github.com/cssinjs/theming/pull/58))

### 1.3.0 (2017-12-18)

- Added unsubscribe method

### 1.2.1 (2017-11-12)

- Update React to v16
- Update brcast

### 1.1.0 (2017-07-12)

Add `themeListener`—advanced helper to hook theming in any Component.

### 1.0.2 (2017-07-12)

Fix a bug where ThemeProvider tried to merge with `outerTheme`, when there is none. In these case ThemeProvider needs to pass original theme without merging ([#19][] by [@iamstarkov][])

[#19]: https://github.com/iamstarkov/theming/pull/19
[@iamstarkov]: https://github.com/iamstarkov/

### 1.0.1 (2017-06-11)

Fix a bug with webpack resolving `pkg.modules`, so from now own `theming` has commonjs (`dist/cjs`) and es modules (`dist/esm`) entry poingts.

### 1.0.0 (2017-06-09)

Initial release with `channel`, `ThemeProvider`, `withTheme` and `createTheming`
