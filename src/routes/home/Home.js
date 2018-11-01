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

          <Card style={{ margin: '20px 0 '}}>
            <Row style={{ margin: '20px 0 '}}>
            <Col span={6}>
                <Button size="large">
                <Link to="/wallet">
                <Icon type="wallet" theme="twoTone" twoToneColor="#eb2f96" />
                 &nbsp;
                  Wallet</Link>
                </Button>
              </Col>
              <Col span={6}>
                <Button size="large">
                <Link to="/computex">
                <Icon type="database" theme="twoTone" twoToneColor="#eb2f96" />&nbsp;
                Computex</Link>
                </Button>
              </Col>
              <Col span={6}>
                <Button size="large">
                <Link to="/p2p">
                <Icon type="swap" theme="twoTone" twoToneColor="#eb2f96" />&nbsp;
                P2P</Link>
                </Button>
              </Col>
              <Col span={6}>
                <Button size="large">
                <Link to="/LandB">
                <Icon type="usergroup-delete" theme="twoTone" twoToneColor="#52c41a" />&nbsp;
                lending and borrowing</Link>
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(newsQuery))(Home);
