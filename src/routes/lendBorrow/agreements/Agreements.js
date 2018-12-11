import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Agreements.css';
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
    notification,
    Dropdown,
    Menu,
    AutoComplete, 
    Checkbox
  } from 'antd';

  const FormItem = Form.Item;

class Agreements extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
      };
    
        constructor(props) {
            super(props);
            this.state = {
            }
        }
    
      render() {
        return (
          <div className={s.root}>
            <div className={s.container}>
                <Card>
                
                </Card>
            </div>
          </div>
        );
      }
    }

export default withStyles(s)(Agreements);
