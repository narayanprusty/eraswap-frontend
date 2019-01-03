import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './p2p.css';
import { Card, Button,Table,Modal,Row,Col, Input } from 'antd';

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

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};


const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);


class BuyListTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      EST_VAL:{},
      BTC_VAL:{},
      ETH_VAL:{},
      data: [],
      pagination: {},
      loading: false,
      record:{},
      visible: false,
      confirmLoading: false,
    };
  }
  handleChange = e => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };

  showModal = (record) => {
    this.setState({
      visible: true,
      record:record,
    });
  }

  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    this.showInterest();
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }

  columns = [{
    title: 'Username',
    dataIndex: 'username',
    sorter: true,
    // render: name => `${name.first} ${name.last}`,
    width: '20%',
  }, {
    title: 'Payment Method',
    dataIndex: 'paymentMethod',
    width: '20%',
  }, {
    title: 'Price',
    dataIndex: 'fullPrice',
    render:(fieldVal,record)=> `${fieldVal} ${record.currency}/${record.cryptoCur ? record.cryptoCur : 'BTC'}`
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title:'Currency',
    dataIndex:'cryptoCur',
    render:(fieldVal,record)=> `${fieldVal ? fieldVal :'BTC'}`
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
      return (<Button type="primary" onClick={this.showModal.bind(this,record)} disabled={this.state[record.uniqueIdentifier] ? true : false}>Show Interest</Button>)
    }
  }];

  getCurrentBtcValue = (CUR = 'INR',cryptoCur) => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`);
    };

  showInterest =()=>{

   return axios.post('/apis/p2p/showInterest',{...this.state.record,askAmount:this.state.askAmount,specialMessage:this.state.message}).then(data=>{
    this.setState({
      [this.state.record.uniqueIdentifier]:true,
      visible:false,
      confirmLoading:false
    });
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
        if(countData.data)
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
      pagination.total = countData.data.count;
      let allData=[];

      for(let i of data.data){
        let BTCVAl ;
        if(i.fixedPrice){
          BTCVAl=i.fixedPrice
        }
        else if(this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][i.currency]){
          BTCVAl = this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][i.currency];
        }else{

          let awaitData =await this.getCurrentBtcValue(i.currency,i.cryptoCur ? i.cryptoCur : 'BTC');
          BTCVAl = awaitData.data.data;

          this.setState({
            [`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`]:{
              ...this.state[i.cryptoCur ? i.cryptoCur : 'BTC'],
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

  loadMyOwnInterests = ()=>{
    return axios.get('/apis/p2p/getMyOwnInterests').then(data=>{
      if(data && data.data){
        for(let i of data.data){
            this.setState({
              [i.listingId]:true
            })
        }
      }
    });
  };
  componentDidMount() {
    this.loadMyOwnInterests();
    this.fetch({wantsToBuy:this.props.sell||false }); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
  }
  componentWillReceiveProps(nextProps){

    this.fetch({wantsToBuy:nextProps.sell || false});
  }


  render() {
    return (
      <div>
      <Table
          style={{wordBreak:'break-word'}}
        columns={this.columns}
        rowKey={record => record._id}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
      <Modal title={this.state.record.headLine}
      visible={this.state.visible}
      onOk={this.handleOk}
      confirmLoading={this.state.confirmLoading}
      onCancel={this.handleCancel}
    >

    {/* <p style={s.pStyle}>List Details</p> */}
          <Row>
            <Col span={12}>
              <DescriptionItem title="User" content={this.state.record.username} />{' '}
            </Col>
            <Col span={12}>
              <DescriptionItem title="Location" content={this.state.record.location} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Payment Method" content={this.state.record.paymentMethod} />{' '}
            </Col>
            <Col span={12}>
              <DescriptionItem title="Price" content={this.state.record.fullPrice  +' '+ this.state.record.currency+'/'+(this.state.record.cryptoCur ?this.state.record.cryptoCur :'BTC')} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Minimum Amount" content= {this.state.record.minimum +' '+this.state.record.cryptoCur} />{' '}
            </Col>
            <Col span={12}>
              <DescriptionItem title="Maximum Amount" content={this.state.record.maximum+' '+this.state.record.cryptoCur} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Special Note" content= {this.state.record.note} />{' '}
            </Col>
          </Row>
          <Row>
            <label>Ask Amount: (Should Be grater or same of Minimum amount or otherwise less or same of maximum amount )</label><br />
            <Input
                type='number'
                placeholder="ask for amount"
                onChange={this.handleChange}
                min={this.state.record.minimum}
                max={this.state.record.maximum}
                addonAfter={this.state.record.cryptoCur || 'EST'}
                name="askAmount"
                  />
          </Row>
          <Row>
            <label>Special Message to {this.state.record.username}:</label><br />
          <Input.TextArea
                   rows={5}
                placeholder="Write a special Message"
                onChange={this.handleChange}
                name="message"
                  />
          </Row>

    </Modal>
   </div>
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
    sell: <BuyListTable />,
    buy: <BuyListTable sell={true} />,
  };
  render() {
    return (
      <div className={s.root}>
        <Card
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
