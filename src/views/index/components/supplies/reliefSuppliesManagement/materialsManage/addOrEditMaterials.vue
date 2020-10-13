<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
        <div class="main_container_flex">
          <el-form
            :rules="formRule"
            :model="materialsInfo"
            ref="materialsInfo"
            label-width="120px"
            inline
          >
            <div>
              <el-row class="title">基本信息</el-row>
              <el-form-item
                label-width="120px"
                label="物资装备名称"
                prop="resourceName"
              >
                <el-input
                  placeholder="请输入名称(注：名称唯一)"
                  style="width:300px"
                  v-model.trim="materialsInfo.resourceName"
                  maxlength="20"
                ></el-input>
              </el-form-item>

              <el-form-item
                label-width="120px"
                label="物资装备类型"
                prop="resourceTypeFlag"
              >
                <el-select
                  placeholder="请选择装备类型"
                  style="width: 300px;"
                  v-model="materialsInfo.resourceTypeFlag"
                >
                  <el-option
                    v-for="item in materialsTypeList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label-width="120px"
                label="所属资源"
                prop="assetTypeFlag"
              >
                <el-select
                  placeholder="请选择所属资源"
                  style="width: 300px;"
                  v-model="materialsInfo.assetTypeFlag"
                >
                  <el-option
                    v-for="item in resourceTypeList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-form-item
                  label="所属分类"
                  prop="catalogTypeFlag1"
                >
                  <div class="select_group">
                    <el-select
                      placeholder="请选择大类"
                      v-model="materialsInfo.catalogTypeFlag1"
                      @change="
                        (value) => {
                          handleCatalogType(value, 1)
                        }
                      "
                    >
                      <el-option
                        v-for="item in catalogTypeFlag1List"
                        :key="item.dictKey"
                        :value="item.dictKey"
                        :label="item.dictValue"
                      ></el-option>
                    </el-select>

                    <el-select
                      placeholder="请选择中类"
                      v-model="materialsInfo.catalogTypeFlag2"
                      @change="
                        (value) => {
                          handleCatalogType(value, 2)
                        }
                      "
                    >
                      <el-option
                        v-for="item in catalogTypeFlag2List"
                        :key="item.dictKey"
                        :value="item.dictKey"
                        :label="item.dictValue"
                      ></el-option>
                    </el-select>

                    <el-select
                      placeholder="请选择小类"
                      v-model="materialsInfo.catalogTypeFlag3"
                      @change="
                        (value) => {
                          handleCatalogType(value, 3)
                        }
                      "
                    >
                      <el-option
                        v-for="item in catalogTypeFlag3List"
                        :key="item.dictKey"
                        :value="item.dictKey"
                        :label="item.dictValue"
                      ></el-option>
                    </el-select>

                    <el-select
                      placeholder="请选择细类"
                      v-model="materialsInfo.catalogTypeFlag4"
                      @change="
                        (value) => {
                          handleCatalogType(value, 4)
                        }
                      "
                    >
                      <el-option
                        v-for="item in catalogTypeFlag4List"
                        :key="item.dictKey"
                        :value="item.dictKey"
                        :label="item.dictValue"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-row>

              <el-form-item label="所属级别" prop="levelTypeFlag">
                <el-select
                  placeholder="请选择所属级别"
                  style="width:300px"
                  v-model="materialsInfo.levelTypeFlag"
                >
                  <el-option
                    v-for="item in levelTypeList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="计量单位" prop="measuringUnit">
                <el-select
                  placeholder="请选择计量单位"
                  style="width:300px"
                  v-model="materialsInfo.measuringUnit"
                >
                  <el-option
                    v-for="item in measuringUnitList"
                    :key="item.dictKey"
                    :value="item.dictKey"
                    :label="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="规格型号">
                <el-input
                  maxlength="20"
                  placeholder="请输入型号"
                  style="width:300px;"
                  v-model.trim="materialsInfo.model"
                ></el-input>
              </el-form-item>

              <el-form-item label="品牌">
                <el-input
                  maxlength="20"
                  placeholder="请输入名称"
                  style="width:300px"
                  v-model.trim="materialsInfo.brand"
                ></el-input>
              </el-form-item>

              <el-form-item label="标准单价" prop="unitPrice">
                <el-input
                  placeholder="请输入单价"
                  style="width:300px"
                  v-model.trim="materialsInfo.unitPrice"
                ></el-input
                >元
              </el-form-item>
              <el-row>
                <el-form-item
                  class="tarea"
                  label="主要用途"
                  label-width="120px"
                >
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入用途"
                    maxlength="100"
                    style="width:85%;"
                    v-model.trim="materialsInfo.mainUse"
                  ></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="注意事项" class="tarea">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入注意事项"
                    maxlength="100"
                    style="width:85%;"
                    v-model.trim="materialsInfo.notes"
                  ></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item
                  label="选择图片"
                  prop="attachmentList"
                  style="display:flex;"
                  v-loading="imgLoading"
                >
                  <el-upload
                    class="upload-doc"
                    action="#"
                    :before-upload="beforeUploadDocument"
                    :on-exceed="onExceedDocument"
                    :http-request="uploadAvatar"
                    with-credentials
                    :on-remove="handleRemove"
                    :limit="9"
                    :file-list="fileList"
                    :before-remove="beforeRemoveFile"
                    multiple
                    :accept="acceptFile"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus"></i>
                    <div slot="tip" class="el-upload__tip">
                      最多9张，大小不超过10M，支持JPG、GIF、PNG等格式
                    </div>
                  </el-upload>
                </el-form-item>
              </el-row>
              <el-row class="gray_line"></el-row>
              <el-row class="title">保质期预警设置</el-row>
              <el-row>
                <el-form-item
                  label="上限预警阈值"
                  style="margin-bottom: 30px;"
                  prop="maxWarningValue"
                >
                  <el-input
                    style="width:300px"
                    placeholder="请输入上限预警阈值"
                    v-model.trim="materialsInfo.maxWarningValue"
                  ></el-input>

                  <span
                    >（说明：当库存数量大于等于上限预警阈值时，系统将发出超储预警）</span
                  >
                </el-form-item>
              </el-row>
              <el-form-item
                label="下限预警阈值"
                style="margin-bottom: 30px;"
                prop="minWarningValue"
              >
                <el-input
                  style="width:300px"
                  placeholder="请输入下限预警阈值"
                  v-model.trim="materialsInfo.minWarningValue"
                ></el-input>

                <span
                  >（说明：当库存数量小于等于下限预警阈值时，系统将发出缺货预警）</span
                >
              </el-form-item>
              <el-row class="gray_line"></el-row>
              <el-row class="title">保质期预警设置</el-row>
              <el-row>
                <el-form-item label-width="120px" label="是否启用保质期">
                  <el-radio-group
                    v-model="materialsInfo.shelfLifeFlag"
                    @change="changeShelfLife"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row style="display: flex;">
                <div style="width:800px">
                  <el-form-item
                    label="保质期"
                    class="postInfo-container-item"
                    prop="shelfLifeValue"
                  >
                    <el-input
                      placeholder="请输入保质期"
                      v-model.trim="materialsInfo.shelfLifeValue"
                      :disabled="disabled"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="shelfLifeUnitFlag">
                    <el-select
                      v-model="materialsInfo.shelfLifeUnitFlag"
                      placeholder="请选择"
                      :disabled="disabled"
                    >
                      <el-option
                        v-for="item in shelfLifeUnitFlagList"
                        :key="item.value"
                        :label="item.dictValue"
                        :value="item.dictKey"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="warning">
                  <el-form-item
                    label="保质期预警阈值:"
                    prop="expireWarningValue"
                  >
                    <span>距离保质期截止日</span>
                    <el-input
                      style="width: 70px;"
                      v-model.trim="materialsInfo.expireWarningValue"
                      :disabled="disabled"
                    ></el-input>
                    <span>天开始预警</span>
                  </el-form-item>
                  <p style="font-size: 12px;margin-left: 10px;">
                    （说明：当预警开始日至保质期截止日，系统发出到期预警。保质期截止日之后，系统发出过期预警）
                  </p>
                </div>
              </el-row>
              <el-form-item class="bottom_buttons">
                <el-button @click="goback">返回</el-button>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import {
  checkMaxWarningValue,
  checkPrice,
  checkShelfLifeValue,
  checkMinWarningValue,
  checkExpireWarning,
} from '@/utils/validator'
import {
  addResource,
  editResource,
  getResourceDetail,
  fileUrl,
  pictureUpload,
  checkUniqueness,
} from '@/views/index/api/supplies/api.xy'

import _cloneDeep from 'lodash/cloneDeep'
import _get from 'lodash/get'
export default {
  name: 'AddMaterials',
  components: {
    visBreadcrumb,
  },
  props: {
    flag: '',
    uid: '',
  },
  data() {
    const that = this
    const checkResourceName = async (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      if (value !== that.initialData.resourceName) {
        const params = {
          checkStr: this.materialsInfo.resourceName,
          type: 1,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('该物资名称已存在')
        }
        return callback()
      }
      callback()
    }
    const checkShelfLife = (rule, value, callback) => {
      if (that.materialsInfo.shelfLifeFlag == '1') {
        if (!value) {
          return callback('请输入保质期天数')
        }
      }
      callback()
    }
    const checkUnitFlag = (rule, value, callback) => {
      if (that.materialsInfo.shelfLifeFlag == '1') {
        if (!value) {
          return callback('请输入保质期天数')
        }
      }
      callback()
    }
    const checkWarningValue = (rule, value, callback) => {
      if (that.materialsInfo.shelfLifeFlag == '1') {
        if (!value) {
          return callback('请输入保质期天数')
        }
      }
      callback()
    }
    const maxWarningValue = function(rule, value, callback) {
      if (!value) {
        return callback()
      }
      if (
        parseInt(that.materialsInfo.maxWarningValue) <= parseInt(that.materialsInfo.minWarningValue)
      ) {
        return callback('上限预警阈值不能小于或等于下限预警阈值')
      }
      callback()
    }
    const minWarningValue = function(rule, value, callback) {
      if (!value) {
        return callback()
      }
      if (
        parseInt(that.materialsInfo.minWarningValue) >= parseInt(that.materialsInfo.maxWarningValue)
      ) {
        return callback('下限预警阈值不能大于或等于上限预警阈值')
      }
      callback()
    }
    return {
      imgLoading:false,
      disabled: false,
      breadcrumbData: [
        { name: '救援资源' },
        { name: '物资装备', routerName: 'materialslist' },
      ],
      formRule: {
        resourceName: [
          { required: true, message: '请输入装备名称', trigger: 'blur' },
          { validator: checkResourceName, trigger: 'blur' },
        ],
        levelTypeFlag: [
          { required: true, message: '请选择所属级别', trigger: 'change' },
        ],
        resourceTypeFlag: [
          { required: true, message: '请选择装备类型', trigger: 'change' },
        ],
        catalogTypeFlag1: [
          { required: true, message: '请选择大类', trigger: 'change' },
        ],
        measuringUnit: [
          { required: true, message: '请选择计量单位', trigger: 'change' },
        ],
        assetTypeFlag: [
          { required: true, message: '请选择所属资源', trigger: 'change' },
        ],
        shelfLifeFlag: [
          { required: true, message: '此项为必选项', trigger: 'change' },
        ],
        unitPrice: [{ validator: checkPrice, trigger: 'blur' }],
        maxWarningValue: [
          { required: true, message: '请输入上限预警阈值', trigger: 'blur' },
          { validator: checkMaxWarningValue, trigger: 'blur' },
          { validator: maxWarningValue, trigger: 'change' },
        ],
        minWarningValue: [
          { required: true, message: '请输入下限预警阈值', trigger: 'blur' },
          { validator: minWarningValue, trigger: 'blur' },
          { validator: checkMinWarningValue, trigger: 'blur' },
        ],
        shelfLifeValue: [
          { validator: checkShelfLifeValue, trigger: 'change' },
          { validator: checkShelfLife, trigger: 'change' },
        ],
        shelfLifeUnitFlag: [{ validator: checkUnitFlag, trigger: 'change' }],
        expireWarningValue: [
          { validator: checkWarningValue, trigger: 'change' },
          { validator: checkExpireWarning, trigger: 'change' },
        ],
      },
      materialsTypeList: [], //物资装备类型
      levelTypeList: [], //所属级别
      resourceTypeList: [], //所属资源
      catalogTypeList: [
        'catalogTypeFlag1',
        'catalogTypeFlag2',
        'catalogTypeFlag3',
        'catalogTypeFlag4',
      ],
      catalogTypeFlag1List: [], //大类
      catalogTypeFlag2List: [], //中类
      catalogTypeFlag3List: [], //小类
      catalogTypeFlag4List: [], //细类
      shelfLifeUnitFlagList: [], //保质期单位
      measuringUnitList: [], //计量单位
      textarea: '',
      dialogImageUrl: '',
      dialogVisible: false,
      // disabled: false,
      radio: '1',
      materialsInfo: {
        uid: '',
        resourceName: '',
        resourceTypeFlag: '',
        assetTypeFlag: '',
        levelTypeFlag: '',
        catalogTypeFlag1: '',
        catalogTypeFlag2: '',
        catalogTypeFlag3: '',
        catalogTypeFlag4: '',
        measuringUnit: '',
        model: '',
        brand: '',
        unitPrice: '',
        mainUse: '',
        notes: '',
        maxWarningValue: '',
        minWarningValue: '',
        shelfLifeFlag: '1',
        shelfLifeValue: '',
        shelfLifeUnitFlag: '',
        expireWarningValue: '',
        attachmentList: [],
      },
      // uid:'',
      acceptFile: '.jpg,.gif,.png',
      attachmentList: [],
      fileList: [], // 附件列表
      uploadUrl: fileUrl,
      initialData: {},
    }
  },
  computed: {
    isEdit() {
      return this.flag === 'edit'
    },
  },
  watch: {},
  created() {
    // 获取字典数据
    this.getDictTypes()
    this.changeShelfLife()
    this.getcatalogType('0', 1)
    this.breadcrumbData.push({
      name: `${this.isEdit ? '编辑' : '新增'}物资装备`,
    })
    if (this.isEdit) {
      this.getResourceDetail()
    }
  },
  methods: {
    getDictTypes() {
      const dicTypeStr = localStorage.getItem('dic_type')
      if (!dicTypeStr) return
      // 所有字典数据
      const allDictType = JSON.parse(dicTypeStr)
      // 物资分类字典表
      this.catalogDictType = _get(allDictType.find(({ dictType }) => dictType === '1'),'dictList',[])
      // 物资类型字典表
      this.materialsTypeList = _get(allDictType.find(({ dictType }) => dictType === '2'),'dictList',[])
      // 所属资源字典表
      this.resourceTypeList = _get(allDictType.find(({ dictType }) => dictType === '3'),'dictList',[])
      // 保质期单位字典表
      this.shelfLifeUnitFlagList = _get(allDictType.find(({ dictType }) => dictType === '4'),'dictList',[])
      // 所属级别字典表
      this.levelTypeList = _get(allDictType.find(({ dictType }) => dictType === '5'),'dictList',[])
      // 计量单位字典表
      this.measuringUnitList = _get(allDictType.find(({ dictType }) => dictType === '6'),'dictList',[])
    },
    changeShelfLife(val) {
      if (val === '0') {
        this.disabled = true
        this.materialsInfo.expireWarningValue = ''
        this.materialsInfo.shelfLifeValue = ''
        this.materialsInfo.shelfLifeUnitFlag = ''
        this.$refs['materialsInfo'].clearValidate(['shelfLifeValue'])
        this.$refs['materialsInfo'].clearValidate(['expireWarningValue'])
        this.$refs['materialsInfo'].clearValidate(['shelfLifeUnitFlag'])
      } else {
        this.disabled = false
      }
    },
    getResourceDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      const that = this
      getResourceDetail(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            this.materialsInfo = res.data
            this.initialData = _cloneDeep(res.data)
            const dicTypeList = this.catalogDictType
            for (let i = 1; i < 4; i++) {
              const key = dicTypeList.find(
                ({ dictKey }) =>
                  dictKey === that.materialsInfo[`catalogTypeFlag${i}`]
              )
              if(!key){
                break
              }
              const id =key.dictId
              this.getcatalogType(id, i + 1)
            }
            if (this.materialsInfo.shelfLifeFlag === '0') {
              this.disabled = true
              this.materialsInfo.expireWarningValue = ''
              this.materialsInfo.shelfLifeValue = ''
              this.materialsInfo.shelfLifeUnitFlag = ''
            }
            this.attachmentList = this.materialsInfo.attachmentList
            this.materialsInfo.attachmentList.forEach((el) => {
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

    // 回退
    goback() {
      this.$router.back(-1)
    },

    //获得所属分类
    getcatalogType(parentId, level) {
      this[`catalogTypeFlag${level}List`] = this.catalogDictType.filter(
        (item) => item.parentId == parentId
      )
    },

    handleCatalogType(value, level) {
      const LENGTH = 4
      // 清空所有下级
      for (let i = level + 1; i < LENGTH + 1; i++) {
        this[`catalogTypeFlag${i}List`] = []
        this.materialsInfo[`catalogTypeFlag${i}`] = ''
      }
      if (level + 1 > LENGTH) return
      const list = this[`catalogTypeFlag${level}List`]
      const curItem = list.filter((it) => it.dictKey === value)
      const curId = curItem && curItem[0].dictId
      this.getcatalogType(curId, level + 1)
    },

    buildParams() {
      const params = _cloneDeep(this.materialsInfo)
      params.attachmentList = this.attachmentList
      if (params.attachmentList != '') {
        params.attachmentList[0].fileName = `poster.${params.attachmentList[0].fileType}`
        params.attachmentList[0].originalFileName = `poster.${params.attachmentList[0].fileType}`
      }
      return params
    },

    onSubmit() {
      this.$refs['materialsInfo'].validate((valid) => {
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
          ? editResource(params)
          : addResource(params))
        if (code === '00000000') {
          this.$message({
            type: 'success',
            message: `${this.isEdit ? '修改' : '新建'}物资装备成功`,
          })
          // 回到列表页
          this.goback()
        }
      } catch (error) {
        console.log(error)
      }
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
      this.$message.warning('最多可上传9个文件')
    },
    //文件上传提交到后端
    uploadAvatar(item) {
      this.imgLoading = true // 打开加载效果
      const materialsInfo = new FormData()
      materialsInfo.append('file', item.file)
      pictureUpload(materialsInfo)
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
    handleRemove(file, fileList) {
      let edata = []
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response) {
          edata.push(fileList[i].response.data)
        } else {
          edata.push(fileList[i])
        }
      }
      this.materialsInfo.attachmentList = edata
    },
  },
}
</script>

<style lang="scss" scoped>
.cont {
  line-height: 40px;
  color: red;
  margin-left: 45px;
}
/deep/.el-col-5 {
  width: 16.83333%;
  margin-right: 11px;
}
.bottom_buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 44px;
  margin-bottom: 49px;
  /deep/.el-button {
    width: 130px;
    & + .el-button {
      margin-left: 20px;
    }
  }
}
/deep/.el-col-12 {
  width: 100%;
}
.info {
  width: 56px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  margin-bottom: 20px;
}
.select_group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /deep/.el-select {
    width: 195px;
    & + .el-select {
      margin-left: 10px;
    }
  }
}
.title {
  color: #333333;
  font-weight: bold;
  position: relative;
}
.gray_line {
  margin-right: 20px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e1e1e1;
}

.tarea {
  width: 85%;
  /deep/ .el-form-item__content {
    width: 85%;
  }
}
.warning {
  margin-left: -10px;
  /deep/.el-form-item__error {
    margin-left: 115px;
    width:155px;
  }
}
</style>
