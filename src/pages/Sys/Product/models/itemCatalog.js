/**
 * 商品类目与属性定义
 * @author Donny
 */
import { createItemCatalog,listItemCatalog,updateItemCatalog,removeItemCatalog } from '../../../../services/product';

export default {
    namespace: 'itemCatalog',

    state: {
        data: [],
        editCatalogData: {
            name: '',
            code: '',
            parentId: 0,
            id:0,
            sortWeight:0
        },
        catalogModalType: 'create',
        catalogModalVisible: false,
        selectedCatalogId: null,
    },

    effects: {
        //创建
        * create ({payload}, {call, put}) {
            const response = yield call(createItemCatalog, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hideCatalogModal',
                });

                //提交成功
                yield put({
                    type: 'listCatalog',
                    payload: {parentId:0,loadTree:true},
                });
            }
        },
        //更新
        * update({payload},{call,put}) {
            const response = yield call(updateItemCatalog, payload);
            if (response.status == 0) {
                yield put({
                    type: 'hideCatalogModal',
                });

                //提交成功
                yield put({
                    type: 'listCatalog',
                    payload: {parentId:0,loadTree:true},
                });
            }
        },
        //查询列表
        * listCatalog({payload,callback},{call,put,select}) {
            const response = yield call(listItemCatalog, payload);
            let data = {};
            if (typeof response['data'] != 'undefined') {
                data = response['data'];
            } else {
                data = [];
            }
            // const currentData = yield select(({ itemCatalog }) => itemCatalog.data);
            // if(currentData.length)
            // currentData.forEach(e=>{
            //     if(e.id==payload.parentId){
            //         e.children = data;
            //     }
            // });
            //console.log('currentData',currentData);

            yield put({
                type: 'save',
                payload: data,
            });
            if(typeof callback =='function'){
                callback(data);
            }
        },
        *selectCatalog({ payload }, { put }) {
            yield put({
                type: 'setCatalogId',
                payload,
            });
        },
        *removeCatalog({ payload }, { call,put }) {
            if (payload.id) {
                // 执行删除
                const response = yield call(removeItemCatalog, payload);
                if (response.status == 0) {

                    //提交成功
                    yield put({
                        type: 'listCatalog',
                        payload: {parentId:0,loadTree:true},
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
        setCatalogId(state, { payload }) {
            return {
                ...state,
                selectedCatalogId: payload.catalogId,
                editCatalogData: payload.catalog
            };
        },
        // 隐藏弹出窗
        hideCatalogModal(state) {
            return {
                ...state,
                catalogModalVisible: false,
            };
        },
        showCatalogModal(state, { payload }) {
            return {
                ...state,
                catalogModalType: payload.modalType,
                catalogModalVisible: true,
            };
        },
    },
};
