<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-25 11:45:30
 * @LastEditTime: 2019-10-08 11:54:14
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="statistics">
    <visBreadcrumb :breadcrumbData="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      
      <div class="body">
        <div class="nothing"  v-show="allLimitObj.A && allLimitObj.A.length === 0">
          <img src="../../../../assets/img/temp/nothing.png" />
          <p>亲爱的主人，您暂无权限哦!</p>
          <div class="create-authority" @click="createFirstLimit">创建权限</div>
        </div>
        <div class="body-content " v-show="allLimitObj.A && allLimitObj.A.length > 0">
          <p class="title">权限资源管理 
          <el-button  @click="createFirstLimit" class="addsys">创建子系统资源</el-button>

          </p>
          <!-- <div class="flt" style="float:left;">
            <h3>权限组</h3>
            <p class="oncur">默认组</p>
          </div> -->
          <div class="body-detail">
            <div style="height:100%">
              <el-scrollbar style="height:100%;">
                <el-tree
                :data="allLimitObj.A"
                node-key="uid"
                :props="defaultProps"
                :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ data.resourceName }}</span>
                  <span class="operation">
                    <i class="icon-xinzeng- el-icon-circle-plus-outline icon-hover"  @click="onAddLimit(data)" title="添加" ></i>
                    <i class="icon-xiugai-1 el-icon-edit icon-hover" @click="onEditRole(data)" title="编辑"></i>
                    <i class="icon-shanchu- el-icon-delete icon-hover"  @click="onDeleteLimit(data)" title="删除"></i>
                  </span>
                </span>
              </el-tree>
              </el-scrollbar>
            </div>
              
          </div>
        </div>
      </div>
     
    </div>    
     <!-- 添加权限弹框 -->
      <el-dialog
        title="创建权限"
        class="new-department"
        :visible.sync="addLimitDialogVisible"
        width="400px"
        :destroy-on-close="true"
        center>
        <el-form class='add-depart-form' :model="addForm" :rules="rules" ref="ruleForm" >
          <el-form-item label="权限名称" label-width='85px' prop="resourceName">
            <el-input type="text" v-model="addForm.resourceName" placeholder='请输入权限名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="权限类型" label-width='85px' prop="resourceType">
            <el-select placeholder="请选择权限类型" style='width: 98%' v-model="addForm.resourceType">
              <el-option label="菜单" :value="1"></el-option>
              <el-option label="按钮" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由名称" label-width='85px' prop="routeName">
            <el-input type="text" v-model="addForm.routeName" placeholder='请输入路由名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="样式名称" label-width='85px' prop="style">
            <el-input type="text" v-model="addForm.style" placeholder='请输入路由名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="登录端" label-width='85px' prop="platformType">
            <el-checkbox-group v-model="addForm.platformType">
              <el-checkbox label="1">web普通用户</el-checkbox>
              <el-checkbox label="2">web管理员</el-checkbox>
              <el-checkbox label="3">app端</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label-width='85px' v-show="isShowError">
            <div class="error-msg">
              <i class="el-icon-error"></i>
              <span>{{errorMsg}}</span>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer double-btn-80">
          <el-button class="sureBtn" @click="addLimitDialogVisible = false">取 消</el-button>
          <el-button class="noSureBtn" :loading="isAddLoading" @click="onConfirmAddLimit('ruleForm')">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 编辑权限弹框 -->
      <el-dialog
        title="编辑权限"
        class="new-department"
        :visible.sync="editLimitDialogVisible"
        width="400px"
        :destroy-on-close="true"
        center>
        <el-form class='add-depart-form' :model="editLimitItem"  :rules="rules" ref="ruleEdForm">
          <el-form-item label="权限名称" label-width='85px' prop="resourceName">
            <el-input type="text" v-model="editLimitItem.resourceName" placeholder='请输入权限名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="权限类型" label-width='85px' prop="resourceType">
            <el-select placeholder="请选择权限类型" style='width: 98%' v-model="editLimitItem.resourceType">
              <el-option label="菜单" :value="1"></el-option>
              <el-option label="按钮" :value="2"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="路由名称" label-width='85px' prop="routeName">
            <el-input type="text" v-model="editLimitItem.routeName" placeholder='请输入路由名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="系统CODE" label-width='85px' prop="systemCode">
            <el-input type="text" v-model="editLimitItem.systemCode" placeholder='请输入路由名称' style='width: 98%'></el-input>
          </el-form-item>
          <el-form-item label="样式名称" label-width='85px' prop="style">
            <el-input type="text" v-model="editLimitItem.style" placeholder='请输入路由名称' style='width: 98%'></el-input>
          </el-form-item>
           <el-form-item label="登录端" label-width='85px' >
            <el-checkbox-group v-model="editLimitItem.platformType">
              <el-checkbox label="1">web普通用户</el-checkbox>
              <el-checkbox  label="2">web管理员</el-checkbox>
              <el-checkbox  label="3">app端</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label-width='85px' v-show="isShowError">
            <div class="error-msg">
              <i class="el-icon-error"></i>
              <span>{{errorMsg}}</span>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer double-btn-80">
          <el-button class="sureBtn" @click="editLimitDialogVisible = false">取 消</el-button>
          <el-button class="noSureBtn" :loading="isEditLoading" @click="onConfirmEditLimit('ruleEdForm')">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 删除权限弹框 -->
      <el-dialog
        title="删除"
        :visible.sync="deleteLimitdialogVisible"
        width="340px"
        center>
        <span style='text-align:center;color:#333333;font-size:14px'>是否确定删除该权限?</span>
        <p style='text-align:center;color:#999999;font-size:12px;margin-top:10px'>删除后数据不可恢复</p>
        <span slot="footer" class="dialog-footer">
          <el-button class="sureBtn" @click="deleteLimitdialogVisible = false">取 消</el-button>
          <el-button class="noSureBtn" :loading="isDeleteLoading" @click="onConfirmDelete">确 认</el-button>
        </span>
      </el-dialog>
    
  </div>
</template>
<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { getResources,createResources,updateResources,delResources} from '@/views/index/api/system/api.zr.js';
import { proKey } from '@/config/config.js';
import { treeData } from "@/utils/util.js";
// import {resouceData} from '@/config/data.js';
export default {
  components: { visBreadcrumb },
  data() {
    return {
      rules: {
          resourceName: [
            { required: true, message: '该项不可为空', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          resourceType:[
            {required: true, message: '该项不可为空', trigger: 'change' }
          ]
         
        },
      permission:JSON.parse(localStorage.getItem("permission")),
      breadcrumbData: [{ name: "系统管理" },{ name: "权限资源管理"}],
      proKey:proKey,
      resourceBtn: {},
      // resouceData: resouceData,
      isAddLoading: false, // 添加权限加载中
      isDeleteLoading: false, // 删除权限加载中
      isEditLoading: false, // 编辑权限加载中
      allLimitObj: { A: null, B: [], C: [], D: [], E: [] },
      deleteLimitdialogVisible: false, // 删除权限
      editLimitDialogVisible: false, // 编辑权限
      addLimitDialogVisible: false, // 创建权限
      addForm: {
        resourceName: null,
        resourceType: null,
        path: '',
        style: '',
        parentUid: null,
        routeName:'',
        platformType:[],
        systemCode:null
      },
      isShowError: false,
      errorMsg: '',
      editLimitItem: {},
      deleteItem: {},
      limitDataList: [], // 所有的权限数据
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      },
      isDrag: false,
      params: {},
      startNodeLayer: null,
      startParentId: null,
      checkedResource: null // 可以拖动的节点名称
    };
  },
   created () {
    this.resourceBtn = JSON.parse(sessionStorage.getItem('resourcebtn'));
  },
  mounted () {
    this.getAuthorityList();
  },
  methods: {
    
    createFirstLimit () {
      
      this.addForm.resourceName = null;
      this.addForm.resourceType = null;
      this.addLimitDialogVisible = true;
      
    },
    onConfirmDelete () { // 确认删除权限
      if (this.deleteItem.uid) {
        this.isDeleteLoading = true;
        delResources({
          uid: this.deleteItem.uid,
          proKey:this.proKey
        }).then(res => {
            if (res && res.code=="00000000") {
              this.$message.success('删除成功');
              this.getAuthorityList();
              this.deleteLimitdialogVisible = false;
              this.isDeleteLoading = false;
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {});
        // this.axios.delete('A2/authServices/authResource?uid=' + this.deleteItem.uid)
          
      }
    },
    onConfirmEditLimit (formName) { // 确认编辑权限
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isEditLoading = true;
            let params = {
              resourceName: this.editLimitItem.resourceName,
              resourceType: this.editLimitItem.resourceType,
              path: this.editLimitItem.path,
              style: this.editLimitItem.style,
              uid: this.editLimitItem.uid,
              proKey:this.proKey,
              systemCode:this.editLimitItem.systemCode || null,
              routeName:this.editLimitItem.routeName,
              platformType:this.editLimitItem.platformType.toString()
            }
            updateResources(params).then(res => {
                if (res) {
                  this.$message.success('修改成功');
                  this.getAuthorityList();
                  this.editLimitDialogVisible = false;
                  this.isEditLoading = false;
                } else {
                  this.isEditLoading = false;
                }
              })
              .catch(() => {})
          } else {
            console.log('error submit!!');
            return false;
          }
        });

     
    },
    onConfirmAddLimit (formName) { // 确认添加权限
      
      // onConfirmAddLimit
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isAddLoading = true;
            this.addForm.proKey= this.proKey
            this.addForm.platformType = this.addForm.platformType.toString()
            createResources(this.addForm)
              .then(res => {
                if (res) {
                  this.$message.success('新增成功');
                  this.getAuthorityList();
                  this.addLimitDialogVisible = false;
                  this.isAddLoading = false;
                } else {
                  this.isAddLoading = false;
                }
              })
              .catch(() => {})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
   
    getAuthorityList () { // 获取权限列表
      
      this.allLimitObj.B = [];
      this.allLimitObj.C = [];
      this.allLimitObj.D = [];
      this.allLimitObj.E = [];
      getResources({
        proKey :this.proKey
      }).then(res=>{
        if (res && res.data && res.data.length>0) {
          this.allLimitObj.A = [];
            this.limitDataList = res.data;
            
            this.allLimitObj.A=treeData(this.limitDataList)
            console.log(this.allLimitObj.A)
          }
      }).catch(() => {})
    
        
        // console.log('A', this.allLimitObj.A)
    },
    onAddLimit (obj) { // 添加权限
      this.addForm.resourceName = null;
      this.addForm.resourceType = null;
      this.addForm.path = null;
      this.addForm.style = null;
      this.addLimitDialogVisible = true;
      this.isShowError = false;
      this.errorMsg = '';
      if (obj.uid) {
        this.addForm.parentUid = obj.uid;
      }
    },
    onEditRole (obj) { // 编辑权限
      this.editLimitDialogVisible = true;
      this.isShowError = false;
      this.errorMsg = '';
      this.editLimitItem = Object.assign({}, obj);
      this.editLimitItem.platformType = obj.platformType?obj.platformType.split(","):[]
    },
    onDeleteLimit (obj) { // 删除权限
      this.deleteItem = Object.assign({}, obj);
      this.deleteLimitdialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
  .common_content {
    padding: 20px;
    // height: 100%;
    .header {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .body {
      width: 100%;
      background: #fff;
      min-height: 95%;
      position: relative;
      overflow: auto;
      .nothing {
        // position: absolute;
        text-align: center;
        left: 45%;
        top: 35%;
        p {
          color: #999999;
          font-size: 14px;
          margin: 20px 0;
        }
        .create-authority {
          color: #fff;
          background: #0785FD;
          width: 100px;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
          border-radius: 2px;
          cursor: pointer;
        }
      }
      .body-content {
        padding:0px 40px;
        .title {
          font-size: 16px;
          color: #333333;
          margin: 20px 0px;
          position: relative;
          .addsys{
            position: absolute;
            right: 0;
            top: -10px;
          }
        }
        .body-detail {
          border: 1px solid #E7EAEC;
          width: 100%;
          padding: 30px;
          height: 70vh;
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
          /deep/ .custom-tree-node {
            margin-left: 8px;
            height: 100%;
            width: 280px;
            display: flex;
            justify-content: space-between;
            >span {
              color: #333333;
              font-size: 14px;
            }
          }
          /deep/ .el-tree-node__content {
            height: 32px;
            line-height: 32px;
            // padding-left: 5px !important;
          }
          /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
            margin-left: 6px;
          }
          /deep/ .el-tree-node__content:hover {
            background: #E6F7FF;
            .operation {
              display: block;
            }
          }
          .operation {
            margin-right: 30px;
            display: none;
          }
        }
      }
    }
    /deep/ .el-dialog__header {
      background: #F0F0F0 !important;
      text-align: left !important;
      color: #555555;
      font-weight: bold;
      font-size: 16px;
    }
    /deep/  .el-dialog--center .el-dialog__body {
      text-align: center !important;
      padding: 25px 25px 10px;
    }
    .noSureBtn {
      background:#0785FD;
      height:35px;
      color: #fff;
      line-height: 10px;
    }
    .sureBtn {
      border-color:#e5e5e5;
      height:35px;
      line-height: 10px;
      color:#666666;
    }
    .new-department {
      .add-depart-form {
        width: 100%;
        /deep/ .el-form-item__label {
          text-align: right;
          line-height: 32px;
        }
        /deep/ .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
        /deep/ .el-form-item {
          margin-bottom: 10px;
        }
        /deep/ .el-form-item label:after {
          content: '*';
          color: #f56c6c;
          margin-left: 4px;
        }
        /deep/ .add-depart-form-normal.el-form-item label:after {
          content: '';
          color: #f56c6c;
          margin-left: 4px;
        }
        .error-msg {
          width: 98%;
          height:32px;
          line-height: 32px;
          text-align: left;
          background: #FFF6F6;
          padding-left: 10px;
          border: 1px solid #FDC9C9;
          border-radius: 3px;
          i {
            color: #FF0000;
          }
          span {
            color: #FF0000;
            font-size: 12px;
          }
        }
      }
    }
    .icon-hover {
      font-size: 24px;
      line-height: 30px;
      color: #BBBBBB;
    }
    .icon-hover:hover {
      color: #0785FD;
    }
  }
  .flt{
    width:200px;
    padding: 15px;
    height:60vh;
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
</style>

<style>
.el-dialog__body{
  padding:30px 100px 0px 60px;
}
</style>