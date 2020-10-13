export default [
  /** 系统管理start */
  {
    path: "unitManagement", //组织机构
    name: "unitManagement",
    component: () =>
      import("@/views/index/components/duty/systemManage/unitManagement/index.vue"),
  },
  {
    name: "editUnit",
    path: "editUnit", // 新增或修改单位
    props: (router) => ({
      flag: router.query.flag,
      uid: router.query.uid,
      parentUid: router.query.parentUid,
      parentUnitName: router.query.parentUnitName,
    }),
    meta: {
      father: "unitManagement",
    },
    component: () =>
      import("@/views/index/components/duty/systemManage/unitManagement/editUnit.vue"),
  },
  {
    name: "viewUnit",
    path: "viewUnit", // 查看单位
    props: (router) => ({
      uid: router.query.uid,
    }),
    meta: {
      father: "unitManagement",
    },
    component: () =>
      import("@/views/index/components/duty/systemManage/unitManagement/viewUnit.vue"),
  },
  {
    path: "userManagement", //用户管理
    name: "userManagement",
    component: () =>
      import("@/views/index/components/duty/systemManage/userManagement/index.vue"),
  },
  {
    name: "importManager", // 导入用户
    path: "importManager",
    meta: {
      father: "userManagement",
    },
    component: () =>
      import("@/views/index/components/duty/systemManage/userManagement/importManager.vue"),
  },
  {
    name: "editManager",
    path: "editManager", // 新增或修改管理员
    props: (router) => ({
      uid: router.query.uid,
      flag: router.query.flag,
      unitUid: router.query.unitUid,
      unitName: router.query.unitName,
    }),
    meta: {
      father: "userManagement",
    },
    component: () =>
      import("@/views/index/components/duty/systemManage/userManagement/editManager.vue"),
  },
  {
    path: "roleManagement", //角色管理
    name: "roleManagement",
    component: () =>
      import("@/views/index/components/duty/systemManage/roleManagement/index.vue"),
  },
  {
    path: "rolePermission", //角色权限
    name: "rolePermission",
    props: (router) => ({
      uid: router.query.uid,
      flag: router.query.flag,
      roleName: router.query.roleName,
    }),
    meta: {
      father: "roleManagement",
    },
    component: () =>
      import("@/views/index/components/duty/systemManage/roleManagement/rolePermission.vue"),
  },
  {
    path: "rightManagement", //权限管理
    name: "rightManagement",
    component: () =>
      import("@/views/index/components/duty/systemManage/rightManagement/index.vue"),
  },
  /** 系统管理管理end */
  /** 通讯录管理start */
  {
    path: "unitAddressBook", //单位通讯录
    name: "unitAddressBook",
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/unitAddressBook/index.vue"),
  },
  {
    path: "editUnitAddressBook", //新增、修改单位通讯录
    name: "editUnitAddressBook",
    props: (router) => ({
      flag: router.query.flag,
      uid: router.query.uid,
      parentUid: router.query.parentUid,
      parentUnitName: router.query.parentUnitName,
    }),
    meta: {
      father: "unitAddressBook",
    },
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/unitAddressBook/editUnitAddressBook.vue"),
  },
  {
    path: "importUnitAddressBook", //导入单位通讯录
    name: "importUnitAddressBook",
    meta: {
      father: "unitAddressBook",
    },
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/unitAddressBook/importUnitAddressBook.vue"),
  },
  {
    path: "personAddressBook", //人员通讯录
    name: "personAddressBook",
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/personAddressBook/index.vue"),
  },
  {
    path: "editPersonAddressBook", //编辑人员通讯录
    name: "editPersonAddressBook",
    props: (router) => ({
      flag: router.query.flag,
      uid: router.query.uid,
      unitUid: router.query.unitUid,
      unitName: router.query.unitName,
      interUnitUid: router.query.interUnitUid,
      interOfficeUid: router.query.interOfficeUid,
    }),
    meta: {
      father: "personAddressBook",
    },
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/personAddressBook/editPersonAddressBook.vue/"),
  },
  {
    path: "viewPersonAddressBook", //查看人员信息
    name: "viewPersonAddressBook",
    props: (router) => ({
      uid: router.query.uid,
    }),
    meta: {
      father: "personAddressBook",
    },
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/personAddressBook/viewPersonAddressBook.vue"),
  },
  {
    path: "importPersonAddressBook", //导入人员信息
    name: "importPersonAddressBook",
    meta: {
      father: "personAddressBook",
    },
    component: () =>
      import("@/views/index/components/duty/addressBookMgt/personAddressBook/importPersonAddressBook.vue"),
  },
  /** 通讯录管理end */
  /** 用户管理start */
  // 本级用户
  {
    path: "sameLevelUser",
    name: "sameLevelUser",
    component: () =>
      import("@/views/index/components/duty/usermanage/sameLevelUser.vue"),
  },
  // 新增/编辑本级用户
  {
    path: "editSameLevelUser",
    name: "editSameLevelUser",
    props: (router) => ({
      uid: router.query.uid,
      flag: router.query.flag,
    }),
    meta: {
      father: "sameLevelUser",
    },
    component: () =>
      import("@/views/index/components/duty/usermanage/editSameLevelUser.vue"),
  },
  //   下级管理员
  {
    path: "lowerLevelAdmin",
    name: "lowerLevelAdmin",
    component: () =>
      import("@/views/index/components/duty/usermanage/lowerLevelAdmin.vue"),
  },
  // 新增/编辑下级管理员
  {
    path: "editLowerLevelAdmin",
    name: "editLowerLevelAdmin",
    props: (router) => ({
      flag: router.query.flag,
      uid: router.query.uid,
      unitUid: router.query.unitUid,
      unitName: router.query.unitName,
    }),
    meta: {
      father: "lowerLevelAdmin",
    },
    component: () =>
      import("@/views/index/components/duty/usermanage/editLowerLevelAdmin.vue"),
  },
  /** 用户管理end */
  /** 通讯录查询start */
  // 人员通讯录查询
  {
    path: "personnelAddressQuery",
    name: "personnelAddressQuery",
    component: () =>
      import("@/views/index/components/duty/addressQuery/personnelAddressQuery.vue"),
  },
  //   单位通讯录查询
  {
    path: "companyAddressQuery",
    name: "companyAddressQuery",
    component: () =>
      import("@/views/index/components/duty/addressQuery/companyAddressQuery.vue"),
  },
  /** 通讯录查询end */
  /** 修改本单位信息start */
  {
    path: "modifyUnitInfo",
    name: "modifyUnitInfo",
    props: (router) => ({
      unitUid: router.query.unitUid,
    }),
    component: () =>
      import("@/views/index/components/duty/modifyUnitInfo/index.vue"),
  },
  /** 修改本单位信息end */
];
