/**
 * 商品属性
 * @author Donny
 */
import { createProp,updateProp,listProps,removeProp, getProp } from '../../../services/product';
import _ from 'lodash';
export default {
    namespace: 'propKey',
    state: {
        data: {
            list: [],
            total: 0,
            page: 1,
            limit: 10,
        },
        editProp: {
            id:0,
            name: '',
            isColor: 0,
            formType:"0",
            summary:'',
            valueList:[]
        },
        currentCatalog:null,
        selectedPropkeyId:0,
        propModalType: 'create',
        propModalVisible: false
    },

    effects: {
        //创建
        * create ({payload,callback}, {call, put, select}) {
            const oldEditProp = yield select(({propKey})=>propKey.editProp);
            const newPayload = {
                ...payload,
                valueList:JSON.stringify(oldEditProp.valueList)
            };
            const response = yield call(createProp, newPayload);
            if (response.status == 0) {
                //提交成功
                // yield put({
                //     type: 'listProps',
                //     payload: {page:1},
                // });
                if(typeof callback =='function'){
                    callback(response);
                }
            }
        },
        //更新
        * update({payload,callback},{call,select}) {
            const oldEditProp = yield select(({propKey})=>propKey.editProp);
            const newPayload = {
                ...payload,
                valueList:JSON.stringify(oldEditProp.valueList)
            };
            const response = yield call(updateProp, newPayload);
            if (response.status == 0) {

                //提交成功
                // yield put({
                //     type: 'listProps',
                //     payload: {catalogId:0},
                // });
                if(typeof callback =='function'){
                    callback(response);
                }
            }
        },
        //查询列表
        * listProps({payload},{call,put,select}) {
            const response = yield call(listProps, payload);
            let data = {};
            if (typeof response['data'] != 'undefined') {
                data = response['data'];
            } else {
                data = [];
            }

            yield put({
                type: 'save',
                payload: data,
            });
        },
        //取得某个属性
        * getProp({payload},{call,put}){
            const response = yield call(getProp, payload);
            let data = {};
            if (response['status'] == 0) {
                data = response['data'];
            } else {
                data = [];
            }
            yield put({
                type: 'setEditProp',
                payload: {
                    propkey:data
                },
            });
        },

        *selectProp({ payload }, { put }) {
            yield put({
                type: 'setPropkeyId',
                payload,
            });
        },
        *removeProp({ payload }, { call,put }) {
            if (payload.id) {
                // 执行删除
                const response = yield call(removeProp, payload);
                if (response.status == 0) {

                    //提交成功
                    yield put({
                        type: 'listProps',
                        payload: {catalogId:0},
                    });
                }
            }
        },
    },
    reducers: {
        setEditProp(state,{payload}){
            return {
                ...state,
                editProp:payload.propkey
            }
        },
        fakeRemovePropValue(state,{payload}){
            let newEditProp       = {...state.editProp};
            _.remove(newEditProp.valueList,(n)=>{
                return n.id==payload.id
            });
            console.log('newEditPro',newEditProp);
            return {
                ...state,
                editProp:newEditProp
            };
        },
        /**
         * 加空记录
         * @param state
         * @param payload
         * @returns {{editProp: {}}}
         */
        addEmptyPropValue(state,{payload}){
            const newEditProp = {...state.editProp};
            newEditProp.valueList.unshift({
                propvalue:'',
                colorHexValue:'',
                code:'',
                id:payload.id
            });
            return {
                ...state,
                editProp:newEditProp
            };
        },
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        setPropkeyId(state, { payload }) {
            return {
                ...state,
                selectedPropkeyId: payload.id,
                editProp: payload.propkey
            };
        },
        // 隐藏弹出窗
        hidePropModal(state) {
            return {
                ...state,
                propModalVisible: false,
            };
        },
        showPropModal(state, { payload }) {
            return {
                ...state,
                propModalType: payload.modalType,
                propModalVisible: true,
                currentCatalog:payload.catalog,
                editProp: payload.propkey
            };
        },
    },
};
