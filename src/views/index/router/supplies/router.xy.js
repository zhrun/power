export default [
    {
        path: "materialslist", //物资列表
        name: "materialslist",
        meta: {
          keepAlive: true,
          isBack: true,
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/materialsManage/MaterialsList.vue"),
      },
      {
        path: "addoreditmaterials", //新增编辑物资
        name: "addoreditmaterials",
        props: router => ({
          flag: router.query.flag,
          uid: router.query.uid,
        }),
        meta: {
          father: 'materialslist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/materialsManage/addOrEditMaterials.vue"),
      },
      {
        path: "materialsdetails", //物资详情
        name: "materialsdetails",
        meta: {
          father: 'materialslist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/materialsManage/MaterialsDetails.vue"),
      },
      {
        path: "professorlist", //专家列表
        name: "professorlist",
        meta: {
          keepAlive: true,
          isBack: true,
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/professorManage/ProfessorList.vue"),
      },
      {
        path: "addoreditprofessor", //新增编辑专家
        name: "addoreditprofessor",
        props: router => ({
          flag: router.query.flag,
          uid: router.query.uid,
        }),
        meta: {
          father: 'professorlist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/professorManage/addOrEditProfessor.vue"),
      },
      {
        path: "professordetails", //物资详情
        name: "professordetails",
        meta: {
          father: 'professorlist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/professorManage/professorDetails.vue"),
      },
      {
        path: "rescueforcelist", //救援力量列表
        name: "rescueforcelist",
        meta: {
          keepAlive: true,
          isBack: true,
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/rescueForceManage/rescueForceList.vue"),
      },

      {
        path: "addoreditrescueforce", //新增编辑救援力量
        name: "addoreditrescueforce",
        meta: {
          father: 'rescueforcelist',
        },
        props: router => ({
          flag: router.query.flag,
          uid: router.query.uid,
        }),
        // meta: {
        //   keepAlive: true,
        // },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/rescueForceManage/addOrEditRescueForce.vue"),
      },
      
      {
        path: "rescueforcedetails", //救援力量详情
        name: "rescueforcedetails",
        meta: {
          father: 'rescueforcelist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/rescueForceManage/rescueForceDetails.vue"),
      },

      {
        path: "emergencyvehicleslist", //救援车辆列表
        name: "emergencyvehicleslist",
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/emergencyVehiclesManage/EmergencyVehiclesList.vue"),
      },
      {
        path: "addoreditvehicles", //新增编辑救援车辆
        name: "addoreditvehicles",
        props: router => ({
          flag: router.query.flag,
          uid: router.query.uid,
        }),
        meta: {
          father: 'emergencyvehicleslist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/emergencyVehiclesManage/addOrEditVehicles.vue"),
      },
      {
        path: "vehiclesdetails", //救援车辆详情
        name: "vehiclesdetails",
        meta: {
          father: 'emergencyvehicleslist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/emergencyVehiclesManage/vehiclesDetails.vue"),
      },
    
      {
        path: "shelterlist", //救援场所列表
        name: "shelterlist",
        meta: {
          keepAlive: true,
          isBack: true,
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/shelterManage/shelterList.vue"),
      },
      {
        path: "addoreditshelter", //新增编辑救援场所
        name: "addoreditshelter",
        props: router => ({
          flag: router.query.flag,
          uid: router.query.uid,
        }),
        meta: {
          father: 'shelterlist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/shelterManage/addOrEditShelter.vue"),
      },
      {
        path: "shelterdetails", //救援场所详情
        name: "shelterdetails",
        meta: {
          father: 'shelterlist',
        },
        component: () =>
          import("@/views/index/components/supplies/reliefSuppliesManagement/shelterManage/shelterDetails.vue"),
      },
];