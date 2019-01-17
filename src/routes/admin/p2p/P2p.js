import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Table,Tag,Button } from 'antd';
import s from './P2p.css';

class P2p extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({},{
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  backToSeller = (record)=>{
    const data ={
      matchId:record.uniqueIdentifier,
      listingId:record.listingId,
      owner:record.ownerUser,
      requester:record.requester,
      amount:record.amount,
      fee:record.fee,
      cryptoCurrency:record.cryptoCurrency
    }
    axios.post('/admins/apis/p2p/dispute/send_back_to_seller',data).then(data=>{
      return data;
    });
  }

  sendToBuyer = (record)=>{
    const data ={
      matchId:record.uniqueIdentifier,
      listingId:record.listingId,
      owner:record.ownerUser,
      requester:record.requester,
      amount:record.amount,
      cryptoCurrency:record.cryptoCurrency
    }
    axios.post('/admins/apis/p2p/dispute/send_to_buyer',data).then(data=>{
      return data;
    });
  }

  fetch = (query,params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/admins/apis/p2p/list_count').then(countData=>{
      if(countData.data)
    axios({
      url: '/admins/apis/p2p/list',
      params:{
        results:10,
        ...params,
        query:query
      },
      method: 'get',
      type: 'json',
    }).then(async(data) => {
      if(data.data){
      const pagination = { ...this.state.pagination };
      pagination.total = countData.data.totalCount.message

      this.setState({
        loading: false,
        data: data.data,
        pagination,
      });
    }
    });

  });
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
   this.fetch();
  }

  columns = [{
    title:'Listing Id',
    dataIndex:'listingId'
  },
  {
    title:'Amount',
    dataIndex:'amount'
  },
  {
    title:'Listing Owner',
    dataIndex:'ownerUser',
    render:(fieldval)=>{
      if(fieldval){
        return <div>{fieldval.username} <br /> {fieldval.email}</div>
        }else{
          return 'User does not exist.'
        }
    }
  },
  {
    title:'Requester',
    dataIndex:'requester',
    render:(fieldval)=>{
      if(fieldval){
      return <div>{fieldval.username} <br /> {fieldval.email}</div>
      }else{
        return 'User does not exist.'
      }

    }
  },
  {
    title:'Fee',
    dataIndex:'fee',
    render:(fieldval,record)=>{
      if(fieldval){
      return <div>{fieldval.toFixed(3)} / {record.feeCoin ? record.feeCoin :'-'}</div>
      }else{
        return <Tag color="volcano">Not Paid [Attention]</Tag>
      }

    }
  },
  ,{
    title:'Buyer Paid',
    dataIndex:"iPaidVal",
    align:'center',
    render: (fieldval,record)=>{
      if(fieldval == true){
      return <div><Tag color="green">Yes</Tag>&nbsp;<Button size='small' type='danger' onClick={this.backToSeller.bind(this,record)}  disabled={record.finished || record.sendToBuyer || record.backToSeller ? true :false} ghost> Send to seller</Button></div>
    }else{
      return <div><Tag color="volcano">No</Tag>&nbsp;<Button size='small' type='danger' onClick={this.backToSeller.bind(this,record)}  disabled={record.finished || record.sendToBuyer || record.backToSeller ? true :false} ghost> Send to seller</Button></div>
    }
  }
  },{
    title:'Seller Released',
    dataIndex:"finished",
    align:'center',
    render: (fieldval,record)=>{
      if(fieldval == true){
      return <div> <Tag color="green">Yes</Tag>&nbsp;<Button size='small' type='danger' onClick={this.sendToBuyer.bind(this,record)}  disabled={record.finished || record.sendToBuyer || record.backToSeller || !record.iPaidVal ? true :false} ghost> Send to Buyer</Button> </div>
    }else{
      return <div> <Tag color="volcano">No</Tag>&nbsp;<Button size='small' type='danger' onClick={this.sendToBuyer.bind(this,record)}  disabled={record.finished || record.sendToBuyer || record.backToSeller || !record.iPaidVal ? true :false} ghost> Send to Buyer</Button> </div>
    }
  }
  }
]

  render() {
    return (
      <div className={s.root}>
      <Card>
      <Table
        style={{overflowX: 'scroll'}}
      columns={this.columns}
      rowKey={record => record._id}
      dataSource={this.state.data}
      pagination={this.state.pagination}
      loading={this.state.loading}
      onChange={this.handleTableChange}
    />
    </Card>
    </div>
    )}
}


export default withStyles(s)(P2p);
