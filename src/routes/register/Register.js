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
import s from './Register.css';
import { Form, Button, notification } from 'antd';
import axios from 'axios';
import config from '../../Social';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  handleChanges = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      host: location.protocol + "//" + location.host
    };
    this.setState({
      loading: true
    });

    axios.post('/auth/signup', values).then(response => {
      const key = `open${Date.now()}`;
      //   const btn = (
      //     <Button type="primary" size="small" onClick={() => location.href='/login'}>
      //       login
      //     </Button>
      //   );
      if (response.status == 200) {
        notification.open({
          message: 'Success',
          description: 'Account Has been created, please check your email and click on the Activation Link.',
          // btn,
          key
        });
      }
      this.setState({
        loading: false
      });
    }).catch(error => {
      console.log(error);
      notification.open({
        message: 'Error',
        description: 'Unable to create Please try again.'
      });
      this.setState({
        loading: false
      });
    });

  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <h1>{this.props.title}</h1> */}
          <div className={s.formGroup} style={{paddingTop:"3em"}}>
            <a className={s.facebook} href={`https://www.facebook.com/v3.2/dialog/oauth?client_id=${config.SOCIAL.FB.CLIENT_ID}&redirect_uri=${config.SOCIAL.FB.REDIRECT_URI}&state=fb&scope=email`}>
              <svg
                className={s.icon}
                width="30"
                height="30"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z" />
              </svg>
              <span>Register with Facebook</span>
            </a>
          </div>
          <div className={s.formGroup}>
            <a className={s.google} href={`https://accounts.google.com/o/oauth2/auth?client_id=${config.SOCIAL.GOOGLE.CLIENT_ID}&redirect_uri=${config.SOCIAL.GOOGLE.REDIRECT_URI}&scope=email&response_type=code&state=google`}>
              <svg
                className={s.icon}
                width="30"
                height="30"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={
                    'M30 13h-4V9h-2v4h-4v2h4v4h2v-4h4m-15 2s-2-1.15-2-2c0 0-.5-1.828 1-3 ' +
                    '1.537-1.2 3-3.035 3-5 0-2.336-1.046-5-3-6h3l2.387-1H10C5.835 0 2 3.345 2 7c0 ' +
                    '3.735 2.85 6.56 7.086 6.56.295 0 .58-.006.86-.025-.273.526-.47 1.12-.47 1.735 ' +
                    '0 1.037.817 2.042 1.523 2.73H9c-5.16 0-9 2.593-9 6 0 3.355 4.87 6 10.03 6 5.882 ' +
                    '0 9.97-3 9.97-7 0-2.69-2.545-4.264-5-6zm-4-4c-2.395 0-5.587-2.857-6-6C4.587 ' +
                    '3.856 6.607.93 9 1c2.394.07 4.603 2.908 5.017 6.052C14.43 10.195 13 13 11 ' +
                    '13zm-1 15c-3.566 0-7-1.29-7-4 0-2.658 3.434-5.038 7-5 .832.01 2 0 2 0 1 0 ' +
                    '2.88.88 4 2 1 1 1 2.674 1 3 0 3-1.986 4-7 4z'
                  }
                />
              </svg>
              <span>Register with Google</span>
            </a>
          </div>

          <strong className={s.lineThrough}>OR</strong>
          <p className={s.lead} style={{textAlign:"center"}}>
           Register with us
          </p>
          <form onSubmit={this.handleSubmit}>
          <div className={s.formGroup}>
              <label className={s.label} htmlFor="username">
                Username :
                <input
                  className={s.input}
                  id="username"
                  type="text"
                  name="username"
                  onChange={this.handleChanges}
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="email">
                Email :
                <input
                  className={s.input}
                  id="email"
                  type="text"
                  name="email"
                  onChange={this.handleChanges}
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="password">
                Password:
                <input
                  className={s.input}
                  id="password"
                  type="password"
                  name="password"
                  onChange={this.handleChanges}
                />
              </label>
            </div>

            <div className={s.formGroup}>
              <button loading={this.state.loading} className={s.button} type="submit" disabled={this.state.email && this.state.password && this.state.username ? false :true}>
               Register
              </button>
            </div>
          </form>
        </div>
        </div>
    );
  }
}

export default Form.create()(withStyles(s)(Register));
