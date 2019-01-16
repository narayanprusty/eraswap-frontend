import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AllWallets.css';
import { Button, Slider, Row, Col, Card, Icon, Steps } from 'antd';
import Link from '../../components/Link';
import bitcoinSvg from './bitcoin.svg';
import ethereumSvg from './ethereum.svg';
import estSvg from './chip.svg';

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

          <Card style={{ margin: '20px 10px '}}>
            <Row type="flex" justify="space-around" style={{ margin: '20px 0 '}}>
            <Col span={7}>
            <div className={s.dashIcon}>
                <Link to="/wallet/Btc">
                {/* <Icon type="wallet" theme="twoTone" className={s.icoStyle} /> */}
                <img src={bitcoinSvg} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>Bitcoin</span><br /><br />
                <span className={s.icoDes}>Sample Text Sample Text Sample Text Sample Text </span>
                </Link>
         </div>
              </Col>
              <Col span={7}>
              <div className={s.dashIcon}>
                <Link to="/wallet/Eth">
                {/* <Icon type="database" theme="twoTone"  className={s.icoStyle} /> */}
                <img src={ethereumSvg} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>Ethereum</span><br /><br />
                <span className={s.icoDes}>Sample Text Sample Text Sample Text Sample Text </span>
                </Link>
                </div>
              </Col>
              <Col span={7}>
              <div className={s.dashIcon}>
                <Link to="/wallet/Est">
                {/* <Icon type="swap" theme="twoTone" className={s.icoStyle} /> */}
                <img src={estSvg} className={s.icoStyle} />
                <br />
                <br />
                <span className={s.icoBullet}>EST Token</span><br /><br />
                <span className={s.icoDes}>Sample Text Sample Text Sample Text Sample Text </span>
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

export default withStyles(s)(AllWallets);
