/**
 * 属性值列表，如红色、黄色、黑色、S、L、XS、XL
 */
import React, { PureComponent } from 'react';
import {Divider, Table, Button, Icon, Modal} from 'antd';
import {connect} from 'dva';
import styles from './Catalog.less';
import PropModal from './PropValueModal';
@connect(({propValue, propKey, loading}) => ({
    propValue,
    propKey,
    loading: loading.effects['propValue/listPropValues'],
}))
export default class PropValueList extends PureComponent {
    constructor(props) {
        super(props);
        if(props.propkey.id){
            this.props.dispatch({
                type:'propValue/listPropValues',
                payload:{propkeyId:props.propkey.id}
            })
        }
    }

    /**
     * 显示创建属性值窗口
     */
    onCreatePropValueModal = ()=>{
        this.props.dispatch({
            type:'propValue/showPropModal',
            payload:{modalType:'create'},
            propvalue:{
                id:0
            }
        });
    };
    onSubmitPropForm=(values)=>{
        const {propValue: {propModalType,editPropValue},propkey} = this.props;
        this.props.dispatch({
            type: `propValue/${propModalType}`,
            payload: {
                id:editPropValue?editPropValue.id:0,
                propkeyId:propkey.id,
                ...values
            },
        })
    };
    onCancelPropModal=()=>{
        this.props.dispatch({
            type:'propValue/hidePropModal'
        });
    };
    /**
     * 点编辑时
     * @param record
     */
    onEdit=(record)=>{
        this.props.dispatch({
            type:'propValue/showPropModal',
            payload:{
                modalType:'update',
                propvalue:record
            }
        });
    };
    /**
     * 删除属性值
     * @param record
     */
    onRemove=(record)=>{
        Modal.confirm({
            title: '提示',
            content: '是否要删除选中的属性值',
            onOk: () => {
                this.props.dispatch({
                    type: 'propValue/remove',
                    payload: {
                        id:record.id
                    }
                });
            },
            onCancel() {},
        });
    };
    render() {
        if (this.props.hide) {
            return null;
        }
        const columns = [
            {
                title: '属性值',
                dataIndex: 'propvalue',
                key: 'propvalue'
            },
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '描述',
                dataIndex: 'summary',
                key: 'summary',
            },
            {
                title: '色值',
                dataIndex: 'colorHexValue',
                key: 'colorHexValue',
                render:(text,record)=>(this.props.propkey.isColor>0?record.colorHexValue:'无')
            },
            {
                title: '排序权重',
                dataIndex: 'sortWeight',
                key: 'sortWeight',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        <Divider type="vertical" />
                        <a  onClick={this.onRemove.bind(this, record)}>删除</a>
                    </span>
                ),
            },
        ];


        const {loading, propkey,propValue:{propModalVisible,propModalType,editPropValue,data}} = this.props;

        const modalProps = {
            item: propModalType === 'create' ? {} : editPropValue,
            visible: propModalVisible,
            title: propModalType === 'create' ? '新建属性值' : '编辑属性值',
            onOk: this.onSubmitPropForm,
            propkey,
            onCancel: () => this.onCancelPropModal(),
        };
        return (
            <div>
                <div className={styles.title}>{propkey.name} 的属性值</div>
                <div className={styles.toolbar}>
                    <Button type="default" size="small" onClick={this.props.hideValueList}>
                        返回
                    </Button>
                    <Button type="primary" size="small" onClick={this.onCreatePropValueModal}>
                        新增
                    </Button>
                </div>
                {propModalVisible && <PropModal {...modalProps} />}

                <Table
                    rowKey={record => record['id']}
                    loading={loading}
                    columns={columns}
                    dataSource={data.list}
                />
            </div>
        );
    }
}
