/**
 * 店仓相关请求处理API
 * @author Donny
 *
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 创建出入库单
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createSheet(params) {
    return request(APILIST.BACKEND.INVENTORY_SHEET_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 改出入库单
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateSheet(params){
    return request(APILIST.BACKEND.INVENTORY_SHEET_UPDATE, {
        method: 'POST',
        body: params,
    });
}
/**
 * 出入库单列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function listSheets(params){
    return request(APILIST.BACKEND.INVENTORY_SHEET_LIST, {
        method: 'POST',
        body: params,
    });
}
/**
 * 取得某个出入库单
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSheet(params){
    return request(APILIST.BACKEND.INVENTORY_SHEET_GET, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除某个出入库单
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeSheet(params){
    return request(APILIST.BACKEND.INVENTORY_SHEET_REMOVE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 审核某个出入库单
 * @param params
 * @returns {Promise<Object>}
 */
export async function checkedSheet(params){
    return request(APILIST.BACKEND.INVENTORY_SHEET_CHECKED, {
        method: 'POST',
        body: params,
    });
}
/**
 * 库存明细
 * @param params
 * @returns {Promise<Object>}
 */
export async function getItemList(params){
    return request(APILIST.BACKEND.INVENTORY_ITEMS, {
        method: 'POST',
        body: params,
    });
}
