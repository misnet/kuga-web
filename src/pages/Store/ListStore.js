/**
 * 店仓列表
 * @author Donny
 *
 */
import React, { Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { Affix,Table, Card, Form, Button, Divider,Popconfirm } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../common.less';
import NetImage from '../../components/Image';

@connect(({ store, loading }) => ({
  store,
  loading: loading.effects['store/listStores'],
}))
@Form.create()
class StoreListPage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/listStores',
      payload: {
        limit: 10,
        page: 1,
      },
    });
  }
  onTableListChange=(pagination)=>{
    this.props.dispatch({
      type: 'store/listStores',
      payload: {
        limit: pagination.pageSize,
        page: pagination.current,
      },
    });
  }
  onNew=()=>{
    this.props.dispatch(
      routerRedux.push('/store/edit')
    )
  }
  onEdit=(record)=>{
    console.log('record',record);
    this.props.dispatch(
      routerRedux.push('/store/edit/'+record.id)
    );
  }
  onDelete=(record)=>{
    
    this.props.dispatch({
      type:'store/removeStore',
      payload:{
        id:record.id
      }
    });
  }
  render() {
    const {
      loading,
      store: { stores },
    } = this.props;
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal(total) {
        return `共 ${total} 条记录`;
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: stores.limit,
      current: stores.page,
      total: stores.total,
    };

    // 表列定义
    const columns = [
      {
        title: '店仓ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '店仓名称',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '是否零售',
        dataIndex: 'isRetail',
        key: 'isRetail',
        render:(text,record)=>record.isRetail>0?'是':'不是'
      },
      {
        title: '是否禁用',
        dataIndex: 'disabled',
        key: 'disabled',
        render:(text,record)=>record.disabled>0?'禁用':'启用'
      },
      {
        title: '所在地区',
        dataIndex: 'region',
        key: 'region',
        render:(text,record)=>record.countryName + record.provinceName + record.cityName
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (<Fragment>
          <a onClick={()=>this.onEdit(record)}>修改</a><Divider type="vertical"/>
          <Popconfirm
                            title="确定删除这个店仓?"
                            onConfirm={() => this.onDelete(record)}
                        >
                        <a >删除</a>
                        </Popconfirm>
          </Fragment>)
      },
    ];

    return (
      <PageHeaderWrapper title="店仓列表">
        <Card bordered={false}>

          <Affix offsetTop={64} className={styles.navToolbarAffix}>
            <div className={styles.navToolbar}>
              <Button icon="plus" type="primary" onClick={this.onNew}>
              {formatMessage({id:'form.new'})}
              </Button>
              <Divider />
            </div>
          </Affix>
          <div className={styles.tableList}>
            <Table
              rowKey={record => record.id}
              loading={loading}
              dataSource={stores.list}
              columns={columns}
              onChange={this.onTableListChange}
              pagination={paginationProps}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default StoreListPage;
