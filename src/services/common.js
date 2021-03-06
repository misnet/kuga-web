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
/**
 * 地区列表
 * @param {} params 
 */
export async function regionList(params) {
    return request(APILIST.COMMON.REGION_LIST, {
        method: 'POST',
        body: params,
    });
}
/**
 * 发验证码短信或邮件
 * @param {*} params 
 */
export async function sendVerifyCode(params){
    return request(APILIST.COMMON.SEND_VERIFY_CODE,{
        method:'POST',
        body:params
    })
}
