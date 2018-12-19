/**
 * 创建属性
 */
import React, { PureComponent } from 'react';
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
import PageHeaderWrapper from '../../../components/PageHeaderWrapper'
import DICT from "../../../dict";

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


@connect(({propKey, loading}) => ({
    propKey,
    loading: loading.effects['propKey/getProp'],
}))
@Form.create()
@DragDropContext(HTML5Backend)
export default class EditPropKey extends PureComponent {
    constructor(props){
        super(props);
        const params = this.props.match.params;
        if(params['id']){
            this.props.dispatch({
                type:'propKey/getProp',
                payload:{
                    id:params['id']
                }
            }).then(()=>{
                if(this.props.propKey.editProp){
                    this.setState({
                        formType:this.props.propKey.editProp.formType
                    })
                }
            });
        }else{
            this.props.dispatch({
                type:'propKey/setEditProp',
                payload:{
                    propkey:{
                        id:0,
                        name: '',
                        isColor: 0,
                        formType:"0",
                        summary:'',
                        valueList:[]
                    }
                }
            })
        }

        this.EditableFormRow = ({  ...props }) => (
            <EditableContext.Provider value={this.props.form}>
                <DragableBodyRow {...props} />
            </EditableContext.Provider>
        );
        this.state = {
            formType:"0",
            editingId:'',
            isColor:false
        }
        /**
         * 属性值表格的列
         * @type {*[]}
         */
        this.columns = [
            {
                title:'属性值',
                dataIndex:'propvalue',
                editable:true,
                required:true
            },
            {
                title:'编码',
                dataIndex:'code',
                editable:true,
                required:true
            },
            {
                title:'颜色值，多个逗号分隔',
                dataIndex:'colorHexValue',
                editable:true,
                required:false
            },
            {
                title:'操作',
                dataIndex:'action',
                render:(text,record)=>{
                    const editable = this.isEditing(record);
                    return (
                        <div>
                            {editable ?(
                                <span>
                                    <EditableContext.Consumer>
                                        {form =>(
                                            <a onClick={()=>this.onSavePropValue(form,record.id)}>确定</a>
                                        )}
                                    </EditableContext.Consumer>
                                    <Divider type="vertical"/>
                                    <Popconfirm
                                        title="确定取消?"
                                        onConfirm={() => this.onCancel(record.id)}
                                    >
                                        <a >取消</a>
                                      </Popconfirm>
                                </span>
                                ):(<span><a onClick={()=>{this.onEdit(record.id)}}>编辑</a>
                                <Divider type="vertical"/>
                                <a  onClick={()=>this.onDelete(record.id)}>删除</a></span>)}
                        </div>
                    )
                }
            }
        ]
    }
    isEditing = record => record.id === this.state.editingId;
    isColor   = e =>{
        this.setState({
            isColor:e.target.checked
        });
    }
    /**
     * 取消编辑属性值
     */
    onCancel = (id)=>{
        this.setState({ editingId: '' });
        if(/^new(.*)/.test(id)){
            this.onDelete(id);
        }
    };

    /**
     * 点击保存按钮时
     */
    onSave = ()=>{
        const {form:{validateFields,getFieldsValue },dispatch,propKey: {editProp}} = this.props;
        validateFields((error)=>{
            if(!error){
               const saveType = editProp.id ? 'update':'create';
                const values = getFieldsValue();
                dispatch({
                    type: `propKey/${saveType}`,
                    payload: {
                        id:editProp?editProp.id:0,
                        ...values
                    },
                    callback:()=>{
                        dispatch(routerRedux.goBack());
                    }
                });
            }
        });
    }
    /**
     * 保存属性值
     */
    onSavePropValue =(form,id)=>{
        form.validateFields(['propvalue','code','colorHexValue'],(error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.props.propKey.editProp.valueList];
            const index = newData.findIndex(item => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ editingId: '' });
            } else {
                newData.push(row);
                this.setState({ editingId: '' });
            }
            this.props.dispatch({
                type:'propKey/setEditProp',
                payload:{
                    propkey:{
                        ...this.props.propKey.editProp,
                        valueList:newData
                    }
                }
            });
        });
    };
    /**
     * 删除属性值
     * @param id
     */
    onDelete = id =>{
        this.props.dispatch({
            type:'propKey/fakeRemovePropValue',
            payload:{
                id
            }
        })
    };
    /**
     * 编辑属性值
     * @param key
     */
    onEdit = (key)=> {
        console.log('key',key);
        this.setState({ editingId: key });
    };
    onBack = () => {
        this.props.dispatch(
            routerRedux.goBack()
        );
        //routerRedux.push(`/sys/props`)
    };
    onChangeFormType=(v)=>{
        console.log('formType',v);
        this.setState({
            formType:v
        })
    }
    onCreatePropValue=()=>{
        const id = 'new-'+Math.random();
        this.setState({
            editingId:id
        });
        this.props.dispatch({
            type:'propKey/addEmptyPropValue',
            payload:{
                id
            }
        });
    };
    /**
     * 拖动行
     * @param dragIndex
     * @param hoverIndex
     */
    moveRow = (dragIndex, hoverIndex) => {
        const editProp = this.props.propKey.editProp;

        const dragRow = editProp.valueList[dragIndex];
        this.props.dispatch({
            type:'propKey/setEditProp',
            payload:{
                propkey:update(editProp, {
                    valueList: {
                        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                    },
                })
            }
        });
    };
    render() {
        const {
            form: { getFieldDecorator, validateFields, getFieldsValue },
            propKey:{editProp}
        } = this.props;
        const components = {
            body: {
                row: this.EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            if(col.dataIndex == 'colorHexValue' && !this.state.isColor){
                return col;
            }
            const isRequired = col.required||this.state.isColor;
            return {
                ...col,
                onCell: record => ({
                    record,
                    required:isRequired,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <PageHeaderWrapper title={editProp.id>0?'编辑属性':'创建属性'}>
                <Card bordered={false}>
                    <div className={styles.tableList}>

                        <div className={styles.navToolbar}>
                            <Button icon="arrow-left" type="default" onClick={this.onBack}>
                                返回
                            </Button>
                            <Button icon="save" type="primary" onClick={this.onSave}>
                                保存
                            </Button>
                        </div>
                        <Divider />
                        <div>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性名称">
                                {getFieldDecorator('name', {
                                    initialValue: editProp.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入属性名称',
                                        },
                                    ],
                                })(<Input placeholder="请输入" maxLength="50" />)}
                            </FormItem>
                            <FormItem
                                labelCol={{span: 8}}
                                wrapperCol={{span: 15}}
                                label="输入形式"
                            >
                                {getFieldDecorator('formType', {
                                    initialValue: editProp.formType,
                                    rules:[{
                                        required:true,
                                        message:'请选择输入形式'
                                    }]
                                })(
                                    <Select
                                        style={{width: '100%'}}
                                        onChange={this.onChangeFormType}
                                    >
                                        <Select.Option value="0">--选择输入形式--</Select.Option>
                                        {DICT.FORM_TYPE.list.map((opt, e) => {
                                            let optionComponent = [];
                                            optionComponent.push(<Select.Option value={opt.id}>{opt.name}</Select.Option>)

                                            return optionComponent;
                                        })}
                                    </Select>
                                )}

                            </FormItem>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性描述">
                                {getFieldDecorator('summary', {
                                    initialValue: editProp.summary,
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入属性描述',
                                        },
                                    ],
                                })(<Input placeholder="请输入" maxLength="50" />)}
                            </FormItem>
                            <Row>
                                <Col span={8}></Col>
                                <Col span={16}>{getFieldDecorator('isColor', {
                                    initialValue:parseInt(editProp.isColor)>0,
                                    valuePropName:'checked',
                                })(
                                    <Checkbox onChange={this.isColor} defaultChecked={editProp.isColor > 0} name="isColor">是否是颜色</Checkbox>
                                )}
                                </Col>
                            </Row>

                        </div>
                        <Divider />
                        {
                            (this.state.formType == DICT.FORM_TYPE.CHECKBOX || this.state.formType == DICT.FORM_TYPE.RADIO) ?
                                <Table
                                    rowClassName={() => 'editable-row'}
                                    columns={columns}
                                    rowKey={record => record['id']}
                                    dataSource={editProp.valueList}
                                    components={components}
                                    pagination={false}
                                    title={() => '当前属性的属性值'}
                                    onRow={(record, index) => ({
                                        index,
                                        moveRow: this.moveRow,
                                    })}
                                    bordered
                                    footer={() => <Button type="default"
                                                          onClick={this.onCreatePropValue}>添加属性值</Button>}
                                />
                                : []
                        }
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
