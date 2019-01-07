/**
 * 添加或编辑商品
 */
import React, { PureComponent } from 'react';
import {
  Col,
  Form,
  Row,
  Select,
  Switch,
  Divider,
  Table,
  Card,
  Input,
  InputNumber,
  Checkbox,
  Spin,
  Icon,
  Modal,
  Upload,
  Button,
  Affix,
  Popconfirm,
  Breadcrumb,
  message,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { formatMessage } from 'umi/locale';
import DICT from '../../dict';
import styles from '../common.less';
import { getThumbUrl, ossUpload } from '../../utils/utils';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

import BraftEditorTable from 'braft-extensions/dist/table';
import 'braft-extensions/dist/table.css';
BraftEditor.use(BraftEditorTable());
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect(({ global, propSet, product, loading }) => ({
  global,
  propSet,
  product,
  loading: loading.effects['product/get'],
}))
@Form.create()
class EditProduct extends PureComponent {
  constructor(props) {
    super(props);
    const params = this.props.match.params;
    const productId = parseInt(params['id']);
    //console.log('history', history.state);
    const historyState =
      history.state && history.state.state != undefined
        ? history.state
        : {
            state: {
              namePath: [],
              catalogId: 0,
            },
          };
    //console.log('historyState', historyState);

    const {
      state: { namePath, catalogId },
    } = {
      ...historyState,
    };
    //const namePath = [],catalogId=0;
    if (!isNaN(productId) && productId > 0) {
      //编辑商品时
      this.props.dispatch({
        type: 'product/fetch',
        payload: {
          id: productId,
        },
        callback: responseData => {
          this.loadPropset(responseData['propsetId']);
          let imgList = [];
          if (responseData.imgList) {
            responseData.imgList.forEach(img => {
              imgList.push({
                url: img.imgUrl,
                thumbUrl: getThumbUrl({
                  imgurl: img.imgUrl,
                  width: 200,
                  height: 200,
                  m: 'fill',
                }),
                id: img.id,
                uid: img.id,
                name: img.imgUrl,
                status: 'done',
              });
            });
          }
          this.setState({
            namePath: responseData.catalogNamePath.split('/'),
            fileList: imgList,
          });
        },
      });
    } else if (params['propsetId'] && catalogId > 0) {
      this.loadPropset(params['propsetId']);
    } else {
      //跳到选择品类界面
      this.props.dispatch(routerRedux.replace('/product/select-catalog'));
    }
    this.state = {
      catalogId,
      saleProps: [],
      namePath: namePath ? namePath : [],
      previewVisible: false,
      previewImage: '',
      stsToken: null,
      fileList: [
        //     {
        // uid: '-1',
        // name: 'xxx.png',
        // status: 'done',
        // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }
      ],
      contentState: BraftEditor.createEditorState(null),
      mobileContentState: BraftEditor.createEditorState(null),
    };
    this.props.dispatch({
      type: 'global/fetchOssSetting',
    });
  }
  loadPropset = propsetId => {
    const {
      dispatch,
      product: { currentProduct },
    } = this.props;
    dispatch({
      type: 'propSet/getPropSet',
      payload: {
        id: propsetId,
        loadPropvalue: 1,
      },
      callback: responseData => {
        //将属性集合中的销售属性和一般属性分离出来，放到skuList和propList中
        if (responseData && responseData.propkeyList) {
          let { saleProps, commonProps } = this.filterProp(responseData.propkeyList);
          this.setState({
            saleProps,
          });
          let insertData = [];
          const productSkuList = currentProduct.skuList;
          productSkuList.forEach(sku => {
            const skuJson = JSON.parse(sku.skuJson);
            let item = { id: 'new-' + Math.random() };
            if (sku['id']) {
              item['id'] = sku['id'];
            }
            item['skuSn'] = sku['skuSn'];
            item['price'] = sku['price'];
            item['cost'] = sku['cost'];
            item['originalSkuId'] = sku['originalSkuId'];
            skuJson.forEach(prop => {
              saleProps.map(sp => {
                if (sp.propkeyId == prop.prop) {
                  sp.valueList.forEach(v => {
                    if (v.id == prop.value) {
                      item['propkey' + prop.prop] = v.propvalue;
                    }
                  });
                  item['prop' + prop.prop] = prop.value;
                  item['propkeyId' + prop.prop] = prop.prop;
                }
              });
            });
            insertData.push(item);
          });

          //设置属性默认值
          if (commonProps && currentProduct && currentProduct.propList) {
            commonProps.forEach(p => {
              const existIndex = _.findIndex(
                currentProduct.propList,
                f => f.propkeyId == p.propkeyId
              );
              if (existIndex !== -1) {
                p.propvalue = currentProduct.propList[existIndex].propvalue;

                if (p.formType === DICT.FORM_TYPE.CHECKBOX) {
                  p.propvalue = p.propvalue.split(',');
                  //console.log('p',JSON.stringify(p));
                  p.propvalue = _.map(p.propvalue, e => parseInt(e));
                  //console.log('p',JSON.stringify(p));
                }
              }
            });
          }
          this.props.dispatch({
            type: 'product/updateState',
            payload: {
              skuList: insertData,
              propList: commonProps,
            },
          });
        }
      },
    });
  };

  handleEditorChange = (fieldName, editorState) => {
    this.setState({
      [`${fieldName}State`]: editorState,
    });
  };
  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    //const htmlContent = await fetchEditorContent()
    const htmlContent = '';
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    this.setState({
      contentState: BraftEditor.createEditorState(htmlContent),
      mobileContentState: BraftEditor.createEditorState(htmlContent),
    });
  }
  /**
   * 分离出销售属性和一般属性
   */
  filterProp = propkeyList => {
    let saleProps = [];
    let commonProps = [];
    propkeyList.length &&
      propkeyList.map(propkey => {
        if (propkey.isSaleProp > 0) {
          saleProps.push(propkey);
        } else {
          commonProps.push(propkey);
        }
      });
    return {
      saleProps,
      commonProps,
    };
  };
  /**
   * 生成输入控件
   */
  getInput = (prefix = 'prop', cprop, rules = {}, form, emptyOption = {}) => {
    switch (cprop.formType) {
      case DICT.FORM_TYPE.CHECKBOX:
        const options = [];
        cprop.valueList.map(opt => {
          options.push({
            label: opt.propvalue,
            value: opt.id,
          });
        });
        return form.getFieldDecorator(prefix + cprop.propkeyId, rules)(
          <CheckboxGroup options={options} />
        );
      case DICT.FORM_TYPE.TEXTAREA:
        return form.getFieldDecorator(prefix + cprop.propkeyId, rules)(
          <Input.TextArea rows={4} placeholder={formatMessage({id:'form.standard.placeholder'})} maxLength={200} />
        );
      case DICT.FORM_TYPE.TEXT:
        return form.getFieldDecorator(prefix + cprop.propkeyId, rules)(
          <Input placeholder={formatMessage({id:'form.standard.placeholder'})} maxLength={200} />
        );
      case DICT.FORM_TYPE.RADIO:
        return form.getFieldDecorator(prefix + cprop.propkeyId, rules)(
          <Select style={{ width: '100%' }} placeholder={formatMessage({id:'form.select.item'}) + cprop.propkeyName}>
            {[
              emptyOption.title ? (
                <Select.Option key={emptyOption.id}>{emptyOption.title}</Select.Option>
              ) : null,
              cprop.valueList.map(opt => {
                let t = [];
                t.push(
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.propvalue}
                  </Select.Option>
                );
                return t;
              }),
            ]}
          </Select>
        );
      default:
    }
  };
  /**
   * 生成属性的表单控件列
   */
  createFormItem = cprop => {
    return (
      <Col xs={{span:24}} sm={{span:12}} key={cprop.id}>
        <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label={cprop.propkeyName}>
          {this.getInput(
            'prop',
            cprop,
            {
              initialValue: cprop.propvalue,
              rules: [
                {
                  required: cprop.isRequired > 0,
                  message: '请输入' + cprop.propkeyName,
                },
              ],
            },
            this.props.form
          )}
        </FormItem>
      </Col>
    );
  };
  /**
   * 保存商品
   */
  onSave = () => {
    this.props.form.validateFields((error, values) => {
      let postData = {},
        propData = [];
      console.log('values', values);

      if (!error) {
        _.mapKeys(values, (v, k) => {
          if (!/prop(\d+):(\d+)/.test(k) && v != undefined) {
            var matches = k.match(/^prop(\d+)$/);
            if (matches) {
              propData.push({ propkeyId: matches[1], propvalue: v });
            } else {
              postData[k] = v;
            }
          }
        });
        postData['catalogId'] = this.state.catalogId;
        postData['content'] = this.state.contentState.toHTML();
        postData['mobileContent'] = this.state.mobileContentState.toHTML();
        postData['id'] = this.props.product.currentProduct.id;

        const actionType = postData['id'] > 0 ? 'update' : 'create';
        this.props.dispatch({
          type: `product/${actionType}`,
          payload: {
            ...postData,
            imgList: this.state.fileList,
            propList: propData,
            skuList: this.props.product.skuList,
          },
          callback:(response)=>{
             message.success(formatMessage({id:'product.save.success'}));
             this.props.dispatch(
                 routerRedux.goBack()
             )
          }
        });
      }
    });
  };
  onBack = () => {
    this.props.dispatch(routerRedux.push('/product/list'));
  };
  /**
   * 添加SKU规格
   * S码：11，L码：22，红色：33，白色：44，黑色：55
   *
   * [
   *
   * {propkey1:'S码',propkey2:'红色',price:'',cost:''},
   * {propkey1:'S码',propkey2:'白色',price:'',cost:''},
   * {propkey1:'S码',propkey2:'黑色',price:'',cost:''},
   * {propkey1:'L码',propkey2:'红色',price:'',cost:''}
   * {propkey1:'L码',propkey2:'白色',price:'',cost:''},
   * {propkey1:'L码',propkey2:'黑色',price:'',cost:''}
   *
   *
   * {propvalue11:'S码',propvalue33:'红色',price:'',cost:''},
   * {propvalue11:'S码',propvalue44:'白色',price:'',cost:''},
   * {propvalue11:'S码',propvalue55:'黑色',price:'',cost:''},
   * {propvalue22:'L码',propvalue33:'红色',price:'',cost:''}
   * {propvalue22:'L码',propvalue44:'白色',price:'',cost:''},
   * {propvalue22:'L码',propvalue55:'黑色',price:'',cost:''}
   * ]
   */

  onAppendPropKey = () => {
    const {
      form,
      product: { skuList, propList },
    } = this.props;
    //const {saleProps} = this.filterProp(currentSet.propkeyList);
    let salePropDefined = [];
    this.state.saleProps.map(prop => {
      const selectedPropValue = this.props.form.getFieldValue('saleProp' + prop.propkeyId);
      if (selectedPropValue == undefined || selectedPropValue == 0) {
        salePropDefined.push(prop);
      } else {
        let propvalueList = [];
        prop.valueList.map(propvalue => {
          if (propvalue.id == selectedPropValue) {
            propvalueList.push(propvalue);
          }
        });
        salePropDefined.push({
          ...prop,
          valueList: propvalueList,
        });
      }
    });
    //console.log('salePropDefined',salePropDefined);
    const insertData = this.createSaleProp(salePropDefined);
    console.log('insertData', insertData);
    this.props.dispatch({
      type: 'product/appendSku',
      payload: {
        skuList: insertData,
      },
    });
  };
  createSaleProp = sd => {
    if (sd.length == 0) return [[]];
    let [current, ...rest] = sd;
    let combinations = this.createSaleProp(rest);
    return current.valueList.reduce(
      (a, v) => [
        ...a,
        ...combinations.map(c => {
          let s = {};
          s['propCode' + current.id] = v.code;
          s['propSortWeight' + current.id] = current.sortWeight;
          s['propkey' + current.id] = v.propvalue;
          s['prop' + current.id] = v.id;
          s['propkeyId' + current.id] = current.id;
          s['price'] = '';
          s['cost'] = '';
          s['originalSkuId'] = '';
          return { ...s, ...c };
        }),
      ],
      []
    );
  };
  createSkuFieldName = (record, field) => {
    let name = [];
    var propkeyIds = [];
    _.forEach(record, (value, key) => {
      var matches = key.match(/^propkey(\d+)$/);
      //name.push('prop'+)
      if (matches) {
        propkeyIds.push(matches[1]);
      }
    });
    propkeyIds.forEach(id => {
      name.push('prop' + record['propkeyId' + id] + ':' + record['prop' + id]);
    });
    return field + '-' + name.join('_');
  };

  handleCancel = () => this.setState({ previewVisible: false });
  handleChange = e => {
    if (e.file && e.file.status && (e.file.status == 'uploading' || e.file.status == 'done')) {
      let fileList = [...e.fileList];
      return this.setState({
        fileList: e.fileList,
      });
    }
  };
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  beforeUpload = file => {
    const isJPG =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type == 'image/gif';
    if (!isJPG) {
      message.error(formatMessage({id:'form.upload.only.image'}));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(formatMessage({id:'form.upload.max.2m'}));
    }
    return isJPG && isLt2M;
  };
  /**
   *
   */
  onRemoveSku = id => {
    this.props.dispatch({
      type: 'product/removeSku',
      payload: {
        id,
      },
    });
  };
  /**
   * 删除上传的图片
   */
  onRemoveFile = file => {
    let newFileList = [...this.state.fileList];
    _.remove(newFileList, item => item.uid == file.uid);
    this.setState({
      fileList: newFileList,
    });
    return true;
  };
  /**
   * 上传文件处理
   */
  onUploadFile = file => {
    console.log('file', file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const {
        global: { ossSetting },
      } = this.props;
      ossUpload({
        ossSetting,
        targetPath: 'product/',
        file,
        onSuccess: data => {
          let newFileList = [...this.state.fileList];
          data['uid'] = file.uid;
          data['id'] = 0;
          data['name'] = file.name;
          data['status'] = 'done';
          data['type'] = file.type;
          const fileInfo = {
            uid: file.uid,
            name: file.name,
            status: 'done',
            type: file.type,
            url: data.url,
            thumbUrl: getThumbUrl({
              imgurl: data.url,
              width: 200,
              height: 200,
              m: 'fill',
            }),
          };
          const existIndex = _.findIndex(newFileList, item => item.uid == fileInfo.uid);
          if (existIndex == -1) {
            newFileList.push(fileInfo);
          } else {
            newFileList[existIndex] = fileInfo;
          }
          this.setState({
            fileList: newFileList,
          });
        },
        onFailure: error => {
          console.log(error);
        },
        onProgress: async (p, response) => {
          let newFileList = [...this.state.fileList];
          const existIndex = _.findIndex(newFileList, item => item.uid == response.file.uid);
          if (existIndex > -1) {
            newFileList[existIndex]['percent'] = parseInt(p * 10000) / 100;
            newFileList[existIndex]['status'] = p == 1 ? 'done' : 'uploading';
            newFileList[existIndex]['response'] = '{"status": "success"}';
          }
          this.setState({
            fileList: newFileList,
          });
        },
      });
    };
  };
  /**
   * 改变SKU中的值
   */
  changeValue = (record, field, value) => {
    this.props.dispatch({
      type: 'product/updateSku',
      payload: {
        id: record.id,
        field,
        value,
      },
    });
  };
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const {
      form: { getFieldDecorator },
      product: { currentProduct, skuList, propList }
    } = this.props;
    //console.log('skuList', skuList, propList);
    const editProduct = currentProduct;
    //对载入的属性集的属性做处理
    const skuTableHeader = () => {
      return this.state.saleProps.length > 0 ? (
        <Row>
          {this.state.saleProps.map(prop => {
            return (
              <Col span={5} key={'sp' + prop.id}>
                <div style={{ paddingRight: '5px' }}>
                  {this.getInput('saleProp', prop, {}, this.props.form, { id: 0, title: '全部' })}
                </div>
              </Col>
            );
          })}
          <Col span={8}>
            <Button type="primary" onClick={this.onAppendPropKey}>
              添加属性
            </Button>
          </Col>
        </Row>
      ) : (
        <Spin />
      );
    };

    let columns = [];
    this.state.saleProps.map(prop => {
      columns.push({
        title: prop.propkeyName,
        dataIndex: 'propkey' + prop.propkeyId,
        propkeyId: prop.propkeyId,
        key: 'propkey' + prop.propkeyId,
      });
    });
    const newColumns = [...columns];
    columns = columns.concat([
      {
        title: formatMessage({id:'product.info.skucode'}),
        dateIndex: 'skuSn',
        key:'skuSn',
        render: (text, record) => {
          let sn = [];
          newColumns.forEach(col => {
            sn.push(record['propCode' + col.propkeyId]);
          });
          return record['skuSn'] ? record['skuSn'] : currentProduct.barcode + sn.join('');
        },
      },
      {
        title: formatMessage({id:'product.info.price'}),
        dataIndex: 'price',
        key:'price',
        render: (text, record) => {
          return (
            <FormItem>
              {getFieldDecorator(this.createSkuFieldName(record, 'price'), {
                initialValue: record['price'],
                rules: [
                  {
                    required: true,
                    message: formatMessage({id:'product.placeholder.price'}),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '150px' }}
                  min={0}
                  precision={2}
                  placeholder={formatMessage({id:'product.placeholder.price'})}
                  maxLength={12}
                  onChange={v => this.changeValue(record, 'price', v)}
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: formatMessage({id:'product.info.cost'}),
        dataIndex: 'cost',
        key:'cost',
        render: (text, record) => {
          return (
            <FormItem>
              {getFieldDecorator(this.createSkuFieldName(record, 'cost'), {
                initialValue: record['cost'],
                rules: [
                  {
                    required: false,
                    message: formatMessage({id:'product.placeholder.cost'}),
                  },
                ],
              })(
                <InputNumber
                  style={{ width: '150px' }}
                  min={0}
                  precision={2}
                  placeholder={formatMessage({id:'product.placeholder.cost'})}
                  maxLength={12}
                  onChange={v => this.changeValue(record, 'cost', v)}
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: formatMessage({id:'product.info.original.skucode'}),
        dataIndex: 'originalSkuId',
        key:'originalSkuId',
        render: (text, record) => {
          return (
            <FormItem>
              {getFieldDecorator(this.createSkuFieldName(record, 'originalSkuId'), {
                initialValue: record['originalSkuId'],
                rules: [
                  {
                    required: false,
                    message: formatMessage({id:'product.placeholder.originalsku'}),
                  },
                ],
              })(
                <Input
                placeholder={formatMessage({id:'product.placeholder.originalsku'})}
                  maxLength={100}
                  onChange={e => this.changeValue(record, 'originalSkuId', e.target.value)}
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: formatMessage({id:'form.action'}),
        dataIndex: 'action',
        key:'action',
        render: (text, record) => {
          return (
            <Popconfirm title={formatMessage({id:'product.sku.confirm.remove'})} onConfirm={() => this.onRemoveSku(record.id)}>
              <a>{formatMessage({id:'form.remove'})}</a>
            </Popconfirm>
          );
        },
      },
    ]);
    return (
      <PageHeaderWrapper
        title={
          currentProduct.id > 0
            ? formatMessage({ id: 'product.update' })
            : formatMessage({ id: 'product.add' })
        }
      >
        <Card bordered={false}>
          <Affix offsetTop={64} className={styles.navToolbarAffix}>
            <div className={styles.navToolbar}>
              <Button icon="arrow-left" type="default" onClick={this.onBack}>
                {formatMessage({id:'form.return'})}
              </Button>
              <Button icon="save" type="primary" onClick={this.onSave}>
              {formatMessage({id:'form.save'})}
              </Button>
              <Divider />
            </div>
          </Affix>

          {/*编辑区start*/}
          <div>
            <Card title={formatMessage({id:'product.basicinfo'})} type={'inner'}>
              <Row>
                <Col span={24}>
                  <FormItem labelCol={{sm:{ span: 4 },xs:{span:6}}} wrapperCol={{sm:{ span: 20 },xs:{ span: 18 }}} label={formatMessage({id:'product.info.itemcatalog'})}>
                    <Breadcrumb style={{ lineHeight: '40px', height: '40px' }}>
                      {this.state.namePath.map((name, i) => (
                        <Breadcrumb.Item key={i}>{name}</Breadcrumb.Item>
                      ))}
                    </Breadcrumb>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem labelCol={{sm:{ span: 4 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 20 },xs:{ span: 24 }}} label={formatMessage({id:'product.info.title'})}>
                    {getFieldDecorator('title', {
                      initialValue: editProduct.title,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({id:'product.placeholder.title'}),
                        },
                      ],
                    })(<Input placeholder={formatMessage({id:'form.standard.placeholder'})} maxLength={200} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label={formatMessage({id:'product.info.barcode'})}>
                    {getFieldDecorator('barcode', {
                      initialValue: editProduct.barcode,
                      rules: [
                        {
                          required: true,
                          message: '请输入商品款号，长度不超30位',
                        },
                        {
                          pattern: /^[0-9a-zA-Z]+$/,
                          message: '编码只能由数字和字母组成',
                        },
                      ],
                    })(<Input placeholder={formatMessage({id:'form.standard.placeholder'})} maxLength={30} />)}
                  </FormItem>
                </Col>
                <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}} label="厂家编码">
                    {getFieldDecorator('originBarcode', {
                      initialValue: editProduct.originBarcode,
                      rules: [
                        {
                          required: false,
                          message: '请输入厂家编码',
                        },
                      ],
                    })(<Input placeholder={formatMessage({id:'form.standard.placeholder'})} maxLength={200} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
              <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="零售价">
                    {getFieldDecorator('listingPrice', {
                      initialValue: editProduct.listingPrice,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({id:'product.placeholder.price'}),
                        },
                      ],
                    })(<Input placeholder={formatMessage({id:'product.placeholder.price'})} maxLength={5} />)}
                  </FormItem>
                </Col>
                <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="重量单位">
                    <Select style={{ width: '100%' }} placeholder={'选择重量单位'}>
                      <Select.Option value={'0'}>克</Select.Option>
                      <Select.Option value={'1'}>件</Select.Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
              <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="排序权重">
                    {getFieldDecorator('sortWeight', {
                      initialValue: editProduct.sortWeight,
                      rules: [
                        {
                          required: true,
                          message: '请输入排序权重',
                        },
                      ],
                    })(<InputNumber placeholder="请输入" maxLength={10} />)}
                  </FormItem>
                </Col>
                <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="是否上架">
                    {getFieldDecorator('isOnline', {
                      initialValue: editProduct.isOnline > 0,
                      valuePropName: 'checked',
                    })(<Switch />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
              <Col  xs={{span:24}} sm={{span:12}}>
                  <FormItem labelCol={{sm:{ span: 8 },xs:{ span: 24 }}} wrapperCol={{sm:{ span: 16 },xs:{ span: 24 }}}  label="商品卖点">
                    {getFieldDecorator('sellerPoint', {
                      initialValue: editProduct.sellerPoint,
                      rules: [
                        {
                          required: false,
                          message: '请输入商品卖点',
                        },
                      ],
                    })(<Input.TextArea rows={4} placeholder="请输入" maxLength={200} />)}
                  </FormItem>
                </Col>
                <Col  xs={{span:24}} sm={{span:12}}/>
              </Row>
            </Card>
            <Card title={'商品效果图'} type={'inner'} style={{ margin: '10px 0px' }}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                action={file => this.onUploadFile(file)}
                onChange={this.handleChange}
                onPreview={this.handlePreview}
                onRemove={this.onRemoveFile}
                beforeUpload={this.beforeUpload}
              >
                {fileList.length >= 3 ? null : (
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Card>
            <Card title={'商品属性与SKU'} type={'inner'} style={{ margin: '10px 0px' }}>
              <Row>
                <Col span={24}>
                  <Divider orientation="left">SKU信息</Divider>
                </Col>
              </Row>
              <Row>
                <Table
                  rowKey={record => record.id}
                  dataSource={skuList}
                  columns={columns}
                  pagination={false}
                  title={skuTableHeader}
                />
              </Row>
              <Row>
                <Col span={24}>
                  <Divider orientation="left">扩展属性</Divider>
                </Col>
              </Row>
              <Row>{propList.map(cprop => this.createFormItem(cprop))}</Row>
            </Card>
            <Card title={'商品描述内容'} type={'inner'}>
              <Row>
                <Col span={24}>
                  <Divider orientation="left">PC版内容区</Divider>
                </Col>
                <Col span={24}>
                  <div className={styles.editorContainer}>
                    <BraftEditor
                      value={this.state.contentState}
                      onChange={c => this.handleEditorChange('content', c)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Divider orientation="left">手机版内容区</Divider>
                </Col>
                <Col span={24}>
                  <div className={styles.editorContainer}>
                    <BraftEditor
                      value={this.state.mobileContentState}
                      onChange={c => this.handleEditorChange('mobileContent', c)}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
          {/*编辑区end*/}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default EditProduct;
