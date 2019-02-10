import { PureComponent, Fragment } from "react";
import styles from './Register.less';
import { message,Form,Input,Button,Divider,Checkbox,Modal } from "antd";
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import AgreementPage from './components/Agreement';
let counter = null;
const MAX_SECONDS = 5;
let seed = '';
@connect(({ global,login, loading }) => ({
    global,
    login
  }))
@Form.create()
class RegisterPage extends PureComponent{
    state = {
        agreementVisible:false,
        isAgree:false,
        seconds:MAX_SECONDS,
    }
    onShowLogin=()=>{
        this.props.dispatch(
            routerRedux.replace('/user/login')
        )
    }
    setAgreementModal=(isShow)=>{
        this.setState({
            agreementVisible:isShow
        })
    }
    onChangeAgree=(e,v)=>{
        this.setState({
            isAgree:e.target.checked
        })
    }
    onAgree=()=>{
        this.setAgreementModal(false);
        this.setState({isAgree:true});
        this.props.form.setFieldsValue({agree:true});
    }
    /**
     * 提交注册
     */
    onSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields(['mobile','verifyCode','password','agree'],(error,values)=>{
           
            if(!error){
                if(!values['agree']){
                    message.warning('必须同意用户协议才可注册');
                    return false;
                }else if(seed === ''){
                    message.warning('请先发送短信验证手机号');
                    return false;
                }
                this.props.dispatch({
                    type:'user/register',
                    payload:{
                        ...values,
                        seed
                    },
                    callback:(r)=>{
                        //注册成功
                        if(r){
                            Modal.confirm({
                                title:'注册成功，是否马上登录?',
                                content:null,
                                onOk:()=>{
                                    //自动登陆
                                    this.props.dispatch({
                                        type: 'login/login',
                                        payload: {
                                           user:values['mobile'],
                                           password:values['password']
                                        },
                                    });
                                },
                                onCancel:()=>{
                                    this.props.dispatch(routerRedux.replace('/user/login'));
                                }
                            });
                        }
                    }
                })
            }else{
                return false;
            }
        });
    }
    /**
     * 发送短信
     */
    onSendSms=()=>{
        if(this.state.seconds === MAX_SECONDS){
            this.props.form.validateFields(['mobile'],(error,values)=>{
                if(!error){
                    seed = '';
                    this.props.dispatch({
                        type:'global/sendVerifySms',
                        payload:{
                            mobile:values['mobile']
                        },
                        callback:(d)=>{
                            seed = d;
                        }
                    })
                }
            })
            counter = setInterval(()=>{
                if(this.state.seconds>0)
                    this.setState({
                        seconds:this.state.seconds - 1
                    })
                else{
                    this.setState({
                        seconds:MAX_SECONDS
                    });
                    clearInterval(counter);
                }
            },1000);

        }
    }
    render(){
        const {form:{getFieldDecorator}} = this.props;
        console.log('isagree',this.state.isAgree);
        return (
            <div className={styles.main}>
                <div className={styles.header}>
                我要注册
                </div>
                <Form onSubmit={this.onSubmit}>
                    <Form.Item>
                        {
                            getFieldDecorator('mobile',{
                                rules:[{
                                    required:true,
                                    message:'请输入手机号'
                                }]
                            })(
                                <Input placeholder={"手机号"} size="large"/>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator("verifyCode",{
                                rules:[{
                                    required:true,
                                    message:'请输入密码'
                                }]
                            })(
                                <Input type="text" size="large" addonAfter={<a onClick={this.onSendSms}>{this.state.seconds===MAX_SECONDS?'获取验证码':this.state.seconds+'S'}</a>} placeholder={"请输入验证码"} />
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
                        {
                            getFieldDecorator('agree',{
                                initialValue:this.state.isAgree,
                                valuePropName:'checked',
                                rules:[{
                                    required:true,
                                    message:'请勾选同意协议'
                                }]
                            })(
                                <Checkbox  onChange={this.onChangeAgree}>同意</Checkbox>
                            )
                        }<a onClick={()=>this.setAgreementModal(true)}>用户协议</a>
                        
                    </Form.Item>
                    <Form.Item>
                        <Button size="large" block className={styles.submit}  type="primary" htmlType="submit">注册</Button>
                    </Form.Item>
                    <div>
                        <a onClick={this.onShowLogin}>我要登录</a><Divider type="vertical"/><a>忘记密码?</a>
                    </div>
                </Form>
                <Modal
                width={720}
                height={500}
                title="用户协议"
                style={{ top: 20 }}
                visible={this.state.agreementVisible}
                okText={"同意"}
                cancelText={"关闭"}
                onOk={this.onAgree}
                onCancel={() => {this.setAgreementModal(false)}}
                >
                <AgreementPage/>
                </Modal>
            </div>
        )
    }
}
export default RegisterPage;