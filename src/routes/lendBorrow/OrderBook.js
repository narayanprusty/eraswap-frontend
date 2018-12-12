import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderBook.css';
import axios from 'axios';
import orders from './orders';
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

const { Column } = Table;

const FormItem = Form.Item;

class OrderBook extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

    apply = (record) => {
        notification.open({
            message:("Applied"),
            description:("Record Number "+record.uniqueIdentifier)
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            ordersData: [],
            coinFilter: [],
            userFilter: [],
            loadingOrders: false,
        }
    }

    componentDidMount() {
        this.getOrders();
    }

    getOrders = async () => {
        try {
            this.setState({ loadingOrders: true });
            axios.get('/apis/lendingBorrowing/getOrderBook').then(res => {
                console.log(res.data);
                var filters = this.getFilters(res.data);
            
            this.setState({ ordersData: res.data, coinFilter: filters[0], userFilter: filters[1], loadingOrders: false });
            }).catch(error => {
                console.log(error);
            });

            
        } catch (ex) {
            this.setState({ loadingOrders: false });
        }
    }

    getFilters = (data) => {

        var coinFilter = new Set(data.map(a => a.coin), data.map(a => a.collateral));
        data.map(a => coinFilter.add(a.coin));
        data.map(a => coinFilter.add(a.collateral));
        console.log(coinFilter);
        var filter1 = [];
        coinFilter.forEach(a => {
            filter1.push({
                text: a,
                value: a
            });
        });
        console.log("filter", filter1);

        var userFilter = new Set(data.map(a => a.username));
        console.log(userFilter);
        var filter2 = [];
        userFilter.forEach(a => {
            filter2.push({
                text: a,
                value: a
            });
        });
        console.log("filter", filter2);

        return [filter1, filter2];
    }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
            <Card extra={(this.state.loadingOrders ? <Spin /> :
                        <Icon type="reload" onClick={this.getOrders.bind(this)} style={{margin: '0.5%'}} /> )}>
                <Table dataSource={this.state.ordersData} rowKey="uniqueIdentifier">
                    <Column
                        title="Order Type"
                        Key="orderType"
                        dataIndex="orderType"
                        filters={ [{
                            text: 'Lend',
                            value: 'lend',
                          }, {
                            text: 'Borrow',
                            value: 'borrow',
                          }]}
                          filterMultiple= {false}
                          onFilter= {(value, record) => record.orderType.indexOf(value) === 0}
                    />
                    <Column
                            title="User"
                            Key="username"
                            dataIndex="username"
                            filters={this.state.userFilter}
                            filterMultiple= {true}
                            onFilter= {(value, record) => record.username.indexOf(value) === 0}
                        />
                    <Column
                        title="Coin"
                        Key="coin"
                        dataIndex="coin"
                        filters={this.state.coinFilter}
                          filterMultiple= {true}
                          onFilter= {(value, record) => record.coin.indexOf(value) === 0}
                    />
                    <Column
                        title="Collateral Coin"
                        Key="collateral"
                        dataIndex="collateral"
                        filters={this.state.coinFilter}
                          filterMultiple= {true}
                          onFilter= {(value, record) => record.collateral.indexOf(value) === 0}
                    />
                    <Column
                        title="Interest"
                        Key="interest"
                        dataIndex="interest"
                        sorter= {(a, b) => a.interest - b.interest}
                    />
                    <Column
                        title="Months"
                        Key="duration"
                        dataIndex="duration"
                        sorter= {(a, b) => a.duration - b.duration}
                    />
                    <Column
                        title="Amount"
                        Key="amount"
                        dataIndex="amount"
                        sorter= {(a, b) => a.amount - b.amount}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record) => (
                            <span>
                            {record.selfOrder ? "" : <Button type="primary" onClick={this.apply.bind(this, record)}>Apply</Button>}
                            </span>
                        )}
                    />
                </Table>
            </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(OrderBook);
