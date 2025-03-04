import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './Add-p2p.css';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Radio,
  Table,
  List,
  InputNumber,
  notification,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const P2P_FEE = 0.25;
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
  {
    key: 'myRequests',
    tab: 'Sent Requests',
  },
];

class BuyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaymentInputBox: false,
      atPrice: '',
      feeCoin: 'EST',
    };
  }
  componentDidMount = () => {
    axios.get('/apis/ping').then(data => {
      if (data && data.data) {
        console.log('Everything is fine bro');
        this.fetchFeeParams();
      }
    });
    // this.getCurrentBtcValue();
  };
  // componentDidUpdate=()=>{
  //   if(this.state.currency){
  //     this.getCurrentBtcValue(this.state.currency);
  //   }
  // }

  fetchFeeParams = () => {
    axios.get('/apis/p2p/feeParams').then(data => {
      if (data && data.data) {
        this.setState({
          BTC_USD: data.data.BTC,
          ETH_USD: data.data.ETH,
          EST_USD: data.data.EST,
        });
        console.log(data);
      }
    });
  };
  getCurrentBtcValue = (CUR = 'INR', cryptoCur) => {
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
    this.setState({ s_loader: true });
    //cryptoCur is the crypto attribute
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', JSON.stringify(values));
        this.setState(values);
        if (this.props.sell) {
          notification.open({
            message: 'listing selling request, please wait.',
          });
          //create sell listing here
          axios
            .post('/apis/p2p/add_sell_listing', {
              ...values,
              marginPercent: this.state.marginPercent,
              fixedPrice: this.state.fixedPrice,
            })
            .then(data => {
              if (data) {
                console.log(data.data);
                this.setState({ s_loader: false });
                notification.open({
                  message: 'Please go to All My Listing tab to view.',
                });
              } else {
                this.setState({ s_loader: false });
                console.log(data);
              }
            });
        } else {
          //create buy listing here
          notification.open({
            message: 'listing buying request, please wait.',
          });
          axios
            .post('/apis/p2p/add_buy_listing', {
              ...values,
              marginPercent: this.state.marginPercent,
              fixedPrice: this.state.fixedPrice,
            })
            .then(data => {
              if (data) {
                this.setState({ s_loader: false });
                notification.open({
                  message: 'Please go to My Listing tab to view.',
                });
              } else {
                this.setState({ s_loader: false });

                console.log(data);
              }
            });
        }
      } else {
        this.setState({ s_loader: false });
      }
    });
  };
  onRadioChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
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
  marginInputChange = value => {
    this.setState({ marginPercent: value });
  };
  fixedAmountChange = value => {
    this.setState({ fixedPrice: value });
  };

  childrenCurrList = () => {
    const c = [
      'AED',
      'USD',
      'INR',
      'LBP',
      'BOB',
      'CRC',
      'PHP',
      'PLN',
      'JPY',
      'JOD',
      'PAB',
      'GBP',
      'DZD',
      'CHF',
      'ARS',
      'SAR',
      'EGP',
      'CNY',
      'ZAR',
      'OMR',
      'AUD',
      'SGD',
      'NOK',
      'MAD',
      'ILS',
      'NIO',
      'HKD',
      'TWD',
      'BGN',
      'ISK',
      'UYU',
      'KRW',
    ];
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
    let c = [
      'Bank Transfer',
      'Crypto',
      'Cash',
      'Paypal',
      'Paytm',
      'Online Transfer',
      'Phone Pe',
      'Google Pay',
      'other',
    ];

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
              rules: [
                { required: true, message: 'Crypto currency is required!' },
              ],
            })(
              <Select
                showSearch
                name="cryptoCur"
                placeholder="Select Crypto Currency"
                value={this.props.cryptoCur}
                size={size}
                style={{ width: '30%' }}
                onChange={this.handleSelectChange3rd}
              >
                <Option key="1" value="EST">
                  EST
                </Option>
                <Option key="2" value="BTC">
                  BTC
                </Option>
                <Option key="3" value="ETH">
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
                showSearch
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
            label="Currency"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('currency', {
              rules: [{ required: true, message: 'Please select currency!' }],
            })(
              <Select
                showSearch
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
              rules: [
                { required: true, message: 'Please Enter your location!' },
              ],
            })(
              <Input
                rows={5}
                placeholder="Enter Your location"
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
                { required: true, message: 'Please enter maximum limit!' },
                { min: 0, message: 'number should be positive' },
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
                { min: 0, message: 'number should be positive' },
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
          {this.props.sell && (
            <FormItem
              label="Pay fee using"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('feeCoin', {
                rules: [
                  { required: true, message: 'Please Choose Your Fee Coin' },
                ],
              })(
                <RadioGroup
                  name="feeCoin"
                  onChange={this.onRadioChange}
                  value={this.state.feeCoin || 'EST'}
                >
                  <Radio value={'EST'} checked={true}>
                    {this.state.maxAmt || this.state.minAmt
                      ? (this.state.maxAmt || this.state.minAmt) *
                        this.state[`${this.state.cryptoCur}_USD`] /
                        this.state.EST_USD *
                        (P2P_FEE / 2) /
                        100
                      : '-'}{' '}
                    EST [Default] [50% off]
                  </Radio>
                  {this.state.cryptoCur &&
                    this.state.cryptoCur != 'EST' && (
                      <Radio value={this.state.cryptoCur}>
                        {this.state.maxAmt || this.state.minAmt
                          ? (this.state.maxAmt || this.state.minAmt) *
                            P2P_FEE /
                            100
                          : '-'}{' '}
                        {this.state.cryptoCur}
                      </Radio>
                    )}
                </RadioGroup>,
              )}
              *Note: {P2P_FEE}% of the selected coin
            </FormItem>
          )}
          <FormItem
            label="@ Price"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('atPrice', {
              rules: [{ required: true, message: 'Please Choose Your Price' }],
            })(
              <RadioGroup
                name="atPrice"
                onChange={this.onRadioChange}
                value={this.state.atPrice}
              >
                <Radio value={1}>Float By Market Price</Radio>
                <Radio value={2}>Fixed Price</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          {this.state.atPrice === 1 && (
            <FormItem
              label="Margin Percent"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('marginPercent', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your margin  parcent!',
                  },
                ],
              })(
                <InputNumber
                  width={100}
                  min={0}
                  placeholder="Margin percentage %"
                  onChange={this.marginInputChange}
                  name="marginPercent"
                  addonAfter={this.state.currency || '%'}
                />,
              )}
              <br />
              [i.e.{' '}
              {this.state.marginPercent
                ? this.state[this.state.cryptoCur + '_USD'] *
                    this.state.marginPercent /
                    100 +
                  this.state[this.state.cryptoCur + '_USD']
                : this.state[this.state.cryptoCur + '_USD']}
              {' USD/' + (this.state.cryptoCur || 'EST')} equivalent amount in{' '}
              {this.state.currency || 'USD'}]
            </FormItem>
          )}
          {this.state.atPrice === 2 &&
            this.state.cryptoCur && (
              <FormItem
                label={'fixedPrice [for 1 ' + this.state.cryptoCur + ']'}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('fixedPrice', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your fixed Price!',
                    },
                  ],
                })(
                  <InputNumber
                    min={0}
                    width={100}
                    placeholder="fixed Price amount"
                    onChange={this.fixedAmountChange}
                    name="fixedPrice"
                    addonAfter={this.state.currency || 'USD'}
                  />,
                )}
              </FormItem>
            )}

          <FormItem wrapperCol={{ span: 12, offset: 5 }}>
            <Button
              type="primary"
              loading={this.state.s_loader}
              htmlType="submit"
              disabled={
                !(
                  Number(this.state.maxAmt) > 0 &&
                  Number(this.state.minAmt) >= 0 &&
                  Number(this.state.maxAmt) >= Number(this.state.minAmt)
                )
              }
            >
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

class MyListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EST_VAL: {},
      BTC_VAL: {},
      ETH_VAL: {},
      data: [],
      pagination: {},
      loading: false,
    };
  }
  columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true,
      // render: name => `${name.first} ${name.last}`,
      width: '20%',
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      render: date => {
        if (!date) {
          return '-';
        }
        return (
          new Date(parseInt(date.toString())).toLocaleDateString() +
          ' ' +
          new Date(parseInt(date.toString())).toLocaleTimeString()
        );
      },
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      width: '20%',
    },
    {
      title: 'Price',
      dataIndex: 'fullPrice',
      render: (fieldVal, record) =>
        `${fieldVal} ${record.currency}/${record.cryptoCur}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Currency',
      dataIndex: 'cryptoCur',
      render: (fieldVal, record) => `${fieldVal ? fieldVal : 'BTC'}`,
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
      title: 'Type',
      dataIndex: 'wantsToBuy',
      render: fieldValue => `${fieldValue ? 'Buy' : 'Sell'}`,
    },
    {
      title: '',
      dataIndex: 'show',
      render: (fieldVal, record) => {
        return (
          <Button
            type="primary"
            onClick={this.updation.bind(
              this,
              record,
              fieldVal || this.state[record.uniqueIdentifier] || false,
            )}
          >
            {fieldVal || this.state[record.uniqueIdentifier]
              ? 'Inactive'
              : 'Active'}
          </Button>
        );
      },
    },
  ];
  conVertObjToArr = async record => {
    return axios
      .get('/apis/p2p/getInterests?listingId=' + record.uniqueIdentifier)
      .then(data => {
        if (data && data.data) {
          let pushable = [];
          for (let i of data.data.userRequests) {
            delete i._id;
            i.username = i.userId ? i.userId.username : 'User not found';
            i.userId = i.userId ? i.userId._id : 'User not found';
            pushable.push(i);
          }
          console.log(pushable);
          return pushable;
        }
      });
  };
  updation = (record, fieldValue) => {
    notification.open({ message: 'Making your listing inactive' });
    this.setState({
      [record.uniqueIdentifier]: true,
    });
    const data = {
      id: record.uniqueIdentifier,
      active: fieldValue,
    };
    return axios.post('/apis/p2p/change_status', data).then(data => {
      notification.open({ message: 'Listing Inactive successfull!' });
      return data;
    });
  };
  initMatch = (record, item) => {
    notification.open({
      message: 'Matching!, please wait...',
    });
    this.setState({
      [`${record.uniqueIdentifier}_loader`]: {
        [item.userId]: true,
      },
    });
    console.log('Clicked initmatch', record, item);
    const Postdata = {
      listingId: record.uniqueIdentifier,
      sellerEmail: item.sellerEmail,
      requester: item.userId,
      amount: item.amount,
      cryptoCurrency: record.cryptoCur,
      feeCoin: item.sellerFeeCoin,
    };
    return axios.post('/apis/p2p/makeMatch', Postdata).then(data => {
      this.setState({
        [`${record.uniqueIdentifier}_loader`]: {
          [item.userId]: false,
        },
      });
      //make that match button and all the match button in that disabled maybe setstate and check for listingId_
      if (data && data.data) {
        console.log(data.data);
        this.setState({
          [record.uniqueIdentifier + '_match']: {
            [item.userId]: true,
          },
        });
        notification.open({
          message: 'Match Success!, please refresh the page',
        });
        return data.data;
      }
    });
  };

  getCurrentBtcValue = (CUR = 'INR', cryptoCur) => {
    return axios.get(
      `/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`,
    );
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch(
      {},
      {
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      },
    );
  };
  fetch = (query, params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });

    axios
      .get('/apis/p2p/my_listings_count', {
        params: query,
      })
      .then(countData => {
        axios({
          url: '/apis/p2p/my_listings',
          params: {
            results: 10,
            ...params,
            query: query,
          },
          method: 'get',
          type: 'json',
        }).then(async data => {
          const pagination = { ...this.state.pagination };
          // Read total count from server
          // pagination.total = data.totalCount;

          pagination.total = countData.data;
          let allData = [];

          for (let i of data.data) {
            let BTCVAl;
            if (i.fixedPrice) {
              BTCVAl = i.fixedPrice;
            } else if (
              this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][i.currency]
            ) {
              BTCVAl =
                this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][
                  i.currency
                ] +
                this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][
                  i.currency
                ] *
                  (i.marginPercent ? i.marginPercent / 100 : 0 / 100);
            } else {
              let awaitData = await this.getCurrentBtcValue(
                i.currency,
                i.cryptoCur ? i.cryptoCur : 'BTC',
              );
              BTCVAl = awaitData.data.data;
              this.setState({
                [`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`]: {
                  ...this.state[i.cryptoCur ? i.cryptoCur : 'BTC'],
                  [i.currency]: BTCVAl,
                },
              });
              BTCVAl =
                awaitData.data.data +
                (awaitData.data.data +
                  (i.marginPercent ? i.marginPercent / 100 : 0 / 100));
            }
            i.requests = await this.conVertObjToArr(i);
            this.setState;
            i.fullPrice = BTCVAl;
            allData.push(i);
          }
          this.setState({
            loading: false,
            data: allData,
            pagination,
          });
        });
      });
  };
  finishDeal = async (record, item) => {
    this.setState({
      [`${record.uniqueIdentifier}_loaderFinish`]: {
        [item.userId]: true,
      },
    });
    notification.open({
      message:
        'Please wait while we process the deal.\n please dont close the browser.',
    });

    var id = this.state[`${record.uniqueIdentifier}_id`];
    const data = {
      id: id,
      record: record,
      item: item,
    };
    return axios
      .post('/apis/p2p/finishDeal', data)
      .then(data => {
        notification.open({
          message: 'Deal Successfully closed! please wait refreshing the page.',
        });

        this.setState({
          [`${record.uniqueIdentifier}_loaderFinish`]: {
            [item.userId]: false,
          },
          [`${record.uniqueIdentifier}_matched`]: {
            [item.userId]: true,
          },
        });
        location.reload();
        return data;
      })
      .catch(error => {
        notification.open({
          message: error.response.data.message,
          // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
          icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
        });
        this.setState({
          [`${record.uniqueIdentifier}_loaderFinish`]: {
            [item.userId]: false,
          },
        });
      });
  };

  myListMatches = () => {
    return axios.get('/apis/p2p/myListMatches').then(data => {
      if (data.data) {
        console.log(data.data);
        for (let i of data.data) {
          if (i.iPaidVal && i.txnConfirmed && !i.finished) {
            this.setState({
              [`${i.listingId}_matched`]: {
                [i.requester]: true,
              },
              [`${i.listingId}_id`]: i.uniqueIdentifier,
            });
          } else if (i.finished) {
            this.setState({
              [`${i.listingId}_finished`]: {
                [i.requester]: true,
              },
            });
          }
          this.setState({
            [`${i.listingId}_match`]: {
              [i.requester]: true,
            },
            [`${i.listingId}_match_fee`]: i.fee,
            [`${i.listingId}_match_feeCoin`]: i.feeCoin,
          });
        }
        return data.data;
      }
    });
  };

  componentDidMount() {
    axios.get('/apis/ping').then(data => {
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
        style={{ wordWrap: 'break-word' }}
        columns={this.columns}
        rowKey={record => record._id}
        dataSource={this.state.data}
        expandedRowRender={record => (
          <List
            // grid={{ gutter: 16, column: 4 }}
            itemLayout="horizontal"
            dataSource={record.requests}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    loading={
                      this.state[`${record.uniqueIdentifier}_loader`] &&
                      this.state[`${record.uniqueIdentifier}_loader`][
                        item.userId
                      ]
                    }
                    onClick={this.initMatch.bind(this, record, item)}
                    disabled={
                      this.state[`${record.uniqueIdentifier}_match`]
                        ? true
                        : false
                    }
                  >
                    {this.state[`${record.uniqueIdentifier}_match`] &&
                    this.state[`${record.uniqueIdentifier}_match`][item.userId]
                      ? 'Matched'
                      : 'Match'}
                  </Button>,
                  ((this.state[`${record.uniqueIdentifier}_matched`] &&
                    this.state[`${record.uniqueIdentifier}_matched`][
                      item.userId
                    ]) ||
                    (this.state[`${record.uniqueIdentifier}_finished`] &&
                      this.state[`${record.uniqueIdentifier}_finished`][
                        item.userId
                      ])) && (
                    <Button
                      type="primary"
                      loading={
                        this.state[`${record.uniqueIdentifier}_loaderFinish`] &&
                        this.state[`${record.uniqueIdentifier}_loaderFinish`][
                          item.userId
                        ]
                      }
                      onClick={this.finishDeal.bind(this, record, item)}
                      disabled={
                        this.state[`${record.uniqueIdentifier}_matched`] &&
                        this.state[`${record.uniqueIdentifier}_matched`][
                          item.userId
                        ]
                          ? false
                          : true
                      }
                    >
                      {this.state[`${record.uniqueIdentifier}_matched`] &&
                      this.state[`${record.uniqueIdentifier}_matched`][
                        item.userId
                      ]
                        ? 'Finish Deal'
                        : this.state[`${record.uniqueIdentifier}_finished`] &&
                          this.state[`${record.uniqueIdentifier}_finished`][
                            item.userId
                          ]
                          ? 'Deal closed'
                          : null}
                    </Button>
                  ),
                  this.state[`${record.uniqueIdentifier}_match_fee`] && (
                    <span>
                      Seller Fee:{' '}
                      {this.state[`${record.uniqueIdentifier}_match_fee`] +
                        ' ' +
                        this.state[`${record.uniqueIdentifier}_match_feeCoin`]}
                    </span>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={item.username}
                  description={'message: ' + item.message}
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

class MyRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EST_VAL: {},
      BTC_VAL: {},
      ETH_VAL: {},
      data: [],
      pagination: {},
      loading: false,
    };
  }
  columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      sorter: true,
      // render: name => `${name.first} ${name.last}`,
      width: '20%',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      width: '20%',
    },
    {
      title: 'Price',
      dataIndex: 'fullPrice',
      render: (fieldVal, record) =>
        `${fieldVal} ${record.currency}/${record.cryptoCur}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Currency',
      dataIndex: 'cryptoCur',
      render: (fieldVal, record) => `${fieldVal ? fieldVal : 'BTC'}`,
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
      title: 'Type',
      dataIndex: 'wantsToBuy',
      render: fieldValue => `${fieldValue ? 'Buy' : 'Sell'}`,
    },
    {
      title: '',
      dataIndex: 'notNeeded',
      render: (fieldVal, record) => {
        return (
          <Button
            type="primary"
            loading={this.state[record.uniqueIdentifier + '_loading']}
            onClick={this.updation.bind(this, record)}
            disabled={this.state[record.uniqueIdentifier] ? false : true}
          >
            {this.state[record.uniqueIdentifier]
              ? record.wantsToBuy ? 'Received Payment' : 'I Have Paid'
              : `${this.state[record.uniqueIdentifier]}_finished`
                ? 'Paid'
                : 'Not Matched'}
          </Button>
        );
      },
    },
    {
      title: '',
      dataIndex: 'notNeeded1',
      render: (fieldVal, record) => {
        if (record.requests[0] && record.wantsToBuy) {
          return <span>Fee: {record.requests[0].fee}</span>;
        } else {
          return '-';
        }
      },
    },
  ];
  conVertObjToArr = async record => {
    return axios
      .get('/apis/p2p/getInterests?listingId=' + record.uniqueIdentifier)
      .then(data => {
        if (data && data.data) {
          let pushable = [];
          for (let i of data.data.userRequests) {
            delete i._id;
            i.username = i.userId.username;
            i.userId = i.userId._id;
            i.fee = i.fee;
            pushable.push(i);
          }
          console.log(pushable);
          return pushable;
        }
      });
  };
  updation = record => {
    this.setState({
      [record.uniqueIdentifier + '_loading']: true,
    });
    notification.open({
      message: 'sending your response!, please wait.',
    });
    delete this.state[record.uniqueIdentifier];
    var id = this.state[`${record.uniqueIdentifier}_id`];
    const data = {
      id: id,
    };
    return axios.post('/apis/p2p/change_status_paid', data).then(data => {
      if (data.data) {
        this.setState({
          [record.uniqueIdentifier + '_loading']: false,
          [record.uniqueIdentifier]: false,
        });
        notification.open({
          message: 'your response sent, please refresh the page.',
        });
        return data;
      } else {
        this.setState({
          [record.uniqueIdentifier + '_loading']: false,
        });
        notification.open({
          message: 'Unknown error occurred!',
        });
      }
    });
  };
  initMatch = (record, item) => {
    notification.open({
      message: 'Matching, please wait...',
    });
    console.log('Clicked initmatch', record, item);
    const Postdata = {
      listingId: record.uniqueIdentifier,
      sellerEmail: item.sellerEmail,
      requester: item.userId,
      amount: item.amount,
      cryptoCurrency: record.cryptoCur,
      feeCoin: item.sellerFeeCoin,
    };
    return axios.post('/apis/p2p/makeMatch', Postdata).then(data => {
      //make that match button and all the match button in that disabled maybe setstate and check for listingId_
      if (data && data.data) {
        console.log(data.data);
        this.setState({
          [record.uniqueIdentifier]: {
            [item.userId]: true,
          },
        });
        return data.data;
      }
    });
  };

  getCurrentBtcValue = (CUR = 'INR', cryptoCur) => {
    return axios.get(
      `/apis/cur/current_BTC?currency=${CUR}&cryptoCur=${cryptoCur}`,
    );
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch(
      {},
      {
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      },
    );
  };
  fetch = (query, params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });

    axios({
      url: '/apis/p2p/getMyrequests',
      method: 'get',
      type: 'json',
    }).then(async data => {
      // Read total count from server
      // pagination.total = data.totalCount;
      let allData = [];

      for (let i of data.data) {
        let BTCVAl;
        if (i.fixedPrice) {
          BTCVAl = i.fixedPrice;
        } else if (
          this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][i.currency]
        ) {
          BTCVAl =
            this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][i.currency] +
            (this.state[`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`][
              i.currency
            ] +
              (i.marginPercent ? i.marginPercent / 100 : 0 / 100));
        } else {
          let awaitData = await this.getCurrentBtcValue(
            i.currency,
            i.cryptoCur ? i.cryptoCur : 'BTC',
          );
          BTCVAl = awaitData.data.data;

          this.setState({
            [`${i.cryptoCur ? i.cryptoCur : 'BTC'}_VAL`]: {
              ...this.state[i.cryptoCur ? i.cryptoCur : 'BTC'],
              [i.currency]: BTCVAl,
            },
          });
          BTCVAl =
            awaitData.data.data +
            awaitData.data.data *
              (i.marginPercent ? i.marginPercent / 100 : 0 / 100);
        }
        i.requests = await this.conVertObjToArr(i);
        this.setState;
        i.fullPrice = BTCVAl;
        allData.push(i);
      }
      this.setState({
        loading: false,
        data: allData,
      });
    });
  };
  myListMatches = () => {
    return axios.get('/apis/p2p/requesterListMatches').then(data => {
      if (data.data) {
        console.log(data.data);
        for (let i of data.data) {
          if (i.showIpaid && !i.finished) {
            this.setState({
              [`${i.listingId}`]: true,
              [`${i.listingId}_id`]: i.uniqueIdentifier,
            });
          } else if (i.finished) {
            this.setState({
              [`${i.listingId}_finished`]: true,
            });
          }
        }
        return data.data;
      }
    });
  };

  componentDidMount() {
    axios.get('/apis/ping').then(data => {
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
        style={{ wordWrap: 'break-word' }}
        columns={this.columns}
        rowKey={record => record.uniqueIdentifier}
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
        //       disabled={this.state[`${record.uniqueIdentifier}_match`] ? true : false }
        //     >
        //       {this.state[`${record.uniqueIdentifier}_match`] && this.state[`${record.uniqueIdentifier}_match`][item.userId] ? 'Matched' :  'Match'}
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
  componentDidMount = () => {
    if (!localStorage.user) {
      location.href = '/login?how=force';
    }
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  getFieldDecorator = this.props.form;
  contentListNoTitle = {
    buy: <BuyComponent form={this.props.form} />,
    sell: <BuyComponent form={this.props.form} sell={true} />,
    myList: <MyListComponent />,
    myRequests: <MyRequests />,
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
