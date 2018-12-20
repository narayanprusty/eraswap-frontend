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
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import newsQuery from './news.graphql';
import s from './Home.css';
import { Button, Slider, Row, Col, Card, Icon, Steps } from 'antd';
import Link from '../../components/Link';
import walletSvg from './wallet.svg';
import peerSvg  from './peer.svg';
import ComputeEx from './computex.svg';
import lendingSvg from './lending.svg'
const { Step } = Steps;

class Home extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      news: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          content: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>

          <Card>
            <Row>
            <Col span={6}>
            <div className={s.dashIcon}>
                <Link to="/wallet">
                {/* <Icon type="wallet" theme="twoTone" className={s.icoStyle} /> */}
                <img src={walletSvg} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>Wallet </span><br />
                <span className={s.icoDes}>Powerup your wallet. by using eraswap wallet</span>
                </Link>
         </div>
              </Col>
              <Col span={6}>
              <div className={s.dashIcon}>
                <Link to="/ComputeEx">
                {/* <Icon type="database" theme="twoTone"  className={s.icoStyle} /> */}
                <img src={ComputeEx} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>ComputeEx</span><br />
                <span className={s.icoDes}>Now use exchanges in smart way</span>

                </Link>
                </div>
              </Col>
              <Col span={6}>
              <div className={s.dashIcon}>
                <Link to="/p2p">
                {/* <Icon type="swap" theme="twoTone" className={s.icoStyle} /> */}
                <img src={peerSvg} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>P2P</span><br />
                <span className={s.icoDes}>Exchanging your assets never been so easy</span>
                </Link>
                </div>
              </Col>
              <Col span={6}>
              <div className={s.dashIcon}>
                <Link to="/LendBorrow">
                {/* <Icon type="usergroup-add" theme="twoTone" className={s.icoStyle} /> */}
                <img src={lendingSvg}  className={s.icoStyle} />
                <br />
                 <br />
                <span className={s.icoBullet}>Lending and Borrowing</span><br />
                <span className={s.icoDes} >Lend and Borrow Your Assets</span>
                </Link>
               </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(newsQuery))(Home);
