<template>
  <el-dialog
    title="位次详情"
    :visible.sync="visible"
    @close="close"
  >
    <div class="main">
      <el-table
        :data="sortIdList"
        border
        height="400px"
      >
        <!-- <el-table-column label="机构名称" prop="unitName"></el-table-column>
        <el-table-column label="位次" prop="sortId"></el-table-column> -->
        <el-table-column 
          v-for="(item,index) in defaultProps"
          :key="item.prop + index"
          :label="item.label"
          :prop="item.prop">
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SortIdDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    sortIdList: Array,
    defaultProps: {
      type: Array,
      default() {
        return [
          { label: "机构名称", prop: "unitName" },
          { label: "位次", prop: "sortId" },
        ];
      },
    },
  },
  data: () => ({
    visible: false,
  }),
  watch: {
    show(val) {
      this.visible = val;
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 500px;
}
.main {
  max-height: 60vh;
  overflow: auto;
}
</style>
