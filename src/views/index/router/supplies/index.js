import routerZr from './router.zr.js'
import routerPs from './router.ps.js'
import routerYy from './router.yy.js'
import routerXy from './router.xy.js'
import routerPower from './router.power.js'

let routers = [
  // 无权限页面
  {
		path: 'noPermission',
		name: 'noPermission',
		component: () =>
			import('@/views/index/components/noPermission.vue'),
	},
]
routers = routers.concat(routerZr).concat(routerPs).concat(routerYy).concat(routerXy).concat(routerPower)
export default routers
