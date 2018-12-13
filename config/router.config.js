export default [
    {
        path:"/user",
        component:"../layouts/UserLayout",
        routes:[
            {path:'/user',redirect:'/user/login'},
            {path:'/user/login',component: './User/Login'}
        ]
    },
    {
        path:"/",
        component:"../layouts/BasicLayout",
        routes:[
            {path:"/", redirect: "/dashboard/workplace"},
            {path:"/dashboard/workplace",component:"./Dashboard/Workplace"},
            {path:"/sys/userlist",component:"./Sys/UserList"},
            {path:"/sys/menulist",component:"./Sys/MenuList"},
            {path:"/sys/product-catalog",component:'./Sys/Product/Catalog'},
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
            }
        ]
    }
];