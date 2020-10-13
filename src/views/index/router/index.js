import Vue from 'vue'
import Router from 'vue-router'
import routerEas from './router.eas.js'


//解决Element导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  let a = originalPush.call(this, location)
  if(a){
    a.catch(err => err) 
  }
  return a //originalPush.call(this, location).catch(err => err) 
}


Vue.use(Router)
let router = new Router({
  // mode: 'history',
  base: process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : '',
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/main',
      name: 'default',
      component: () => import('@/views/index/components/default.vue'),
      children: routerEas
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/index/components/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/index/components/register.vue')
    },
    {
      path: '/findPwd',
      name: 'findPwd',
      component: () => import('@/views/index/components/findPwd.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    // 登录页 不需要判断
    next();
  }else {
    // 不是去登录页面:判断登录 判断token是否存在即可
    let token = sessionStorage.getItem("duty_userId");
    if (token) {
      // 登录成功
      // TODO:权限完善后释放
      let isInclud=(from.path.indexOf("/prOpration")>-1 || from.path.indexOf("/finishPro")>-1|| from.path.indexOf("/programVerify")>-1|| from.path.indexOf("/programDetails")>-1|| from.path.indexOf("/manualDetails")>-1|| from.path.indexOf("/manualVerify")>-1 || from.path.indexOf("/failDetail")>-1 || from.path.indexOf("/modifyduty")>-1 || from.path.indexOf("/addUpdateDutyInfo")>-1 || from.path.indexOf("/addExpress")>-1 || from.path.indexOf("/instructeAddExpress")>-1 || from.path.indexOf("/receiveAddExpress")>-1 || from.path.indexOf("/addInstructeFeedback")>-1 || from.path.indexOf("/calCommunication")>-1 || from.path.indexOf("/newCommunication")>-1 || from.path.indexOf("/newTelephoneRecord")>-1 || from.path.indexOf("/addInStorage")>-1 || from.path.indexOf("/detailWarehouse")>-1 || from.path.indexOf("/editWarehouse")>-1 || from.path.indexOf("/detailSupplier")>-1 || from.path.indexOf("/editSupplier")>-1 || from.path.indexOf("/inStorageDetail")>-1 || from.path.indexOf("/addOutStorage")>-1 || from.path.indexOf("/outStorageDetail")>-1 || from.path.indexOf("/addLabel")>-1 || from.path.indexOf("/labelDetail")>-1 || from.path.indexOf("/addaAndD")>-1 || from.path.indexOf("/aAndDDetail")>-1 || from.path.indexOf("/inventoryDetail")>-1 || from.path.indexOf("/addInventory")>-1)
      if (isInclud) {
        to.meta.isBack = true;
      } else {
        to.meta.isBack = false;
      }
      // 继续访问
      next();
    } else {
      // 不是去登录页面,也没有登录(判断是否有token)
      // 这里不是Vue实例 无法通过this访问 但是可以访问到Vue构造函数 可以通过原型访问
      Vue.prototype.$message.error('请先登录');
      // 打会登录页 可以使用next 进行路由跳转
      next('/login');
    }
  }

})

// release环境出现点击后不跳转路由，控制台报错 loading chunk failed 解决方案
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

export default router