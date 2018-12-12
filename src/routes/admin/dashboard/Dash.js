import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import { Card, Row, Col, Icon } from 'antd';
import s from './Dash.css';

class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  fetchDetails = ()=>{
    axios.get('/admins/apis/users/dash').then(data=>{
      if(data.data){
        this.setState(data.data);
      }
    })
  }

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

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Card style={{ margin: '20px 0 ' }}>
            <Row style={{ margin: '20px 0 ' }}>
              <Col span={6}>
                <Card
                  style={{ margin: '1.5em' }}
                  title="Users"
                  actions={[<Icon type="setting">Manage Users</Icon>]}
                >
                  Users: { this.state.users ? (this.state.users.totalUser - this.state.users.admin) : 'Loading...'} <br />
                  Admins:{this.state.users ? this.state.users.admin :'Loading...'} <br />
                  Total: {this.state.users ? this.state.users.totalUser : 'Loading...'}
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1.5em' }}
                  title="ComputeX Txns"
                  actions={[<Icon type="setting">View Transactions</Icon>]}
                >
                  Finished:{this.state.txns ? this.state.txns.finished : 'Loading...'} <br />
                  in Process:{this.state.txns ? (this.state.txns.total- this.state.txns.finished ): 'Loading...'} <br />
                  Total: {this.state.txns ? this.state.txns.total : 'Loading...'}
                </Card>{' '}
              </Col>
              <Col span={6}>
                <Card style={{ margin: '1.5em' }} title="P2P Matches">
                  Active Listings: {this.state.p2p ? this.state.p2p.active.message : 'Loading...'} <br />
                  Inactive Listings: {this.state.p2p ? (this.state.p2p.total.message - this.state.p2p.active.message) : 'Loading...'} <br />
                  Matched :{this.state.p2p ? this.state.p2p.match.message : 'Loading...'}<br />
                  Total Listing: {this.state.p2p ? this.state.p2p.total.message : 'Loading...'}
                </Card>{' '}
              </Col>
              <Col span={6}>
                <Card
                  style={{ margin: '1.5em' }}
                  title="Escrow Balances"
                  actions={[<Icon type="setting">Manage Escrow</Icon>]}
                >
                  ETH : {this.state.escrow ? this.state.escrow.eth: 'Loading...'}  <br />
                  EST: {this.state.escrow ? this.state.escrow.est: 'Loading...'} <br />
                  BTC: {this.state.escrow ? this.state.escrow.btc: 'Loading...'} <br />
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
