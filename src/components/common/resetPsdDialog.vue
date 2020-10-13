<template>
  <el-dialog
    title="重置密码"
    :visible.sync="visible"
    @close="close"
    width="400px"
  >
    <el-form :model="model" :rules="rules" ref="form">
      <el-form-item label="新密码" prop="newPsd">
        <el-input show-password clearable v-model="model.newPsd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPsd">
        <el-input show-password clearable v-model="model.confirmPsd" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer_buttons">
      <el-button @click="cancel">取消</el-button>
      <el-button @click="confirm" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _debounce from "lodash/debounce";

export default {
  name: "resetPsdDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const self = this;
    const validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length > 16 || value.length < 6) {
        callback(new Error("密码长度为6到16位"));
      } else if (
        !/[a-z]+/.test(value) ||
        !/[A-Z]+/.test(value) ||
        !/[0-9]+/.test(value)
      ) {
        callback(new Error("密码应包含大小写字母和数字"));
      } else {
        callback();
      }
    };
    const confirmPsd = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请再次输入密码"));
      } else if (value !== self.model.newPsd) {
        return callback(new Error("两次输入密码不一致!"));
      }
      callback();
    };
    return {
      visible: false,
      model: {
        newPsd: "",
        confirmPsd: "",
      },
      rules: {
        newPsd: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
          {
            validator: validatePwd,
            trigger: "blur",
          },
        ],
        confirmPsd: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
          {
            validator: confirmPsd,
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    show(val) {
      this.visible = val;
      if (val) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
      }
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    cancel() {
      this.close();
    },
    confirm: _debounce(function() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const newPsd = this.model.newPsd;
          this.$emit("confirm", newPsd);
        }
      });
    }, 100),
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 22px!important;
}
</style>
