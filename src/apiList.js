/**
 * API接口列表
 * @author Donny
 *
 */
export default {
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
        // 修改属性
        PRODUCT_PROPKEY_UPDATE:'product.propkey.update',
        // 删除属性
        PRODUCT_PROPKEY_REMOVE:'product.propkey.remove',
        // 属性值列表
        PRODUCT_PROPVALUE_LIST:'product.propvalue.list',
        // 新建属性值
        PRODUCT_PROPVALUE_CREATE:'product.propvalue.create',
        // 修改属性值
        PRODUCT_PROPVALUE_UPDATE:'product.propvalue.update',
        // 删除属性值
        PRODUCT_PROPVALUE_REMOVE:'product.propvalue.remove'

    },
};