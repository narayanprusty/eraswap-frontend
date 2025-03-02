/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
// import Feedback from '../Feedback';
import Footer from '../Footer';
import  Layout  from 'antd/lib/layout';
class LayoutThing extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    const canUseDOM = !!(
      typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement
    );

    // Don't load these styles server-side
    if (canUseDOM && __DEV__) {
      // Import the antThemeLoader.less file for hot reloading theme changes
      require('components/antThemeLoader.less');
    }
  }

  render() {
    return (
      <Layout className="layout">
        <Header menukey={this.props.menukey} itsHome={this.props.itsHome} />
        <div className={s.root}>
        {this.props.children}
        </div>
        <Footer />
      </Layout>
    );
  }
}

export default withStyles(normalizeCss, s)(LayoutThing);
