/**
 * 创建属性
 */
import React, {Fragment, PureComponent} from 'react';
import {
    Divider,
    Form,
    Button,
    Table,
    notification,
    Dropdown,
    Select,
    Popconfirm,
    Card,
    Input,
    Row,
    Col, Checkbox
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from '../../common.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout'

const FormItem = Form.Item;

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}
class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);


@connect(({propKey, propSet,loading}) => ({
    propKey,
    propSet,
    loading: loading.effects['propSet/getPropSet'],
}))
@Form.create()
@DragDropContext(HTML5Backend)
export default class EditPropKey extends PureComponent {
    constructor(props){
        super(props);
        const params = this.props.match.params;
        if(params['id']){
            this.props.dispatch({
                type:'propSet/getPropSet',
                payload:{
                    id:params['id']
                }
            });
        }
        this.props.dispatch({
            type:'propKey/listProps'
        });

        const {form:{getFieldDecorator}} = this.props;
        /**
         * 属性值表格的列
         * 注意 getFieldDecorator里的字段名要加record.id
         * @type {*[]}
         */
        this.columns = [
            {
                title:'属性',
                dataIndex:'propkeyName',
                inputType:'text'
            },
            {
                title:'必填',
                dataIndex:'isRequired',
                render:(text,record)=>{
                    return getFieldDecorator('isRequired'+record.id, {
                        initialValue: record.isRequired>0,
                        valuePropName:'checked',
                    })(<Checkbox onChange={(e)=>this.onCheckValue(e.target.checked,record,'isRequired',e)}/>)
                }
            },
            {
                title:'销售属性',
                dataIndex:'isSaleProp',
                render:(text,record)=>{
                    console.log('ISS',record);
                    return getFieldDecorator('isSaleProp'+record.id, {
                        initialValue: record.isSaleProp>0,
                        valuePropName:'checked',
                    })(<Checkbox onChange={(e)=>this.onCheckValue(e.target.checked,record,'isSaleProp')}/>)
                }
            },
            {
                title:'应用于编码',
                dataIndex:'isApplyCode',
                render:(text,record)=>{
                    return getFieldDecorator('isApplyCode'+record.id, {
                        initialValue: record.isApplyCode>0,
                        valuePropName:'checked',
                    })(<Checkbox onChange={(e)=>this.onCheckValue(e.target.checked,record,'isApplyCode')}/>)
                }
            },
            {
                title:'应用于搜索',
                dataIndex:'usedForSearch',
                render:(text,record)=>{
                    return getFieldDecorator('usedForSearch'+record.id, {
                        initialValue: record.usedForSearch>0,
                        valuePropName:'checked',
                    })(<Checkbox onChange={(e)=>this.onCheckValue(e.target.checked,record,'usedForSearch')}/>)
                }
            },
            {
                title:'禁用',
                dataIndex:'disabled',
                render:(text,record)=>{
                    return getFieldDecorator('disable'+record.id, {
                        initialValue: record.disable>0,
                        valuePropName:'checked',
                    })(<Checkbox onChange={(e)=>this.onCheckValue(e.target.checked,record,'disable')}/>)
                }
            },
            {
                title:'操作',
                dataIndex:'action',
                render:(text,record)=>{
                    return (
                        <Popconfirm
                            title="确定取消?"
                            onConfirm={() => this.onDelete(record.propkeyId)}
                        >
                        <a >删除</a>
                        </Popconfirm>
                    )
                }
            }
        ]
    }

    /**
     *
     * @param e
     */
    onCheckValue=(isChecked,record,field,e)=>{
        let cset = {...this.props.propSet.currentSet};

        cset.propkeyList = cset.propkeyList.map((pk)=>{
            if(pk['propkeyId'] == record.propkeyId){
                pk[field] = isChecked?1:0;
            }
            return pk;
        });
        this.props.dispatch({
            type:'propSet/setCurrentSet',
            payload:{
                currentSet:cset
            }
        })
    };
    /**
     * 点击保存按钮时
     */
    onSave = ()=>{
        const {form:{validateFields,getFieldsValue },dispatch,propSet: {currentSet}} = this.props;
        validateFields(['name'],(error)=>{
            if(!error){
               const saveType = currentSet.id ? 'update':'create';
                const values = getFieldsValue();
                dispatch({
                    type: `propSet/${saveType}`,
                    payload: {
                        id:currentSet?currentSet.id:0,
                        name:values['name'],
                        propkeyList:currentSet.propkeyList
                    },
                    callback:()=>{
                        notification.success({
                            message:'提示',
                            description:'保存成功'
                        });
                        dispatch(routerRedux.goBack());
                    }
                });
            }
        });
    }

    /**
     * 删除属性值
     * @param id
     */
    onDelete = id =>{
        this.props.dispatch({
            type:'propSet/fakeRemovePropKey',
            payload:{
                propkeyId:id
            }
        })
    };
    onBack = () => {
        this.props.dispatch(
            routerRedux.goBack()
        );
    };
    /**
     * 选好要添加的属性
     */
    onSelectProp=(v,option)=>{
        this.props.dispatch({
            type:'propSet/selectProp',
            payload:{
                propkey:{
                    id:v,
                    name:option.props.children
                }
            }
        });
    };
    /**
     * 根据选中的属性，添加到属性集合
     */
    onAppendPropKey=()=>{
        const {form,propSet:{selectedPropKey}} = this.props;
        console.log('selectedPropKey',selectedPropKey);
        if(!selectedPropKey || !selectedPropKey.id || parseInt(selectedPropKey.id)<=0){
            notification.warn({
                message: '温馨提示',
                description: '请先选择要追加的属性',
            })
        }
        this.props.dispatch({
            type:'propSet/appendPropKey',
            payload:{
                propkey:selectedPropKey,
                id:'new-'+Math.random()
            }
        });
    };
    /**
     * 拖动行
     * @param dragIndex
     * @param hoverIndex
     */
    moveRow = (dragIndex, hoverIndex) => {
        const currentSet = this.props.propSet.currentSet;

        const dragRow = currentSet.propkeyList[dragIndex];
        this.props.dispatch({
            type:'propSet/setCurrentSet',
            payload:{
                currentSet:update(currentSet, {
                    propkeyList: {
                        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                    },
                })
            }
        });
    };
    render() {
        const {
            loading,
            form: { getFieldDecorator },
            propSet:{currentSet}
        } = this.props;
        const components = {
            body: {
                row: DragableBodyRow
            },
        };
        const tableHeader =()=> {
            const {propKey: {data}} = this.props;
            return (<Row>
                <Col span={5}>
                <Select style={{"width":"95%"}} onChange={this.onSelectProp}>
                    <Select.Option value={0}>请选择属性</Select.Option>
                    {data && data.list && data.list.map((opt)=>{
                        let attrList = [];
                        attrList.push(<Select.Option value={opt.id}>{opt.name}</Select.Option>);
                        return attrList;
                    })}
                </Select>
                </Col>
                <Col span={8}>
                    <Button type="primary"onClick={this.onAppendPropKey}>添加属性</Button>
                </Col>
            </Row>);

        };
        return (
            <PageHeaderLayout title={currentSet.id>0?'编辑属性集':'创建属性集'}>
                <Card bordered={false}>
                    <div className={styles.tableList}>

                        <div className={styles.tableListOperator}>
                            <Button icon="arrow-left" type="default" onClick={this.onBack}>
                                返回
                            </Button>
                            <Button icon="save" type="primary" onClick={this.onSave}>
                                保存
                            </Button>
                        </div>
                        <Divider />
                        <div>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性集名称">
                                {getFieldDecorator('name', {
                                    initialValue: currentSet.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入属性集名称',
                                        },
                                    ],
                                })(<Input placeholder="请输入" maxLength="50" />)}
                            </FormItem>

                        </div>
                        <Divider />

                                <Table
                                    columns={this.columns}
                                    rowKey={record => record['id']}
                                    dataSource={currentSet.propkeyList}
                                    components={components}
                                    pagination={false}
                                    loading={loading}
                                    title={tableHeader}
                                    onRow={(record, index) => ({
                                        index,
                                        moveRow: this.moveRow,
                                    })}
                                    bordered
                                />
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
