/**
 * 属性添加修改窗口
 * @author Donny
 *
 */
import {Form, Input, Modal, Select, InputNumber, Radio, Checkbox,Row,Col} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import DICT from '../../../dict';
const FormItem = Form.Item;
const PropModal = ({
                       item = {},
                       onOk,
                       currentCatalog = [],
                       form: { getFieldDecorator, validateFields, getFieldsValue },
                       ...modalProps
                   }) => {
    const submitForm = () => {
        validateFields(err => {
            if (!err) {
                onOk({ ...getFieldsValue() });
            }else{
                console.log(err);
            }
        });
    };
    const modalOpts = {
        onOk: submitForm,
        ...modalProps,
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
        <Modal {...modalOpts}>

            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性名称">
                {getFieldDecorator('name', {
                    initialValue: item.name,
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
                    initialValue: item.formType,
                    rules:[{
                        required:true,
                        message:'请选择输入形式'
                    }]
                })(
                    <Select
                        style={{width: '100%'}}
                    >
                        <Select.Option value="0">--选择输入形式--</Select.Option>
                        {DICT.FORM_TYPE.map((opt, e) => {
                            let optionComponent = [];
                            optionComponent.push(<Select.Option value={opt.id}>{opt.name}</Select.Option>)

                            return optionComponent;
                        })}
                    </Select>
                )}

            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性描述">
                {getFieldDecorator('summary', {
                    initialValue: item.summary,
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
                    initialValue:parseInt(item.isColor)
                })(
                    <Checkbox value={1}  defaultChecked={item.isColor > 0} name="isColor">是否是颜色</Checkbox>
                )}
                </Col>
            </Row>
        </Modal>
    );
};
PropModal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
};
export default Form.create()(PropModal);
