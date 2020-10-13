import Vue from 'vue'
// import { sendSpot } from '@/views/index/store/api'
// 权限检查指令
Vue.directive('has', {
  inserted(el, binding) {
    // 获取按钮权限
    let btnPermissions = binding.value // vnode.context.$route.meta.btnPermissions;
    if (!checkPermission(btnPermissions)) {
      el.parentNode.removeChild(el);
    }
  }
});
// 权限检查方法
function checkPermission(arr) {
  let permissions = JSON.parse(localStorage.getItem("permission"));
  let flag = false;
  if(permissions && permissions.length > 0) {
    arr.forEach(item => {
      permissions.forEach(perm => {
        if(perm.uid == item) {
          flag = true;
        }
      })
    })
  }
  return flag;
}
//  export {has}
