<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
      <!-- <el-scrollbar style="height:100%;"> -->
        <el-form
          class="full_height"
          label-width="110px"
          :model="formData"
          ref="formData"
          :rules="formRule">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="盘点单名称" prop="checkListName">
                <el-input
                  type="text"
                  placeholder="请输入盘点单名称"
                  maxlength="20"
                  v-model="formData.checkListName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="计划盘点日期" prop="dateTime">
                <el-date-picker
                style="width:100%"
                  v-model="formData.dateTime"
                  type="daterange"
                  align="right"
                  format="yyyy-MM-dd"
                  :clearable="false"
                  @change="changeData"
                  :picker-options="pickerOptionsStart"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="盘点人员" prop="checkerUid">
                <el-select v-model="formData.checkerUid" style="width: 100%">
                  <!-- <el-option label="有才" value="3MWLCYEKooO1FE86gwTA60" ></el-option> -->
                  <el-option v-for="item in userList" :label="item.userName" :value="item.userUid" :key="item.userUid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              rows="3"
              placeholder="请备注相关信息"
              maxlength="100"
              v-model="formData.remark"
              style="width:100%"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="盘点范围" class="itembox" prop="rangeFlag">
            <el-tabs v-model="formData.rangeFlag" :before-leave="changeTab" class="objtabs">
              <el-tab-pane label="按库位选" name="1">
                <div class="conts flex">
                  <div class="boxLeft">
                    <p class="title">
                      <!-- <label for="">
                      </label> -->
                        <el-checkbox v-model="leftchecked" @change="allLeft">全部</el-checkbox>
                      <span v-if="total">{{total}}个</span>
                    </p>
                    <div class="teBox">
                      <el-scrollbar style="height:100%;">
                      <el-tree
                        :data="resData"
                        show-checkbox
                        default-expand-all
                        node-key="uid"
                        ref="restree"
                        highlight-current
                        :draggable="false"
                        :allow-drop="allowDrop"
                        :props="defaultProps"
                        @check-change="changeItem"
                        >
                      </el-tree>
                       </el-scrollbar>
                    </div>
                  </div>
                  <div class="boxCenter">
                    <div class="btFlex">
                      <el-button @click="deleteList" :disabled="dele" type="primary" icon="el-icon-arrow-left"></el-button>
                      <el-button  @click="addList" type="primary" :disabled="addl" icon="el-icon-arrow-right"></el-button>
                      <!-- <span  dis><i class="el-icon-arrow-left"></i></span>
                      <span><i class="el-icon-arrow-right"></i></span> -->
                    </div>
                  </div>
                  <div class="boxRight">
                    <p class="title">
                      <label for="">
                        <el-checkbox v-model="rightchecked"  @change="allRight">全部</el-checkbox>
                      </label>
                      <span v-if="checktotal">{{checktotal}}个</span>
                    </p>
                    <div class="teBox">
                      <el-scrollbar style="height:100%;">
                    <el-tree
                      :data="checkData"
                      show-checkbox
                      default-expand-all
                      node-key="uid"
                      ref="checktree"
                      highlight-current
                      :draggable="false"
                       @check-change="changeItem2"
                      :allow-drop="allowDrop"
                      :props="defaultProps">
                    </el-tree>
                    </el-scrollbar>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="按资源选" name="2">
                <div class="conts" v-if="formData.rangeFlag=='2'">
                  <el-transfer
                    filterable
                     :titles="['全部物资装备', '已选物资装备']"
                    :filter-method="filterMethod"
                    filter-placeholder="请搜索物资装备名称"
                    v-model="data2value"
                    :props="defaultprop"
                    :data="allResData" class="transferbox">
                  </el-transfer>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>

          <el-form-item  label-width="0px" class="ment_center">
            <el-button @click="resetForm('formData')">取消</el-button>
            <el-button type="primary" @click="submitForm('formData',1)">保存</el-button>
            <el-button type="primary" @click="submitForm('formData',2)">发布</el-button>
          </el-form-item>
        </el-form>
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { createCheck, updateCheck, queryResourceList,queryWareUserList, queryLocationList,queryCurWarehouseList,queryCheck} from "@/views/index/api/supplies/api.zr.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "仓储管理" },{ name: "盘点管理", routerName: "inventoryManage" },
        { name: "新增" }],
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      // activeName: 'first',
     pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 24*60*60*1000;
        }
      },
      userList:[],
      formData: {
         dateTime:[],
        checkListName:'',
        checkStartTime:'',
        checkEndTime:'',
        checkerUid:'',
        rangeFlag:'1',
        remark:'',
        checkScopeList:[],
        statusFlag:'1',
      },
      formRule: {
        checkerUid: [{ required: true, message: "该项不可为空", trigger: "blur" }],
        dateTime: [{ required: true, message: "该项不可为空", trigger: "blur" }],
        checkListName: [{ required: true, message: "该项不可为空", trigger: "blur" }],
      },
      leftchecked:false,
      rightchecked:false,
      resData:[],
      checkData:[],
      defaultProps: {
        children: 'children',
        label: 'locationName',
      },
      defaultprop: {
        key: 'uid',
        label: 'resourceName'
      },
      data2value: [],
      wareUid:null,
      total:null,
      checktotal:null,
      rescoureData:[],
      allResData:[],
      filterMethod(query, item) {
        return item.resourceName.indexOf(query) > -1;
      },
      dele:true,
      addl:true,
      detailData:null
    };
  },
  mounted() {
    this.queryCurWarehouseList()
   
    if(this.$route.query.edit){
      this.breadcrumbData= [{ name: "仓储管理" },{ name: "盘点管理", routerName: "inventoryManage" },
        { name: "编辑" }]
    }
  },
  methods: {
    allLeft(v){
      if(v){
        let arrs=[]
        this.resData.forEach(el=>{
          arrs.push(el.uid)
          let a = el.children.map(e=>e.uid)
          arrs = [...arrs,...a]
        })
        
        this.$refs.restree.setCheckedKeys(arrs);
      }else{
        this.$refs.restree.setCheckedKeys([]);
      }
      
    },
    allRight(v){
      if(v){
        let arrs=[]
        this.checkData.forEach(el=>{
          arrs.push(el.uid)
          let a = el.children.map(e=>e.uid)
          arrs = [...arrs,...a]
        })
        this.$refs.checktree.setCheckedKeys(arrs);
      }else{
        this.$refs.checktree.setCheckedKeys([]);
      }
    },
    async queryCheck(d){
       const {code, data } = await queryCheck(d)
       if(code ==='00000000'){
        this.detailData = data
        
        this.formData.checkListName=data.checkListName
        this.formData.checkerUid=data.checkerUid
        this.formData.rangeFlag=data.rangeFlag
        this.formData.remark=data.remark
        this.formData.checkEndTime=data.checkEndTime
        this.formData.checkStartTime=data.checkStartTime
        
        if(this.$route.query.edit){
           this.formData.uid =  data.uid
           this.formData.dateTime=[data.checkStartTime,data.checkEndTime]
        }else{
          this.formData.uid =  null
        }
        if(data.rangeFlag=="2"){
          data.checkScopeList.map(pp=>{
            this.data2value.push(pp.objUid)
          })
          // this.data2value = scopeData 
          //  console.log('this',scopeData);
        }else{
          //this.rescoureData 原数据
          //this.resData 左数据
          //this.checkData 右数据
          let scopeData = data.checkScopeList.map(pp=>pp.objUid)
          scopeData.forEach(e=>{
            this.formData.checkScopeList.push({
              "objUid": e,
           })
          })

          this.rescoureData.forEach(el=>{
            el.childList.map(v=>{
              v.locationName = `${v.locationName}(${v.categoryCount || 0}种)`
              if(scopeData && scopeData.indexOf(v.uid)==-1){
                let a = this.resData.findIndex(o=>o.uid==el.uid)
                if(a>-1){
                  this.resData[a].children.push(v)
                }else{
                  this.resData.push({
                    uid:el.uid,
                    locationName:el.locationName,
                    children:[v],
                    parentUid:el.parentUid || null,
                    locationFlag:el.locationFlag,
                  })
                }
              }else{
                let a = this.checkData.findIndex(o=>o.uid==el.uid)
                if(a>-1){
                  this.checkData[a].children.push(v)
                }else{
                  this.checkData.push({
                    uid:el.uid,
                    locationName:el.locationName,
                    children:[v],
                    parentUid:el.parentUid || null,
                    locationFlag:el.locationFlag,
                  })
                }
              }
            })
          })
         
          
        }
        // checkerUid:'',
        // rangeFlag:'1',
        // remark:'',
        // checkScopeList:[],
       
      }
    },
    //查询所有物资
    async queryResourceList(d){
       const {code, data } = await queryResourceList(d)
       if(code ==='00000000'){
        this.allResData = data.list
      }
    },
    //查询所有员工用户
    async queryWareUserList(){
      let d={
        'roleId':"64I8Eemfyr38rwIaIUP96Y",
        'warehouseUid':this.wareUid
      }
       const {code, data } = await queryWareUserList(d)
       if(code ==='00000000'){
        this.userList = data
      }
    },
    changeTab(){
      this.resData = []
      this.checkData=[]
      if(this.$route.query.edit){
          this.formData.checkScopeList = []
          let scopeData = this.detailData.checkScopeList.map(pp=>pp.objUid)
          this.rescoureData.forEach(el=>{
            el.childList.map(v=>{
              if(scopeData && scopeData.indexOf(v.uid)==-1){
                let a = this.resData.findIndex(o=>o.uid==el.uid)
                if(a>-1){
                  this.resData[a].children.push(v)
                }else{
                  this.resData.push({
                    uid:el.uid,
                    locationName:el.locationName,
                    children:[v],
                    parentUid:el.parentUid || null,
                    locationFlag:el.locationFlag,
                  })
                }
              }else{
                let a = this.checkData.findIndex(o=>o.uid==el.uid)
                if(a>-1){
                  this.checkData[a].children.push(v)
                }else{
                  this.checkData.push({
                    uid:el.uid,
                    locationName:el.locationName,
                    children:[v],
                    parentUid:el.parentUid || null,
                    locationFlag:el.locationFlag,
                  })
                }
              }
            })
          })
        
        
      }else{
        this.rescoureData.map(el => {
          this.resData.push({
            uid:el.uid,
            locationName:el.locationName,
            children:el.childList,
            parentUid:el.parentUid || null,
            locationFlag:el.locationFlag,
          })
        });
        this.data2value=[]
      }
      this.$refs.restree  && this.$refs.restree.setCheckedKeys([]);
      this.leftchecked = false
      this.rightchecked = false
      this.formData.checkScopeList = []
      this.calculation()
    },
    changeData(){
      this.formData.checkStartTime=this.formData.dateTime[0]
      this.formData.checkEndTime=this.formData.dateTime[1]
    },
    deleteList(){
      let data = this.$refs.checktree.getCheckedNodes()
     
      //要删除的data 
      let fLevel = data.filter(p=>p.locationFlag == 1) //要删的一级
      if(fLevel.length>0){
        fLevel.forEach(p=>{
          let a = this.checkData.findIndex(v=>v.uid == p.uid)
          a>-1 && this.checkData.splice(a,1)
        })
      }
      let sLevel = data.filter(p=>p.locationFlag == 2) //要删的二级
      if(sLevel.length>0){
        sLevel.forEach(p=>{
          let obj = this.checkData.find(o=>o.uid == p.parentUid)
          if(obj){
            let a = obj.children.findIndex(v=>v.uid == p.uid)
            a>-1 && obj.children.splice(a,1)
          }
        })
      }

      
      //  this.checkData
       data.forEach(ev=>{
         let a = this.resData.findIndex(v=>ev.parentUid == v.uid)
         if(a>-1){
           this.resData[a].children.push(ev)
         }else{
           let b = this.rescoureData.find(v=>ev.parentUid == v.uid)
           if(b){
             this.resData.push({
              uid:b.uid,
              locationName:b.locationName,
              children:[ev],
              parentUid:b.parentUid || null,
              locationFlag:b.locationFlag,
            })
           }
         }
       })
      let second = [];
      if(this.checkData.length>0){
        this.checkData.forEach(ev=>{
          second = [...second,...ev.children] 
        })
      }
      this.formData.checkScopeList=[]
      second.forEach(el=>{
        this.formData.checkScopeList.push({
          objUid:el.uid
        })
      })
      
       this.calculation()
       this.dele = true
       this.rightchecked = false
    },
    addList(){
      let data = this.$refs.restree.getCheckedNodes()
      let tong=data.map(item=>item.uid)
      this.resData.map(el=>{
        el.children = el.children.filter(item=>!tong.includes(item.uid))
      })
      // let a = this.resData.findIndex(e=>e.children.length==0)
      this.resData = this.resData.filter(v=>v.children.length!=0)
      
      // this.resData = resArr
      if(data && data.length>0){
        let first = this.rescoureData.filter(el=>el.locationFlag==1)
        let second = data.filter(el=>el.locationFlag==2)
        if(this.checkData.length>0){
          this.checkData.forEach(ev=>{
            second = [...second,...ev.children] 
          })
        }
        this.checktotal = second.length
        this.checkData = []
        first.forEach(el=>{
          if(second.filter(v=>v.parentUid == el.uid).length>0){
            this.checkData.push({
              uid:el.uid,
              parentUid:el.parentUid || null,
              locationFlag:el.locationFlag,
              locationName:el.locationName,
              children:second.filter(v=>v.parentUid == el.uid)
            })
          }
          
        })
        this.formData.checkScopeList=[]
        second.forEach(el=>{
          this.formData.checkScopeList.push({
            objUid:el.uid
          })
        })
          // this.formData.checkScopeList.push('4Fj6X0q0n8ThGOX110GFne')
      }else{
        console.log('没有选中数据');
        
      }
      this.calculation()
      this.addl = true
      this.leftchecked = false

      
    },
    calculation(){
      //计算左右两边个数
      this.total = 0
      this.checktotal = 0
      this.resData.forEach(el=>{
        this.total +=el.children.length
      })
      this.checkData.forEach(el=>{
        this.checktotal +=el.children.length
      })
    },
    changeItem(){
      let res = this.$refs.restree.getCheckedNodes()
      // console.log('res',res);
      let resIn = res.filter(v=>v.locationFlag=="2")
      if(resIn.length == this.total){
        this.leftchecked= true
      }else{
        this.leftchecked= false
      }
      if(res.length>0){
        this.addl = false
      }else{
        this.addl = true
        this.leftchecked = false
      }
      
    },
    changeItem2(){
      let res = this.$refs.checktree.getCheckedNodes()
       let resIn = res.filter(v=>v.locationFlag=="2")
      if(resIn.length == this.checktotal){
        this.rightchecked= true
      }else{
        this.rightchecked= false
      }
      if(res.length>0){
        this.dele = false
      }else{
        this.dele = true
      }
    },
    //通过用户信息查询仓库id
    async queryCurWarehouseList(d){
      const {code, data } = await queryCurWarehouseList(d)
      if(code ==='00000000'){
        if( data &&  data.length){
          this.wareUid = data[0].uid
          this.queryLocationList({
            warehouseUid :this.wareUid
          })
          this.queryWareUserList()
          this.queryResourceList({
          "orderBy":"convert(resource_name using gbk)",
          "order":"asc",
          'where.warehouseUid':this.wareUid,
          'pageNum':1,
          'pageSize':9999 //为了排序只能写死数量，不然排序失效，如出问题，此锅由后端开发人员（肖天文）
        })
        }
      }
    },
    async createCheck(d){
      try{
         const {code } = await createCheck(d)
        if(code === "00000000"){
          this.$message({
            message: `添加成功`,
            type: "success",
          });
          this.$router.push({
            name:'inventoryManage'
          })
        }
      }catch (e){
        if(e.code==='10060008'){
          let btn = d.statusFlag == 1?'保存':'发布'
          this.$confirm(e.viewMsg, '确认', {
              confirmButtonText: btn,
              cancelButtonText: '取消',
            }).then(() => {
              d.creatFlag = 1
              this.createCheck(d)      
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
        }
      }
     
    },
    async updateCheck(d){
      const {code } = await updateCheck(d)
      if(code === "00000000"){
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        this.$router.push({
          name:'inventoryManage'
        })
      }
    },
    //查询所有库位
    async queryLocationList(d) {
      const {code, data } = await queryLocationList(d)
      if(code ==='00000000'){
        let datas = data.filter(el=>el.childList.length>0)
        this.rescoureData = datas
        if(datas && datas.length>0){
          this.resData = []
          if(this.$route.query.uid){
            this.queryCheck({
              uid:this.$route.query.uid
            })
          }else if(this.$route.query.edit){
            this.queryCheck({
              uid:this.$route.query.edit
            })
          }else{
            datas.map(el => {
              el.childList.map(v=>{
                v.locationName = `${v.locationName}(${v.categoryCount || 0}种)`
              })
              this.resData.push({
                uid:el.uid,
                locationName:el.locationName,
                children:el.childList,
                parentUid:el.parentUid || null,
                locationFlag:el.locationFlag,
              })
            });
            this.calculation()
          }
        }
         //this.resetDefault(data)
        // console.log('res',data);
        
        
      }
    },
    allowDrop() {
      return false;
    },
    submitForm(form,type) {
      let d = this.formData
      if(d.rangeFlag==2){
        this.formData.checkScopeList = []
        this.data2value.forEach(el=>{
          this.formData.checkScopeList.push({
             "objUid": el,
          })
        })
        
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          if(this.formData.checkScopeList.length==0){
            this.$message({
              message: `请选择盘点范围数据`,
              type: "warning",
            });
            return
          }
          // alert("submit!");
          d.statusFlag = type
          if(type==2){
            this.$confirm('是否发布盘点单任务，发布后，不可撤回？', '发布', {
              confirmButtonText: '发布',
              cancelButtonText: '取消',
            }).then(() => {
              if(this.$route.query.edit){
                this.updateCheck(d)
              }else{
                this.createCheck(d)
              }
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
          }else{
            if(this.$route.query.edit){
              this.updateCheck(d)
            }else{
              this.createCheck(d)
            }
          }
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.back(-1)
    },
  },
};
</script>
<style lang="scss" scoped>
.teBox{
  height: calc(100% - 40px);
}
.ment_center{
  text-align: center;
}
.full_height{
  height: 100%; 
}
.itembox{
    height: calc(100% - 220px);
    /deep/ .el-form-item__content{
      height: 100%;
      .el-tabs__content{
        height: calc(100% - 55px);
        .el-tab-pane{
          height: 100%;
        }
        // div{
        //   
        // }
      }
    }
  }
.objtabs{
  height: 100%;
 /deep/ .el-tabs__nav-scroll{
   padding-left: 15px;
 }
 /deep/ .el-tabs__item{
   color: #999999;
 }
}
/deep/ .el-transfer-panel__item.el-checkbox{
      color: #606266;
    margin-left: 0;
    display: block!important;
}
.conts{
  border-top: solid 1px #E1E1E1;
  height:calc(100% - 5px);
  .transferbox{
    margin-top: 15px;
     height: 100%;
     /deep/ .el-transfer-panel__body{
       height: calc(100% - 60px);
       .el-transfer-panel__list.is-filterable{
         height: calc(100% - 40px);
       }
     }
    /deep/ .el-transfer-panel .el-transfer-panel__header{
      background:$main_color;
      .el-checkbox__label{
        color: #ffffff;
        span{
          color: #ffffff;
        }
      }
    }
    /deep/ .el-transfer-panel{
      width: 320px;
      height: calc(100% - 10px);
    }
    /deep/ .el-transfer__buttons{
      padding: 0 15px;
    }
  }
}
.flex{
  display: flex;
  flex-direction: row;
  .boxLeft{
    width: 320px;
    height: calc(100% - 10px);
    border: solid 1px #e5eaf4;
    border-radius: 4px;
    margin-top: 15px;
  }
  .boxCenter{
    width: 100px;
    height: 100%;
    .btFlex{
      height: 100%;
      display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       /deep/ .el-button--primary{
         display: block;
         border: solid 1px #dbe1ef;
         margin:5px 10px;
         
       }
    }
  }
  .boxRight{
     height: calc(100% - 10px);
    border: solid 1px #e5eaf4;
    width: 320px;
    margin-top: 15px;
    border-radius: 4px;
  }
  .title{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px 15px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: $main_color;
    color: #ffffff;
    /deep/ .el-checkbox__label{
      color: #ffffff;
      font-size: 16px;
    }
  }
  /deep/ .el-tree-node__content{
    height: 36px;
  }
}
/deep/ .el-tabs__item.is-active{
  color: $main_color;
}
/deep/ .el-tabs__nav-wrap::after{
  background:none;
}
/deep/ .el-tabs__active-bar{
  background-color: $main_color;

}
</style>
