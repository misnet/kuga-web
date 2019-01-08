/**
 * 店仓定义
 * @author Donny
 */
import { createStore,listStores,updateStore,removeStore,getStore } from '../../../services/store';
import {regionArrayToObject,regionObjectToArray} from '../../../utils/utils';

export default {
    namespace: 'store',
    state: {
        stores: {},
        currentStore: {
            id:0,
            name: '',
            countryId: 0,
            provinceId:0,
            countyId:0,
            townId:0,
            cityId:0,
            address:'',
            isRetail:0,
            disabled:0,
            summary:''
        }
    },

    effects: {
        * getStore({payload,callback},{call,put}){
            const response = yield call(getStore, payload);
            if (response.status === 0) {
                const data = response.data;
                data['region'] = regionObjectToArray(data);
                yield put({
                    type:'setCurrentStore',
                    payload:data
                });
                if(typeof callback === 'function'){
                    callback(data);
                }
            }
        },
        //创建
        * createStore ({payload,callback}, {call, put}) {
            let newPayload = {...payload};
            const regionObj= regionArrayToObject(newPayload.region);
            delete(newPayload.region);
            newPayload = {
                ...newPayload,
                ...regionObj
            }
            const response = yield call(createStore, newPayload);
            if (response.status === 0) {
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
        //更新
        * updateStore({payload,callback},{call,put}) {
            let newPayload = {...payload};
            const regionObj= regionArrayToObject(newPayload.region);
            delete(newPayload.region);
            newPayload = {
                ...newPayload,
                ...regionObj
            }
            const response = yield call(updateStore, newPayload);
            if (response.status === 0) {
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
            
        },
        //查询列表
        * listStores({payload,callback},{call,put,select}) {
            const response = yield call(listStores, payload);
            let data = {};
            if (typeof response['data'] !== 'undefined') {
                data = response['data'];
            } else {
                data = {};
            }
            yield put({
                type: 'save',
                payload: data,
            });
            if(typeof callback ==='function'){
                callback(data);
            }
        },
        *removeStore({ payload }, { call,put }) {
            if (payload.id) {
                // 执行删除
                const response = yield call(removeStore, payload);
                if (response.status === 0) {
                    yield put({
                        type:'listStores'
                    })
                }
            }
        },
    },
    reducers: {
        newStore(state,{payload}){
            return {
                ...state,
                currentStore: {
                    id:0,
                    name: '',
                    countryId: 0,
                    provinceId:0,
                    countyId:0,
                    townId:0,
                    cityId:0,
                    address:'',
                    isRetail:0,
                    disabled:0,
                    summary:''
                }
            }
        },
        setCurrentStore(state,{payload}){
            return {
                ...state,
                currentStore:payload
            }
        },
        save(state, action) {
            return {
                ...state,
                stores: action.payload,
            };
        },
    },
};
