import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './p2p.css';
import { Card, Button,Table } from 'antd';

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

const getCurrentBtcValue = (CUR = 'INR') => {
return axios
    .get(`/apis/cur/current_BTC?currency=${CUR}`);
};
const columns = [{
  title: 'Username',
  dataIndex: 'username',
  sorter: true,
  // render: name => `${name.first} ${name.last}`,
  width: '20%',
}, {
  title: 'payment Method',
  dataIndex: 'paymentMethod',
  width: '20%',
}, {
  title: 'Price',
  dataIndex: 'fullPrice',
  render:(fieldVal,record)=> `${fieldVal} ${record.currency}/BTC`
},
{
  title: 'Maximum Limit',
  dataIndex: 'maximum',
},
{
  title: 'Minimum Limit',
  dataIndex: 'minimum',
}];

class BuyListTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
    };
  }


  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({ wantsToBuy:this.props.sell || false},{

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

    axios.get('/apis/p2p/get_count',{
      params:query
    })
      .then(countData=>{
        debugger;
    axios({
      url: '/apis/p2p/search_listing',
      params:{
        results:10,
        ...params,
        query:query
      },
      method: 'get',
      type: 'json',
    }).then(async(data) => {
      debugger;
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 15 || countData.data.count;
      let allData=[];

      for(let i of data.data){
        const BTCVAl = await getCurrentBtcValue(i.currency)
        i.fullPrice=BTCVAl.data.data;
          allData.push(i)
      }
      this.setState({
        loading: false,
        data: allData,
        pagination,
      });
    });
  });
  }

  componentDidMount() {
    debugger;
    this.fetch({wantsToBuy:this.props.sell||false }); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
  }
  componentWillReceiveProps(nextProps){
    debugger;
    this.fetch({wantsToBuy:nextProps.sell || false});
  }


  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record._id}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

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
    buy: <BuyListTable />,
    sell: <BuyListTable sell={true} />,
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
