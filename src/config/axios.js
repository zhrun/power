import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
import createStore from '@/store/store.js'
const store = createStore()
import { ajaxCtx } from '@/config/config.js';
const service = axios.create({
  baseURL: ajaxCtx.base, // api的base_url
  timeout: 10000, // request timeout
  withCredentials: true,
  headers: {
    'platformType':2, //1 后台  2 web 3app
    'sourceType':"web"
  }
})
// axios添加一个请求拦截器
service.interceptors.request.use((config) => {
  if (config.mode && ajaxCtx[config.mode]) {
    config.baseURL = ajaxCtx[config.mode];
  }
  let r = '_r=' + new Date().getTime();
  if (config.url.indexOf('?') > 0) {
    r = '&' + r;
  } else {
    r = '?' + r;
  }
  config.url = config.url + r;
  return config;
}, (error) => {
  console.log('地址：' + error.config.url + '请求失败！');
  return Promise.reject(error);
});
// axios添加一个响应拦截器
service.interceptors.response.use(function (response) {
  if (response && response.data) {
    let _data = response.data;
    if (_data.code === '00000000') {
      return _data;
    } else if (_data.code === '10060002' || _data.code === '10060001') {
      if (document.getElementsByClassName('el-message').length === 0) {
        ElementUI.Message({ message: _data.viewMsg, type: 'error' });
      }
      // store.commit("exitLogin");
      // setTimeout(() => {
      //   window.location.href = "./"
      // }, 500);
      return _data;
    } else {
      let msg = '访问出错';
      if (_data.viewMsg) {
        msg = _data.viewMsg;
      }
      if(_data.code === '10020004' && _data.data && _data.data.failNum>0 ){
        msg = '导入失败，请下载查看失败原因';
      }
      if (document.getElementsByClassName('el-message').length === 0 && _data.code !== '10060008') {
        ElementUI.Message({ message: msg, type: 'error' });
      }
      return Promise.reject(_data);
    }
  } else {
    return null;
  }
}, function (error) {
  let errorMsg = '<span style="font-weight: bold; font-size: 13px; display: inline-block; padding-bottom: 5px;">请求失败</span><br/>' +
    '<span>请刷新页面重新操作，如果问题依旧存在，请联系管理员</span>';
  // 提示
  if (document.getElementsByClassName('el-message').length === 0) {
    ElementUI.Message({
      message: errorMsg,
      dangerouslyUseHTMLString: true,
      type: 'error'
    });
  }
  return Promise.reject(error);
});
Vue.prototype.axios = service;
export default service
