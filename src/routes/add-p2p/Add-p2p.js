import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './Add-p2p.css';
import { Card, Form, Input, Button, Select, Radio,Table } from 'antd';

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
  },
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
    this.getCurrentBtcValue();
  };
  // componentDidUpdate=()=>{
  //   if(this.state.currency){
  //     this.getCurrentBtcValue(this.state.currency);
  //   }
  // }
  getCurrentBtcValue = (CUR = 'INR') => {
    axios
      .get(`/apis/cur/current_BTC?currency=${CUR}`)
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
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <label>Current Btc Price: {this.state.currentBtc} INR</label>
        <Form onSubmit={this.handleSubmit}>
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
                addonAfter={this.state.currency || 'USD'}
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
                addonAfter={this.state.currency || 'USD'}
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
  getCurrentBtcValue = (CUR = 'INR') => {
    return axios
        .get(`/apis/cur/current_BTC?currency=${CUR}`);
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
        debugger;
        pagination.total = countData.data;
        let allData=[];

        for(let i of data.data){
          let BTCVAl ;
          if(this.state.BTC_VAL[i.currency]){
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

      this.fetch(); //if visiting sell tab, show the buy listings, because they want to sell who want to buy.
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
    myList: <MyListComponent />
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
export default Form.create()(withStyles(s)(Addp2p));
