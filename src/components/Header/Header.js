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
  loginState = () => {
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
  };
  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation menukey={this.props.menukey} />
          <Link className={s.brand} to="/">
            <img
              src={logoUrl}
              srcSet={logoUrl}
              width="200"
              // height="65"
              alt="Eraswap"
            />
            {/* <span className={s.brandTxt}>ErasWap</span> */}
          </Link>
        </div>
        <div>
          <div className={s.banner}>
            {this.props.menukey == 0.002 && (
              <div>
                <h1 className={s.bannerTitle}>ComputeEx</h1>
                <p className={s.bannerDesc}>Welcome to EraSwap Control Panel</p>
              </div>
            )}
            {this.props.menukey == 0.1 && (
              <div>
                <h1 className={s.bannerTitle}>User Registration</h1>
                {/* <p className={s.bannerDesc}>ComputeEx Dashboard</p> */}
              </div>
            )}
            {this.props.menukey == 0.2 && (
              <div>
                <h1 className={s.bannerTitle}>User Login</h1>
                {/* <p className={s.bannerDesc}>ComputeEx Dashboard</p> */}
              </div>
            )}
            {this.props.menukey == 0.3 && (
              <div>
                <h1 className={s.bannerTitle}>Forgot Password</h1>
                {/* <p className={s.bannerDesc}>ComputeEx Dashboard</p> */}
              </div>
            )}
            {this.props.menukey == 0.4 && (
              <div>
                <h1 className={s.bannerTitle}>Resend Verification</h1>
                {/* <p className={s.bannerDesc}>ComputeEx Dashboard</p> */}
              </div>
            )}
            {this.props.menukey == 1 && (
              <div>
                <h1 className={s.bannerTitle}>ComputeEx</h1>
                <p className={s.bannerDesc}>ComputeEx Dashboard</p>
              </div>
            )}
            {this.props.menukey == 3 && (
              <div>
                <h1 className={s.bannerTitle}>Manage P2P</h1>
                <p className={s.bannerDesc}>Manage Your P2P Listings</p>
              </div>
            )}
            {this.props.menukey == 4 && (
              <div>
                <h1 className={s.bannerTitle}>P2P MarketPlace</h1>
                <p className={s.bannerDesc}>P2P Dash board</p>
              </div>
            )}
            {this.props.menukey == 5 && (
              <div>
                <h1 className={s.bannerTitle}>ComputeEx Wallets</h1>
                <p className={s.bannerDesc}>Wallet Dashboard</p>
              </div>
            )}
            {this.props.menukey == 6 && (
              <div>
                <h1 className={s.bannerTitle}>ComputeEx Lend & Borrow</h1>
                <p className={s.bannerDesc}>Place Order</p>
              </div>
            )}
            {this.props.menukey == 7 && (
              <div>
                <h1 className={s.bannerTitle}>Lend & Borrow</h1>
                <p className={s.bannerDesc}>Agreements</p>
              </div>
            )}
            {this.props.menukey == 8 && (
              <div>
                <h1 className={s.bannerTitle}>Lend & Borrow</h1>
                <p className={s.bannerDesc}>Order Book</p>
              </div>
            )}
            {this.props.menukey == 20.2 ||
              (this.props.menukey == 2 && (
                <div>
                  <h1 className={s.bannerTitle}>Transaction History</h1>
                  <p className={s.bannerDesc}>
                    ComputeEx & Wallet Exchange Transactions
                  </p>
                </div>
              ))}
            {this.props.menukey == 90.1 && (
              <div>
                <h1 className={s.bannerTitle}>Admin Dashboard</h1>
                <p className={s.bannerDesc}>admin control panel</p>
              </div>
            )}
            {this.props.menukey == 90.2 && (
              <div>
                <h1 className={s.bannerTitle}>All Users</h1>
                <p className={s.bannerDesc}>User Management</p>
              </div>
            )}
            {this.props.menukey == 90.3 && (
              <div>
                <h1 className={s.bannerTitle}>All P2P Matches</h1>
                <p className={s.bannerDesc}>P2P Management console</p>
              </div>
            )}
            {this.props.menukey == 90.4 && (
              <div>
                <h1 className={s.bannerTitle}>Escrow Management</h1>
                {/* <p className={s.bannerDesc}>P2P Management console</p> */}
              </div>
            )}
            {this.props.menukey == 90.5 && (
              <div>
                <h1 className={s.bannerTitle}>Escrow management console</h1>
                {/* <p className={s.bannerDesc}>P2P Management console</p> */}
              </div>
            )}
            {this.props.menukey == 90.6 && (
              <div>
                <h1 className={s.bannerTitle}>Gas Tank management console</h1>
                {/* <p className={s.bannerDesc}>P2P Management console</p> */}
              </div>
            )}
          </div>

          {
            //     this.state.loggedIn && !this.props.itsHome
            //   &&(
            //     <div style={{textAlign:"center"}}>
            //     <Menu
            //   onClick={this.handleClick}
            //   mode="horizontal"
            //   defaultSelectedKeys={this.props.menukey ? [this.props.menukey]:[]}
            //   style={{
            //     display:"inline-block",
            //     alignSelf:"center",
            //     backgroundColor:'transparent'
            //    }}
            // >
            //   <Menu.Item key="1">
            //     <Button type='primary'>
            //   <Link to='/ComputeEx'>ComputeEx</Link>
            //   </Button>
            //   </Menu.Item>
            //   {/* <Menu.Item key="2">
            //   <Button type='primary'>
            //   <Link to='/txnhistory'>Txn History</Link></Button>
            //   </Menu.Item> */}
            //   <Menu.Item key="3">
            //   <Button type='primary'>
            //   <Link to="/add_p2p_listing">
            //   Manage P2P Listing
            //   </Link></Button>
            //   </Menu.Item>
            //   <Menu.Item key="4">
            //   <Button type='primary'>
            //   <Link to="/p2p">
            //   P2P MarketPlace
            //   </Link></Button>
            //   </Menu.Item>
            //   </Menu>
            //   </div>
            //   )
          }

          {/* <div className={s.banner}>
         {this.props.menukey == 1 && (
             <div>
            <h1 className={s.bannerTitle}>ComputeEx</h1>
            <p className={s.bannerDesc}>ComputeEx Dashboard</p>
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



          </div> */}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
