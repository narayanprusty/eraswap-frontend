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
  notification,
} from 'antd';
import s from './Computex.css';
import QrCode from 'qrcode.react';
import moment from 'moment';
import TxnStat from '../TxnHistory/TxnHistory';

const Option = Select.Option;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const Step = Steps.Step;

class ComputeEx extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.lastFetchId = 0;
    // this.fetchCurrency = lodash.debounce(this.fetchCurrency, 800);
    this.state = {
      feeSegment: {},
      sendTag: undefined,
      platformFee: 'EST',
      exchanges: [],
      symbol: '',
      maxExchange: '',
      key: '1',
      amount: value.amount || null,
      exchangeRate: 0,
      currency: value.currency,
      toCurrency: value.toCurrency,
      ourWallet: '',
      cur: [],
      tiMeFrom: 0,
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
  componentDidMount = () => {
    this.fetchCurrency();
  };
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
    setTimeout(() => this.setState({ loader: false }), 20000);
    this.checkValue(e).then(data => {
      if (data == true) {
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
                  this.getFees();
                  const symbol = Object.keys(data.data)[0];
                  const getMinMax = this.findMinMax(data.data[symbol])[1];
                  this.setState({
                    symbol: symbol,
                    loader: false,
                    key: '2',
                    panel1Text: `Convertion from ${this.state.amount} ${
                      this.state.currency
                    } To ${this.state.toCurrency} estimated: `,
                    exchanges: data.data[symbol],
                    maxExchange: getMinMax.ask !== 0 ? getMinMax.name : '',
                    exchangeRate: getMinMax.ask !== 0 ? getMinMax.ask : 0,
                    ['totalExchangeAmout']: getMinMax.ask * this.state.amount,
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
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
      } else {
        this.setState({
          loader: false,
        });
      }
    });
  };

  getFees = () => {
    axios
      .get(
        '/apis/cur/checkFee?amount=' +
          this.state.amount +
          '&fromSymbol=' +
          this.state.currency,
      )
      .then(data => {
        if (data && data.data) {
          this.setState({
            feeSegment: data.data,
          });
        } else {
          notification.open({
            message: 'Failed to fetch fees!',
            icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
          });
        }
      });
  };
  checkExchangeSelect = exch => {
    if (this.state.maxExchange.toLowerCase() === exch) {
      return false;
    }
    return true;
  };
  handleChanges = e => {
    if (e.target.name === 'amount') {
      this.setState({
        [e.target.name]: e.target.value,
        checkVal: false,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    console.log(this.state);
  };

  handleRadioChange = e => {
    axios
      .get(
        '/apis/cur/getPrice?platform=' +
          e.target.value.toLowerCase() +
          '&symbol=' +
          this.state.symbol,
      )
      .then(data => {
        console.log(data.data);
        this.setState({
          [e.target.name]: e.target.value,
          exchangeRate: this.panel2Out(e.target.value, false),
          totalExchangeAmout:
            this.panel2Out(e.target.value, false) * this.state.amount,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  static propTypes = {
    title: PropTypes.string.isRequired,
  };
  componentWillMount = () => {
    this.fetchCurrency();
  };
  componentDidMount = () => {
    axios.get('/apis/ping').then(data => {
      if (data && data.data) {
        console.log('Everything is fine bro');
      }
    });
  };
  unsetState = argState => {
    this.setState({
      clientWallet: false,
      sendTag: false,
    });
  };
  nextStep3 = () => {
    this.setState({
      loader: true,
    });
    setTimeout(() => this.setState({ loader: false }), 20000);

    axios
      .get(
        '/apis/cur/get_epositAddress?platform=' +
          this.state.maxExchange +
          '&symbol=' +
          this.state.currency,
      )
      .then(data => {
        if (data && data.data) {
          if (!this.state.lctxid) {
            const postDta = {
              tiMeFrom: this.state.tiMeFrom,
              exchFromCurrency: this.state.currency,
              exchFromCurrencyAmt: this.state.amount,
              exchToCurrency: this.state.toCurrency,
              exchToCurrencyRate: this.state.exchangeRate,
              allExchResult: this.state.cur,
              eraswapAcceptAddress: data.data.address,
              exchangePlatform: this.state.maxExchange,
              totalExchangeAmout: this.state.totalExchangeAmout,
              platformFeePayOpt: this.state.platformFee,
            };
            axios.post('/apis/txn/record_txn', postDta).then(data => {
              if (data && data.data) {
                this.setState({
                  ['lctxid']: data.data._id,
                });
              }
            });
          }
          this.setState({
            depositTag: data.data.tag ? data.data.tag : 'Not Available',
            loader: false,
            ourWallet: data.data.address,
            key: '3',
            tiMeFrom: moment.utc().valueOf(),
            panel2Text: `Best value is from ${this.state.maxExchange} : for 1 ${
              this.state.symbol.split('/')[0]
            } , ${this.state.exchangeRate +
              ' ' +
              this.state.symbol.split('/')[1]}`,
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
      })
      .catch(error => {
        console.log(error);
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
      .get('/apis/cur/get_all_supported_currency')
      .then(data => {
        if (data && data.data) {
          this.setState({
            ['cur']: data.data,
            fetching: false,
          });
          console.log(this.state);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  verifyMain = () => {
    const dataPushable = {
      symbol: this.state.symbol,
      tiMeFrom: this.state.tiMeFrom,
      exchFromCurrency: this.state.currency,
      exchFromCurrencyAmt: this.state.amount,
      exchToCurrency: this.state.toCurrency,
      exchToCurrencyRate: this.state.exchangeRate,
      allExchResult: this.state.exchanges,
      eraswapAcceptAddress: this.state.ourWallet,
      eraswapAcceptTag: this.state.depositTag,
      eraswapSendTag: this.state.sendTag,
      eraswapSendAddress: this.state.clientWallet,
      exchangePlatform: this.state.maxExchange,
      totalExchangeAmout: this.state.totalExchangeAmout,
      lctxid: this.state.lctxid,
      platformFeePayOpt: this.state.platformFee,
    };
    axios
      .post('/apis/txn/verifyAndSave', dataPushable)
      .then(data => {
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
      })
      .catch(error => {
        console.log(error);
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
    // this.fetchCurrency(currency);
    console.log(currency);
    if (!('value' in this.props)) {
      this.setState({ checkVal: false, currency });
      this.triggerChange({ currency });
    }
  };
  handletoCurrencyChange = toCurrency => {
    // this.fetchCurrency(toCurrency);
    console.log(toCurrency);
    if (!('value' in this.props)) {
      this.setState({ checkVal: false, toCurrency });
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
  panel2Out = (exchName, html) => {
    const dataObj = this.state.exchanges.find(element => {
      return element.name.toLowerCase() === exchName.toLowerCase();
    });
    if (dataObj && dataObj.ask && html) {
      let expectedAmount;
      let atAmount;
      if (dataObj.sym == this.state.currency + '/' + this.state.toCurrency) {
        //sell type
        expectedAmount = dataObj.ask * this.state.amount;
        atAmount = dataObj.ask;
      } else if (
        dataObj.sym ==
        this.state.toCurrency + '/' + this.state.currency
      ) {
        //buy type
        expectedAmount = this.state.amount / dataObj.bid;
        atAmount = 1 / dataObj.bid;
      }
      return (
        <span>
          {'You get: ~' +
            (expectedAmount ? expectedAmount.toFixed(7) : '-') +
            ' ' +
            this.state.toCurrency}
          <br />@<br />
          {'At rate: ' +
            (atAmount ? atAmount.toFixed(7) : '-') +
            this.state.toCurrency +
            '/' +
            this.state.currency}
        </span>
      );
    } else if (dataObj && dataObj.ask && !html) {
      return dataObj.ask;
    } else if (dataObj && !dataObj.ask) {
      return (
        <span>
          Not Found <br />
          <br />
          <br />
        </span>
      );
    }
  };
  checkValue = async e => {
    return axios
      .get(
        '/apis/cur/checkVal?currency=' +
          this.state.currency +
          '&amount=' +
          this.state.amount +
          '&platform=' +
          this.state.platformFee,
      )
      .then(data => {
        if (data && data.data) {
          const foundData = data.data;
          const currencyData = foundData[this.state.currency];
          if (currencyData * this.state.amount >= 20) {
            this.setState({
              checkVal: true,
            });
            return true;
          } else {
            notification.open({
              message: 'Entered Amount should be equivalent to $20 or more.',
              description:
                'Please change the amount and try again.\n Entered amout value is estimated $' +
                (currencyData * this.state.amount).toFixed(4),
              icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
            });
          }
        }
      });
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
      marginBottom: 0,
      overflow: 'hidden',
    };
    const { size } = this.props;
    const state = this.state;

    return (
      <div>
        {/* <Card title={this.props.title}> */}

        <Steps style={{ textAlign: 'left' }}>
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
          bordered={true}
          defaultActiveKey={['1']}
          activeKey={[this.state.key]}
          onChange={this.callback}
          accordion
        >
          <Panel
            header={
              this.state.panel1Text
                ? this.state.panel1Text
                : React.createElement(
                    'div',
                    {
                      style: {
                        textAlign: 'left',
                      },
                    },
                    'Step 1',
                  )
            }
            key="1"
            style={customPanelStyle}
            disabled={false}
            className={s.blue}
          >
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="Convert Currency">
                <Select
                  showSearch
                  // mode="combobox"
                  name="currency"
                  placeholder="Select Currency"
                  value={state.currency}
                  size={size}
                  style={{
                    width: '30%',
                    borderColor: '#000',
                    borderWidth: '2px',
                  }}
                  onChange={this.handleCurrencyChange}
                >
                  {this.state.cur && this.childrenCurrList()}
                </Select>
              </FormItem>
              <FormItem label="Convert Amount (excluding txn fee)">
                <Input
                  name="amount"
                  size={size}
                  value={state.amount}
                  placeholder="e.g 100"
                  onChange={this.handleChanges.bind(this)}
                  style={{ width: '30%' }}
                />
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
                  showSearch
                  // mode="combobox"
                  name="toCurrency"
                  placeholder="Select Currency"
                  value={state.toCurrency}
                  size={size}
                  style={{
                    width: '30%',
                    borderColor: '#000000',
                    borderWidth: '2px',
                  }}
                  onChange={this.handletoCurrencyChange}
                >
                  {this.state.cur && this.childrenCurrList()}
                </Select>
              </FormItem>
              <FormItem label="Pay platform fee using: [0.5% for any coin and for EST 0.25%*]">
                <RadioGroup
                  name="platformFee"
                  onChange={this.handleChanges.bind(this)}
                  value={this.state.platformFee}
                >
                  <Radio value="EST">EST [50% off]</Radio>
                  <Radio value="source">
                    {this.state.currency
                      ? this.state.currency
                      : 'Source Currency'}
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem>
                {this.state.toCurrency == this.state.currency &&
                  this.state.currency && (
                    <div style={{ color: 'red' }}>
                      * Source Currency and Destination Currency cannot be same
                    </div>
                  )}
                {!this.state.loader &&
                  this.state.amount > 0 &&
                  this.state.currency &&
                  this.state.toCurrency && (
                    <Button.Group>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                          this.state.toCurrency == this.state.currency
                            ? true
                            : false
                        }
                      >
                        <Icon type="right" />next
                      </Button>
                    </Button.Group>
                  )}
                {this.state.loader && <Spin size="large" />}
              </FormItem>
            </Form>
          </Panel>
          <Panel
            header={
              this.state.panel2Text
                ? this.state.panel2Text
                : React.createElement(
                    'div',
                    {
                      style: {
                        textAlign: 'left',
                      },
                    },
                    'Step 2',
                  )
            }
            key="2"
            style={customPanelStyle}
            disabled={false}
            accordion={true}
            className={s.blue}
          >
            {' '}
            <blockquote>
              {' '}
              ComputeEx Service Fees to be Deducted: <blockquote> </blockquote>
              {this.state.feeSegment && (
                <div>
                  <ButtonGroup>
                    <Button
                      type="success"
                      disabled={this.state.platformFee == 'EST' ? false : true}
                    >
                      EST: {this.state.feeSegment.EST}
                    </Button>
                    <Button
                      type="success"
                      disabled={this.state.platformFee != 'EST' ? false : true}
                    >
                      {this.state.currency}:{
                        this.state.feeSegment[this.state.currency]
                      }
                    </Button>
                  </ButtonGroup>
                </div>
              )}{' '}
              <blockquote> </blockquote>
              * Best price [in USD] selected automatically
            </blockquote>{' '}
            &nbsp; <br />
            {this.state.exchanges && (
              <RadioGroup
                name="maxExchange"
                value={this.state.maxExchange}
                size="large"
                onChange={this.handleRadioChange}
              >
                <RadioButton value="Bittrex">
                  Bittrex <br /> {this.panel2Out('bittrex', true)}{' '}
                </RadioButton>
                <RadioButton value="Binance">
                  Binance <br /> {this.panel2Out('binance', true)}{' '}
                </RadioButton>
                <RadioButton value="Poloniex">
                  Poloniex <br /> {this.panel2Out('poloniex', true)}
                </RadioButton>
                <RadioButton value="Cryptopia">
                  Cryptopia <br /> {this.panel2Out('cryptopia', true)}
                </RadioButton>
                <RadioButton value="Kucoin">
                  Kucoin <br /> {this.panel2Out('kucoin', true)}
                </RadioButton>
                {/* <RadioButton
                    value="OKEX"

                  >
                    OkEx <br /> {this.panel2Out('okex',true)}
                  </RadioButton> */}
              </RadioGroup>
            )}
            <br />
            <br />
            {!this.state.loader &&
              this.state.maxExchange !== '' && (
                <Button type="primary" onClick={this.nextStep3}>
                  <Icon type="right" />next
                </Button>
              )}
            {this.state.loader && <Spin size="large" />}
            {this.state.maxExchange === '' && (
              <span>No exchange found for this conversion</span>
            )}
          </Panel>
          <Panel
            header={
              this.state.panel3Text
                ? this.state.panel3Text
                : React.createElement(
                    'div',
                    {
                      style: {
                        textAlign: 'left',
                      },
                    },
                    'Step 3',
                  )
            }
            key="3"
            style={customPanelStyle}
            disabled={false}
            accordion={true}
          >
            We will be exchange through {this.state.maxExchange}. please
            transfer {this.state.amount + ' ' + this.state.currency} to this
            below address:<br />
            <div className={s.container}>
              <QrCode value={this.state.ourWallet} />
              <br />
              <br />
              <Input.Search
                style={{ maxWidth: '45.2%' }}
                defaultValue={this.state.ourWallet}
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
              {this.state.depositTag &&
                this.state.depositTag != 'Not Available' &&
                this.state.depositTag != this.state.ourWallet && (
                  <Input.Search
                    style={{ maxWidth: '45.2%' }}
                    defaultValue={this.state.depositTag}
                    enterButton={<Icon type="copy" />}
                    size="large"
                    onSearch={value => {
                      this.copyToClipboard(value);
                    }}
                    disabled={true}
                  />
                )}
              <br />
              <br />
              Please enter your receiving details:
              <br />
              <Input.Search
                style={{ maxWidth: '45.2%' }}
                placeholder={
                  'please enter your ' + this.state.toCurrency + ' address'
                }
                enterButton="Save"
                size="large"
                onSearch={value => {
                  this.setState({
                    clientWallet: value.toLocaleLowerCase(),
                  });
                }}
                disabled={this.state.clientWallet ? true : false}
              />
              <br />
              <br />
              {this.state.depositTag &&
                this.state.depositTag != 'Not Available' &&
                this.state.depositTag != this.state.ourWallet && (
                  <Input.Search
                    style={{ maxWidth: '45.2%' }}
                    placeholder={
                      'Please enter tag, if required by your deposit engine'
                    }
                    enterButton="Save"
                    size="large"
                    onSearch={value => {
                      this.setState({
                        sendTag: value,
                      });
                    }}
                    disabled={this.state.sendTag ? true : false}
                  />
                )}
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
                </Button>{' '}
                *click next only after the transaction.
              </ButtonGroup>
            )}
          </Panel>
        </Collapse>
        {/* </Card> */}
      </div>
    );
  }
}

const tabListNoTitle = [
  {
    key: 'ComputeEx',
    tab: 'ComputeEx',
  },
  {
    key: 'txnhistory',
    tab: 'Transaction History',
  },
];
class ManageComputeEx extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'ComputeEx',
      noTitleKey: 'ComputeEx',
    };
  }
  componentDidMount = () => {
    if (!localStorage.user) {
      location.href = '/login?how=force';
    }
  };
  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };
  contentListNoTitle = {
    ComputeEx: <ComputeEx title={this.props.title} form={this.props.form} />,
    txnhistory: (
      <TxnStat title="Transaction History" menukey={this.props.menukey} />
    ),
  };
  render() {
    return (
      <div className={s.root}>
        <Card
          style={{
            textAlign: 'center',
          }}
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
export default Form.create()(withStyles(s)(ManageComputeEx));
