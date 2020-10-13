import request from "@/config/axios";


/**
 * getauthUserRoles 所有物资装备分页列表
 * @param { data }
 */
export const getauthUserRoles = (data) => {
  return request({
    url: "/auth/authServices/userRoles",
    method: "GET",
    mode: "rms",
    params: data
  })
};