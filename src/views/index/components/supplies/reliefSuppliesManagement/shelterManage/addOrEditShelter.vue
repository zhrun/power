<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <el-scrollbar style="height:100%;">
      <div class="common_content">
        <div class="main_container_flex">
          <el-form
            :model="shelterInfo"
            :rules="formRule"
            ref="shelterInfo"
            label-width="120px"
            inline
          >
            <el-row class="title">基本信息</el-row>
            <el-row>
              <div class="formcl">
                <el-form-item
                  label-width="120px"
                  label="场所名称"
                  prop="placeName"
                >
                  <el-input
                    placeholder="请输入避难场所名称"
                    style="width:300px"
                    v-model.trim="shelterInfo.placeName"
                    maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="场所类型"
                  prop="placeFlag"
                >
                  <el-select
                    placeholder="请选择场所类型"
                    style="width:300px"
                    v-model.trim="shelterInfo.placeFlag"
                  >
                    <el-option
                      v-for="item in placeFlagList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label-width="120px" label="面积" prop="areaSize">
                  <el-input
                    placeholder="请输入面积(平方米)"
                    style="width:300px"
                    v-model="shelterInfo.areaSize"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="容纳人数"
                  prop="capacity"
                >
                  <el-input
                    placeholder="请输入人数"
                    style="width:300px"
                    v-model="shelterInfo.capacity"
                  ></el-input>
                </el-form-item>
                <el-form-item label-width="120px" label="建设日期">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    style="width:300px;"
                    v-model="shelterInfo.buildTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="所属单位"
                  prop="affiliatedUnit"
                >
                  <el-input
                    placeholder="请输入所属单位"
                    style="width:300px"
                    v-model.trim="shelterInfo.affiliatedUnit"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="联系人姓名"
                  prop="contactName"
                >
                  <el-input
                    placeholder="请输入联系人姓名"
                    style="width:300px"
                    maxlength="10"
                    v-model.trim="shelterInfo.contactName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="办公电话"
                  prop="officePhone"
                >
                  <el-input
                    placeholder="请输入办公电话"
                    style="width:300px"
                    maxlength="13"
                    v-model="shelterInfo.officePhone"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="常住地址"
                  prop="position"
                  style="width:100%;"
                >
                  <el-input
                    type="text"
                    placeholder="请选择位置"
                    v-model.trim="shelterInfo.position"
                    style="width:300px"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-map-location"
                      @click="showMap"
                    ></i>
                  </el-input>
                </el-form-item>
                <el-form-item label="选择图片" prop="attachmentList" v-loading="imgLoading">
                  <el-upload
                    class="upload-doc"
                    action="#"
                    :before-upload="beforeUploadDocument"
                    :on-exceed="onExceedDocument"
                    :http-request="uploadAvatar"
                    with-credentials
                    :on-remove="handleRemove"
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
                <el-form-item
                  class="tarea"
                  label-width="120px"
                  label="配套设施"
                >
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请描述场所的配套设施或功能布局等"
                    style="width:85%;"
                    v-model.trim="shelterInfo.supportingFacilities"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item class="tarea" label="备注" label-width="120px">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请备注相关信息"
                    style="width:85%;"
                    v-model.trim="shelterInfo.remark"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </div>
            </el-row>
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
  addShelter,
  editShelter,
  getShelterDetail,
  fileUrl,
  pictureUpload,
} from '@/views/index/api/supplies/api.xy.js'
import {
  checkAreaSize,
  checkName,
  checkCapacity,
  checkTelOrPhone,
} from '@/utils/validator'
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
    return {
      open: false,
      oConfig: {},
      breadcrumbData: [
        { name: '救援资源' },
        { name: '避难场所', routerName: 'shelterlist' },
      ],
      shelterInfo: {
        attachmentList: [],
        affiliatedUnit: '',
        areaSize: '',
        buildTime: '',
        capacity: '',
        contactName: '',
        latitude: '',
        longitude: '',
        officePhone: '',
        placeCode: '',
        placeFlag: '',
        placeFlagName: '',
        placeName: '',
        position: '',
        remark: '',
        supportingFacilities: '',
        uid: '',
      },
      downFile: ajaxCtx.rel + '/muem/resource/rescue-service/import',
      fileList: [],
      attachmentList: [],
      upLoadSuccess: false,
      fileLoading: false,
      imgLoading:false,
      successInfo: {},
      placeFlagList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      faildInfo: null,
      uploadUrl: fileUrl,
      acceptFile: '.jpg,.gif,.png',
      formRule: {
        placeName: [
          { required: true, message: '请输入场所名称', trigger: 'blur' },
        ],
        placeFlag: [
          { required: true, message: '请选择场所类型', trigger: 'change' },
        ],
        areaSize: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          { validator: checkAreaSize, trigger: 'blur' },
        ],
        capacity: [
          { required: true, message: '请输入人数', trigger: 'blur' },
          { validator: checkCapacity, trigger: 'blur' },
        ],
        affiliatedUnit: [
          { required: true, message: '请输入所属单位', trigger: 'blur' },
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
        ],
        officePhone: [
          { required: true, message: '请输入办公电话', trigger: 'blur' },
          { validator: checkTelOrPhone, trigger: 'blur' },
        ],
        position: [
          { required: true, message: '请选择位置', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.breadcrumbData.push({
      name: `${this.isEdit ? '编辑' : '新增'}避难场所详情`,
    })
    this.getPlace()
    if (this.isEdit) {
      this.getShelterDetail()
    }
  },
  computed: {
    isEdit() {
      return this.flag === 'edit'
    },
  },
  mounted() {},
  methods: {
    getShelterDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      getShelterDetail(params).then((res) => {
        this.shelterInfo = res.data
        this.oConfig.center = [this.shelterInfo.longitude,this.shelterInfo.latitude,]
        this.attachmentList = this.shelterInfo.attachmentList
        this.oConfig._name = this.shelterInfo.position
          this.shelterInfo.attachmentList.forEach((el) => {
            this.fileList.push({
              name: el.originalFileName,
              url: el.fileFullPath,
            })
          })
      })
    },

    //获取场所
    getPlace() {
      let params = {
        dictType: '9',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let placeFlag = {}
                placeFlag.label = item.dictValue
                placeFlag.value = item.dictKey
                this.placeFlagList.push(placeFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.shelterInfo.placeFlag = '固定避难场所'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    buildParams() {
      const params = _cloneDeep(this.shelterInfo)
      params.attachmentList = this.attachmentList
      if(params.placeFlag == '固定避难场所'){
        params.placeFlag = "2"
        params.placeFlagName = '固定避难场所'
      }
      return params
    },
    onSubmit() {
      this.$refs['shelterInfo'].validate((valid) => {
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
          ? editShelter(params)
          : addShelter(params))
        //  ? addResource(params)
        // : editResource(params));
        if (code === '00000000') {
          this.$message({
            type: 'success',
            message: `${this.isEdit ? '修改' : '新建'}避难场所成功`,
          })
          // 回到列表页
          this.goback()
        }
      } catch (error) {
        console.log(error)
      }
    },

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
    // handleRemove(file, fileList) {
    //   let edata = []
    //   for (let i = 0; i < fileList.length; i++) {
    //     if (fileList[i].response) {
    //       edata.push(fileList[i].response.data)
    //     } else {
    //       edata.push(fileList[i])
    //     }
    //   }
    //   this.shelterInfo.attachmentList = edata
    // },
     handleRemove() {
     },

    mapPointSubmit(lal, addressInfo) {
      this.shelterInfo.position = addressInfo
      this.shelterInfo.longitude = lal.split(',')[0]
      this.shelterInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      // this.oConfig.center= [this.shelterInfo.longitude, this.shelterInfo.latitude],
      this.open = !this.open
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
