/**
 * 出库和入库单操作
 * @author Donny
 */
import moment from 'moment';
import {createSheet,updateSheet} from '../../../services/inventory';
export default {
    namespace: 'inventorySheet',
    state: {
        stores: {},
        currentSheet: {
            id:0,
            sheetType: 1,
            sheetTime: moment(),
            sheetDesc:'',
            storeId:0,
            sheetCode:''
        }
    },

    effects: {
        * create({payload,callback},{call,put,select}){
            const response  = yield call(createSheet,payload);
            if(response.status === 0 ){
                const currentSheet = yield select(({inventorySheet})=>inventorySheet.currentSheet);
                yield put({
                    type:'setCurrentSheet',
                    payload:{
                        ...currentSheet,
                        id:response.data
                    }
                });
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
        * update({payload,callback},{call,put,select}){
            const response  = yield call(updateSheet,payload);
            if(response.status === 0 ){
                const currentSheet = yield select(({inventorySheet})=>inventorySheet.currentSheet);
                yield put({
                    type:'setCurrentSheet',
                    payload:{
                        ...currentSheet,
                        id:response.data
                    }
                });
                if(typeof callback === 'function'){
                    
                    callback(response.data);
                }
            }
        }
    },
    reducers: {
        setCurrentSheet(state,{payload}){
            return {
                ...state,
                currentSheet:payload
            }
        }
    },
};
