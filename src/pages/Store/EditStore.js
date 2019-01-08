/**
 * 店仓的编辑
 */
import React, { PureComponent } from 'react';
import {
    Divider,
    Form,
    Button,
    Table,
    Select,
    Spin,
    Card,
    Input,
    Affix,
    Row,
    Checkbox,
    Col, Cascader,
    message
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper'
import DICT from "../../dict";
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;

@connect(({global,store}) => ({
    global,
    store
}))
@Form.create()
class EditStore extends PureComponent {
    constructor(props){
        super(props);
        const params = this.props.match.params;
        const storeId = parseInt(params['id']);
        this.state = {
            readyToSave:false
        };
        if (!isNaN(storeId) && storeId > 0) {
            this.props.dispatch({
                type:'store/getStore',
                payload:{
                    id:storeId
                },
                callback:(data)=>{
                    this.props.dispatch({
                        type:'global/fetchRegionList',
                        payload:{
                            parentId: 0,
                            pathIndex: '0',
                        },
                        callback:()=>{
                            this.ajaxLoadRegion(data.region,'0');
                        }
                    });
                }
            });
        }else{
            this.state.readyToSave = true;
            this.props.dispatch({
                type:'store/newStore'
            });
            this.props.dispatch({
                type:'global/fetchRegionList',
                payload:{
                    parentId: 0,
                    pathIndex: '0',
                },
                callback:()=>{
                    this.ajaxLoadRegion([],'0');
                }
            });
        }
    }
    //递归载入地区树
    ajaxLoadRegion = (pathList,path)=>{
        const newPathIndex = [...pathList];
        const parentId = newPathIndex.splice(0,1);
        //console.log('e',parentId[0],path);
        const newPath = path===''?parentId[0]:(path+'.'+parentId[0]);
        return this.props.dispatch({
            type:'global/fetchRegionList',
            payload:{
                parentId: parentId[0],
                pathIndex: newPath,
            },
            callback:(list)=>{
                //console.log('callback',list);
                if(newPathIndex.length!==0){
                    this.ajaxLoadRegion(newPathIndex,newPath);
                }else{
                    this.setState({
                        readyToSave:true
                    });
                }
            }
        });
    }
    //点选地区时，动态载入
    loadRegionData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if(typeof targetOption.children === 'undefined'){
            targetOption.loading = true;
            this.props.dispatch({
                type:'global/fetchRegionList',
                payload:{
                    parentId:targetOption.value,
                    pathIndex:targetOption.pathIndex
                }
            });
        }
    }
    //保存时
    onSave=()=>{
        this.props.form.validateFields((error, values) => {
            if(!error){
                const id = this.props.store.currentStore.id;
                const actionType = id > 0 ? 'updateStore' : 'createStore';
                this.props.dispatch({
                    type:`store/${actionType}`,
                    payload:{
                        id:id,
                        name:values.name,
                        summary:values.summary,
                        disabled:values.disabled?0:1,
                        isRetail:values.isRetail?1:0,
                        region:values.region,
                        address:values.address
                    },
                    callback:()=>{
                        message.success(formatMessage({id:'store.save.success'}));
                        this.props.dispatch(
                            routerRedux.goBack()
                        )
                    }
                });
            }
        });
    }
    onBack=()=>{
        this.props.dispatch(
            routerRedux.push('/store/list')
        )
    }
    onChangeRegion = (value, selectedOptions) => {
        console.log(value, selectedOptions);
      }
    render() {
        const {
            store:{currentStore},
            form:{getFieldDecorator},
            global:{regionList},
            loading
        } = this.props;
        return (
            <PageHeaderWrapper title={currentStore.id>0?'编辑店仓':'创建店仓'}>
                <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                    <Button icon="arrow-left" type="default" onClick={this.onBack}>
                        {formatMessage({id:'form.return'})}
                    </Button>
                    <Button icon="save" type="primary" onClick={this.onSave} disabled={!this.state.readyToSave}>
                    {formatMessage({id:'form.save'})}
                    </Button>
                    <Divider />
                    </div>
                </Affix>
                    <div className={styles.tableList}>
                        <Spin spinning={!this.state.readyToSave}>
                        <div>
                            <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="店仓名称">
                                {getFieldDecorator('name', {
                                    initialValue: currentStore.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入店仓名称',
                                        },
                                    ],
                                })(<Input placeholder="请输入店仓名称" maxLength={50} />)}
                            </FormItem>
                            
                            <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}} label="店仓描述">
                                {getFieldDecorator('summary', {
                                    initialValue: currentStore.summary,
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入店仓描述',
                                        },
                                    ],
                                })(<Input.TextArea placeholder="请输入店仓描述" maxLength={250} />)}
                            </FormItem>

                            <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}} label="所在地区">
                            {getFieldDecorator('region', {
                                    initialValue: currentStore.region
                                })(<Cascader
                                    placeholder={'请选择'}
                                    style={{width:'100%'}}
                                    options={regionList}
                                    loadData={this.loadRegionData}
                                    onChange={this.onChangeRegion}
                                    
                                />)}
                            
                            </FormItem>
                            <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="具体地址">
                                {getFieldDecorator('address', {
                                    initialValue: currentStore.address
                                })(<Input placeholder="请输入店仓地址" maxLength={100} />)}
                            </FormItem>
                                <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}} label="状态">
                                    {getFieldDecorator('disabled', {
                                        initialValue: currentStore.disabled ===0,
                                        valuePropName:'checked'
                                    })(<Checkbox >启用</Checkbox>)}
                                </FormItem>
                                <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}} label="是否零售">
                                    {getFieldDecorator('isRetail', {
                                        initialValue: currentStore.isRetail===1,
                                        valuePropName:'checked'
                                    })(<Checkbox >是</Checkbox>)}
                                </FormItem>
                        </div>
                        </Spin>
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default EditStore;