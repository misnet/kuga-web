/**
 * 商品管理
 * @author Donny
 */
import { createProduct,listProducts } from '../../../services/product';

import _ from 'lodash';

export default {
    namespace: 'product',

    state: {
        skuList:[],
        propList:[],
        products:{
            list:[],
            total:0,
            page:1,
            limit:10
        }
    },

    effects: {
        /**
         * 创建产品
         * @param {*} param0 
         * @param {*} param1 
         */
        * create({payload},{call}){
            let  stringSkuList = '',stringPropList = '',stringImgList = '';
            try{
                stringImgList = JSON.stringify(payload.imgList);
                stringSkuList = JSON.stringify(payload.skuList);
                stringPropList= JSON.stringify(payload.propList);
                console.log('stringSkuList',stringSkuList);
            }catch(e){

            }
            let newPayload = {...payload};
            newPayload.skuList  = stringSkuList;
            newPayload.propList = stringPropList;
            console.log('newPayload',newPayload);
            const response = yield call(createProduct,newPayload);
            console.log('response of createProduct',response);
            if (response.status == 0) {
                //提交成功
                
            }
        },
        * list({payload},{call,put}){
            const response = yield call(listProducts,payload);
            if(response.status == 0 ){
                yield put({
                    type:'setProducts',
                    payload:response.data
                });
            }
        }
    },
    reducers: {
        setProducts(state,{payload}){
            return {
                ...state,
                products:payload
            }
        },
        updateState(state,{payload}){
            return {
                ...state,
                ...payload
            }
        },
        /**
         * 更新SKU列表中的某项值
         * @param {*} state 
         * @param {*} {payload:{id,field,value}}
         */
        updateSku(state,{payload}){
            const index = _.findIndex(state.skuList,(sku)=>{
                return sku.id == payload.id;
            });
            let newSkuList =[...state.skuList];
            if(index>-1 && newSkuList[index][payload.field]!=undefined){
                //_.update(newSkuList,`[${index}].${payload.field}`,(n=>payload.value))
                newSkuList[index][payload.field] = payload.value;
            }
            return {
                ...state,
                skuList:newSkuList
            };
        },
        /**
         * 删除指定行的SKU
         * @param {*} state 
         * @param {*} param1 
         */
        removeSku(state,{payload}){
            let newSkuList = [...state.skuList]
            _.remove(newSkuList,(item)=>{
                return item.id==payload.id;
            })
            return {
                ...state,
                skuList:newSkuList
            }
        },
        /**
         * 追加SKU列表
         * @param state
         * @param payload
         * @returns {{skuList: (Array|...Array|...Array|*[]|*[])}}
         */
        appendSku(state,{payload}){
            let compareKey = [];
            let newSkuList = [...state.skuList];
            if(state.skuList.length>0){
                _.find(payload.skuList,sku=>{
                    //先算出要对比的KEY
                    if(compareKey.length==0){
                        _.forEach(sku,(value,key)=>{
                            if(/^propkey(\d+)$/.test(key)) {
                                compareKey.push(key);
                            }
                        })
                    }
                    let isExist = false;
                    _.map(state.skuList,(item)=> {
                        let s = compareKey.reduce((result, k) => {

                            if (sku[k] == item[k]) {
                                return result += 1;
                            } else {
                                return result += 0;
                            }
                        }, 0);
                        if(s==2){
                            isExist = true;
                            return false;
                        }
                    });
                    if(!isExist){
                        if(!sku['id']){
                            sku['id'] = 'new-'+Math.random();
                        }
                        console.log('insert',sku);
                        newSkuList.push(sku);
                    }
                    // newSkuList = compareKey.reduce((result,k)=>{
                    //     return _.sortBy(newSkuList,(item)=>item[k]);
                    // },[])
                    //newSkuList = _.sortBy(newSkuList,(item)=>item[compareKey[0]]);

                });
            }else{
                newSkuList = payload.skuList;
                newSkuList.forEach(v=>{
                    v['id'] = 'new-'+Math.random();
                });
                //取得要排序的key
                if(newSkuList.length>0 && compareKey.length==0){
                    _.forEach(newSkuList[0],(value,key)=>{
                        if(/^propkey(\d+)$/.test(key)) {
                            compareKey.push(key);
                        }
                    })
                }
            }
            //重新排序一下
            newSkuList = _.orderBy(newSkuList,compareKey);
            //console.log('newSkuList',newSkuList);
            return {
                ...state,
                skuList:newSkuList
            }
        }
    },
};
