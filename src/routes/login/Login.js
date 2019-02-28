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
import s from './Login.css';
import axios from 'axios';
import {Spin, Card, Icon, notification} from 'antd';
import queryString from 'stringquery';
import config from '../../Social';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  };


  fbLogin = (queries) => {
    const data = {
      state: queries.state,
      code: queries.code
    };
    axios
      .post('/auth/login/fb', data)
      .then(response => {
        if (response.data) {
          console.log(response.data);

          for (const i in response.data) {
            localStorage.setItem(i, JSON.stringify(response.data[i]));
          }
          window.location.href = '/';
        }
      }).catch(error => {
        this.setState({
          loader: false
        })
        console.log(error);
      })

  }
  googleLogin = (queries) => {
    const data = {
      state: queries.state,
      code: queries.code
    };
    axios
      .post('/auth/login/google', data)
      .then(response => {
        if (response.data) {
          console.log(response.data);

          for (const i in response.data) {
            localStorage.setItem(i, JSON.stringify(response.data[i]));
          }
          window.location.href = '/';
        }
      }).catch(error => {
        this.setState({
          loader: false
        })
        console.log(error);
      })

  }
  componentDidMount = () => {
    const queries = queryString(location.search);
    if (queries.code && queries.state == "fb") {
      this.setState({
        loader: true,
        type: 'Facebook'
      });
      this.fbLogin(queries);
    } else if (queries.code && queries.state == "google") {
      this.setState({
        loader: true,
        type: 'Google'
      });
      this.googleLogin(queries);
    } else if (queries.how == 'loggedOut') {
      notification.open({
        message: 'Success',
        description: 'Logged out successfully',
      });
    } else if (queries.how != 'force') {
      axios
        .get('/apis/ping')
        .then(data => {
          if (data.data) {
            location.href = '/';
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      console.log('just skipping');
    }

  };

  handleChanges = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  login = e => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post('/auth/login', data)
      .then(response => {
        if (response.data) {
          console.log(response.data);

          for (const i in response.data) {
            localStorage.setItem(i, JSON.stringify(response.data[i]));
          }
          window.location.href = '/';
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className={s.root}>
      {this.state.loader &&(
        <Card style={{textAlign:"center"}}>
          Please wait while we try to login you using {this.state.type}<br />
          <Spin size='large' />
        </Card>
      )}
      {!this.state.loader &&(
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
              <span>Log in with Facebook</span>
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
              <span>Log in with Google</span>
            </a>
          </div>

          <strong className={s.lineThrough}>OR</strong>
          <p className={s.lead} style={{textAlign:"center"}}>
            Log in with your username and password.
          </p>
          <form onSubmit={this.login}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="usernameOrEmail">
                Email :
                <input
                  className={s.input}
                  id="usernameOrEmail"
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
            <div className={s.forgotpass}>

            <a href="/forgotPassword"><i className="fas fa-key" />&nbsp;Forgot Password</a>
            <a style={{float: "right"}} href="/resendVerification"><Icon type="mail" />&nbsp;Resend Verification</a>
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Log in
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    );
  }
}

export default withStyles(s)(Login);
