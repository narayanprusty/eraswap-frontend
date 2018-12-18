import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ResetPassword.css';
import { Card, Spin, Button, notification, Form, Input, Icon } from 'antd';
import axios from 'axios';
import queryString from 'stringquery';

const FormItem = Form.Item;


class ResetPassword extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            password: '',
            repeatPassword: '',
            loading: '',
        }
    }
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    ResetPassword = async (e) => {
        e.preventDefault();
        if (this.state.password == this.state.repeatPassword) {
            this.setState({ loading: true });
            axios.post('/auth/resetPassword', {
                code: this.state.code,
                password: this.state.password
            }).then(response => {
                if (response.data) {
                    console.log(response.data);
                    if (response.data.success) {
                        setTimeout(function () { location.href = '/login?how=force' }, 3000);
                        return true;
                    }
                    else {
                        notification.open({
                            message: 'Error',
                            description: response.data.message ? response.data.message : "Something went wrong",
                            icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
                        });
                    }
                } else {
                    console.log("Error Occurred");
                }
                this.setState({ loading: false });
            });
        } else {
            notification.open({
                message: 'Passwords does not match',
                description: "New password & repeat password does not match",
                icon: <Icon type="frown-circle" style={{ color: '#FF0000' }} />,
            });
        }
    }

    componentDidMount = () => {
        const queries = queryString(location.search);
        this.setState({ code: queries.id });
    };

    render() {
        return (
            <div className={s.root}>
            <Card>
                <Form onSubmit={this.ResetPassword}>
                    <FormItem
                        label="New Password" >
                        <Input 
                            type="password"
                            value={this.state.password}
                            onChange={e => this.setState({password: e.target.value})}
                            style={{ maxWidth: '40%' }}
                            size="default"
                            placeholder="Enter New Password"
                        />
                    </FormItem>
                    <FormItem
                            label="Repeat Password" >
                            <Input 
                                type="password"
                                value={this.state.repeatPassword}
                                onChange={e => this.setState({repeatPassword: e.target.value})}
                                style={{ maxWidth: '40%' }}
                                size="default"
                                placeholder="Repeat New Password"
                            />
                    </FormItem>
                    <Button htmlType="submit" type="primary" className={s.button} loading={this.state.loading}>
                        Reset Password
                    </Button>
                </Form>
            </Card>
            </div>
        )
    }
}

export default withStyles(s)(ResetPassword);
