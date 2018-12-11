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
import {Icon,Dropdown,Menu} from "antd";

const SubMenu = Menu.SubMenu;
class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }
  menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to='/computex'><Icon type="database" theme="twoTone"  /> &nbsp;ComputeX</Link>
        </Menu.Item>

        <SubMenu title="P2P Dashboards">
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
        </SubMenu>

        <SubMenu title="Wallets">
        <Menu.Item key="5">
        <Link to='/wallet/BTC'>
        Bitcoin
        </Link>
        </Menu.Item>
        <Menu.Item key="6">
        <Link to='/wallet/ETH'>
        Ethereum
        </Link>
        </Menu.Item>
        <Menu.Item key="7">
        <Link to='/wallet/EST'>
        EST Token
        </Link>
        </Menu.Item>
        </SubMenu>

        <Menu.Item key="8" disabled>
        <Link to='/LendBorrow'><Icon type="usergroup-add" theme="twoTone"  />&nbsp;Lend {"&"} Borrow</Link>
        </Menu.Item>
    </Menu>
  );
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
    return true;
    // location.href = '/login';
  };
  render() {
    return (
      <div className={s.root} role="navigation">
       {this.props.menukey == 3 &&(
        <Link className={s.link} to="/p2p">
          P2P Marketplace
        </Link>
      )}
      {this.props.menukey == 4 &&(
        <Link className={s.link} to="/add_p2p_listing">
          Manage Your Listings
        </Link>
      )}
      {(this.props.menukey >= 6 && this.props.menukey <= 8) &&(
            <Link className={s.link} to="/LendBorrow/placeOrder">
                Place Order
            </Link>
      )}
      {(this.props.menukey >= 6 && this.props.menukey <= 8) &&(
            <Link className={s.link} to="/LendBorrow">
            Order Book
        </Link>
      )}
      {(this.props.menukey >= 6 && this.props.menukey <= 8) &&(
            <Link className={s.link} to="/LendBorrow/agreements">
            Your Agreements
        </Link>
      )}

      {this.state.loggedIn && (localStorage.user ?  !JSON.parse(localStorage.user).adminLevel : true) && ( <Dropdown overlay={this.menu}>
    <a className="ant-dropdown-link" className={s.link}  href="#">
    <Icon type="appstore" /> <Icon type="down" />
    </a>
  </Dropdown>
      )}


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
            <Link className={s.link} onClick={this.logout} to="/login">
            &nbsp; <Icon type="logout" />&nbsp;
            </Link>
          )}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
