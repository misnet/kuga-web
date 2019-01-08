/**
 * 系统管理--用户列表界面
 * @author Donny
 *
 */
import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  Table,
  Card,
  Form,
  Popconfirm,
  Button,
  Divider,
  Affix
} from 'antd'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../common.less'
import { formatMessage } from 'umi/locale';
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')

@connect(({user, loading}) => ({
  user,
  loading: loading.effects['user/userList'],
  updateLoading: loading.effects['user/update'],
  createLoading :loading.effects['user/create'],
}))
@Form.create()
class UserListPage extends PureComponent {
  componentDidMount () {
    const {dispatch} = this.props
    dispatch({
      type: 'user/userList',
      payload: {
        limit: 10,
        page: 1,
      },
    })
  }
  /**
   * 关闭弹窗
   */
  onCancelModal = () => {
    this.props.dispatch({
      type: 'user/hideModal',
    })
  }
  /**
   * 点新建时
   */
  onCreateUser = () => {
    this.props.dispatch({
      type: 'user/showModal',
      payload: {
        modalType: 'create',
        editUser:{},
      },
    });
  }
  /**
   * 点编辑用户时
   */
  onEditUser = (record) => {
    this.props.dispatch({
      type: 'user/showModal',
      payload: {
        modalType: 'update',
        editUser: record,
      },
    })
  }
  /**
   * 删除用户
   * @param record
   */
  onDeleteUser = (record) => {
    this.props.dispatch({
      type: 'user/deleteUser',
      payload: {
        uid: record.uid,
      },
    })
  }
  /**
   * 点提交新建/编辑用户表单的OK键
   * @param values
   */
  onSubmitUserForm = (values) => {
    const {user: {modalType}} = this.props
    this.props.dispatch({
      type: `user/${modalType}`,
      payload: values,
    })

  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props
    const {formValues} = this.state

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj}
      newObj[key] = getValue(filtersArg[key])
      return newObj
    }, {})

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`
    }

    dispatch({
      type: 'user/userList',
      payload: params,
    })
  }
  handleSearch = (e) => {
    e.preventDefault()

    const {dispatch, form} = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }

      this.setState({
        formValues: fieldsValue,
      })

      dispatch({
        type: 'user/userList',
        payload: fieldsValue,
      })
    })
  }

  render () {
    const {loading, updateLoading, createLoading, user: {data, modalVisible, modalType, editUser}} = this.props
    console.log('editUser',editUser);
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal (total) {
        return `共 ${total} 条记录`
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: data.limit,
      current: data.page,
      total: data.total,
    }

    // 表列定义
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'uid',
        key: 'uid',
      }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.onEditUser.bind(this, record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title='确定要删除这个用户?'
              placement="left"
              onConfirm={this.onDeleteUser.bind(this, record)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      }]

    const ModalProps = {
      title: modalType === 'create' ? '新建用户' : '编辑用户',
      visible: modalVisible,
      onOk: this.onSubmitUserForm,
      confirmLoading: modalType === 'create'?createLoading:updateLoading,
      onCancel:this.onCancelModal,
      editUser,
    };
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
        <Affix offsetTop={64} className={styles.navToolbarAffix}>
              <div className={styles.navToolbar}>
              <div className={styles.navToolbar}>
                <Button icon="plus" type="primary" onClick={this.onCreateUser}>
                  {formatMessage({id:'form.new'})}
                </Button>
              </div>
              <Divider />
              </div>
          </Affix>
          <div className={styles.tableList}>

            <Table
              rowKey={record => record.uid}

              loading={loading}
              dataSource={data.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={paginationProps}
            />
          </div>
        </Card>
        {modalVisible && <UserModal {...ModalProps} />}
      </PageHeaderWrapper>
    );
  }
}
export default  UserListPage;