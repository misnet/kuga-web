import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '工作台',
        path: 'workplace',
        icon: 'dashboard',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
    {
      name:'商品管理',
      icon:'appstore',
      path:'product',
        children:[
            {
              name:'创建商品',
               path:'edit',
               icon:'plus'
            },
            {
              name:'商品列表',
               path:'list',
               icon:'appstore'
            }
        ]
    },
    {
      name:'店仓管理',
      icon:'appstore',
      path:'store',
      children:[
        {
          name:'店仓列表',
          path:'list',
          icon:'appstore'
        },
        {
          name:'出入库',
          path:'inandout',
          icon:'appstore'
        },
        {
          name:'库存查询',
          path:'inventory',
          icon:'appstore'
        },
        {
          hideInMenu: true,
          name:'出入库列表',
          path:'inventory-sheets',
          icon:'appstore'
        }
      ]
    },
  {
    name: '系统管理',
    icon: 'setting',
    path: 'sys',
    children: [
      {
        name: '用户管理',
        icon: 'user',
        path: 'userlist',
      },
      {
        name: '菜单管理',
        icon: 'menu-fold',
        path: 'menulist',
      },
      {
        name: '角色管理',
        icon: 'solution',
        path: 'rolelist/index'
      },
      {
        name: '角色管理',
        path: 'rolelist',
        hideInMenu: true,
        authority: 'common',
        hideChildrenInMenu:true,
        children:[
          {
            name: '给角色分配菜单权限',
            path: 'assign-role-menu/:rid',
            icon: 'list',
          },
          {
            name: '给角色分配用户',
            path: 'assign-role-users/:rid',
            icon: 'list',
            hideInMenu: true,

          },
          {
            name: '资源权限',
            path: 'role-res/:rid',
            icon: 'list',
            hideInMenu: true,

          },
          {
            name: '给角色分配资源权限',
            path: 'assign-role-res/:rid/:rcode/:rname',
            icon: 'list',
            hideInMenu: true,

          },
        ]
      },
      {
        name:'类目属性',
        icon:'folder',
        path:'product-catalog'
      },
        {
            name:'属性管理',
            icon:'bars',
            path:'props'
        },
        {
            name:'属性集管理',
            icon:'appstore',
            path:'propsets'
        }

    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }

    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

/**
 * 结合服务端返回的菜单数据，判断所有菜单，过滤掉不在服务端返回的菜单
 * @param serverMenuData
 * @param menuData
 * @returns {Array}
 */
function filterMenu(serverMenuData,menuData){
  let newData = [];
  if(!serverMenuData){
    return newData;
  }
  menuData.map(item=>{
    if(item.children){
      let children = filterMenu(serverMenuData,item.children)
      if(Array.isArray(children) && children.length>0){
        newData.push(Object.assign({},item,{children}));
      }
    }else if(serverMenuData.some(smenu=>smenu.url==item.path)){
      newData.push(Object.assign({},item));
    }else if(item.authority === 'common'){
      newData.push(item);
    }
  });
  return newData;
}
export const getMenuData = (serverMenuData=[]) => {
  //console.log('menus after filter',filterMenu(serverMenuData, formatter(menuData)))
  return filterMenu(serverMenuData, formatter(menuData))
};
