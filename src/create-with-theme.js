import React from 'react';
import channel from './channel';
import createThemeListener from './create-theme-listener';

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component';

export default function createWithTheme(CHANNEL = channel) {
  const themeListener = createThemeListener(CHANNEL);
  return Component =>
    class WithTheme extends React.Component {
      static displayName = `WithTheme(${getDisplayName(Component)})`;
      static contextTypes = themeListener.contextTypes;

      constructor(props) {
        super(props);
        this.state = { theme: {} };
        this.setTheme = theme => this.setState({ theme });
      }
      componentWillMount() {
        this.setTheme(themeListener.initial(this.context))
      }
      componentDidMount() {
        this.unsubscribe = themeListener.subscribe(this.context, this.setTheme);
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        const { theme } = this.state;

        return <Component theme={theme} {...this.props} />;
      }
    };
}
