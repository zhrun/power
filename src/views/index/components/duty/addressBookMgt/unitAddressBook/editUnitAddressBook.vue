<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 新增/编辑单位通讯录
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data='breadcrumbData'></vis-breadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <el-form ref="userForm" :model="model" :rules="rules" label-width="110px">
            <table width="100%">
              <tr>
                <td class="form_item">
                  <el-form-item label="机构类别" prop="unitType" ref="unitType">
                    <span v-if="isEdit">{{model.unitType | unitType}}</span>
                    <el-radio-group v-model="model.unitType" v-else>
                      <el-radio
                        v-for="(item, index) in unitTypeList"
                        :key="'unitTypeRadio' + index"
                        :label="item.label"
                      >
                        {{item.value}}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['unitType'][0]"></td>
                <td class="remarks" v-html="unitConfig['unitType'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="上级主管单位" prop="parentUnitName" ref="parentUnitName">
                    <span v-if="isEdit">{{model.parentUnitName}}</span>
                    <div class="input_btn" v-else>
                      <el-input v-model="model.parentUnitName" disabled></el-input>
                      <el-button type="primary" @click="selectUnit">选择</el-button>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['parentUnitName'][0]"></td>
                <td class="remarks" v-html="unitConfig['parentUnitName'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="工作所在区域" prop="workArea" ref="workArea">
                    <span v-if="isEdit">{{ model.workArea }}</span>
                    <div class="select_group" v-else>
                      <el-select
                        v-model="model.province"
                        @change="( (value) => { handleChangeArea(value, 0) } )"
                        placeholder="省"
                      >
                        <el-option
                          v-for="item in provinceList"
                          :key="item.areaName"
                          :value="item.areaName"
                          :label="item.areaName"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-model="model.city"
                        @change="( (value) => { handleChangeArea(value, 1) } )"
                        placeholder="市"
                      >
                        <el-option
                          v-for="item in cityList"
                          :key="item.areaName"
                          :value="item.areaName"
                          :label="item.areaName"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-model="model.county"
                        @change="( (value) => { handleChangeArea(value, 2) } )"
                        placeholder="县/区"
                      >
                        <el-option
                          v-for="item in countyList"
                          :key="item.areaName"
                          :value="item.areaName"
                          :label="item.areaName"
                        ></el-option>
                      </el-select>
                      <el-select
                        v-model="model.town"
                        @change="( (value) => { handleChangeArea(value, 3) } )"
                        placeholder="乡/镇"
                      >
                        <el-option
                          v-for="item in townList"
                          :key="item.areaName"
                          :value="item.areaName"
                          :label="item.areaName"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['workArea'][0]"></td>
                <td class="remarks" v-html="unitConfig['workArea'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="机构名称" prop="unitName" ref="unitName">
                    <div class="input_btn">
                      <el-input v-model="model.unitName" maxlength="15"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['unitName'][0]"></td>
                <td class="remarks" v-html="unitConfig['unitName'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="机构简称" prop="unitShortName" ref="unitShortName">
                    <div class="input_btn">
                      <el-input v-model="model.unitShortName" maxlength="15"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['unitShortName'][0]"></td>
                <td class="remarks" v-html="unitConfig['unitShortName'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="组织机构代码" prop="unitCode" ref="unitCode">
                    <div class="input_btn">
                      <el-input v-model="model.unitCode"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['unitCode'][0]"></td>
                <td class="remarks" v-html="unitConfig['unitCode'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="单位电话" ref="unitPhone" required>
                    <div
                      class="phone_item"
                      v-for="(item, index) in model.unitPhone"
                      :class="{ 'is-error': phoneValidate['unitPhone'][index] || (phoneGroupRequired['unitPhone'] && index === 0) }"
                      :key="'unitPhone-item-' + index"
                    >
                      <div class="phone_item_content">
                        <el-input v-model="model.unitPhone[index]" @input="handleInputPhone('unitPhone', index)" @blur="handlePhoneBlur('unitPhone', index)"></el-input>
                        <i
                          v-if="index === 0"
                          class="el-icon-circle-plus"
                          @click="addPhone('unitPhone')"
                        ></i>
                        <i
                          v-else
                          class="el-icon-remove"
                          @click="removePhone('unitPhone', index)"
                        ></i>
                      </div>
                      <span
                        v-show="phoneValidate['unitPhone'][index]"
                        class="phone_tips"
                      >请输入正确的号码</span>
                      <span
                        v-show="phoneGroupRequired['unitPhone'] && index === 0"
                        class="phone_tips"
                      >请输入号码</span>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['unitPhone'][0]"></td>
                <td class="remarks" v-html="unitConfig['unitPhone'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="值班室电话" ref="dutyPhone" required>
                    <div
                      class="phone_item"
                      v-for="(item, index) in model.dutyPhone"
                      :class="{ 'is-error': phoneValidate['dutyPhone'][index] || (phoneGroupRequired['dutyPhone'] && index === 0) }"
                      :key="'dutyPhone-item-' + index"
                    >
                      <div class="phone_item_content">
                        <el-input v-model="model.dutyPhone[index]" @blur="handlePhoneBlur('dutyPhone', index)"  @input="handleInputPhone('dutyPhone', index)"></el-input>
                        <i
                          v-if="index === 0"
                          class="el-icon-circle-plus"
                          @click="addPhone('dutyPhone')"
                        ></i>
                        <i
                          v-else
                          class="el-icon-remove"
                          @click="removePhone('dutyPhone', index)"
                        ></i>
                      </div>
                      <span
                        v-show="phoneValidate['dutyPhone'][index]"
                        class="phone_tips"
                      >请输入正确的号码</span>
                      <span
                        v-show="phoneGroupRequired['dutyPhone'] && index === 0"
                        class="phone_tips"
                      >请输入号码</span>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['dutyPhone'][0]"></td>
                <td class="remarks" v-html="unitConfig['dutyPhone'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="传真" ref="fax">
                    <div
                      class="phone_item"
                      v-for="(item, index) in model.fax"
                      :class="{ 'is-error': phoneValidate['fax'][index] }"
                      :key="'fax-item-' + index"
                    >
                      <div class="phone_item_content">
                        <el-input v-model="model.fax[index]" @blur="handlePhoneBlur('fax', index)"  @input="handleInputPhone('fax', index)"></el-input>
                        <i
                          v-if="index === 0"
                          class="el-icon-circle-plus"
                          @click="addPhone('fax')"
                        ></i>
                        <i
                          v-else
                          class="el-icon-remove"
                          @click="removePhone('fax', index)"
                        ></i>
                      </div>
                      <span
                        v-show="phoneValidate['fax'][index]"
                        class="phone_tips"
                      >请输入正确的号码</span>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['fax'][0]"></td>
                <td class="remarks" v-html="unitConfig['fax'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="值班室手机" prop="roomPhone" ref="roomPhone">
                    <div class="input_btn">
                      <el-input v-model="model.roomPhone" maxlength="11"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['roomPhone'][0]"></td>
                <td class="remarks" v-html="unitConfig['roomPhone'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="负责人" prop="principal" ref="principal">
                    <div class="input_btn">
                      <el-input v-model="model.principal" maxlength="10"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['principal'][0]"></td>
                <td class="remarks" v-html="unitConfig['principal'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="地址" prop="address" ref="address">
                    <div class="input_btn">
                      <el-input v-model="model.address" maxlength="70"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['address'][0]"></td>
                <td class="remarks" v-html="unitConfig['address'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="邮编" prop="zipCode" ref="zipCode">
                    <div class="input_btn">
                      <el-input v-model="model.zipCode" maxlength="6"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['zipCode'][0]"></td>
                <td class="remarks" v-html="unitConfig['zipCode'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="位次" prop="sortId" ref="sortId">
                    <div class="input_btn">
                      <el-input v-model.trim="model.sortId"  @blur="handleSortIdBlur"></el-input>
                      <el-button style="width:120px" type="primary" @click="viewSortId">查看位次</el-button>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['sortId'][0]"></td>
                <td class="remarks" v-html="unitConfig['sortId'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="备注" prop="remark" ref="remark">
                    <el-input
                      v-model="model.remark"
                      type="textarea"
                      maxlength="100"
                      placeholder="请输入备注内容"
                      rows="5"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="unitConfig['remark'][0]"></td>
                <td class="remarks" v-html="unitConfig['remark'][1]"></td>
              </tr>
            </table>
            <el-form-item class="bottom_buttons">
              <el-button @click.native="back">返回</el-button>
              <el-button type="primary" @click.native="save">保存</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </main>
    <unit-tree-dialog
      ref="tree"
      :show="showUnitTree"
      :unitData="unitData"
      :current-uid="currentUid"
      @close="closeUnitTreeDialog"
      @confirm="confirm"
    >
    </unit-tree-dialog>
    <sort-id-dialog
      :sortIdList="sortIdList"
      :show="showSortIdTree"
      @close="closeSortIdDialog"
    >
    </sort-id-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { unitConfig } from "./unitConfig";
import {
  checkNameExt,
  validatePhone,
  checkZipCode,
  checkOrganizationCode,
} from "@/utils/validator";
import unitTreeDialog from "@/components/common/unitTreeDialog";
import sortIdDialog from "@/components/common/sortIdDialog";
import {
  queryBackTree,
  querySortList,
  getUnitDetail,
  addUnit,
  editUnit,
  getAreaList,
  getSortId,
} from "@/views/index/api/onDuty/api.yy.js";
import _cloneDeep from "lodash/cloneDeep";
import _assign from "lodash/assign";

export default {
  name: "EditUnitAddressBook",
  components: {
    visBreadcrumb,
    unitTreeDialog,
    sortIdDialog,
  },
  filters: {
    unitType(val) {
      const unitTypeList = [
        { label: 2, value: "内设机构" },
        { label: 3, value: "内设处（科、股）室" },
        { label: 4, value: "类别" },
      ];
      const typeObj =
        unitTypeList.filter((item) => item.label === val)[0] || {};
      return typeObj.value;
    },
  },
  props: {
    flag: "",
    uid: "",
    parentUid: "",
    parentUnitName: "",
  },
  data() {
    const _this = this;
    const checkUnitName = function(rule, value, callback) {
      if (!value) {
        return callback();
      }
      if (
        value !== _this.initialData.unitName &&
        _this.sortIdList.find((it) => it.unitName === value)
      ) {
        return callback("机构名称已存在");
      }
      callback();
    };
    const checkSortId = (rule, value, callback) => {
      let reg = /^([1-9][0-9]{0,2})(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的位次"));
      } else if (
        value - _this.initialData.sortId !== 0 &&
        _this.sortIdList.find((it) => value - it.sortId === 0)
      ) {
        return callback("位次已存在");
      }
      callback();
    };
    return {
      breadcrumbData: [
        { name: "通讯录管理" },
        { name: "单位通讯录", routerName: "unitAddressBook" },
      ],
      unitConfig: unitConfig,
      model: {
        unitType: "",
        parentUid: "",
        parentUnitName: "",
        uid: "",
        unitName: "",
        workArea: "",
        province: "",
        city: "",
        county: "",
        town: "",
        unitShortName: "",
        unitCode: "",
        unitPhone: [""],
        dutyPhone: [""],
        fax: [""],
        roomPhone: "",
        principal: "",
        address: "",
        zipCode: "",
        sortId: "",
        remark: "",
      },
      rules: {
        unitType: [
          { required: true, message: "请选择机构类型", trigger: "change" },
        ],
        parentUnitName: [
          { required: true, message: "请选择上级主管单位", trigger: "blur" },
        ],
        workArea: [{ required: true, message: "请选择工作所在区域" }],
        unitName: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          { validator: checkUnitName, trigger: "blur" },
        ],
        unitCode: [{ validator: checkOrganizationCode, trigger: "blur" }],
        roomPhone: [{ validator: validatePhone, trigger: "blur" }],
        principal: [{ validator: checkNameExt, trigger: "blur" }],
        zipCode: [{ validator: checkZipCode, trigger: "blur" }],
        sortId: [
          { required: true, message: "请输入位次", trigger: "blur" },
          { validator: checkSortId, trigger: "blur" },
        ],
      },
      unitTypeList: [
        { label: "2", value: "内设机构" },
        { label: "3", value: "内设处（科、股）室" },
        { label: "4", value: "类别" },
      ],
      unitData: [],
      sortIdList: [],
      showUnitTree: false,
      showSortIdTree: false,
      areaKeyList: ["province", "city", "county", "town"],
      provinceList: [],
      cityList: [],
      countyList: [],
      townList: [],
      phoneGroupRequired: {
        unitPhone: false,
        dutyPhone: false,
      },
      phoneValidate: {
        unitPhone: [false],
        dutyPhone: [false],
        fax: [false],
      },
      phoneKeyList: ["unitPhone", "dutyPhone", "fax"],
      currentUid: "",
      initialData: {},
    };
  },
  computed: {
    isEdit() {
      return this.flag === "edit";
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.breadcrumbData.push({
        name: this.isEdit ? "修改单位通讯录" : "新增单位通讯录",
      });
      this.getAreaList(1, 0);
      if (this.isEdit) {
        this.getUnitDetail();
      } else {
        this.model.parentUnitName = this.parentUnitName;
        this.model.parentUid = this.parentUid;
        this.model.unitType = 1;
        this.queryBackTree();
        this.querySortList();
        this.getSortId();
      }
    },
    handleSortIdBlur(event) {
      const val = event.currentTarget.value;
      // 输入的格式有误
      if (!/^([1-9][0-9]{0,2})(\.\d{1,2})?$/.test(val)) return;
      this.model.sortId = Number(val).toFixed(2);
    },

// async getAreaList(parentId, level) {
//       try {
//         const params = { parentId };
//         const { code, data } = await getAreaList(params);
//         if (code === "00000000") {
//           this[`${this.areaKeyList[level]}List`] = data;
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     },

    // 选择区域
    handleChangeArea(value, idx) {
      const len = this.areaKeyList.length;
      // 清空所有下级
      for (let i = idx + 1; i < len; i++) {
        this.model[this.areaKeyList[i]] = "";
        this[`${this.areaKeyList[i]}List`] = [];
      }
      // 当前选择的区域列表
      const curAreaList = this[`${this.areaKeyList[idx]}List`];
      // const { areaCode, id } = curAreaList.find((it) => it.areaName === value);
      const result = curAreaList.find((it) => it.areaName === value);
      // 行政区域编码
      this.model.areaCode = result.areaCode;
      // 工作区域
      this.model.workArea = `${this.model.province}${this.model.city}${
        this.model.county
      }${this.model.town}`;
      // 地址前缀带出
      this.model.address = this.model.workArea;
      // 最下一级不用再查数据
      if (idx + 1 === len) return;
      // 查询下级数据
      this.getAreaList(result.id, idx + 1);
    },
    // 增加电话行
    addPhone(key) {
      this.model[key].push("");
      this.phoneValidate[key].push(false);
    },
    // 移除电话行
    removePhone(key, index) {
      this.model[key].splice(index, 1);
      this.phoneValidate[key].splice(index, 1);
    },
    // 电话输入框失焦事件
    handlePhoneBlur(key, index) {
      const val = this.model[key][index];
      this.$set(this.phoneValidate[key], index, this.validateTelPhone(val));
    },
    // 电话输入框输入事件
    handleInputPhone(key, index) {
      this.$set(this.phoneValidate[key], index, false);
      this.phoneGroupRequired[key] = false;
    },
    // 校验座机号码或手机号码
    validateTelPhone(val) {
      return (
        val &&
        (!/^\d{3,4}-\d{7,8}$/.test(val) &&
          !/^1\d{10}$|^0\d{2,3}-?\d{7,8}$/.test(val))
      );
    },
    // 打开机构树选择弹框
    selectUnit() {
      this.currentUid = this.model.parentUid;
      this.showUnitTree = true;
    },
    // 贵安必机构选择弹框
    closeUnitTreeDialog() {
      this.showUnitTree = false;
    },
    // 确认选择机构
    confirm({ uid, unitName }) {
      this.model["parentUid"] = uid;
      this.model["parentUnitName"] = unitName;
      this.querySortList();
      this.closeUnitTreeDialog();
      this.getSortId();
    },
    // 打开查看位次弹框
    viewSortId() {
      this.showSortIdTree = true;
    },
    // 关闭位次弹框
    closeSortIdDialog() {
      this.showSortIdTree = false;
    },
    // 点击返回
    back() {
      this.$confirm("是否确定要返回？", "提示")
        .then(() => {
          this.goback();
        })
        .catch();
    },
    // 回退
    goback() {
      this.$router.go(-1);
    },
    // 点击保存
    save() {
      this.$refs["userForm"].validate((valid, obj) => {
        if (valid) {
          const errorKey = this.getPhoneErrorKey();
          if (errorKey) {
            const dom = this.$refs[errorKey];
            dom.$el.scrollIntoView({
              //滚动到指定节点
              block: "center",
              behavior: "smooth",
            });
            return false;
          }
          this.validateSuccess();
        } else {
          const key = Object.keys(obj)[0];
          const errorKey = this.getPhoneErrorKey();
          // 插入电话组校验
          let scrollKey = "";
          if (errorKey) {
            // 电话组之前的校验字段
            const validateKeys = [
              "unitType",
              "parentUnitName",
              "workArea",
              "unitName",
              "unitShortName",
              "unitCode",
            ];
            scrollKey = validateKeys.includes(key) ? key : errorKey;
          } else {
            scrollKey = key;
          }
          const dom = this.$refs[scrollKey];
          if (!dom) return false;
          dom.$el.scrollIntoView({
            //滚动到指定节点
            block: "center",
            behavior: "smooth",
          });
        }
      });
    },
    // 单独校验电话组,返回出错的电话组所在的字段
    getPhoneErrorKey() {
      const requiredPhoneKeyList = ["unitPhone", "dutyPhone"];
      // 触发电话组必填校验
      requiredPhoneKeyList.map((key) => {
        this.phoneGroupRequired[key] = !this.model[key].join("");
      });
      // 获取报错的电话组中的第一个
      let errorKey = "";
      this.phoneKeyList.some((key) => {
        // 必填校验不通过 或 任一个电话号码规则校验不通过，抛出报错的字段名
        if (
          this.phoneGroupRequired[key] ||
          this.phoneValidate[key].some(Boolean)
        ) {
          errorKey = key;
          return true;
        }
      });
      return errorKey;
    },
    // 组装参数
    buildParams() {
      const model = _cloneDeep(this.model);
      // 组装电话号码
      const phoneList = [];
      this.phoneKeyList.map((key, index) => {
        model[key].map((phone) => {
          phone &&
            phoneList.push({
              type: index + 1,
              phone: phone,
              unitUid: this.model.uid,
            });
        });
      });
      // 删除不需要的参数
      delete model.unitPhone;
      delete model.dutyPhone;
      delete model.fax;
      delete model.workArea;
      const params = { ...model, phoneList };
      return params;
    },
    // 编辑时，初始化详情数据
    initEditData(data) {
      _assign(this.model, data);
      this.model.workArea = `${data.province || ""}${data.city ||
        ""}${data.county || ""}${data.town || ""}`;
      const phoneList = data.phoneList;
      this.phoneKeyList.map((key, index) => {
        let phone = phoneList.reduce((pre, cur) => {
          if (cur.type === index + 1) {
            return [...pre, cur.phone];
          } else {
            return pre;
          }
        }, []);
        if (!phone.length) {
          phone = [""];
        }
        this.model[key] = phone;
      });
      this.model.sortId = Number(data.sortId).toFixed(2);
    },
    // 校验通过后请求接口
    async validateSuccess() {
      console.log("model", this.model);
      this.loading = true;
      try {
        const params = this.buildParams();
        const { code } = await (this.isEdit
          ? editUnit(params)
          : addUnit(params));
        if (code === "00000000") {
          this.loading = false;
          this.goback();
        }
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    // 获取区域列表
    async getAreaList(parentId, level) {
      try {
        const params = { parentId };
        const { code, data } = await getAreaList(params);
        if (code === "00000000") {
          this[`${this.areaKeyList[level]}List`] = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取机构树列表
    async queryBackTree() {
      try {
        const params = {
          unitType: "1",
          filterType: null,
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000") {
          this.unitData = [data];
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取位次列表
    async querySortList() {
      const params = {
        parentUid: this.model.parentUid,
      };
      try {
        const { code, data } = await querySortList(params);
        if (code === "00000000") {
          this.sortIdList = data;
        }
      } catch {
        // this.errorMessage("获取机构树失败!");
      }
    },
    // 获取机构详情
    async getUnitDetail() {
      try {
        const { code, data } = await getUnitDetail({ uid: this.uid });
        if (code === "00000000") {
          this.initEditData(data);
          this.initialData = data;
          this.querySortList();
        }
      } catch {
        this.$message({
          message: "查询机构详情失败",
          type: "error",
        });
      }
    },
    // 根据父级单位id生成位次
    async getSortId() {
      try {
        const params = {
          parentId: this.model.parentUid,
        };
        const { code, data } = await getSortId(params);
        if (code === "00000000") {
          this.model.sortId = Number(data).toFixed(2);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
tr {
  border: 1px solid $border_color;
  td {
    padding: 20px;
    border-left: 1px solid $border_color;
    &:first-child {
      border-left: none;
    }
  }
  .form_item {
    min-width: 550px;
    color: #333333;
    .el-form-item {
      width: 100%;
      margin-bottom: 0px;
    }
    .el-button {
      margin-left: 10px;
    }
    .psd_tip {
      position: absolute;
      left: 0px;
      top: 40px;
      font-size: 12px;
      line-height: 12px;
      padding-top: 4px;
    }
    .input_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .select_group {
    display: flex;
    .el-select {
      flex: 1;
      & + .el-select {
        margin-left: 10px;
      }
    }
  }
  .phone_item {
    position: relative;
    .phone_item_content {
      display: flex;
      align-items: center;
      i {
        font-size: 22px;
        cursor: pointer;
        color: #5458fe;
        margin-left: 10px;
      }
    }
    & + .phone_item {
      margin-top: 20px;
    }
    .phone_tips {
      color: $error_color;
      font-size: 12px;
      line-height: 12px;
      position: absolute;
      left: 0px;
      top: 100%;
      padding-top: 4px;
    }
    &.is-error {
      /deep/ .el-input__inner {
        border-color: $error_color;
      }
    }
  }
  .remarks {
    width: 30%;
    font-size: 12px;
    color: #999999;
    .tips {
      color: #ff0000;
    }
  }
}
.bottom_buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 44px;
  margin-bottom: 49px;
  .el-button {
    width: 130px;
    & + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
