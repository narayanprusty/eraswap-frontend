import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Activate.css';
import { Card, Spin, Button, notification } from 'antd';
import axios from 'axios';
import queryString from 'stringquery';


class Activate extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      activated:false
    }
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

activate = (id)=>{
  axios.get('/auth/activateAccount?id='+id).then(response=>{
    if(response.data){
      this.setState({
        activated:true
      });
      setTimeout(function(){ location.href= '/login?how=force'}, 3000);
      return true;
    }else{
      console.log("Error Occurred");
    }
  });
}

  componentDidMount = () => {
    const queries = queryString(location.search);
    this.activate(queries.id);
  };
render(){
  return (
    <div className={s.root}>
    <Card>
      {!this.state.activated &&
      (
        <div>Please wait While we Activate your account.
      <Spin size="large" />
      </div>)}
      {this.state.activated &&(
        <div>Your account has been activated, please wait while we redirect you to login page in 3 seconds.</div>
      ) }
    </Card>
    </div>
  )
}
}

export default withStyles(s)(Activate);
