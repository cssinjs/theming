import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import channel from '../channel';

export class Pure extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export const Comp = props => <div {...props} />;

export const getContextTypes = C => C.contextTypes;
export const getChannel = C => Object.keys(getContextTypes(C))[0];

export class PropTrap extends Component {
  static propTypes = {
    intercept: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.props.intercept(props.theme);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.props.intercept(nextProps.theme);
    }
  }
  // eslint-disable-next-line
  render() {
    return <div />;
  }
}

export const mountOptions = broadcast => ({
  childContextTypes: {
    [channel]: PropTypes.func.isRequired,
  },
  context: {
    [channel]: broadcast.subscribe,
  },
});

export class ContextTrap extends Component {
  static propTypes = {
    intercept: PropTypes.func.isRequired,
  };
  static contextTypes = {
    [channel]: PropTypes.func.isRequired,
  };
  componentWillMount() {
    const subscribe = this.context[channel] || (() => {});
    this.unsubscribe = subscribe(theme => {
      this.props.intercept(theme);
    });
  }
  // eslint-disable-next-line
  render() {
    return <div />;
  }
}

export const Trap = {
  Prop: PropTrap,
  Context: ContextTrap,
};

export function getInterceptor() {
  let state;
  return newState => {
    if (newState) {
      state = newState;
    }
    return state;
  };
}
