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
import s from './Footer.css';
import Link from '../Link';

class Footer extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
         <span className={s.text}>© Eraswap</span>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/">
            Home
          </Link>
           <span className={s.spacer}>·</span>
          <Link className={s.link} to="/wallet">
            ComputeEx Wallet
          </Link>
           <span className={s.spacer}>·</span>
          <Link className={s.link} to="/ComputeEx">
            OTC Exchange
          </Link>
           <span className={s.spacer}>·</span>
          <Link className={s.link} to="/p2p">
            ComputeEx P2P
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/LendBorrow">
            ComputeEx L & B
          </Link>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/privacy">
            Privacy
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
