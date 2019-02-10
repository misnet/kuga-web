export default [
    {
        path:"/user",
        component:"../layouts/UserLayout",
        routes:[
            {path:'/user',redirect:'/user/login'},
            {path:'/user/login',component: './User/Login'},
            {path:'/user/register',component: './User/Register'}
        ]
    },
    {
        path:"/",
        component:"../layouts/BasicLayout",
        Routes: ['src/pages/Authorized'],
        routes:[
            {path:"/", redirect: "/dashboard/workplace"},
            {
                path:"/account/profile",component:"./User/Profile"
            },
            {path:"/dashboard/workplace",component:"./Dashboard/Workplace"},
            {path:"/sys/userlist",component:"./Sys/UserList"},
            {path:"/sys/menulist",component:"./Sys/MenuList"},
            {path:"/sys/product-catalog",component:'./Product/ItemCatalog'},
            {path:"/sys/props/edit-propkey",component:'./Product/EditPropKey'},
            {path:"/sys/props/edit-propkey/:id",component:'./Product/EditPropKey'},
            {path:"/sys/props",component:'./Product/PropKeyList'},
            {path:"/sys/propsets",component:'./Product/PropSetList'},
            {path:"/sys/propsets/edit",component:'./Product/EditPropSet'},
            {path:"/sys/propsets/edit/:id",component:'./Product/EditPropSet'},
            {
                path:"/sys/rolelist",
                routes:[
                    {
                        path:'/sys/rolelist/index',component:"./Sys/Acc/RoleList"
                    },
                    {
                        path:'/sys/rolelist/assign-role-users/:rid',component:'./Sys/Acc/AssignUserToRole'
                    },
                    {
                        path:'/sys/rolelist/assign-role-menu/:rid', component:'./Sys/Acc/AssignMenuToRole'
                    },
                    {
                        path:'/sys/rolelist/role-res/:rid', component:'./Sys/Acc/ResourcesList'
                    },
                    {
                        path:'/sys/rolelist/assign-role-res/:rid/:rcode/:rname',component:'./Sys/Acc/AssignResToRole'
                    }
                ]
            },
            {
                path:"/product/edit", component: "./Product/EditProduct"
            },
            {
                path:"/product/edit/:id/:propsetId", component: "./Product/EditProduct"
            },
            {
                path:"/product/edit/:id", component: "./Product/EditProduct"
            },
            {
                path:"/product/select-catalog", component: "./Product/SelectCatalog"
            },
            {
                path:"/product/list", component: "./Product/ListProducts"
            },

            {
                path:"/store/list",component:"./Store/ListStore"
            },

            {
                path:"/store/inandout",component:"./Store/InputOutputInventory"
            },

            {
                path:"/store/inandout/:id",component:"./Store/InputOutputInventory"
            },

            {
                path:"/store/inventory",component:"./Store/Inventory"
            },

            {
                path:"/store/edit",component:"./Store/EditStore"
            },

            {
                path:"/store/edit/:id",component:"./Store/EditStore"
            },
            {
                path:"/store/inventory-sheets",component:"./Store/InventorySheets"
            }
        ]
    }
];