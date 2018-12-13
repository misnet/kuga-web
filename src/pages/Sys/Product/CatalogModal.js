/**
 * 类目添加修改窗口
 * @author Donny
 *
 */
import { Form, Input, Modal, Select, InputNumber, Radio } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const catalogModal = ({
    item = {},
    onOk,
    catalogList = [],
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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类目名称">
                {getFieldDecorator('name', {
                    initialValue: item.name,
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
                    initialValue: item.code,
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
                    initialValue: item.parentId,
                    rules: [
                        {
                            required: true,
                            message:'请选择上级类目'
                        },
                    ],
                })(
                    <Select style={{ width: '100%' }}>
                        <Select.Option value="0">--顶级类目--</Select.Option>
                        {renderOption(catalogList,0)}
                    </Select>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序权重">
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
catalogModal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
};
export default Form.create()(catalogModal);
