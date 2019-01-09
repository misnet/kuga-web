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