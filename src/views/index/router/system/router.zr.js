/*
 * @Author: zhou.run 
 * @Date: 2020-07-07 10:42:24 
 * @Last Modified by: zhou.run
 * @Last Modified time: 2020-10-12 10:41:39
 */

export default  [
// 用户管理
  {
    path: "/system/user",
    name: "systemUser",
    component: () => import('@/views/index/components/system/user.vue'),
  },
// 资源管理
  {
    path: "/system/resource",
    name: "systemResource",
    component: () => import('@/views/index/components/system/resource.vue'),
  },
// 角色管理
  {
    path: "/system/role",
    name: "systemRole",
    component: () => import('@/views/index/components/system/role.vue'),
  },
  {
    path: "/system/role/seerole", //查看角色权限
    name: "seerole",
    meta: {
      father: "systemRole",
    },
    component: () => import('@/views/index/components/system/seerole.vue'),
  },
  {
    path: "/system/role/groundrole", //角色配置权限
    name: "groundrole",
    meta: {
      father: "systemRole",
    },
    component: () => import('@/views/index/components/system/groundrole.vue'),
  },
// 接口管理
  {
    path: "/system/interface",
    name: "systemInterface",
    component: () => import('@/views/index/components/system/interface.vue'),
  },
// 用户组管理
  {
    path: "/system/usergroup",
    name: "systemUsergroup",
    component: () => import('@/views/index/components/system/usergroup.vue'),
  },
// 权限组管理
  {
    path: "/system/permission",
    name: "systempermission",
    component: () => import('@/views/index/components/system/permission.vue'),
  },
  

]


