export default [
    /*-------------------- 系统管理 --------------------*/

    // 系统管理>用户管理
    {
        path: "usermanage",
        name: "usermanage",
        meta: {
            keepAlive: true,
            isBack: false,
        },
        component: () => import('@/views/index/components/sys/usermanage.vue'),
    },
    // 系统管理>角色管理
    {
        path: "rolemanage",
        name: "rolemanage",
        meta: {
            keepAlive: true,
            isBack: false,
        },
        component: () => import('@/views/index/components/sys/rolemanage.vue'),
    },
    // 系统管理>角色管理>权限配置
    {
        path: "distPower",
        name: "distPower",
        meta: {
          father: 'rolemanage'
        },
        component: () => import('@/views/index/components/sys/distPower.vue'),
    },
    // 系统管理>角色管理>查看权限
    {
        path: "lookPower",
        name: "lookPower",
        meta: {
          father: 'rolemanage'
        },
        component: () => import('@/views/index/components/sys/lookPower.vue'),
    },
    // 系统管理>用户组管理
    {
        path: "userground",
        name: "userground",
        meta: {
            keepAlive: true,
            isBack: false,
        },
        component: () => import('@/views/index/components/sys/userground.vue'),
    },
    // 系统管理>权限组管理
    {
        path: "jurismanage",
        name: "jurismanage",
        meta: {
            keepAlive: true,
            isBack: false,
        },
        component: () => import('@/views/index/components/sys/jurismanage.vue'),
    },
    // 系统管理>单位管理
    {
        path: "unitmanage",
        name: "unitmanage",
        meta: {
            keepAlive: true,
            isBack: false,
        },
        component: () => import('@/views/index/components/sys/unitmanage.vue'),
    },
]