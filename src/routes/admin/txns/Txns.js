import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import Link from '../../../components/Link';
import { Card, Input, Table, List, Badge, Button } from 'antd';
import s from './Txns.css';
const Search = Input.Search;
class Txns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchExist: false,
    };
  }

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
  conVertObjToArr = wholeObj => {
    return [
      {
        title: 'ComputeEx Order Status',
        content: wholeObj.witdrawn ? 'Completed' : 'Pending',
      },
      {
        title: 'Deposit Status',
        content: wholeObj.dipositTxnId
          ? wholeObj.dipositTxnStatus
          : 'Not Received Yet.',
      },
      {
        title: 'Deposit Transaction ID',
        content: wholeObj.dipositTxnId ? wholeObj.dipositTxnId : '-',
      },
      {
        title: 'Exchange From/To',
        content: wholeObj.exchFromCurrency + '/' + wholeObj.exchToCurrency,
      },
      {
        title: `Users ${wholeObj.exchToCurrency} Receiving Address`,
        content: wholeObj.eraswapSendAddress,
      },
      {
        title: 'Users Receiving/Received amount [Without Fee]',
        content: wholeObj.amtToSend ? wholeObj.amtToSend : 'Not yet rendered',
      },
      {
        title: `Order for Exchange placed in  ${wholeObj.exchangePlatform}`,
        content: wholeObj.orderId ? 'YES' : 'Not yet',
      },
      {
        title: 'Order Status',
        content: wholeObj.convertedYet
          ? wholeObj.convertedYet
          : 'Not placed yet',
      },
      {
        title: 'Type Of Order',
        content: wholeObj.side
          ? wholeObj.side.toUpperCase()
          : 'Not yet decided',
      },
      {
        title: 'Converted Amount',
        content: wholeObj.totalExchangeAmout
          ? wholeObj.totalExchangeAmout
          : '-',
        align: 'center',
      },
      {
        title: 'Deposit Address',
        content: wholeObj.eraswapAcceptAddress,
        align: 'left',
      },
      {
        title: 'Platform Fee',
        content: wholeObj.platform_fee
          ? wholeObj.platform_fee +
            ' ' +
            (wholeObj.platformFeePayOpt == 'source'
              ? wholeObj.exchFromCurrency
              : wholeObj.platformFeePayOpt)
          : '-',
      },
    ];
  };

  fetch = (query, params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    axios.get('/admins/apis/txns/list_count').then(countData => {
      if (countData.data)
        axios({
          url: '/admins/apis/txns/list',
          params: {
            results: 10,
            ...params,
            query: query,
          },
          method: 'get',
          type: 'json',
        }).then(async data => {
          if (data.data) {
            const pagination = { ...this.state.pagination };
            pagination.total = countData.data.totalCount;

            this.setState({
              loading: false,
              data: data.data,
              pagination,
            });
          }
        });
    });
  };
  componentDidMount() {
    if (
      localStorage &&
      localStorage.user &&
      JSON.parse(localStorage.user).admin == false
    ) {
      location.href = '/';
    } else if (!localStorage.length || !localStorage.user) {
      localStorage.clear();
      location.href = '/login?how=force';
    }
    this.fetch();
  }

  onSearch = (e, value) => {
    if (value.trim().length) {
      this.setState({
        searchExist: true,
      });
      console.log(value);
      axios({
        url: '/admins/apis/txns/search',
        params: {
          dipositTxnId: value.trim(),
        },
        method: 'get',
        type: 'json',
      }).then(async data => {
        if (data.data) {
          const pagination = { ...this.state.pagination };
          pagination.total = 1;
          this.setState({
            loading: false,
            data: data.data,
            pagination,
          });
        }
      });
    }
  };
  onReset = () => {
    this.setState({ searchExist: false });
    this.fetch();
  };

  render() {
    // {title:'Deposit Status', dataIndex:'dipositTxnStatus',key:"dipositTxnStatus",align:'center',render:(depositStat)=>{
    //   return depositStat==="ok" ? (<span><Badge status="success" />Received</span>) : (<span><Badge status="warning" />{depositStat || "Pending"}</span>)
    // }},
    // {title:'Payment Status',dataIndex:'witdrawn',key:'witdrawn',align:'center' ,  render:(keyStat)=>{
    //   return keyStat ? (<span><Badge status="success" />Finished</span>) : (<span><Badge status="warning" />Waiting</span>)
    // }},
    //{ title: 'Converted Currency', dataIndex: 'exchToCurrency', key: 'exchToCurrency' ,align:'center'},
    const columns = [
      {
        title: 'User',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        render: (fieldVal, record) => {
          if (fieldVal) {
            return fieldVal.username;
          } else {
            return 'User not exists';
          }
        },
      },
      {
        title: 'Exchange Platform',
        dataIndex: 'exchangePlatform',
        key: 'exchangePlatform',
        align: 'center',
        className: s.exchange,
      },
      {
        title: 'Conversion Symbol',
        dataIndex: 'exchFromCurrency',
        key: 'exchFromCurrency',
        align: 'center',
        render: (fieldVal, record) => {
          return fieldVal + '->' + record.exchToCurrency;
        },
      },
      {
        title: 'Conversion Amount',
        dataIndex: 'exchFromCurrencyAmt',
        key: 'exchFromCurrencyAmt',
        align: 'center',
      },

      {
        title: 'Status',
        dataIndex: 'witdrawn',
        key: 'witdrawn',
        align: 'center',
        render: keyStat => {
          return keyStat ? (
            <span>
              <Badge status="success" />Finished
            </span>
          ) : (
            <span>
              <Badge status="warning" />In Progress
            </span>
          );
        },
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'right',
        render: date => {
          return (
            new Date(date.toString()).toLocaleDateString() +
            ' ' +
            new Date(date.toString()).toLocaleTimeString()
          );
        },
      },
    ];
    return (
      <div className={s.root}>
        <Card>
          <div style={{ paddingBottom: '1em' }}>
            <Search
              placeholder="search with deposit txn id"
              enterButton="Search"
              size="large"
              style={{ width: 450 }}
              onSearch={value => this.onSearch(this, value)}
            />{' '}
            &nbsp;
            {this.state.searchExist && (
              <Button type="primary" size="large" onClick={this.onReset}>
                Reset
              </Button>
            )}
          </div>
          <Table
            style={{ overflowX: 'scroll' }}
            columns={columns}
            rowKey={record => record._id}
            dataSource={this.state.data}
            expandedRowRender={record => (
              <List
                // grid={{ gutter: 16, column: 4 }}
                itemLayout="horizontal"
                dataSource={this.conVertObjToArr(record)}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta title={item.title} />
                    {item.content}
                  </List.Item>
                )}
              />
            )}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </Card>
      </div>
    );
  }
}

export default withStyles(s)(Txns);
