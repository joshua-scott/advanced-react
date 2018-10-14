import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Meta from './Meta';
import Header from './Header';

export default class Page extends Component {
  propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <Meta />
        <Header />
        {children}
      </div>
    );
  }
}
