<!-- 值班记录列表 -->

<template>
  <div>
    <visBreadcrumb :breadcrumb-data="breadcrumbData"></visBreadcrumb>
    <div class="common_content">
        <el-form :inline="true" :model="formInline" style="position:relative;" ref="ruleForm">
          <el-form-item label="库位">
            <el-form-item prop="keyword">
              <el-input v-model="formInline.keyword" placeholder="请输入库位编号/名称"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tables">
          <div class="box">
            <p>
              <span>库房</span>
              <span @click="addDis(1)">
                <i class="el-icon-circle-plus-outline"></i>
                新增库房
              </span>
            </p>
            <div class="itemList">
              <el-scrollbar class="scroll">
                <ul>
                  <li v-for="(item,index) in locationTree" :class="{'active':box1 ==item.uid || box1==0 }" :key="item.uid" @click="selectItem1(item,index)">
                    <span class="name">{{item.locationCode}}  {{item.locationName}}</span>
                    <span class="edit">
                      <i @click="editItem(item,1)">编辑</i>
                      <i @click="delItem(item)">删除</i>
                    </span>
                  </li>
                  <div v-if="locationTree && locationTree.length==0" class="noData">
                    <img src="../../../../../assets/img/supplies/nodata.png">
                    暂无库位数据</div>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <div class="box">
            <p>
              <span>库区</span>
              <span @click="addDis(2)">
                <i class="el-icon-circle-plus-outline"></i>
                新增库区
              </span>
            </p>
            <div class="itemList">
              <el-scrollbar class="scroll">
                <ul>
                  <li v-for="(item,index) in areaTree" :class="{'active':box2 ==item.uid || box2==0 }" :key="item.uid" @click="selectItem2(item,index)">
                    <span  class="name">{{item.locationCode}}  {{item.locationName}}</span>
                    <span class="edit">
                      <i @click.stop="editItem(item,2)">编辑</i>
                      <i @click="delItem(item)">删除</i>
                    </span>
                  </li>
                  <div v-if="locationTree && locationTree.length==0 || areaTree && areaTree.length==0" class="noData"> <img src="../../../../../assets/img/supplies/nodata.png">暂无库位数据</div>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <div class="box">
            <p>
              <span>货架</span>
              <span @click="addDis(3)">
                <i class="el-icon-circle-plus-outline"></i>
                新增货架
              </span>
            </p>
            <div class="itemList">
              <el-scrollbar class="scroll">
                <ul>
                  <li v-for="(item) in goodsTree" :key="item.uid" >
                    <span  class="name">{{item.locationCode}}  {{item.locationName}}</span>
                    <span class="edit">
                      <i @click="editItem(item,3)">编辑</i>
                      <i @click="delItem(item)">删除</i>
                    </span>
                  </li>
                  <div v-if="locationTree && locationTree.length==0 || areaTree && areaTree.length==0 || goodsTree && goodsTree.length==0" class="noData"> <img src="../../../../../assets/img/supplies/nodata.png">暂无库位数据</div>
                </ul>
              </el-scrollbar>
            </div>
          </div>
        </div>
    </div>
    <el-dialog :title="title+'库房'" :visible.sync="dialogEdit1" width="400px">
      <el-form :model="editForm1" ref="formRule1" :rules="formRule">
        <el-form-item label="库房名称" label-width="100px" prop="name">
          <el-input v-model="editForm1.name" maxlength="20" autocomplete="off" style="width:85%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed('formRule1')">取 消</el-button>
        <el-button type="primary" @click="savaAdd(1,'formRule1')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title+'库区'" :visible.sync="dialogEdit2" width="400px">
      <el-form :model="editForm2" ref="formRule2" :rules="formRule">
        <el-form-item label="所属库房" label-width="100px" prop="house" >
          <el-input v-model="editForm2.house" autocomplete="off"  style="width:85%;" readonly></el-input>
        </el-form-item>
        <el-form-item label="库区名称" label-width="100px" prop="name">
          <el-input v-model="editForm2.name"  maxlength="20" autocomplete="off" style="width:85%;" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed('formRule2')">取 消</el-button>
        <el-button type="primary" @click="savaAdd(2,'formRule2')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title+'货架'" :visible.sync="dialogEdit3" width="400px">
      <el-form :model="editForm3" ref="formRule3" :rules="formRule">
        <el-form-item label="所属库房" label-width="100px" prop="house">
          <el-input v-model="editForm3.house" autocomplete="off" readonly style="width:85%;"></el-input>
        </el-form-item>
        <el-form-item label="所属库区" label-width="100px" prop="area">
          <el-input v-model="editForm3.area" autocomplete="off" readonly style="width:85%;"></el-input>
        </el-form-item>
        <el-form-item label="货架名称" label-width="100px" prop="name">
          <el-input v-model="editForm3.name"  maxlength="20" autocomplete="off" style="width:85%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closed('formRule3')">取 消</el-button>
        <el-button type="primary" @click="savaAdd(3,'formRule3')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import {  queryLocationList,  createLocation ,  updateLocation , deleteLocation,queryCurWarehouseList} from "@/views/index/api/supplies/api.zr.js";
export default {
  components: { visBreadcrumb },
  data() {
    return {
      breadcrumbData: [{ name: "基础信息" }, { name: "库位管理" }],
      formInline: {
        keyword: null,
      },
      formRule: {
        name: [{ required: true, message: "该项不可为空", trigger: "blur" }],
      },
      userInfo: localStorage.getItem("vis_user_info")
        ? JSON.parse(localStorage.getItem("vis_user_info"))
        : {},
      loading: false,
      dialogEdit1: false,
      dialogEdit2: false,
      dialogEdit3: false,
      box1:0,
      box2:0,
      box3:0,
      editForm1:{
        name:''
      },
      editForm2:{
        name:'',
        house:''
      },
      editForm3:{
        name:'',
        house:'',
        area:'',
      },
      locationTree:null,
      areaTree:null,
      goodsTree:null,
      wareUid:null,
      curHouse:null,
      curLocation:null,
      title:'新增',
      editData:null
    };
  },
  mounted() {
    
    this.queryCurWarehouseList()
  },
  methods: {
    async queryCurWarehouseList(d){
      const {code, data } = await queryCurWarehouseList(d)
      if(code ==='00000000'){
        if( data &&  data.length){
          this.wareUid = data[0].uid
          this.queryLocationList({
            warehouseUid :this.wareUid
          })
        }
      }
    },
    addDis(obj) {
      this.title = '新增'
      if(obj==1){
        this.dialogEdit1 = true
        this.editForm1={
          name:''
        }
              
      }else if(obj==2){
        this.editForm2={
          name:'',
          house:''
        }
        if(!this.curHouse){
          if(this.locationTree && this.locationTree.length>0){
            this.curHouse = this.locationTree[0]
            this.editForm2.house=this.curHouse.locationName
            this.dialogEdit2 = true
          }else{
            this.$message({
              type:'warning',
              message:'请选择库房'
            })
          }
        }else{
          this.editForm2.house=this.curHouse.locationName
          this.dialogEdit2 = true
        }
      }else if(obj==3){
        this.editForm3={
          name:'',
          house:'',
          area:'',
        }
        if(!this.curLocation){
          if(this.areaTree && this.areaTree.length>0){
            this.curLocation = this.areaTree[0]
            this.editForm3.house=this.curHouse.locationName
            this.editForm3.area=this.curLocation.locationName
            this.dialogEdit3 = true
          }else{
            this.$message({
              type:'warning',
              message:'请选择库区'
            })
          }
        }else{
          
          if(this.areaTree.length==0){
            this.$message({
              type:'warning',
              message:'请选择库区'
            })
            return
          }
           this.editForm3.house=this.curHouse.locationName
           this.editForm3.area=this.curLocation.locationName
          this.dialogEdit3 = true
        }
        
      }
      
    },
    selectItem1(item){
      this.box1 = item.uid
      this.curHouse = item
      this.areaTree = item.childList || []
      let a =  this.areaTree.length>0? this.areaTree[0]:''
      if(this.curLocation){
        let aindex = this.areaTree.findIndex(el=>el.uid==this.curLocation.uid)
        if(aindex>-1){
          this.curLocation = this.areaTree[aindex]
          this.selectItem2(this.curLocation)
          
        }else if(a){
           this.selectItem2(a)
        }else{
          this.goodsTree = []
        }
        
      }else if(a){
        this.selectItem2(a)
      }
       
       
    },

    selectItem2(item){
      this.box2 = item.uid
      this.curLocation = item
      this.goodsTree = item.childList
    },

    closed(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.dialogEdit1 = false;
      this.dialogEdit2 = false;
      this.dialogEdit3 = false;
    },
    showAdd() {
      this.$router.push({
        name: "addWarehouse",
      });
    },
    onSubmit() {
      this.goodsTree = []
      this.areaTree = []
      this.curHouse = null
      this.curLocation = null
      this.queryLocationList({
         warehouseUid :this.wareUid,
        keyword:this.formInline.keyword || null
      })
    },
    
    async queryLocationList(d) {
      const {code, data } = await queryLocationList(d)
      if(code ==='00000000'){
        this.locationTree = data //this.resetDefault(data)
        this.$nextTick(()=>{
          if(this.curHouse){
            let a = this.locationTree.findIndex(el=>el.uid == this.curHouse.uid)
            if(a>-1){
              this.curHouse = this.locationTree[a]
            }
            this.selectItem1(this.curHouse)
          }else{
            this.selectItem1(this.locationTree[0])
          }
        })
        
      }
    },
    
    savaAdd(type,formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.title=='新增'){
              if(type==1){
                let data = {
                  locationFlag:"1",
                  warehouseUid:this.wareUid,
                  locationName:this.editForm1.name
                }
                this.createLocation(data)
              }
              if(type==2){
                let data = {
                  locationFlag:"2",
                  parentUid:this.curHouse.uid,
                  warehouseUid:this.wareUid,
                  locationName:this.editForm2.name
                }
                this.createLocation(data)
              }
              if(type==3){
                let data = {
                  locationFlag:"3",
                  parentUid:this.curLocation.uid,
                  warehouseUid:this.wareUid,
                  locationName:this.editForm3.name
                }
                this.createLocation(data)
              }
              
            }else{
              if(type==1){
                this.updateLocation({
                  "locationFlag": "1",
                  "locationName": this.editForm1.name,
                  "locationCode": this.editData.locationCode,
                  "parentUid": this.editData.parentUid,
                  "uid": this.editData.uid,
                  "warehouseUid": this.editData.warehouseUid
                })
              }else if(type==2){
                this.updateLocation({
                  "locationFlag": "2",
                  "locationName": this.editForm2.name,
                  "locationCode": this.editData.locationCode,
                  "parentUid": this.editData.parentUid,
                  "uid": this.editData.uid,
                  "warehouseUid": this.editData.warehouseUid
                })
              }else{
                this.updateLocation({
                  "locationFlag": "3",
                  "locationName": this.editForm3.name,
                  "locationCode": this.editData.locationCode,
                  "parentUid": this.editData.parentUid,
                  "uid": this.editData.uid,
                  "warehouseUid": this.editData.warehouseUid
                })
              }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    async createLocation(d){
      const {code } = await createLocation(d)
      if(code === "00000000"){
        this.$message({
          message: `添加成功`,
          type: "success",
        });
        this.queryLocationList({
          warehouseUid :this.wareUid
        })
        let a ="formRule"+d.locationFlag
        this.closed(a)
      }
    },
    async updateLocation(d){
      const {code } = await updateLocation(d)
      if(code === "00000000"){
      
        this.$message({
          message: `修改成功`,
          type: "success",
        });
        if(d.locationFlag==1){
          let ab = this.locationTree.findIndex(el=>el.uid==d.uid)
          this.locationTree[ab].locationName = d.locationName
        }
        if(d.locationFlag==2){
           let ac = this.areaTree.findIndex(el=>el.uid==d.uid)
          this.areaTree[ac].locationName = d.locationName
        }
        if(d.locationFlag==3){
           let ad = this.goodsTree.findIndex(el=>el.uid==d.uid)
          this.goodsTree[ad].locationName = d.locationName
        }
        this.closed('formRule'+d.locationFlag)
      }
    },
    editItem(obj,type){
      this.title = '编辑'
      this.editData = obj
      if(type==1){
        this.dialogEdit1 = true
        this.editForm1={
          uid:obj.uid,
          name:obj.locationName
        }
      }else if(type==2){
        this.dialogEdit2 = true
        this.editForm2={
          uid:obj.uid,
          name:obj.locationName,
          house:this.curHouse.locationName
        }
      }else{
        this.dialogEdit3 = true
        this.editForm3={
          uid:obj.uid,
          name:obj.locationName,
          house:this.curHouse.locationName,
          area:this.curLocation.locationName,
        }
      }
      // this.updateLocation(obj);
    },
    delItem(obj){
      this.$confirm(`是否删除？删除后不可恢复。`, "删除")
        .then(() => {
          this.deleteLocation(obj);
        })
        .catch();
      
    },
    async deleteLocation(d){
      const {code } = await deleteLocation({
        uid:d.uid
      })
      if(code === "00000000"){
        this.$message({
          message: `删除成功`,
          type: "success",
        });
        if(d.locationFlag==1){
          let ab = this.locationTree.findIndex(el=>el.uid==d.uid)
          let a = this.locationTree.splice(ab,1)
          if(a[0].uid == this.curHouse.uid){
            this.areaTree = []
            this.goodsTree = []
          }
        }
        if(d.locationFlag==2){
           let ac = this.areaTree.findIndex(el=>el.uid==d.uid)
           let b = this.areaTree.splice(ac,1)
           if(b[0].uid == this.curLocation.uid){
            this.goodsTree = []
          }
        }
        if(d.locationFlag==3){
           let ad = this.goodsTree.findIndex(el=>el.uid==d.uid)
           this.goodsTree.splice(ad,1)
        }
      }
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.curLocation = null
      this.curHouse =null
       this.queryCurWarehouseList()
    },
  },
};
</script>
<style lang="scss" scoped>
.tables {
  height: calc(100% - 62px);
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  .box{
    width: 358px;
    height: 100%;
    
    border-radius: 4px;
    overflow: hidden;
    margin-right: 20px;
    p{
      color: #ffffff;
      line-height: 50px;
      padding: 0 15px;
      font-size: 14px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background: $main_color;
      
      span:last-child{
        cursor: pointer;
      }
    }
    .itemList{
      border: solid 1px #d4d4d4;
      height:calc(100% - 50px);
       border-bottom-left-radius: 4px;
       border-bottom-right-radius: 4px;
       .noData{
         text-align: center;
          border: none;
          justify-content: center;
          color: #999;
          img{
            width: 55%;
            height: auto;
            display: block;
            margin: 20px auto;
          }
        }
      li{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 15px;
        padding-right: 10px;
        border-bottom: solid 1px #D4D4D4;
        .edit{
          display: none;
        }
        .name{
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        &:hover{
          color: #5458FE;
          background: #F4F5FF;
          .edit{
            display: inline;
            white-space: nowrap;
          }
        }
        &.active{
          color: #5458FE;
          background: #F4F5FF;
        }
        
        i{
          font-style: normal;
          padding: 0px 5px;
          cursor: pointer;
          &:first-child{
            border-right: solid 1px #d4d4d4;
          }
        }

      }
    }
  }

}
/deep/ .common_content .el-scrollbar__wrap .el-scrollbar__view{
  padding-right: 0px;
}
</style>
