/**
 * 属性名称列表，如颜色、尺码、型号等
 */
import React, { PureComponent } from 'react';
import {Divider, Table, Button, Icon, notification, Dropdown, Menu, Popconfirm, Modal, Card, Form, Input} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';

import styles from '../../common.less';
import PropModal from './PropKeyModal';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'

const FormItem = Form.Item;
const EditableContext = React.createContext();
class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input placeholder={'请输入'}/>;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            required,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: required,
                                            message: `请输入 ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}




@connect(({propSet, loading}) => ({
    propSet,
    loading: loading.effects['propSet/listPropSets'],
}))
export default class PropSetList extends PureComponent {
    constructor(props){
        super(props);
        const {dispatch} = this.props
        dispatch({
            type: 'propSet/listPropSets',
        })
    }
    onCreatePropSet = () => {
        this.props.dispatch(
            routerRedux.push(`/sys/propsets/edit`)
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
    /**
     * 选某个属性的相关操作
     * @param record
     * @param e
     */
    selectMenu =(record,e)=>{
        const {dispatch} = this.props;
        if(e.key=='edit'){
            dispatch(routerRedux.push('/sys/propsets/edit/'+record.id));
        }else if(e.key=='delete'){
            Modal.confirm({
                title: '提示',
                content: '是否要删除选中的属性集？',
                onOk: () => {
                    this.props.dispatch({
                        type: 'propSet/remove',
                        payload: {
                            id:record.id
                        }
                    });
                },
                onCancel() {},
            });
        }
    }

    render() {
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
                title: '属性数量',
                dataIndex: 'cntPropKey',
                key: 'cntPropKey'
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
                                <Menu.Item key={'edit'}>{formatMessage({id:'form.edit'})}</Menu.Item>
                                <Menu.Item key={'delete'}>{formatMessage({id:'form.remove'})}</Menu.Item>
                            </Menu>
                        }
                    >
                        <a href="#">{formatMessage({id:'form.more'})} <Icon type="down" /></a>
                    </Dropdown>
                ),
            },
        ];
        const {
            loading,
            propSet: { data }
        } = this.props;
        return (
            <PageHeaderLayout title={formatMessage({id:'sys.attrset.manage'})}>
                <Card bordered={false}>
                    <div className={styles.tableList}>

                        <div className={styles.navToolbar}>
                            <Button icon="plus" type="primary" onClick={this.onCreatePropSet}>
                                {formatMessage({
                                    id:'sys.attrset.create'
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
            </PageHeaderLayout>
        );
    }
}
