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
import { Icon, Dropdown, Menu, Button } from 'antd';

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
        <Link to="/ComputeEx">
          <Icon type="database" theme="twoTone" /> &nbsp;ComputeEx
        </Link>
      </Menu.Item>

      <SubMenu
        title={
          <span>
            <i className="fas fa-users" />&nbsp;P2P Buy/Sell
          </span>
        }
      >
        <Menu.Item key="3">
          <Link to="/add_p2p_listing">
            <Icon type="setting" />&nbsp; Manage P2P Listing
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/p2p">
            <Icon type="notification" />&nbsp; P2P MarketPlace
          </Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        title={
          <span>
            <i className="fas fa-wallet" />&nbsp;Wallets
          </span>
        }
      >
        <Menu.Item key="5">
          <Link to="/wallet/BTC">
            <i className="fab fa-bitcoin" />
            &nbsp; Bitcoin
          </Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/wallet/ETH">
            <i className="fab fa-ethereum" />
            &nbsp; Ethereum
          </Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/wallet/EST">
            <i className="fab fa-ethereum" />
            &nbsp; EST Token
          </Link>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="8" disabled>
        <Link to="/LendBorrow">
          <Icon type="usergroup-add" theme="twoTone" />&nbsp;Lend {'&'} Borrow
        </Link>
      </Menu.Item>
    </Menu>
  );
  componentDidMount() {
    this.loginStateSet();
  }

  loginStateSet = () => {
    if (localStorage.getItem('user') && localStorage.getItem('user').length) {
      this.setState({
        admin: JSON.parse(localStorage.getItem('user')).admin || false,
        adminLevel: JSON.parse(localStorage.getItem('user')).adminLevel || null,
      });
    }
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('token').length > 0
    ) {
      const unparsedUser = localStorage.getItem('user');
      const userName = JSON.parse(unparsedUser).username;
      const userEmail = JSON.parse(unparsedUser).email;

      this.setState({
        loggedIn: true,
        userName: userName,
        userEmail: userEmail,
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  };

  logout = () => {
    localStorage.clear();
    this.setState({
      loggedIn: false,
      admin: false,
    });
    return true;
    // location.href = '/login';
  };
  render() {
    return (
      <div className={s.root} role="navigation">
        {this.props.menukey == 3 && (
          <Link className={s.link} to="/p2p">
            P2P Marketplace
          </Link>
        )}
        {this.props.menukey == 4 && (
          <Link className={s.link} to="/add_p2p_listing">
            Manage Your Listings
          </Link>
        )}
        {this.props.menukey >= 6 &&
          this.props.menukey <= 8 && (
            <Link className={s.link} to="/LendBorrow/placeOrder">
              Place Order
            </Link>
          )}
        {this.props.menukey >= 6 &&
          this.props.menukey <= 8 && (
            <Link className={s.link} to="/LendBorrow">
              Order Book
            </Link>
          )}
        {this.props.menukey >= 6 &&
          this.props.menukey <= 8 && (
            <Link className={s.link} to="/LendBorrow/agreements">
              Your Agreements
            </Link>
          )}
        {this.state.admin && (
          <Button
            type="primary"
            style={{ marginRight: '10px', marginLeft: '1em' }}
            ghost
          >
            <i className="fas fa-tachometer-alt" />
            <Link className={s.link} style={{ marginRight: '0px' }} to="/admin">
              Admin Dashboard
            </Link>
          </Button>
        )}
        {this.state.loggedIn &&
          (localStorage.user
            ? !JSON.parse(localStorage.user).adminLevel
            : true) && (
            <Dropdown overlay={this.menu}>
              <a
                className="ant-dropdown-link"
                style={{ marginRight: '4px' }}
                className={s.link}
                href="#"
              >
                <Icon type="appstore" /> <Icon type="down" />
              </a>
            </Dropdown>
          )}
        {!this.state.loggedIn && (
          <Button type="dashed">
            <i className="fas fa-sign-in-alt" />&nbsp;
            <Link className={s.link} to="/login?how=force">
              Login
            </Link>
          </Button>
        )}
        &nbsp;&nbsp;
        {!this.state.loggedIn && (
          <Button type="default">
            <i className="fas fa-user-plus" />
            <Link className={s.link} to="/register">
              Sign up
            </Link>
          </Button>
        )}
        {this.state.loggedIn && (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <Icon type="user" /> &nbsp;{' '}
                  {this.state.userName ? this.state.userName : '-'}
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="mail" /> &nbsp;{' '}
                  {this.state.userEmail ? this.state.userEmail : '-'}
                </Menu.Item>
                <Menu.Item key="3" onClick={this.logout}>
                  <Link
                    className={s.link}
                    style={{ marginRight: '0px' }}
                    onClick={this.logout}
                    to="/login?how=loggedOut"
                  >
                    <Icon type="logout" /> &nbsp;Logout
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link"
              style={{ marginRight: '4px' }}
              className={s.link}
              href="#"
            >
              <Icon type="profile" theme="filled" /> <Icon type="down" />
            </a>
          </Dropdown>
        )}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
