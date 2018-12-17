import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import s from './PlaceOrder.css';
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
    Badge,
    notification,
    Dropdown,
    Menu,
    AutoComplete, 
    Checkbox
  } from 'antd';

  const FormItem = Form.Item;

const lendBorrowTabs = [
    {
      key: 'LendForm',
      tab: 'Lend',
    },
    {
      key: 'BorrowForm',
      tab: 'Borrow',
    },
  ];

class PlaceOrder extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

    constructor(props) {
        super(props);
        this.state = {
            noTitleKey: 'LendForm',
            lendingCoinsOption: [],
            lendingCoin: "",
            borrowingCoinsOption: [],
            borrowingCoin: "",
            collateralCoinsOption: [],
            collateralCoin: "",
            interestRate: "",
            months: "",
            amount: "",
            placingOrder: false,
        }
    }

    componentDidMount() {
        this.getCoinsOptions();
    }

    getCoinsOptions = async () => {
        axios.get('/apis/lendingBorrowing/getCoinsOptions').then(res => {
            console.log(res.data);
            if (res.data.length)
                this.setState({ lendingCoinsOption: res.data, borrowingCoinsOption: res.data });
        }).catch(error => {
            console.log(error);
        });
    }

    onLendingCoinSelection = async (text) => {
        this.setState({ lendingCoin: text });
        axios.get('/apis/lendingBorrowing/getCollateralCoinsOptions?crypto=' + text).then(res => {
            console.log(res.data);
            if (res.data.length)
                this.setState({ collateralCoinsOption: res.data, collateralCoin: "" });
        }).catch(error => {
            console.log(error);
        });
    }

    onBorrowingCoinSelection = async (text) => {
        this.setState({ borrowingCoin: text });
        axios.get('/apis/lendingBorrowing/getCollateralCoinsOptions?crypto=' + text).then(res => {
            console.log(res.data.balance);
            this.setState({ collateralCoinsOption: res.data, collateralCoin: "" });
        }).catch(error => {
            console.log(error);
        });
    }

    onTabChange = (key) => {
        if (!this.state.placingOrder) {
            console.log(key);
            this.setState({
                noTitleKey: key,
                lendingCoin: "",
                borrowingCoin: "",
                collateralCoin: "",
                interestRate: "",
                months: "",
                amount: "",
                collateralCoinsOption: [],
            });
            this.getCoinsOptions();
        }
    };

    placeLendingOrder = async (e) => {
        console.log("lending order", (this.state.lendingCoin != this.state.collateralCoin && this.state.months > 0 && this.state.amount > 0));
        e.preventDefault();
        if (this.state.lendingCoin != this.state.collateralCoin && this.state.months > 0 && this.state.amount > 0) {
            this.setState({
                placingOrder: true,
            });

            var data = {
                orderType: 'lend',
                coin: this.state.lendingCoin,
                collateral: this.state.collateralCoin,
                interest: this.state.interestRate,
                duration: this.state.months,
                amount: this.state.amount,
            };
            console.log(data);
            axios.post('/apis/lendingBorrowing/placeOrder', data).then(res => {
                console.log(res);
                if (res.data.success) {
                    notification.open({
                        message: 'Success',
                        description: 'Order placed!',
                    });
                }
                else{
                    notification.open({
                        message: 'Failed',
                        description: res.data.message,
                        icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                    });
                }
                console.log(res);
                this.setState({
                    placingOrder: false,
                });
            }).catch(error => {
                this.setState({
                    placingOrder: false,
                });
                notification.open({
                    message: 'Failed',
                    description: error.message,
                    icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                });
                console.log(error);
            });
        }
    }

    placeBorrowingOrder = async (e) => {
        e.preventDefault();
        if (this.state.borrowingCoin != this.state.collateralCoin && this.state.months > 0 && this.state.amount > 0) {
            this.setState({
                placingOrder: true,
            });

            var data = {
                orderType: 'borrow',
                coin: this.state.borrowingCoin,
                collateral: this.state.collateralCoin,
                interest: this.state.interestRate,
                duration: this.state.months,
                amount: this.state.amount,
            };
            console.log(data);
            axios.post('/apis/lendingBorrowing/placeOrder', data).then(res => {
                if (res.data.success) {
                    notification.open({
                        message: 'Success',
                        description: 'Order placed!',
                    });
                }
                else{
                    notification.open({
                        message: 'Failed',
                        description: res.data.message,
                        icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                    });
                }
                console.log(res);
                this.setState({
                    placingOrder: false,
                });
            }).catch(error => {
                this.setState({
                    placingOrder: false,
                });
                notification.open({
                    message: 'Failed',
                    description: error.message,
                    icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                });
                console.log(error);
            });
        }
    }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
            <Card
                tabList={lendBorrowTabs}
                activeTabKey={this.state.noTitleKey}
                onTabChange={key => {
                this.onTabChange(key);
                }}
            >
                {
                    this.state.noTitleKey == "LendForm" ? 
                    (
                        <Card title="Lending Coin Form">
                            <Form onSubmit={this.placeLendingOrder}>
                                <FormItem
                                    label="Lending Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.lendingCoinsOption}
                                            value={this.state.lendingCoin}
                                            onChange={this.onLendingCoinSelection}
                                            placeholder="Select Lending Coin"
                                            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Collateral Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.collateralCoinsOption}
                                            value={this.state.collateralCoin}
                                            onChange={text => this.setState({collateralCoin: text})}
                                            placeholder="Select Collateral Coin"
                                            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    />
                                </FormItem>
                                <FormItem
                                        label="Interest Rate" >
                                        <Input 
                                            type="number"
                                            value={this.state.interestRate}
                                            onChange={e => this.setState({interestRate: e.target.value})}
                                            style={{ maxWidth: '40%' }}
                                            size="default"
                                            placeholder="Enter interest rate"
                                        />
                                </FormItem>
                                <FormItem
                                    label="Months" >
                                    <Input 
                                        type="number"
                                        value={this.state.months}
                                        onChange={e => this.setState({months: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
                                        placeholder="Enter duration"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Amount" >
                                    <Input 
                                        type="number"
                                        value={this.state.amount}
                                        onChange={e => this.setState({amount: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
                                        addonBefore="$"
                                        placeholder="Enter amount"
                                    />
                                </FormItem>
                                <Button type="primary" htmlType="submit" loading={this.state.placingOrder}>
                                        Place Order
                                </Button>
                            </Form>
                        </Card>
                    ) 
                    :
                    (
                        <Card title="Borrowing Coin Form">
                            <Form onSubmit={this.placeBorrowingOrder}>
                                <FormItem
                                    label="Borrowing Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.borrowingCoinsOption}
                                            value={this.state.borrowingCoin}
                                            onChange={this.onBorrowingCoinSelection}
                                            placeholder="Select Borrowing Coin"
                                            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Collateral Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.collateralCoinsOption}
                                            value={this.state.collateralCoin}
                                            onChange={text => this.setState({collateralCoin: text})}
                                            placeholder="Select Collateral Coin"
                                            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    />
                                </FormItem>
                                <FormItem
                                        label="Interest Rate" >
                                        <Input 
                                            type="number"
                                            value={this.state.interestRate}
                                            onChange={e => this.setState({interestRate: e.target.value})}
                                            style={{ maxWidth: '40%' }}
                                            size="default"
                                            placeholder="Enter interest rate"
                                        />
                                </FormItem>
                                <FormItem
                                    label="Months" >
                                    <Input 
                                        type="number"
                                        value={this.state.months}
                                        onChange={e => this.setState({months: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
                                        placeholder="Enter duration"
                                    />
                                </FormItem>
                                <FormItem
                                    label="Amount" >
                                    <Input 
                                        type="number"
                                        value={this.state.amount}
                                        onChange={e => this.setState({amount: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
                                        addonBefore="$"
                                        placeholder="Enter amount"
                                    />
                                </FormItem>
                                <Button type="primary" htmlType="submit" loading={this.state.placingOrder}>
                                        Place Order
                                </Button>
                            </Form>
                        </Card>
                    ) 
                }
            </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(PlaceOrder);
