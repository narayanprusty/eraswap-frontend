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
import { Redirect } from 'react-router';
import queryString from 'stringquery';

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

  componentDidMount = () => {
    const queries = queryString(location.search);
    if (queries.how != 'force') {
      if(localStorage && localStorage.user && JSON.parse(localStorage.user).admin){
            location.href = '/admin';
      }else if(localStorage && localStorage.user && JSON.parse(localStorage.user).admin ==false){
          location.href = '/admin/login';
      }else if(localStorage && localStorage.user && JSON.parse(localStorage.user)){
        location.href = '/'
      }else{
        location.href = '/login'
      }
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
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post('/admins/auth/login', data)
      .then(response => {
        if (response.data) {
          debugger;
          console.log(response.data);

          for (const i in response.data) {
            localStorage.setItem(i, JSON.stringify(response.data[i]));
          }
          window.location.href = '/admin';
        }
      })
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* <h1>{this.props.title}</h1> */}

           <br />
          <p className={s.lead} style={{textAlign:"center"}}>
            Log in with your username and password.
          </p>
          <form onSubmit={this.login}>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="usernameOrEmail">
                Username :
                <input
                  className={s.input}
                  id="usernameOrEmail"
                  type="text"
                  name="username"
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
              <button className={s.button} type="submit">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Login);
