/**
 * 商品属性
 * @author Donny
 */
import { createProp,updateProp,listProps,removeProp } from '../../../../services/product';

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
            catalogId: '',
            isColor: 0,
            isSaleProp:0,
            isApplyCode:0,
            usedForSearch:0,
            formType:"0",
            sortWeight:0,

        },
        currentCatalog:null,
        selectedPropkeyId:0,
        propModalType: 'create',
        propModalVisible: false
    },

    effects: {
        //创建
        * create ({payload}, {call, put}) {
            const response = yield call(createProp, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hidePropModal',
                });

                //提交成功
                yield put({
                    type: 'listProps',
                    payload: {catalogId:0},
                });
            }
        },
        //更新
        * update({payload},{call,put}) {
            const response = yield call(updateProp, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hidePropModal',
                });

                //提交成功
                yield put({
                    type: 'listProps',
                    payload: {catalogId:0},
                });
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
