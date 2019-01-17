import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Agreements.css';
import agreementsData from './agreementsData';
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
    Badge,
    notification,
    Dropdown,
    Menu,
    AutoComplete,
    Checkbox
} from 'antd';

const FormItem = Form.Item;
const { Column } = Table;

class Agreements extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
      };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            coinFilter: [],
            userFilter: [],
            agreementsData: [],
        }
    }

    componentDidMount() {
        this.getAgreements();
    }

    getAgreements = async () => {
        try {
            this.setState({ loading: true });
            axios.get('/apis/lendingBorrowing/getAgreements').then(res => {
                console.log(res.data);
                var filters = this.getFilters(res.data);

                this.setState({ agreementsData: res.data, coinFilter: filters[0], userFilter: filters[1], loading: false });

            }).catch(error => {
                this.setState({ loading: false });
                console.log(error);
            });
        } catch (ex) {
            this.setState({ loading: false });
        }
    }

    convertToPlainNumber = (number) => {
        if (number.toString().indexOf("e") != -1) {
            var parts = number.toString().split("e");
            if (parts.length >= 2) {
                var exp = parts[1] > 0 ? parts[1] : parts[1] * -1;
                var extra = 0;
                if(parts[0].indexOf(".") != -1){
                    extra = parts[0].split(".")[1].length;
                }
                return number.toFixed(extra + exp);
            }
            return parts[0];
        }
        return number;
    }

    getFilters = (data) => {
        var coinFilter = new Set(data.map(a => a.coin), data.map(a => a.collateralCoin));
        console.log(coinFilter);
        var filter1 = [];
        coinFilter.forEach(a => {
            filter1.push({
                text: a,
                value: a
            });
        });
        console.log("filter", filter1);

        var userFilter = new Set(data.map(a => a.user));
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
                <Card extra={(this.state.loading ? <Spin /> :
                        <Icon type="reload" onClick={this.getAgreements.bind(this)} style={{margin: '0.5%'}} /> )}>
                    <Table    style={{wordWrap:'break-word'}} dataSource={this.state.agreementsData}
                        expandedRowRender=
                        {
                            record => {
                            return <p style={{ margin: 0 }}>Payment Due date: {new Date(record.nextPaymentDate).toDateString()}
                            <br />EMI: {this.convertToPlainNumber(record.nextPayment)}
                            <br />Number of EMI Paid: {record.emiPaidCount}
                            <br />Number of EMI Paid using Collateral: {record.emiPaidInCollateral}
                            <br />Number of EMI Remaining: {record.months - (record.emiPaidCount + record.emiPaidInCollateral)}</p>
                            }
                        }
                    >
                        <Column
                            title="User"
                            Key="user"
                            dataIndex="user"
                            filters={this.state.userFilter}
                            filterMultiple= {true}
                            onFilter= {(value, record) => record.user.indexOf(value) === 0}
                        />
                        <Column
                            title="Order Type"
                            Key="type"
                            dataIndex="type"
                            filters={ [{
                                text: 'Lending',
                                value: 'Lend',
                            }, {
                                text: 'Borrowing',
                                value: 'Borrow',
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
                    </Table>
                </Card>
            </div>
          </div>
        );
      }
    }

export default withStyles(s)(Agreements);
