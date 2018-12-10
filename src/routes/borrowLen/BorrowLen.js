import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BorrowLen.css';
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

class BorrowLen extends React.Component {
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
                amount: ""
            });
        }
    };

    placeLendingOrder = (e) => {
        e.preventDefault();
        this.setState({
            placingOrder: true,
        });

        try {

            this.setState({
                placingOrder: false,
            });
        } catch (ex) {
            this.setState({
                placingOrder: false,
            });
        }
    }

    placeBorrowingOrder = (e) => {
        e.preventDefault();
        this.setState({
            placingOrder: true,
        });

        try {

            this.setState({
                placingOrder: false,
            });
        } catch (ex) {
            this.setState({
                placingOrder: false,
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
                        <Card title="Lend">
                            <Form onSubmit={this.placeLendingOrder}>
                                <FormItem
                                    label="Lending Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.lendingCoinsOption}
                                            value={this.state.lendingCoin}
                                            onChange={text => this.setState({lendingCoin: text})}
                                            placeholder=""
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
                                            placeholder=""
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
                                    />
                                </FormItem>
                                <FormItem
                                    label="Amount" >
                                    <Input 
                                        type="number"
                                        value={this.state.lendingAmount}
                                        onChange={e => this.setState({lendingAmount: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
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
                        <Card title="Borrow">
                            <Form onSubmit={this.placeBorrowingOrder}>
                                <FormItem
                                    label="Borrowing Coin" >
                                    <AutoComplete
                                            style={{ maxWidth: '40%' }}
                                            dataSource={this.state.borrowingCoinsOption}
                                            value={this.state.borrowingCoin}
                                            onChange={text => this.setState({borrowingCoin: text})}
                                            placeholder=""
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
                                            placeholder=""
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
                                    />
                                </FormItem>
                                <FormItem
                                    label="Amount" >
                                    <Input 
                                        type="number"
                                        value={this.state.lendingAmount}
                                        onChange={e => this.setState({lendingAmount: e.target.value})}
                                        style={{ maxWidth: '40%' }}
                                        size="default"
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

export default withStyles(s)(BorrowLen);
