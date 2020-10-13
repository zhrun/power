<template>
  <div class="ex_form">
    <el-form
      ref="form"
      :model="model"
      :rules="rules"
      label-width="120px"
    >
      <el-table
        border
        :data="tableData"
        :show-header="false"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column width="600px">
          <template slot-scope="scope">
            <el-form-item
              :ref="scope.row.key"
              :label="scope.row.label"
              :prop="scope.row.key"
              v-if="model[scope.row.dependentKey] === scope.row.dependentValue"
              :required="scope.row.type !== 'input' && scope.row.required"
            >
              <template v-if="flag === 'edit' && scope.row.editType === 'text'">
                <span>{{model[scope.row.key]}}</span>
              </template>
              <template v-else-if="scope.row.type === 'selectGroup'">
                <div class="select_box">
                  <el-select
                    v-for="(selectKey, index) in scope.row.selectList"
                    :key="'selectKey' + index"
                    v-model="model[selectKey]"
                    @change="((value) => {handleSelectGroupChange(scope.row.selectList, value, index)})"
                    :placeholder="fieldName[selectKey]"
                  >
                    <el-option
                      v-for="(item ,idx) in optionsObj[selectKey]"
                      :key="selectKey + 'option' + idx"
                      :value="item.areaCode"
                      :label="item.areaName"
                    ></el-option>
                  </el-select>
                </div>
              </template>
              <template v-else-if="scope.row.type === 'inputButton'">
                <div class="input_button_box">
                  <el-input
                    :disabled="scope.row.disabled"
                    :maxlength="scope.row.maxlength"
                    v-model.trim="model[scope.row.key]"
                  ></el-input>
                  <el-button type="primary" @click="handleClickInputButton(scope.row.clickFnName)">{{scope.row.buttonText}}</el-button>
                </div>
              </template>
              <template v-else-if="scope.row.type === 'input'">
                <el-input
                  :disabled="scope.row.disabled || (flag === 'edit' && scope.row.editDisabled)"
                  :maxlength="scope.row.maxlength"
                  v-model.trim="model[scope.row.key]"
                ></el-input>
              </template>
              <template v-else-if="scope.row.type === 'select'">
                <el-select
                  v-model="model[scope.row.key]"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in optionsObj[scope.row.key]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-else-if="scope.row.type === 'phoneGroup'">
                <div
                  class="phone_item"
                  v-for="(item, index) in model[scope.row.key]"
                  :class="{ 'is-error': validatePhone(item) || (scope.row.required && phoneGroupRequired[scope.row.key] && index === 0) }"
                  :key="'phone-item-' + index"
                >
                  <div class="phone_item_content">
                    <el-input v-model="model[scope.row.key][index]" @input="phoneGroupChange(scope.row.key, scope.row.required)"></el-input>
                    <i
                      v-if="index === 0"
                      class="el-icon-circle-plus"
                      @click="addPhone(scope.row.key)"
                    ></i>
                    <i
                      v-else
                      class="el-icon-remove"
                      @click="removePhone(scope.row.key, index)"
                    ></i>
                  </div>
                  <span
                    v-show="validatePhone(item)"
                    class="phone_tips"
                  >请输入正确的号码</span>
                  <span
                    v-show="scope.row.required && phoneGroupRequired[scope.row.key] && index === 0"
                    class="phone_tips"
                  >请输入号码</span>
                </div>
              </template>
              <template v-else-if="scope.row.type === 'textarea'">
                <el-input
                  v-model="model[scope.row.key]"
                  type="textarea"
                  maxlength="100"
                  placeholder="请输入备注内容"
                  rows="5"
                  show-word-limit
                ></el-input>
              </template>
              <template v-else-if="scope.row.type === 'date'">
                <el-date-picker
                  v-model="model[scope.row.key]"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 100%"
                ></el-date-picker>
              </template>
              <template v-else-if="scope.row.type === 'radio'">
                <el-radio-group v-model="model[scope.row.key]">
                  <el-radio
                    v-for="(item, index) in scope.row.radios"
                    :key="scope.row.key + 'Radio' + index"
                    :label="item.label"
                  >
                    {{item.text}}
                  </el-radio>
                </el-radio-group>
              </template>
              <template v-else-if="scope.row.type === 'checkboxGroup'">
                <el-checkbox-group v-model="model[scope.row.key]">
                  <el-checkbox
                    v-for="(item, index) in scope.row.checkboxes"
                    :key="scope.row.key + 'Checkbox' + index"
                    :label="item.label"
                  ></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <span v-html="scope.row.sketch" class="fz_12"></span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <span v-html="scope.row.remark" class="fz_12"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="bottom_buttons">
        <el-button @click.native="back">返回</el-button>
        <el-button type="primary" @click.native="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as exFormValidators from "@/utils/exFormValidators.js";
import { fieldName } from "@/utils/fieldName";
export default {
  name: "ex-form",
  props: {
    flag: {
      type: String,
      default: "add",
    },
    config: Array,
    optionsObj: {},
  },
  data: () => ({
    fieldName: fieldName,
    model: {},
    tableData: [],
    rules: {},
    areaCodes: {},
    telNumber: {},
    extendPhone: {},
    // 保存各个电话组必填时的必填校验结果
    phoneGroupRequired: {},
  }),
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      },
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const config = this.config;
      config.map((item) => {
        const key = item.key;
        const type = item.type;
        const required = item.required;
        // 表单字段
        if (type === "selectGroup") {
          this.$set(this.model, key, "");
          // 省市县乡选择器组
          item.selectList.map((selectKey) => {
            this.$set(this.model, selectKey, "");
          });
        } else if (type === "phoneGroup") {
          // 电话组
          this.$set(this.model, key, [""]);
          required && this.$set(this.phoneGroupRequired, key, false);
        } else if (type === "checkboxGroup") {
          // 复选框组
          this.$set(this.model, key, []);
        } else {
          this.$set(this.model, key, "");
        }
        // 表单校验
        const rule = this.getRule(item);
        if (rule.length) {
          this.$set(this.rules, key, rule);
        }
        // 表格字段
        this.tableData.push(item);
      });
    },
    // 设置校验规则
    getRule({ key, required, type, label, disabled, editDisabled }) {
      let rule = [];
      // 必填项
      // 电话组单独自定义校验
      // 非编辑状态 或 编辑状态下不可编辑为否
      if (
        required &&
        type !== "phoneGroup" &&
        (this.flag !== "edit" || (this.flag === "edit" && !editDisabled))
      ) {
        rule.push({
          required: true,
          message: `请${
            type === "input" || (type === "inputButton" && !disabled)
              ? "输入"
              : "选择"
          }${label}`,
          trigger: type === "input" ? "blur" : "change",
        });
      }
      // 自定义规则
      if (
        exFormValidators[key] &&
        typeof exFormValidators[key] === "function"
      ) {
        rule.push({
          validator: exFormValidators[key],
          trigger: "blur",
        });
      }
      return rule;
    },
    tableRowClassName({ row }) {
      return this.model[row.dependentKey] === row.dependentValue
        ? ""
        : "hidden_row";
    },
    addPhone(key) {
      this.model[key].push("");
    },
    removePhone(key, index) {
      this.model[key].splice(index, 1);
    },
    handleClickInputButton(clickFnName) {
      this.$emit("handleClickInputButton", clickFnName);
    },
    handleSelectGroupChange(selectList, value, index) {
      const length = selectList.length;
      // 清空当前选择的所有下级数据
      for (let i = length - 1; i > index; i--) {
        this.model[selectList[i]] = "";
      }
      this.$emit("handleSelectGroupChange", selectList, value, index);
    },
    back() {
      this.$emit("back");
    },
    phoneGroupChange(key, required) {
      this.phoneGroupRequired[key] = required && !this.model[key].join("");
    },
    // 校验座机号码或手机号码
    validatePhone(val) {
      return (
        val &&
        (!/^\d{3,4}-\d{7,8}$/.test(val) &&
          !/^1\d{10}$|^0\d{2,3}-?\d{7,8}$/.test(val))
      );
    },
    // 单独校验电话组,返回出错的电话组所在的字段
    getErrorKey() {
      // 获取所有包含电话组的字段
      const keyList = this.config.reduce((pre, cur) => {
        return cur.type === "phoneGroup" ? [...pre, cur.key] : [...pre];
      }, []);
      // 电话组中必填的字段
      const requiredKeyList = this.config.reduce((pre, cur) => {
        return cur.type === "phoneGroup" && cur.required
          ? [...pre, cur.key]
          : [...pre];
      }, []);
      requiredKeyList.map((key) => {
        // 电话组中所有电话都没有录入，保存该电话组的值为true，代表必填校验不通过
        this.phoneGroupRequired[key] = !this.model[key].join("");
      });
      // 获取报错的电话组中的第一个
      let errorKey = "";
      keyList.some((key) => {
        // 电话组中有一个电话校验失败就返回
        if (this.model[key].some(this.validatePhone)) {
          errorKey = key;
          return true;
        }
        if (this.phoneGroupRequired[key]) {
          errorKey = key;
          return true;
        }
        return false;
      });
      return errorKey;
    },
    save() {
      this.$refs["form"].validate((valid, obj) => {
        if (valid) {
          const errorKey = this.getErrorKey();
          if (errorKey) {
            const dom = this.$refs[errorKey];
            dom.$el.scrollIntoView({
              //滚动到指定节点
              block: "center",
              behavior: "smooth",
            });
            return false;
          }
          this.$emit("validateSuccess");
        } else {
          const key = Object.keys(obj)[0];
          const errorKey = this.getErrorKey();
          // 插入电话组校验
          let scrollKey = "";
          if (errorKey) {
            // 所有的字段
            const keyList = this.config.reduce((pre, cur) => {
              return [...pre, cur.key];
            }, []);
            scrollKey =
              keyList.indexOf(key) > keyList.indexOf(errorKey) ? errorKey : key;
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
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table {
  td {
    padding: 20px 0;
    &:first-child {
      padding-bottom: 0px;
    }
  }
  .cell {
    padding-right: 30px;
    padding-left: 30px;
    overflow: auto;
  }
  .hidden_row {
    display: none;
  }
}
/deep/ .el-form {
  width: 100%;
  height: 100%;
  .el-radio {
    line-height: 30px;
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
.input_button_box {
  display: flex;
  justify-content: space-between;
  .el-input {
    flex: 1;
  }
  .el-button {
    margin-left: 10px;
  }
}
.phone_input_group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .short-line {
    width: 15px;
    border-bottom: 1px solid #e5eaf4;
  }
  .input_areaCodes {
    width: 80px;
  }
  .input_telNumber {
    width: 200px;
  }
}
.fz_12 {
  font-size: 12px;
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
.select_box {
  display: flex;
  justify-content: space-between;
  .el-select + .el-select {
    margin-left: 10px;
  }
}
/deep/ .el-form-item.is-success .el-input__inner {
  border-color: #e5eaf4;
  &:hover, &:active {
    border-color: #5458FD;
  }
}
</style>
