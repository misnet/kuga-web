/**
 * 店仓的编辑
 */
import React, { PureComponent } from 'react';
import {
  Divider,
  Form,
  Button,
  Table,
  Select,
  Spin,
  Card,
  Input,
  Affix,
  Row,
  DatePicker,
  Icon,
  Col,
  Radio,
  message,
  Modal,
  notification,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';
const FormItem = Form.Item;

@connect(({ product,inventorySheet, store }) => ({
  product,
  inventorySheet,
  store,
}))
@Form.create()
class InputOutInventory extends PureComponent {
  constructor(props) {
    super(props);
    const params = this.props.match.params;
    this.state = {
      storeData: [],
      value: [],
      skuList:[],
      fetchingStore: false,
    };
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
    this.setState({
      value,
      storeData: [],
      fetchingStore: false,
    });
  };
  onSave = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('values', values);
        let itemList = [];
        this.state.skuList.map(sku=>{
          itemList.push({
            skuId:sku.id,
            qty:sku.qty
          });
        })
        const id = this.props.inventorySheet.currentSheet.id;
        let postData = {
          id:id,
          sheetCode:values.sheetCode,
          sheetType:values.sheetType,
          sheetDesc:values.sheetDesc,
          storeId:values.store.key,
          sheetTime:values.sheetTime.format('YYYY-MM-DD HH:mm:ss'),
          itemList:itemList
        };
        
        const actionType = id >0?'update':'create';
        this.props.dispatch({
          type: `inventorySheet/${actionType}`,
          payload: postData,
          callback:()=>{
            message.success(id>0?'单据修改成功':'创建单据成功');
          }
        });
      }
    });
  };
  /**
   * 查询SKU以添加
   */
  onSearchSku=(value)=>{
    let list = _.cloneDeep(this.state.skuList);
    const index = _.findIndex(list,item=>{
      return item.skuSn == value;
    });
    if(index===-1){
      this.props.dispatch({
        type:'product/getSku',
        payload:{
          sn:value
        },
        callback:(skuInfo)=>{
           this.addToSkuList(skuInfo);
        }
      });
    }else{
      this.onSkuQtyChange(list[index].id,1);
    }
    
  }
  /**
   * 追加到SKU列表中
   */
  addToSkuList=(skuInfo)=>{
    let list = _.cloneDeep(this.state.skuList);
    if(!skuInfo||typeof skuInfo.id === 'undefined'){
      //message.warn('SKU不存在');
      notification.warn({
       message: '提示',
       description: 'SKU不存在',
      });
      return;
    }
    const index = _.findIndex(list,item=>{
      return parseInt(item.id,10) === parseInt(skuInfo.id,10);
    })
    if(index === -1)
      list.push({
        ...skuInfo,
        qty:1
      });
    else{
      list[index]['qty']++;
    }
    this.setState({
      skuList:list
    });
  }
  /**
   * 更改SKU数量
   * qty为undefined时表示移除
   */
  onSkuQtyChange=(id,qty)=>{
    let list = _.cloneDeep(this.state.skuList);
    const index = _.findIndex(list,item=>{
      return parseInt(item.id,10) === parseInt(id,10);
    });
    
    if(index>-1){
      if(qty==undefined||list[index]['qty'] + qty <=0){
        this.onRemoveSku(this,index);
      }else{
        list[index]['qty']+=qty;
        this.setState({
          skuList:list
        })
      }
    }
  }
  /**
   * 删除指定行的SKU
   */
  onRemoveSku=($this,index)=>{
    Modal.confirm({
      title:'是否要删除这个SKU?',
      content:'本操作只是删除这条出入库明细，数据还没有保存，如要保存，请点击右上角的保存按钮！',
      onOk(){
        let list = _.cloneDeep($this.state.skuList);
        delete(list[index]);
        list.length--;
        $this.setState({
          skuList:list?list:[]
        })
      }
    })
  }
  render() {
    const {
      inventorySheet: { currentSheet },
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuSn',
        key: 'skuSn',
      },
      {
        title: 'SKU名称',
        dataIndex: 'skuString',
        key: 'skuString',
      },
      {
        title: '数量',
        dataIndex: 'qty',
        key: 'qty',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render:(text,record)=>(
          <Button.Group>
            <Button type="primary" onClick={()=>this.onSkuQtyChange(record.id,1)}><Icon type="plus" />增加</Button>
            <Button onClick={()=>this.onSkuQtyChange(record.id,-1)}><Icon type="minus" />减少</Button>
            <Button onClick={()=>this.onSkuQtyChange(record.id)} type="danger"><Icon type="close" />删除</Button>
          </Button.Group>
        )
      },
    ];
    return (
      <PageHeaderWrapper title={'出入库'}>
        <Card bordered={false}>
          <Affix offsetTop={64} className={styles.navToolbarAffix}>
            <div className={styles.navToolbar}>
              <Button icon="save" type="primary" onClick={this.onSave}>
                {formatMessage({ id: 'form.save' })}
              </Button>
              <Divider />
            </div>
          </Affix>
          <div className={styles.tableList}>
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="单号"
                >
                  {getFieldDecorator('sheetCode', {
                    initialValue: currentSheet.sheetCode,
                    rules: [
                      {
                        required: true,
                        message: '单号',
                      },
                      {
                        pattern: /^[0-9a-zA-Z\-]+$/,
                        message: '单号只能由字母、数字、中划线组成',
                      },
                    ],
                  })(<Input placeholder="请输入正确单号" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="类型"
                >
                  {getFieldDecorator('sheetType', {
                    initialValue: currentSheet.sheetType,
                  })(
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value={1}>入库单</Radio.Button>
                      <Radio.Button value={2}>出库单</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="店仓"
                >
                  {getFieldDecorator('store', {
                    initialValue: this.state.value,
                    rules: [
                      {
                        required: true,
                        message: '请查询并选店仓',
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      labelInValue
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={this.state.fetchingStore ? <Spin size="small" /> : null}
                      onSearch={this.onSearchStore}
                      style={{ width: '100%' }}
                      onChange={this.onChangeStore}
                      placeholder={'请输入店仓名称并选择'}
                    >
                      {this.state.storeData.map(d => (
                        <Select.Option key={d.value}>{d.text}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="时间"
                >
                  {getFieldDecorator('sheetTime', {
                    initialValue: currentSheet.sheetTime,
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="请选时间"
                    />
                  )}
                </FormItem>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="描述"
                >
                  {getFieldDecorator('sheetDesc', {
                    initialValue: currentSheet.sheetDesc,
                  })(<Input.TextArea rows={5} maxLength={250} />)}
                </FormItem>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <Input.Search
                  placeholder="请输入商品条码"
                  enterButton="添加"
                  size="large"
                  onSearch={value =>this.onSearchSku(value)}
                />
              </Col>
              <Col xs={{ span: 24 }}>
                <Table 
                  rowKey={record=>record.id}
                  columns={columns}
                   dataSource={Array.isArray(this.state.skuList)?this.state.skuList:[]} />
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default InputOutInventory;
