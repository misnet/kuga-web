/**
 * 属性值添加修改窗口
 * @author Donny
 *
 */
import {Form, Input, Modal, Select, InputNumber, Radio, Checkbox,Row,Col} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const PropModal = ({
                       item = {},
                       onOk,
                       propkey = [],
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
                {propkey.name}
            </FormItem>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="属性值">
                {getFieldDecorator('propvalue', {
                    initialValue: item.propvalue,
                    rules: [
                        {
                            required: true,
                            message: '请输入属性值',
                        },
                    ],
                })(<Input placeholder="请输入" maxLength="50" />)}
            </FormItem>

            <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 15}}
                label="编码"
            >
                {getFieldDecorator('code', {
                    initialValue: item.code,
                    rules:[{
                        required:true,
                        message:'请输入编码'
                    }]
                })(
                    <Input placeholder="请输入" maxLength="50" />
                )}

            </FormItem>
            <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 15}}
                label="描述"
            >
                {getFieldDecorator('summary', {
                    initialValue: item.summary,
                    rules:[]
                })(
                    <Input placeholder="请输入" maxLength="50" />
                )}

            </FormItem>
            {propkey.isColor>0?<FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 15}}
                label="色值"
            >
                {getFieldDecorator('colorHexValue', {
                    initialValue: item.colorHexValue,
                    rules:[]
                })(
                    <Input placeholder="请输入" maxLength="50" />
                )}

            </FormItem>:[]}
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="排序权重">
                {getFieldDecorator('sortWeight', {
                    initialValue: item.sortWeight,
                    rules: [
                        {
                            required: true,
                            message: '请输入权重值，默认为0',
                        },
                    ],
                })(<InputNumber placeholder="请输入" maxLength="10" />)}
            </FormItem>

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
