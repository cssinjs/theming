import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
