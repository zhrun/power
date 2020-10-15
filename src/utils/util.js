/* 工具类 */
import store from '@/store/store.js'

export const km2 = m => {
	if (isNaN(m)) {
		m = 0
	}
	return (m / 1000).fixed(2)
}
/**
 * 随机数，10位时间戳 连接4位随机整数 e.g. 1428910956 + "" +3482
 * @example $.zUtils.random14(newTime);
 * */
export const random14 = () => {
	return (
		Math.round(new Date().getTime() / 1000) +
		'' +
		Math.floor(Math.random() * 9000 + 1000)
	)
}

/**
 * @summary 根据时间及格式获取时间的字符串
 * @param {int} iDate 时间
 * @param {string} sFormat 格式，默认：yyyy-MM-dd HH:mm:ss
 * @return {string} 格式化后的日期字符串
 * @example
 *    formatDate(new Date(),'yyyy-MM-dd HH:mm:ss SSS');// 2017-6-6 11:11:11
 */
export const formatDate = (iDate, sFormat = 'yyyy-MM-dd HH:mm:ss') => {
	if (!iDate) {
		return ''
	}
	if (typeof iDate === 'string') {
		iDate = iDate.replace(/-/g, '/')
	}
	let dDate = new Date(iDate)
	let year = dDate.getFullYear() // 年
	let month = dDate.getMonth() + 1 // 月
	if (month < 10) {
		month = '0' + month
	}
	let date = dDate.getDate() // 日
	if (date < 10) {
		date = '0' + date
	}
	let hour = dDate.getHours() // 时
	if (hour < 10) {
		hour = '0' + hour
	}
	let minute = dDate.getMinutes() // 分
	if (minute < 10) {
		minute = '0' + minute
	}
	let second = dDate.getSeconds() // 秒
	if (second < 10) {
		second = '0' + second
	}
	let millisecond = dDate.getMilliseconds() // 毫秒
	if (sFormat.indexOf('yyyy') >= 0) {
		sFormat = sFormat.replace('yyyy', year + '')
	}
	if (sFormat.indexOf('MM') >= 0) {
		sFormat = sFormat.replace('MM', month + '')
	}
	if (sFormat.indexOf('dd') >= 0) {
		sFormat = sFormat.replace('dd', date + '')
	}
	if (sFormat.indexOf('HH') >= 0) {
		sFormat = sFormat.replace('HH', hour + '')
	}
	if (sFormat.indexOf('mm') >= 0) {
		sFormat = sFormat.replace('mm', minute + '')
	}
	if (sFormat.indexOf('ss') >= 0) {
		sFormat = sFormat.replace('ss', second + '')
	}
	if (sFormat.indexOf('SSS') >= 0) {
		sFormat = sFormat.replace('SSS', millisecond + '')
	}
	return sFormat
}
/**
 * 转化时间
 * @param {String} str
 * @returns {String} 转化后的时间
 */
export const transDate = str => {
	if (!str) return ''
	let date = new Date(str)
	// 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
	let time = new Date().getTime() - date.getTime()
	if (time < 0) {
		return ''
	} else if (time / 1000 < 30) {
		return '刚刚'
	} else if (time / 1000 < 60) {
		return parseInt(time / 1000) + '秒前'
	} else if (time / 60000 < 60) {
		return parseInt(time / 60000) + '分钟前'
	} else if (time / 3600000 < 24) {
		return parseInt(time / 3600000) + '小时前'
	} else if (time / 86400000 < 31) {
		return parseInt(time / 86400000) + '天前'
	} else if (time / 2592000000 < 12) {
		return parseInt(time / 2592000000) + '月前'
	} else {
		return parseInt(time / 31536000000) + '年前'
	}
}
/**
 * @summary 设置cookie
 * @param {string} name cookie名称
 * @param {string} value cookie值
 * @param {int} expires 保存时间(单位:小时)
 * @param {string} path
 * @param {string} domain
 * @param {string} secure
 */
export const setCookie = (name, value, expires, path, domain, secure) => {
	let str = name + '=' + encodeURIComponent(value)
	if (expires > 0) {
		let date = new Date()
		date.setTime(date.getTime() + expires * 3600 * 1000)
		str += ';expires=' + date.toGMTString()
	}
	if (path) {
		str += ';path=' + path
	}
	if (domain) {
		str += ';domain=' + domain
	}
	if (secure) {
		str += ';secure=' + secure
	}
	document.cookie = str
}
/**
 * @summary 读取cookie
 * @param {string} name cookie名称
 * @retrun {string} value cookie值
 * @example
 */
export const getCookie = name => {
	let start = document.cookie.indexOf(name + '=')
	if (!start && name !== document.cookie.substring(0, name.length)) {
		return ''
	}
	if (start === -1) {
		return ''
	}
	let len = start + name.length + 1
	let end = document.cookie.indexOf(';', len)
	if (end === -1) {
		end = document.cookie.length
	}
	return decodeURIComponent(document.cookie.substring(len, end))
}
/**
 * 存储localStorage
 * @param {string} sName
 * @param {string} sCntent
 * @example setLocalStore('name', '测试');
 */
export const setLocalStore = (sName, sCntent) => {
	if (!sName) return
	window.localStorage.setItem(sName, sCntent)
}

/**
 * 获取localStorage
 */
export const getLocalStore = name => {
	if (!name) return null
	return window.localStorage.getItem(name)
}

/**
 * 根据当前时间获取农历时间
 */
const lunar = {
	tg: '甲乙丙丁戊己庚辛壬癸',
	dz: '子丑寅卯辰巳午未申酉戌亥',
	number: '一二三四五六七八九十',
	year: '鼠牛虎兔龙蛇马羊猴鸡狗猪',
	month: '正二三四五六七八九十冬腊',
	monthadd: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
	calendar: [
		0xa4b,
		0x5164b,
		0x6a5,
		0x6d4,
		0x415b5,
		0x2b6,
		0x957,
		0x2092f,
		0x497,
		0x60c96,
		0xd4a,
		0xea5,
		0x50da9,
		0x5ad,
		0x2b6,
		0x3126e,
		0x92e,
		0x7192d,
		0xc95,
		0xd4a,
		0x61b4a,
		0xb55,
		0x56a,
		0x4155b,
		0x25d,
		0x92d,
		0x2192b,
		0xa95,
		0x71695,
		0x6ca,
		0xb55,
		0x50ab5,
		0x4da,
		0xa5b,
		0x30a57,
		0x52b,
		0x8152a,
		0xe95,
		0x6aa,
		0x615aa,
		0xab5,
		0x4b6,
		0x414ae,
		0xa57,
		0x526,
		0x31d26,
		0xd95,
		0x70b55,
		0x56a,
		0x96d,
		0x5095d,
		0x4ad,
		0xa4d,
		0x41a4d,
		0xd25,
		0x81aa5,
		0xb54,
		0xb6a,
		0x612da,
		0x95b,
		0x49b,
		0x41497,
		0xa4b,
		0xa164b,
		0x6a5,
		0x6d4,
		0x615b4,
		0xab6,
		0x957,
		0x5092f,
		0x497,
		0x64b,
		0x30d4a,
		0xea5,
		0x80d65,
		0x5ac,
		0xab6,
		0x5126d,
		0x92e,
		0xc96,
		0x41a95,
		0xd4a,
		0xda5,
		0x20b55,
		0x56a,
		0x7155b,
		0x25d,
		0x92d,
		0x5192b,
		0xa95,
		0xb4a,
		0x416aa,
		0xad5,
		0x90ab5,
		0x4ba,
		0xa5b,
		0x60a57,
		0x52b,
		0xa93,
		0x40e95,
	],
}
export const getLunarDate = date => {
	let year, month, day
	if (!date) {
		date = new Date()
		year = date.getFullYear()
		month = date.getMonth()
		day = date.getDate()
	} else {
		date = date.split('-')
		year = parseInt(date[0])
		month = date[1] - 1
		day = parseInt(date[2])
	}
	if (year < 1921 || year > 2020) {
		return {}
	}
	let total, m, n, k, bit, lunarYear, lunarMonth, lunarDay
	let isEnd = false
	let tmp = year
	if (tmp < 1900) {
		tmp += 1900
	}
	total =
		(tmp - 1921) * 365 +
		Math.floor((tmp - 1921) / 4) +
		lunar.monthadd[month] +
		day -
		38
	if (year % 4 === 0 && month > 1) {
		total++
	}
	for (m = 0; ; m++) {
		k = lunar.calendar[m] < 0xfff ? 11 : 12
		for (n = k; n >= 0; n--) {
			bit = (lunar.calendar[m] >> n) & 1
			if (total <= 29 + bit) {
				isEnd = true
				break
			}
			total = total - 29 - bit
		}
		if (isEnd) break
	}
	lunarYear = 1921 + m
	lunarMonth = k - n + 1
	lunarDay = total
	if (k === 12) {
		if (lunarMonth === Math.floor(lunar.calendar[m] / 0x10000) + 1) {
			lunarMonth = 1 - lunarMonth
		}
		if (lunarMonth > Math.floor(lunar.calendar[m] / 0x10000) + 1) {
			lunarMonth--
		}
	}
	return {
		lunarYear: lunarYear,
		lunarMonth: lunarMonth,
		lunarDay: lunarDay,
	}
}
export const getLunarDateString = lunarDate => {
	if (!lunarDate.lunarDay) return
	let data = {},
		lunarYear = lunarDate.lunarYear,
		lunarMonth = lunarDate.lunarMonth,
		lunarDay = lunarDate.lunarDay
	data.tg = lunar.tg.charAt((lunarYear - 4) % 10)
	data.dz = lunar.dz.charAt((lunarYear - 4) % 12)
	data.year = lunar.year.charAt((lunarYear - 4) % 12)
	data.month =
		lunarMonth < 1
			? '(闰)' + lunar.month.charAt(-lunarMonth - 1)
			: lunar.month.charAt(lunarMonth - 1)
	data.day =
		lunarDay < 11 ? '初' : lunarDay < 20 ? '十' : lunarDay < 30 ? '廿' : '三十'
	if (lunarDay % 10 !== 0 || lunarDay === 10) {
		data.day += lunar.number.charAt((lunarDay - 1) % 10)
	}
	return data
}
// 深度拷贝
export const objDeepCopy = obj => {
	//递归拷贝
	if (obj === null) return null //null 的情况
	if (obj instanceof RegExp) return new RegExp(obj)
	if (obj instanceof Date) return new Date(obj)
	if (typeof obj !== 'object') {
		//如果不是复杂数据类型，直接返回
		return obj
	}
	/**
	 * 如果obj是数组，那么 obj.constructor 是 [Function: Array]
	 * 如果obj是对象，那么 obj.constructor 是 [Function: Object]
	 */
	let t = new obj.constructor()
	for (let key in obj) {
		//如果 obj[key] 是复杂数据类型，递归
		t[key] = objDeepCopy(obj[key])
	}
	return t
}

/**
 * 获取近3个月日期
 */
export const getLast3Month = () => {
	let now = new Date()
	let year = now.getFullYear()
	let month = now.getMonth() + 1 //0-11表示1-12月
	let day = now.getDate()
	let dateObj = {}
	dateObj.now = year + '-' + (month > 9 ? month : '0' + month) + '-' + day
	let nowMonthDay = new Date(year, month, 0).getDate() //当前月的总天数
	if (month - 3 <= 0) {
		//如果是1、2、3月，年数往前推一年
		let last3MonthDay = new Date(
			year - 1,
			12 - (3 - parseInt(month)),
			0
		).getDate() //3个月前所在月的总天数
		if (last3MonthDay < day) {
			//3个月前所在月的总天数小于现在的天日期
			dateObj.last =
				year -
				1 +
				'-' +
				(9 + month > 9 ? 9 + month : '0' + (9 + month)) +
				'-' +
				last3MonthDay
		} else {
			dateObj.last =
				year -
				1 +
				'-' +
				(9 + month > 9 ? 9 + month : '0' + (9 + month)) +
				'-' +
				day
		}
	} else {
		let last3MonthDay = new Date(year, parseInt(month) - 3, 0).getDate() //3个月前所在月的总天数
		if (last3MonthDay < day) {
			//3个月前所在月的总天数小于现在的天日期
			if (day < nowMonthDay) {
				//当前天日期小于当前月总天数,2月份比较特殊的月份
				dateObj.last =
					year + '-' + (month - 3) + '-' + (last3MonthDay - (nowMonthDay - day))
			} else {
				dateObj.last =
					year +
					'-' +
					(month - 3 > 9 ? month - 3 : '0' + (month - 3)) +
					'-' +
					last3MonthDay
			}
		} else {
			dateObj.last =
				year + '-' + (month - 3 > 9 ? month - 3 : '0' + (month - 3)) + '-' + day
		}
	}
	return dateObj
}

/**
 * 事件等级处理
 */
export const handleLevelInfo = (level, type) => {
	if (type == 2) {
		return '一般事件'
	} else {
		if (level == 1) {
			return 'Ⅳ级(一般)'
		} else if (level == 2) {
			return 'Ⅲ级(较大)'
		} else if (level == 3) {
			return 'Ⅱ级(重大)'
		} else if (level == 4) {
			return 'Ⅰ级（特别重大）'
		} else if (level == null) {
			return '一般事件'
		}
	}
}

/**
 * 判断时间是否为今天
 */
export const judgeIsToday = v => {
	if (!v) {
		return
	}
	let myToday = formatDate(new Date(), 'yyyy-MM-dd')
	let itemToday = v.split(' ')[0]
	if (myToday == itemToday) {
		return true
	} else {
		return false
	}
}

import axios from 'axios'
import ElementUI from 'element-ui'
/**
 * 导出
 * @param {*} exportUrl 导出的url
 * @param {*} params  附带的参数
 * @param {*} fileName 导出的文件标题
 * @param {*} extName 导出的后缀名
 * @param {*} downloadFullName 导出的文件名
 */
export const exportFn = async function(
	exportUrl,
	params,
	fileName,
	extName,
	downloadFullName
) {
	axios.defaults.withCredentials = true
	axios({
		method: 'get',
		baseURL: '',
		url: exportUrl,
		timeout: 3000,
		headers: {
			platformType: 2, //1 后台  2 web 3app
			sourceType: 'web',
		},
		params: params,
		responseType: 'blob',
		withCredentials: true,
	})
		.then(({ data }) => {
			// 有可能下载失败，返回{code: '100*****'},但responseType: 'blob'会把data强制转为blob，导致下载undefined.xlsx
			// 解决：将已转为blob类型的data转回json格式，判断是否下载成功
			let r = new FileReader()
			r.onload = function() {
				// 如果JSON.parse(this.result)不报错，说明this.result是json字符串，是下载报错情况的返回值，弹框提示
				// 如果JSON.parse(this.result)报错，说明下载成功，进入catch
				try {
					let resData = JSON.parse(this.result) // this.result为FileReader获取blob数据转换为json后的数据，即后台返回的原始数据
					if (resData && resData['code']) {
						ElementUI.Message({
							message: '导出文件失败',
							type: 'error',
						})
					}
					if (resData) {
						if (resData.code === '10060002') {
							ElementUI.Message({ message: resData.viewMsg, type: 'error' })
							store.commit('exitLogin')
							setTimeout(() => {
								window.location.href = './'
							}, 500)
						} else {
							let msg = '访问出错'
							if (resData.viewMsg) {
								msg = resData.viewMsg
							}
							ElementUI.Message({ message: msg, type: 'error' })
						}
					}
				} catch (err) {
					const now = new Date()
					const time = `${formatDate(
						now,
						'yyyyMMddHHmmss'
					)}${now.getMilliseconds()}`
					// 文件名格式为： 文件名 + 年月日时分秒毫秒
					const downloadName =
						downloadFullName || `${fileName}${time}.${extName}`
					// 兼容ie11
					if (window.navigator.msSaveOrOpenBlob) {
						try {
							const blobObject = new Blob([data])
							window.navigator.msSaveOrOpenBlob(blobObject, downloadName)
						} catch (e) {
							console.log(e)
						}
						return
					}
					let url = window.URL.createObjectURL(new Blob([data]))
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					link.setAttribute('download', downloadName)
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					window.URL.revokeObjectURL(url)
				}
			}
			r.readAsText(data)
		})
		.catch()
}

/**
 * list转为树结构
 * @param {*} list 原数组
 * @param {*} parentUid 父级关联id
 */
export const listToTree = function(list, parentUid) {
	let res = []
	let treeLst = list
	treeLst.forEach((item, index) => {
		if (item.parentUid === parentUid) {
			const children = listToTree(treeLst, item.uid)
			if (children && children.length > 0) {
				treeLst[index].children = children
			}
			res.push(treeLst[index])
		}
	})
	return res
}

/**
 * 自动创建一个a标签下载/导出文件
 */
export const autoDownloadUrl = url => {
	let a = document.createElement('a')
	a.style.display = 'none'
	a.href = url
	a.target = '_self'
	a.onload = function() {
		document.body.removeChild(a)
	}
	document.body.appendChild(a)
	a.click()
}

/**
 * 根据保质期单位(1年 2月 3天)和生产日期，计算保质期至
 */
export const qualityPeriod = (m, ty, t) => {
	if (t == 1) {
		//年
		return parseInt(m.substring(0, 4)) + ty + m.substring(4, m.length)
	} else if (t == 2) {
		//月
		let s = m.split('-')
		let yy = parseInt(s[0])
		let mm = parseInt(s[1])
		let dd = parseInt(s[2])
		let num = mm + ty
		if (num - 12 >= 0) {
			yy += parseInt(num / 12)
			mm = (num % 12) + 1
		} else {
			mm = num
		}
		return yy + '-' + mm + '-' + dd
	} else if (t == 3) {
		//日
		let ms = new Date(m).getTime() + ty * 24 * 60 * 60 * 1000
		return formatDate(ms, 'yyyy-MM-dd')
	}
}

/* js小数乘法
*@parameter arg1：被乘数（接受小数和整数）
*@parameter arg2：乘数（接受小数和整数）
*@parameter fix: 乘积保留几位（接受正负整数以及0）
*/
export const accMul = (arg1, arg2, fix) => {
	if (!parseInt(fix) == fix) {
		return
	}
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString()
	try {
		m += s1.split('.')[1].length
	} catch (e) {
    m += ''
  }
	try {
		m += s2.split('.')[1].length
	} catch (e) {
    m += ''
  }
	if (m > fix) {
		return (
			Math.round(
				(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
					Math.pow(10, m - fix)
			) / Math.pow(10, fix)
		)
	} else if (m <= fix) {
		return (
			(Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
			Math.pow(10, m)
		).toFixed(fix)
	} else {
		return (arg1 * arg2).toFixed(fix)
	}
}

export const treeData=  (data)=> {
	let a = data.filter(o=>o.resourceLayer==1)
	let level = 1
	if(a && a.length>0){
		level = 1
	}else{
		level = 2
	}
	let cloneData = JSON.parse(JSON.stringify(data))
	return cloneData.filter(parent => {  //uid 代表id   parentUid代表父级 id
		let branchArr = cloneData.filter(child => parent['uid'] == child['parentUid']);
		branchArr.length > 0 ? parent['children'] = branchArr : '';
		// return (parent['parentUid'] == '4TvGVMAQo5VQqPN3tQvgFW' && parent['uid']!='4TvGVMAQo5VQqPN3tQvgFW');
		return parent['resourceLayer'] == level
	})
  }