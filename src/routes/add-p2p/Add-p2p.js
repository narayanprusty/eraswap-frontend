import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './Add-p2p.css';
import { Card, Form, Input, Button, Select } from 'antd';

const tabListNoTitle = [
  {
    key: 'buy',
    tab: 'Add Buy Listing',
  },
  {
    key: 'sell',
    tab: 'Add Sell Listing',
  },
];

const FormItem = Form.Item;
const Option = Select.Option;

class BuyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaymentInputBox: false,
    };
  }
    getCurrentBtcValue =async()=>{
      let data;
      try{
        data = await axios.get('https://localbitcoins.com/equation/btc_in_usd*1');
        if(data && !data.data){
          //there is some status code error check and send notification accordingly
        }else{
          return data.data;
        }
      }catch(error){
        //throw a notifiation cannot connect or something
      }
    };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', JSON.stringify(values));
        this.setState(values);
      }
    });
  };
  handleSelectChange1st = (value) => {

    if (!('value' in this.props)) {
      this.setState({ paymentMethod:value });
    }
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, value));
    }
  };
  handleSelectChange2nd = (value) => {

    if (!('value' in this.props)) {
      this.setState({ currency:value });
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
        <FormItem label="Note" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('note', {
            rules: [{ required: true, message: 'Please attach a message!' }],
          })(
            <Input
              placeholder="Write a special Note"
              onChange={this.formchange}
              name="specialNote"
            />,
          )}
        </FormItem>
        <FormItem label="Maximum" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('maximum', {
            rules: [{ required: true, message: 'Please enter mmaximum limit!' }],
          })(
            <Input
              type="number"
              placeholder="maximum amount"
              onChange={this.formchange}
              name="maxAmt"
              addonAfter={this.state.currency || "USD"}
            />,
          )}
        </FormItem>
        <FormItem label="Minimum" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
          {getFieldDecorator('minimum', {
            rules: [{ required: true, message: 'Please enter minimum limit!' }],
          })(
            <Input
              type="number"
              placeholder="minimum amount"
              onChange={this.formchange}
              name="minAmt"
              addonAfter={this.state.currency || "USD"}
            />,
          )}
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
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
    sell: <div>Hii</div>,
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
