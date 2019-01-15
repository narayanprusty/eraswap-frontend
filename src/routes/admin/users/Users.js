import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Table, Icon,Tag,List,Button } from 'antd';
import s from './Users.css';

class Users extends React.Component {
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
  fetch = (query,params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/admins/apis/users/list_count').then(countData=>{
      if(countData.data)
    axios({
      url: '/admins/apis/users/list',
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
      pagination.total = countData.data.totalCount

      this.setState({
        loading: false,
        data: data.data,
        pagination,
      });
    }
    });

  });
  }

  makeadmin =(record)=>{
    const data= {
      id:record._id
    };
    axios.post('/admins/apis/users/make_admin',data).then(data=>{
      if(data.data){
        this.setState({
          [record._id]:true
        })
      }else{
        console.log('Unknown error');
      }
    });
  }
  revokeadmin =(record)=>{
    const data= {
      id:record._id
    };
    axios.post('/admins/apis/users/revoke_admin',data).then(data=>{
      if(data.data){
        this.setState({
          [`${record._id}_revoke`]:true
        })
      }else{
        console.log('Unknown error');
      }
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
    title:'Username',
    dataIndex:'username'
  },{
    title:'Email',
    dataIndex:'email'
  },{
    title:'Is Admin',
    dataIndex:"admin",
    render: (fieldval,record)=>{
      if(fieldval == true){
      return <div><Tag color="green">Admin</Tag> | <Button type='danger' size='default' onClick={this.revokeadmin.bind(this,record)} disabled={this.state[`${record._id}_revoke`] ? true :false} ghost> Revoke Access</Button></div>
    }else{
      return <Button type='primary' size='success' onClick={this.makeadmin.bind(this,record)} disabled={this.state[record._id] ? true :false} ghost> Make admin</Button>
    }
  }
  }]

  conVertObjToArr =(wholeObj)=>{
    let b = [];
    for(let i of wholeObj.walletsDetails){
      b.push({
        title:`${i.currency} Address`,
        content: i.address
      });
      b.push({
        title:`${i.currency} Balance`,
        content: i.balance
      });
    }
    return b;
 };
  render(){
    return(
      <div className={s.root}>
      <Card>
      <Table
         style={{wordWrap:'break-word'}}
      columns={this.columns}
      rowKey={record => record._id}
      dataSource={this.state.data}
      expandedRowRender={record => (
        <List
        // grid={{ gutter: 16, column: 4 }}
        itemLayout="horizontal"
        dataSource={this.conVertObjToArr(record)}
        renderItem={item => (
          <List.Item
          >
            <List.Item.Meta
            title={item.title}
             />
            {item.content}
          </List.Item>
        )}
        />
      )}
      pagination={this.state.pagination}
      loading={this.state.loading}
      onChange={this.handleTableChange}
    />
    </Card>
    </div>
    )
  }

}


export default withStyles(s)(Users);
