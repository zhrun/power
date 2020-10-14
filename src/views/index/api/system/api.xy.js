import request from "@/config/axios";

export const getOrgan = (data) => {
  return request({
    url: "/auth/authServices/organ/user",
    method: "GET",
    mode: "rms",
    params: data
  })
};