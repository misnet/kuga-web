/**
 * 商品相关请求处理API
 * @author Donny
 *
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 创建类目
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createItemCatalog(params) {
    return request(APILIST.BACKEND.PRODUCT_ITEM_CATALOG_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 改类目
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateItemCatalog(params){
    return request(APILIST.BACKEND.PRODUCT_ITEM_CATALOG_UPDATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 类目列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function listItemCatalog(params) {
    return request(APILIST.BACKEND.PRODUCT_ITEM_CATALOG_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除类目
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeItemCatalog(params) {
    return request(APILIST.BACKEND.PRODUCT_ITEM_CATALOG_REMOVE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 创建属性
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createProp(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPKEY_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 改属性
 * @param params
 * @returns {Promise<Object>}
 */
export async function updateProp(params){
    return request(APILIST.BACKEND.PRODUCT_PROPKEY_UPDATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 属性列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function listProps(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPKEY_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除属性
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeProp(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPKEY_REMOVE, {
        method: 'POST',
        body: params,
    });
}
/**
 * 取得属性
 * @param params
 * @returns {Promise<Object>}
 */
export async function getProp(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPKEY_GET, {
        method: 'POST',
        body: params,
    });
}


/**
 * 创建属性集
 * @param params
 * @returns {Promise.<Object>}
 */
export async function createPropSet(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPSET_CREATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 改属性集
 * @param params
 * @returns {Promise<Object>}
 */
export async function updatePropSet(params){
    return request(APILIST.BACKEND.PRODUCT_PROPSET_UPDATE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 属性集列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function listPropSet(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPSET_LIST, {
        method: 'POST',
        body: params,
    });
}

/**
 * 删除属性集
 * @param params
 * @returns {Promise<Object>}
 */
export async function removePropSet(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPSET_REMOVE, {
        method: 'POST',
        body: params,
    });
}

/**
 * 取得属性集
 * @param params
 * @returns {Promise<Object>}
 */
export async function getPropSet(params) {
    return request(APILIST.BACKEND.PRODUCT_PROPSET_GET, {
        method: 'POST',
        body: params,
    });
}