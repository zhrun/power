<!-- 
* @author  ps_gen
* @Date: 2020-08-11 09:52:34
* @description 消息列表.
-->
<template>
<div>
  <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
  <div class="common_content">
    <el-scrollbar style="height:100%;">
      <el-form :inline="true">
        <el-form-item label="接收时间">
          <el-date-picker v-model="mDate" type="datetimerange" unlink-panels range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" style="width:400px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" style="width:200px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMessageList">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="common_table">
        <el-table :data="purchaseList" tooltip-effect="dark" style="width: 100%" v-loading="tableLoading">
          <el-table-column label="消息类型" prop="typeFlagName" show-overflow-tooltip></el-table-column>
          <el-table-column label="消息内容" prop="content" show-overflow-tooltip></el-table-column>
          <el-table-column label="接收时间" prop="sendTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="statusName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="lookDetail(scope.row)">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="onPageChange" :current-page.sync="pageNum"
          :page-size="pageSize" layout="prev, pager, next, jumper" :total="total" class="pagination_comp"></el-pagination>
      </div>
    </el-scrollbar>
  </div>
</div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue"
import { formatDate } from "@/utils/util.js";
import { getMessageList, putMessageRead } from "@/views/index/api/supplies/api.ps.js"
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "消息列表" }],
      mDate:null,
      status:null,
      statusOptions:[
        {
          value: null,
          label: '全部'
        },
        {
          value: 1,
          label: '未读'
        },
        {
          value: 2,
          label: '已读'
        },
      ],
      statusObj:{1:"未读",2:"已读"},
      purchaseList:[],
      tableLoading:false,
      pageNum:1,
      pageSize:10,
      total:0,
      typeObj:{1:"库存预警通知",2:"保质期预警通知",3:"入库通知（采购单）",4:"入库通知（入库单）",5:"出库通知",6:"审核通知（入库单）",7:"审核通知（出库单）",8:"拆卸通知",9:"组装通知",10:"盘点通知"},
      danweiManage:{1:"storageWarning",2:"expiringDateWarnig"},//1库存预警通知\2保质期预警通知
      cangkuManage:{2:"shelfWarning",3:"purchaseDetail",6:"inStorageDetail",7:"outStorageDetail"},//2库存预警通知\3入库通知（采购单）\6审核通知（入库单）\7审核通知（出库单）
      cangkuStaff:{4:"inStorageDetail",5:"outStorageDetail",8:"aAndDDetail",9:"aAndDDetail",10:"inventoryDetail"},//4入库通知（入库单）\5出库通知\8拆卸通知\9组装通知\10盘点通知
      unionInfo:{2:"shelfWarning",3:"purchaseDetail",4:"inStorageDetail",5:"outStorageDetail",6:"inStorageDetail",7:"outStorageDetail", 8:"aAndDDetail",9:"aAndDDetail",10:"inventoryDetail"}//仓库管理员也是仓库员工
    };
  },
  mounted() {
    this.getMessageList()
  },
  methods: {
    getMessageList(){
      let that=this
      that.purchaseList=[]
      that.tableLoading=true
      let startTime=null, endTime=null
      if (that.mDate) {
        startTime = that.mDate[0]? formatDate(that.mDate[0], "yyyy-MM-dd HH:mm:ss"): null
        endTime = that.mDate[1]? formatDate(that.mDate[1], "yyyy-MM-dd HH:mm:ss"): null
      }
      let params={
        "where.startDate": startTime,
        "where.endDate": endTime,
        "where.status": that.status,
        "pageNum": that.pageNum,
        "pageSize": that.pageSize,
      }
      getMessageList(params).then((res)=>{
        that.tableLoading=false
        if(res && res.code==="00000000") {
          that.total=res.data.total
          if(res.data.list && res.data.list.length>0){
            res.data.list.map((item)=>{
              let unit={}
              unit.uid=item.uid
              unit.objUid=item.objUid
              unit.type=item.type
              unit.typeFlagName=that.typeObj[parseInt(item.type)]
              unit.content=item.content || "-"
              unit.sendTime=item.sendTime || "-"
              unit.statusName=that.statusObj[parseInt(item.status)]
              that.purchaseList.push(unit)
            })
          }
        }
      }).catch((error)=>{
        that.tableLoading=false
        console.log("接口报错=>",error)
      })
    },
    resetForm(){
      this.mDate=null
      this.status=null
      this.getMessageList()
    },
    onPageChange(page){
      this.pageNum = page
      this.getMessageList()
    },
    lookDetail(obj){
      let roleList=JSON.parse(localStorage.getItem('vis_user_info')).roleList, roler=null
      if(roleList && roleList.length>0){
        if(roleList.length==1){
          roleList.map((item)=>{
            if(item.uid=="1U3J4OH2uRhAFcELLfyzFr"){
              roler=1   //单位管理员
            }else if(item.uid=="2k2hCFSLyC4fQgfOqmbhdR"){
              roler=2   //仓库管理员
            }else if(item.uid=="64I8Eemfyr38rwIaIUP96Y"){
              roler=3   //仓库员工
            }
          })
        }else if(roleList.length==2){
          roler=4   //仓库管理员 & 仓库员工
        }
      }
      putMessageRead(obj.uid).then((res)=>{
        console.log("已读=>",res)
      }).catch((error)=>{
        console.log("接口报错=>",error)
      })
      if(roler==1){
        this.$router.push({ name: this.danweiManage[parseInt(obj.type)], query:{uid: obj.objUid} })
      }else if(roler==2){
        this.$router.push({ name: this.cangkuManage[parseInt(obj.type)], query:{uid: obj.objUid} })
      }else if(roler==3){
        this.$router.push({ name: this.cangkuStaff[parseInt(obj.type)], query:{uid: obj.objUid} })
      }else if(roler==4){
        this.$router.push({ name: this.unionInfo[parseInt(obj.type)], query:{uid: obj.objUid} })
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.opt-btn{
  display: flex;
  flex-direction: row;
}
</style>
