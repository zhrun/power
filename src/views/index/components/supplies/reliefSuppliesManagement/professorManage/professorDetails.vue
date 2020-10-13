<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right" style="width:100%">
          <el-row inline>
            <div class="title">
              <div class="backg">
                <span>{{
                  `${professorInfo.belongingFieldFlagName}` || '-'
                }}</span>
              </div>
              <div class="title_text">
                <span>{{ `${professorInfo.expertName}` || '-' }}</span>
              </div>
              <div class="tips">
                <span>{{
                  `创建于${professorInfo.createTime}，最近更新于${professorInfo.updateTime}`
                }}</span>
              </div>
            </div>
          </el-row>
          <table width="100%" v-loading="loading">
            <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <td rowspan="4" style="width:150px">
                <img
                  :src="fileFullPath"
                  @click="playVideo()"
                  style="width: 150px;height:200px"
                >
              </td>
              <td class="form_item">
                专家姓名：{{ `${professorInfo.expertName}` || '-' }}
                <!-- <th>物资装备名称：{{`${professorInfo.createTime}`}}</th> -->
              </td>
              <td>性别：{{ `${professorInfo.gender}` || '-' }}</td>
              <td>出生日期：{{ `${professorInfo.birthday}` || '-' }}</td>
              <td>专家编号{{ `${professorInfo.expertCode}` || '-' }}</td>
            </tr>
            <tr>
              <td class="form_item">
                年龄：{{ professorInfo.age ? professorInfo.age + '岁':'-' }}
                <!-- <th>物资装备名称：{{`${professorInfo.createTime}`}}</th> -->
              </td>
              <td>手机号：{{ `${professorInfo.phoneNumber}` || '-' }}</td>
              <td>
                办公电话：{{
                  `${professorInfo.officeCode}${professorInfo.officePhone}` ||
                    '-'
                }}
              </td>
              <td>最高学历：{{ `${professorInfo.educationFlagName}` || '-' }}</td>
            </tr>
            <tr>
              <td class="form_item">
                邮箱：{{ `${professorInfo.expertName}` || '-' }}
                <!-- <th>物资装备名称：{{`${professorInfo.createTime}`}}</th> -->
              </td>
              <td>
                政治面貌：{{ `${professorInfo.politicalFlagName}` || '-' }}
              </td>
              <td>毕业院校：{{ `${professorInfo.graduatedSchool}` || '-' }}</td>
              <td>工作单位：{{ `${professorInfo.company}` || '-' }}</td>
            </tr>
            <tr>
              <td class="form_item">
                职称：{{ `${professorInfo.jobTitleFlagName}` || '-' }}
                <!-- <th>物资装备名称：{{`${professorInfo.createTime}`}}</th> -->
              </td>
              <td>职务：{{ `${professorInfo.company}` || '-' }}</td>
              <td>
                专家类别：{{ `${professorInfo.expertCategoryFlagName}` || '-' }}
              </td>
              <td>
                专家级别：{{ `${professorInfo.expertLevelFlagName}` || '-' }}
              </td>
            </tr>
            <tr>
              <!-- <td colspan="5">常住地址：{{ `${professorInfo.address}`|| '-'  }}<img :src="src" alt="" /></td> -->
              <td colspan="5">
                <div style="display:flex">
                  常住地址：{{ `${professorInfo.address}` || '-'
                  }}<i
                    v-if="professorInfo.address"
                    class="position"
                    @click="showMap"
                  ></i>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                个人简介：{{ `${professorInfo.personalProfile}` || '-' }}
              </td>
            </tr>
            <tr>
              <td colspan="5">
                擅长领域：{{ `${professorInfo.expertiseField}` || '-' }}
              </td>
            </tr>
            <tr>
              <td colspan="5">
                事故处置经历：{{ `${professorInfo.experience}` || '-' }}
              </td>
            </tr>
            <tr>
              <td colspan="5">备注：{{ `${professorInfo.remark}` || '-' }}</td>
            </tr>
          </table>

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
import { getExpertDetail } from '@/views/index/api/supplies/api.xy'
import mapDetail from '@/components/common/mapDetail.vue'
import preview from '_com/preview.vue'
export default {
  name: 'editSameLevelUser',
  components: { visBreadcrumb, mapDetail,preview },
  props: {
    uid: '',
  },
  data() {
    return {
      currentEnclosIndex: -1,
      dialogVisible: false,
      open: false,
      loading: false,
      oConfig: {},
      breadcrumbData: [
        { name: '救援资源' },
        { name: '应急专家', routerName: 'professorlist' },
        { name: '专家详情 ' },
      ],
      professorInfo: {},
      attachmentList: [],
      srcList: [],
      fileFullPath: '',
      fileFullPath1: require('../../../../../../assets/img/supplies/150_200.png'),
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    this.getExpertDetail({
      uid: this.$route.query.uid,
    })
  },
  methods: {
    // 初始化
    init() {
      // uid:localStorage.setItem('professorInfoUid')
      this.getExpertDetail()
    },
    getExpertDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      this.loading = true
      getExpertDetail(params)
        .then((res) => {
          this.professorInfo = res.data
          if (this.professorInfo.attachmentList != '') {
            this.fileFullPath = this.professorInfo.attachmentList[0].fileFullPath
            this.attachmentList = this.professorInfo.attachmentList
            this.srcList.push(this.fileFullPath)
          }else{
            this.fileFullPath = this.fileFullPath1
          }
            // this.professorInfo.attachmentList.forEach((el) => {
            //   this.attachmentList.push({
            //     fileType: el.fileType,
            //     fileFullPath: el.fileFullPath,
            //   })
            //   // console.log()
            // })
          if (this.professorInfo.age == null) {
            this.professorInfo.age = ''
          }
          if (this.professorInfo.birthday == null) {
            this.professorInfo.birthday = ''
          }
        })
        .catch((error) => {
          console.log('接口报错=>', error)
        })
      this.loading = false
    },
    playVideo() {
      this.currentEnclosIndex = 0
      this.dialogVisible = true
    },

    // 回退
    goback() {
      this.$router.back(-1)
    },

    toEdit() {
      this.$router.push({
        name: 'addoreditprofessor',
        query: {
          uid: this.$route.query.uid,
          flag: 'edit',
        },
      })
    },

    mapPointSubmit(lal, addressInfo) {
      this.professorInfo.position = addressInfo
      this.professorInfo.longitude = lal.split(',')[0]
      this.professorInfo.latitude = lal.split(',')[1]
    },
    showMap() {
      this.oConfig._name = this.professorInfo.address
      this.oConfig.center = [
        this.professorInfo.longitude,
        this.professorInfo.latitude,
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
  display: flex;
  justify-content: space-between;
  color: #333333;
  font-weight: bold;
  margin-bottom: 30px;
}

.tips {
  font-size: 12px;
  color: #999999;
}
.position {
  margin-left: 5px;
  background-image: url(../../../../../../assets/img/supplies/dingwei1.png);
  // display: inline-block;
  width: 15px;
  height: 18px;
  cursor: pointer;
  &:hover {
    background-image: url(../../../../../../assets/img/supplies/dingwei2.png);
    width: 13px;
    height: 16px;
  }
}
.backg {
  background-color: #5458fe;
  width: 120px;
  height: 26px;
  border-radius: 13px;
  // margin-left: -500px;
  color: #ffffff !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
