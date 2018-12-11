import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderBook.css';
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
            description:("Record Number "+record.id)
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            ordersData: [],
            coinFilter: [],
            loadingOrders: false,
        }
    }

    componentDidMount() {
        this.getOrders();
        var filters = this.getFilters.bind(this)();
        this.setState({
            ordersData: orders,
            coinFilter: filters,
        });
    }

    getOrders = async () => {
        try {
            this.setState({ loadingOrders: true });
            var ordersData = orders;

            var filters = this.getFilters();
            
            this.setState({ ordersData: ordersData, coinFilter: filters, loadingOrders: false });
        } catch (ex) {
            this.setState({ loadingOrders: false });
        }
    }

    getFilters = () => {
        var coinFilter = new Set(orders.map(a => a.coin), orders.map(a => a.collateralCoin));
        console.log(coinFilter);
        var filter = [];
        coinFilter.forEach(a => {
            filter.push({
                text: a,
                value: a
            });
        });
        console.log("filter", filter);
        return filter;
    }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
            <Card extra={(this.state.loadingOrders ? <Spin /> :
                        <Icon type="reload" onClick={this.getOrders.bind(this)} style={{margin: '0.5%'}} /> )}>
                <Table dataSource={this.state.ordersData}>
                    <Column
                        title="Order Type"
                        Key="type"
                        dataIndex="type"
                        filters={ [{
                            text: 'Lending',
                            value: 'Lending',
                          }, {
                            text: 'Borrowing',
                            value: 'Borrowing',
                          }]}
                          filterMultiple= {false}
                          onFilter= {(value, record) => record.type.indexOf(value) === 0}
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
                        Key="collateralCoin"
                        dataIndex="collateralCoin"
                        filters={this.state.coinFilter}
                          filterMultiple= {true}
                          onFilter= {(value, record) => record.collateralCoin.indexOf(value) === 0}
                    />
                    <Column
                        title="Interest"
                        Key="interest"
                        dataIndex="interest"
                        sorter= {(a, b) => a.interest - b.interest}
                    />
                    <Column
                        title="Months"
                        Key="months"
                        dataIndex="months"
                        sorter= {(a, b) => a.months - b.months}
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
                            <Button type="primary" onClick={this.apply.bind(this, record)}>Apply</Button>
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
