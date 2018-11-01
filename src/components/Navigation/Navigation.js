/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import {Icon} from "antd";

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }
  componentDidMount() {
   this.loginStateSet();
  }
  loginStateSet = ()=>{
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('token').length > 0
    ) {
      this.setState({
        loggedIn: true,
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  }

  logout = () => {
    localStorage.clear();
    this.setState({
      loggedIn: false,
    });
    location.href = '/login';
  };
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/">
        <Icon type="home" />
          Home
        </Link>
        <Link className={s.link} to="/about">
          About
        </Link>
        <Link className={s.link} to="/contact">
          Contact
        </Link>
        {!this.state.loggedIn && <span className={s.spacer}> | </span> && (
            <Link className={s.link} to="/login">
              Log in
            </Link>
          )}
        {!this.state.loggedIn && <span className={s.spacer}>or</span> && (
            <Link className={cx(s.link, s.highlight)} to="/register">
              Sign up
            </Link>
          )}
        {this.state.loggedIn && <span className={s.spacer}> | </span> && (
            <button className={cx(s.link, s.highlight)} onClick={this.logout}>
              Logout
            </button>
          )}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
