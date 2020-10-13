<!-- 
* @module unit-management
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查看组织机构详情
-->
<template>
  <div>
    <visBreadcrumb :breadcrumb-data='breadcrumbData'></visBreadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <p class="title title_base">
            <span></span>
            {{model.unitName}}
          </p>
          <div class="base_info_box">
            <div
              class="base_info_item"
              :class="{ 'fullWidth': fullWidthKey.includes(key) }"
              v-for="(key, index) in keyList"
              :key="'key' + index"
            >
              <span>{{fieldName[key] + ':'}}</span>
              <span>{{model[key] || "-"}}</span>
            </div>
          </div>
          <div class="footer_button">
            <el-button @click="back">返回</el-button>
          </div>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { fieldName } from "@/utils/fieldName";
import { getUnitDetail } from "@/views/index/api/onDuty/api.yy.js";
import _assign from 'lodash/assign'

export default {
  name: "view-unit",
  components: { visBreadcrumb },
  props: {
    uid: "",
  },
  data: () => ({
    breadcrumbData: [
      { name: "系统管理" },
      { name: "组织机构", routerName: 'unitManagement' },
      { name: "查看单位" },
    ],
    model: {
      parentUnitName: "",
      workArea: "",
      areaCode: "",
      unitName: "",
      unitShortName: "",
      unitCode: "",
      unitPhone: "",
      dutyPhone: "",
      fax: "",
      roomPhone: "",
      principal: "",
      address: "",
      zipCode: "",
      sortId: "",
      remark: "",
    },
    fieldName: fieldName,
    keyList: [ // 表格每列对应的字段名
      "unitName",
      "unitShortName",
      "parentUnitName",
      "workArea",
      "areaCode",
      "unitCode",
      "roomPhone",
      "principal",
      "address",
      "zipCode",
      "sortId",
      "unitPhone",
      "dutyPhone",
      "fax",
      "remark",
    ],
    fullWidthKey: [ // 占满整行的字段
      'unitPhone',
      "dutyPhone",
      "fax",
      "remark"
    ]
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getUnitDetail();
    },
    // 根据机构id获取机构详情
    async getUnitDetail() {
      try {
        const { code, data } = await getUnitDetail({ uid: this.uid });
        if (code === "00000000") {
          this.setModel(data);
          return;
        }
      } catch {
        this.$message({
          message: "查询机构详情失败",
          type: "error",
        });
      }
    },
    // 根据返回的数据初始化页面数据
    setModel(data) {
      _assign(this.model, data);
      this.model.workArea = `${data.privence || ""}${data.city ||
        ""}${data.county || ""}${data.town || ""}`;
      let phoneData = {
        unitPhone: [],
        dutyPhone: [],
        fax: [],
      };
      const phoneKeyList = ["unitPhone", "dutyPhone", "fax"];
      data.phoneList.map(({ type, phone }) => {
        phoneData[phoneKeyList[type - 1]].push(phone);
      });
      phoneKeyList.map((key) => {
        this.model[key] = phoneData[key].join(",");
      });
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.title {
  color: #5458fe;
  &.title_base {
    margin-bottom: 20px;
  }
  &.title_other {
    margin-top: 40px;
  }
  span {
    display: inline-block;
    width: 6px;
    height: 12px;
    border-radius: 3px;
    background-color: #5458fe;
    margin-right: 10px;
  }
}
.name {
  display: flex;
  align-items: center;
  padding-left: 20px;
  p {
    font-size: 20px;
    color: #333333;
  }
  i {
    font-size: 20px;
    color: #5458fe;
    margin-left: 10px;
  }
  span {
    margin-left: 10px;
    display: inline-block;
    background-color: #5458fe;
    border-radius: 12px;
    color: #ffffff;
    padding: 0 13px;
    height: 24px;
    line-height: 24px;
  }
}
.base_info_box {
  padding-left: 20px;
  display: flex;
  flex-wrap: wrap;
  .base_info_item {
    width: 25%;
    margin-top: 20px;
    span {
      &:first-child {
        color: #999999;
      }
      &:last-child {
        color: #333333;
        margin-left: 10px;
      }
    }
  }
  .fullWidth {
    width: 100%;
  }
}
.footer_button {
  text-align: center;
  margin-top: 50px;
}
</style>
