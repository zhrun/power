<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 查看附件组件.
-->
<template>
  <div>
    <el-dialog title="查看附件" width="700px" :close-on-click-modal="false" class="reason-dialog" v-bind="$attrs" v-on="$listeners">     
      <el-table :data="attachList" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="附件名称" prop="originalFileName" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operation_btn" @click="download(scope.row.fileFullPath, scope.row.originalFileName)">下载</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'view-attach',
  props:{
    attachList:{
      type: Array,
      required: true
    }
  },
  data() {
    return {
      
    }
  },
  mounted(){

  },
  methods:{
    //下载
    download(url, filename) {
      let _this = this;
      this.getBlob(url, function(blob) {
        _this.saveAs(blob, filename);
      });
    },
    getBlob(url, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = function() {
        if (xhr.status === 200) {
          cb(xhr.response);
        }
      };
      xhr.send();
    },
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        var body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.reason-dialog{
  /deep/ .el-table {
    .el-table__header {
      width: 100% !important;
    }
    .el-table__body {
      width: 100% !important;
    }
  }
}
</style>
