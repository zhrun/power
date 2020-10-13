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
                  <el-form-item label="机构名称" prop="unitName" ref="unitName">
                    <div class="input_btn">
                      <el-input v-model="model.unitName" maxlength="15" disabled></el-input>
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
                      <el-input v-model="model.unitShortName" maxlength="15" disabled></el-input>
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
                      <el-input v-model="model.unitCode" disabled></el-input>
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
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { selfUnitConfig } from "./selfUnitConfig";
import {
  checkNameExt,
  validatePhone,
  checkZipCode,
  checkOrganizationCode,
} from "@/utils/validator";
import {
  getUnitDetail,
  editUnit,
} from "@/views/index/api/onDuty/api.yy.js";
import _cloneDeep from "lodash/cloneDeep";
import _assign from "lodash/assign";

export default {
  name: "EditUnitAddressBook",
  components: {
    visBreadcrumb,
  },
  props: {
    unitUid: "",
  },
  data() {
    const _this = this;
    const checkUnitName = function(rule, value, callback) {
      if (!value) {
        return callback();
      }
      if (value !== _this.initialData.unitName &&  _this.sortIdList.find(it => it.unitName === value)) {
        return callback("机构名称已存在");
      }
      callback();
    };
    return {
      breadcrumbData: [
        { name: "单位编辑" },
      ],
      unitConfig: selfUnitConfig,
      model: {
        uid: "",
        unitName: "",
        unitShortName: "",
        unitCode: "",
        unitPhone: [""],
        dutyPhone: [""],
        fax: [""],
        roomPhone: "",
        principal: "",
        address: "",
        zipCode: "",
        remark: "",
      },
      rules: {
        unitName: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          { validator: checkUnitName, trigger: "blur" },
        ],
        unitCode: [{ validator: checkOrganizationCode, trigger: "blur" }],
        roomPhone: [{ validator: validatePhone, trigger: "blur" }],
        principal: [{ validator: checkNameExt, trigger: "blur" }],
        zipCode: [{ validator: checkZipCode, trigger: "blur" }],
      },
      unitData: [],
      sortIdList: [],
      showUnitTree: false,
      showSortIdTree: false,
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
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.getUnitDetail();
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
    },
    // 校验通过后请求接口
    async validateSuccess() {
      console.log("model", this.model);
      this.loading = true;
      try {
        const params = this.buildParams();
        const { code } = await editUnit(params)
        if (code === "00000000") {
          this.loading = false;
          this.goback();
        }
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    // 获取机构详情
    async getUnitDetail() {
      try {
        const { code, data } = await getUnitDetail({ uid: this.unitUid });
        if (code === "00000000") {
          this.initEditData(data);
        }
      } catch {
        this.$message({
          message: "查询机构详情失败",
          type: "error",
        });
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
