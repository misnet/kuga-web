/**
 * 出入库单列表
 * @author Donny
 *
 */
import React, { Fragment,PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import { Affix,Table, Card, Form, Button, Divider,Popconfirm,Modal, message } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../common.less';
import config from '../../config';

@connect(({ inventorySheet, loading }) => ({
    inventorySheet,
    loading:loading.effects['inventorySheet/listSheets'],
}))
@Form.create()
class InventorySheets extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventorySheet/listSheets',
      payload: {
        limit: 10,
        page: 1,
      },
    });
  }
  onNew=()=>{
    this.props.dispatch(
      routerRedux.push('/store/inandout')
    )
  }
  onEdit=(record)=>{
    console.log('record',record);
    this.props.dispatch(
      routerRedux.push('/store/inandout/'+record.id)
    );
  }
  onDelete=(record)=>{
    this.props.dispatch({
      type:'inventorySheet/removeSheet',
      payload:{
        id:record.id
      }
    });
  }
  onChecked=(record)=>{
    Modal.confirm({
        title:'是否真的要审核?',
        content:'审核后，本条记录将不可修改或删除，单据中的明细将真实入库，请确认是否继续',
        onOk:()=>{
            this.props.dispatch({
                type:'inventorySheet/checkedSheet',
                payload:{
                    id:record.id
                },
                callback:()=>{
                    message.success('单据审核成功');
                }
            });
        }
      })
  }
  render() {
    const {
      loading,
      inventorySheet: { sheets },
    } = this.props;
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal(total) {
        return `共 ${total} 条记录`;
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: sheets.limit,
      current: sheets.page,
      total: sheets.total,
    };

    // 表列定义
    const columns = [
      {
        title: '单据ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '单据编号',
        dataIndex: 'sheetCode',
        key:'sheetCode'
      },
      {
        title: '类型',
        dataIndex: 'sheetType',
        key: 'sheetType',
        render:(text,record)=>record.sheetType===1?'入库单':'出库单'
      },
      {
        title: '总数',
        dataIndex: 'qty',
        key: 'qty'
      },
      {
        title: 'SKU数量',
        dataIndex: 'skuNum',
        key: 'skuNum'
      },
      {
        title: '出入库时间',
        dataIndex: 'sheetTime',
        key: 'sheetTime',
        render:(text,record)=>moment(record.sheetTime * 1000).format(config.DATE_FORMAT)
      },
      {
        title: '店仓名称',
        dataIndex: 'storeName',
        key:'storeName'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => record.isChecked>0?<a onClick={()=>this.onEdit(record)}>查看</a>:(<Fragment>
          <a onClick={()=>this.onEdit(record)}>修改</a><Divider type="vertical"/>
          <Popconfirm
                title="确定删除这条记录?"
                onConfirm={() => this.onDelete(record)}
            >
            <a >删除</a>
            </Popconfirm><Divider type="vertical"/>
            <a onClick={()=>this.onChecked(record)}>审核</a>
          </Fragment>)
      },
    ];

    return (
      <PageHeaderWrapper title="出入库列表">
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
              dataSource={sheets.list}
              columns={columns}
              pagination={paginationProps}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default InventorySheets;
