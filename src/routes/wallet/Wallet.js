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
  Badge,
  notification
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
            privateKey: '',
            loadingBalance: false,
            sending : false,
            gettingPK : false,
        };
    }

    componentDidMount(){
        this.getBalance();
        this.getAddress();
    }

    onTabChange = (key) => {
        console.log(key);
        this.setState({ noTitleKey: key });
    };

    send = () => {
        this.setState({ sending: true });
        var data = {
            crypto: this.state.name,
            receiver: this.state.recipient,
            amount: this.state.amount
        };
        console.log(data);
        axios.post('/apis/wallet/send', data).then(res => {
            if (res.data.success) {
                notification.open({
                    message: 'Success',
                    description: 'Transaction sent!',
                });
            }
            console.log(res);
            this.setState({ sending: false, recipient: "", amount: "" });
        }).catch(error => {
            this.setState({ sending: false, recipient: "", amount: "" });
            console.log(error);
        });
    };

    getBalance = () => {
        this.setState({ loadingBalance: true });
        axios.get('/apis/wallet/getBalance?crypto=' + this.state.name).then(res => {
            console.log(res.data.balance);
            this.setState({ balance: res.data.balance, loadingBalance: false });
        }).catch(error => {
            this.setState({ loadingBalance: false });
            console.log(error);
        });
    };

    getAddress = () => {
        axios.get('/apis/wallet/getAddress?crypto=' + this.state.name).then(res => {
            console.log(res.data.address);
            this.setState({ ourWallet: res.data.address });
        }).catch(error => {
            console.log(error);
        });
    };

    downloadPrivateKey = () => {
        this.setState({gettingPK : true});
        axios.get('/apis/wallet/getPrivateKey?crypto=' + this.state.name).then(res => {
            console.log(res.data.address);
            if (res.data.address) {
                this.setState({ privateKey: res.data.address });
                var element = document.createElement("a");
                var file = new Blob([this.state.privateKey], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = "privateKey.txt";
                element.click();
                document.body.removeChild(element);
            }
            this.setState({gettingPK : false});
        }).catch(error => {
            this.setState({gettingPK : false});
            console.log(error);
        });
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
            <Card title={this.props.header}>
                <div style={{marginBottom: '0.5%'}}>Balance:
                    {
                        this.state.balance == "" ? "" : "  "+this.state.balance
                    }
                    {
                        (this.state.loadingBalance ? <Spin /> :
                        <Icon type="reload" onClick={this.getBalance.bind(this)} style={{margin: '0.5%'}} /> )
                    }
                </div>
                <Card
                    tabList={sendReceiveTabs}
                    activeTabKey={this.state.noTitleKey}
                    onTabChange={key => {
                    this.onTabChange(key);
                    }}
                    >
                    {
                        this.state.noTitleKey == "SendForm" ?
                        (<Form>
                            <FormItem
                                label="Recipient address" >
                                <Input
                                    type="text"
                                    value={this.state.recipient}
                                    onChange={e => this.setState({recipient: e.target.value})}
                                    style={{ maxWidth: '45.2%' }}
                                    size="large"
                                />
                            </FormItem>
                            <FormItem
                                label="Amount" >
                                <Input
                                    type="number"
                                    value={this.state.amount}
                                    onChange={e => this.setState({amount: e.target.value})}
                                    style={{ maxWidth: '45.2%' }}
                                    size="large"
                                />
                            </FormItem>
                            <Button type="primary" onClick={this.send.bind(this)} loading={this.state.sending}>
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
                              size="large"
                              value={this.state.ourWallet}
                              enterButton={<Icon type="copy" />}
                              onSearch={value => {
                                this.copyToClipboard(value);
                              }}
                              disabled={true}
                            />
                        </div>)
                    }
                    <hr />
                    <Button type="primary" icon="download" size={size} loading={this.state.gettingPK}
                     onClick={this.downloadPrivateKey}>Download Private Key</Button>
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
            header: "Bitcoin Wallet",
            type: "crypto",
            name: "BTC",
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
            header: "Ethereum Wallet",
            type: "crypto",
            name: "ETH",
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
            header: "EST Token Wallet",
            type: "token",
            name: "EST",
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
    key: 'BTC',
    tab: 'Bitcoin',
  },
  {
    key: 'ETH',
    tab: 'Ethereum',
  },
  {
    key: 'EST',
    tab: 'EST Token',
  },
];

class Wallets extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      key: 'BTC',
      noTitleKey: props.name || 'BTC',
    };
    console.log("props",props);
  }
  contentListNoTitle = {
    BTC: <BtcWalletManager form={this.props.form} />,
    ETH: <EthWalletManager form={this.props.form} />,
    EST: <EstWalletManager form={this.props.form} />,
  };
  render() {
    return (
      <div className={s.root} style={{ textAlign:"center" }}>
          {console.log("rendering "+this.state.noTitleKey)}
          {this.contentListNoTitle[this.props.name]}
        </div>
    );
  }
}
export default withStyles(s)(Wallets);
