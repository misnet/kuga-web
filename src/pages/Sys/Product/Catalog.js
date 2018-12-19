/**
 * 产品类目
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
    Select,
    notification,
    Table,
    Card,
    Button,
    Form,
    Tree,
    Layout,
    Row,
    Col,
    Modal, Input, InputNumber,
} from 'antd';
import { Link } from 'dva/router';
import QueueAnim from 'rc-queue-anim';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Catalog.less';
import PropNameList from './PropNameList';
import PropValueList from './PropValueList';
import CatalogModal from './CatalogModal';

const { Header, Footer, Sider, Content } = Layout;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

@connect(({ itemCatalog, propKey }) => ({
    itemCatalog,
    propKey
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
    }
    showPropValueList = (propkey) => {
        this.setState({
            hidePropValueList: false,
            propkey
        });
    };
    hideValueList = () => {
        this.setState({
            hidePropValueList: true,
        });
    };
    onCreateCatalogModal = () => {
        this.props.dispatch({
            type: 'itemCatalog/showCatalogModal',
            payload: {
                modalType: 'create',
            },
        });
    };
    onCancelCatalogModal = () => {
        this.props.dispatch({
            type: 'itemCatalog/hideCatalogModal',
        });
    };
    onEditCatalogModal = () => {
        if (this.props.itemCatalog.selectedCatalogId) {
            this.props.dispatch({
                type: 'itemCatalog/showCatalogModal',
                payload: {
                    modalType: 'update',
                },
            });
        } else {
            notification.error({
                message: '错误提示',
                description: '请选择要修改的类目',
            });
        }
    };
    onSelectCatalog = (keys, e) => {
        this.props.dispatch({
            type: 'itemCatalog/selectCatalog',
            payload: {
                catalogId: e.node.props.dataRef.id,
                catalog:e.node.props.dataRef
            },
        });
        this.props.dispatch({
            type:'propKey/listProps',
            payload:{
                catalogId:e.node.props.dataRef.id
            }
        })
    };
    onDeleteCatalog = () => {
        if (this.props.itemCatalog.selectedCatalogId) {
            Modal.confirm({
                title: '提示',
                content: '是否要删除选中的类目？',
                onOk: () => {
                    this.props.dispatch({
                        type: 'itemCatalog/removeCatalog',
                        payload: {
                            id:this.props.itemCatalog.selectedCatalogId
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
    onSubmitCatalogForm = (values) => {
        const {itemCatalog: {catalogModalType,selectedCatalogId}} = this.props;
        this.props.dispatch({
            type: `itemCatalog/${catalogModalType}`,
            payload: {
                id:selectedCatalogId,
                ...values
            },
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
            itemCatalog: { catalogModalVisible, catalogModalType, editCatalogData, data},
            form:{getFieldDecorator}
        } = this.props;
        const modalProps = {
            item: catalogModalType === 'create' ? {} : editCatalogData,
            visible: catalogModalVisible,
            title: catalogModalType === 'create' ? '新建类目' : '编辑类目',
            onOk: this.onSubmitCatalogForm,
            catalogList:data,
            //confirmLoading: modalType === 'create' ? createLoading : updateLoading,
            onCancel: () => this.onCancelCatalogModal(),
        };

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

            return (
            <PageHeaderLayout title="类目属性">
                <Layout>
                    <Sider className={styles.sidebar}>
                        <div className={styles.title}>类目</div>
                        <div className={styles.toolbar}>
                            <Button type="default" size="small" onClick={this.onCreateCatalogModal}>
                                新增
                            </Button>
                            <Button type="default" size="small" onClick={this.onEditCatalogModal}>
                                修改
                            </Button>
                            <Button type="danger" size="small" onClick={this.onDeleteCatalog}>
                                删除
                            </Button>
                        </div>
                        {catalogModalVisible && <CatalogModal {...modalProps} />}
                        <div>
                            <Tree
                                showLine
                                defaultExpandedKeys = {[]}
                                onSelect = {this.onSelectCatalog}
                            >
                                {this.renderTreeNodes(data)}
                            </Tree>

                        </div>
                    </Sider>
                    <Content className={styles.propNameList}>
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
                        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类目编码">
                            {getFieldDecorator('code', {
                                initialValue: editCatalogData.code,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入类目编码',
                                    },
                                ],
                            })(<Input placeholder="请输入" maxLength="10" />)}
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
                                initialValue: editCatalogData.sortWeight,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入权重值，默认为0',
                                    },
                                ],
                            })(<InputNumber placeholder="请输入" maxLength="10" />)}
                        </FormItem>
                    </Content>
                </Layout>
            </PageHeaderLayout>
        );
    }
}
