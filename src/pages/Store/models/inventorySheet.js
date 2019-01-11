/**
 * 出库和入库单操作
 * @author Donny
 */
import moment from 'moment';
import {createSheet,updateSheet,listSheets,getSheet,removeSheet,checkedSheet,getItemList} from '../../../services/inventory';
import _ from 'lodash';
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
            sheetCode:'',
            storeName:'',
            isChecked:0
        },
        sheets:[],
        stockItems:{}
    },

    effects: {
        //库存明细
        * getItemList({payload,callback},{call,put,select}){
            const response  = yield call(getItemList,payload);
            if(response.status === 0 ){
                yield put({
                    type:'setStockItems',
                    payload:response.data
                });
            }
        },
        * checkedSheet({payload,callback},{call,put,select}){
            const response  = yield call(checkedSheet,payload);
            if(response.status === 0 ){
                const sheets = yield select(({inventorySheet})=>inventorySheet.sheets);
                const index  = _.findIndex(sheets.list,sheet=>{
                    return sheet.id == payload.id;
                });
                if(index > -1){
                    sheets.list[index]['isChecked'] = 1;
                }
                console.log('sheets',sheets,index);
                yield put({
                    type:'setSheets',
                    payload:sheets
                })
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
        * removeSheet({payload,callback},{call,put,select}){
            const response  = yield call(removeSheet,payload);
            if(response.status === 0 ){
                yield put({
                    type:'listSheets',
                    payload:{}
                });
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
        * getSheet({payload,callback},{call,put,select}){
            const response  = yield call(getSheet,payload);
            if(response.status === 0 ){
                let sheet = response.data;
                sheet.sheetTime = moment(sheet.sheetTime * 1000);
                yield put({
                    type:'setCurrentSheet',
                    payload:sheet
                });
                if(typeof callback === 'function'){
                    callback(response.data);
                }
            }
        },
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
                //const currentSheet = yield select(({inventorySheet})=>inventorySheet.currentSheet);
                // yield put({
                //     type:'setCurrentSheet',
                //     payload:currentSheet
                // });
                if(typeof callback === 'function'){
                    
                    callback(response.data);
                }
            }
        },
        * listSheets({payload,callback},{call,put}){
            const response = yield call(listSheets,payload);
            if(response.status === 0){
                yield put({
                    type:'setSheets',
                    payload:response.data
                })
            }
        }
    },
    reducers: {
        setStockItems(state,{payload}){
            return {
                ...state,
                stockItems:payload
            }
        },
        setSheets(state,{payload}){
            return {
                ...state,
                sheets:payload
            }
        },
        setCurrentSheet(state,{payload}){
            return {
                ...state,
                currentSheet:payload
            }
        }
    },
};
