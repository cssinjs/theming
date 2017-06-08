# theming

[![NPM version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Unified CSSinJS theming solution for React

* `ThemeProvider` allows you to pass, update, merge and augment `theme` through context down react tree.
* `withTheme` allows you to receive theme and its updates in your components as a `theme` prop.
* `createTheming` allows you to integrate `theming` into your CSSinJS library with custom `channel` (if you need custom one).

See [Motivation](#motivation) for details.


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Playground demo](#playgroundemo)
* [Motivation](#motivation)
* [API](#api)
  * [channel](#channel)
  * [ThemeProvider](#themeprovider)
  * [withTheme](#withthemecomponent)
  * [createTheming](#createthemingcustomchannel)
* [Credits](#credits)
* [License](#license)


## Install

    npm install --save theming
    # or
    yarn add theming


## Usage

In your components

Note: this component i will use later to show what theme you will get

```jsx
import React from 'react';
import { withTheme } from 'theming';

const DemoBox = props => {
  console.log(props.theme);
  return (<div />);
}

export default withTheme(DemoBox);
```

In your app

```jsx
import React from 'react';
import { ThemeProvider } from 'theming';
import DemoBox from './components/DemoBox'

const theme = {
  color: 'black',
  background: 'white',
};

const App = () => (
  <ThemeProvider theme={theme}>
    <DemoBox /> {/* { color: 'black', background: 'white' } */}
  </ThemeProvider>
)

export default App;
```

## Playground demo

Be our guest, play with `theming` in this webpackbin:
[https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1](https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1)

[![theming](https://user-images.githubusercontent.com/559321/26953553-5049761e-4cab-11e7-848f-9056684487cd.gif)](https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1)

## Motivation

These components are enabling seamless theming for your react applications. And as far as you dont want to pass theme object to each and every component. Thats why you want to use context. But as far context feature is _experimental API and it is likely to break in future releases of React_ you don't want to use it directly. Here `theming` comes to play.

> If you insist on using context despite these warnings, try to isolate your use of context to a small area and avoid using the context API directly when possible so that it's easier to upgrade when the API changes.
>
> If you insist on using context despite these warnings, try to isolate your use of context to a small area and avoid using the context API directly when possible so that it's easier to upgrade when the API changes.
> — [Context, React documentation](https://facebook.github.io/react/docs/context.html)

Regarding _isolation your use of context to a small area_ and _small areas__ in particular our very own react prophet Dan Abramov have a thing to say:

> Should I use React unstable “context” feature?
> ![context application areas](https://pbs.twimg.com/media/CmeGPNcVYAAM7TR.jpg)

So you are fine to use context for theming. `theming` package provides you everything you need to do that:
* `ThemeProvider` allows you to pass and update `theme` through context down react tree
* `withTheme` allows you to receive theme and its updates in your components as a `theme` prop.


## API

### channel

Theming package by default uses this string as a name of the field in context (hence `contextTypes` and `childContextTypes`). If you want to build your own components on top of theming, it might be a good idea to not rely on hard coded value, but instead import this value from the package.

```js
import { channel } from 'theming';

console.log(channel); '__THEMING__';
```

### ThemeProvider

React High-Order component, which passes theme object down the react tree by context.

```jsx
import { ThemeProvider } from 'theming';
const theme = { /*…*/ };

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

#### props

##### props.theme

*Required*  
Type: `Object`, `Function`

If its `Object` and its root `ThemeProvider` then its intact and being passed down the react tree.

```jsx
const theme = { themed: true };

<ThemeProvider theme={theme}>
  <DemoBox /> {/* { themed: true } */}
</ThemeProvider>
```

If its `Object` and its nested `ThemeProvider` then its being merged with theme from parent `ThemeProvider` and passed down to the react tree.

```jsx
const theme = { themed: true };
const patch = { merged: true };

<ThemeProvider theme={theme}>
  <ThemeProvider theme={patch}>
    <DemoBox /> {/* { themed: true, merged: true } */}
  </ThemeProvider>
</ThemeProvider>
```

If its `Function` and its nested `ThemeProvider` then its being applied to the theme from parent `ThemeProvider`. if result is an `Object` it will be passed down to the react tree, throws otherwise.

```jsx
const theme = { themed: true };
const augment = outerTheme =>
  Object.assign({}, outerTheme, { augmented: true });

<ThemeProvider theme={theme}>
  <ThemeProvider theme={augment}>
    <DemoBox /> {/* { themed: true, augmented: true } */}
  </ThemeProvider>
</ThemeProvider>
```

##### props.children

*Required*  
Type: `PropTypes.element`

ThemeProvider uses [`React.Children.only`](https://facebook.github.io/react/docs/react-api.html#react.children.only) in render, which returns the only child in children. Throws otherwise.

### withTheme(component)

React High-Order component, which maps context to theme prop.

#### component

*Required*  
Type: `PropTypes.element`

You need to have `ThemeProvider` with a theme somewhere upper the react tree, after that wrap your component in `withTheme` and your component will get theme as a prop. `withTheme` will handle initial theme object as well as theme updates.

PS. It doesnt break if you have `PureComponent` somewhere in between your ThemeProvider and withTheme (i have tests for that).

Usage with Component:

```jsx
import React from 'react';
import { withTheme } from 'theming';

const DemoBox = props => {
  console.log(props.theme);
  return (<div />);
}

export default withTheme(DemoBox);
```

In the app:

```jsx
import React from 'react';
import { ThemeProvider } from 'theming';
import DemoBox from './components/DemoBox'

const theme = {
  color: 'black',
  background: 'white',
};

const App = () => (
  <ThemeProvider theme={theme}>
    <DemoBox /> {/* { color: 'black', background: 'white' } */}
  </ThemeProvider>
)

export default App;
```

### createTheming(customChannel)

Function to create `ThemeProvider` and `withTheme` with custom context channel.

#### customChannel

Type: `String`  
Default: `__THEMING__`  
Result: `Object { channel, withTheme, ThemeProvider }`

`withTheme` and `ThemeProvider` are the same as default ones, but with overwritten context channel.

`channel` is `customChannel` to track what is context channel.

```js
import { createTheming } from 'theming';

const theming = createTheming('__styled-components__');

const { channel, withTheme, ThemeProvider } = theming;

export default {
  channel,
  withTheme,
  ThemeProvider,
};
```

## Credits

* Thanks to [jss][jss] creator [Oleg Slobodskoi @kof][kof] for immersive help, support and code review.
* Thanks to [styled-components][sc] creator [Max Stoiber @mxstbr][mxstbr] for initial and battle tested implementation of theming support in [styled-components][sc] as well as help and code review.
* Thanks to [styled-components'][sc] core team member [Phil Plückthun @philpl][philpl] for help and code review.
* Thanks to [glamorous][glamorous] creator [Kent C. Dodds @kentcdodds][kentcdodds] for help, support and code review.
* Thanks to [glamorous's][glamorous] core team member [Alessandro Arnodo @vesparny][vesparny] for improved theming support in [glamorous][glamorous] and [brcast][brcast].
* Thanks to [Gert Sallaerts @gertt][gertt] for the [playground][playground] demo.

[kof]: https://github.com/kof
[mxstbr]: https://github.com/mxstbr
[philpl]: https://github.com/philpl
[kentcdodds]: https://github.com/kentcdodds
[vesparny]: https://github.com/vesparny
[gertt]: https://github.com/gertt

[jss]: https://github.com/cssinjs/jss
[sc]: https://github.com/styled-components/styled-components
[glamorous]: https://github.com/paypal/glamorous
[brcast]: https://github.com/vesparny/brcast
[playground]: https://www.webpackbin.com/bins/-Km8TglfWP84oYhDquT1

## License

MIT © [Vladimir Starkov](https://iamstarkov.com)

[npm-url]: https://npmjs.org/package/theming
[npm-image]: https://img.shields.io/npm/v/theming.svg?style=flat-square

[travis-url]: https://travis-ci.org/iamstarkov/theming
[travis-image]: https://img.shields.io/travis/iamstarkov/theming.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/iamstarkov/theming
[coveralls-image]: https://img.shields.io/coveralls/iamstarkov/theming.svg?style=flat-square

[depstat-url]: https://david-dm.org/iamstarkov/theming
[depstat-image]: https://david-dm.org/nordnet/grid.svg?style=flat-square
