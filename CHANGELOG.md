# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
