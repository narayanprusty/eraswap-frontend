import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './p2p.css';
import { Card, Button } from 'antd';

const tabListNoTitle = [
  {
    key: 'buy',
    tab: 'Buy Listing',
  },
  {
    key: 'sell',
    tab: 'Sell Listing',
  },
];

class P2p extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'buy',
      noTitleKey: 'buy',
    };
  }
  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };
  contentListNoTitle = {
    buy: <div>Hii this is buy listing</div>,
    sell: <div>Hii this is sell listing</div>,
  };
  render() {
    return (
      <div className={s.root}>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, 'noTitleKey');
          }}
        >
          {this.contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(P2p);
