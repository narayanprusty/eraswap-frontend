import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Table, Tag, Input, Icon } from 'antd';
import QrCode from 'qrcode.react';
import s from './GasTank.css';
const Column = Table.Column;

class GasTank extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        gasTankPublicKey: "",
    };
  }

  fetch = (query, params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/admins/apis/GasTank/getTxnCount').then(countData => {
      if (countData.data)
        axios({
          url: '/admins/apis/GasTank/getTxn',
          params: {
            results: 10,
            ...params,
            query: query,
          },
          method: 'get',
          type: 'json',
        }).then(async res => {
          if (res.data) {
            const pagination = { ...this.state.pagination };
            pagination.total = countData.data.count;
            console.log(res.data.txns);
            this.setState({
              loading: false,
              data: res.data.txns,
              pagination,
            });
          }
        });
    });
  };

  fetchPublicKey = () => {
    axios.get('/admins/apis/GasTank/getDetails').then(details => {
        this.setState({gasTankPublicKey: details.data.publicKey});
    });
  }


  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch(
      {},
      {
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      },
    );
  };

  copyToClipboard = text => {
    var dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
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
    this.fetchPublicKey();
    this.fetch();
  }

  render() {
    return (
        <div className={s.root}>
            <center>
                <h3>Public Key</h3>
                <QrCode value={this.state.gasTankPublicKey} />
                <br />
                <br />
                <Input.Search
                    style={{ maxWidth: '45.2%' }}
                    size="large"
                    value={this.state.gasTankPublicKey}
                    enterButton={<Icon type="copy" />}
                    onSearch={value => {
                    this.copyToClipboard(value);
                    }}
                    disabled={true}
                />
            </center>
            <br />
            <Card>
                <Table
                    style={{overflowX: 'scroll'}}
                    rowKey={record => record._id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                >
                    <Column
                    title="Receiver"
                    dataIndex="txn.receiver"
                    key="txn.receiver"
                    />
                    <Column
                    title="Amount"
                    dataIndex="txn.amount"
                    key="txn.amount"
                    />
                    <Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    />
                    <Column
                    title="Transaction Hash"
                    dataIndex="txnHash"
                    key="txnHash"
                    />
                </Table>
            </Card>
        </div>
    );
  }
}

export default withStyles(s)(GasTank);
