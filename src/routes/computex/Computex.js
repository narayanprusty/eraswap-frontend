/**
 * 
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
class Computex extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };
  componentDidMount=()=>{
  axios.get('/apis/ping', {
          headers: {
            authorization: JSON.parse(localStorage.getItem('token')),
          },
        })
        .then(data => {
          if(data.data){
          console.log('Everything is fine bro')
          }
        })
        .catch(error => {
          console.log(error);
        });
  }

  render() {
    return (
     <div>
         all computexc related things goes here
     </div>
    );
  }
}

export default withStyles()(Computex);
