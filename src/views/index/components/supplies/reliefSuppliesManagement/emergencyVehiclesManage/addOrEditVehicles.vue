<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <el-scrollbar style="height:100%;">
      <div class="common_content">
        <div class="main_container_flex">
          <el-form
            :model="vehicleInfo"
            :rules="formRule"
            ref="vehicleInfo"
            label-width="120px"
            inline
          >
            <el-row class="title">基本信息</el-row>
            <div class="formcl">
              <el-form-item
                label-width="120px"
                label="车牌号码"
                prop="licenseNumber"
              >
                <el-input
                  placeholder="请输入车牌号码"
                  style="width:300px"
                  v-model.trim="vehicleInfo.licenseNumber"
                  maxlength="10"
                ></el-input>
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="车辆类型"
                prop="vehicleTypeFlag"
              >
                <el-select
                  placeholder="请选择车辆类型"
                  style="width:300px"
                  v-model="vehicleInfo.vehicleTypeFlag"
                >
                  <el-option
                    v-for="item in vehicleTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="号牌种类"
                prop="licenseFlag"
              >
                <el-select
                  placeholder="请选择号牌种类"
                  style="width:300px"
                  v-model="vehicleInfo.licenseFlag"
                >
                  <el-option
                    v-for="item in licenseFlagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="120px" label="核载人数" prop="loads">
                <el-input
                  placeholder="请输入核载人数"
                  style="width:300px"
                  v-model="vehicleInfo.loads"
                ></el-input>
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="车身颜色"
                prop="colourFlag"
              >
                <el-select
                  placeholder="请选择车身颜色"
                  style="width:300px"
                  v-model="vehicleInfo.colourFlag"
                >
                  <el-option
                    v-for="item in colourFlagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label-width="120px" label="所属单位" prop="orgName">
                <!-- <el-input
                    placeholder="请输入所属单位"
                    style="width:300px"
                    v-model.trim="vehicleInfo.orgName"
                    ></el-input> -->
                <el-select
                  maxlength="20"
                  v-model="vehicleInfo.orgName"
                  style="width:300px"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入所属单位"
                >
                  <el-option
                    v-for="item in orgNameList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="责任人姓名"
                prop="principal"
              >
                <el-input
                  placeholder="请输入责任人姓名"
                  style="width:300px"
                  v-model.trim="vehicleInfo.principal"
                ></el-input>
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="联系电话"
                prop="contactPhone"
              >
                <el-input
                  placeholder="请输入责任人联系电话"
                  style="width:300px"
                  v-model.trim="vehicleInfo.contactPhone"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="停放地址"
                style="width: 100%;display:flex;"
                prop="parkingPosition"
              >
                <el-input
                  type="text"
                  placeholder="请选择停放位置"
                  v-model.trim="vehicleInfo.parkingPosition"
                  style="width:300px"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-map-location"
                    @click="showMap"
                  ></i>
                </el-input>
              </el-form-item>
              <el-row>
                <el-form-item label="车辆图片" prop="attachmentList">
                  <el-upload
                    class="upload-doc"
                    action="#"
                    :before-upload="beforeUploadDocument"
                    :on-exceed="onExceedDocument"
                    :http-request="uploadAvatar"
                    with-credentials
                    :on-remove="onRemoveDocument"
                    :limit="1"
                    :file-list="fileList"
                    :before-remove="beforeRemoveFile"
                    multiple
                    :accept="acceptFile"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">
                      最多1张，大小不超过10M，支持JPG、GIF、PNG等格式
                    </div>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-form-item class="tarea" label="适用领域" label-width="120px">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请描述车辆的适用领域或特殊用途"
                  maxlength="100"
                  style="width:92%;"
                  v-model.trim="vehicleInfo.field"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="bottom-btn">
          <el-button @click="goback">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </el-scrollbar>
    <div
      is="mapPoint"
      @mapPointSubmit="mapPointSubmit"
      :open="open"
      :oConfig="oConfig"
    ></div>
  </div>
</template>
<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import {
  getDicts,
  addVehicle,
  editVehicle,
  getVehicleDetail,
  pictureUpload,
  getOrgName,
  fileUrl,
  checkUniqueness,
} from '@/views/index/api/supplies/api.xy.js'
import { checkLoads, valiPhone, checkChineseName } from '@/utils/validator'
import { ajaxCtx } from '@/config/config.js'
import _cloneDeep from 'lodash/cloneDeep'
import mapPoint from '@/components/common/mapPoint.vue'
export default {
  components: { visBreadcrumb, mapPoint },
  props: {
    flag: '',
    uid: '',
  },
  data() {
    const that = this
    const checkLicenseNumber = async (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value !== that.initialData.licenseNumber) {
        const params = {
          checkStr: this.vehicleInfo.licenseNumber,
          type: 6,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('车牌号码已存在。')
        }
        return callback()
      }
      callback()
    }
    return {
      open: false,
      oConfig: {},
      breadcrumbData: [
        { name: '救援资源' },
        { name: '应急车辆', routerName: 'emergencyvehicleslist' },
      ],
      vehicleInfo: {
        attachmentList: [],
        contactPhone: '',
        uid: '',
        vehicleCode: '',
        licenseNumber: '',
        vehicleTypeFlag: '',
        licenseFlag: '大型汽车号牌',
        loads: null,
        colourFlag: '',
        orgName: '',
        principal: '',
        parkingPosition: '',
        longitude: '',
        latitude: '',
        field: '',
        vehicleStatusFlagName: '',
      },
      orgNameList: [],
      attachmentList: [],
      colourFlagList: [],
      vehicleStatusList: [],
      vehicleTypeList: [],
      licenseFlagList: [
        {
          value: '1',
          label: '大型汽车号牌',
        },
        {
          value: '2',
          label: '小型汽车号牌',
        },
      ],
      downFile: ajaxCtx.rel + '/muem/resource/rescue-service/import',
      fileList: [],
      upLoadSuccess: false,
      fileLoading: false,
      successInfo: {},
      initialData: {},
      faildInfo: null,
      acceptFile: '.jpg,.gif,.png',
      uploadUrl: fileUrl,
      formRule: {
        licenseNumber: [
          { required: true, message: '请输入车牌号码', trigger: 'blur' },
          { validator: checkLicenseNumber, trigger: 'blur' },
        ],
        vehicleTypeFlag: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' },
        ],
        licenseFlag: [
          { required: true, message: '请选择号牌种类', trigger: 'change' },
        ],
        colourFlag: [
          { required: true, message: '请选择车身颜色', trigger: 'change' },
        ],
        orgName: [{ required: true, message: '请输入所属单位', trigger: 'change' }],
        principal: [
          { required: true, message: '请输入责任人姓名', trigger: 'blur' },
          { validator: checkChineseName, trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, message: '请输入责任人联系电话', trigger: 'blur' },
          { validator: valiPhone, trigger: 'blur' },
        ],
        parkingPosition: [
          { required: true, message: '请选择停放位置', trigger: 'change' },
        ],
        loads: [{ validator: checkLoads, trigger: 'blur' }],
      },
    }
  },
  created() {
    this.init()
    if (this.isEdit) {
      this.getVehicleDetail()
    }
  },
  computed: {
    isEdit() {
      return this.flag === 'edit'
    },
  },
  mounted() {},
  methods: {
    init() {
      this.breadcrumbData.push({
        name: `${this.isEdit ? '编辑' : '新增'}应急车辆详情`,
      })
      this.getVehicleType()
      this.getcolourFlag()
      this.getOrgName()
    },
    getVehicleDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      getVehicleDetail(params).then((res) => {
        this.vehicleInfo = res.data
        this.initialData = _cloneDeep(res.data)
        this.oConfig.center = [this.vehicleInfo.longitude,this.vehicleInfo.latitude,]
        this.oConfig._name = this.vehicleInfo.parkingPosition
        this.attachmentList = this.vehicleInfo.attachmentList
        this.vehicleInfo.attachmentList.forEach((el) => {
          this.fileList.push({
            name: el.originalFileName,
            url: el.fileFullPath,
          })
        })
        console.log(this.vehicleInfo)
      })
    },

    buildParams() {
      const params = _cloneDeep(this.vehicleInfo)
      params.attachmentList = this.attachmentList
      if(params.vehicleTypeFlag == '应急指挥车'){
        params.vehicleTypeFlag= "1"
        params.vehicleTypeFlagName = '应急指挥车'
      }
      if(this.vehicleInfo.licenseFlag == '大型汽车号牌'){
        params.licenseFlag = "1"
        params.licenseFlagName == '大型汽车号牌'
      }
      return params
    },
    onSubmit() {
      this.$refs['vehicleInfo'].validate((valid) => {
        if (valid) {
          this.validateSuccess()
        }
      })
    },
    // 校验通过后调接口
    async validateSuccess() {
      try {
        const params = this.buildParams()
        const { code } = await (this.isEdit
          ? editVehicle(params)
          : addVehicle(params))
        if (code === '00000000') {
          this.$message({
            type: 'success',
            message: `${this.isEdit ? '修改' : '新建'}应急车辆成功`,
          })
          // 回到列表页
          this.goback()
        }
      } catch (error) {
        console.log(error)
      }
    },

    // 点击返回

    // 回退
    goback() {
      this.$router.back(-1)
    },

    //删除上传的文件前处理方法
    beforeRemoveFile(file) {
      let index = this.fileList.findIndex(
        (el) => el.name == file.name && el.url == file.url
      )
      let a = this.attachmentList.findIndex(
        (el) => el.originalFileName == file.name && el.fileFullPath == file.url
      )
      this.fileList.splice(index, 1)
      this.attachmentList.splice(a, 1)
    },
    //上传文件时大小控制
    beforeUploadDocument(file) {
      let isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = this.acceptFile.indexOf(testmsg)
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (extension == -1) {
        this.$message({
          message: '请上传正确文件格式!',
          type: 'warning',
        })
      }
      return isLt10M && extension != -1
    },
    //上传文件时数量控制
    onExceedDocument() {
      this.$message.warning('最多可上传1个文件')
    },
    //文件上传提交到后端
    uploadAvatar(item) {
      this.imgLoading = true // 打开加载效果
      const formData = new FormData()
      formData.append('file', item.file)
      pictureUpload(formData)
        .then((res) => {
          this.imgLoading = false
          if (res && res.code == '00000000') {
            if (res.data.length > 0) {
              res.data.map((item, index) => {
                let unit = {}
                //判断是否为IE浏览器的文件名，IE浏览器下文件名会带有盘符信息
                // Check for Unix-style path
                let unixSep = item.originalFileName.lastIndexOf('/')
                // Check for Windows-style path
                let winSep = item.originalFileName.lastIndexOf('\\')
                // Cut off at latest possible point
                let pos = winSep > unixSep ? winSep : unixSep
                if (pos != -1) {
                  // Any sort of path separator found...
                  item.originalFileName = item.originalFileName.substring(
                    pos + 1
                  )
                }
                unit.uid = index
                unit.url = item.fileFullPath
                unit.name = item.originalFileName
                this.fileList.push(unit)
                this.attachmentList.push(item)
              })
            }
          } else {
            this.$message.error('上传失败，请重新上传')
          }
        })
        .catch(() => {
          this.imgLoading = false
          if (this.fileList.length == 0) {
            this.fileList = []
          } else {
            let ars = JSON.stringify(this.fileList)
            this.fileList = JSON.parse(ars)
          }
        })
    },
    //删除文件列表时的相关操作
    onRemoveDocument() {
      //查询操作文件，并在列表内删除当前文件
    },
    mapPointSubmit(lal, addressInfo) {
      this.vehicleInfo.parkingPosition = addressInfo
      this.vehicleInfo.longitude = lal.split(',')[0]
      this.vehicleInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      this.open = !this.open
    },
    //获取车辆类型
    getVehicleType() {
      let params = {
        dictType: '7',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let vehicleTypeFlag = {}
                vehicleTypeFlag.label = item.dictValue
                vehicleTypeFlag.value = item.dictKey
                this.vehicleTypeList.push(vehicleTypeFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.vehicleInfo.vehicleTypeFlag = '应急指挥车'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取车身颜色
    getcolourFlag() {
      let params = {
        dictType: '32',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let colourFlag = {}
                colourFlag.label = item.dictValue
                colourFlag.value = item.dictKey
                this.colourFlagList.push(colourFlag)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取所属单位
    getOrgName() {
      getOrgName().then((res) => {
        if (res && res.code === '00000000') {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              this.orgNameList.push(item)
            })
          }
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.formcl {
  display: flex;
  flex-wrap: wrap;
  margin-top: 17px;
  margin-left: -10px;
}
.tarea {
  width: 85%;
  /deep/ .el-form-item__content {
    width: 85%;
  }
}
.title {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
