import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import { Card, Icon ,Table,Badge} from 'antd';
import s from './TxnHistory.css';
import QrCode from 'qrcode.react';

class TxnHistory extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
        loading:true,
        data:[]
    };
  }
componentDidMount =()=>{
    this.getData();
}
getData =()=>{
    axios.get('/apis/txn/getTxn').then(data=>{
        if(data && data.data){
            debugger;
            this.setState({
                data:data.data,
                loading:false
            })
        }
    }).catch(error=>{
      console.log(error);
    });
};
changePage =(a)=>{
    //{current:currentpageNumber,pageSize:pageLimit}
   //you can update the api and keep pagination logic here
};



  render(){
    const columns = [
        {title:'Exchange Platform',dataIndex:'exchangePlatform',key:'exchangePlatform',align:"center",className:s.exchange},
        { title: 'Conversion Currency', dataIndex: 'exchFromCurrency', key: 'exchFromCurrency' ,align:'center'},
        { title: 'Conversion Amount', dataIndex: 'exchFromCurrencyAmt', key: 'exchFromCurrencyAmt' ,align:'center'},
        { title: 'Converted Currency', dataIndex: 'exchToCurrency', key: 'exchToCurrency' ,align:'center'},
        { title: 'Converted Amount', dataIndex: 'totalExchangeAmout', key: 'totalExchangeAmout' ,align:'center'},
        { title: 'Eraswap Deposit Address', dataIndex: 'eraswapAcceptAddress', key: 'eraswapAcceptAddress',align:'left' },
        {title:'Deposit Status', dataIndex:'dipositTxnStatus',key:"dipositTxnStatus",align:'center',render:(depositStat)=>{
          return depositStat==="ok" ? (<span><Badge status="success" />Received</span>) : (<span><Badge status="warning" />{depositStat || "Pending"}</span>)
        }},
        {title:'Payment Status',dataIndex:'witdrawn',key:'witdrawn',align:'center' ,  render:(keyStat)=>{
          return keyStat ? (<span><Badge status="success" />Finished</span>) : (<span><Badge status="warning" />Waiting</span>)
        }},
        { title:"Created At", dataIndex:"createdAt", key:"createdAt" ,align:'right',render:(date)=>{
            return new Date(date.toString()).toLocaleDateString() + ' '+ new Date(date.toString()).toLocaleTimeString()
        }}
      ];


      return(
        <div className={s.root}>
        <Card title={this.props.title}>
        <Table
    columns={columns}
    expandedRowRender={record => <p style={{ margin: 0 }}>{JSON.stringify(record)}</p>}
    dataSource={this.state.data}
    loader={this.state.loading}
    onChange={this.changePage}
  />
        </Card>
        </div>
      )
  }


}
export default withStyles(s)(TxnHistory);
