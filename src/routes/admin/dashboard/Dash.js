import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Row, Col, Icon } from 'antd';
import s from './Dash.css';

class Dash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    fetchDetails = () => {
        axios.get('/admins/apis/users/dash').then(data => {
            if (data.data) {
                this.setState(data.data);
            }
        });
    };

    fetchlb = () => {
        axios.get('/admins/apis/lb/getCounts').then(data => {
            if (data.data) {
                this.setState(data.data);
            }
        });
    };

    fetchGasTankDetails = () => {
        axios.get('/admins/apis/gasTank/getDetails').then(data => {
            if (data.data) {
                this.setState({
                    gasTankBalance: data.data.balance
                });
            }
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
        this.fetchlb();
        this.fetchGasTankDetails();
    }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Card style={{ margin: '20px 0 ', textAlign: 'center' }}>
            <Row style={{ margin: '20px 0 ', textAlign: 'center' }}>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="Users"
                  actions={[
                    <Link to="/admin/users">
                      <Icon type="setting"> Manage Users</Icon>{' '}
                    </Link>,
                  ]}
                >
                  Users:{' '}
                  {this.state.users
                    ? this.state.users.totalUser - this.state.users.admin
                    : 'Loading...'}{' '}
                  <br />
                  Admins:{this.state.users
                    ? this.state.users.admin
                    : 'Loading...'}{' '}
                  <br />
                  Total:{' '}
                  {this.state.users ? this.state.users.totalUser : 'Loading...'}
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="ComputeEx Txns"
                  actions={[
                    <Link to="/admin/txns">
                      <Icon type="setting"> View Transactions</Icon>
                    </Link>,
                  ]}
                >
                  Finished:{this.state.txns
                    ? this.state.txns.finished
                    : 'Loading...'}{' '}
                  <br />
                  in Process:{this.state.txns
                    ? this.state.txns.total - this.state.txns.finished
                    : 'Loading...'}{' '}
                  <br />
                  Total:{' '}
                  {this.state.txns ? this.state.txns.total : 'Loading...'}
                </Card>{' '}
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="P2P Matches"
                  actions={[
                    <Link to="/admin/p2p">
                      <Icon type="setting"> View Matches</Icon>
                    </Link>,
                  ]}
                >
                  Active Listings:{' '}
                  {this.state.p2p
                    ? this.state.p2p.active.message
                    : 'Loading...'}{' '}
                  <br />
                  Inactive Listings:{' '}
                  {this.state.p2p
                    ? this.state.p2p.total.message -
                      this.state.p2p.active.message
                    : 'Loading...'}{' '}
                  <br />
                  Matched :{this.state.p2p
                    ? this.state.p2p.match.message
                    : 'Loading...'}
                  <br />
                  Total Listing:{' '}
                  {this.state.p2p ? this.state.p2p.total.message : 'Loading...'}
                </Card>{' '}
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="Escrow Balances"
                  actions={[
                    <Link to="/admin/escrow">
                      <Icon type="setting">Manage Escrow</Icon>
                    </Link>,
                  ]}
                >
                  ETH :{' '}
                  {this.state.escrow ? this.state.escrow.eth.error ||  this.state.escrow.eth : 'Loading...'}{' '}
                  <br />
                  EST:{' '}
                  {this.state.escrow
                    ? this.state.escrow.est.error || this.state.escrow.est
                    : 'Loading...'}{' '}
                  <br />
                  BTC:{' '}
                  {this.state.escrow
                    ? this.state.escrow.btc.error || this.state.escrow.btc
                    : 'Loading...'}{' '}
                  <br />
                </Card>
              </Col>
            </Row>
            <Row style={{ margin: '20px 0 ', textAlign: 'center' }}>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="Lend & Borrow"
                  actions={[
                    <Link to="/admin/lb">
                      <Icon type="setting">Lend & Borrow</Icon>
                    </Link>,
                  ]}
                >
                  Lend Requests :{' '}
                  {this.state.total_L ? this.state.total_L : 'Loading...'}{' '}
                  <br />
                  Borrow Requests:{' '}
                  {this.state.total_LB
                    ? this.state.total_LB - this.state.total_L
                    : 'Loading...'}{' '}
                  <br />
                  Total:{' '}
                  {this.state.total_LB
                    ? this.state.total_LB
                    : 'Loading...'}{' '}
                  <br />
                  Agreements:{' '}
                  {this.state.total_A ? this.state.total_A : 'Loading...'}{' '}
                  <br />
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1em' }}
                  title="Gas Tank"
                  actions={[
                    <Link to="/admin/gasTank">
                      <Icon type="setting">View transactions</Icon>
                    </Link>,
                  ]}
                >
                  Balance :{' '}
                  {this.state.gasTankBalance ? this.state.gasTankBalance : 'Loading...'}
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Dash);
