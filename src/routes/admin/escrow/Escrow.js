import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Spin, Select, Divider, Input, Button, notification } from 'antd';
import s from './Escrow.css';
const Option = Select.Option;

class Escrow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  fetchDetails = (crypto = 'EST') => {
    delete this.state.depositAddress;
    delete this.state.balance;
    axios.get('/admins/apis/escrow/getDetails?crypto=' + crypto).then(data => {
      if (data.data) {
        this.setState({
          depositAddress: data.data.address,
          balance: data.data.balance,
          currency: crypto,
        });
      }
    });
  };
  withdrawProcess = async () => {
    this.setState({ loader: true });
    const data = {
      crypto: this.state.currency,
      toAddress: this.state.address,
      amount: this.state.amount,
    };
    axios.post('/admins/apis/escrow/send', data).then(data => {
      this.setState({ loader: false });
      if (data.data) {
        notification.open({
          message: 'Sent successfully.',
        });
      }
    });
  };
  handleState = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  componentDidMount() {
    if (
      localStorage &&
      localStorage.user &&
      JSON.parse(localStorage.user).admin == false
    ) {
      location.href = '/';
    } else if (!localStorage.length || !localStorage.user) {
      localStorage.clear();
      location.href = '/login?how=force';
    }
    this.fetchDetails();
  }

  handleChange(value) {
    this.fetchDetails(value);
    this.setState({
      currency: value,
    });
  }

  render() {
    return (
      <div className={s.root}>
        <Card style={{ textAlign: 'center' }}>
          <label>Select Currency: </label>
          <Select
            defaultValue="EST"
            style={{ width: 120 }}
            onChange={this.handleChange.bind(this)}
          >
            <Option value="EST">EST</Option>
            <Option value="ETH">ETH</Option>
            <Option value="BTC">BTC</Option>
          </Select>
          <br />
          <br />
          Deposit Address :{' '}
          <code>
            {' '}
            {this.state.depositAddress
              ? this.state.depositAddress
              : 'Loading...'}
          </code>
          <br />
          Balance:{' '}
          <code> {this.state.balance ? this.state.balance : 'Loading...'}</code>
          <Divider>Withdrawal</Divider>
          <Input
            name="amount"
            value={this.state.amount}
            placeholder="Enter the amount to send"
            onChange={this.handleState.bind(this)}
            style={{ width: '25%', marginRight: '3%' }}
          />
          <Input
            name="address"
            placeholder={'Enter an ' + this.state.currency + ' Address'}
            value={this.state.address}
            onChange={this.handleState.bind(this)}
            style={{ width: '25%', marginRight: '3%' }}
          />
          {!this.state.loader && (
            <Button
              type="primary"
              onClick={this.withdrawProcess.bind(this)}
              disabled={
                this.state.currency && this.state.address && this.state.amount
                  ? false
                  : true
              }
            >
              Send
            </Button>
          )}
          {this.state.loader && <Spin size="large" />}
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(Escrow);
