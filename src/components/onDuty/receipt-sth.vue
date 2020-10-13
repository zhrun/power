<!-- 
* @author  ps_gen
* @Date: 2020-07-07 10:52:34
* @description 回执.
-->
<template>
  <div>
    <el-dialog title="回执" width="700px" :close-on-click-modal="false" class="receipt-dialog" v-bind="$attrs" v-on="$listeners">
      <div class="common_content table-box">
        <el-scrollbar style="height:100%;width:100%">
          <el-table ref="receiptList" :data="receiptList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="单位" prop="receiptUnit" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span v-show="scope.row.receiptPerson!='-'" class="y-finish"><i></i> 已读</span>
                <span v-show="scope.row.receiptPerson=='-'" class="n-finish"><i></i> 未读</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="receiptPerson" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="时间" prop="receiptTime" width="170"></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>     
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'receipt-sth',
  props:{
    receiptList:{
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
  }
}
</script>
<style lang="scss" scoped>
.receipt-dialog{
  /deep/ .el-dialog__body{
    padding: 30px;
  }
  .common_content{
    padding: 0;
  }
  .table-box{
    width: 100%;
    min-height: 300px;
    height: 360px;
  }
  /deep/ .el-scrollbar__wrap{
    margin-right: -19px !important;
  }
}
</style>
