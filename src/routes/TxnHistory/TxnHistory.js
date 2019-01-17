import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import { List,Table,Badge} from 'antd';
import s from './TxnHistory.css';

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

 conVertObjToArr =(wholeObj)=>{
   return [{
    title: "ComputeEx Order Status",
    content: wholeObj.witdrawn ? "Completed" : "Pending" } ,
    {title:"Deposit Status"  ,
    content: wholeObj.dipositTxnId ? wholeObj.dipositTxnStatus : 'Not Received Yet.'},
    {title:"Deposit Transaction ID" ,content: wholeObj.dipositTxnId ? wholeObj.dipositTxnId : '-'},
    {title:"Exchange From/To",content: wholeObj.exchFromCurrency +'/'+wholeObj.exchToCurrency},
    {title:`Your ${wholeObj.exchFromCurrency} Receiving Address`,content: wholeObj.eraswapSendAddress},
    {title:"Your Receiving/Received amount [Without Fee]",content:wholeObj.amtToSend ? wholeObj.amtToSend : 'Not yet rendered'},
    {title:`Order for Exchange placed in  ${wholeObj.exchangePlatform}`,content: wholeObj.orderId ? "YES" : 'Not yet'},
    {title:"Order Status",content:wholeObj.convertedYet?wholeObj.convertedYet:'Not placed yet'},
    {title:"Type Of Order",content:wholeObj.side ? wholeObj.side.toUpperCase() : 'Not yet decided'},
    {title: "Platform Fee", content:wholeObj.platform_fee ? (wholeObj.platform_fee +' '+wholeObj.platformFeePayOpt =='source'?wholeObj.exchFromCurrency:wholeObj.platformFeePayOpt)  : '-'
 }];
};

  render(){
    const columns = [
        {title:'Exchange Platform',dataIndex:'exchangePlatform',key:'exchangePlatform',align:"center",className:s.exchange},
        { title: 'Conversion Of', dataIndex: 'exchFromCurrency', key: 'exchFromCurrency' ,align:'center',render:(exchFromCurrency,record)=>{return exchFromCurrency+'/'+record.exchToCurrency}},
        { title: 'Conversion Amount', dataIndex: 'exchFromCurrencyAmt', key: 'exchFromCurrencyAmt' ,align:'center'},
        { title: 'Converted Amount', dataIndex: 'totalExchangeAmout', key: 'totalExchangeAmout' ,align:'center'},
        { title: 'Eraswap Deposit Address', dataIndex: 'eraswapAcceptAddress', key: 'eraswapAcceptAddress',align:'center' },
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
         <div className={this.props.menukey=="1" ? null : s.root}>
        {/* <Card title={this.props.title}> */}
        <Table
           style={{wordWrap: 'break-word'}}
    columns={columns}
    expandedRowRender={record => (
      <List
      // grid={{ gutter: 16, column: 4 }}
      itemLayout="horizontal"
      dataSource={this.conVertObjToArr(record)}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
          title={item.title}
           />
          {item.content}
        </List.Item>
      )}
    />
    )}
    dataSource={this.state.data}
    loader={this.state.loading}
    onChange={this.changePage}
  />
        {/* </Card> */}
         </div>
      )
  }


}
export default withStyles(s)(TxnHistory);
