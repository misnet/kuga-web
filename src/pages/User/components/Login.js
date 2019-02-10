import React, { Component, PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Input, Alert, Button,Form,Row,Col, Divider } from 'antd';
import styles from '../Login.less';

import logo from '@/assets/logo.png';

class LoginComponent extends PureComponent {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
      const { getFieldDecorator } = this.props.form;
    return (
        <Fragment>
            <div className={styles.top}>
                <div className={styles.header}>
                    <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo} />
                    <span className={styles.title}>Depoga Print on-demand</span>
                    </Link>
                </div>
            </div>
            <Form onSubmit={this.props.onSubmit}>
            {this.props.loginStatus === 'error' &&
            this.state.type === 'account' &&
            !this.props.submitting &&
            this.renderMessage('账户或密码错误')}
            <Form.Item>
                {
                    getFieldDecorator('user',{
                        rules:[{
                            required:true,
                            message:'请输入用户名'
                        }]
                    })(
                        <Input placeholder={"用户名"} size="large"/>
                    )
                }
            </Form.Item>
            <Form.Item>
                {
                    getFieldDecorator('password',{
                        rules:[{
                            required:true,
                            message:'请输入密码'
                        }]
                    })(
                        <Input type="password" size="large" placeholder={"请输入密码"} />
                    )
                }
            </Form.Item>
            <Form.Item>
                <Button size="large" className={styles.submit}  type="primary" htmlType="submit">登陆</Button>
            </Form.Item>
            <div>
                <a onClick={this.props.onShowRegister}>我要注册</a><Divider type="vertical"/><a>忘记密码?</a>
            </div>
        </Form>
        </Fragment>
    );
  }
}

export default LoginComponent;