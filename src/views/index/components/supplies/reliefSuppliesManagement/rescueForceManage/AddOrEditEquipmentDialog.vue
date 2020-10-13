<template>
  <el-dialog :title="titleName" :visible.sync="visible" @close="cancel">
    <el-form
      ref="equipmentInfos"
      :model="equipmentInfos"
      label-width="80px"
      :rules="formRules"
    >
      <el-form-item label="装备名称" prop="equipmentName">
        <el-input
          v-model="equipmentInfos.equipmentName"
          autocomplete="off"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="装备数量" prop="quantity">
        <el-input
          v-model="equipmentInfos.quantity"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="计量单位" prop="measuringUnit">
        <el-select
          placeholder="请选择计量单位"
          style="width:220px"
          v-model="equipmentInfos.measuringUnit"
        >
          <el-option
            v-for="item in measuringUnitList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="equipmentInfos.specifications"
          autocomplete="off"
          maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="厂商品牌">
        <el-input
          v-model="equipmentInfos.brand"
          autocomplete="off"
          maxlength="12"
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
import { checkQuantity } from '@/utils/validator'
export default {
  name: 'AddOrEditEquipmentDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    measuringUnitList: {
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
    equipmentInfo: {
      type: Array,
      default: () => [],
    },
    titleName:{
      tpye: Object,
      default: () => {},
    },
  },
  data() {
    const that = this
    const checkEquipMentName = async (rule, value, callback) => {
      if (!value) {
        return callback()
      }
      // if (this.equipmentInfo.some(({equipmentName}) => equipmentName === value)) {
      //       return callback(new Error('装备已存在。'))
      // }
       if (that.equipmentInfo.some(({equipmentName}) => equipmentName === value) && (value !== that.initialData.equipmentName)) {
        return callback(new Error('装备已存在'))
      }
      
      if (value !== that.initialData.equipmentName) {
        const params = {
          checkStr: that.equipmentInfos.equipmentName,
          type: 4,
        }
        const { code, data } = await checkUniqueness(params)
        if (code === '00000000' && data) {
          return callback('装备已存在。')
        }
        return callback()
      }
      callback()
    }
    return {
      formRules: {
        equipmentName: [
          { required: true, message: '请输入装备名称', trigger: 'blur' },
          { validator: checkEquipMentName, trigger: 'blur' },
        ],
        quantity: [
          { required: true, message: '请输入装备数量', trigger: 'blur' },
          { validator: checkQuantity, trigger: 'blur' },
        ],
        measuringUnit: [
          { required: true, message: '请选择计量单位', trigger: 'blur' },
        ],
      },
      equipmentInfos: {
        equipmentName: '',
        specifications: '',
        quantity: '',
        measuringUnit: '',
        measuringUnitName: '',
        brand: '',
      },
      // measuring:{},
       measuring: {
          1 :'克',
          2 : '千克',
          3 : '公吨',
          4 : '磅',
          5 : '米',
          6 : '厘米',
          7 : '升',
          8 : '毫升',
          9 : '立方米',
          10 : '个',
          11 : '盒',
          12 : '只',
          13 : '件',
          14 : '包',
          15 : '双',
          16 : '台',
          17 : '组',
          18 : '张',
          19 : '套',
          20 : '架',
          21 : '打',
          22 : '卷',
          23 : '辆',
          24 : '头',
          25 : '箱',
          26 : '包',
          27 : '桶',
          28 : '袋',
          29 : '棵',
          30 : '顶'
       },
      visible: false,
      proKey: '',
      initialData: {},
    }
  },
  created() {
    // this.getDictTypes()
  },
  methods: {
    // init() {
    //   this.initialData = _cloneDeep(this.detail)
    // },
    // getDictTypes() {
		// 	const dicTypeStr = localStorage.getItem('dic_type')
		// 	// 所有字典数据
		// 	const allDictType = (dicTypeStr && JSON.parse(dicTypeStr)) || []
		// 	// 保质期预警类型字典表
		// 	this.measuring = allDictType.find(
		// 		({ dictType }) => dictType === '6'
		// 	).dictList
		// },
    cancel() {
      this.$emit('input', false)
    },
    onSubmit() {
      this.$refs['equipmentInfos'].validate((valid) => {
        if (valid) {
          this.equipmentConfirm()
        }
      })
    },
    equipmentConfirm() {
      // const that = this
      // // this.equipmentInfos.measuringUnitName =
      // // console.log(this.measuring.map(item => {return {"measuringUnitName":item.dictValue}}))
      // const measuringUnitName = this.measuring.map(item =>{
      //   // ({ measuringUnitName,measuringUnit }) => measuringUnit === item.dictType
      //   debugger
      //   if( that.equipmentInfos.measuringUnit === item.dictKey){
      //     return item.dictValue
      //   }
        
      // }  
      //     // if(this.measuringUnit=== item.dictType){

      //     //  }
      // 	)
      // this.equipmentInfos.measuringUnitName = measuringUnitName
      this.equipmentInfos.measuringUnitName = this.measuring[this.equipmentInfos.measuringUnit]
      this.$emit('confirm', _cloneDeep(this.equipmentInfos), this.index)
      this.cancel()
    },
  },
  watch: {
    value(val) {
      this.visible = val
      if (!val) {
        this.$refs['equipmentInfos'].resetFields()
      } else {
        this.equipmentInfos = _cloneDeep(this.detail)
        this.initialData =this.detail
      }
    },
  },
}
// this.selectedSupplies.map(item => {
			// 	const selectedIndex = this.model.resourceList.findIndex(
			// 		({ uid }) => uid === item.uid
			// 	)
			// 	if (selectedIndex > -1) {
			// 		this.model.resourceList.splice(selectedIndex, 1)
			// 	}
			// })
</script>

<style lang="scss" scoped></style>
