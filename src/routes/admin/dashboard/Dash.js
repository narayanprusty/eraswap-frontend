import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import { Redirect } from 'react-router';
import queryString from 'stringquery';

class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }


  componentDidMount() {
    if (
      localStorage &&
      localStorage.user &&
      JSON.parse(localStorage.user).admin
    ) {
      location.href = '/admin';
    } else if (
      localStorage &&
      localStorage.user &&
      JSON.parse(localStorage.user).admin == false
    ) {
      location.href = '/admin_login?how=force';
    } else if (
      localStorage &&
      localStorage.user &&
      JSON.parse(localStorage.user)
    ) {
      location.href = '/';
    } else {
      location.href = '/login';
    }
  }
  render() {
    return <dib>Hii</dib>;
  }
}

export default withStyles()(Dash);
