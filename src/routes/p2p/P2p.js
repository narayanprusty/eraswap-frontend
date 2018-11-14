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


class BuyListTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      BTC_VAL:{},
      data: [],
      pagination: {},
      loading: false,
    };
  }

  columns = [{
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
  },{
    title:'',
    dataIndex: 'operation',
    render:(fieldVal,record)=>{
      return (<Button type="primary" onClick={this.showInterest.bind(this,record)} disabled={this.state[record._id] ? true : false}>Show Interest</Button>)
    }
  }];

  getCurrentBtcValue = (CUR = 'INR') => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}`);
    };

  showInterest =(record)=>{
    this.setState({
      [record._id]:true
    });
   return axios.post('/apis/p2p/showInterest',record).then(data=>{
      return true;
   })
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
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      debugger;
      pagination.total = countData.data.count;
      let allData=[];

      for(let i of data.data){
        let BTCVAl ;
        if(i.fixedPrice){
          BTCVAl=i.fixedPrice
        }
        else if(this.state.BTC_VAL[i.currency]){
          BTCVAl = this.state.BTC_VAL[i.currency];
        }else{

          let awaitData =await this.getCurrentBtcValue(i.currency);
          BTCVAl = awaitData.data.data;

          this.setState({
            BTC_VAL:{
              ...this.state.BTC_VAL,
              [i.currency]:BTCVAl,
            }
          })

        }
        this.setState
          i.fullPrice=BTCVAl;
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

    this.fetch({wantsToBuy:this.props.sell||false }); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
  }
  componentWillReceiveProps(nextProps){

    this.fetch({wantsToBuy:nextProps.sell || false});
  }


  render() {
    return (
      <Table
        columns={this.columns}
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
