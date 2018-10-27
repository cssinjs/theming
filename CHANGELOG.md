# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

### 2.1.0 (Unreleased)

- Align flow and TypeScript types so they export the same interfaces ([#60](https://github.com/cssinjs/theming/pull/60))
- Improve withTheme HoC, added support for innerRef and improved typings ([#61](https://github.com/cssinjs/theming/pull/61))

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
