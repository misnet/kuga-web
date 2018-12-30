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
} from 'antd'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../common.less'
import NetImage from '../../components/Image';
import {getThumbUrl} from '../../utils/utils';

@connect(({product, loading}) => ({
  product,
  loading: loading.effects['product/list'],
}))
@Form.create()
class ListProducts extends PureComponent {
  componentDidMount () {
    const {dispatch} = this.props
    dispatch({
      type: 'product/list',
      payload: {
        limit: 10,
        page: 1,
      },
    })
  }
  

  render () {
    const {loading, product: {products}} = this.props
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal (total) {
        return `共 ${total} 条记录`
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: products.limit,
      current: products.page,
      total: products.total,
    }

    // 表列定义
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '封面图示',
        dataIndex:'firstImgUrl',
        render:(text,record)=>(<NetImage isCascade={true}  src={record.firstImgUrl} width={50} height={50}/>)
      },{
        title: '商品名称',
        dataIndex: 'title',
        key: 'title',
        render:(text,record)=>(
          <div>
            <div>类目：{record.catalogNamePath}</div>
            <div>名称：{record.title}</div>
          </div>
        )
      }, {
        title: '款号',
        dataIndex: 'barcode',
        key: 'barcode',
      }, {
        title: '价格',
        dataIndex: 'listingPrice',
        key: 'listingPrice',
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <span>
          </span>
        ),
      }]

    
    return (
      <PageHeaderWrapper title="商品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>

            <div className={styles.navToolbar}>
              <Button icon="plus" type="primary" >
                新建
              </Button>
            </div>
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