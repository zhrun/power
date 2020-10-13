<!-- 回执 -->

<template>
  <div>
    <el-dialog title="回执"  width="700px" :close-on-click-modal="false" class="receipt-dialog"   v-bind="$attrs" v-on="$listeners">
      <div class="common_content table-box">
        <el-scrollbar style="height:100%;width:100%">
          <el-table ref="receiptList" :data="receiptList" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="序号" type="index" width="70"></el-table-column>
            <el-table-column label="单位" prop="receiptUnit" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span v-show="scope.row.handleStatus==3 || scope.row.receiptPerson!=null">已读</span>
                <span v-show="scope.row.handleStatus==2 || scope.row.receiptPerson==null">未读</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="receiptPerson" width="100">
              <template slot-scope="scope">
                <span >{{scope.row.receiptPerson || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" prop="receiptTime" width="170">
              <template slot-scope="scope">
                <span v-if="scope.row.handleStatus==3 || scope.row.receiptPerson!=null">{{scope.row.receiptTime  }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>     
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'receipt',
  props:["receiptList"],
  data() {
    return {
      showReceipt:false,
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
