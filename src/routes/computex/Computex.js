/**
 * 
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Computex extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render() {
    return (
     <div>
         all computexc related things goes here
     </div>
    );
  }
}

export default withStyles()(Computex);
