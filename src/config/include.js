import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 2.0
// 引入公用样式
import '_assets/css/reset.css';
import '_assets/css/style.scss';
import '_assets/css/supplies.scss';
// import 全局filter
import '@/utils/filter.js';
// 混入
import '@/utils/mixin.js';
// import 全局方法
import '@/utils/method.js';
// 引入放大图片
// import 自定义shape for AntV/g2
import '@/utils/antv.shape.js';
// import createStore from '@/store/store.js'
// const store = createStore()
// use element-ui
Vue.use(ElementUI);

// 页面进入的时候处理用户信息和token信息
// const loginInfo = localStorage.getItem('vis_user_info');

// try {
//   if (loginInfo) {
//     store.dispatch("updateUserinfo", {
//       userInfo: JSON.parse(loginInfo),
//     })
//   } else {
//     store.dispatch('updateUserinfo', {
//       userInfo: null
//     });
//   }
// } catch (err) {
//   console.log(err);
// }

