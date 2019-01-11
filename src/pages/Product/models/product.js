/**
 * 商品管理
 * @author Donny
 */
import { updateProduct,createProduct,listProducts,getProduct,removeProduct,setProductOnline,getSkuInfo } from '../../../services/product';

import _ from 'lodash';

export default {
    namespace: 'product',

    state: {
        //当前fetch回来的商品对象
        currentProduct:{
            id:0,
            skuList:[],
            propList:[],
            imgList:[],
            title:'',
            sellerPoint:'',
            listingPrice:'',
            originalBarcode:'',
            barcode:'',
            sortWeight:0,
            isOnline:1
        },
        skuList:[],
        propList:[],
        //商品列表对象
        products:{
            list:[],
            total:0,
            page:1,
            limit:10
        }
    },

    effects: {
        * getSku({payload,callback},{call,put}){
            const response = yield call(getSkuInfo,payload);
            if(response.status === 0 ){
               if(typeof callback === 'function'){
                   callback(response.data);
               }
            }
        },
        //上下架
        * online({payload},{call,select,put}){
            const response = yield call(setProductOnline,payload);
            if(response.status === 0){
                const products = yield select(({product})=>product.products);
                const newProducts = {...products};
                for(let i=0;i<newProducts.list.length;i++){
                    if(newProducts.list[i]['id'] === payload.id){
                        newProducts.list[i]['isOnline'] = payload.isOnline;
                        break;
                    }
                }
                yield put({
                    type:'setProducts',
                    payload:newProducts
                });
            }
        },
        * fetch({payload,callback},{call,put}){
            const response = yield call(getProduct,payload);
            console.log('response of getProduct',response);
            if (response.status === 0) {
                //提交成功
                yield put({
                    type:'setCurrentProduct',
                    payload:response.data
                });
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
        * update({payload,callback},{call}){
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
            newPayload.imgList = stringImgList;
            console.log('updateProduct payload',newPayload);
            const response = yield call(updateProduct,newPayload);
            console.log('response of updateProduct',response);
            if (typeof callback === 'function') {
                //提交成功
                callback(response);
            }
        },
        /**
         * 创建产品
         * @param {*} param0 
         * @param {*} param1 
         */
        * create({payload,callback},{call}){
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
            if (typeof callback === 'function') {
                //提交成功
                callback(response);
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
        },
        * remove({payload},{call,put}){
            const response = yield call(removeProduct,payload);
            if(response.status == 0 ){
                yield put({
                    type: 'list',
                    payload: {}
                });
            }
        }
    },
    reducers: {
        /**
         * 设置当前商品
         * @param {*} state 
         * @param {*} param1 
         */
        setCurrentProduct(state,{payload}){
            return {
                ...state,
                currentProduct:payload
            }
        },
        /**
         * 产品列表
         * @param {*} state 
         * @param {*} param1 
         */
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
                return sku.id === payload.id;
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
            let newSkuList = [...state.skuList];
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
                        if(s === compareKey.length){
                            isExist = true;
                            return false;
                        }
                    });
                    if(!isExist){
                        if(!sku['id']){
                            sku['id'] = 'new-'+Math.random();
                            //sku['skuSn'] = state.currentProduct.barcode;
                        }
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
