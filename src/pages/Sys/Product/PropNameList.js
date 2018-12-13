/**
 * 属性名称列表，如颜色、尺码、型号等
 */
import React, { PureComponent } from 'react';
import {Divider, Table, Button, Icon, notification, Dropdown, Menu, Popconfirm, Modal} from 'antd';
import { connect } from 'dva';

import styles from './Catalog.less';
import PropModal from './PropKeyModal';
import DropdownMenu from "../Acc/RoleDropdownMenu";
@connect(({itemCatalog, propKey, loading}) => ({
    itemCatalog,
    propKey,
    loading: loading.effects['propKey/listProps'],
}))
export default class PropNameList extends PureComponent {
    constructor(props){
        super(props);
        const {dispatch} = this.props
        dispatch({
            type: 'propKey/listProps',
        })
    }
    onCreatePropModal = () => {
        const {itemCatalog:{editCatalogData}} = this.props;
        console.log('editCatalogData',editCatalogData);
        if(!editCatalogData || editCatalogData.id<1){
            notification.warn({
                message: '温馨提示',
                description: '请先选择类目',
            });
            return;
        }
        this.props.dispatch({
            type: 'propKey/showPropModal',
            payload: {
                modalType: 'create',
                catalog:{id:editCatalogData.id,catalogName:editCatalogData.name},
                propkey:{
                    id:0,
                    formType:"0",
                    sortWeight:0
                }
            },
        });
    };
    onSubmitPropForm=(values)=>{
        const {propKey: {propModalType,editProp, currentCatalog}} = this.props;
        console.log('editCatalogData',currentCatalog);
        this.props.dispatch({
            type: `propKey/${propModalType}`,
            payload: {
                id:editProp.id,
                catalogId:currentCatalog.id,
                ...values
            },
        })
    };
    onCancelPropModal = () => {
        this.props.dispatch({
            type: 'propKey/hidePropModal',
        });
    };
    /**
     * 选某个属性的相关操作
     * @param record
     * @param e
     */
    selectMenu =(record,e)=>{
        const {dispatch} = this.props;
        console.log('record',record);
        if(e.key=='edit'){
            dispatch({
                type:'propKey/showPropModal',
                payload:{
                    modalType:'update',
                    catalog:{id:record.catalogId,catalogName:record.catalogName},
                    propkey:record
                }
            })
        }else if(e.key=='delete'){
            Modal.confirm({
                title: '提示',
                content: '是否要删除选中的属性？属性下的属性值也会被一起删除',
                onOk: () => {
                    this.props.dispatch({
                        type: 'propKey/removeProp',
                        payload: {
                            id:record.id
                        }
                    });
                },
                onCancel() {},
            });
        }else if(e.key=='propValueList'){
            this.props.onShowPropValueList(record);
        }
    }

    render() {
        if (this.props.hide) {
            return null;
        }
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title:'所属类目',
                dataIndex:'catalogName',
                key:'catalogName',
            },
            {
                title: '颜色属性',
                dataIndex: 'isColor',
                key: 'isColor',
                render:(text,record)=>(record.isColor>0?'是':'否')
            },
            {
                title: '销售属性',
                dataIndex: 'isSaleProp',
                key: 'isSaleProp',
                render:(text,record)=>(record.isSaleProp>0?'是':'否')
            },
            {
                title: '输入形式',
                dataIndex: 'formType',
                key: 'formType',
                render:(text, record)=>{
                    switch(parseInt(record.formType)){
                        case 1:
                            return '输入框';
                        case 2:
                            return '单选';
                        case 3:
                            return '多选';
                        case 4:
                            return '多行输入框';

                    }
                }
            },
            {
                title: '应用于编码',
                dataIndex: 'isApplyCode',
                key: 'isApplyCode',
                render:(text,record)=>(record.isApplyCode>0?'是':'否')
            },
            {
                title: '应用于搜索',
                dataIndex: 'usedForSearch',
                key: 'usedForSearch',
                render:(text,record)=>(record.usedForSearch>0?'是':'否')
            },
            {
                title: '排序权重',
                dataIndex: 'sortWeight',
                key: 'sortWeight'
            },
            {
                title: '操作',
                key: 'action',
                fixed:'right',
                width:100,
                render: (text, record) => (
                    <Dropdown
                        overlay={
                            <Menu onClick={e=>this.selectMenu(record,e)}>
                                <Menu.Item key={'edit'}>编辑</Menu.Item>
                                <Menu.Item key={'delete'}>删除</Menu.Item>
                                <Menu.Item key={'propValueList'}>属性值</Menu.Item>
                            </Menu>
                        }
                    >
                        <a href="#">更多 <Icon type="down" /></a>
                    </Dropdown>
                ),
            },
        ];
        const {
            loading,
            propKey: { data, propModalVisible, editProp, propModalType, currentCatalog },
            itemCatalog:{ editCatalogData }
        } = this.props;
        const modalProps = {
            item: propModalType === 'create' ? {} : editProp,
            visible: propModalVisible,
            title: propModalType === 'create' ? '新建属性' : '编辑属性',
            onOk: this.onSubmitPropForm,
            currentCatalog,
            onCancel: () => this.onCancelPropModal(),
        };
        console.log('editProp',editProp);
        return (
            <div>
                <div className={styles.title}>
                    {editCatalogData && editCatalogData.name ?editCatalogData.name :''}类目属性列表</div>
                <div className={styles.toolbar}>
                    <Button type="default" size="small" onClick={this.onCreatePropModal}>
                        新增
                    </Button>
                </div>
                {propModalVisible && <PropModal {...modalProps} />}
                <Table
                    rowKey={record => record['id']}
                    columns={columns}
                    dataSource={data.list}
                    scroll={{ x: 1000 }}
                    loading={loading}/>
            </div>
        );
    }
}
