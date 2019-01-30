import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AllWallets.css';
import { Row, Col, Card } from 'antd';
import Link from '../../components/Link';
import ethSvg from './ETH.svg';
import btcSvg from './BTC.svg';

class AllWallets extends React.Component {
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
              <center>
                <Row
                type="flex"
                justify="space-around"
                >
                <Col span={8}>
                    <div className={s.dashIcon}>
                    <Link to="/wallet/BTC">
                        {/* <Icon type="wallet" theme="twoTone" className={s.icoStyle} /> */}
                        <img src={btcSvg} className={s.icoStyle} />
                        <br />
                        <br />
                        <span className={s.icoBullet}>Bitcoin</span>
                        <br />
                    </Link>
                    </div>
                </Col>
                <Col span={8}>
                    <div className={s.dashIcon}>
                    <Link to="/wallet/ETH">
                        {/* <Icon type="database" theme="twoTone"  className={s.icoStyle} /> */}
                        <img src={ethSvg} className={s.icoStyle} />
                        <br />
                        <br />
                        <span className={s.icoBullet}>Ethereum</span>
                        <br />
                    </Link>
                    </div>
                </Col>
                <Col span={8}>
                    <div className={s.dashIcon}>
                    <Link to="/wallet/EST">
                        {/* <Icon type="swap" theme="twoTone" className={s.icoStyle} /> */}
                        <img src={ethSvg} className={s.icoStyle} />
                        <br />
                        <br />
                        <span className={s.icoBullet}>EST Token</span>
                        <br />
                    </Link>
                    </div>
                </Col>
                </Row>
              </center>
          </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(AllWallets);
