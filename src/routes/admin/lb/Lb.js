import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Table, Tag } from 'antd';
import s from './LB.css';

class Lb extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  fetch = (query, params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/admins/apis/lb/getCounts').then(countData => {
      if (countData.data)
        axios({
          url: '/admins/apis/lb/agreements',
          params: {
            results: 10,
            ...params,
            query: query,
          },
          method: 'get',
          type: 'json',
        }).then(async data => {
          if (data.data) {
            const pagination = { ...this.state.pagination };
            pagination.total = countData.data.total_A;

            this.setState({
              loading: false,
              data: data.data,
              pagination,
            });
          }
        });
    });
  };


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
    this.fetch();
  }

  columns = [
    {
      title: 'Lender',
      dataIndex: 'lender',
    },
    {
      title: 'Borrower',
      dataIndex: 'borrower',
    },
    {
      title: 'Coin',
      dataIndex: 'coin',
    },
    {
      title:'Collateral',
      dataIndex:'collateralCoin'
    },
    {
      title: 'Tenure',
      dataIndex: 'months',
      render:(fieldVal)=>{
          return fieldVal  ? fieldVal+' M' : '-'
      }
    },
    {
      title:'Amount',
      dataIndex:'amount'
    },
    {
      title: 'Interest %',
      dataIndex: 'interest',
    }, {
      title:'EMI',
      dataIndex:'emi',
      render:(fieldVal)=>{
        return fieldVal ? fieldVal.toFixed(10) : 0;
      }
    },{
      title: 'Status',
      dataIndex:'active',
      render:(fieldVal)=>{
        return fieldVal == true ? <Tag color="green">Active</Tag> :  <Tag color="red">InActive</Tag>
      }
    },{
      title:'Date',
      dataIndex:'agreementDate',
      render:(fieldVal)=>{
        return fieldVal ? new Date(fieldVal).toDateString() : '-'
      }
    },
    {
      title:'Next Repayment',
      dataIndex:'nextPaymentDate',
      render:(fieldVal)=>{
        return fieldVal ? new Date(fieldVal).toDateString() : '-'
      }
    }
  ];

  render() {
    return (
      <div className={s.root}>
        <Card>
          <Table
             style={{wordWrap:'break-word'}}
            columns={this.columns}
            rowKey={record => record._id}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(Lb);
