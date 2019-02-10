/**
 * API接口列表
 * @author Donny
 *
 */
export default {
    COMMON:{
        OSSETTING:'common.osssetting',
        REGION_LIST:'common.region.list',
        SEND_VERIFY_CODE:'common.smscode.send'
    },
    FRONTEND:{
        //前台用户注册
        USER_REGISTER:'user.register',
    },
    BACKEND: {
        // 用户登陆
        USER_LOGIN: 'console.user.login',
        // 用户查询
        USER_LIST: 'console.user.list',
        // 用户创建
        USER_CREATE: 'console.user.create',
        // 用户更新
        USER_UPDATE: 'console.user.update',
        // 用户删除
        USER_DELETE: 'console.user.delete',
        // 用户自行更新资料
        USER_UPDATE_PROFILE: 'console.profile.update',
        // 用户改密码
        USER_CHANGE_PASSWD: 'console.user.changepwd',

        // 查询菜单
        MENU_LIST: 'console.menu.list',
        // 菜单更新
        MENU_UPDATE: 'console.menu.update',
        // 菜单创建
        MENU_CREATE: 'console.menu.create',
        // 菜单删除
        MENU_DELETE: 'console.menu.delete',

        // 角色列表
        ROLE_LIST: 'console.role.list',
        ROLE_UPDATE: 'console.role.update',
        ROLE_CREATE: 'console.role.create',
        ROLE_DELETE: 'console.role.delete',
        // 列出指定角色分配好用户
        ROLE_LISTUSER: 'console.role.listuser',
        // 给角色分配用户
        ROLE_ASSIGNUSER: 'console.role.assignuser',
        // 取消某些用户的指定角色
        ROLE_UNASSIGNUSER:'console.role.unassignuser',
        // 给角色分配菜单
        ROLE_ASSIGNMENU:'console.role.assignmenu',
        // 权限资源组
        RESOURCE_GROUP:'console.role.resourcegroup',
        // 权限操作集
        RESOURCE_OPS:'console.role.listops',
        // 类目列表
        PRODUCT_ITEM_CATALOG_LIST:'product.catalog.list',
        // 新建类目
        PRODUCT_ITEM_CATALOG_CREATE:'product.catalog.create',
        // 修改类目
        PRODUCT_ITEM_CATALOG_UPDATE:'product.catalog.update',
        // 删除类目
        PRODUCT_ITEM_CATALOG_REMOVE:'product.catalog.remove',
        // 属性列表
        PRODUCT_PROPKEY_LIST:'product.propkey.list',
        // 新建属性
        PRODUCT_PROPKEY_CREATE:'product.propkey.create',
        // 取得属性
        PRODUCT_PROPKEY_GET:'product.propkey.get',
        // 修改属性
        PRODUCT_PROPKEY_UPDATE:'product.propkey.update',
        // 删除属性
        PRODUCT_PROPKEY_REMOVE:'product.propkey.remove',
        // 属性集列表
        PRODUCT_PROPSET_LIST:'product.propset.list',
        // 新建属性集
        PRODUCT_PROPSET_CREATE:'product.propset.create',
        // 修改属性集
        PRODUCT_PROPSET_UPDATE:'product.propset.update',
        // 删除属性集
        PRODUCT_PROPSET_REMOVE:'product.propset.remove',
        // 取属性集
        PRODUCT_PROPSET_GET:'product.propset.get',
        // 创建产品
        PRODUCT_CREATE:'product.basic.create',
        // 修改产品
        PRODUCT_UPDATE:'product.basic.update',
        // 产品列表
        PRODUCT_LIST: 'product.basic.list',
        // 取得产品
        PRODUCT_GET: 'product.basic.get',
        // 删除产品
        PRODUCT_REMOVE:'product.basic.remove',
        // 产品上下架
        PRODUCT_ONLINE:'product.basic.online',
        // 产品统计
        PRODUCT_STATS_OVERVIEW:'product.stats.overview',

        // 创建店仓
        STORE_CREATE:'store.basic.create',
        // 修改店仓
        STORE_UPDATE:'store.basic.update',
        // 店仓列表
        STORE_LIST: 'store.basic.list',
        // 删除店仓
        STORE_REMOVE:'store.basic.remove',
        // 取得某个店仓
        STORE_GET:'store.basic.get',
        // 新建出入库单
        INVENTORY_SHEET_CREATE:'inventory.sheet.create',
        // 修改出入库单
        INVENTORY_SHEET_UPDATE:'inventory.sheet.update',
        // 出入库单据列表
        INVENTORY_SHEET_LIST:'inventory.sheet.list',
        // 取得出入库单
        INVENTORY_SHEET_GET:'inventory.sheet.get',
        // 审核单据
        INVENTORY_SHEET_CHECKED:'inventory.sheet.checked',
        // 删除单据
        INVENTORY_SHEET_REMOVE:'inventory.sheet.remove',
        // 库存明细
        INVENTORY_ITEMS:'inventory.items',
        // 取得SKU信息
        PRODUCT_SKU_GET:'product.sku.get'
    },
};
