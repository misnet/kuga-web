/**
 * 系统相关API
 */

import request from '../utils/request';
import APILIST from '../apiList';

/**
 * 查询OSSSetting
 * @returns {Object}
 */
export async function queryOssSetting(params) {
    return request(APILIST.COMMON.OSSETTING, {
        method: 'POST',
        body: params,
    });
}
