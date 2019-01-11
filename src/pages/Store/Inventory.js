/**
 * 库存明细
 * @author Donny
 *
 */
import React, { Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { Affix,Table, Card, Form, Button,Spin, Divider,Select,Input } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../common.less';
import NetImage from '../../components/Image';

@connect(({ inventorySheet, store,loading }) => ({
  inventorySheet,
  store,
  loading: loading.effects['inventorySheet/getItemList'],
}))
@Form.create()
class Inventory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      storeData: [],
      value: {
        key:'',
        label:''
      },
      fetchingStore: false,
    };
  }
  componentDidMount() {
    
    const { dispatch } = this.props;
    
    dispatch({
      type: 'inventorySheet/getItemList',
      payload: {
        limit: 10,
        page: 1,
      },
    });
  }
  onSearchStore = keyword => {
    this.setState({
      fetchingStore: true,
    });
    this.props.dispatch({
      type: 'store/listStores',
      payload: {
        keyword: keyword,
      },
      callback: storeList => {
        const data = storeList.list.map(store => ({
          text: store.name,
          value: store.id,
        }));
        this.setState({
          storeData: data,
          fetchingStore: false,
        });
      },
    });
  };
  onChangeStore = value => {
    console.log('value',value);
    this.setState({
      value,
      storeData: [],
      fetchingStore: false,
    });
  };
  /**
   * 按查询按钮
   */
  onSearch=(page=1,limit)=>{
    const values = this.props.form.getFieldsValue();
    let pageSize = this.refs['productTable'].props.pagination.pageSize;
    if(!limit){
      pageSize = limit;
    }
    const payload = {
      storeId:values.store?values.store.key:0,
      keyword:values.keyword
    }
    this.props.dispatch({
      type:'inventorySheet/getItemList',
      payload:{
        ...payload,
        page:page,
        limit:pageSize
      }
    })
  }
  onTableListChange=(pagination)=>{
      this.onSearch(1,pagination.pageSize);
  }
  render() {
    const {
      loading,
      inventorySheet: { stockItems },
      form:{getFieldDecorator}
    } = this.props;
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal(total) {
        return `共 ${total} 条记录`;
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: stockItems.limit,
      current: stockItems.page,
      total: stockItems.total
    };

    // 表列定义
    const columns = [
      {
        title: 'ID',
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
            <div>名称：{record.title}</div>
            <div>SKU：{record.skuString}</div>
          </div>
        ),
      },
      {
        title: '款号',
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: 'SKU编号',
        dataIndex: 'skuSn',
        key: 'skuSn',
      },
      {
        title: '店仓',
        dataIndex: 'storeName',
        key: 'storeName',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '库存',
        dataIndex: 'stockQty',
        key: 'stockQty',
      },
      {
        title: '在途入量',
        dataIndex: 'preinQty',
        key: 'preinQty',
      },
      {
        title: '在途出量',
        dataIndex: 'preoutQty',
        key: 'preoutQty',
      }
    ];

    return (
      <PageHeaderWrapper title="库存明细">
        <Card bordered={false}>

          <Affix offsetTop={64} className={styles.navToolbarAffix}>
            <div className={styles.navToolbar} style={{textAlign:'left'}}>
                <Form layout="inline">
                  <Form.Item >
                  {getFieldDecorator('store')(<Select
                      name="store"
                      style={{width:"200px"}}
                      showSearch
                      labelInValue
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={this.state.fetchingStore ? <Spin size="small" /> : null}
                      onSearch={this.onSearchStore}
                      onChange={this.onChangeStore}
                      placeholder={'请输入店仓名称并选择'}
                    >
                      {this.state.storeData.map(d => (
                        <Select.Option key={d.value}>{d.text}</Select.Option>
                      ))}
                    </Select>)}
                    </Form.Item>
                    <Form.Item>
                    {getFieldDecorator('keyword')(
                        <Input placeholder="商品名称关键词" name="keyword"/>
                      )}
                      
                    </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={()=>this.onSearch()}>查询</Button>
                  </Form.Item>
               </Form>
              <Divider />
            </div>
          </Affix>
          <div className={styles.tableList}>
            <Table
              ref='inventoryTable'
              onChange={this.onTableListChange}
              rowKey={record => record.id}
              loading={loading}
              dataSource={stockItems.list}
              columns={columns}
              pagination={paginationProps}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Inventory;
