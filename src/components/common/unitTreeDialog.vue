<template>
  <el-dialog
    title="选择"
    :visible.sync="visible"
    @close="close"
  >
    <div class="dialog_main">
      <el-tree
        ref="tree"
        width="500px"
        :data="unitData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :disabled="disabled"
        default-expand-all
        node-key="uid"
        highlight-current
      >
        <span class="tree-node" slot-scope="{ node, data }" >
          <el-radio v-model="curUid" :label="data.uid" :disabled="data.disabled">
            {{data.unitName}}
          </el-radio>
        </span>
      </el-tree>
    </div>
    <div slot="footer" class="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "UniTreeDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    unitData: {
      type: Array,
      default: () => ({}),
    },
    currentUid: {
      type: String,
      default: "",
    },
    disabled: {
      type: String,
      default: "disabled",
    },
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        children: "childList",
        label: "unitName",
      },
      curUid: "",
    };
  },
  watch: {
    show(val) {
      this.visible = val;
    },
    currentUid(val) {
      this.curUid = val;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    cancel() {
      this.close();
    },
    confirm() {
      const curUid = this.curUid;
      const curData = this.getCurData(this.unitData, curUid);
      this.$emit("confirm", curData);
    },
    getCurData(list, uid) {
      let res = list.find((it) => it.uid === uid);
      if (!res) {
        list.some((it) => {
          const findRes = this.getCurData(it.childList, uid);
          if (findRes) {
            res = findRes;
            return true;
          }
        });
      }
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 500px;
}
.dialog_main {
  height: 300px;
  overflow: auto;
}
</style>
