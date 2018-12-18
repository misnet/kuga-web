/**
 * 属性名称列表，如颜色、尺码、型号等
 */
import React, { PureComponent } from 'react';
import {Divider, Table, Button, Icon, notification, Dropdown, Menu, Popconfirm, Modal, Card} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';

import styles from '../../common.less';
import PropModal from './PropKeyModal';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'
import MenuModal from "../MenuModal";

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
    onCreatePropKey = () => {
        this.props.dispatch(
            routerRedux.push(`/sys/props/edit-propkey`)
        );
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
        if(e.key=='edit'){
            dispatch(routerRedux.push('/sys/props/edit-propkey/'+record.id));
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
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '颜色属性',
                dataIndex: 'isColor',
                key: 'isColor',
                render:(text,record)=>(record.isColor>0?'是':'否')
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
                title: '描述',
                dataIndex: 'summary',
                key: 'summary'
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
            <PageHeaderLayout title={formatMessage({id:'sys.attrs.manage'})}>
                <Card bordered={false}>
                    <div className={styles.tableList}>

                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={this.onCreatePropKey}>
                                {formatMessage({
                                    id:'sys.attrs.create'
                                })}
                            </Button>
                        </div>

                        <Table
                            rowKey={record => record['id']}
                            columns={columns}
                            dataSource={data.list}
                            scroll={{ x: 600 }}
                            loading={loading}/>
                    </div>
                </Card>
                {propModalVisible && <PropModal {...modalProps} />}
            </PageHeaderLayout>
        );
    }
}