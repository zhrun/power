<template>
  <div>
    <el-dialog :visible.sync="visible" @close="closeDialog" :title="title">
      <div class="import_box">
        <el-row>
          <el-col :span="4">下载模版</el-col>
          <el-col :span="8">
            <a class="import_btn" @click="download">
              <div>
                <i class="el-icon-paperclip"></i>
                <span>{{ downloadTitle }}</span>
              </div>
              <i class="el-icon-download"></i>
            </a>
          </el-col>
          <el-col :span="12"
            >点击左侧“下载模板”按钮，下载模板到本地，并录入数据</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4">导入模板</el-col>
          <el-col :span="8">
            <el-upload
              ref="upload"
              :action="action"
              :multiple="false"
              :data="uploadParam"
              :show-file-list="false"
              :headers="uploadHeaders"
              :accept="acceptFile"
              with-credentials
              name="file"
              :on-success="onSuccess"
            >
              <el-button class="import_button">点击选择要导入的模板</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">选择下载的模板（录入数据后）再导入模板</el-col>
        </el-row>
        <el-row>
          <el-col :span="4"></el-col>
          <el-col :span="20">
            <div class="import_msg_box">
              <template v-if="errorUrl">
                <p>
                  <span style="color: red">导入失败！</span>查看原因：<a
                    :href="errorUrl"
                    >下载</a
                  >
                </p>
              </template>
              <template v-else-if="uploadSuccess">
                <p><span style="color: red">导入成功！</span></p>
              </template>
              <template v-else>
                <p>请选择正确的EXCEL文件导入，</p>
                <p>导入后，显示导入信息</p>
              </template>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"></el-col>
          <el-col :span="20">
            <div class="footer_buttons">
              <el-button @click="closeDialog">关闭</el-button>
              <el-button type="primary" @click="confirm">立即导入</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  importMemberInfoUrl,
  downloadUrl,
} from '@/views/index/api/supplies/api.xy.js'
import { exportFn } from '@/utils/util.js'
import store from '@/store/store.js'

export default {
  name: 'ImportEquipmentDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    downloadTitle: {
      type: String,
      default: '下载模板',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      acceptFile: '.xls,.xlsx',
      visible: false,
      action: importMemberInfoUrl,
      uploadParam: {
        type: '2',
      },
      uploadHeaders: {
        platformType: 2, //1 后台  2 web 3app
        sourceType: 'web',
      },
      successList: [],
      errorUrl: '',
      uploadSuccess: false,
      measuring: {
          1 :'克',
          2 : '千克',
          3 : '公吨',
          4 : '磅',
          5 : '米',
          6 : '厘米',
          7 : '升',
          8 : '毫升',
          9 : '立方米',
          10 : '个',
          11 : '盒',
          12 : '只',
          13 : '件',
          14 : '包',
          15 : '双',
          16 : '台',
          17 : '组',
          18 : '张',
          19 : '套',
          20 : '架',
          21 : '打',
          22 : '卷',
          23 : '辆',
          24 : '头',
          25 : '箱',
          26 : '包',
          27 : '桶',
          28 : '袋',
          29 : '棵',
          30 : '顶'
       },
    }
  },
  methods: {
    // beforeUploadDocument(file) {
    //   let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
    //   const extension = this.acceptFile.indexOf(testmsg)
    //   // const isLt2M = file.size / 1024 / 1024 < 10
    //   if (extension == -1) {
    //     this.$message({
    //       message: '请上传正确文件格式!',
    //       type: 'warning',
    //     })
    //   }
    //   return extension != -1
    // },
    download() {
      exportFn(
        downloadUrl,
        {
          type: '2',
        },
        `主要装备导入模板`,
        // "主要装备导入模板",
        'xls'
      )
    },
    closeDialog() {
      this.$emit('close', false)
    },
    confirm() {
      if (!this.successList.length) {
        this.$message({
          type: 'error',
          message: '请先导入文件！',
        })
        return
      }
      this.$emit('confirm', this.successList)
      for(let i=0;i<this.successList.length;i++){
        this.successList[i].measuringUnitName = this.measuring[this.successList[i].measuringUnit]
      }
      this.$refs.upload.clearFiles()
      this.successList = []
      this.uploadSuccess = false
      this.errorUrl = false
      this.closeDialog()
    },
    onSuccess({ code, data, viewMsg }) {
      if (code === '00000000') {
        this.errorUrl = ''
        this.successList = data.list
        this.uploadSuccess = true
      } else if (code === '10060002') {
        this.$message({ message: viewMsg, type: 'error' })
        store.commit('exitLogin')
        setTimeout(() => {
          window.location.href = './'
        }, 500)
      } else if (code === '10020004') {
        this.errorUrl = data.fileUrl
        this.uploadSuccess = false
      } else {
        let msg = '访问出错'
        if (viewMsg) {
          msg = viewMsg
        }
        this.$message({ message: msg, type: 'error' })
      }
    },
  },
  watch: {
    showDialog(val) {
      this.visible = val
    },
  },
}
</script>

<style lang="scss" scoped>
.import_box {
  .el-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .el-col {
      &:first-child {
        text-align: right;
        color: #666666;
        margin-right: 10px;
      }
      .import_button {
        width: 100%;
        color: #fff;
        background-color: #5458fe;
      }
      &:nth-child(2) {
        margin-right: 20px;
        .import_btn {
          cursor: pointer;
          padding: 0 10px;
          height: 40px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f0f2f5;
          border-radius: 6px;
          div {
            display: flex;
            align-items: center;
          }
          i {
            color: #999999;
            font-size: 16px;
            & + span {
              margin-left: 10px;
            }
            &:last-child {
              cursor: pointer;
              &:hover {
                color: #5458fe;
              }
            }
          }
        }
      }
      &:nth-child(3) {
        color: #999999;
      }
      .import_msg_box {
        border: 1px solid #e5eaf4;
        padding: 15px;
        border-radius: 6px;
        height: 100px;
        color: #c3c9d8;
      }
      /deep/ .el-upload {
        width: 100%;
      }
    }
  }
}
</style>
