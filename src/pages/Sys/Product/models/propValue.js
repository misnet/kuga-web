/**
 * 商品属性值
 * @author Donny
 */
import { createPropValue,updatePropValue,listPropValues,removePropValue } from '../../../../services/product';

export default {
    namespace: 'propValue',
    state: {
        data: [],
        editPropValue: {
            id:0,
            propkeyId: '',
            propvalue: '',
            summary: '',
            colorHexValue:'',
            sortWeight:0,
            code:''

        },
        selectedPropValueId:0,
        propModalType: 'create',
        propModalVisible: false
    },

    effects: {
        //创建
        * create ({payload}, {call, put,select}) {
            const pid = yield select(({propKey})=>propKey.selectedPropkeyId);
            const response = yield call(createPropValue, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hidePropModal',
                });

                //提交成功
                yield put({
                    type: 'listPropValues',
                    payload: {propkeyId:pid},
                });
            }
        },
        //更新
        * update({payload},{call,put,select}) {
            const pid = yield select(({propKey})=>propKey.selectedPropkeyId);
            const response = yield call(updatePropValue, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hidePropModal',
                });

                //提交成功
                yield put({
                    type: 'listPropValues',
                    payload: {propkeyId:pid},
                });
            }
        },
        //查询列表
        * listPropValues({payload},{call,put,select}) {
            const response = yield call(listPropValues, payload);
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
        *selectPropValue({ payload }, { put }) {
            yield put({
                type: 'setPropvalueId',
                payload,
            });
        },
        *remove({ payload }, { call,put,select }) {
            const pid = yield select(({propKey})=>propKey.selectedPropkeyId);
            if (payload.id) {
                // 执行删除
                const response = yield call(removePropValue, payload);
                if (response.status == 0) {

                    //提交成功
                    yield put({
                        type: 'listPropValues',
                        payload: {propkeyId:pid},
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
        setPropvalueId(state, { payload }) {
            return {
                ...state,
                selectedPropValueId: payload.id,
                editProp: payload.propvalue
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
                editPropValue:payload.propvalue
            };
        },
    },
};
