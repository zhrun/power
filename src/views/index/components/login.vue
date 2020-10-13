<template>
  <div class="login">
    <div class="main">
      <img class="title_img" src="../../../assets/img/l_title_cn.png"/>
      <img class="title_img" src="../../../assets/img/l_title_en.png"/>
      <div class="content">
        <div class="welcome">- 欢迎登录！ -</div>
        <div class="tabs">
          <div class="tab" :class="{ 'actived': loginType === '2' }" @click="switchLoginType('2')">用户登录</div>
          <div class="tab" :class="{ 'actived': loginType === '1' }" @click="switchLoginType('1')">管理员登录</div>
        </div>
        <template v-if="loginType === '2'">
          <template v-if="composeType === '2'">
            <el-form ref="userLoginPsdForm" :model="userLoginPsdForm" :rules="userLoginPsdFormRules" key="userLoginPsdForm">
              <el-form-item prop="account">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="userLoginPsdForm.account"
                  placeholder="请输入用户名/手机号码"
                >
                  <i slot="prefix" class="icon icon_account"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <input type="password" style="width:0;height:0;float:left;visibility:hidden"/>
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="userLoginPsdForm.password"
                  placeholder="请输入密码" show-password
                >
                  <i slot="prefix" class="icon icon_password"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="imgValidateCode">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="userLoginPsdForm.imgValidateCode"
                  maxlength="4"
                  placeholder="请输入验证码"
                >
                  <i slot="prefix" class="icon icon_code"></i>
                </el-input>
                <img :src="byteArrayImg" alt="" @click="reGetImg" style="max-width:120px">
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="isRemember">记住用户名</el-checkbox>
                  <span @click="switchComposeType('1')">验证码登录</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <el-form ref="userLoginCodeForm" :model="userLoginCodeForm" :rules="userLoginCodeFormRules" key="userLoginCodeForm">
              <el-form-item prop="account">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="userLoginCodeForm.account"
                  placeholder="请输入手机号"
                >
                  <i slot="prefix" class="icon icon_account"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="validateCode">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="userLoginCodeForm.validateCode"
                  maxlength="6"
                  placeholder="请输入验证码"
                >
                  <i slot="prefix" class="icon icon_code"></i>
                  <span slot="append" class="inline_button" @click="beforeGetValidateCode" prefix-icon="el-icon-s-claim">获取验证码</span>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="isRemember">记住手机号</el-checkbox>
                  <span @click="switchComposeType('2')">密码登陆</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </template>
        <template v-else>
          <template v-if="composeType === '2'">
            <el-form ref="managerLoginPsdForm" :model="managerLoginPsdForm" :rules="managerLoginPsdFormRules" key="managerLoginPsdForm">
              <el-form-item prop="account">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="managerLoginPsdForm.account"
                  placeholder="请输入用户名/卡号"
                >
                  <!-- prefix-icon="el-icon-user-solid" -->
                  <i slot="prefix" class="icon icon_account"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <input type="password" style="width:0;height:0;float:left;visibility:hidden"/>
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="managerLoginPsdForm.password"
                  placeholder="请输入密码" show-password
                >
                  <i slot="prefix" class="icon icon_password"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="imgValidateCode">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="managerLoginPsdForm.imgValidateCode"
                  maxlength="4"
                  placeholder="请输入验证码"
                >
                  <i slot="prefix" class="icon icon_code"></i>
                </el-input>
                <img :src="byteArrayImg" alt="" @click="reGetImg"  style="max-width:120px">
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="isRemember">记住用户名</el-checkbox>
                  <span @click="switchComposeType('1')">验证码登录</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
          <template v-else>
            <el-form ref="managerLoginCodeForm" :model="managerLoginCodeForm" :rules="managerLoginCodeFormRules" key="managerLoginCodeForm">
              <el-form-item prop="account">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="managerLoginCodeForm.account"
                  placeholder="请输入手机号"
                >
                  <i slot="prefix" class="icon icon_account"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="validateCode">
                <el-input
                  @keyup.native.enter="loginSubmit"
                  v-model.trim="managerLoginCodeForm.validateCode"
                  maxlength="6"
                  placeholder="请输入验证码"
                >
                  <i slot="prefix" class="icon icon_code"></i>
                  <span slot="append" class="inline_button" @click="beforeGetValidateCode" prefix-icon="el-icon-s-claim">获取验证码</span>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="remember_box">
                  <el-checkbox v-model="isRemember">记住手机号</el-checkbox>
                  <span @click="switchComposeType('2')">密码登陆</span>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </template>
        <el-button class="login_button" @click="loginSubmit" :loading="loginBtnLoading">立即登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePhone, validatePwd, validateCode } from '@/utils/validator.js'
import {
	// login,
	loginNew,
	getPublicKey,
	imgValidateCode,
	getValidateCode,
} from '@/views/index/api/eas/api.eas.js'
import { querySortList } from '@/views/index/api/onDuty/api.ps.js'
import { getAuthResourcesById } from '@/views/index/api/onDuty/api.yy.js'
import {
	getByDictType,
	getCurrentUserWarehouseList,
} from '@/views/index/api/supplies/api.yy.js'
import { getLowUint } from '@/views/index/api/onDuty/api.zr.js'
import { weakPassword } from '@/views/index/api/onDuty/api.common.js'
import { proKey } from '@/config/config.js'
import _debounce from 'lodash/debounce'
import _remove from 'lodash/remove'

export default {
	name: 'Login',
	data() {
		return {
			resourceData: require('@/mock/data/supplies/resource.json'),
			firstLevel: false,
			lastLevel: false,
			loginType: '2', // 1-管理员 2-普通用户
			composeType: '2', // 1-短信验证码登录 2-账号密码登录
			byteArrayImg: '',
			loginForm: {
				account: '', // 用户名
				userMobile: '',
				userPassword: '',
				imgValidateCode: '',
				imgUid: '',
				proKey: proKey,
			},
			loginBtnLoading: false,
			isRemember: false, // 是否记住用户名
			userLoginPsdFormRules: {
				account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ validator: validatePwd, trigger: 'blur' },
				],
				imgValidateCode: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
				],
			},
			userLoginCodeFormRules: {
				account: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ validator: validatePhone, trigger: 'blur' },
				],
				validateCode: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
					{ validator: validateCode, trigger: 'blur' },
				],
			},
			managerLoginPsdFormRules: {
				account: [
					{ required: true, message: '请输入用户名或卡号', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ validator: validatePwd, trigger: 'blur' },
				],
				imgValidateCode: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
				],
			},
			managerLoginCodeFormRules: {
				account: [
					{ required: true, message: '请输入手机号码', trigger: 'blur' },
					{ validator: validatePhone, trigger: 'blur' },
				],
				validateCode: [
					{ required: true, message: '请输入手机验证码', trigger: 'blur' },
					{ validator: validateCode, trigger: 'blur' },
				],
			},
			pwdShow: false,
			JSEncryptKey: '',
			userLoginPsdForm: {
				account: '', // 用户名
				password: '',
				imgValidateCode: '',
				imgUid: '',
			},
			userLoginCodeForm: {
				account: '',
				validateCode: '',
			},
			managerLoginPsdForm: {
				account: '',
				password: '',
				imgValidateCode: '',
				imgUid: '',
			},
			managerLoginCodeForm: {
				account: '',
				validateCode: '',
			},
		}
	},
	computed: {
		curFormName() {
			return `${this.loginType === '2' ? 'user' : 'manager'}Login${
				this.composeType === '2' ? 'Psd' : 'Code'
			}Form`
		},
	},
	created() {
		this.byteImg()
		this.getPublicKey()
		if (localStorage.getItem('loginType')) {
			const { loginType, composeType } = JSON.parse(
				localStorage.getItem('loginType')
			)
			this.loginType = loginType
			this.composeType = composeType
		}
		if (localStorage.getItem('rememberAccount')) {
			this[this.curFormName].account = localStorage.getItem('rememberAccount')
			this.isRemember = true
		} else {
			this.isRemember = false
		}
		this.$nextTick(() => {
			this.$refs[this.curFormName].clearValidate()
		})
		localStorage.removeItem('admin_initialPasswordFlag')
		localStorage.removeItem('admin_Pwd')
	},
	methods: {
		//查询当前单位是否有下级单位
		getLowUint(d) {
			getLowUint(d)
				.then(res => {
					if (res && res.code === '00000000') {
						if (res.data && res.data.length == 0) {
							this.lastLevel = true
						}
					}
				})
				.catch(e => {
					console.error('error', e)
				})
		},
		async getValidateCode() {
			const userMobile = this[this.curFormName].account
			const params = {
				msgType: 6,
				proKey: proKey,
				userMobile,
			}
			try {
				const { code } = await getValidateCode(params)
				if (code === '00000000') {
					this.$message({
						message: '短信验证码已发送至您的手机',
					})
				}
			} catch (err) {
				console.log(err)
			}
		},
		beforeGetValidateCode() {
			this.$refs[this.curFormName].validateField('account', valid => {
				if (valid) {
					this.$message({
						type: 'error',
						message: '手机号码不能为空！',
					})
					return false
				}
				this.getValidateCode()
			})
		},
		// 切换登录用户类型
		switchLoginType(type) {
			if (this.loginType !== type) this.loginType = type
			this.$nextTick(() => {
				this.byteImg()
				this.$refs[this.curFormName].clearValidate()
			})
		},
		// 切换登录类型
		switchComposeType(type) {
			if (this.composeType !== type) this.composeType = type
			this.$nextTick(() => {
				this.byteImg()
				this.$refs[this.curFormName].clearValidate()
			})
		},
		getPublicKey() {
			getPublicKey().then(res => {
				if (res && res.code == '00000000') {
					this.JSEncryptKey = res.data
				}
			})
		},
		reGetImg() {
			this.byteImg()
		},
		byteImg() {
			let params = {
				proKey: proKey,
			}
			imgValidateCode(params).then(res => {
				this[this.curFormName].imgUid = res.data.imgUid
				this.byteArrayImg = 'data:image/png;base64,' + res.data.byteArray
			})
		},
		remember(flag) {
			if (flag) {
				localStorage.setItem('remberPhone', this.loginForm.userMobile)
			} else {
				localStorage.removeItem('remberPhone')
			}
		},
		loginSubmit: _debounce(function() {
			// console.log('12346589');

			// 当前登录方式存入本地缓存
			const type = {
				composeType: this.composeType,
				loginType: this.loginType,
			}
			localStorage.setItem('loginType', JSON.stringify(type))
			localStorage.setItem('rememberAccount', this[this.curFormName].account)
			// 密码登录刷新验证码图片
			if (this.composeType === '2') this.byteImg()
			this.$refs[this.curFormName].validate(valid => {
				if (valid) {
					this.validateSuccess()
				}
			})
		}, 100),
		async validateSuccess() {
			this.loginBtnLoading = true
			try {
				// 登陆中 登录按钮不可用
				let encrypt = new window.JSEncrypt()
				encrypt.setPublicKey(this.JSEncryptKey)
				const formName = this.curFormName
				let params = {
					account: this[formName].account,
					composeType: this.composeType,
					imgValidateCode: this[formName].imgValidateCode || '',
					imgUid: this[formName].imgUid || '',
					loginType: this.loginType,
					password: encrypt.encrypt(this[formName].password || ''),
					validateCode: this[formName].validateCode || '',
				}
				const { code, data } = await loginNew(params)
				if (code === '00000000') {
          this.getCurrentUserWarehouseList()
					localStorage.setItem('vis_user_info', JSON.stringify(data))
					sessionStorage.setItem('duty_userId', data.uid)
					if (data.rmsUnitDto) {
						if (!data.rmsUnitDto.parentUid) {
							this.firstLevel = true
						}
						this.getLowUint({
							parentUid: data.dutyUserInfo.unitUid,
							unitType: 1,
						})
					}
					setTimeout(() => {
						this.getLimitList(data)
					}, 200)
					if (this.composeType === '2') {
						this.weakword(data)
					}
				} else {
					this.loginBtnLoading = false
				}
				localStorage.removeItem('ChildrenNum')
				if( JSON.parse(localStorage.getItem('vis_user_info')).rmsUnitDto){
					let cparams = {
						parentUid: JSON.parse(localStorage.getItem('vis_user_info'))
							.rmsUnitDto.uid,
						unitType: 1,
					}
					querySortList(cparams)
						.then(res => {
							if (res && res.code === '00000000') {
								if (res.data && res.data.length > 0) {
									localStorage.setItem('ChildrenNum', res.data.length)
								}
							}
						})
						.catch(error => {
							console.log('接口报错=>', error)
						})
				}
			} catch (error) {
				console.log(error)
				this.loginBtnLoading = false
			}
		},
		async getLimitList({ uid, proKey }) {
			// async getLimitList() {
			try {
				const params = {
					userId: uid,
					proKey,
					platformType: this.loginType === '2' ? 1 : 2,
				}
				const { code, data } = await getAuthResourcesById(params)
				// const { code, data } = this.resourceData;
				if (code === '00000000') {
					//判断当前登录用户 所属单位是否是最顶级 以级是否是最下级
					let newJson = []
					//没有下级
					let noLower = [
						'issueNotice',
						'querryNotice',
						'receiveDutyInformation',
						'alreadyBackInfo',
						'queryInstructHairdown',
					]
					//没有上级
					let noSuper = [
						'receiveNotice',
						'updateDutyInformation',
						'acceptLeaderInstructions',
						'queryInstructFeedback',
					]
					if (this.firstLevel && this.lastLevel) {
						newJson = data.filter(
							el =>
								el.resourceLayer == 1 ||
								(noLower.indexOf(el.routeName) == -1 &&
									noSuper.indexOf(el.routeName) == -1)
						)
					} else if (this.firstLevel) {
						newJson = data.filter(
							el => el.resourceLayer == 1 || noSuper.indexOf(el.routeName) == -1
						)
					} else if (this.lastLevel) {
						newJson = data.filter(
							el => el.resourceLayer == 1 || noLower.indexOf(el.routeName) == -1
						)
					} else {
						newJson = data
					}
					// 过滤没有配置路由name的数据
					_remove(newJson, ({ routeName }) => !routeName)
					localStorage.setItem('permission', JSON.stringify(newJson))
					let _permissions = data
					// if (!_permissions || _permissions.length < 1) {
					// 	this.$message.error(
					// 		'该账号未分配角色，无法进入系统，请联系管理员！'
					// 	)
					// 	return false
					// }
					this.$message.success('登录成功')
					this.getDictTypeData()
					console.log('_permissions',_permissions);
					
					this.$router.push({ name: _permissions[0].routeName })
				}
			} catch (err) {
				console.log(err)
			}
			this.loginBtnLoading = false
		},
		async getDictTypeData() {
			const { code, data } = await getByDictType({ dictType: null })
			if (code === '00000000' && data) {
				localStorage.setItem('dic_type', JSON.stringify(data))
			}
		},
		async weakword(data) {
			let encrypt = new window.JSEncrypt()
			encrypt.setPublicKey(this.JSEncryptKey)
			const formName = this.curFormName
			let weakparams = {
				userPassword: encrypt.encrypt(this[formName].password || ''),
				proKey: data.proKey,
				sid: data.sessionId,
			}
			weakPassword(weakparams).then(response => {
				localStorage.setItem('admin_initialPasswordFlag', response.data)
			})
    },
    async getCurrentUserWarehouseList() {
			const { code, data } = await getCurrentUserWarehouseList()
			if (code === '00000000' && data) {
				localStorage.setItem('current_user_warehouse_list', JSON.stringify(data))
			}
		},
	},
}
</script>

<style lang='scss'>
.login {
	width: 100vw;
	height: 100vh;
	background: url('../../../assets/img/login_bg.png') center no-repeat;
	background-size: cover;
	background-attachment: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
}
.title_img {
	width: 400px;
}
.main {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.content {
	width: 500px;
	height: 590px;
	margin-top: 60px;
	padding: 50px 80px 90px;
	background: url('../../../assets/img/content_bg.png') no-repeat;
	background-size: 100% 100%;
	.welcome {
		text-align: center;
		font-size: 34px;
		font-family: 'Source Han Sans CN';
		font-weight: 400;
		color: #fff;
	}
	.tabs {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-top: 40px;
		margin-bottom: 20px;
		.tab {
			cursor: pointer;
			font-size: 14px;
			font-family: 'Microsoft YaHei';
			font-weight: bold;
			color: #b39af5;
			&.actived {
				font-size: 16px;
				color: #fff;
			}
		}
	}
	.el-form {
		.el-form-item__content {
			display: flex;
			align-items: center;
			img {
				cursor: pointer;
				margin-left: 13px;
				height: 50px;
				border-radius: 8px;
			}
		}
		.el-input__inner {
			padding-left: 75px;
			height: 50px;
			border-radius: 8px;
			color: #333;
		}
		// .el-input__prefix {
		//   left: 25px;
		//   font-size: 25px;
		//   color: #4b43d3;
		//   i {
		//     line-height: 50px;
		//   }
		// }
		.el-input-group--append {
			.el-input__inner {
				border-radius: 8px 0 0 8px;
				border-right: none;
				&:hover ~ .el-input-group__append {
					border: 1px solid #5458fd;
					border-left: none;
				}
			}
			.el-input-group__append {
				color: #1e128d;
				cursor: pointer;
				border-radius: 0 8px 8px 0;
				background-color: #fff;
			}
		}
		.remember_box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			.el-checkbox__label {
				color: #fff;
			}
			span {
				cursor: pointer;
			}
		}
		.el-input__prefix {
			left: 25px;
			top: 13px;
		}
		.icon {
			width: 25px;
			height: 25px;
			display: inline-block;
		}
		.icon_account {
			background: url('../../../assets/img/l_account.png') no-repeat;
		}
		.icon_password {
			background: url('../../../assets/img/l_password.png') no-repeat;
		}
		.icon_code {
			background: url('../../../assets/img/l_code.png') no-repeat;
		}
	}
	.login_button {
		width: 100%;
		height: 50px;
		background-image: linear-gradient(#dde4ff 0%, #b4aeff 100%);
		color: #1e128d;
		border-radius: 8px;
		font-size: 22px;
		font-family: 'Source Han Sans CN';
		font-weight: 400;
	}
}
</style>
