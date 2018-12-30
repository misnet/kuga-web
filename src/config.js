/**
 * 配置相关
 *
 */
export default {
  /**
   * 取得API配置
   * @returns {object}
   */
  getOption() {
    const defaultOption = {
      gateway: 'http://api.kuga.wang/v3/gateway',
      appKey: 1003,
      appSecret: '6SujlYUFS5l2lWthwzZPCkr8HWf8mQ5LJboxHCT7Ts7W4JbSlwMMawHvfod8WFmAokuaA34RNhPF31hhdqvxw2SQ'
    };
    let newOption = {...defaultOption};
    if (process.env.API_GATEWAY) {
      newOption.gateway = process.env.API_GATEWAY;
    }
    if (process.env.API_KEY) {
      newOption.appKey = process.env.API_KEY;
    }
    if (process.env.API_SECRET) {
      newOption.appSecret = process.env.API_SECRET;
    }
    return newOption;
  },
  SYS_NAME:'PMIT Platform',
  IMG_HOST:'http://localhost:8000'
};
