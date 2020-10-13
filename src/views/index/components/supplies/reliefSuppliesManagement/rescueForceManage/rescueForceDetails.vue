<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right" style="width:100%">
          <el-row class="title">
            <span class="title_text">基本信息</span>
            <span class="tips">{{
              `创建于${forcesInfo.createTime}，最近更新于${forcesInfo.updateTime}`
            }}</span>
          </el-row>
          <table width="100%">
            <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td>
                <span>队伍名称：{{ forcesInfo.forcesName || '-' }}</span>
                <!-- <th>物资装备名称：{{`${forcesInfo.createTime}`}}</th> -->
              </td>
              <td>
                <span>队伍编号：{{ forcesInfo.forcesCode || '-' }}</span>
              </td>
              <td>
                <span>所属单位：{{ forcesInfo.orgName || '-' }}</span>
              </td>
            </tr>

            <tr>
              <td>
                <span>级别：{{ forcesInfo.levelFlagName || '-' }}</span>
              </td>
              <td>
                <span>属性：{{ forcesInfo.attributeFlagName || '-' }}</span>
              </td>
              <td>
                <span>类型：{{ forcesInfo.forcesFlagName || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>责任人：{{ forcesInfo.principal || '-' }}</span>
              </td>
              <td>
                <span>成立日期：{{ forcesInfo.foundDate || '-' }}</span>
              </td>
              <td>
                <span>擅长领域：{{ forcesInfo.field || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>队伍人数：{{ forcesInfo.forcesAmount ? forcesInfo.forcesAmount + '人' : '-'}}</span>
              </td>
              <td colspan="2">
                办公电话：{{
                  `${forcesInfo.officeCode}-${forcesInfo.officePhone}` || '-'
                }}
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <div style="display:flex">
                  队伍所在地：{{ forcesInfo.forcesAddress || '-'
                  }}<i
                    v-if="forcesInfo.forcesAddress"
                    class="position"
                    @click="showMap"
                  ></i>
                </div>
              </td>
            </tr>
          </table>

          <el-table :data="memberData" style="width: 100%;margin-top:40px;">
            <el-table-column label="成员姓名" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.name || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <span>{{ scope.row.sexFlagName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系电话">
              <template slot-scope="scope">
                <span>{{ scope.row.contactPhone || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="职务" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.position || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="学历" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.educationFlagName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="专业特长" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.specialty || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="入队时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.entryTime || '-' }}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-table :data="equipmentData" style="width: 100%;margin-top:40px;">
            <el-table-column label="装备名称" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.equipmentName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.specifications || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <span>{{ scope.row.quantity || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template slot-scope="scope">
                <span>{{ scope.row.measuringUnitName || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="厂商品牌" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.brand || '-' }}</span>
              </template>
            </el-table-column>
          </el-table>

          <div class="footer_buttons">
            <el-button @click="goback">返回</el-button>
            <el-button type="primary" @click="toEdit">编 辑</el-button>
          </div>
        </el-scrollbar>
      </div>
    </main>
    <div
      is="mapDetail"
      @mapPointSubmit="mapPointSubmit"
      :open="open"
      :oConfig="oConfig"
    ></div>
  </div>
</template>

<script>
import visBreadcrumb from '_com/breadcrumb.vue'
import { getRescueForceDetail } from '@/views/index/api/supplies/api.xy'
import mapDetail from '@/components/common/mapDetail.vue'

export default {
  name: 'editSameLevelUser',
  components: { visBreadcrumb, mapDetail },
  props: {
    uid: '',
    flag: '',
  },
  data() {
    return {
      open: false,
      oConfig: {},
      breadcrumbData: [
        { name: '救援资源' },
        { name: '救援力量', routerName: 'rescueforcelist' },
        { name: '救援力量详情' },
      ],
      memberData: [],
      equipmentData: [],
      forcesInfo: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
    // this.$nextTick(() => {
    //   this.$refs["userForm"].clearValidate();
    // });
  },
  methods: {
    // 初始化
    init() {
      this.getRescueForceDetail()
    },
    getRescueForceDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      getRescueForceDetail(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            this.forcesInfo = res.data
            this.equipmentData = res.data.equipmentInfos
            this.memberData = res.data.memberInfos
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
    },

    // 回退
    goback() {
      this.$router.back(-1)
    },

    toEdit() {
      this.$router.push({
        name: 'addoreditrescueforce',
        query: {
          uid: this.$route.query.uid,
          flag: 'edit',
        },
      })
    },

    mapPointSubmit(lal, addressInfo) {
      this.forcesInfo.forcesAddress = addressInfo
      this.forcesInfo.longitude = lal.split(',')[0]
      this.forcesInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      this.oConfig._name = this.forcesInfo.forcesAddress
      this.oConfig.center = [
        this.forcesInfo.longitude,
        this.forcesInfo.latitude,
      ]
      this.open = !this.open
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
