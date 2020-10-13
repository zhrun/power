<template>
  <div>
    <el-tree
      ref="tree"
      v-bind="$attrs"
      v-on="$listeners"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="expandOnClickNode"
      :highlight-current="true"
      node-key="uid"
      :indent="0"
    >
      <span
        class="tree-node"
        slot-scope="{ node, data }"
      >
        <span class="before_icon">
          <i 
            :class="[
              'iconfont',
              ...iconClass(data)
            ]"
          ></i>
        </span>
        <span class="node_name">{{ data[$attrs.props.label] }}</span>
        <span class="operation" v-if="btnList.length">
          <i
            v-for="(btn, index) in btnList"
            :key="'btn' + index"
            class="btn_icon"
            :class="btn.iconClassList"
            :title="btn.name"
            @click.stop="handleBtnClick(btn.id, data)"
          >
          </i>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "org-tree",
  props: {
    rootId: "",
    // 节点后面的按钮列表
    btnList: {
      type: Array,
      default: () => [
        {
          name: String, // 按钮名称
          id: String, // 操作名称，用于拼接操作回调名
          iconClassList: Array, // 按钮图标样式类名列表
        },
      ],
    },
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    expandOnClickNode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      unitTypeMap: {
        1: "iconwenjianjia2",
        2: "iconxingzhuang_16_kaobei",
        3: "iconxingzhuang_16_kaobei",
        4: "iconxingzhuang_16_kaobei",
      },
    };
  },
  methods: {
    handleBtnClick(data, id) {
      this.$emit("handleBtnClick", data, id);
    },
    iconClass(data) {
      if (data.level === 1) {
        return ["iconwenjianjia1", "root_icon"];
      }
      if (data.uid === this.rootId) {
        return ["iconwenjianjia1", "root_icon"];
      }
      return this.unitTypeMap[data.unitType];
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree {
  overflow: hidden;
  .tree-node {
    display: flex;
    align-items: center;
    .before_icon {
      margin-right: 10px;
      margin-top: 2px;
      .iconfont {
        font-size: 18px;
      }
      .root_icon {
        color: #ffb400;
      }
    }
    .operation {
      margin-left: 50px;
      vertical-align: middle;
      .btn_icon {
        margin-left: 20px;
        font-size: 20px;
        &:hover {
          color: #5458fe;
        }
      }
    }
  }
  .el-tree-node {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 100%;
      border-left: 1px dotted #999;
      left: -9px;
      top: -17px;
      bottom: 0px;
    }
    &::after {
      content: "";
      left: -9px;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-top: 1px dotted #999;
      height: 20px;
      top: 22px;
      width: 7px;
    }
    &:last-child {
      &::before {
        height: 38px;
      }
    }
    .el-tree-node__content {
      height: 44px;
      padding-left: 0px;
      position: relative;
      .el-tree-node__expand-icon {
        display: none;
      }
      .tree-node {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-tree-node__children {
      overflow: hidden;
      padding-left: 16px;
      // &::before {
      //   content: "";
      //   position: absolute;
      //   width: 1px;
      //   height: 13px;
      //   left: 7px;
      //   top: 30px;
      //   border-right: 1px dotted #999;
      // }
    }
  }
  & > .el-tree-node {
    &::after {
      border: none;
    }
  }
}
</style>
