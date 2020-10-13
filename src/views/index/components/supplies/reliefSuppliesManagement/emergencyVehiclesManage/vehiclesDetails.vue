<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right" style="width:100%">
          <el-row class="title">
            <span class="title_text">基本信息</span>
            <span class="tips">{{
              `创建于${vehicleInfo.createTime}，最近更新于${vehicleInfo.updateTime}`
            }}</span>
          </el-row>
          <table width="100%">
            <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td rowspan="4" style="width:200px">
                <!-- <div class="inform">
        <div class="img-unit" v-for="(item, index) in attachmentList" :key="index+6"> -->
                <img
                  :src="fileFullPath"
                  @click="playVideo()"
                  style="width:300px;height:300px"
                >
                <!-- </div>
        </div> -->
              </td>
              <td style="height:60px">
                车牌号码：{{ `${vehicleInfo.licenseNumber}` || '-' }}
                <!-- <th>物资装备名称：{{`${vehicleInfo.createTime}`}}</th> -->
              </td>
              <td>车辆编号：{{ `${vehicleInfo.vehicleCode}` || '-' }}</td>
              <td>
                车辆类型：{{ `${vehicleInfo.vehicleTypeFlagName}` || '-' }}
                <!-- <th>物资装备名称：{{`${vehicleInfo.createTime}`}}</th> -->
              </td>
            </tr>
            <tr>
              <td>
                车辆颜色：{{ `${vehicleInfo.colourFlagName}` || '-' }}
                <!-- <th>物资装备名称：{{`${vehicleInfo.createTime}`}}</th> -->
              </td>
              <td>号牌种类：{{ `${vehicleInfo.licenseFlagName}` || '-' }}</td>
              <td>
                核载人数：{{ `${vehicleInfo.loads}` || '-' }}
                <!-- <th>物资装备名称：{{`${vehicleInfo.createTime}`}}</th> -->
              </td>
            </tr>
            <tr>
              <td>
                所属单位：{{ `${vehicleInfo.orgName}` || '-' }}
                <!-- <th>物资装备名称：{{`${vehicleInfo.createTime}`}}</th> -->
              </td>
              <td colspan="2">
                <div style="display:flex">
                  停放位置：{{ `${vehicleInfo.parkingPosition}` || '-'
                  }}<i
                    v-if="vehicleInfo.parkingPosition"
                    class="position"
                    @click="showMap"
                  ></i>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="3" style="height:120px">
                适用领域：{{ `${vehicleInfo.field}` || '-' }}
              </td>
            </tr>
          </table>

          <div class="footer_buttons">
            <el-button @click="goback">返回</el-button>
            <el-button type="primary" @click="toEdit">编 辑</el-button>
          </div>
        </el-scrollbar>
        <div
          is="mapDetail"
          @mapPointSubmit="mapPointSubmit"
          :open="open"
          :oConfig="oConfig"
        ></div>
      </div>
    </main>
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
import { getVehicleDetail } from '@/views/index/api/supplies/api.xy'
import mapDetail from '@/components/common/mapDetail.vue'
import preview from '_com/preview.vue'
export default {
  name: 'vehiclesdetails',
  components: { visBreadcrumb, mapDetail,preview },
  props: {
    uid: '',
    flag: '',
  },
  data() {
    return {
      currentEnclosIndex: -1,
      dialogVisible: false,
      open: false,
      oConfig: {},
      srcList: [],
      breadcrumbData: [{ name: '救援资源' }, { name: '应急车辆详情' }],
      attachmentList: [],
      vehicleInfo: {},
      fileFullPath: '',
      fileFullPath1: require('../../../../../../assets/img/supplies/300_250.png'),
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    this.getVehicleDetail({
      uid: this.$route.query.uid,
    })
  },
  methods: {
    // 初始化
    init() {
      this.getVehicleDetail()
    },
    getVehicleDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      getVehicleDetail(params).then((res) => {
        this.vehicleInfo = res.data
        if (this.vehicleInfo.attachmentList != '') {
          this.fileFullPath = this.vehicleInfo.attachmentList[0].fileFullPath
          this.attachmentList = this.vehicleInfo.attachmentList
          this.srcList.push(this.fileFullPath)
        }else{
            this.fileFullPath = this.fileFullPath1
          }
        if(this.vehicleInfo.loads ===null){
          this.vehicleInfo.loads = ''
        }
      })
    },

    // 回退
    goback() {
      this.$router.back(-1)
    },
    // 跳转到本级用户路由
    goToList() {
      this.$router.push({})
    },
    toEdit() {
      this.$router.push({
        name: 'addoreditvehicles',
        query: {
          uid: this.$route.query.uid,
          flag: 'edit',
        },
      })
    },

    mapPointSubmit(lal, addressInfo) {
      this.vehicleInfo.position = addressInfo
      this.vehicleInfo.longitude = lal.split(',')[0]
      this.vehicleInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      this.oConfig._name = this.vehicleInfo.parkingPosition
      this.oConfig.center = [this.vehicleInfo.longitude,this.vehicleInfo.latitude]
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
.position {
  margin-left: 5px;
  background-image: url(../../../../../../assets/img/supplies/dingwei1.png);
  // display: inline-block;
  cursor: pointer;
  width: 15px;
  height: 18px;
  &:hover {
    background-image: url(../../../../../../assets/img/supplies/dingwei2.png);
    width: 13px;
    height: 16px;
  }
}
</style>
