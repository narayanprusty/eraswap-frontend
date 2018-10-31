/**
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import lodash from 'lodash';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Collapse,
  Radio,
  Icon,
  Steps,
  Spin,
  notification
} from 'antd';
import s from './Computex.css';
import QrCode from 'qrcode.react';
import moment from 'moment';


const Option = Select.Option;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const Step = Steps.Step;
class Computex extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.lastFetchId = 0;
    // this.fetchCurrency = lodash.debounce(this.fetchCurrency, 800);
    this.state = {
      exchanges: [],
      maxExchange: '',
      key: '1',
      amount: value.amount || 0,
      exchangeRate: 0,
      currency: value.currency,
      toCurrency: value.toCurrency,
      ourWallet: '',
      cur: [],
      tiMeFrom:0,
      stepsO: {
        firstStep: {
          status: 'process',
          icon: 'loading',
        },
        secoendStep: {
          status: 'wait',
          icon: 'check',
        },
        thirdStep: {
          status: 'wait',
          icon: 'pay-circle',
        },
        fourthStep: {
          status: 'wait',
          icon: 'solution',
        },
        fifthStep: {
          status: 'wait',
          icon: 'smile-o',
        },
      },
      loader: false,
    };
  }
  findMinMax = arr => {
    let min = { name: arr[0].name, ask: arr[0].ask },
      max = { name: arr[0].name, ask: arr[0].ask };

    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i].ask;
      min = v < min.ask ? { name: arr[i].name, ask: v } : min;
      max = v > max.ask ? { name: arr[i].name, ask: v } : max;
    }

    return [min, max];
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      loader: true,
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        axios
          .get(
            `/apis/cur/get_exchange_values?from=${this.state.currency}&to=${
              this.state.toCurrency
            }`,
          )
          .then(data => {
            if (data && data.data) {
              const getMinMax = this.findMinMax(data.data)[1];
              this.setState({
                loader: false,
                key: '2',
                panel1Text: `Convertion from ${this.state.amount} ${
                  this.state.currency
                } To ${this.state.toCurrency} estimated: `,
                exchanges: data.data,
                maxExchange: getMinMax.ask !== 0 ? getMinMax.name : '',
                exchangeRate: getMinMax.ask !== 0 ? getMinMax.ask : 0,
                ['totalExchangeAmout']:getMinMax.ask * this.state.amount,
                stepsO: {
                  firstStep: {
                    status: 'finish',
                    icon: 'edit',
                  },
                  secoendStep: {
                    status: 'process',
                    icon: 'loading',
                  },
                  thirdStep: {
                    status: 'wait',
                    icon: 'pay-circle',
                  },
                  fourthStep: {
                    status: 'wait',
                    icon: 'solution',
                  },
                  fifthStep: {
                    status: 'wait',
                    icon: 'smile-o',
                  },
                },
              });
            }
          });
      }
    });
  };
  checkExchangeSelect = exch => {
    if (this.state.maxExchange.toLowerCase() === exch) {
      debugger;
      return false;
    }
    return true;
  };
  handleChanges = e => {
    if (e.target.name === 'amount') {
      if (e.target.value > 0) {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
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
        if (data && data.data) {
          console.log('Everything is fine bro');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  unsetState = argState => {
    this.setState({
      clientWallet: false,
    });
  };
  nextStep3 = () => {
    this.setState({
      loader:true
    })
    axios
      .get(
        '/apis/cur/get_epositAddress?platform=' +
          this.state.maxExchange +
          '&symbol=' +
          this.state.currency,
      )
      .then(data => {
        if (data && data.data) {
          if(!this.state.lctxid){
            const postDta={
              tiMeFrom:this.state.tiMeFrom,
              exchFromCurrency: this.state.currency,
              exchFromCurrencyAmt: this.state.amount,
              exchToCurrency: this.state.toCurrency,
              exchToCurrencyRate: this.state.exchangeRate,
              allExchResult: this.state.cur,
              eraswapAcceptAddress: data.data.address,
              exchangePlatform: this.state.maxExchange,
              totalExchangeAmout:this.state.totalExchangeAmout
            };
          axios.post('/apis/txn/record_txn',postDta).then(data=>{
            if(data && data.data){
              this.setState({
                ['lctxid']:data.data._id
              });
            }
          });
      }
          this.setState({
            loader:false,
            ourWallet: data.data.address,
            key: '3',
            tiMeFrom: moment.utc().valueOf(),
            panel2Text: `Best Value is From ${this.state.maxExchange} : ${this
              .state.exchangeRate +
              ' ' +
              this.state.toCurrency}`,
            stepsO: {
              firstStep: {
                status: 'finish',
                icon: 'edit',
              },
              secoendStep: {
                status: 'finish',
                icon: 'check',
              },
              thirdStep: {
                status: 'process',
                icon: 'loading',
              },
              fourthStep: {
                status: 'wait',
                icon: 'solution',
              },
              fifthStep: {
                status: 'wait',
                icon: 'smile-o',
              },
            },
          });
        } else {
          //log the error here
          console.log(data);
        }
      });
      
    
};
  nextStep4 = () => {
    this.setState({
      stepsO: {
        firstStep: {
          status: 'finish',
          icon: 'edit',
        },
        secoendStep: {
          status: 'finish',
          icon: 'check',
        },
        thirdStep: {
          status: 'finish',
          icon: 'pay-circle',
        },
        fourthStep: {
          status: 'process',
          icon: 'loading',
        },
        fifthStep: {
          status: 'wait',
          icon: 'smile-o',
        },
      },
    });
    this.verifyMain();
  };
  fetchCurrency = keys => {
    // this.lastFetchId += 1;
    // const fetchId = this.lastFetchId;
    this.setState({ fetching: true });

    axios
      .get('/apis/cur/get_all_supported_currency?keyWord=' + keys)
      .then(data => {
        if (data && data.data) {
          this.setState({
            ['cur']: data.data,
            fetching: false,
          });
          console.log(this.state);
        }
      });
  };
  verifyMain = () => {
    debugger;
    const dataPushable = {
      tiMeFrom:this.state.tiMeFrom,
      exchFromCurrency: this.state.currency,
      exchFromCurrencyAmt: this.state.amount,
      exchToCurrency: this.state.toCurrency,
      exchToCurrencyRate: this.state.exchangeRate,
      allExchResult: this.state.exchanges,
      eraswapAcceptAddress: this.state.ourWallet,
      eraswapSendAddress: this.state.clientWallet,
      exchangePlatform: this.state.maxExchange,
      totalExchangeAmout:this.state.totalExchangeAmout,
      lctxid:this.state.lctxid
    };
    axios.post('/apis/txn/verifyAndSave', dataPushable).then(data => {
      if (data && data.data) {
        this.setState({
          stepsO: {
            firstStep: {
              status: 'finish',
              icon: 'edit',
            },
            secoendStep: {
              status: 'finish',
              icon: 'check',
            },
            thirdStep: {
              status: 'finish',
              icon: 'pay-circle',
            },
            fourthStep: {
              status: 'finish',
              icon: 'check',
            },
            fifthStep: {
              status: 'wait',
              icon: 'smile-o',
            },
          },
        });
        location.href = '/txnhistory';
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
    this.fetchCurrency(currency);
    console.log(currency);
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  };
  handletoCurrencyChange = toCurrency => {
    this.fetchCurrency(toCurrency);
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
      return element.name.toLowerCase() === exchName;
    });
    if (dataObj && dataObj.ask) {
      return (
        <span>
          {dataObj.ask * this.state.amount + ' ' + this.state.toCurrency}
          <br />@<br />
          {dataObj.ask}
        </span>
      );
    }
  };

  childrenCurrList = () => {
    let children = [];

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
    const { size } = this.props;
    const state = this.state;

    return (
      <div className={s.root}>
        <Card title={this.props.title}>
          <Steps>
            <Step
              status={this.state.stepsO.firstStep.status}
              title="Conversion details"
              icon={<Icon type={this.state.stepsO.firstStep.icon} />}
            />
            <Step
              status={this.state.stepsO.secoendStep.status}
              title="Select Best"
              icon={<Icon type={this.state.stepsO.secoendStep.icon} />}
            />
            <Step
              status={this.state.stepsO.thirdStep.status}
              title="Pay"
              icon={<Icon type={this.state.stepsO.thirdStep.icon} />}
            />
            <Step
              status={this.state.stepsO.fourthStep.status}
              title="Verification"
              icon={<Icon type={this.state.stepsO.fourthStep.icon} />}
            />
            {/* <Step status="wait" title="Done" icon={<Icon type="smile-o" />} /> */}
          </Steps>
          <br />
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
            *Please Enter the amount excluding the txn Fee
              <Form onSubmit={this.handleSubmit}>
                <FormItem label="Convert">
                  <Input
                    type="number"
                    name="amount"
                    size={size}
                    value={state.amount}
                    onChange={this.handleChanges.bind(this)}
                    style={{ width: '25%', marginRight: '3%' }}
                  />
                  {/* <Select
                    labelInValue
                    mode="combobox"
                    value={state.currency}
                    name="currency"
                    placeholder="Select Currency"
                    notFoundContent={state.fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchCurrency}
                    onChange={this.handletoCurrencyChange}
                    style={{ width: '32%' }}
                  >
                    {state.cur.map(d => <Option key={d.value}>{d.name}</Option>)}
                  </Select> */}
                  <Select
                    mode="combobox"
                    name="currency"
                    placeholder="Select Currency"
                    value={state.currency}
                    size={size}
                    style={{ width: '30%' }}
                    onChange={this.handleCurrencyChange}
                  >
                    {this.state.cur && this.childrenCurrList()}
                  </Select>
                </FormItem>

                <FormItem label="To">
                  {/* <Select
                    labelInValue
                    mode="combobox"
                    value={state.currency}
                    placeholder="Select Currency"
                    notFoundContent={state.fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchCurrency}
                    onChange={this.handletoCurrencyChange}
                    style={{ width: '60%' }}
                  >
                    {state.cur.map(d => <Option key={d.value}>{d.name}</Option>)}
                  </Select> */}
                  <Select
                    mode="combobox"
                    name="toCurrency"
                    placeholder="Select Currency"
                    value={state.toCurrency}
                    size={size}
                    style={{ width: '30%' }}
                    onChange={this.handletoCurrencyChange}
                  >
                    {this.state.cur && this.childrenCurrList()}
                  </Select>
                </FormItem>
                <FormItem>
                  {!this.state.loader &&
                    this.state.amount > 0 &&
                    this.state.currency &&
                    this.state.toCurrency && (
                      <Button type="primary" htmlType="submit">
                        <Icon type="right" />next
                      </Button>
                    )}
                  {this.state.loader && <Spin size="large" />}
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
                  value={this.state.maxExchange}
                  size="large"
                  onClick={this.handleChanges}
                >
                  <RadioButton
                    value="Bittrex"
                    disabled={this.checkExchangeSelect('bittrex')}
                  >
                    Bittrex <br /> {this.panel2Out('bittrex')}{' '}
                  </RadioButton>
                  <RadioButton
                    value="Binance"
                    disabled={this.checkExchangeSelect('binance')}
                  >
                    Binance <br /> {this.panel2Out('binance')}{' '}
                  </RadioButton>
                  <RadioButton
                    value="Poloniex"
                    disabled={this.checkExchangeSelect('poloniex')}
                  >
                    Poloniex <br /> {this.panel2Out('poloniex')}
                  </RadioButton>
                  <RadioButton
                    value="Kraken"
                    disabled={this.checkExchangeSelect('kraken')}
                  >
                    Kraken <br /> {this.panel2Out('kraken')}
                  </RadioButton>
                  <RadioButton
                    value="Bitfinex"
                    disabled={this.checkExchangeSelect('bitfinex')}
                  >
                    Bitfinex <br /> {this.panel2Out('bitfinex')}
                  </RadioButton>
                </RadioGroup>
              )}
              <br />
              <br />
              { !this.state.loader && this.state.maxExchange !== '' && (
                <Button type="primary" onClick={this.nextStep3}>
                  <Icon type="right" />next
                </Button>
              )}
               {this.state.loader && <Spin size="large" />}
              {this.state.maxExchange === '' && (
                <span>No Exchange Found for this Conversion</span>
              )}
            </Panel>
            <Panel
              header={this.state.panel3Text ? this.state.panel3Text : 'Step 3'}
              key="3"
              style={customPanelStyle}
              disabled={false}
              accordion={true}
            >
              We will be Exchange Through {this.state.maxExchange}. please
              transfer {this.state.amount + ' ' + this.state.currency} to this
              below address:<br />
              <div className={s.container}>
                <QrCode value={this.state.ourWallet} />
                <br />
                <br />
                <Input.Search
                  style={{ maxWidth: '45.2%' }}
                  defaultValue={this.state.ourWallet}
                  enterButton={<Icon type="copy" />}
                  size="large"
                  onSearch={value => {
                    this.copyToClipboard(value);
                  }}
                  disabled={true}
                />
                <br />
                <br />
                please Enter Your receiving Address:
                <br />
                <Input.Search
                  style={{ maxWidth: '45.2%' }}
                  placeholder={
                    'please enter your ' + this.state.toCurrency + ' Address'
                  }
                  enterButton="Save"
                  size="large"
                  onSearch={value => {
                    this.setState({
                      clientWallet: value,
                    });
                  }}
                  disabled={this.state.clientWallet || false}
                />
              </div>
              &nbsp;&nbsp;
              {this.state.clientWallet && (
                <ButtonGroup>
                  <Button
                    type="primary"
                    onClick={this.unsetState.bind('clientWallet')}
                  >
                    <Icon type="edit" />Edit Address
                  </Button>
                  <Button type="primary" onClick={this.nextStep4}>
                    <Icon type="right" />next
                  </Button> *click next Only after the transaction.
                </ButtonGroup>
              )}
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}
export default Form.create()(withStyles(s)(Computex));
