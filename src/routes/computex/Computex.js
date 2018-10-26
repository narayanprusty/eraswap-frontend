/**
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import { Card, Form, Input, Select, Button, Collapse } from 'antd';
import s from './Computex.css';

const Option = Select.Option;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
class Computex extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      key: '1' ,
      amount: value.amount || 0,
      currency: value.currency || 'ETH',
      toCurrency: value.toCurrency || 'BTC'
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.setState({
          key:'2',
          panel1Text:`Convertion from ${this.state.amount} ${this.state.currency} To ${this.state.toCurrency} estimated: `
        })
      }
    });
  };
  handleChanges = e => {
    debugger;
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
  };
  componentWillMount = () => {
    this.fetchCurrency();
  };
  componentDidMount = () => {
    axios
      .get('/apis/ping')
      .then(data => {
        if (data.data) {
          console.log('Everything is fine bro');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  fetchCurrency = () => {
    axios
      .get('/apis/cur/get_all_supported_currency')
      .then(data => {
        if (data.data) {
          this.setState({
            ['cur']: data.data,
          });
          console.log(this.state);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleCurrencyChange = (currency) => {
    debugger;
    console.log(currency)
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
 callback =(key)=>{
   console.log(key);
   if(key && key.length){
   this.setState({
     key: (key.length >= 2 ? key.pop() : key)
   });
  }
 }
  render() {
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    const { getFieldDecorator } = this.props.form;
    const { size } = this.props;
    const state = this.state;
    return (
      <div className={s.root}>
        <Card title="Computex">
          <Collapse bordered={false} defaultActiveKey={['1']} activeKey={[this.state.key]} onChange={this.callback} accordion>
            <Panel
              header={this.state.panel1Text ? this.state.panel1Text :"Step 1"}
              key="1"
              style={customPanelStyle}
              disabled={false}
            >
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem label="Convert">
                  {getFieldDecorator('Convert', {
                    initialValue: { amount: 0, currency: 'ETH' },
                    // rules: [{ validator: this.checkPrice }],
                  })}
                </FormItem>
                <FormItem>
                  <Input
                    type="number"
                    name="amount"
                    size={size}
                    value={state.amount}
                    onChange={this.handleChanges.bind(this)}
                    style={{ width: '65%', marginRight: '3%' }}
                  />
                  <Select
                    name="currency"
                    value={state.currency}
                    size={size}
                    style={{ width: '32%' }}
                    onChange={this.handleCurrencyChange}
                  >
                    <Option value="ETH">ETH</Option>
                    <Option value="BTC">BTC</Option>
                  </Select>
                </FormItem>
                <FormItem label="To">
                  {getFieldDecorator('TO', {
                    initialValue: { toCurrency: 'BTC' },
                    // rules: [{ validator: this.checkPrice }],
                  })}
                </FormItem>
                <FormItem>
                <Select
                    name="toCurrency"
                    value={state.toCurrency}
                    size={size}
                    style={{ width: '100%' }}
                    onChange={this.handleCurrencyChange}
                  >
                    <Option value="ETH">ETH</Option>
                    <Option value="BTC">BTC</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </FormItem>
              </Form>
            </Panel>
            <Panel
              header="Step 2"
              key="2"
              style={customPanelStyle}
              disabled={false}
              accordion={true}
            >
            blah blah
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}

export default Form.create()(withStyles(s)(Computex));
