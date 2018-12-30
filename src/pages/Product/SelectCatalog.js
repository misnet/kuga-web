/**
 * 选类目
 */
import React, { PureComponent } from 'react';
import {
    Col,
    Form,
    Row,
    Select,
    Divider,
    Card,
    Button,
    Icon,
    Alert
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';
import styles from '../common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
const FormItem = Form.Item;
@connect(({itemCatalog,  loading}) => ({
    itemCatalog
    //loading: loading.effects['propKey/listProps'],
}))
@Form.create()
class SelectCatalog extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            catalogId:0,
            selectedId:[],
            propsetId:0,
            msg:'',
            namePath:[]
        }
        this.selectCatalog(0);
    }
    selectCatalog=(parentId,index=-1)=>{
        let sids = [...this.state.selectedId];
        this.props.dispatch({
            type:'itemCatalog/listCatalog',
            payload:{
                parentId
            },
            callback:(responseData)=>{
                if(index ==-1){
                    sids = [];
                    sids.length = 0;
                    sids.push({
                        id:parentId,
                        dataList:responseData
                    });
                }else if(sids.length>index+1){
                    sids = sids.slice(0,index+1);
                    if(responseData.length>0){
                        sids[index+1] ={
                            id:parentId,
                            dataList:responseData
                        };
                    }
                }else if(responseData.length>0){
                    sids.push({
                        id:parentId,
                        dataList:responseData
                    })
                }
                this.setState({
                    selectedId:sids
                });
                console.log('sids',sids);
            }
        });
    }
    onChangeCatalog = (selectValue,index)=>{
        const parentId           = selectValue.key;
        //类目名称的路径
        let namePath             = [...this.state.namePath];
        namePath = namePath.slice(0,index+1);
        namePath[index]          = selectValue.label;
        const currentCatalogList = this.state.selectedId[index];
        const selectedCatalog = _.find(currentCatalogList.dataList,item=>{
            return item.id==parentId;
        });
        let psid = 0,msg = '';
        if(selectedCatalog.isLeaf && selectedCatalog.propsetId>0){
            psid = selectedCatalog.propsetId;
        }
        if(!selectedCatalog.isLeaf){
            msg = selectedCatalog.name+ ' 还有下一级类目，请点击选择';
        }else if(psid ==0 ){
            msg = selectedCatalog.name+ ' 使用的属性集合未配置，无法继续下一步'
        }
        this.setState({
            catalogId:selectedCatalog.id,
            propsetId:psid,
            msg,
            namePath
        });
        this.selectCatalog(parentId,index);
    }
    onNext = ()=>{
        this.props.dispatch(
            routerRedux.replace('/product/edit/0/'+this.state.propsetId,{
                namePath:this.state.namePath,
                catalogId:this.state.catalogId
            })
        )
    }
    render() {
        return (
            <PageHeaderWrapper title={formatMessage({id:'product.catalog.select'})} >
                <Card bordered={false}>
                    <div className={styles.navToolbar}>
                        <Button  type="primary" disabled={this.state.propsetId==0} onClick={this.onNext}>
                        下一步 <Icon type="right" />
                        </Button>
                    </div>
                    <Divider/>
                    <Row>
                        {
                            this.state.selectedId.length>0 && this.state.selectedId.map((catalog,index)=>{
                                return catalog.dataList.length>0 && (
                                    <Col span={6} key={index}>
                                        <div style={{padding:"5px"}}>
                                        <Select placeholder="请选择类目" labelInValue={true} style={{width:"100%"}} size="large" onChange={(v)=>this.onChangeCatalog(v,index)}>
                                            {
                                                catalog.dataList.map(opt=>{
                                                    return (
                                                        <Select.Option key={opt.id} value={opt.id}>{opt.name}</Select.Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                        
                    </Row>
                    {this.state.msg?
                    <Row>
                        <Col span={24}>
                        <div style={{padding:"5px"}}><Alert message={"提示："+this.state.msg} type="warning"/></div>
                        </Col>
                    </Row>
                    :null}
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default SelectCatalog;