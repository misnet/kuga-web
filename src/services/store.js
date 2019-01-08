/**
 * 店仓相关请求处理API
 * @author Donny
 *
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 创建店仓
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createStore(params) {
    return request(APILIST.BACKEND.STORE_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 改店仓
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateStore(params){
    return request(APILIST.BACKEND.STORE_UPDATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除店仓
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeStore(params) {
    return request(APILIST.BACKEND.STORE_REMOVE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 店仓列表
 * @param params
 * @returns {Promise.<Object>}
 */
export async function listStores(params) {
    return request(APILIST.BACKEND.STORE_LIST, {
        method: 'POST',
        body: params,
    });
}

export async function getStore(params){
    return request(APILIST.BACKEND.STORE_GET, {
        method: 'POST',
        body: params,
    });
}
