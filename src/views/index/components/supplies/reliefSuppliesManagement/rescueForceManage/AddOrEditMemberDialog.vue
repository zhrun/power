<template>
  <el-dialog :title="titleName" :visible.sync="visible" @close="cancel">
    <el-form ref="model" :model="model" label-width="80px" :rules="formRules">
      <el-form-item label="成员姓名" prop="name">
        <el-input
          v-model="model.name"
          placeholder="请输入成员姓名"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="成员性别" prop="sexFlag">
        <el-radio v-model="sexFlag" label="1">男</el-radio>
        <el-radio v-model="sexFlag" label="2">女</el-radio>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input
          v-model.number="model.contactPhone"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="职务">
        <el-select
          maxlength="20"
          v-model="model.position"
          filterable
          allow-create
          default-first-option
          placeholder="请选择职务"
        >
          <el-option
            v-for="item in positionList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学历">
        <el-select
          placeholder="请选择学历"
          style="width:220px"
          v-model="educationFlag"
        >
          <el-option
            v-for="item in educationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入队时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          style="width:300px;"
          :picker-options="pickerOptions"
          v-model="model.entryTime"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="专业特长">
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入专业特长"
          maxlength="100"
          style="width:90%"
          v-model="model.specialty"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { checkUniqueness } from '@/views/index/api/supplies/api.xy.js'
import _cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'AddOrEditMemberDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    educationList: {
      type: Array,
      default: () => [],
    },
    positionList: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: -1,
    },
    detail: {
      tpye: Object,
      default: () => {},
    },
    titleName:{
      tpye: Object,
      default: () => {},
    },
    memberInfo:{
      type: Array,
      default: () => [],
    },
  },
  data() {
    const that = this
    const checkUserMobile = async (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      // if (value !== that.initialData.contactPhone) {
      if (that.memberInfo.some(({contactPhone}) => contactPhone == value) && (value != that.initialData.contactPhone)) {
        return callback(new Error('号码已存在'))
      }
      // }
      // console.log(this.memberInfo.map(item => {return {"phone":item.contactPhone}}))
      // console.log(this.memberInfo.map(item => {return item.contactPhone}))
      // // this.memberInfo.some(({contactPhone}) => contactPhone === value)
      // for(let i=0;i<this.memberInfo.length;i++){
      //     let phoneList = this.memberInfo[i].contactPhone  
      //     if(value === phoneList){
      //       return callback(new Error('号码已存在'))
      // }
      // }
      let reg = /^1\d{10}$|^0\d{2,3}-?\d{7,8}$/
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的号码'))
      }
     
      if (value != that.initialData.contactPhone) {
        const params = {
          checkStr: this.model.contactPhone,
          type: 3,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('号码已存在')
        }
        return callback()
      }
      callback()
    }
    return {
      formRules: {
        contactPhone: [
          { validator: checkUserMobile, trigger: 'blur' },
          { required: true, message: '请输入手机号码', trigger: 'blur' },
        ],
        name: [{ required: true, message: '请输入成员姓名', trigger: 'blur' }],
        // sexFlag: [
        //   { required: true, message: '请选择成员性别', trigger: 'change' },
        // ],
      },
      model: {
        contactPhone: '',
        educationFlag: '',
        educationFlagName: '',
        entryTime: '',
        forcesUid: '',
        name: '',
        position: '',
        sexFlag: '',
        sexFlagName: '',
        specialty: '',
        uid: '',
      },
      visible: false,
      proKey: '',
      sex: {
        1: '男',
        2: '女',
      },
      education: {
        1: '博士研究生',
        2: '硕士研究生',
        3: '本科',
        4: '专科',
        5: '高中',
        6: '中专',
        7: '初中',
        8: '小学',
        99: '未知',
      },
      sexFlag:"1",
      educationFlag: '未知',
      initialData: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  methods: {
    // init() {
    //   // const userInfo = JSON.parse(
    //   //   localStorage.getItem("vis_user_info") || "{}"
    //   // );
    //   // this.proKey = userInfo.proKey;
    //   // this.initialData = data;
    //   this.initialData = _cloneDeep(this.model)
    // },
    cancel() {
      this.$emit('input', false)
    },
    onSubmit() {
      this.$refs['model'].validate((valid) => {
        if (valid) {
          this.memberConfirm()
        }
      })
    },
    memberConfirm() {
      this.model.sexFlag = this.sexFlag
      this.model.educationFlag = this.educationFlag
      if(this.model.educationFlag == '未知'){
        this.model.educationFlag= "99"
      }
      // console.log(this.model.sexFlag)
      this.model.sexFlagName = this.sex[this.model.sexFlag]
      this.model.educationFlagName = this.education[this.model.educationFlag]
      this.$emit('confirm', _cloneDeep(this.model), this.index)
      this.cancel()
    },
  },
  watch: {
    value(val) {
      this.visible = val
      // debugger
      if (!val) {
        this.$refs['model'].resetFields()
      } else {
        this.model = _cloneDeep(this.detail)
        this.initialData =this.detail
      }
    },
  },

}
</script>

<style lang="scss" scoped></style>
