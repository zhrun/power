import request from '@/config/axios';
/**
 * 登录
 * @param {*} data
 */
export function login (data) {
    return request({
      url: '/authServices/users/loginByAccount',
      data,
      mode: 'auth',
      method: 'post'
    });
  }
  //弱密码查询
  export function weakPassword(data) {
    // request.defaults.headers['Auth-Session-Id'] = data.proKey;
    return request({
        url: '/authServices/users/weak-password',
        method: 'post',
        mode: "auth",
        data,
        headers:{
          'Auth-Session-Id':data.sid
        }
    });
}