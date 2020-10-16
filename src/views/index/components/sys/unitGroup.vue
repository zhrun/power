<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <el-scrollbar style="height:100%;">
      
      <div class="clearfix">
        
          <div class="listBox limit-dialog"  style="float:left;">
            <el-scrollbar style="height:100%;">
              <el-form>
          <el-form-item label="权限组名称"  label-width="100px">
          <el-input v-model="groupName" autocomplete="off" class="wid20"></el-input>
        </el-form-item>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          
            <div class="tree-list">
              <el-tree
                class="filter-tree"
                :data="allLimitObj.A"
                show-checkbox
                check-strictly
                default-expand-all
                node-key="uid"
                ref="tree"
                @check-change="treeCheckChange"
                @check="treeCheck"
                :props="defaultProps">
              </el-tree>
            </div>
            </el-form>
            </el-scrollbar>
          </div>
      </div>
      <div>
        <el-button type="default" @click="callBack"  style="margin-left:20px; width:150px; margin-bottom:0px; " >取 消</el-button> 
        <el-button type="primary" @click="saveTree"  style="margin-left:20px; width:150px; margin-bottom:0px; " >保 存</el-button> 
        <!-- <el-button type="primary" @click="callBack" style="margin-left:20px;" >返 回</el-button>  -->
      </div>    
      </el-scrollbar>
    </div>    
    
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
// import { getRoleResources,getroleAuthBatch,getResources} from '@/views/index/api/system/api.zr.js';
import { getAuthResourcesById,addGroup } from '@/views/index/api/system/api.xy.js';

import { proKey } from '@/config/config.js';
import { treeData } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      permission:JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" },{ name: "角色管理", routerName: 'rolemanage' },{ name: "配置权限"}],
      versionLoading:false,
      proKey:proKey,
      allLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      allPermissions:[],
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      },
      defaultKeys:[],
      checkedKeys: [],
      groupName:"",
      checkAll: false,
      isIndeterminate: false,
      parentList:null
    };
  },
  mounted() {
    this.getAuthResourcesById()
    // console.log('uid',this.$route.params.uid);
    // this.getroleAuthBatch(this.$route.params.uid)
  },
  methods: {
    callBack(){
        this.$router.go(-1);
    },
    saveTree(){
      let checkKeys = this.$refs.tree.getCheckedKeys()
      let addKeys = [],delKeys = [];
      checkKeys.forEach(el=>{
        if(this.defaultKeys.indexOf(el)==-1){
          addKeys.push({
            opType: 1,
            uid: el
          })
        }
      })
      this.defaultKeys.forEach(el=>{
        if(checkKeys.indexOf(el)==-1){
          delKeys.push({
            opType: 3,
            uid: el
          })
        }
      })
      let d = {
        "authResourceInfoList": [],
        "proKey": this.proKey,
        "uid": JSON.parse(localStorage.getItem('vis_user_info')).uid,
        "systemCode":localStorage.getItem('systemCode'),
        "groupName":this.groupName,
      }
      d.authResourceInfoList = addKeys.concat(delKeys)
      if(d.authResourceInfoList.length<1) {
        this.$message({
          type: 'info',
          message: '无任何修改'
        })
        return;
      }
      
      this.addGroup(d)
      //  console.log(this.$refs.tree.getCheckedKeys());
    },
    addGroup(d){
      addGroup(d).then(res=>{
        // console.log('res',res);
        if(res && res.data){
          this.$message({
            type:"success",
            message:"权限修改成功"
          })
          this.defaultKeys=[]
          this.checkedKeys=[]
          // this.getroleAuthBatch(this.$route.params.uid)
          
        }
        
      })
    },
    // getroleAuthBatch(d){
    //   getroleAuthBatch({
    //     proKey :this.proKey,
    //     uid:d
    //   }).then(res=>{
    //     if(res && res.data && res.data.roleAuthList.length>0){
    //       // this.defaultKeys
    //       res.data.roleAuthList.forEach(el=>{
    //         this.defaultKeys.push(el.uid)
    //         this.checkedKeys.push(el.uid)
    //       })
    //       this.timer = setTimeout(() => {
    //         if(this.checkedKeys.length == this.allPermissions.length) {
    //           this.isIndeterminate = false;
    //           this.checkAll = true;
    //         } else if(this.checkedKeys.length>0 && this.checkedKeys.length<this.allPermissions.length) {
    //           this.isIndeterminate = true;
    //           this.checkAll = false;
    //         } else if(this.checkedKeys.length<=0) {
    //           this.isIndeterminate = false;
    //           this.checkAll = false;
    //         }
    //         this.$refs.tree.setCheckedKeys(this.defaultKeys);
    //       }, 100)
    //     }
    //   })
    // },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
      if(val) {
        this.checkedKeys = [...this.allPermissions];
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
      } else {
        this.checkedKeys = [];
        this.$refs.tree.setCheckedKeys(this.checkedKeys);
      }
    },
    treeCheck(a,b){
      //关联上下级是否要选中
      let curKeys = this.$refs.tree.getCheckedKeys()
      if(curKeys.indexOf(a.uid)>-1){
        
        let pid = a.parentUid
        if(curKeys.indexOf(pid)==-1){
          this.findParent(pid,curKeys)
          this.$refs.tree.setCheckedKeys(curKeys)
        }
      }else{
        if(a.children && a.children.length>0){
         this.chooseChild(a,curKeys)
        }
      }
    },
 
    findParent(idx,curKeys){
      let a = this.parentList.find(e=>e.uid == idx)
      if(a){
        curKeys.push(idx)
        if(a.parentUid  && a.resourceLayer!=0){
          this.findParent(a.parentUid,curKeys)
        }
      }
    },
    
    chooseChild(a,curKeys){
      // let curKeys = this.$refs.tree.getCheckedKeys()
      if(a.children && a.children.length>0){
        a.children.forEach(el=>{
          if(curKeys.indexOf(el.uid)>-1){
            curKeys.splice(curKeys.indexOf(el.uid),1); 
          }
          if(el.children && el.children.length>0){
            this.chooseChild(el,curKeys)
            
          }
        })
      }
      // return curKeys
      this.$refs.tree.setCheckedKeys(curKeys)
    },
    treeCheckChange(a,b,c) {
      
      let currentCheck = this.$refs.tree.getCheckedKeys();
      if(currentCheck.length == this.allPermissions.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else if(currentCheck.length>0 && currentCheck.length<this.allPermissions.length) {
        this.checkAll = false;
        this.isIndeterminate = true;
      } else if(currentCheck.length<=0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    },
  	// async getAuthResourcesById({ uid, proKey }) {
		// 	// async getLimitList() {
		// 	try {
		// 		const params = {
		// 			userId: JSON.parse(localStorage.getItem('vis_user_info')).uid,
		// 			proKey,
		// 			// platformType: this.loginType === '2' ? 1 : 2,
		// 		}
		// 		const { code, data } = await getAuthResourcesById(params)
		// 		// const { code, data } = this.resourceData;
		// 		if (code === '00000000') {
		// 			this.parentList = data
    //         data.forEach(item => {
    //           if (item.resourceLayer != 0) {
    //             this.allPermissions.push(item.uid);
    //           }
    //         })
    //          this.allLimitObj.A=treeData(data)
		// 		}
		// 	} catch (err) {
		// 		console.log(err)
		// 	}
		// },
    // 初始化数据 
    getAuthResourcesById(){
      this.allLimitObj.A = [];
      
      getAuthResourcesById({
         proKey :this.proKey,
         userId :JSON.parse(localStorage.getItem('vis_user_info')).uid,
        //  uid: this.$route.params.uid
      }).then(res=>{
        if (res) {
          this.parentList = res.data
            res.data.forEach(item => {
              if (item.resourceLayer != 0) {
                this.allPermissions.push(item.uid);
              }
            })
             this.allLimitObj.A=treeData(res.data)
            // console.log(this.allLimitObj.A)
            
          }
      })
    },
 
  
  }
};
</script>
<style lang="scss" scoped>
.statistics {
  position: relative;
}
.subTitle{
  font-size: 16px;
  color: #188FFB;
  padding-bottom: 10px;
  padding-left: 20px;
}
.listBox{
  border: 1px solid rgba(229,234,244,1);
  width: 40%;
  padding: 20px; 
  margin-left: 20px;
  margin-bottom: 20px;
  height: 65vh;
}
 .flt{
   float: left;
    width:200px;
    padding: 15px;
    height:70vh;
    margin-bottom: 10px;
    background:rgba(229,234,244,1);
    h3{
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0px;
    }
    .oncur{
      background: #ffffff;
      padding: 5px 10px;
      border-radius: 15px;
    }
  }
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
</style>
<style>
.el-dialog__body{
  padding:30px 100px 0px 60px;
}
.statistics .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>