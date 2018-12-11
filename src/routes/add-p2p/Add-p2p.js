import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './Add-p2p.css';
import { Card, Form, Input, Button, Select, Radio,Table,List } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const tabListNoTitle = [
  {
    key: 'buy',
    tab: 'Add Buy Listing',
  },
  {
    key: 'sell',
    tab: 'Add Sell Listing',
  },
  {
    key: 'myList',
    tab: 'All My Listing',
  },{
    key:'myRequests',
    tab:'Sent Requests'
  }
];

class BuyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaymentInputBox: false,
      atPrice: '',
    };
  }
  componentDidMount = () => {
    axios
    .get('/apis/ping')
    .then(data => {
      if (data && data.data) {
        console.log('Everything is fine bro');
      }
    });
    // this.getCurrentBtcValue();
  };
  // componentDidUpdate=()=>{
  //   if(this.state.currency){
  //     this.getCurrentBtcValue(this.state.currency);
  //   }
  // }
  getCurrentBtcValue = (CUR = 'INR',cryptoCur) => {
    axios
      .get(`/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`)
      .then(data => {
        if (data && data.data) {
          this.setState({
            currentBtc: data.data.data,
          });
        } else {
          //there is some status code error check and send notification accordingly
        }
      })
      .catch(error => {
        console.log(error);
        //throw a notifiation cannot connect or something
      });
  };
  handleSubmit = e => {
    e.preventDefault();
    //cryptoCur is the crypto attribute
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', JSON.stringify(values));
        this.setState(values);
        if (this.props.sell) {
          //create sell listing here
          axios.post('/apis/p2p/add_sell_listing', values).then(data => {
            if (data) {
              console.log(data.data);
              location.href = '/p2p';
            } else {
              console.log(data);
            }
          });
        } else {
          //create buy listing here
          axios.post('/apis/p2p/add_buy_listing', values).then(data => {
            if (data) {
              console.log(data.data);
              location.href = '/p2p';
            } else {
              console.log(data);
            }
          });
        }
      }
    });
  };
  onRadioChange = value => {
    this.setState({
      atPrice: value.target.value,
    });
  };
  handleSelectChange1st = value => {
    if (!('value' in this.props)) {
      this.setState({ paymentMethod: value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, value));
    }
  };
  handleSelectChange2nd = value => {
    if (!('value' in this.props)) {
      this.setState({ currency: value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, value));
    }
  };

  handleSelectChange3rd = value => {
    if (!('value' in this.props)) {
      this.setState({ cryptoCur: value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, value));
    }
  };

  formchange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  childrenCurrList = () => {
    const c = ['INR', 'USD', 'AED'];
    let children = [];

    for (let i of c) {
      children.push(
        <Option key={i} value={i}>
          {i}
        </Option>,
      );
    }
    return children;
  };
  childrenPayList = () => {
    let c = ['paytm', 'Online Transfer', 'Phone Pe', 'Google Pay', 'other'];

    let children = [];

    for (let i of c) {
      children.push(
        <Option key={i} value={i}>
          {i}
        </Option>,
      );
    }
    return children;
  };
  render() {
    const { size } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
        <FormItem
            label="Select a Crypto"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('cryptoCur', {
              rules: [{ required: true, message: 'Crypto currency is required!' }],
            })(
              <Select
              mode="combobox"
              name="cryptoCur"
              placeholder="Select Crypto Currency"
              value={this.props.cryptoCur}
              size={size}
              style={{ width: '30%' }}
              onChange={this.handleSelectChange3rd}
            >
              <Option key='1' value='EST'>
          EST
        </Option><Option key='2' value='BTC'>
          BTC
        </Option>
        <Option key='3' value='ETH'>
          ETH
        </Option>
            </Select>,
            )}
          </FormItem>
          <FormItem
            label="Headline"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('headLine', {
              rules: [{ required: true, message: 'Headline is required!' }],
            })(
              <Input
                placeholder=" e.g Sell bitcoins using PayTM with Indian Rupee (INR)"
                onChange={this.formchange}
                name="headLine"
              />,
            )}
          </FormItem>
          <FormItem
            label="Payment Method"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('paymentMethod', {
              rules: [
                { required: true, message: 'Please select Payment Method!' },
              ],
            })(
              <Select
                mode="combobox"
                name="paymentMethod"
                value={this.props.paymentMethod}
                placeholder="Select a payment Method"
                onChange={this.handleSelectChange1st}
              >
                {this.childrenPayList()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="currency"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('currency', {
              rules: [{ required: true, message: 'Please select currency!' }],
            })(
              <Select
                mode="combobox"
                name="currency"
                value={this.props.currency}
                placeholder="Select a currency"
                onChange={this.handleSelectChange2nd}
              >
                {this.childrenCurrList()}
              </Select>,
            )}
          </FormItem>
          <FormItem
            label="Note"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('note', {
              rules: [{ required: true, message: 'Please attach a message!' }],
            })(
              <Input.TextArea
                rows={5}
                placeholder="Write a special Note"
                onChange={this.formchange}
                name="specialNote"
              />,
            )}
          </FormItem>
          <FormItem
            label="Location"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('location', {
              rules: [{ required: true, message: 'Please Enter your location!' }],
            })(
              <Input
                rows={5}
                placeholder="ENter Your location"
                onChange={this.formchange}
                name="location"
              />,
            )}
          </FormItem>
          <FormItem
            label="Maximum"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('maximum', {
              rules: [
                { required: true, message: 'Please enter mmaximum limit!' },
              ],
            })(
              <Input
                type="number"
                placeholder="maximum amount"
                onChange={this.formchange}
                name="maxAmt"
                addonAfter={this.state.cryptoCur || 'EST'}
              />,
            )}
          </FormItem>
          <FormItem
            label="Minimum"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('minimum', {
              rules: [
                { required: true, message: 'Please enter minimum limit!' },
              ],
            })(
              <Input
                type="number"
                placeholder="minimum amount"
                onChange={this.formchange}
                name="minAmt"
                addonAfter={this.state.cryptoCur || 'EST'}
              />,
            )}
          </FormItem>

          <FormItem
            label="@ Price"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('atPrice', {
              rules: [{ required: true, message: 'Please Choose Your Price' }],
            })(
              <RadioGroup
                onChange={this.onRadioChange}
                value={this.state.atPrice}
              >
                <Radio value={1}>Float By Market Price</Radio>
                <Radio value={2}>Fixed Price</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {this.state.atPrice === 2 && (
            <FormItem
              label="fixedPrice"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('fixedPrice', {
                rules: [
                  { required: true, message: 'Please enter your fixed Price!' },
                ],
              })(
                <Input
                  type="number"
                  placeholder="fixed Price amount"
                  onChange={this.formchange}
                  name="fixedPrice"
                  addonAfter={this.state.currency || 'USD'}
                />,
              )}
            </FormItem>
          )}

          <FormItem wrapperCol={{ span: 12, offset: 5 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}


class MyListComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      EST_VAL:{},
      BTC_VAL:{},
      ETH_VAL:{},
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
  },
  {
    title:"Type",
    dataIndex:"wantsToBuy",
    render:(fieldValue)=> `${fieldValue ? 'Buy' : 'Sell'}`
  },{
    title:'',
    dataIndex: 'show',
    render:(fieldVal,record)=>{
      return (<Button type="primary" onClick={this.updation.bind(this,record,fieldVal || this.state[record._id] || false)} >{fieldVal || this.state[record._id] ? "Inactive" :"Active"}</Button>)
    }
  }];
  conVertObjToArr = async(record)=>{
    return axios.get('/apis/p2p/getInterests?listingId='+record.uniqueIdentifier).then(data=>{
      if(data && data.data){
        let pushable = [];
         for(let i of data.data.userRequests){
           delete i._id;
           i.username = i.userId.username;
           i.userId = i.userId._id;
           pushable.push(i);
         }
         console.log(pushable)
         return pushable;
      }
    });
  };
  updation =(record,fieldValue)=>{
    this.setState({
      [record._id]:true
    });
    const data={
      id:record.uniqueIdentifier,
      active:fieldValue
    }
    return axios.post("/apis/p2p/change_status",data).then(data=>{
      return data;
    });
  }
  initMatch =(record,item)=>{
    console.log("Clicked initmatch", record
    ,item)
    const Postdata = {
      listingId:record._id,
      sellerEmail:item.sellerEmail,
      requester:item.userId,
      amount:item.amount,
      cryptoCurrency:record.cryptoCur
    }
    return axios.post('/apis/p2p/makeMatch',Postdata).then(data=>{
      //make that match button and all the match button in that disabled maybe setstate and check for listingId_
     if(data && data.data){
      console.log(data.data);
      this.setState({
        [record._id]:{
          [item.userId]:true
        }
      });
     return data.data;

     }
    })
  };

  getCurrentBtcValue = (CUR = 'INR',cryptoCur) => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`);
    };
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

      axios.get('/apis/p2p/my_listings_count',{
        params:query
      })
        .then(countData=>{
      axios({
        url: '/apis/p2p/my_listings',
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

        pagination.total = countData.data;
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
          i.requests = await this.conVertObjToArr(i);
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
    finishDeal =async(record,item)=>{
      var id = this.state[`${record._id}_id`];
      const data={
        id:id,
        record:record,
        item:item
      }
      return axios.post('/apis/p2p/finishDeal',data).then(data=>{
        return data;
      })
    };


    myListMatches = ()=>{
      return axios.get('/apis/p2p/myListMatches').then(data=>{
          if(data.data){
            console.log(data.data);
            for(let i of data.data){
              if(i.iPaidVal && !i.finished){
                this.setState({
                  [`${i.listingId}_matched`]:{
                    [i.requester]:true
                  },
                  [`${i.listingId}_id`]:i.uniqueIdentifier

                })
              }else if(i.finished){
                this.setState({
                  [`${i.listingId}_finished`]:{
                    [i.requester]:true
                  },
                })
              }
            this.setState({
              [`${i.listingId}_match`]:{
                [i.requester]:true
              }
            })
          }
            return data.data;
          }
      })
    }

    componentDidMount() {
      axios
      .get('/apis/ping')
      .then(data => {
        if (data && data.data) {
          console.log('Everything is fine bro');
        }
      });
      this.myListMatches();
      this.fetch(); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
    }
    render() {
      return (
        <Table
          columns={this.columns}
          rowKey={record => record._id}
          dataSource={this.state.data}
          expandedRowRender={record => (
            <List
            // grid={{ gutter: 16, column: 4 }}
            itemLayout="horizontal"
            dataSource={ record.requests}
            renderItem={item => (
              <List.Item actions={[  <Button
                type="primary"
                onClick={ this.initMatch.bind(this,record,item)}
                disabled={this.state[`${record._id}_match`] ? true : false }
              >
                {this.state[`${record._id}_match`] && this.state[`${record._id}_match`][item.userId] ? 'Matched' :  'Match'}
              </Button>, <Button
              type='primary'
              onClick={this.finishDeal.bind(this,record,item)}
                disabled={this.state[`${record._id}_matched`] && this.state[`${record._id}_matched`][item.userId]  ? false : true }
              >
                {this.state[`${record._id}_matched`] && this.state[`${record._id}_matched`][item.userId] ? 'Finish Deal' : ( this.state[`${record._id}_finished`] && this.state[`${record._id}_finished`][item.userId] ? 'Deal closed' : 'No Deal')}
              </Button>]}>

                <List.Item.Meta
                title={item.username}
                description={"message: "+item.message}
                 />
               {item.amount} &nbsp;

              </List.Item>
            )}
          />
          )}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      );
    }

}


class MyRequests extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      EST_VAL:{},
      BTC_VAL:{},
      ETH_VAL:{},
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
  },
  {
    title:"Type",
    dataIndex:"wantsToBuy",
    render:(fieldValue)=> `${fieldValue ? 'Buy' : 'Sell'}`
  },{
    title:'',
    dataIndex:'notNeeded',
    render:(fieldVal,record)=>{
      return (<Button type="primary"
      onClick={this.updation.bind(this,record)}
      disabled={this.state[record._id] ? false :true}
      >
      {this.state[record._id] ? "I Have Paid" : (`${this.state[record._id]}_finished` ? "Paid" : "Not Matched") }
      </Button>)
    }
  }];
  conVertObjToArr = async(record)=>{
    return axios.get('/apis/p2p/getInterests?listingId='+record.uniqueIdentifier).then(data=>{
      if(data && data.data){
        let pushable = [];
         for(let i of data.data.userRequests){
           delete i._id;
           i.username = i.userId.username;
           i.userId = i.userId._id;
           pushable.push(i);
         }
         console.log(pushable)
         return pushable;
      }
    });
  };
  updation =(record)=>{
    delete this.state[record._id];
    var id = this.state[`${record._id}_id`];
    const data={
      id:id
    }
    return axios.post("/apis/p2p/change_status_paid",data).then(data=>{
      return data;
    });
  }
  initMatch =(record,item)=>{
    console.log("Clicked initmatch", record
    ,item)
    const Postdata = {
      listingId:record._id,
      sellerEmail:item.sellerEmail,
      requester:item.userId,
      amount:item.amount,
      cryptoCurrency:record.cryptoCur
    }
    return axios.post('/apis/p2p/makeMatch',Postdata).then(data=>{
      //make that match button and all the match button in that disabled maybe setstate and check for listingId_
     if(data && data.data){
      console.log(data.data);
      this.setState({
        [record._id]:{
          [item.userId]:true
        }
      });
     return data.data;

     }
    })
  };

  getCurrentBtcValue = (CUR = 'INR',cryptoCur) => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`);
    };
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

      axios({
        url: '/apis/p2p/getMyrequests',
        method: 'get',
        type: 'json',
      }).then(async(data) => {
        // Read total count from server
        // pagination.total = data.totalCount;
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
          i.requests = await this.conVertObjToArr(i);
          this.setState
            i.fullPrice=BTCVAl;
            allData.push(i)
        }
        this.setState({
          loading: false,
          data: allData,
        });
    });
    }
    myListMatches = ()=>{
      return axios.get('/apis/p2p/requesterListMatches').then(data=>{
          if(data.data){
            console.log(data.data);
            for(let i of data.data){
              if(i.showIpaid && !i.finished){
            this.setState({
              [`${i.listingId}`]:true,
              [`${i.listingId}_id`]:i.uniqueIdentifier
            })
          }else if(i.finished){
            this.setState({
              [`${i.listingId}_finished`]:true
            })
          }
          }
            return data.data;
          }
      })
    }

    componentDidMount() {
      axios
      .get('/apis/ping')
      .then(data => {
        if (data && data.data) {
          console.log('Everything is fine bro');
        }
      });
      this.myListMatches();
      this.fetch(); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
    }
    render() {
      return (
        <Table
          columns={this.columns}
          rowKey={record => record._id}
          dataSource={this.state.data}
          // expandedRowRender={record => (
          //   <List
          //   // grid={{ gutter: 16, column: 4 }}
          //   itemLayout="horizontal"
          //   dataSource={ record.requests}
          //   renderItem={item => (
          //     <List.Item actions={[  <Button
          //       type="primary"
          //       onClick={ this.initMatch.bind(this,record,item)}
          //       disabled={this.state[`${record._id}_match`] ? true : false }
          //     >
          //       {this.state[`${record._id}_match`] && this.state[`${record._id}_match`][item.userId] ? 'Matched' :  'Match'}
          //     </Button>]}>
          //       <List.Item.Meta
          //       title={item.username}
          //       description={"message: "+item.message}
          //        />
          //      {item.amount} &nbsp;

          //     </List.Item>
          //   )}
          // />
          // )}
          // pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      );
    }

}
/**
 *  Main Component
 */
class Addp2p extends React.Component {
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

  getFieldDecorator = this.props.form;
  contentListNoTitle = {
    buy: <BuyComponent form={this.props.form} />,
    sell: <BuyComponent form={this.props.form} sell={true} />,
    myList: <MyListComponent />,
    myRequests:<MyRequests />
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
export default Form.create()(withStyles(s)(Addp2p));
