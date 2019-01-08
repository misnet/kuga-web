/**
 * 系统管理--用户列表界面
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

@connect(({ product, loading }) => ({
  product,
  loading: loading.effects['product/list'],
}))
@Form.create()
class ListProducts extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/list',
      payload: {
        limit: 10,
        page: 1,
      },
    });
  }
  onNew=()=>{
    this.props.dispatch(
      routerRedux.push('/product/edit')
    )
  }
  onEdit=(record)=>{
    console.log('record',record);
    this.props.dispatch(
      routerRedux.push('/product/edit/'+record.id)
    );
  }
  onDelete=(record)=>{
    
    this.props.dispatch({
      type:'product/remove',
      payload:{
        id:record.id
      }
    });
  }
  onSetOnLine=(record,isOnline)=>{
    this.props.dispatch({
      type:'product/online',
      payload:{
        id:record.id,
        isOnline:isOnline?1:0
      }
    });
  }
  render() {
    const {
      loading,
      product: { products },
    } = this.props;
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal(total) {
        return `共 ${total} 条记录`;
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: products.limit,
      current: products.page,
      total: products.total,
    };

    // 表列定义
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '封面图示',
        dataIndex: 'firstImgUrl',
        render: (text, record) => (
          <NetImage isCascade={true} src={record.firstImgUrl} width={50} height={50} />
        ),
      },
      {
        title: '商品名称',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div>
            <div>类目：{record.catalogNamePath}</div>
            <div>名称：{record.title}</div>
          </div>
        ),
      },
      {
        title: '款号',
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: '价格',
        dataIndex: 'listingPrice',
        key: 'listingPrice',
      },
      {
        title: '状态',
        dataIndex: 'isOnline',
        key: 'isOnline',
        render:(text,record)=>record.isOnline===1?'上架中':'下架中'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (<Fragment>
          <a onClick={()=>this.onEdit(record)}>修改</a><Divider type="vertical"/>
          <Popconfirm
                            title="确定删除这个商品?"
                            onConfirm={() => this.onDelete(record)}
                        >
                        <a >删除</a>
                        </Popconfirm><Divider type="vertical"/>
                        <a onClick={()=>this.onSetOnLine(record,!record.isOnline)}>{record.isOnline?'下架':'上架'}</a>
          </Fragment>)
      },
    ];

    return (
      <PageHeaderWrapper title="商品列表">
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
              dataSource={products.list}
              columns={columns}
              pagination={paginationProps}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default ListProducts;
