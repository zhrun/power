<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <div class="main_container_flex">
          <el-row class="title">基本信息</el-row>
          <el-form
            :model="professorForm"
            :rules="rules"
            ref="professorForm"
            label-width="120px"
            inline
          >
            <el-form-item label="专家姓名" class="fl-unit" prop="expertName">
              <el-input
                type="text"
                placeholder="请输入名称(注:名称唯一)"
                v-model="professorForm.expertName"
                maxlength="20"
                style="width:300px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="专家性别"
              class="fl-unit"
              style="width:420px"
              label-width="120px"
              prop="sex"
            >
              <el-radio v-model="professorForm.sex" label="1">男</el-radio>
              <el-radio v-model="professorForm.sex" label="2">女</el-radio>
              <!-- <el-radio v-model="professorForm.sex" :label="`${this.sexList[0].value}`">男</el-radio>
            <el-radio v-model="professorForm.sex" :label="`${this.sexList[1].value}`">女</el-radio> -->
            </el-form-item>

            <el-form-item label-width="120px" label="出生日期">
              <el-date-picker
                type="date"
                placeholder="年/月/日"
                style="width:300px;"
                v-model="professorForm.birthday"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>

            <el-form-item
              label="政治面貌"
              class="fl-unit"
              label-width="120px"
              prop="politicalFlag"
            >
              <el-select
                v-model="professorForm.politicalFlag"
                placeholder="请选择政治面貌"
                style="width:300px"
              >
                <el-option
                  v-for="item in politicalStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label-width="120px"
              label="办公电话"
              prop="officeCode"
            >
              <el-input
                placeholder="区号"
                style="width:90px;"
                v-model.trim="professorForm.officeCode"
              ></el-input>
            </el-form-item>
            <span
              style="display:inline-block;width:10px;height:2px;margin-top:20px;margin-left: -20px;background:black;"
            ></span>
            <el-form-item prop="officePhone">
              <el-input
                placeholder="请输入联系电话"
                style="width:200px;"
                v-model.trim="professorForm.officePhone"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号码"
              class="fl-unit"
              label-width="120px"
              prop="phoneNumber"
            >
              <el-input
                type="text"
                placeholder="请输入专家手机号码"
                v-model.trim="professorForm.phoneNumber"
                maxlength="20"
                style="width:300px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="邮箱"
              class="fl-unit"
              label-width="120px"
              prop="email"
            >
              <el-input
                type="text"
                placeholder="请输入联系邮箱"
                v-model.trim="professorForm.email"
                ref="email"
                style="width:300px"
              ></el-input>
            </el-form-item>

            <el-form-item label="毕业院校" class="fl-unit" label-width="120px">
              <el-input
                type="text"
                placeholder="请输入毕业院校名称"
                maxlength="100"
                v-model.trim="professorForm.graduatedSchool"
                style="width:300px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="最高学历"
              class="fl-unit"
              label-width="120px"
              prop="educationFlag"
            >
              <el-select
                placeholder="请选择学历"
                style="width:300px"
                v-model="professorForm.educationFlag"
                label-width="120px"
              >
                <el-option
                  v-for="item in educationList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="常住地址"
              prop="address"
              style="display:flex;"
              label-width="120px"
            >
              <el-input
                type="text"
                placeholder="请选择位置"
                v-model.trim="professorForm.address"
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
              <el-form-item class="tarea" label="个人简介" label-width="120px">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请完善个人简介"
                  maxlength="100"
                  style="width:85%;"
                  v-model.trim="professorForm.personalProfile"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item
                label="选择图片"
                prop="attachmentList"
                label-width="120px"
                v-loading="imgLoading"
              >
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
                  :show-file-list="true" 
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
            <!-- <p class="content-t">工作信息</p> -->
            <div class="gray_line"></div>
            <div class="title">工作信息</div>

            <el-form-item
              label="工作单位"
              class="fl-unit"
              label-width="120px"
              prop="company"
            >
              <el-input
                type="text"
                v-model.trim="professorForm.company"
                style="width:300px"
                maxlength="100"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="职称"
              class="fl-unit"
              label-width="120px"
              prop="jobTitleFlag"
            >
              <el-select
                v-model="professorForm.jobTitleFlag"
                placeholder="请选择"
                style="width:300px"
              >
                <el-option
                  v-for="item in jobTitleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="职务" class="fl-unit" label-width="120px">
              <el-select
                v-model="professorForm.position"
                placeholder="请选择"
                style="width:300px"
              >
                <el-option
                  v-for="item in positionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="所属领域"
              class="fl-unit"
              label-width="120px"
              prop="belongingFieldFlag"
            >
              <el-select
                v-model="professorForm.belongingFieldFlag"
                placeholder="请选择"
                style="width:300px"
              >
                <el-option
                  v-for="item in belongingFieldList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="专家级别"
              class="fl-unit"
              label-width="120px"
              prop="expertLevelFlag"
            >
              <el-select
                v-model="professorForm.expertLevelFlag"
                placeholder="请选择"
                style="width:300px"
              >
                <el-option
                  v-for="item in expertLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="专家类别"
              class="fl-unit"
              label-width="120px"
              prop="expertCategoryFlag"
            >
              <el-select
                v-model="professorForm.expertCategoryFlag"
                placeholder="请选择"
                style="width:300px"
              >
                <el-option
                  v-for="item in expertCategoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="擅长领域" class="tarea" label-width="120px">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="100"
                placeholder="请描述主要擅长领域"
                v-model.trim="professorForm.expertiseField"
                style="width:85%;"
                label-width="120px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="事故处理经历"
              class="tarea"
              label-width="120px"
            >
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请描述曾经参加的现场应急分析或事故处置经历"
                style="width:85%;"
                maxlength="100"
                v-model.trim="professorForm.experience"
              ></el-input>
            </el-form-item>

            <el-form-item label="备注" class="tarea" label-width="120px">
              <el-input
                v-model.trim="professorForm.remark"
                type="textarea"
                :rows="4"
                style="width:85%;"
                placeholder="请备注相关信息"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-form>

          <div class="bottom-btn">
            <el-button @click="goback">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div
      is="mapPoint"
      @mapPointSubmit="mapPointSubmit"
      :open="open"
      :oConfig="oConfig"
    ></div>
  </div>
</template>
<script>
import { checkUniqueness } from '@/views/index/api/supplies/api.xy.js'
import visBreadcrumb from '_com/breadcrumb.vue'
import _cloneDeep from 'lodash/cloneDeep'
import mapPoint from '@/components/common/mapPoint.vue'
import {
  checkEmail,
  checkOfficeCode,
  checkOfficePhone,
  validatePhone,
} from '@/utils/validator'
import {
  addExpert,
  editExpert,
  getDicts,
  getExpertDetail,
  fileUrl,
  pictureUpload,
} from '@/views/index/api/supplies/api.xy'
export default {
  components: { visBreadcrumb, mapPoint },
  props: {
    flag: '',
    uid: '',
  },
  data() {
    const that = this
    const checkeExpertName = async (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value !== that.initialData.expertName) {
        const params = {
          checkStr: this.professorForm.expertName,
          type: 5,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('该专家已存在。若是专家重名，建议添加专业等内容区分')
        }
      }
      callback()
    }
    return {
      breadcrumbData: [
        { name: '救援资源' },
        { name: '应急专家', routerName: 'professorlist' },
      ],
      imgLoading:false,
      open: false,
      oConfig: {},
      acceptFile: '.jpg,.gif,.png',
      proKey: '',
      professorForm: {
        expertName: '',
        gender: '',
        birthday: '',
        politicalFlag: '',
        officeCode: '',
        officePhone: '',
        phoneNumber: '',
        email: '',
        address: '',
        longitude: '',
        latitude: '',
        graduatedSchool: '',
        educationFlag: '',
        personalProfile: '',
        attachmentList: [],
        company: '',
        jobTitleFlag: '',
        position: '',
        belongingFieldFlag: '',
        expertLevelFlag: '',
        expertCategoryFlag: '',
        expertiseField: '',
        experience: '',
        remark: '',
        sex: '1',
      },
      attachmentList: [],
      positionList: [],
      belongingFieldList: [],
      expertLevelList: [],
      expertCategoryList: [],
      politicalStatusList: [],
      jobTitleList: [],
      educationList: [],
      fileList: [], // 附件列表
      uploadUrl: fileUrl,
      initialData: {},
      pickerOptions: {
        disabledDate(time) {  
          return time.getTime() > Date.now()
        },
      },
      dialogVisible: false,
      listCount:0,
      comCount:0,
      sexList: [],
      rules: {
        expertName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkeExpertName, trigger: 'blur' },
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        company: [
          { required: true, message: '请输入工作单位', trigger: 'blur' },
        ],

        email: [{ validator: checkEmail, trigger: 'blur' }],
        educationFlag: [
          { required: true, message: '请选择学历', trigger: 'blur' },
        ],
        politicalFlag: [
          { required: true, message: '请选择政治面貌', trigger: 'blur' },
        ],
        jobTitleFlag: [
          { required: true, message: '请选择职称', trigger: 'blur' },
        ],
        belongingFieldFlag: [
          { required: true, message: '请选择所属领域', trigger: 'blur' },
        ],
        expertLevelFlag: [
          { required: true, message: '请选择专家级别', trigger: 'blur' },
        ],
        expertCategoryFlag: [
          { required: true, message: '请选择专家类别', trigger: 'blur' },
        ],
        phoneNumber:[
          { validator: validatePhone, trigger: 'blur' } 
        ],
        officeCode: [{ validator: checkOfficeCode, trigger: 'blur' }],
        officePhone: [{ validator: checkOfficePhone, trigger: 'blur' }],
      },
    }
  },
  mounted() {},
  created() {
    this.init()
    if (this.isEdit) {
      this.getExpertDetail()
    }
  },
  computed: {
    isEdit() {
      return this.flag === 'edit'
    },
  },
  methods: {
    //初始化
    init() {
      this.breadcrumbData.push({
        name: `${this.isEdit ? '编辑' : '新增'}专家信息`,
      })
      this.getgender()
      this.getEducation()
      this.getPosition()
      this.getJobTitle()
      this.getPoliticalStatus()
      this.getExpertLevel()
      this.getExpertCategory()
      this.getBelongingField()
      const userInfo = JSON.parse(localStorage.getItem('vis_user_info') || '{}')
      this.proKey = userInfo.proKey
    },
    getExpertDetail() {
      let params = {
        uid: this.$route.query.uid,
        //  uid,
      }

      getExpertDetail(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            this.professorForm = res.data
            this.initialData = _cloneDeep(res.data)
            if (this.professorForm.longitude) {
              this.oConfig.center = [this.professorForm.longitude,this.professorForm.latitude,]
              this.oConfig._name = this.professorForm.address
            }
            this.attachmentList = this.professorForm.attachmentList
            this.professorForm.attachmentList.forEach((el) => {
              this.fileList.push({
                name: el.originalFileName,
                url: el.fileFullPath,
              })
            })
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取职务
    getPosition() {
      let params = {
        dictType: '38',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let position = {}
                position.label = item.dictValue
                position.value = item.dictKey
                this.positionList.push(position)
              })
            }
            if (this.flag !== 'edit') {            
              this.professorForm.position = '主任'
            }

          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取职称
    getJobTitle() {
      let params = {
        dictType: '37',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let jobTitleFlag = {}
                jobTitleFlag.label = item.dictValue
                jobTitleFlag.value = item.dictKey
                this.jobTitleList.push(jobTitleFlag)
              })
            }
            if (this.flag !== 'edit') {
              this.professorForm.jobTitleFlag = '研究员'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取政治面貌
    getPoliticalStatus() {
      let params = {
        dictType: '36',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let politicalFlag = {}
                politicalFlag.label = item.dictValue
                politicalFlag.value = item.dictKey
                this.politicalStatusList.push(politicalFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.professorForm.politicalFlag = '中共党员'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取专家级别
    getExpertLevel() {
      let params = {
        dictType: '39',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let expertLevelFlag = {}
                expertLevelFlag.label = item.dictValue
                expertLevelFlag.value = item.dictKey
                this.expertLevelList.push(expertLevelFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.professorForm.expertLevelFlag = '市级'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取专家类别
    getExpertCategory() {
      let params = {
        dictType: '40',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let expertCategory = {}
                expertCategory.label = item.dictValue
                expertCategory.value = item.dictKey
                this.expertCategoryList.push(expertCategory)
              })
            }
            if(this.flag !== 'edit'){
              this.professorForm.expertCategoryFlag = '综合类'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取专家所属领域
    getBelongingField() {
      let params = {
        dictType: '35',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let belongingFieldFlag = {}
                belongingFieldFlag.label = item.dictValue
                belongingFieldFlag.value = item.dictKey
                this.belongingFieldList.push(belongingFieldFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.professorForm.belongingFieldFlag = '应急领域'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取学历
    getEducation() {
      let params = {
        dictType: '22',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let educationFlag = {}
                educationFlag.label = item.dictValue
                educationFlag.value = item.dictKey
                this.educationList.push(educationFlag)
              })
            }
            if(this.flag !== 'edit'){
              this.professorForm.educationFlag = '未知'
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取性别
    getgender() {
      let params = {
        dictType: '31',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let sex = {}
                sex.label = item.dictValue
                sex.value = item.dictKey
                this.sexList.push(sex)
              })
            }
          // if (this.flag !== 'edit') {            
          //   this.professorForm.sex = 1
          // }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },

    buildParams() {
      const params = _cloneDeep(this.professorForm)
      params.attachmentList = this.attachmentList
      if(params.educationFlag == '未知'){
        params.educationFlag= "1"
        params.educationFlagName = '未知'
      }
      if(this.professorForm.jobTitleFlag == '研究员'){
        params.jobTitleFlag= "1"
        params.jobTitleFlagName= "研究员"
      }
      if(this.professorForm.politicalFlag == '中共党员'){
        params.politicalFlag= "1"
        params.politicalFlagName= "中共党员"
      }
      if(this.professorForm.expertLevelFlag == '市级'){
        params.expertLevelFlag= "3"
        params.expertLevelFlagName= "市级"
      }
      if(this.professorForm.expertCategoryFlag == '综合类'){
        params.expertCategoryFlag= "1"
        params.expertCategoryFlagName= "综合类"
      }
      if(this.professorForm.position == '主任'){
        params.position= "1"
      }
      if(this.professorForm.belongingFieldFlag == '应急领域'){
        params.belongingFieldFlag= "9"
        params.belongingFieldFlagName= "应急领域"
      }
      return params
    },

    onSubmit() {
      this.$refs['professorForm'].validate((valid) => {
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
          ? editExpert(params)
          : addExpert(params))
        if (code === '00000000') {
          this.$message({
            type: 'success',
            message: `${this.isEdit ? '修改' : '新建'}应急专家成功`,
          })
          // 回到列表页
          this.goback()
        }
      } catch (error) {
        console.log(error)
      }
    },
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
      this.listCount +=1
      this.imgLoading = true // 打开加载效果
      const formData = new FormData()
      formData.append('file', item.file)
      pictureUpload(formData).then(res => {
        this.comCount +=1
        if(this.comCount == this.listCount){
          this.imgLoading = false;
        }
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
        .catch(()=>{
        this.comCount +=1
        if(this.comCount == this.listCount){
          this.imgLoading = false;
        }
        if(this.fileList.length==0){
          this.fileList = []
        }else{
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
      this.professorForm.address = addressInfo
      this.professorForm.longitude = lal.split(',')[0]
      this.professorForm.latitude = lal.split(',')[1]
    },
    showMap() {
      this.open = !this.open
    },

    // 回退
    goback() {
      this.$router.back(-1)
    },
  },
}
</script>
<style lang="scss" scoped>
.fl-unit {
  /deep/ .el-select {
    width: 100%;
  }
  /deep/ .el-date-editor.el-input {
    width: 100%;
  }
}

.mid-btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.tarea {
  width: 85%;
  /deep/ .el-form-item__content {
    width: 85%;
  }
}
.gray_line {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e1e1e1;
}
.title {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
