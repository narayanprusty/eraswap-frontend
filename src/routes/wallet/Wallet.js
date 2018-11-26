/**
 *
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import lodash from 'lodash';
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
  Badge
} from 'antd';
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

class WalletManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            header: props.header,
            title: props.title,
            name: props.name,
            recipient: "",
            amount: "",
            balance: "",
            key: 'SendForm',
            noTitleKey: 'SendForm',
            ourWallet: '',
        };
    }

    onTabChange = (key) => {
        console.log(key);
        this.setState({ noTitleKey: key });
    };

    send = () => {
        console.log(this.state.recipient, this.state.amount);
    };

    getBalance = () => {
        this.setState({balance: 1234.009});
    };

    downloadPrivateKey = () =>{

    }

    copyToClipboard = text => {
        var dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.setAttribute('value', text);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      };

    render(){
        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
          };

        const size = "default";
        const state = this.state;

        return (
        <div>
            <Card
                extra={
                    <div>Balance: 
                        {
                            this.state.balance == "" ? "" : this.state.balance
                        }
                        <Icon type="reload" onClick={this.getBalance.bind(this)}/>
                    </div>
                } >      
        
                <Card
                    tabList={sendReceiveTabs}
                    activeTabKey={this.state.noTitleKey}
                    onTabChange={key => {
                    this.onTabChange(key);
                    }} 
                    extra={
                        <Button type="primary" icon="download" size={size} onClick={this.downloadPrivateKey}>Download Private Key</Button>
                    }
                    >
                    {
                        this.state.noTitleKey == "SendForm" ? 
                        (<Form>
                            <FormItem
                                label="Recipient address" >
                                <Input 
                                    type="text"
                                    value={this.state.recipient}
                                    size={size}
                                    onChange={e => this.setState({recipient: e.target.value})}
                                    style={{ width: '25%' }}
                                />
                            </FormItem>
                            <FormItem
                                label="Amount" >
                                <Input 
                                    type="number"
                                    value={this.state.amount}
                                    size={size}
                                    onChange={e => this.setState({amount: e.target.value})}
                                    style={{ width: '25%' }}
                                />
                            </FormItem>
                            <Button type="primary" onClick={this.send.bind(this)}>
                                Send
                            </Button>
                        </Form>)
                        :
                        ( <div className={s.container}>
                            <QrCode value={this.state.ourWallet} />
                            <br />
                            <br />
                            <Input.Search
                              style={{ maxWidth: '45.2%' }}
                              defaultValue={this.state.ourWallet}
                              enterButton={<Icon type="copy" />}
                              size="large"
                              onSearch={value => {
                                this.copyToClipboard(value);
                              }}
                              disabled={true}
                            />
                        </div>)
                    }
                </Card>

            </Card>
        </div>
        );
    }
}

class BtcWalletManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            header: "Bitcoin",
            type: "crypto",
            name: "Btc",
        };
        console.log("manager"+this.state.header);
    }

    render(){
        return (
            <WalletManager header={this.state.header} type={this.state.type} name={this.state.name} />
        );
    }
}

class EthWalletManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            header: "Ethereum",
            type: "crypto",
            name: "Eth",
        };
        console.log(props);
        console.log("manager"+this.state.header);
    }

    render(){
        return (
            <WalletManager header={this.state.header} type={this.state.type} name={this.state.name} />
        );
    }
}

class EstWalletManager extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            header: "EST Token",
            type: "token",
            name: "Est",
        };
        console.log(props);
        console.log("manager"+this.state.header);
    }

    render(){
        return (
            <WalletManager header={this.state.header} type={this.state.type} name={this.state.name} />
        );
    }
}

const tabListNoTitle = [
  {
    key: 'Btc',
    tab: 'Bitcoin',
  },
  {
    key: 'Eth',
    tab: 'Ethereum',
  },
  {
    key: 'Est',
    tab: 'EST Token',
  },
];

class Wallets extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      key: 'Btc',
      noTitleKey: 'Btc',
    };
  }
  onTabChange = (key) => {
    console.log(key);
    this.setState({ noTitleKey: key });
  };
  contentListNoTitle = {
    Btc: <BtcWalletManager form={this.props.form} />,
    Eth: <EthWalletManager form={this.props.form} />,
    Est: <EstWalletManager form={this.props.form} />,
  };
  render() {
    return (
      <div className={s.root}>
        <Card
          style={{
            textAlign:"center"
          }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key);
          }}
        >
          {console.log("rendering "+this.state.noTitleKey)}
          {this.contentListNoTitle[this.state.noTitleKey]}
        </Card>
        </div>
    );
  }
}
export default Form.create()(withStyles(s)(Wallets));
