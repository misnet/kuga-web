import { Form, Input, Modal } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

const FormItem = Form.Item
const userModal = ({
                     editUser= {},
                     onOk ={},
                     form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                     },
   ...modalProps
 }) => {
  const submitForm = () => {
    validateFields((err) => {
      if (!err) {
        onOk({...getFieldsValue()})
      }
    })
  }
  const modalOpts = {
    onOk: submitForm,
    ...modalProps,
  }
  return (
    <Modal
      {...modalOpts}
    >
      <FormItem
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        label="用户名"
      >
        {getFieldDecorator('username', {
          initialValue: editUser.username,
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
        })(
          <Input placeholder="请输入" maxLength="50" />,
        )}

      </FormItem>
      <FormItem
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        label="密  码"
      >
        {getFieldDecorator('password', {
          rules: [
            {
              required: !editUser.uid,
              message: '请输入密码',
            },
            {
              min: 6,
              message: '密码最少6位',
            },
          ],
        })(
          <Input type="text" maxLength="20" placeholder="请输入" />,
        )}
      </FormItem>
      <FormItem
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        label="手机号"
      >
        {getFieldDecorator('mobile', {
          initialValue: editUser.mobile,
          rules: [
            {
              required: true,
              message: '请输入手机号码',
            },
            {
              pattern: /^(13|15|17|18|19)([0-9]{9})$/,
              message: '请输入正确手机号码',
            },
          ],
        })(
          <Input placeholder="请输入" maxLength="11" />,
        )}
      </FormItem>
    </Modal>
  )
}
userModal.propTypes = {
  form: PropTypes.object.isRequired,
  confirmLoading: PropTypes.bool,
  editUser: PropTypes.object,
  onOk: PropTypes.func,
}
export default Form.create()(userModal)
