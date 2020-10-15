import request from "@/config/axios";


/**
 * getAuthUserRoles 角色分页查询接口
 * @param { data }
 */
export const getAuthUserRoles = (data) => {
  return request({
    url: "/auth/authServices/userRoles",
    method: "GET",
    mode: "rms",
    params: data
  })
};

/**
 * postUserRole 角色新增接口
 * @param { data }
 */
export const postUserRole = (data) => {
  return request({
    url: "/auth/authServices/userRole",
    method: "POST",
    mode: "rms",
    data,
  })
};

/**
 * geAuthServicesUsers 用户分页查询接口
 * @param { data }
 */
export const geAuthServicesUsers = (data) => {
  return request({
    url: "/auth/authServices/users",
    method: "GET",
    mode: "rms",
    params: data
  })
};

/**
 * postUserService 新增用户接口
 * @param { data }
 */
export const postUserService = (data) => {
  return request({
    url: "/auth/authServices/user",
    method: "POST",
    mode: "rms",
    data,
  })
};

/**
 * putUserService 编辑用户接口
 * @param { data }
 */
export const putUserService = (data) => {
  return request({
    url: "/auth/authServices/user",
    method: "PUT",
    mode: "rms",
    data,
  })
};

/**
 * deleteUserService  删除组装和拆卸单
 * @param { data }
 */
export const deleteUserService = (data) => {
  return request({
    url: "/auth/authServices/user/" + data.uid,
    method: "DELETE",
    mode: "rms",
    params: data
  })
};





