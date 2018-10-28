/**
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Collapse,
  Radio,
  Icon
} from 'antd';
import s from './Computex.css';
import QrCode from 'qrcode.react';

const Option = Select.Option;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup =Button.Group;
class Computex extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      exchanges: [],
      maxExchanges: '',
      key: '1',
      amount: value.amount || 0,
      exchangeAmount:0,
      currency: value.currency || 'ETH',
      toCurrency: value.toCurrency || 'BTC',
      ourWallet: '3c17fab5142284eba3fd070f7ddb53c5de68bcaf10eb1f8a799d83b3589bac87',
      txnId:''
    };
  }
  findMinMax = arr => {
    let min = { name: arr[0].name, value: arr[0].value },
      max = { name: arr[0].name, value: arr[0].value };

    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i].value;
      min = v < min.value ? { name: arr[i].name, value: v } : min;
      max = v > max.value ? { name: arr[i].name, value: v } : max;
    }

    return [min, max];
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.get('/apis/cur/get_exchange_values').then(data => {
          if (data.data) {
            const getMinMax =this.findMinMax(data.data)[1];
            this.setState({
              key: '2',
              panel1Text: `Convertion from ${this.state.amount} ${
                this.state.currency
              } To ${this.state.toCurrency} estimated: `,
              exchanges: data.data,
              maxExchanges: getMinMax.name,
              exchangeAmount:getMinMax.value
            });
          }
        });
      }
    });
  };
  checkExchangeSelect = exch => {
    if (this.state.maxExchanges === exch) {
      return false;
    }
    return true;
  };
  handleChanges = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(this.state);
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
  unsetState =(argState)=>{
      debugger;
    this.setState({
        clientWallet:false
    })
  }
  nextStep3 = () => {
    this.setState({
      key: '3',
      panel2Text: `Best Value is From ${this.state.maxExchanges} : ${this.state.exchangeAmount +' '+this.state.toCurrency}`,
    });
  };
  nextStep4 = () => {
    this.setState({
      key: '4',
      panel3Text:`After Verification of your Txn ${this.state.exchangeAmount +' '+this.state.toCurrency} will be sent to : ${this.state.clientWallet}`
    });
  };
  fetchCurrency = () => {
    axios.get('/apis/cur/get_all_supported_currency').then(data => {
      if (data.data) {
        this.setState({
          ['cur']: data.data,
        });
        console.log(this.state);
      }
    });
  };
  copyToClipboard = text => {
    var dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.setAttribute('value', text);
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };
  handleCurrencyChange = currency => {
    console.log(currency);
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  };
  handletoCurrencyChange = toCurrency => {
    console.log(toCurrency);
    if (!('value' in this.props)) {
      this.setState({ toCurrency });
    }
    this.triggerChange({ toCurrency });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  callback = key => {
    console.log(key);
    if (key && key.length) {
      this.setState({
        key: key.length >= 2 ? key.pop() : key,
      });
    }
  };
  panel2Out = exchName => {
    const dataObj = this.state.exchanges.find(element => {
      return element.name === exchName;
    });
    if (dataObj && dataObj.value) {
      return dataObj.value + ' ' + this.state.toCurrency;
    }
  };

  childrenCurrList = () => {
    let children = [];

    debugger;
    for (let i of this.state.cur) {
      children.push(
        <Option key={i.name} value={i.value}>
          {i.value}
        </Option>,
      );
    }
    return children;
  };

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
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            activeKey={[this.state.key]}
            onChange={this.callback}
            accordion
          >
            <Panel
              header={this.state.panel1Text ? this.state.panel1Text : 'Step 1'}
              key="1"
              style={customPanelStyle}
              disabled={false}
            >
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem label="Convert" />
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
                    {this.state.cur && this.childrenCurrList()}
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
                    onChange={this.handletoCurrencyChange}
                  >
                    {this.state.cur && this.childrenCurrList()}
                  </Select>
                </FormItem>
                <FormItem>
                    {this.state.amount>0 &&(
                  <Button type="primary" htmlType="submit">
                  <Icon type="right" />next
                  </Button>
                    )}
                </FormItem>
              </Form>
            </Panel>
            <Panel
              header={this.state.panel2Text ? this.state.panel2Text : 'Step 2'}
              key="2"
              style={customPanelStyle}
              disabled={false}
              accordion={true}
            >
              {' '}
              <blockquote>
                {' '}
                * Best Price [In USD] selected automatically
              </blockquote>{' '}
              &nbsp; <br />
              {this.state.exchanges && (
                <RadioGroup
                  name="exchanges"
                  value={this.state.maxExchanges}
                  size="large"
                  onClick={this.handleChanges}
                >
                  <RadioButton
                    value="bittrex"
                    disabled={this.checkExchangeSelect('bittrex')}
                  >
                    Bittrex <br /> {this.panel2Out('bittrex')}{' '}
                  </RadioButton>
                  <RadioButton
                    value="binance"
                    disabled={this.checkExchangeSelect('binance')}
                  >
                    Binance <br /> {this.panel2Out('binance')}{' '}
                  </RadioButton>
                  <RadioButton
                    value="poloniex"
                    disabled={this.checkExchangeSelect('poloniex')}
                  >
                    Poloniex <br /> {this.panel2Out('poloniex')}
                  </RadioButton>
                  <RadioButton
                    value="kraken"
                    disabled={this.checkExchangeSelect('kraken')}
                  >
                    Kraken <br /> {this.panel2Out('kraken')}
                  </RadioButton>
                  <RadioButton
                    value="bitfinex"
                    disabled={this.checkExchangeSelect('bitfinex')}
                  >
                    Bitfinex <br /> {this.panel2Out('bitfinex')}
                  </RadioButton>
                </RadioGroup>
              )}
              <br />
              <br />
              <Button type="primary" onClick={this.nextStep3}>
                <Icon type="right" />next
              </Button>
            </Panel>
            <Panel
              header={this.state.panel3Text ? this.state.panel3Text : 'Step 3'}
              key="3"
              style={customPanelStyle}
              disabled={false}
              accordion={true}
            >
              We will be Exchange Through {this.state.maxExchanges}. please
              transfer {this.state.amount + ' ' + this.state.currency} to this
              below address:<br />
              <div className={s.container}>
                <QrCode value={this.state.ourWallet} />
                <br /><br />
                <Input.Search
                  style={{ maxWidth:"45.2%"}}
                  defaultValue={this.state.ourWallet}
                  enterButton={<Icon type="copy" />}
                  size="large"
                  onSearch={value => {
                    this.copyToClipboard(value);
                  }}
                  allowClear
                  disabled={true}
                />
                <br/><br />
                please Enter Your receiving Address:
                <br />
                <Input.Search
                  style={{ maxWidth:"45.2%"}}
                  placeholder={"please enter your "+this.state.toCurrency+" Address"}
                  enterButton="Save"
                  size="large"
                  onSearch={value => {
                    this.setState({
                        clientWallet:value
                    });
                  }}
                  allowClear
                  disabled={this.state.clientWallet || false}
                />
              </div>
              &nbsp;&nbsp;
              {this.state.clientWallet &&(
            <ButtonGroup>
                <Button type="primary"  onClick={this.unsetState.bind('clientWallet')}>
                <Icon type="edit" />Edit Address
              </Button>
              <Button type="primary"  onClick={this.nextStep4}>
                <Icon type="right" />next
              </Button>
              </ButtonGroup>)}
            </Panel>
            <Panel
              header="Step 4"
              key="4"
              style={customPanelStyle}
              disabled={false}
              accordion={true}
            >
                Enter Your Transaction ID:
                <br />
                <Input.Search
                  style={{ maxWidth:"45.2%"}}
                  placeholder="TXN ID"
                  enterButton="Verify"
                  size="large"
                  onSearch={value => {
                    this.setState({
                        txnId:value
                    });
                  }}
                  allowClear
                //   disabled={this.state.clientWallet || false}
                />
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
export default Form.create()(withStyles(s)(Computex));
