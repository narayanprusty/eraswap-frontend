/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ForgotPassword.css';
import axios from 'axios';
import {Spin,Card, Button, Form, Input, notification, Icon} from 'antd';
const FormItem = Form.Item;
import queryString from 'stringquery';
import { from } from 'zen-observable';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      loading: false,
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  handleChanges = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

    ForgotPassword = e => {
        e.preventDefault();
        if (this.state.email != '') {
            this.setState({ loading: true });
            var host = location.protocol + "//" + location.host;
            axios
                .post('/auth/forgotPassword',{email:this.state.email, host: host})
                .then(response => {
                    if (response.data) {
                        console.log(response.data);
                        if(response.data.success){
                            notification.open({
                                message: 'Password Reset Link Sent',
                                description: "Please check you email and click on the reset link to change your password",
                                icon: <Icon type="smile" style={{ color: 'green' }} />,
                            });
                            setTimeout(function(){ location.href= '/'}, 3000);
                        }
                        else{
                            notification.open({
                                message: 'Error',
                                description: response.data.message ? response.data.message : "Something went wrong!",
                                icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                            });
                        }
                    }
                    this.setState({ loading: false });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ loading: false });
                });
        } else {
            notification.open({
                message: 'Email address missing',
                description: "Please enter a valid email address",
                icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
            });
        }
    };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
            <p className={s.lead} style={{textAlign:"center"}}>
                Enter your email address to reset your password
            </p>
            <Form onSubmit={this.ForgotPassword}>
                <FormItem
                    label="Email" >
                    <Input
                        type="email"
                        value={this.state.email}
                        onChange={e => this.setState({email: e.target.value})}
                        style={{ maxWidth: '100%' }}
                        size="default"
                        placeholder="Enter email address"
                    />
            </FormItem>
            <Button htmlType="submit" type="primary" className={s.button} loading={this.state.loading}>
                Send Password Reset Link
            </Button>
            </Form>
          </div>
      </div>
    );
  }
}

export default withStyles(s)(ForgotPassword);
