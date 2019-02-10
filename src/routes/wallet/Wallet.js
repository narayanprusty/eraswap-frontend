/**
 *
 */

import React from 'react';
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
  Icon,
  Steps,
  Spin,
  Table,
  notification,
  AutoComplete,
  Checkbox,
} from 'antd';

const { Column } = Table;

import s from './Wallet.css';
import QrCode from 'qrcode.react';
import moment from 'moment';

const Option = Select.Option;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;
const Step = Steps.Step;

const sendReceiveTabs = [
  {
    key: 'SendForm',
    tab: 'Send',
  },
  {
    key: 'ReceiveForm',
    tab: 'Receive',
  },
];

const tabListNoTitle = [
  {
    key: 'BTC',
    tab: 'Bitcoin',
  },
  {
    key: 'ETH',
    tab: 'Ethereum',
  },
  {
    key: 'EST',
    tab: 'EST Token',
  },
];

class WalletManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: props.header,
      title: props.title,
      name: props.name,
      recipient: '',
      amount: '',
      balance: '',
      key: 'SendForm',
      noTitleKey: 'SendForm',
      userWallet: '',
      privateKey: '',
      loadingBalance: false,
      sending: false,
      gettingPK: false,
      history: [],
      conversionTypes: [],
      exchangeAmount: '',
      exchangeToWallet: '',
      useEstForFees: false,
      loader: false,
      symbol: '',
      exchanges: '',
      exchangeRate: '',
      maxExchange: '',
      toCurrency: '',
      checkExchanges: false,
      lctxid: '',
      tiMeFrom: 0,
      cur: [],
    };
  }

  findMinMax = arr => {
    let min = {
        name: arr[0].name,
        ask: arr[0].ask,
      },
      max = {
        name: arr[0].name,
        ask: arr[0].ask,
      };

    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i].ask;
      min =
        v < min.ask
          ? {
              name: arr[i].name,
              ask: v,
            }
          : min;
      max =
        v > max.ask
          ? {
              name: arr[i].name,
              ask: v,
            }
          : max;
    }

    return [min, max];
  };

  componentDidMount() {
    this.getBalance();
    this.getAddress();
    this.getHistory();
    this.getConversionCryptos();
  }

  getConversionCryptos() {
    var types = [];
    var index = 1;
    for (var i = 0; i < tabListNoTitle.length; i++) {
      if (tabListNoTitle[i].key != this.state.name && tabListNoTitle[i].key != "EST") {
        types.push(tabListNoTitle[i].key);
      }
    }
    this.setState({
      conversionTypes: types,
    });
  }

  checkValue = e => {
    e.preventDefault();
    this.setState({
      loader: true,
    });

    let platform = this.state.useEstForFees ? 'EST' : 'source';

    return axios
      .get(
        '/apis/cur/checkVal?currency=' +
          this.state.name +
          '&amount=' +
          this.state.exchangeAmount +
          '&platform=' +
          platform +
          '&fromWallet=true',
      )
      .then(data => {
        if (data && data.data) {
          const foundData = data.data;
          console.log(foundData);
          const currencyData = foundData[this.state.name];
          const usdPrice = currencyData;
          console.log('USD Price', usdPrice);
          if (usdPrice * this.state.exchangeAmount >= 20) {
            axios
              .get(
                `/apis/cur/get_exchange_values?from=${this.state.name}&to=${
                  this.state.toCurrency
                }`,
              )
              .then(data => {
                console.log('get_exchange_values', data);
                if (data && data.data) {
                  const symbol = Object.keys(data.data)[0];
                  const getMinMax = this.findMinMax(data.data[symbol])[1];
                  this.setState({
                    symbol: symbol,
                    loader: false,
                    exchanges: data.data[symbol],
                    maxExchange: getMinMax.ask !== 0 ? getMinMax.name : '',
                    exchangeRate: getMinMax.ask !== 0 ? getMinMax.ask : 0,
                    ['totalExchangeAmout']:
                      getMinMax.ask * this.state.exchangeAmount,
                    checkExchanges: true,
                  });

                  const postDta = {
                    tiMeFrom: this.state.tiMeFrom,
                    exchFromCurrency: this.state.name,
                    exchFromCurrencyAmt: this.state.exchangeAmount,
                    exchToCurrency: this.state.toCurrency,
                    exchToCurrencyRate: this.state.exchangeRate,
                    eraswapAcceptAddress: data.data.address,
                    exchangePlatform: this.state.maxExchange,
                    totalExchangeAmout: this.state.totalExchangeAmout,
                    platformFeePayOpt: this.state.platformFee,
                    fromWallet: true,
                  };
                  axios
                    .post('/apis/txn/record_txn', postDta)
                    .then(data => {
                      if (data && data.data) {
                        this.setState({
                          lctxid: data.data._id,
                          tiMeFrom: moment.utc().valueOf(),
                        });

                        axios
                          .get(
                            '/apis/cur/get_epositAddress?platform=' +
                              this.state.maxExchange +
                              '&symbol=' +
                              this.state.name,
                          )
                          .then(res => {
                            console.log(res.data.address);
                            this.setState({
                              exchangeToWallet: res.data.address,
                            });

                            axios
                              .post('/apis/wallet/send', {
                                crypto: this.state.name,
                                receiver: res.data.address,
                                amount: this.state.exchangeAmount,
                              })
                              .then(res => {
                                if (res.data.success) {
                                  notification.open({
                                    message: 'Success',
                                    description: 'Transaction sent!',
                                  });

                                  console.log(res);
                                  this.setState({
                                    sending: false,
                                    recipient: '',
                                    amount: '',
                                    exchangeAmount:
                                      res.data.dbObject.txn.amountReceived,
                                  });
                                  axios
                                    .post('/apis/txn/updateTxnAmount', {
                                      lctxid: this.state.lctxid,
                                      receivedAmount:
                                        res.data.dbObject.txn.amountReceived,
                                    })
                                    .then(updatedTxn => {
                                      const dataPushable = {
                                        symbol: this.state.symbol,
                                        tiMeFrom: this.state.tiMeFrom,
                                        exchFromCurrency: this.state.name,
                                        exchFromCurrencyAmt: this.state
                                          .exchangeAmount,
                                        exchToCurrency: this.state.toCurrency,
                                        exchToCurrencyRate: this.state
                                          .exchangeRate,
                                        eraswapAcceptAddress: this.state
                                          .userWallet,
                                        eraswapSendAddress: this.state
                                          .exchangeToWallet,
                                        exchangePlatform: this.state
                                          .maxExchange,
                                        totalExchangeAmout: this.state
                                          .totalExchangeAmout,
                                        lctxid: this.state.lctxid,
                                        platformFeePayOpt: platform,
                                        fromWallet: true,
                                      };
                                      axios
                                        .post(
                                          '/apis/txn/verifyAndSave',
                                          dataPushable,
                                        )
                                        .then(data => {
                                          if (data && data.data) {
                                            location.href = '/txnhistory';
                                          }
                                          this.setState({
                                            loader: false,
                                          });
                                        })
                                        .catch(error => {
                                          console.log(error);
                                          this.setState({
                                            loader: false,
                                          });
                                        });
                                    })
                                    .catch(error => {
                                      console.log(error);
                                      this.setState({
                                        loader: false,
                                      });
                                    });
                                } else {
                                  throw res.data.message;
                                }
                              })
                              .catch(error => {
                                this.setState({
                                  sending: false,
                                  recipient: '',
                                  amount: '',
                                });
                                console.log(error);
                              });
                          })
                          .catch(error => {
                            console.log(error);
                          });
                      }
                    })
                    .catch(error => {
                      console.log(error);
                      this.setState({
                        loader: false,
                      });
                    });
                } else {
                  this.setState({
                    loader: false,
                  });
                }
              })
              .catch(error => {
                this.setState({
                  loader: false,
                });
                console.log(error);
              });
          } else {
            notification.open({
              message: 'Entered Amount should be equivalent to $20 or more.',
              description:
                'Please change the amount and try again.\n Entered amout value is estimated $' +
                (usdPrice * this.state.exchangeAmount).toFixed(4),
              icon: (
                <Icon
                  type="frown-circle"
                  style={{
                    color: '#FF0000',
                  }}
                />
              ),
            });
            this.setState({
              loader: false,
            });
          }
        } else {
          this.setState({
            loader: false,
          });
        }
      })
      .catch(error => {
        this.setState({
          loader: false,
        });
        console.log(error);
      });
  };

  onTabChange = key => {
    console.log(key);
    this.setState({
      noTitleKey: key,
    });
  };

  send = () => {
    this.setState({
      sending: true,
    });
    var data = {
      crypto: this.state.name,
      receiver: this.state.recipient.toLocaleLowerCase(),
      amount: this.state.amount,
    };
    console.log(data);
    axios
      .post('/apis/wallet/send', data)
      .then(res => {
        if (res.data.success) {
          notification.open({
            message: 'Success',
            description: 'Transaction sent!',
          });
        }
        console.log(res);
        this.setState({
          sending: false,
          recipient: '',
          amount: '',
        });
      })
      .catch(error => {
        this.setState({
          sending: false,
          recipient: '',
          amount: '',
        });
        console.log(error);
      });
  };

  getBalance = () => {
    this.setState({
      loadingBalance: true,
    });
    axios
      .get('/apis/wallet/getBalance?crypto=' + this.state.name)
      .then(res => {
        console.log(res.data.balance);
        this.setState({
          balance: res.data.balance,
          loadingBalance: false,
        });
      })
      .catch(error => {
        this.setState({
          loadingBalance: false,
        });
        console.log(error);
      });
  };

  getAddress = () => {
    axios
      .get('/apis/wallet/getAddress?crypto=' + this.state.name)
      .then(res => {
        console.log(res.data.address);
        this.setState({
          userWallet: res.data.address,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getHistory = () => {
    axios
      .get('/apis/wallet/getHistory?crypto=' + this.state.name)
      .then(res => {
        console.log(res.data.history);
        this.setState({
          history: res.data.history,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  downloadPrivateKey = () => {
    this.setState({
      gettingPK: true,
    });
    axios
      .get('/apis/wallet/getPrivateKey?crypto=' + this.state.name)
      .then(res => {
        console.log(res.data.address);
        if (res.data.address) {
          this.setState({
            privateKey: res.data.address,
          });
          var element = document.createElement('a');
          element.href =
            'data:application/octet-stream;base64,' + res.data.address;
          element.download = `${this.state.name}_PrivateKey_Eraswap.pdf`;
          element.click();
          document.body.removeChild(element);
        }
        this.setState({
          gettingPK: false,
        });
      })
      .catch(error => {
        this.setState({
          gettingPK: false,
        });
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

  render() {
    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    const size = 'default';
    const state = this.state;

    return (
      <div>
        <Card
          title={this.props.header}
          style={{
            width: '50.2%',
            border: '0px solid',
            borderRadius: '10px',
            backgroundColor: '#345c6f',
            clear: 'both',
            display: 'inline-block',
            float: 'left',
            top: '20px',
            color: '#95a2cd',
          }}
        >
          <div style={{ marginBottom: '0.5%' }}>
            Balance:
            {this.state.balance == '' ? '' : '  ' + this.state.balance}
            {this.state.loadingBalance ? (
              <Spin />
            ) : (
              <Icon
                type="reload"
                onClick={this.getBalance.bind(this)}
                style={{ margin: '0.5%' }}
              />
            )}
          </div>
          <Card
            tabList={sendReceiveTabs}
            activeTabKey={this.state.noTitleKey}
            onTabChange={key => {
              this.onTabChange(key);
            }}
          >
            {this.state.noTitleKey == 'SendForm' ? (
              <Form>
                <FormItem label="Recipient address">
                  <Input
                    type="text"
                    value={this.state.recipient}
                    onChange={e => this.setState({ recipient: e.target.value })}
                    style={{
                      maxWidth: '80.2%',
                      border: '2px solid',
                      borderRadius: '10px',
                    }}
                    size="large"
                  />
                </FormItem>
                <FormItem label="Amount">
                  <Input
                    type="number"
                    value={this.state.amount}
                    onChange={e => this.setState({ amount: e.target.value })}
                    style={{
                      maxWidth: '80.2%',
                      border: '2px solid',
                      borderRadius: '10px',
                    }}
                    size="large"
                  />
                </FormItem>
                <Button
                  type="primary"
                  onClick={this.send.bind(this)}
                  loading={this.state.sending}
                >
                  Send
                </Button>
              </Form>
            ) : (
              <div className={s.container}>
                <QrCode value={this.state.userWallet} />
                <br />
                <br />
                <Input.Search
                  style={{ maxWidth: '80.2%' }}
                  size="large"
                  value={this.state.userWallet}
                  enterButton={<Icon type="copy" />}
                  onSearch={value => {
                    this.copyToClipboard(value);
                  }}
                  disabled={true}
                />
              </div>
            )}
            <hr />
            <Button
              type="primary"
              icon="download"
              size={size}
              loading={this.state.gettingPK}
              onClick={this.downloadPrivateKey}
            >
              Download Private Key
            </Button>
          </Card>
          <Collapse accordion>
          {this.state.name != "EST" ? (
            <Panel header="Exchange" key="1" className={s.blue}>
              <Form layout="inline" onSubmit={this.checkValue}>
                <FormItem label="Convert to">
                  <AutoComplete
                    style={{ maxWidth: '50%' }}
                    dataSource={this.state.conversionTypes}
                    value={this.state.toCurrency}
                    onChange={text => this.setState({ toCurrency: text })}
                    placeholder=""
                    filterOption={(inputValue, option) =>
                      option.props.children
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                </FormItem>
                <FormItem label={'Amount (' + this.state.name + ')'}>
                  <Input
                    type="number"
                    value={this.state.exchangeAmount}
                    onChange={e =>
                      this.setState({ exchangeAmount: e.target.value })
                    }
                    style={{ maxWidth: '50%' }}
                    size="default"
                  />
                </FormItem>
                <FormItem label="Fees">
                  <Checkbox
                    value={this.state.useEstForFees}
                    onChange={e =>
                      this.setState({ useEstForFees: e.target.checked })
                    }
                  >
                    EST [50% off]
                  </Checkbox>
                </FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={this.state.loader}
                  onClick={this.checkValue}
                >
                  Convert
                </Button>
              </Form>
              {this.state.maxExchange === '' &&
                this.state.checkExchanges && (
                  <span>No exchange found for this conversion</span>
                )}
            </Panel>
              ) : ""}
            <Panel header="History" key="2" className={s.blue}>
              <Table
                style={{ overflowX: 'scroll' }}
                dataSource={this.state.history}
              >
                <Column title="Type" dataIndex="type" key="type" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column title="Amount" dataIndex="amount" key="amount" />
                <Column title="Status" dataIndex="status" key="status" />
                <Column title="Date" dataIndex="timeStamp" key="timeStamp" />
                <Column
                  title="Transaction Hash"
                  dataIndex="txnHash"
                  key="txnHash"
                />
              </Table>
            </Panel>
          </Collapse>
        </Card>
      </div>
    );
  }
}

class BtcWalletManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'Bitcoin Wallet',
      type: 'crypto',
      name: 'BTC',
    };
    console.log('manager' + this.state.header);
  }

  render() {
    return (
      <WalletManager
        header={this.state.header}
        type={this.state.type}
        name={this.state.name}
      />
    );
  }
}

class EthWalletManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'Ethereum Wallet',
      type: 'crypto',
      name: 'ETH',
    };
    console.log(props);
    console.log('manager' + this.state.header);
  }

  render() {
    return (
      <WalletManager
        header={this.state.header}
        type={this.state.type}
        name={this.state.name}
      />
    );
  }
}

class EstWalletManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'EST Token Wallet',
      type: 'token',
      name: 'EST',
    };
    console.log(props);
    console.log('manager' + this.state.header);
  }

  render() {
    return (
      <WalletManager
        header={this.state.header}
        type={this.state.type}
        name={this.state.name}
      />
    );
  }
}

class Wallets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'BTC',
      noTitleKey: props.name || 'BTC',
    };
    console.log('props', props);
  }
  componentDidMount = () => {
    if (!localStorage.user) {
      location.href = '/login?how=force';
    }
  };
  contentListNoTitle = {
    BTC: <BtcWalletManager form={this.props.form} />,
    ETH: <EthWalletManager form={this.props.form} />,
    EST: <EstWalletManager form={this.props.form} />,
  };
  render() {
    return (
      <div className={s.root} style={{ textAlign: 'center' }}>
        {console.log('rendering ' + this.state.noTitleKey)}
        {this.contentListNoTitle[this.props.name]}
      </div>
    );
  }
}
export default withStyles(s)(Wallets);
