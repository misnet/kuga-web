/**
 * 产品类目
 * @author Donny
 *
 */
import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import {
    Select,
    notification,
    Card,
    Button,
    Form,
    Tree,
    Layout,
    Modal, Input, InputNumber, Divider,
} from 'antd';

import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './ItemCatalog.less';

const { Header, Footer, Sider, Content } = Layout;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

@connect(({ itemCatalog,propSet }) => ({
    itemCatalog,
    propSet
}))
@Form.create()
export default class Catalog extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hidePropValueList: true,
            catalogTree:[],
            propkey:null
        };
        const {dispatch} = this.props
        dispatch({
            type: 'itemCatalog/listCatalog',
            payload: {
                parentId: 0,
                loadTree: true
            },
        })
        dispatch({
            type:'propSet/listPropSets'
        })
    }
    onSelectCatalog = (keys, e) => {
        this.props.dispatch({
            type: 'itemCatalog/selectCatalog',
            payload: {
                catalog:e.node.props.dataRef
            },
        });
    };
    onDeleteCatalog = () => {
        if (this.props.itemCatalog.editCatalogData.id) {
            Modal.confirm({
                title: '提示',
                content: '是否要删除选中的类目？',
                onOk: () => {
                    this.props.dispatch({
                        type: 'itemCatalog/removeCatalog',
                        payload: {
                            id:this.props.itemCatalog.editCatalogData.id
                        }
                    });
                },
                onCancel() {},
            });
        } else {
            notification.error({
                message: '错误提示',
                description: '请选择要删除的类目',
            });
        }
    };
    /**
     * 点提交新建/编辑类目的OK键
     * @param values
     */
    onSaveCatalog = () => {
        const {form, itemCatalog: {editCatalogData}} = this.props;
        const catalogModalType = editCatalogData.id?'update':'create';
        form.validateFields((errors)=>{
            if(!errors){

                this.props.dispatch({
                    type: `itemCatalog/${catalogModalType}`,
                    payload: {
                        id:editCatalogData.id,
                        ...form.getFieldsValue()
                    },
                });
                this.props.form.resetFields();
            }
        })
    }
    onSwitchToNew = ()=>{
        this.props.dispatch({
            type:'itemCatalog/selectCatalog',
            payload:{
                catalog:{
                    name: '',
                    parentId: "0",
                    id:0,
                    sortWeight:0
                }
            }
        })
    }
    onLoadItemCatalogTree = (node)=>new Promise((resolve)=>{
        if(node.props.children){
            resolve();
            return;
        }
        this.props.dispatch({
            type: 'itemCatalog/listCatalog',
            payload: {
                parentId: node.props.id
            }
        }).then(()=>{
            node.props.dataRef.children = this.props.itemCatalog.data;
            this.setState({
                catalogTree:[...this.state.catalogTree]
            });
            console.log('Tree',this.state.catalogTree);
            resolve();
        });
    });
    renderTreeNodes = data => data.map((item)=>{
        if(item.children){
            return (
                <TreeNode title={item['name']} key={item['parentId']+'-'+item['id']} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            )
        }
        return <TreeNode title={item['name']} key={item['parentId']+'-'+item['id']} {...item} dataRef={item} />;
    });
    render() {
        const {
            itemCatalog: { catalogModalVisible, editCatalogData, data},
            propSet,
            form:{getFieldDecorator}
        } = this.props;
        const propSetList = propSet.data.list!==undefined?propSet.data.list:[];
        const renderOption = (cList,deep=0) =>{
            return cList.map((opt, e) => {
                let optionComponent = [];
                optionComponent.push(
                    <Select.Option value={opt.id}>{"--".repeat(deep)+opt.name}</Select.Option>
                );

                if(opt.children){
                    const childDeep = deep+1;
                    optionComponent.push(renderOption(opt.children,childDeep));
                }
                return optionComponent;
            })
        }
        console.log('editCatalogData',editCatalogData);
        return (
            <PageHeaderWrapper title={'类目管理'}>
                <Card bordered={false}>
                <Layout>
                    <Sider className={styles.sidebar}>
                        <div className={styles.title}>类目</div>
                        <div>
                            {!data||data.length==0?'暂未创建类目':(
                            <Tree
                                showLine
                                defaultExpandedKeys = {[]}
                                onSelect = {this.onSelectCatalog}
                            >
                                {this.renderTreeNodes(!data||data.length==0?[]:data)}
                            </Tree>)}

                        </div>
                    </Sider>
                    <Content className={styles.propNameList}>
                        <div className={styles.navToolbar}>
                            {editCatalogData.id?(
                                <Fragment>
                                    <Button icon="delete" type="default" onClick={this.onDeleteCatalog}>
                                        删除
                                    </Button>
                                    <Button icon="undo" type="primary" onClick={this.onSwitchToNew}>
                                        切换到新增
                                    </Button>
                                </Fragment>
                                ):null}
                            <Button icon="save" type="primary" onClick={this.onSaveCatalog}>
                                {editCatalogData.id?'保存修改':'保存新增'}
                            </Button>
                        </div>
                        <Divider />
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类目名称">
                            {getFieldDecorator('name', {
                                initialValue: editCatalogData.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入类目名称',
                                    },
                                ],
                            })(<Input placeholder="请输入" maxLength="50" />)}
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级类目">
                            {getFieldDecorator('parentId', {
                                initialValue: editCatalogData.parentId,
                                rules: [
                                    {
                                        required: true,
                                        message:'请选择上级类目'
                                    },
                                ],
                            })(
                                <Select style={{ width: '100%' }}>
                                    <Select.Option value="0">--顶级类目--</Select.Option>
                                    {renderOption(data,0)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序权重">
                            {getFieldDecorator('sortWeight', {
                                initialValue: parseInt(editCatalogData.sortWeight),
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入权重值，默认为0',
                                    },
                                ],
                            })(<InputNumber placeholder="请输入" maxLength="10" />)}
                        </FormItem>
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="使用的属性集">
                            {getFieldDecorator('propsetId', {
                                initialValue: editCatalogData.propsetId
                            })(
                                <Select style={{ width: '100%' }}>
                                    <Select.Option value="0">--请选择属性集--</Select.Option>
                                    {propSetList.map((opt)=>{
                                        let optList = [];
                                        optList.push(<Select.Option value={opt.id}>{opt.name}</Select.Option>);
                                        return optList;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Content>
                </Layout>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
