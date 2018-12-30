/**
 * 商品属性集合
 * @author Donny
 */
import {createPropSet, updatePropSet, listPropSet, removePropSet, getPropSet} from '../../../../services/product';
import _ from 'lodash';
import {notification} from 'antd';
export default {
    namespace: 'propSet',
    state: {
        data: [],
        selectedPropKey:{},
        currentSet:{
            name:'',
            id:0,
            propkeyList:[]
        },
    },

    effects: {
        //创建
        * create ({payload, callback}, {call, put,select}) {
            let pkList = null;
            try{
                pkList = JSON.stringify(payload.propkeyList);
            }catch(e){

            }
            let newPayload = {
                ...payload,
                propkeyList:pkList
            }
            const response = yield call(createPropSet, newPayload);
            if (response.status == 0) {
                //提交成功
                // yield put({
                //     type: 'listPropValues',
                //     payload: {propkeyId:pid},
                // });
                if(typeof callback==='function'){
                    callback(response);
                }
            }
        },
        //更新
        * update({payload, callback},{call,put,select}) {
            let pkList = null;
            try{
                pkList = JSON.stringify(payload.propkeyList);
            }catch(e){

            }
            console.log('payload.propkeyList',payload.propkeyList);
            let newPayload = {
                ...payload,
                propkeyList:pkList
            }
            const response = yield call(updatePropSet, newPayload);
            if (response.status == 0) {
                // yield put({
                //     type: 'hidePropModal',
                // });

                if(typeof callback==='function'){
                    callback(response);
                }
            }
        },
        //查询列表
        * listPropSets({payload},{call,put,select}) {
            const response = yield call(listPropSet, payload);
            let data = {};
            if (typeof response['data'] !== 'undefined') {
                data = response['data'];
            } else {
                data = [];
            }

            yield put({
                type: 'save',
                payload: data,
            });
        },

        *remove({ payload }, { call,put,select }) {
            if (payload.id) {
                // 执行删除
                const response = yield call(removePropSet, payload);
                if (response.status == 0) {

                    //提交成功
                    yield put({
                        type: 'listPropSets'
                    });
                }
            }
        },
        *getPropSet({payload,callback},{call,put}){
            const response = yield call(getPropSet, payload);
            let data = {};
            if (response['status'] == 0) {
                data = response['data'];
            } else {
                data = [];
            }
            yield put({
                type: 'setCurrentSet',
                payload: {
                    currentSet:data
                },
            });
            if(typeof callback === 'function'){
                callback(data);
            }
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        /**
         * 选中某个属性（要追加到属性集中）
         * @param state
         * @param payload
         * @returns {{selectedPropKey: (payload.propkey|{id, formType, sortWeight}|Array|{valueList}|{id, name}|null)}}
         */
        selectProp(state,{payload}){
            return{
                ...state,
                selectedPropKey:payload.propkey
            }
        },
        /**
         * 向现有的属性列表中追加记录
         * @param state
         * @param payload
         */
        appendPropKey(state,{payload}){
            const currentSet = {...state.currentSet};
            const existPropkey = _.find(currentSet.propkeyList,(i)=>{
                return i.prokeyId == payload.propkey.id;
            });
            if(existPropkey){
                notification.warn({
                    message: '温馨提示',
                    description: '属性 ' + payload.propkey.name + '已添加过了',
                });
            }else{
                currentSet.propkeyList.unshift({
                    propkeyName:payload.propkey.name,
                    propkeyId:payload.propkey.id,
                    id:payload.id,
                    usedForSearch:0,
                    isApplyCode:0,
                    isRequired:0,
                    isSaleProp:0,
                    disabled:0,
                });
                return {
                    ...state,
                    currentSet
                };
            }
        },
        /**
         * 改变当前的属性集
         * @param state
         * @param payload
         * @returns {{currentSet: (default.state.currentSet|{name, id, propkeyList}|{})}}
         */
        setCurrentSet(state,{payload}){
            return {
                ...state,
                currentSet:payload.currentSet
            }
        },
        /**
         * 从当前的属性集中移除属性
         * @param state
         * @param payload {propkeyId:xx}
         * @returns {{editProp: {}}}
         */
        fakeRemovePropKey(state,{payload}){
            let currentSet       = {...state.currentSet};
            _.remove(currentSet.propkeyList,(n)=>{
                console.log(n.propkeyId==payload.propkeyId);
                return n.propkeyId==payload.propkeyId
            });
            return {
                ...state,
                currentSet:currentSet
            };
        },

    },
};
