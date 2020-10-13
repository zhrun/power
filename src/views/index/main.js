import 'babel-polyfill'
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import App from "@/components/App.vue";

// axios
import "@/config/axios.js";
// router
import router from "./router/index.js";

// 自定义滚动条
import vuescroll from "vuescroll/dist/vuescroll-native";
import "vuescroll/dist/vuescroll.css";
// include
import "@/config/include.js";

import createStore from '@/store/store.js'
const store = createStore()
// mock下启用mockjs
process.env.NODE_ENV === "mock" && require('@/mock/index.js')
import "@/directive";
Vue.use(vuescroll, {
  ops: {
    // 滚动条滚动的地方
    rail: {
      size: "6px",
      opacity: 0,
    },
    // 滚动条
    bar: {
      background: "#CCC",
      onlyShowBarOnScroll: false,
    },
    scrollPanel: {
      scrollingX: false,
    },
  },
});
Vue.config.productionTip = false;
const on = Vue.prototype.$on
// 防抖处理
Vue.prototype.$on = function (event, func) {
    let timer
    let newFunc = func
    if (event === 'click') {
        newFunc = function () {
            clearTimeout(timer)
            timer = setTimeout(function () {
                func.apply(this, arguments)
            }, 500)
        }
    }
    on.call(this, event, newFunc)
}
// 节流
Vue.prototype.$on = function (event, func) {
  let previous = 0
  let newFunc = func
  if (event === 'click') {
    newFunc = function () {
      const now = new Date().getTime()
      if (previous + 1000 <= now) {
        func.apply(this, arguments)
        previous = now
      }
    }
  }
  on.call(this, event, newFunc)
}

/* eslint-disable no-new */
// runtime模式（运行时）
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
