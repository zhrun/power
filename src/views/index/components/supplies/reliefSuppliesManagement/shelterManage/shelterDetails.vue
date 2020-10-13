<template>
<div>
<vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
<main class="main_container">
    <div class="main_container_flex">
    <el-scrollbar class="main_right" style="width:100%">
        <el-row class="title">
					<span class="title_text">基本信息</span>
					<span class="tips">{{`创建于${shelterInfo.createTime}，最近更新于${shelterInfo.updateTime}`}}</span>
				</el-row>
        <table width="100%">
        <tr>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        <tr>
        <td rowspan="5" style="width:500px">
            <img
                  :src="fileFullPath"
                  @click="playVideo()"
                  style="width:500px;height:300px"
                >
        </td>
            <td class="form_item">
            场所名称：{{ `${shelterInfo.placeName}` || '-' }}
            <!-- <th>物资装备名称：{{`${shelterInfo.createTime}`}}</th> -->
            </td>
            <td>
            场所编号：{{ `${shelterInfo.placeCode}` || '-' }}
            </td>
        </tr>
        <tr>
            <td class="form_item">
            场所类型：{{ `${shelterInfo.placeFlagName}` || '-' }}
            <!-- <th>物资装备名称：{{`${shelterInfo.createTime}`}}</th> -->
            </td>
            <td>
            面积：{{shelterInfo.areaSize ? shelterInfo.areaSize + '平方米': '-'}}
            </td>
        </tr>
        <tr>
            <td class="form_item">
            容纳人数：{{shelterInfo.capacity ? shelterInfo.capacity + '人': '-'}}
            <!-- <th>物资装备名称：{{`${shelterInfo.createTime}`}}</th> -->
            </td>
            <td>
            建设时间：{{ `${shelterInfo.buildTime}` || '-' }}
            </td>
        </tr>
        <tr>
            <td class="form_item">
            所属单位：{{ `${shelterInfo.affiliatedUnit}` || '-' }}
            <!-- <th>物资装备名称：{{`${shelterInfo.createTime}`}}</th> -->
            </td>
            <td>
            联系人：{{ `${shelterInfo.contactName}(${shelterInfo.officePhone})` || '-' }}
            </td>
        </tr>
        <tr>
            
            <td colspan="2">
                <div style="display:flex">
                位置：{{ `${shelterInfo.position}` || '-' }} <i v-if="shelterInfo.position" class="position" @click="showMap"></i>
                </div>
            </td>

        </tr>
        <tr>
            <td colspan="5">配套设施：{{ `${shelterInfo.supportingFacilities}` || '-' }}</td>
        </tr>
        <tr>
            <td colspan="5">备注：{{ `${shelterInfo.remark}` || '-' }}</td>
        </tr>


        </table>

        <div class="footer_buttons">
        <el-button @click="goback">返回</el-button>
        <el-button type="primary" @click="toEdit">编 辑</el-button>
        </div>
    </el-scrollbar>
    </div>
</main>
<div is="mapDetail" @mapPointSubmit="mapPointSubmit" :open="open" :oConfig="oConfig"></div>
<el-dialog :visible.sync="dialogVisible" class="enclosDialog">
      <div
        is="preview"
        :eData="attachmentList"
        v-model="currentEnclosIndex"
      ></div>
    </el-dialog>
</div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import { getShelterDetail } from '@/views/index/api/supplies/api.xy'
import mapDetail from "@/components/common/mapDetail.vue";
import preview from '_com/preview.vue'
export default {
name: 'editSameLevelUser',
components: { visBreadcrumb,mapDetail,preview },
props: {
uid: '',
flag:'',
},
data() {
return {
    open: false,
    currentEnclosIndex: -1,
      dialogVisible: false,
    oConfig: {},
    srcList: [],
    breadcrumbData: [
        { name: '救援资源' },
        { name: '避难场所', routerName: 'shelterlist' },
        {name:'避难场所详情 '}
    ],
    shelterInfo: {},
    attachmentList:[],
    fileFullPath:'',
    fileFullPath1: require('../../../../../../assets/img/supplies/500_300.png'),
}
},
computed: {},
watch: {},
created() {
this.init()
},
mounted() {
this.getShelterDetail({
    uid: this.$route.query.uid,
})
},
methods: {
// 初始化
init() {
    // uid:localStorage.setItem('shelterInfoUid')
    this.getShelterDetail()
},

    getShelterDetail(){
        let params ={
            uid:this.$route.query.uid,
        }
        getShelterDetail(params).then(res=>{
            this.shelterInfo = res.data
            if(this.shelterInfo.attachmentList != ''){
            this.fileFullPath = this.shelterInfo.attachmentList[0].fileFullPath
            this.attachmentList = this.shelterInfo.attachmentList
            this.srcList.push(this.fileFullPath)
            }else{
            this.fileFullPath = this.fileFullPath1
          }
            if(this.shelterInfo.buildTime === null){
                this.shelterInfo.buildTime = ''
            }
        })
    },
    // 回退
    goback() {
        this.$router.back(-1);
    },
    toEdit() {
    this.$router.push({
    name:'addoreditshelter',
    query:{
        uid:this.$route.query.uid,
        flag: 'edit',
    }
    })
    
    },
 
    mapPointSubmit(lal, addressInfo) {
        this.shelterInfo.position = addressInfo
        this.shelterInfo.longitude = lal.split(",")[0]
        this.shelterInfo.latitude = lal.split(",")[1]
    },
    showMap() {
        this.oConfig._name = this.shelterInfo.position
        this.oConfig.center= [this.shelterInfo.longitude, this.shelterInfo.latitude],
        this.open = !this.open 
    },
    playVideo() {
      this.currentEnclosIndex = 0
      this.dialogVisible = true
    },
    },
}
</script>

<style lang="scss" scoped>
tr {
    border: 1px solid $border_color;
    td {
        padding: 20px;
        border: 1px solid $border_color;
    }
    }
    .footer_buttons {
    width: 100%;
    text-align: center;
    margin: 30px 0;
    }
    .title {
    color: #333333;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 30px;
}
.tips {
	font-size: 12px;
	color: #999999;
	margin-left: 10px;
}
.position{
  margin-left: 5px;
  background-image: url(../../../../../../assets/img/supplies/dingwei1.png) ;
  // display: inline-block;
  cursor:pointer;
  width: 15px;
  height: 18px;
  &:hover {
      background-image: url(../../../../../../assets/img/supplies/dingwei2.png) ;
      width: 13px;
      height: 16px;
  }
}
</style>
