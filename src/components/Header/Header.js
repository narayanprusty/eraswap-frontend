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
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';
import logoUrl2x from './logo-small@2x.png';
import {Menu} from 'antd';
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
   this.loginState();
  }
  loginState =()=>{
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('token').length > 0
    ) {
      this.setState({
        loggedIn: true
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>

          <Navigation itsHome={this.props.itsHome} />
          <Link className={s.brand} to="/">
            <img
              src={logoUrl}
              srcSet={`${logoUrl2x} 2x`}
              width="38"
              height="38"
              alt="Eraswap"
            />
            <span className={s.brandTxt}>ErasWap</span>
          </Link>

          {this.state.loggedIn && !this.props.itsHome &&(
          <Menu
        onClick={this.handleClick}
        mode="horizontal"
        defaultSelectedKeys={this.props.menukey ? [this.props.menukey]:[]}
        style={{
          lineHeight: '64px',
          backgroundColor:'transparent'
         }}
      >
        <Menu.Item key="1">
        <Link to='/computex'>ComputeX</Link>
        </Menu.Item>
        <Menu.Item key="2">
        <Link to='/txnhistory'>Txn History</Link>
        </Menu.Item>
        <Menu.Item key="3">
        <Link to="/add_p2p_listing">
        Add P2P Listing
        </Link>
        </Menu.Item>
        <Menu.Item key="4">
        <Link to="/p2p">
        P2P MarketPlace
        </Link>
        </Menu.Item>
        </Menu>)}
          {/* <div className={s.banner}>
            <h1 className={s.bannerTitle}>Eraswap</h1>
            <p className={s.bannerDesc}>Eraswap Dashboard</p>
          </div> */}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
