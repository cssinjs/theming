# Theming

[![NPM version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

## Unified CSSinJS theming solution for React

* `ThemeProvider` allows you to pass, update, merge and augment `theme` through context down react tree.
* `withTheme` allows you to receive theme and its updates in your components as a `theme` prop.
* `createTheming` allows you to integrate `theming` into your CSSinJS library with custom `channel` (if you need custom one).

See [Motivation](#motivation) for details.


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Playground demo](#playground-demo)
* [Motivation](#motivation)
* [API](#api)
  * [ThemeProvider](#themeprovider)
  * [withTheme](#withthemecomponent)
  * [useTheme](#usetheme)
  * [createTheming](#createthemingcustomchannel)
* [Credits](#credits)
* [License](#license)


## Install

    npm install --save theming
    # or
    yarn add theming


## Usage

In your components

Note: this component is used to show what theme you receive.

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

Be our guest, play with `theming` in codesandbox:
[https://codesandbox.io/s/jvwzkkxrp5](https://codesandbox.io/s/jvwzkkxrp5)

![theming playground demo](https://user-images.githubusercontent.com/559321/27082371-ba194816-5044-11e7-8f06-6cbdbdefb602.gif)

## Motivation

These components are enabling seamless theming for your react applications. So as far as you don't want to pass the theme object to every component. That's why you want to use context. However, as far context feature is _experimental API and it is likely to break in future releases of React_ you don't want to use it directly. Here `theming` comes to play.

> If you insist on using context despite these warnings, try to isolate your use of context to a small area and avoid using the context API directly when possible so that it's easier to upgrade when the API changes.
>
> If you insist on using context despite these warnings, try to isolate your use of context to a small area and avoid using the context API directly when possible so that it's easier to upgrade when the API changes.
> — [Context, React documentation](https://facebook.github.io/react/docs/context.html)

Regarding _isolation your use of context to a small area_ and _small areas__ in particular our very own react prophet Dan Abramov have a thing to say:

> Should I use React unstable “context” feature?
> <img src="https://pbs.twimg.com/media/CmeGPNcVYAAM7TR.jpg" alt="![context application areas]" height="300" />
> — [Dan Abramov @dan_abramov on Twitter](https://twitter.com/dan_abramov/status/749715530454622208?lang=en)

So you are okay to use context for theming. `theming` package provides everything you need to do that:
* The `ThemeProvider` allows you to pass and update your theme through context down the react tree.
* `withTheme` allows you to receive theme and its updates in your components as a `theme` prop.
* `createTheming` allows you to integrate `theming` into your CSSinJS library with a custom `context` (if you need custom one).


## API

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

If its `Object` and its root `ThemeProvider` then it's intact and being passed down the react tree.

```jsx
const theme = { themed: true };

<ThemeProvider theme={theme}>
  <DemoBox /> {/* { themed: true } */}
</ThemeProvider>
```

If its `Object` and its nested `ThemeProvider` then it is being merged with the theme from the parent `ThemeProvider` and passed down to the react tree.

```jsx
const theme = { themed: true };
const patch = { merged: true };

<ThemeProvider theme={theme}>
  <ThemeProvider theme={patch}>
    <DemoBox /> {/* { themed: true, merged: true } */}
  </ThemeProvider>
</ThemeProvider>
```

If its `Function` and its nested `ThemeProvider` then it's being applied to the theme from parent `ThemeProvider`. If the result is an `Object` it's passed down to the react tree, throws otherwise.

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

### withTheme(component)

React High-Order component, which maps context to theme prop.

#### component

*Required*
Type: `ComponentType`

You need to have `ThemeProvider` with a theme somewhere upper the react tree after that wrap your component in `withTheme` and your component gets the theme as a prop. `withTheme`  handles the initial theme object as well as theme updates.

PS. It doesn't break if you have `PureComponent` somewhere in between your `ThemeProvider` and `withTheme`.

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

#### Access inner component instance

The `withTheme` HOC supports the new React forwardRef API so you can use the regular ref prop.

### useTheme

When you are on React 16.8 higher you will be able to use the `useTheme` hook which will return the theme object.

Usage with Component:

```jsx
import React from 'react';
import { useTheme } from 'theming';

const DemoBox = () => {
  const theme = useTheme();
  console.log(theme);
  return (<div />);
}

export default Demobox;
```

### createTheming(context)

Function to create `ThemeProvider` and `withTheme` with custom context.
The context you pass in is used.

#### context

Type: `Object`
Result: `Object { withTheme, ThemeProvider, useTheme }`

`withTheme`, `ThemeProvider` and `useTheme` will use the context passed to `createTheming`.

Note: You will only be able to use `useTheme` when you are on React version 16.8 or higher.

```js
import { createTheming } from 'theming';
import React from 'react';

const context = React.createContext({});
const theming = createTheming(context);

const { withTheme, ThemeProvider, useTheme } = theming;

export default {
  withTheme,
  ThemeProvider,
  useTheme,
};
```

## ThemeContext

We export the default ThemeContext so you can use it with the new `static contextType` with classes or even the new React Hooks API.
This is the context which also the exported `withTheme` and `ThemeProvider` use.

```js
import { ThemeContext } from 'theming';
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
[playground]: https://codesandbox.io/s/jvwzkkxrp5

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
