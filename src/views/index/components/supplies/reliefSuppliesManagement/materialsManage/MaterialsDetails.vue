<template>
  <div>
    <vis-breadcrumb :breadcrumb-data="breadcrumbData"></vis-breadcrumb>
    <main class="main_container">
      <div class="main_container_flex">
        <el-scrollbar class="main_right" style="width:100%">
          <el-row class="title">
            <span class="title_text">基本信息</span>
            <span class="tips">{{
              `创建于${materialsInfo.createTime}，最近更新于${materialsInfo.updateTime}`
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
                <span
                  >物资装备名称：{{ materialsInfo.resourceName || '-' }}</span
                >
              </td>
              <td>
                <span
                  >物资装备类型：{{
                    materialsInfo.resourceTypeFlagName || '-'
                  }}</span
                >
              </td>
              <td>
                <span
                  >所属资源：{{ materialsInfo.assetTypeFlagName || '-' }}</span
                >
              </td>
            </tr>
            <tr>
              <td colspan="3">
                所属分类：{{ materialsInfo.catalogTypeFlagName1 }}
                {{materialsInfo.catalogTypeFlagName2? '-' + materialsInfo.catalogTypeFlagName2: ''}}
                {{materialsInfo.catalogTypeFlagName3? '-' + materialsInfo.catalogTypeFlagName3: ''}}
                {{materialsInfo.catalogTypeFlagName4? '-' + materialsInfo.catalogTypeFlagName4: ''}}
              </td>
            </tr>
            <tr>
              <td>
                <span
                  >所属级别：{{ materialsInfo.levelTypeFlagName || '-' }}</span
                >
              </td>
              <td>
                <span
                  >计量单位：{{ materialsInfo.measuringUnitName || '-' }}</span
                >
              </td>
              <td>
                <span>规格型号：{{ materialsInfo.model|| '-' }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>品牌：{{ materialsInfo.brand || '-' }}</span>
              </td>
              <td colspan="2">
                标准单价：{{ materialsInfo.unitPrice ? materialsInfo.unitPrice + '元':'-' }}
              </td>
            </tr>
            <tr>
              <td colspan="3">主要用途：{{ materialsInfo.mainUse || '-' }}</td>
            </tr>
            <tr>
              <td colspan="3">
                <span>注意事项：{{ materialsInfo.notes || '-' }}</span>
              </td>
            </tr>
          </table>

          <el-row class="title" v-if="attachmentList && attachmentList.length>0">
            <span class="title_text">图片</span>
          </el-row>
          <div class="inform">
            <div
              class="img-unit"
              v-for="(item, index) in attachmentList"
              :key="index + 6"
            >
            <div :class="active==index ? 'activeClass' : ''" @click="playVideo(index)"></div>
              <el-image
                class="fill"
                style="width:100px;height:100px"
                :src="item.fileFullPath"
                @click="playVideo(index)"
              >
              </el-image>
            </div>
          </div>
          <table style="width:100%">
            <el-row class="title">
              <span class="title_text">库存预警</span>
            </el-row>
            <tr>
              <td colspan="2">
                上限预警阈值：{{
                  materialsInfo.maxWarningValue? materialsInfo.maxWarningValue : '-'
                }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span
                  >下线预警阈值：{{
                    materialsInfo.minWarningValue? materialsInfo.minWarningValue : '-'
                  }}</span
                >
              </td>
            </tr>
            <el-row class="title">
              <span class="title_text">保质期预警</span>
            </el-row>
            <tr>
              <td>
                <span
                  >是否启用保质期：{{
                    materialsInfo.shelfLifeFlag == 1 ? '是' : '否'
                  }}</span
                >
              </td>
              <td>
                <span
                  >保质期：{{
                    materialsInfo.shelfLifeFlag == 1 ? materialsInfo.shelfLifeValue: '-'
                  }}{{ materialsInfo.shelfLifeFlag== 1 ? materialsInfo.shelfLifeUnitFlagName: ''}}</span
                >
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span
                  >保质期阈值：{{
                    materialsInfo.shelfLifeFlag == 1 ? materialsInfo.expireWarningValue + '天': '-'
                  }}</span
                >
              </td>
            </tr>
          </table>

          <div class="footer_buttons">
            <el-button @click="goback">返回</el-button>
            <el-button type="primary" @click="toEdit">编 辑</el-button>
          </div>
        </el-scrollbar>
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
import { getResourceDetail } from '@/views/index/api/supplies/api.xy'
import preview from '_com/preview.vue'

export default {
  name: 'materialsdetails',
  components: { visBreadcrumb, preview },
  props: {
    uid: '',
    flag: '',
  },
  data() {
    return {
      active:0,
      dialogVisible: false,
      currentEnclosIndex: -1,
      breadcrumbData: [
        { name: '物资装备' },
        { name: '救援物资', routerName: 'materialslist' },
        { name: '物资装备详情' },
      ],
      materialsInfo: {},
      attachmentList: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.getResourceDetail()
    },
    getResourceDetail() {
      let params = {
        uid: this.$route.query.uid,
      }
      getResourceDetail(params)
        .then((res) => {
          if (res && res.code === '00000000') {
            this.materialsInfo = res.data
            this.materialsInfo.attachmentList.forEach((el) => {
              this.attachmentList.push({
                fileType: el.fileType,
                fileFullPath: el.fileFullPath,
              })
            })
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
        name: 'addoreditmaterials',
        query: {
          uid: this.$route.query.uid,
          flag: 'edit',
        },
      })
    },
    playVideo(index) {
      this.currentEnclosIndex = index
      console.log('111',this.currentEnclosIndex)
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
.img-unit {
  width: 100px;
  height: 100px;
  margin-right: 2%;
  margin-top: 10px;
  float: left;
  .fill {
    width: 100%;
    height: 100%;
    cursor: pointer;
    // border-radius: 8px;
  }
}
.inform {
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 42px;
  table,
  table tr th,
  table tr td {
    border: 1px solid #d3d3d3;
    line-height: 22px;
    padding: 10px 10px;
    width: 33.33%;
  }
  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    padding: 2px;
  }
  &:after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
  }
  .activeClass{
    position: relative;
    width: 65px;
    height: 65px;
    margin-bottom: -65px;
    cursor: pointer;
    z-index:99;
    background-image: url(../../../../../../assets/img/supplies/cover.png);
   
    
 }

}
</style>
