import request from "@/config/axios";
import { ajaxCtx } from '@/config/config.js'

//新增资源
export const addResource = (params) => {
  return request({
    url: "/muem/resource/resource-service/resource",
    method: "POST",
    mode: "rel",
    data: params,
  });
};
// 导出物资列表
export const exportMaterialsUrl = ajaxCtx["rel"] + "/muem/resource/resource-service/export";
// 导出救援力量列表
export const exportRescueForceUrl = ajaxCtx["rel"] + "/muem/resource/rescue-service/export";
// 导出专家列表
export const exportExpertUrl = ajaxCtx["rel"] + "/muem/resource/expert-service/export";
// 导出车辆列表
export const exportVehicleUrl = ajaxCtx["rel"] + "/muem/resource/vehicle-service/export";
// 导出避难所列表
export const exportShelterUrl = ajaxCtx["rel"] + "/muem/resource/refuge-service/export";

//编辑资源
export const editResource = (params) => {
    return request({
      url: "/muem/resource/resource-service/resource",
      method: "PUT",
      mode: "rel",
      data: params,
    });
  };

//删除资源
export const deleteResource = (params) => {
    return request({
      url: "/muem/resource/resource-service/resource",
      method: "DELETE",
      mode: "rel",
      params,
    });
  };
//获取资源详情
  export const getResourceDetail = (params) => {
    return request({
      url: "/muem/resource/resource-service/resource-detail",
      method: "GET",
      mode: "rel",
      params,
    });
  };
//获取资源分页
  export const getResourcePage = (params) => {
    return request({
      url: "/muem/resource/resource-service/resource-page-list",
      method: "GET",
      mode: "rel",
      params,
    });
  };

//新增救援力量
export const addRescueForce = (params) => {
  return request({
    url: "/muem/resource/rescue-service/rescue-force",
    method: "POST",
    mode: "rel",
    data:params,
  });
};
//编辑救援力量
export const editRescueForce = (params) => {
  return request({
    url: "/muem/resource/rescue-service/rescue-force",
    method: "PUT",
    mode: "rel",
    data:params,
  });
};
//获取救援力量分页
export const getRescuPage = (params) => {
  return request({
    url: "/muem/resource/rescue-service/rescue-page-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//删除救援力量
export const deleteRescueForce = (params) => {
  return request({
    url: "/muem/resource/rescue-service/rescue-force",
    method: "DELETE",
    mode: "rel",
    params,
  });
};
// 导入成员
export const importMemberInfoUrl = `${ajaxCtx["rel"]}/muem/resource/rescue-service/import`
export function importInfo (data) {
  return request({
    url: '/muem/resource/rescue-service/import',
    method: 'post',
    mode: 'rel',
    data:data
  });
}
//获取救援力量详情
export const getRescueForceDetail = (params) => {
  return request({
    url: "/muem/resource/rescue-service/detail",
    method: "GET",
    mode: "rel",
    params,
  });
};
// 成员装备模板下载
export const downloadUrl = ajaxCtx["rel"] + "/muem/resource/rescue-service/download";
// export const downloadUrl = ajaxCtx["http://apidev.aorise.org/muem-resource/templates/excel/救援力量主要成员导入模板.xls"];

export const getPost = (params) => {
  return request({
    url: "/muem/resource/rescue-service/position-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//获取负责人信息
export const getPrincipal = (params) => {
  return request({
    url: "/muem/resource/rescue-service/principal-list",
    method: "GET",
    mode: "rel",
    params,
  });
};

//新增专家
export const addExpert = (params) => {
  return request({
    url: "/muem/resource/expert-service/expert",
    method: "POST",
    mode: "rel",
    data:params,
  });
};
//编辑专家
export const editExpert = (params) => {
  return request({
    url: "/muem/resource/expert-service/expert",
    method: "PUT",
    mode: "rel",
    data:params,
  });
};
//获取专家分页
export const getExpertPage = (params) => {
  return request({
    url: "/muem/resource/expert-service/expert-page-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//删除专家
export const deleteExpert = (params) => {
  return request({
    url: "/muem/resource/expert-service/expert",
    method: "DELETE",
    mode: "rel",
    params,
  });
};
//获取专家详情
export const getExpertDetail = (params) => {
  return request({
    url: "/muem/resource/expert-service/detail",
    method: "GET",
    mode: "rel",
    params,
  });
};
//新增避难场所
export const addShelter = (params) => {
  return request({
    url: "/muem/resource/refuge-service/refuge",
    method: "POST",
    mode: "rel",
    data:params,
  });
};
//编辑避难场所
export const editShelter = (params) => {
  return request({
    url: "/muem/resource/refuge-service/refuge",
    method: "PUT",
    mode: "rel",
    data:params,
  });
};

//获取避难所详情
export const getShelterDetail = (params) => {
  return request({
    url: "/muem/resource/refuge-service/detail",
    method: "GET",
    mode: "rel",
    params,
  });
};
//获取避难场所分页
export const getShelterPage = (params) => {
  return request({
    url: "/muem/resource/refuge-service/refuge-page-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//删除避难场所
export const deleteShelter = (params) => {
  return request({
    url: "/muem/resource/refuge-service/refuge",
    method: "DELETE",
    mode: "rel",
    params,
  });
};
//新增应急车辆
export const addVehicle = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/vehicle",
    method: "POST",
    mode: "rel",
    data:params,
  });
};
//编辑应急车辆
export const editVehicle = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/vehicle",
    method: "PUT",
    mode: "rel",
    data:params,
  });
};
//完成调用
export const complete = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/complete",
    method: "PUT",
    mode: "rel",
    params,
  });
};
//获取应急车辆详情
export const getVehicleDetail = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/detail",
    method: "GET",
    mode: "rel",
    params,
  });
};
//获取所属单位
export const getOrgName = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/org-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//获取应急车辆分页
export const getVehiclePage = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/vehicle-page-list",
    method: "GET",
    mode: "rel",
    params,
  });
};
//删除应急车辆场所
export const deleteVehicle = (params) => {
  return request({
    url: "/muem/resource/vehicle-service/vehicle",
    method: "DELETE",
    mode: "rel",
    params,
  });
};
//获取字典信息
  export const getDicts = (params) => {
    return request({
      url: "/muem/resource/dict-service/dict-tree",
      method: "GET",
      mode: "rel",
      params,
    });
  };
  //上传图片
  export const fileUrl = ajaxCtx['rel'] + '/muem/resource/file-upload-service/batch'

  export function pictureUpload(data) {
    return request({
        url: '/muem/resource/file-upload-service/batch',
        method: 'post',
        mode: 'rel',
        timeout: 1800000,
        data
    });
  }
  
  export const checkUniqueness = (params) => {
    return request({
      url: "/muem/resource/vehicle-service/check-uniqueness",
      method: "GET",
      mode: "rel",
      params,
    });
  };
