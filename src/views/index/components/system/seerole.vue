<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 11:45:30
 * @LastEditTime: 2019-10-08 17:21:36
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <div class="limt">

        <el-scrollbar style="height:100%;">
        <p class="subTitle">{{name}} {{desc}}</p>
        <div class="listBox limit-dialog">
          <p><b>已有权限</b></p>
          <div class="tree-list">
            <el-tree
              class="filter-tree"
              :data="seeLimitObj.A"
              default-expand-all
              node-key="resourceName"
              ref="trees"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
        </el-scrollbar>
      </div>
       <div style=" text-align: center;">
        <el-button type="primary" @click="callBack" style="margin-left:20px; width:150px; margin-top:30px;margin-bottom:30px; " >返 回</el-button> 
      </div>  
    </div>    
    
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getroleAuthBatch,getResources} from '@/views/index/api/system/api.zr.js';
import { proKey } from '@/config/config.js';
import { treeData } from "@/utils/util.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "系统管理" },{ name: "角色管理", routerName: 'rolemanage' },{ name: "查看角色权限"}],
      versionLoading:false,
      proKey:proKey,
      allUser:[],
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      },
      seeLimitObj: { A: [], B: [], C: [], D: [], E: [] },
      name:"",
      desc:"",
      // seeLimitObj:[
      //   {
      //     uid: "1",
      //     resourceName: "根菜单",
      //     isShow: false,
      //     children: [{
      //       uid: 2,
      //       resourceName:"事件管理",
      //       isShow: false,
      //     }]
      //   }
      // ]
    };
  },
  mounted() {
    
  this.getroleAuthBatch(this.$route.params.uid)
  this.name=this.$route.params.name
  this.desc=this.$route.params.desc
  },
  methods: {
    callBack(){
        this.$router.go(-1);
    },
    getroleAuthBatch(d){
      getroleAuthBatch({
        proKey :this.proKey,
        uid:d
      }).then(res=>{
        if(res && res.data && res.data.roleAuthList.length>0){
          this.onSeeLimit(res.data)
        }
      })
    },
 
    //初始化数据 
    onSeeLimit (obj) { // 查看权限
      //  console.log(obj, 111)
      this.seeLimitObj.A = [];
      this.seeLimitObj.B = [];
      this.seeLimitObj.C = [];
      this.seeLimitObj.D = [];
      this.seeLimitObj.E = [];
       this.seeLimitObj.A=treeData(obj.roleAuthList)
      // this.seeLimitItem = Object.assign({}, obj);
      // obj.roleAuthList.forEach(item => {
      //   if (item.resourceLayer == 2) {
      //     this.seeLimitObj.A.push({
      //       uid: item.uid,
      //       resourceName: item.resourceName,
      //       isShow: false,
      //       children: []
      //     });
      //   }
      //   if (item.resourceLayer == 3) {
      //     this.seeLimitObj.B.push({
      //       uid: item.uid,
      //       parentUid: item.parentUid,
      //       resourceName: item.resourceName,
      //       isShow: false,
      //       children: []
      //     });
      //   }
      //   if (item.resourceLayer == 4) {
      //     this.seeLimitObj.C.push({
      //       uid: item.uid,
      //       parentUid: item.parentUid,
      //       resourceName: item.resourceName,
      //       isShow: false,
      //       children: []
      //     });
      //   }
      //   if (item.resourceLayer == 5) {
      //     this.seeLimitObj.D.push({
      //       uid: item.uid,
      //       parentUid: item.parentUid,
      //       resourceName: item.resourceName,
      //       isShow: false,
      //       children: []
      //     });
      //   }
      // });
      // // 2
      // this.seeLimitObj.A.forEach(a => {
      //   this.seeLimitObj.B.forEach(b => {
      //     if (a.uid === b.parentUid) {
      //       a.children.push(b);
      //     }
      //   })
      // })
      // // 3
      // this.seeLimitObj.A.forEach(a => {
      //   if (a.children && a.children.length > 0) {
      //     a.children.forEach(b => {
      //       this.seeLimitObj.C.forEach(c => {
      //         if (b.uid === c.parentUid) {
      //           b.children.push(c);
      //         }
      //       })
      //     })
      //   }
      // })
      // // 4
      // this.seeLimitObj.A.forEach(a => {
      //   if (a.children && a.children.length > 0) {
      //     a.children.forEach(b => {
      //       if (b.children && b.children.length > 0) {
      //         b.children.forEach(c => {
      //           this.seeLimitObj.D.forEach(d => {
      //             if (c.uid === d.parentUid) {
      //               c.children.push(d);
      //             }
      //           })
      //         })
      //       }
      //     })
      //   }
      // })
      // // 5
      // this.seeLimitObj.A.forEach(a => {
      //   if (a.children && a.children.length > 0) {
      //     a.children.forEach(b => {
      //       if (b.children && b.children.length > 0) {
      //         b.children.forEach(c => {
      //           if (c.children && c.children.length > 0) {
      //             c.children.forEach(d => {
      //               this.seeLimitObj.E.forEach(e => {
      //                 if (d.uid === e.parentUid) {
      //                   d.children.push(e);
      //                 }
      //               })
      //             })
      //           }
      //         })
      //       }
      //     })
      //   }
      // })
      //  console.log(this.seeLimitObj.A);
      // this.seeLimitDialogVisible = true;
    },
   
  }
};
</script>
<style lang="scss" scoped>
.limt{
  height: calc(100% - 80px);
}
.statistics {
  // height: 100%;
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
}
.limit-dialog {
    
   
      /deep/ .el-button {
        background: #0785FD;
        color: #fff;
      }
      /deep/ .el-icon-caret-right:before {
        content: '';
      }
      /deep/ .el-tree-node__expand-icon.is-leaf {
        background: none;
      }
      /deep/ .el-tree-node__expand-icon {
        background: url('../../../../assets/img/temp/expand.png') no-repeat;
      }
      /deep/ .el-tree-node__expand-icon.expanded {
        background: url('../../../../assets/img/temp/takeup.png') no-repeat;
        transform: none;
      }
      /deep/ .el-tree-node__label {
        margin-left: 5px;
      }
      /deep/ .el-checkbox__inner {
        margin-left: 5px;
      }
    }
</style>
<style>
.el-dialog__body{
  padding:30px 100px 0px 60px;
}
</style>