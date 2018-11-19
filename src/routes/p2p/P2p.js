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
      BTC_VAL:{},
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
    render:(fieldVal,record)=> `${fieldVal} ${record.currency}/BTC`
  },
  {
    title: 'Location',
    dataIndex: 'location',
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
      return (<Button type="primary" onClick={this.showModal.bind(this,record)} disabled={this.state[record._id] ? true : false}>Show Interest</Button>)
    }
  }];

  getCurrentBtcValue = (CUR = 'INR') => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}`);
    };

  showInterest =()=>{

   return axios.post('/apis/p2p/showInterest',{...this.state.record,specialMessage:this.state.message}).then(data=>{
    this.setState({
      [this.state.record._id]:true,
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
      <div>
      <Table
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
              <DescriptionItem title="Price" content={this.state.record.fullPrice  +' '+ this.state.record.currency+"/BTC"} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Minimum Amount" content= {this.state.record.minimum} />{' '}
            </Col>
            <Col span={12}>
              <DescriptionItem title="Maximum Amount" content={this.state.record.maximum} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Special Note" content= {this.state.record.note} />{' '}
            </Col>
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
    buy: <BuyListTable />,
    sell: <BuyListTable sell={true} />,
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
