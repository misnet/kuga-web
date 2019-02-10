import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi/link';
import { Input, Alert, Button,Form,Row,Col, Divider } from 'antd';
import LoginComponent from './components/Login';
import styles from './Login.less';
import { routerRedux } from 'dva/router';


@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  
  handleSubmit = (e) => {
     e.preventDefault();
      this.props.form.validateFields(['user','password'], { force: true }, (err, values) => {
          if(!err){
              this.props.dispatch({
                  type: 'login/login',
                  payload: {
                      ...values
                  },
              });
          }
      });
  };
  onShowRegister=()=>{
      this.props.dispatch(routerRedux.replace('/user/register'));
  }
  render() {
    return (
      <div className={styles.main}>
            <LoginComponent
            loginStatus={this.props.login.loginStatus}
            submitting={this.props.submitting}
            onSubmit={this.handleSubmit}
            form={this.props.form}
            onShowRegister={this.onShowRegister}
            />
      </div>
    );
  }
}

export default Form.create()(LoginPage);