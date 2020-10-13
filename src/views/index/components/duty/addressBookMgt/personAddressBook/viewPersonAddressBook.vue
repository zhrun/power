<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 查询人员通讯录
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data='breadcrumbData'></vis-breadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <p class="title title_base">
            <span></span>
            个人基本信息
          </p>
          <div class="name">
            <p>{{model.name}}</p>
            <i class="el-icon-user-solid"></i>
            <span class="unit">{{model.unitName}}</span>
          </div>
          <div class="base_info_box">
            <div
              class="base_info_item"
              v-for="(key, index) in baseInfoKeyList"
              :key="'baseInfoKey' + index"
            >
              <span>{{fieldName[key] + ':'}}</span>
              <span>{{model[key] || '-'}}</span>
            </div>
          </div>
          <p class="title title_other">
            <span></span>
            其他信息
          </p>
          <div class="base_info_box">
            <div
              class="base_info_item"
              :class="{ 'fullWidth': key === 'remark' }"
              v-for="(key, index) in otherInfoKeyList"
              :key="'otherInfoKey' + index"
            >
              <span>{{fieldName[key] + ':'}}</span>
              <span>{{key === 'isSystemUser' ? (model[key] === '1' ? '是' : '否') : (model[key] || '-')}}</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </main>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { fieldName } from "@/utils/fieldName";
import { getPersonDetail, getDicts } from "@/views/index/api/onDuty/api.yy.js";
import _assign from "lodash/assign";

export default {
  name: "view-person-address-book",
  components: { visBreadcrumb },
  props: {
    uid: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    breadcrumbData: [
      { name: "系统管理" },
      { name: "人员通讯录", routerName: "personAddressBook" },
      { name: "查看人员通讯录" },
    ],
    fieldName: fieldName,
    model: {
      name: "",
      unitName: "",
      idCardNo: "",
      unitUid: "",
      country: "",
      fullSpelling: "",
      shortSpelling: "",
      lastNameEn: "",
      firstNameEn: "",
      birthday: "",
      levelName: "",
      leaderSecretaryName: "",
      interUnitName: "",
      interOfficeName: "",
      fax: "",
    },
    baseInfoKeyList: [
      "interUnitName",
      "interOfficeName",
      "country",
      "fullSpelling",
      "shortSpelling",
      "lastNameEn",
      "firstNameEn",
      "birthday",
    ],
    otherInfoKeyList: [
      "title",
      "levelName",
      "leaderSecretaryName",
      "userPhone",
      "officeNo",
      "telephone",
      "fax",
      "idCardType",
      "idCardNo",
      "email",
      "isSystemUser",
      "loginName",
      "remark",
    ],
    phoneKeyList: ["userPhone", "fax"],
    idCardTypeList: [],
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getIdCardTypeList();
    },
    initData(data) {
      _assign(this.model, data);
      // 初始化办公电话和、传真
      const phoneList = data.phoneList;
      this.phoneKeyList.map((key, index) => {
        let phone = phoneList.reduce((pre, cur) => {
          if (cur.type === index + 4) {
            return [...pre, cur.phone];
          } else {
            return pre;
          }
        }, []);
        if (!phone.length) {
          phone = [""];
        }
        this.model[key] = phone.join(",");
      });
      const idCardTypeItem =
        this.idCardTypeList.find((it) => it.dictKey == data.idCardType) || {};
      this.model.idCardType = idCardTypeItem.dictValue;
    },
    // 获取人员详情
    async getPersonDetail() {
      try {
        const params = { uid: this.uid };
        const { code, data } = await getPersonDetail(params);
        if (code === "00000000") {
          this.initData(data);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取证件类型列表
    async getIdCardTypeList() {
      try {
        const params = {
          dictType: "5",
        };
        const { code, data } = await getDicts(params);
        if (code === "00000000" && data) {
          this.idCardTypeList = data[0] && data[0].dictList;
          this.getPersonDetail();
        }
      } catch (err) {
        console.log(err);
      }
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
</style>
