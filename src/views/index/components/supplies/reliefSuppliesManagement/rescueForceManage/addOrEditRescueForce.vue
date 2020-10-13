<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <el-scrollbar style="height:100%;">
      <div class="common_content">
        <div class="main_container_flex">
          <el-form
            :model="forcesInfo"
            :rules="formRule"
            ref="forcesInfo"
            label-width="120px"
            inline
          >
            <el-row class="title">基本信息</el-row>
            <el-row>
              <div class="formcl">
                <el-form-item
                  label-width="120px"
                  label="队伍名称"
                  prop="forcesName"
                >
                  <el-input
                    maxlength="20"
                    placeholder="请输入名称(注：名称唯一)"
                    style="width:300px"
                    v-model.trim="forcesInfo.forcesName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="队伍人数"
                  prop="forcesAmount"
                >
                  <el-input
                    placeholder="请输入人数"
                    style="width:300px"
                    v-model="forcesInfo.forcesAmount"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="所属单位"
                  prop="orgName"
                >
                  <el-input
                    maxlength="20"
                    placeholder="请输入所属单位"
                    style="width:300px"
                    v-model.trim="forcesInfo.orgName"
                  ></el-input>
                </el-form-item>
                <el-form-item label-width="120px" label="级别" prop="levelFlag">
                  <el-select
                    placeholder="请选择级别"
                    style="width:300px"
                    v-model="forcesInfo.levelFlag"
                  >
                    <el-option
                      v-for="item in levelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="属性"
                  prop="attributeFlag"
                >
                  <el-select
                    placeholder="请选择属性"
                    style="width:300px"
                    v-model="forcesInfo.attributeFlag"
                  >
                    <el-option
                      v-for="item in attributeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="类型"
                  prop="forcesFlag"
                >
                  <el-select
                    placeholder="请选择类别"
                    style="width:300px"
                    v-model="forcesInfo.forcesFlag"
                  >
                    <el-option
                      v-for="item in forcesFlagList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
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
                    v-model="forcesInfo.officeCode"
                  ></el-input>
                </el-form-item>
                <span
                  style="display:inline-block;width:10px;height:2px;margin-top:20px;margin-left: -20px;background:black;"
                ></span>
                <el-form-item prop="officePhone">
                  <el-input
                    placeholder="请输入联系电话"
                    style="width:200px;"
                    v-model="forcesInfo.officePhone"
                  ></el-input>
                </el-form-item>

                <el-form-item label-width="120px" label="成立日期">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    style="width:300px;"
                    v-model="forcesInfo.foundDate"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="责任人姓名"
                  prop="principal"
                >
                  <el-input
                    maxlength="10"
                    v-model.trim="forcesInfo.principal"
                    placeholder="请输入责任人姓名"
                    style="width:300px"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label-width="120px"
                  label="联系电话"
                  style="width: 100%;"
                  prop="contactPhone"
                >
                  <el-input
                    v-model.trim="forcesInfo.contactPhone"
                    placeholder="请输入联系电话"
                    style="width:300px"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="地址所在地"
                  prop="forcesAddress"
                  style="width: 100%;"
                >
                  <el-input
                    maxlength="100"
                    type="text"
                    placeholder="请选择队伍位置"
                    style="width:300px"
                    v-model.trim="forcesInfo.forcesAddress"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-map-location"
                      @click="showMap"
                    ></i>
                  </el-input>
                </el-form-item>
                <el-form-item
                  class="tarea"
                  label="擅长领域"
                  label-width="120px"
                >
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请描述队伍擅长处置的事故领域"
                    style="width:85%;"
                    v-model.trim="forcesInfo.field"
                  ></el-input>
                </el-form-item>
                <p
                  style="display:inline-block;width:1520px;height:1px; margin-top:30px;margin-bottom:30px; background-color: #E1E1E1;"
                ></p>
                <el-row class="title">主要成员</el-row>
                <el-form-item
                  class="bottom_buttons"
                  style="margin-left: 1px;margin-top: 30px; width:100%"
                >
                  <el-button type="primary" @click="openMemberDialog"
                    >新增成员</el-button
                  >
                  <el-button @click="importMenbers">导入</el-button>
                </el-form-item>
                <el-table :data="forcesInfo.memberInfos" style="width: 100%">
                  <el-table-column label="成员姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.name || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="性别">
                    <template slot-scope="scope">
                      <span>{{ scope.row.sexFlagName || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="联系电话" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.contactPhone || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="职务" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.position || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="学历" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.educationFlagName || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="专业特长" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.specialty || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="入队时间" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.entryTime || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"
                    ><template slot-scope="{ row, $index }">
                      <span class="handle_btn" @click="editMember(row, $index)"
                        >编辑</span
                      >
                      <span
                        class="handle_btn"
                        @click="deleteMember(row, $index)"
                        >删除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>

                <!-- <div class="gray_line"></div> -->
                <p name="name" class="info info2">主要装备</p>
                <el-form-item
                  class="bottom_buttons"
                  style="margin-left: 1px;margin-top: 30px; width:100%"
                >
                  <el-button type="primary" @click="openEquipmentDialog"
                    >新增装备
                  </el-button>
                  <el-button @click="importEquipment">导入</el-button>
                </el-form-item>
                <el-table :data="forcesInfo.equipmentInfos" style="width: 100%">
                  <el-table-column prop="date" label="装备名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.equipmentName || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="规格型号" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span>{{ scope.row.specifications || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="数量" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.quantity || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="单位" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.measuringUnitName || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="厂商品牌" show-overflow-tooltip
                    ><template slot-scope="scope">
                      <span>{{ scope.row.brand || '-' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"
                    ><template slot-scope="{ row, $index }">
                      <span
                        class="handle_btn"
                        @click="editEquipment(row, $index)"
                        >编辑</span
                      >
                      <span
                        class="handle_btn"
                        @click="deleteEquipment(row, $index)"
                        >删除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <el-form-item class="btns">
                <el-button @click="goback">返回</el-button>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-scrollbar>

    <div
      is="mapPoint"
      @mapPointSubmit="mapPointSubmit"
      :open="open"
      :oConfig="oConfig"
    ></div>
    <add-or-edit-member-dialog
      v-model="memberVisible"
      :educationList="educationList"
      :memberInfo="forcesInfo.memberInfos"
      :positionList="positionList"
      :detail="memberDetail"
      :index="memberIndex"
      :titleName ="titleName"
      @confirm="memberConfirm"
    ></add-or-edit-member-dialog>
    <add-or-edit-equipment-dialog
      v-model="equipmentVisible"
      :measuringUnitList="measuringUnitList"
      :equipmentInfo="forcesInfo.equipmentInfos"
      :detail="equipmentDetail"
      :index="equipmentIndex"
      :titleName ="titleName"
      @confirm="equipmentConfirm"
    ></add-or-edit-equipment-dialog>

    <import-member-dialog
      :showDialog="showImportMemberDialog"
      :title="importMemberDialogTitle"
      @close="closeImportMemberDialog"
      @confirm="confirmImportMember"
    ></import-member-dialog>
    <import-equipment-dialog
      :showDialog="showImportEquipmentDialog"
      :title="importEquipmentDialogTitle"
      @close="closeImportEquipmentDialog"
      @confirm="confirmImportEquipment"
    ></import-equipment-dialog>
  </div>
</template>
<script>
import {
  getDicts,
  addRescueForce,
  editRescueForce,
  getRescueForceDetail,
  getPost,
  checkUniqueness,
} from '@/views/index/api/supplies/api.xy'
import {
  valiPhone,
  checkMembers,
  checkOfficeCode,
  checkOfficePhone,
} from '@/utils/validator'
import visBreadcrumb from '_com/breadcrumb.vue'
import _cloneDeep from 'lodash/cloneDeep'
import mapPoint from '@/components/common/mapPoint.vue'
import ImportMemberDialog from './ImportMemberDialog'
import AddOrEditMemberDialog from './AddOrEditMemberDialog'
import ImportEquipmentDialog from './ImportEquipmentDialog'
import AddOrEditEquipmentDialog from './AddOrEditEquipmentDialog'
export default {
  name: 'AddRescueForce',
  components: {
    visBreadcrumb,
    mapPoint,
    ImportMemberDialog,
    AddOrEditMemberDialog,
    ImportEquipmentDialog,
    AddOrEditEquipmentDialog,
  },
  props: {
    flag: '',
    uid: '',
  },
  data() {
    const that = this
    const validateForcesName = async (rule, value, callback) => {
      if (value !== that.initialData.forcesName) {
        const params = {
          checkStr: this.forcesInfo.forcesName,
          type: 2,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('队伍名称已存在')
        }
        return callback()
      }
      callback()
    }
    //   const checkUserMobile = async (rule, value, callback) => {
    //   if (!value) {
    //     return callback();
    //   }
    //   // let reg = /^1\d{10}$|^0\d{2,3}-?\d{7,8}$/;
    //   // if (!reg.test(value)) {
    //   //   return callback(new Error("请输入正确的手机号码"));
    //   // }
    //   if (value !== that.forcesInfo.contactPhone) {
    //     const params = {
    //       proKey: that.proKey,
    //       contactPhone: value,
    //     };
    //     const { code, data } = await checkUserRename(params);
    //     if (code === "00000000" && data) {
    //       return callback("手机号码已存在");
    //     }
    //   }
    //   callback();
    // };
    return {
      breadcrumbData: [
        { name: '救援物资' },
        { name: '救援力量', routerName: 'rescueforcelist' },
      ],
      open: false,
      oConfig: {},
      memberVisible: false,
      equipmentVisible: false,
      forcesInfo: {
        forcesName: '',
        forcesAmount: '',
        orgName: '',
        levelFlag: '',
        attributeFlag: '',
        forcesFlag: '',
        officeCode: '',
        officePhone: '',
        foundDate: '',
        principal: '',
        contactPhone: '',
        forcesAddress: '',
        longitude: '',
        latitude: '',
        field: '',
        equipmentInfos: [],
        memberInfos: [],
      },
      // equipmentInfos: {
      //     equipmentName: '',
      //     specifications: '',
      //     quantity: '',
      //     measuringUnit: '',
      //     brand: '',
      //   },
      proKey: '',
      levelList: [],
      forcesFlagList: [],
      attributeList: [],
      educationList: [],
      positionList: [],
      measuringUnitList: [],
      // equipmentInfos: [],
      memberInfos: [],
      phoneList:[],
      equipmentInfos: [],
      sexList: [],
      initialData: {},
      showImportMemberDialog: false,
      showImportEquipmentDialog: false,
      importMemberDialogTitle: '导入成员',
      importEquipmentDialogTitle: '导入装备',
      formRule: {
        levelFlag: [
          { required: true, message: '请选择级别', trigger: 'change' },
        ],
        forcesName: [
          { required: true, message: '请输入队伍名称', trigger: 'blur' },
          { validator: validateForcesName, trigger: 'blur' },
        ],
        forcesAmount: [
          { required: true, message: '请输入人数', trigger: 'blur' },
          {validator: checkMembers, trigger: 'blur' },
        ],
        orgName: [
          { required: true, message: '请输入所属单位', trigger: 'blur' },
        ],
        attributeFlag: [
          { required: true, message: '请选择属性', trigger: 'change' },
        ],
        forcesFlag: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        forcesAddress: [
          { required: true, message: '请选择地址', trigger: 'change' },
        ],
        principal: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, message: '此项为必选项', trigger: 'blur' },
          { validator: valiPhone, trigger: 'blur' },
          // { validator: checkUserMobile, trigger: "blur" },
        ],
        officeCode: [
          // {required: true, message: '请输入区号', trigger: 'blur'},
          { validator: checkOfficeCode, trigger: 'blur' },
        ],
        officePhone: [
          // {required: true, message: '请输入办公电话', trigger: 'blur'},
          { validator: checkOfficePhone, trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now() - 3600 * 1000 * 24
          return time.getTime() > Date.now()
        },
      },
      memberDetail: {},
      memberIndex: -1,
      titleName:'',
      equipmentDetail: {},
      equipmentIndex: -1,
    }
  },
  created() {
    this.init()
    this.breadcrumbData.push({
      name: `${this.isEdit ? '编辑' : '新增'}救援力量`,
    })
    if (this.isEdit) {
      this.getRescueForceDetail()
    }
  },
  computed: {
    isEdit() {
      return this.flag === 'edit'
    },
  },
  methods: {
    getRescueForceDetail() {
      let params = {
        uid: this.$route.query.uid,
        //  uid,
      }

      getRescueForceDetail(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            this.forcesInfo = res.data
            this.initialData = _cloneDeep(res.data)
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    mapPointSubmit(lal, addressInfo) {
      this.forcesInfo.forcesAddress = addressInfo
      this.forcesInfo.longitude = lal.split(',')[0]
      this.forcesInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      this.open = !this.open
    },
    init() {
      this.getPost()
      this.getSex()
      this.getlevel()
      this.getForcesFlag()
      this.getAttribute()
      this.getEducation()
      this.getmeasuringUnitList()
      const userInfo = JSON.parse(localStorage.getItem('vis_user_info') || '{}')
      this.proKey = userInfo.proKey
    },

    getPost() {
      getPost().then((res) => {
        if (res && res.code === '00000000') {
          if (res.data && res.data.length > 0) {
            res.data.map((item) => {
              this.positionList.push(item)
            })
          }
        }
      })
    },

    //获取计量单位
    getmeasuringUnitList() {
      let params = {
        dictType: '6',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let measuringUnit = {}
                measuringUnit.label = item.dictValue
                measuringUnit.value = item.dictKey
                this.measuringUnitList.push(measuringUnit)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取救援力量级别
    getlevel() {
      let params = {
        dictType: '19',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let levelFlag = {}
                levelFlag.label = item.dictValue
                levelFlag.value = item.dictKey
                this.levelList.push(levelFlag)
              })
              if(this.flag !== 'edit'){
                this.forcesInfo.levelFlag = '县级'
              }  
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取救援力量类型
    getForcesFlag() {
      let params = {
        dictType: '20',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let forcesFlag = {}
                forcesFlag.label = item.dictValue
                forcesFlag.value = item.dictKey
                this.forcesFlagList.push(forcesFlag)
              })
            }
            if(this.flag !== 'edit'){
                this.forcesInfo.forcesFlag = '消防救援队'
              }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取救援力量属性
    getAttribute() {
      let params = {
        dictType: '21',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let attributeFlag = {}
                attributeFlag.label = item.dictValue
                attributeFlag.value = item.dictKey
                this.attributeList.push(attributeFlag)
              })
            }
            if(this.flag !== 'edit'){
                this.forcesInfo.attributeFlag = '专业救援力量'
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
                let education = {}
                education.label = item.dictValue
                education.value = item.dictKey
                this.educationList.push(education)
              })
            }
            // if(this.flag !== 'edit'){
            //     this.forcesInfo.memberInfos.education = '专业救援力量'
            //   } 
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    //获取性别
    getSex() {
      let params = {
        dictType: '31',
        parentId: '0',
      }
      getDicts(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                let sexFlag = {}
                sexFlag.label = item.dictValue
                sexFlag.value = item.dictKey
                this.sexList.push(sexFlag)
              })
            }
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },
    buildParams() {
      const params = _cloneDeep(this.forcesInfo)
      // const params = { ...forcesInfo }
      if(params.levelFlag == '县级'){
        params.levelFlag= "1"
        params.levelFlagName='县级'
      }
      if(params.attributeFlag == '专业救援力量'){
        params.attributeFlag = "2"
        params.attributeFlagName = '专业救援力量'
      }
      if(params.forcesFlag == '消防救援队'){
        params.forcesFlag = "1"
        params.forcesFlagName = '消防救援队'
      }
      return params
    },
    onSubmit() {
      this.$refs['forcesInfo'].validate((valid) => {
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
          ? editRescueForce(params)
          : addRescueForce(params))
        if (code === '00000000') {
          this.$message({
            type: 'success',
            message: `${this.isEdit ? '修改' : '新建'}救援力量成功`,
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
    // 打开新增成员弹框
    openMemberDialog() {
      this.memberDetail = {}
      this.memberIndex = -1
      this.titleName = '新增成员'
      this.memberVisible = true
    },
    // 打开新增装备弹框
    openEquipmentDialog() {
      this.equipmentDetail = {}
      this.equipmentIndex = -1
      this.titleName = '新增装备'
      this.equipmentVisible = true
    },
    // 确认新增/编辑成员
    memberConfirm(val, index) {
      if (index > -1) {
        this.forcesInfo.memberInfos.splice(index, 1, val)
      } else {
        this.forcesInfo.memberInfos.push(val)
      }
    },
    // 确认新增/编辑装备
    equipmentConfirm(val, index) {
      if (index > -1) {
        this.forcesInfo.equipmentInfos.splice(index, 1, val)
      } else {
        this.forcesInfo.equipmentInfos.push(val)
      }
    },
    editMember(row, index) {
      this.memberDetail = _cloneDeep(row)
      // this.phoneList = this.forcesInfo.memberInfos.filter()
      
      // forcesInfo.memberInfos
      this.memberIndex = index
      this.titleName = '编辑成员'
      this.memberVisible = true
    },
    editEquipment(row, index) {
      this.equipmentDetail = _cloneDeep(row)
      this.equipmentIndex = index
      this.titleName = '编辑装备'
      this.equipmentVisible = true
    },
    // deleteMember(row, index) {
    //   this.forcesInfo.memberInfos.splice(index, 1)
    // },
    deleteMember(row, index)  {
      this.$confirm('是否删除？删除后不可恢复。', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning',
      })
        .then(() => {
          this.forcesInfo.memberInfos.splice(index, 1)
            this.$message({
              type:'success',
              message:'删除成功!',
          })
        })
        .catch(() => {})
    },
    deleteEquipment(row, index)  {
      this.$confirm('是否删除？删除后不可恢复。', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning',
      })
        .then(() => {
          this.forcesInfo.equipmentInfos.splice(index, 1)
            this.$message({
              type:'success',
              message:'删除成功!',
          })
        })
        .catch(() => {})
    },
    // deleteEquipment(row, index) {
    //   this.forcesInfo.equipmentInfos.splice(index, 1)
    // },
    importMenbers() {
      this.showImportMemberDialog = true
    },
    closeImportMemberDialog() {
      this.showImportMemberDialog = false
    },
    confirmImportMember(val) {
      this.forcesInfo.memberInfos = val
    },
    importEquipment() {
      this.showImportEquipmentDialog = true
    },
    closeImportEquipmentDialog() {
      this.showImportEquipmentDialog = false
    },
    confirmImportEquipment(val) {
      this.forcesInfo.equipmentInfos = val
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

.info2 {
  margin-left: 5px;
  margin-top: 19px;
  width: 100%;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}
.btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.el-vue-amap-container.amap-demo {
  width: 800px;
  height: 500px;
}
/* .search-box {
  position: absolute;
  top: 25px;
  left: 20px;
} */
.amap-page-container {
  position: relative;
}
.position {
  justify-content: center;
  align-items: center;
  display: flex;
  margin-left: 80px;
  font-size: 20px;
}
.handle_btn {
  cursor: pointer;
  font-size: 14px;
  color: $main_color;
  padding: 0 5px;
  position: relative;

  &:first-child {
    padding-left: 0px;
  }

  &:not(:first-child) {
    &::before {
      content: '';
      position: absolute;
      width: 1px;
      top: 3px;
      left: 0px;
      height: 15px;
      background-color: $main_color;
      display: inline-block;
    }
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
.tarea {
  width: 85%;
  /deep/ .el-form-item__content {
    width: 85%;
  }
}
</style>
