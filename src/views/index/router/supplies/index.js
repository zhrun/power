import routerZr from './router.zr.js'
import routerPs from './router.ps.js'
import routerYy from './router.yy.js'
import routerXy from './router.xy.js'

let routers = [
  // 无权限页面
  {
		path: 'noPermission',
		name: 'noPermission',
		component: () =>
			import('@/views/index/components/noPermission.vue'),
	},
]
routers = routers.concat(routerZr).concat(routerPs).concat(routerYy).concat(routerXy)
export default routers
