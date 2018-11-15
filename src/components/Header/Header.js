/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './era-logo.png';
// import logoUrl2x from './logo-small@2x.png';
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


          <Navigation menukey={this.props.menukey} />
          <Link className={s.brand} to="/">
            <img
              src={logoUrl}
              srcSet={logoUrl}
              width="110"
              height="65"
              alt="Eraswap"
            />
            {/* <span className={s.brandTxt}>ErasWap</span> */}
          </Link>

          {/* {this.state.loggedIn && !this.props.itsHome &&(
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
        Manage P2P Listing
        </Link>
        </Menu.Item>
        <Menu.Item key="4">
        <Link to="/p2p">
        P2P MarketPlace
        </Link>
        </Menu.Item>
        </Menu>)} */}
         <div className={s.banner}>
         {this.props.menukey == 1 && (
             <div>
            <h1 className={s.bannerTitle}>Computex</h1>
            <p className={s.bannerDesc}>Computex Dashboard</p>
    </div>)}
    {this.props.menukey == 3 && (
      <div>
        <h1 className={s.bannerTitle}>Manage P2P</h1>
        <p className={s.bannerDesc}>Manage Your P2P Listings</p></div>
    )}
    {this.props.menukey == 4 && (
      <div>
        <h1 className={s.bannerTitle}>P2P MarketPlace</h1>
        <p className={s.bannerDesc}>P2P Dash board</p></div>
    )}



          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
