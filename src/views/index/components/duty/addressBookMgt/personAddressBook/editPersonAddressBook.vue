<!-- 
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 新增/编辑人员通讯录
-->
<template>
  <div>
    <vis-breadcrumb :breadcrumb-data='breadcrumbData'></vis-breadcrumb>
    <main class='main_container'>
      <div class="main_container_flex">
        <el-scrollbar class="main_right">
          <el-form ref="userForm" :model="model" :rules="rules" label-width="110px">
            <table width="100%">
              <tr>
                <td class="form_item">
                  <el-form-item label="姓名" prop="name" ref="name">
                    <div class="input_btn">
                      <el-input v-model.trim="model.name" maxlength="10" @input="handleInputName"></el-input>
                    </div>
                  </el-form-item>
                </td>

                <td class="remarks" v-html="personConfig['name'][0]"></td>
                <td class="remarks" v-html="personConfig['name'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="所属单位" prop="unitName" ref="unitName">
                    <div class="input_btn">
                      <el-input v-model="model.unitName" disabled></el-input>
                      <el-button type="primary" @click="selectUnit">选择</el-button>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['unitName'][0]"></td>
                <td class="remarks" v-html="personConfig['unitName'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="所在内设机构" prop="interUnitUid" ref="interUnitUid">
                    <el-select
                      style="width:100%"
                      v-model="model.interUnitUid"
                      @change="changeInterUnit"
                      :disabled="!!model.interOfficeUid"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in interUnitList"
                        :key="item.uid"
                        :value="item.uid"
                        :label="item.unitName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['interUnitUid'][0]"></td>
                <td class="remarks" v-html="personConfig['interUnitUid'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="所在处（科）室" prop="interOfficeUid" ref="interOfficeUid">
                    <el-select
                      v-model="model.interOfficeUid"
                      style="width:100%"
                      @change="changeInterOffice"
                      :disabled="!!model.interUnitUid"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in interOfficeList"
                        :key="item.uid"
                        :value="item.uid"
                        :label="item.unitName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['interOfficeUid'][0]"></td>
                <td class="remarks" v-html="personConfig['interOfficeUid'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="全拼" prop="fullSpelling" ref="fullSpelling">
                    <div class="input_btn">
                      <el-input v-model.trim="model.fullSpelling" maxlength="20"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['fullSpelling'][0]"></td>
                <td class="remarks" v-html="personConfig['fullSpelling'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="简拼" prop="shortSpelling" ref="shortSpelling">
                    <div class="input_btn">
                      <el-input v-model.trim="model.shortSpelling" maxlength="20"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['shortSpelling'][0]"></td>
                <td class="remarks" v-html="personConfig['shortSpelling'][1]"></td>
              </tr>
              

              <tr>
                <td class="form_item">
                  <el-form-item label="英文姓" prop="lastNameEn" ref="lastNameEn">
                    <div class="input_btn">
                      <el-input v-model.trim="model.lastNameEn"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['lastNameEn'][0]"></td>
                <td class="remarks" v-html="personConfig['lastNameEn'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="英文名" prop="firstNameEn" ref="firstNameEn">
                    <div class="input_btn">
                      <el-input v-model.trim="model.firstNameEn"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['firstNameEn'][0]"></td>
                <td class="remarks" v-html="personConfig['firstNameEn'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="性别" prop="sex" ref="sex">
                    <el-radio-group v-model="model.sex">
                      <el-radio
                        v-for="(item, index) in sexList"
                        :key="'sex' + index"
                        :label="item.label"
                      >
                        {{item.text}}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['sex'][0]"></td>
                <td class="remarks" v-html="personConfig['sex'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="职务" prop="titleUid" ref="titleUid" required>
                    <div class="title_td">
                      <div class="select_input">
                        <el-select v-model="model.titleUid">
                          <el-option
                            v-for="(item, index) in titleOptions"
                            :key="'title' + index"
                            :value="item.uid"
                            :label="item.name"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-model.trim="model.titleNameEx"
                          :disabled="model.titleUid && model.titleUid !== '99'"
                          @blur="handleTitleBlur"
                        ></el-input>
                      </div>
                      <el-checkbox
                        v-if="model.titleUid === '99'"
                        v-model="model.titleShow"
                        class="checkbox_tip"
                      >
                        是否把你输入的职务加入到常见职务列中
                      </el-checkbox>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['title'][0]"></td>
                <td class="remarks" v-html="personConfig['title'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="级别" prop="levelUid" ref="levelUid" required>
                    <div class="title_td">
                      <div class="select_input">
                        <el-select v-model="model.levelUid">
                          <el-option
                            v-for="(item, index) in levelOptions"
                            :key="'level' + index"
                            :value="item.uid"
                            :label="item.name"
                          ></el-option>
                        </el-select>
                        <el-input
                          v-model.trim="model.levelNameEx"
                          :disabled="model.levelUid && model.levelUid !== '99'"
                          @blur="handleLevelBlur"
                        ></el-input>
                      </div>
                      <el-checkbox
                        v-if="model.levelUid === '99'"
                        v-model="model.levelShow"
                        class="checkbox_tip"
                      >
                        是否把你输入的级别加入到常见级别列中
                      </el-checkbox>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['level'][0]"></td>
                <td class="remarks" v-html="personConfig['level'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="领导秘书" prop="leaderSecretaryName" ref="leaderSecretaryName">
                    <div class="input_btn">
                      <el-input v-model.trim="model.leaderSecretaryName"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['leaderSecretaryName'][0]"></td>
                <td class="remarks" v-html="personConfig['leaderSecretaryName'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="位次" prop="sortId" ref="sortId">
                    <div class="input_btn">
                      <el-input v-model.trim="model.sortId" @blur="handleSortIdBlur"></el-input>
                      <el-button style="width:120px" type="primary" @click="viewSortId">查看位次</el-button>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['sortId'][0]"></td>
                <td class="remarks" v-html="personConfig['sortId'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="出生日期" prop="birthday" ref="birthday">
                    <el-date-picker
                      v-model="model.birthday"
                      type="date"
                      format="yyyy-MM-dd"
                      placeholder="请选择日期"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['birthday'][0]"></td>
                <td class="remarks" v-html="personConfig['birthday'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="国籍" prop="country" ref="country">
                    <div class="input_btn">
                      <el-input v-model.trim="model.country"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['country'][0]"></td>
                <td class="remarks" v-html="personConfig['country'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="办公室号" prop="officeNo" ref="officeNo">
                    <div class="input_btn">
                      <el-input v-model.trim="model.officeNo"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['officeNo'][0]"></td>
                <td class="remarks" v-html="personConfig['officeNo'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="办公电话" ref="userPhone" required>
                    <div
                      class="phone_item"
                      v-for="(item, index) in model.userPhone"
                      :class="{ 'is-error': phoneValidate['userPhone'][index] || (phoneGroupRequired['userPhone'] && index === 0) }"
                      :key="'userPhone-item-' + index"
                    >
                      <div class="phone_item_content">
                        <el-input v-model="model.userPhone[index]" @input="handleInputPhone('userPhone', index)" @blur="handlePhoneBlur('userPhone', index)"></el-input>
                        <i
                          v-if="index === 0"
                          class="el-icon-circle-plus"
                          @click="addPhone('userPhone')"
                        ></i>
                        <i
                          v-else
                          class="el-icon-remove"
                          @click="removePhone('userPhone', index)"
                        ></i>
                      </div>
                      <span
                        v-show="phoneValidate['userPhone'][index]"
                        class="phone_tips"
                      >请输入正确的号码</span>
                      <span
                        v-show="phoneGroupRequired['userPhone'] && index === 0"
                        class="phone_tips"
                      >请输入号码</span>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['userPhone'][0]"></td>
                <td class="remarks" v-html="personConfig['userPhone'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="电话是否公开" prop="phoneOpen" ref="phoneOpen">
                    <el-radio-group v-model="model.phoneOpen">
                      <el-radio
                        v-for="(item, index) in phoneOpenList"
                        :key="'phoneOpen' + index"
                        :label="item.label"
                      >
                        {{item.text}}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['phoneOpen'][0]"></td>
                <td class="remarks" v-html="personConfig['phoneOpen'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="手机号码" prop="telephone" ref="telephone">
                    <div class="input_btn">
                      <el-input v-model.trim="model.telephone" maxlength="11"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['telephone'][0]"></td>
                <td class="remarks" v-html="personConfig['telephone'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="传真" ref="fax">
                    <div
                      class="phone_item"
                      v-for="(item, index) in model.fax"
                      :class="{ 'is-error': phoneValidate['fax'][index] }"
                      :key="'fax-item-' + index"
                    >
                      <div class="phone_item_content">
                        <el-input v-model="model.fax[index]" @blur="handlePhoneBlur('fax', index)"  @input="handleInputPhone('fax', index)"></el-input>
                        <i
                          v-if="index === 0"
                          class="el-icon-circle-plus"
                          @click="addPhone('fax')"
                        ></i>
                        <i
                          v-else
                          class="el-icon-remove"
                          @click="removePhone('fax', index)"
                        ></i>
                      </div>
                      <span
                        v-show="phoneValidate['fax'][index]"
                        class="phone_tips"
                      >请输入正确的号码</span>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['fax'][0]"></td>
                <td class="remarks" v-html="personConfig['fax'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="电子邮件" prop="email" ref="email">
                    <div class="input_btn">
                      <el-input v-model.trim="model.email"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['email'][0]"></td>
                <td class="remarks" v-html="personConfig['email'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="证件类型" prop="idCardType" ref="idCardType">
                    <el-select
                      v-model="model.idCardType"
                      style="width:100%"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in idCardTypeList"
                        :key="item.dictValue"
                        :value="item.dictKey"
                        :label="item.dictValue"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['idCardType'][0]"></td>
                <td class="remarks" v-html="personConfig['idCardType'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="证件号码" prop="idCardNo" ref="idCardNo">
                    <div class="input_btn">
                      <el-input v-model.trim="model.idCardNo"></el-input>
                    </div>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['idCardNo'][0]"></td>
                <td class="remarks" v-html="personConfig['idCardNo'][1]"></td>
              </tr>
              <tr>
                <td class="form_item">
                  <el-form-item label="备注" prop="remark" ref="remark">
                    <el-input
                      v-model="model.remark"
                      type="textarea"
                      maxlength="100"
                      placeholder="请输入备注内容"
                      rows="5"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </td>
                <td class="remarks" v-html="personConfig['remark'][0]"></td>
                <td class="remarks" v-html="personConfig['remark'][1]"></td>
              </tr>
            </table>
            <el-form-item class="bottom_buttons">
              <el-button @click.native="back">返回</el-button>
              <el-button type="primary" @click.native="save">保存</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </main>
    <unit-tree-dialog
      ref="tree"
      :show="showUnitTree"
      :unit-data="unitData"
      :current-uid="currentUid"
      @close="closeUnitTreeDialog"
      @confirm="confirm"
    >
    </unit-tree-dialog>
    <sort-id-dialog
      :show="showSortIdTree"
      :sort-id-list="sortIdList"
      :default-props="defaultProps"
      @close="closeSortIdDialog"
    >
    </sort-id-dialog>
  </div>
</template>

<script>
import visBreadcrumb from "_com/breadcrumb.vue";
import { personConfig } from "./personConfig.js";
import unitTreeDialog from "@/components/common/unitTreeDialog";
import sortIdDialog from "@/components/common/sortIdDialog";
import { spellingU, logogramU } from "@/utils/pinyinUtil";
import {
  querySortList,
  queryBackTree,
  addPerson,
  editPerson,
  getPersonDetail,
  queryPersonSortList,
  getPersonSortId,
  checkPersonName,
  checkPersonTelephone,
  getDicts,
} from "@/views/index/api/onDuty/api.yy.js";
import { getPostionList } from "@/views/index/api/onDuty/api.zr.js";
import { checkEmail } from "@/utils/validator";
import _cloneDeep from "lodash/cloneDeep";
import _assign from "lodash/assign";

export default {
  name: "edit-person-address-book",
  components: { visBreadcrumb, unitTreeDialog, sortIdDialog },
  props: {
    flag: "",
    unitName: "",
    unitUid: "",
    uid: "",
    interUnitUid: "",
    interOfficeUid: "",
  },
  data() {
    const _this = this;
    const validateName = async (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5]+(\d+)?$/;
      if (value && !reg.test(value)) {
        return callback(new Error("请正确输入姓名"));
      }
      if (value !== _this.initialData.name) {
        const params = {
          unitId: this.model.unitUid,
          name: value,
        };
        const { code, data } = await checkPersonName(params);
        if (code === "00000000" && data) {
          return callback("姓名已存在，建议以姓名+后缀加以区分，如：张三1。");
        }
        return callback();
      }
      callback();
    };
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择职务"));
      } else if (value === "99" && !this.model.titleNameEx) {
        return callback(new Error("请输入职务"));
      }
      callback();
    };
    const validateLevel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择级别"));
      } else if (value === "99" && !this.model.levelNameEx) {
        return callback(new Error("请输入级别"));
      }
      callback();
    };
    const checkTelephone = async (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      let reg = /^1\d{10}$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的手机号码"));
      }
      if (value !== _this.initialData.telephone) {
        const params = {
          telephone: value,
        };
        const { code, data } = await checkPersonTelephone(params);
        if (code === "00000000" && data) {
          return callback("手机号码已存在");
        }
        return callback();
      }
      callback();
    };
    const checkSortId = (rule, value, callback) => {
      let reg = /^([1-9][0-9]{0,2})(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的位次"));
      } else if (
        value - _this.initialData.sortId !== 0 &&
        _this.sortIdList.find((it) => it.sortId - value === 0)
      ) {
        return callback("位次已存在");
      }
      callback();
    };
    const validateIdCardNO = (rule, value, callback) => {
      // let reg = /^([1-9][0-9]{0,2})(\.\d{1,2})?$/;
      // 15/18位身份证号码
      const IDCardReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      const passportReg = /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/;
      if (!value) {
        return callback();
      }
      if (_this.model.idCardType === '1' && !IDCardReg.test(value)) {
        return callback(new Error("请输入正确的身份证号码"));
      }
      if (_this.model.idCardType === '3' && !passportReg.test(value)) {
        return callback(new Error("请输入正确的护照号码"));
      }
      callback();
    };
    return {
      breadcrumbData: [
        { name: "通讯录管理" },
        { name: "人员通讯录", routerName: "personAddressBook" },
      ],
      currentUid: "",
      personConfig: personConfig,
      model: {
        uid: "",
        name: "",
        unitName: "",
        unitUid: "",
        interUnitUid: "",
        interOfficeUid: "",
        fullSpelling: "",
        shortSpelling: "",
        lastNameEn: "",
        firstNameEn: "",
        sex: 0,
        titleUid: "",
        title: "",
        titleNameEx: "",
        titleShow: false,
        levelUid: "",
        levelName: "",
        levelNameEx: "",
        levelShow: false,
        leaderSecretaryName: "",
        sortId: "",
        birthday: "",
        country: "中国",
        officeNo: "",
        userPhone: [""],
        phoneOpen: "",
        telephone: "",
        fax: [""],
        email: "",
        idCardType: "",
        idCardNo: "",
        remark: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        titleUid: [{ validator: validateTitle, trigger: "blur" }],
        levelUid: [{ validator: validateLevel, trigger: "blur" }],
        phoneOpen: [
          { required: true, message: "请选择是否公开电话", trigger: "change" },
        ],
        telephone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkTelephone, trigger: "blur" },
        ],
        unitName: [
          { required: true, message: "请选择所属单位", trigger: "blur" },
        ],
        idCardNo: [
          { validator: validateIdCardNO, trigger: "blur" },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        sortId: [
          { required: true, message: "请输入位次", trigger: "blur" },
          { validator: checkSortId, trigger: "blur" },
        ],
      },
      interUnitList: [],
      interOfficeList: [],
      idCardTypeList: [],
      sexList: [
        {
          label: 0,
          text: "男",
        },
        {
          label: 1,
          text: "女",
        },
      ],
      titleOptions: [],
      levelOptions: [],
      loading: false,
      unitData: [],
      showUnitTree: false,
      showSortIdTree: false,
      phoneKeyList: ["userPhone", "fax"],
      phoneGroupRequired: {
        userPhone: false,
      },
      phoneValidate: {
        userPhone: [false],
        fax: [false],
      },
      phoneOpenList: [
        {
          label: 1,
          text: "完全公开",
        },
        {
          label: 2,
          text: "本级公开",
        },
      ],
      sortIdList: [],
      defaultProps: [
        { label: "姓名", prop: "name" },
        { label: "位次", prop: "sortId" },
      ],
      proKey: "",
      initialData: {},
    };
  },
  computed: {
    isEdit() {
      return this.flag === "edit";
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const userInfo = JSON.parse(
        localStorage.getItem("vis_user_info") || "{}"
      );
      this.proKey = userInfo.proKey;
      this.breadcrumbData.push({
        name: this.isEdit ? "修改通讯录" : "新增通讯录",
      });
      // 获取证件类型列表
      this.getIdCardTypeList();
      if (!this.isEdit) {
        this.model.unitName = this.unitName || "";
        this.model.unitUid = this.unitUid;
        this.model.interUnitUid = this.interUnitUid || "";
        this.model.interOfficeUid = this.interOfficeUid || "";
        this.getPersonSortId();
        this.getInitData();
      }
    },
    handleInputName(val) {
      // 根据用户姓名生成全拼、简拼
      this.model.fullSpelling = spellingU(val).slice(0, 20);
      this.model.shortSpelling = logogramU(val).slice(0, 20);
    },
    handleSortIdBlur(event) {
      const val = event.currentTarget.value;
      // 输入的格式有误
      if (!/^([1-9][0-9]{0,2})(\.\d{1,2})?$/.test(val)) return;
      this.model.sortId = Number(val).toFixed(2);
    },
    getInitData() {
      this.queryBackTree();
      // 获取职务列表
      this.getTitleList();
      // 获取级别列表
      this.getLevelList();
      // 获取所在内设机构列表
      this.queryInterUnitList();
      // 获取所在处科室列表
      this.queryInterOfficeList();
      // 获取位次列表
      this.queryPersonSortList();
    },
    // 初始化编辑带入的详情信息
    initEditData(data) {
      _assign(this.model, data);
      // 初始化职务、级别
      if (!data.titleUid && data.title) {
        this.model.titleNameEx = data.title;
      }
      if (!data.levelUid && data.levelName) {
        this.model.levelNameEx = data.levelName;
      }
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
        this.model[key] = phone;
      });
      this.model.sortId = Number(data.sortId).toFixed(2);
      this.model.idCardType = data.idCardType.toString();
      this.getInitData();
    },
    // 切换内设机构
    changeInterUnit(val) {
      if (!val) return;
      this.model.interUnitUid = val;
      this.queryPersonSortList();
      this.getPersonSortId();
    },
    // 切换内设处科室
    changeInterOffice(val) {
      if (!val) return;
      this.model.interOfficeUid = val;
      this.queryPersonSortList();
      this.getPersonSortId();
    },
    handleTitleBlur() {
      this.$refs["userForm"].validateField("titleUid");
    },
    handleLevelBlur() {
      this.$refs["userForm"].validateField("levelUid");
    },
    // 增加电话行
    addPhone(key) {
      this.model[key].push("");
      this.phoneValidate[key].push(false);
    },
    // 删除电话行
    removePhone(key, index) {
      this.model[key].splice(index, 1);
      this.phoneValidate[key].splice(index, 1);
    },
    // 电话行输入框失焦回调
    handlePhoneBlur(key, index) {
      const val = this.model[key][index];
      this.$set(this.phoneValidate[key], index, this.validateTelPhone(val));
    },
    // 电话行输入框输入回调
    handleInputPhone(key, index) {
      this.$set(this.phoneValidate[key], index, false);
      this.phoneGroupRequired[key] = false;
    },
    // 校验座机号码或手机号码
    validateTelPhone(val) {
      return (
        val &&
        (!/^\d{3,4}-\d{7,8}$/.test(val) &&
          !/^1\d{10}$|^0\d{2,3}-?\d{7,8}$/.test(val))
      );
    },
    // 单独校验电话组,返回出错的电话组所在的字段
    getPhoneErrorKey() {
      const requiredPhoneKeyList = ["userPhone"];
      // 触发电话组必填校验
      requiredPhoneKeyList.map((key) => {
        this.phoneGroupRequired[key] = !this.model[key].join("");
      });
      // 获取报错的电话组中的第一个
      let errorKey = "";
      this.phoneKeyList.some((key) => {
        // 必填校验不通过 或 任一个电话号码规则校验不通过，抛出报错的字段名
        if (
          this.phoneGroupRequired[key] ||
          this.phoneValidate[key].some(Boolean)
        ) {
          errorKey = key;
          return true;
        }
      });
      return errorKey;
    },
    // 打开机构树选择弹框
    selectUnit() {
      this.currentUid = this.model.unitUid;
      this.showUnitTree = true;
    },
    // 关闭机构选择弹框
    closeUnitTreeDialog() {
      this.showUnitTree = false;
    },
    // 确认选择机构
    confirm({ uid, unitName, parentUid, unitType }) {
      if (unitType !== 1) {
        // 選中的不是單位
        this.model[`inter${unitType === 2 ? "Unit" : "Office"}Uid`] = uid;
        // 清空另一個選項
        this.model[`inter${unitType === 2 ? "Office" : "Unit"}Uid`] = "";
        this.model["unitUid"] = parentUid;
        // 查找父級unitName
        this.model["unitName"] = this.getParentUnitName(
          this.unitData,
          parentUid
        );
      } else {
        this.model.interUnitUid = "";
        this.model.interOfficeUid = "";
        this.model["unitUid"] = uid;
        this.model["unitName"] = unitName;
      }
      // 初始化职务
      this.model.titleUid = "";
      this.model.title = "";
      this.model.titleNameEx = "";
      this.model.titleShow = false;
      // 获取职务列表
      this.getTitleList();
      // 初始化级别
      this.model.levelUid = "";
      this.model.levelName = "";
      this.model.levelNameEx = "";
      this.model.levelShow = false;
      // 获取级别列表
      this.getLevelList();
      // 获取所在内设机构列表
      this.queryInterUnitList();
      // 获取所在处科室列表
      this.queryInterOfficeList();
      // 获取位次列表
      this.queryPersonSortList();
      this.closeUnitTreeDialog();
      // 重新获取位次
      this.getPersonSortId();
      this.$nextTick(() => {
        this.$refs["userForm"].clearValidate();
      });
    },
    // 查找内设机构、内设处所属单位
    getParentUnitName(list, uid) {
      let unitName = "";
      const res = list.find((it) => it.uid === uid);
      if (res) {
        unitName = res.unitName;
      } else {
        list.map((it) => {
          unitName = this.getParentUnitName(it.childList, uid);
        });
      }
      return unitName;
    },
    // 打开查看位次弹框
    viewSortId() {
      this.showSortIdTree = true;
    },
    // 关闭查看位次弹框
    closeSortIdDialog() {
      this.showSortIdTree = false;
    },
    // 点击返回
    back() {
      this.$confirm("是否确定要返回？", "提示")
        .then(() => {
          this.goback();
        })
        .catch();
    },
    // 回退
    goback() {
      this.$router.go(-1);
    },
    // 点击保存
    save() {
      this.$refs["userForm"].validate((valid, obj) => {
        if (valid) {
          const errorKey = this.getPhoneErrorKey();
          if (errorKey) {
            const dom = this.$refs[errorKey];
            dom.$el.scrollIntoView({
              //滚动到指定节点
              block: "center",
              behavior: "smooth",
            });
            return false;
          }
          this.validateSuccess();
        } else {
          const key = Object.keys(obj)[0];
          const errorKey = this.getPhoneErrorKey();
          // 插入电话组校验
          let scrollKey = "";
          if (errorKey) {
            // 电话组之前的校验字段
            const validateKeys = [
              "name",
              "unitName",
              "sex",
              "titleUid",
              "levelUid",
              "sortId",
            ];
            scrollKey = validateKeys.includes(key) ? key : errorKey;
          } else {
            scrollKey = key;
          }
          const dom = this.$refs[scrollKey];
          if (!dom) return false;
          dom.$el.scrollIntoView({
            //滚动到指定节点
            block: "center",
            behavior: "smooth",
          });
        }
      });
    },
    // 校验通过
    async validateSuccess() {
      console.log("model", this.model);
      // this.loading = true;
      const { code } = await (this.flag === "add"
        ? addPerson(this.buildParams("add"))
        : editPerson(this.buildParams("edit")));
      if (code === "00000000") {
        this.goback();
      }
    },
    // 组装参数
    buildParams() {
      const params = _cloneDeep(this.model);
      // 组装电话号码
      const phoneList = [];
      this.phoneKeyList.map((key, index) => {
        params[key].map((phone) => {
          phone &&
            phoneList.push({
              type: index + 4, // 4-用户电话 5-用户传真
              phone: phone,
              unitUid: this.model.uid,
            });
        });
      });
      params.phoneList = phoneList;
      // 职务
      if (params.titleUid === "99") {
        params.title = params.titleNameEx;
        params.titleUid = "";
      }
      params.titleShow = params.titleShow ? "1" : "0";
      // 级别
      if (params.levelUid === "99") {
        params.levelName = params.levelNameEx;
        params.levelUid = "";
      }
      params.levelShow = params.levelShow ? "1" : "0";
      params.unitType = !params.interUnitUid && !params.interOfficeUid ? 1 : "";
      params.unitType = params.interUnitUid ? 2 : "";
      params.unitType = params.interOfficeUid ? 3 : "";
      // 删除不需要的参数
      delete params.titleNameEx;
      delete params.levelNameEx;
      delete params.userPhone;
      delete params.fax;
      return params;
    },
    // 获取职务列表
    async getTitleList() {
      try {
        const params = {
          "where.type": 1,
          "where.ifShow": 1,
          "where.unitUid":
            this.model.unitUid,
          pageSize: 0, // 查询全部
        };
        const { code, data } = await getPostionList(params);
        if (code === "00000000") {
          this.titleOptions = [...data.list, { name: "其他", uid: "99" }];
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取级别列表
    async getLevelList() {
      try {
        const params = {
          "where.type": 2,
          "where.ifShow": 1,
          "where.unitUid":
            this.model.unitUid,
          pageSize: 0, // 查询全部
        };
        const { code, data } = await getPostionList(params);
        if (code === "00000000") {
          this.levelOptions = [...data.list, { name: "其他", uid: "99" }];
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取机构树列表
    async queryBackTree() {
      try {
        const params = {
          filterType: 4,
          unitType: 1,
        };
        const { code, data } = await queryBackTree(params);
        if (code === "00000000") {
          this.unitData = [data];
          this.model.unitName =
            this.model.unitName ||
            this.getParentUnitName(this.unitData, this.model.unitUid);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取内设机构列表
    async queryInterUnitList() {
      try {
        const params = {
          parentUid: this.model.unitUid,
          unitType: 2,
        };
        const { code, data } = await querySortList(params);
        if (code === "00000000") {
          const others = { uid: "", unitName: "请选择" };
          this.interUnitList = [others, ...data];
        }
      } catch {
        // this.errorMessage("获取机构树失败!");
      }
    },
    // 获取内设处列表
    async queryInterOfficeList() {
      try {
        const params = {
          parentUid: this.model.unitUid,
          unitType: 3,
        };
        const { code, data } = await querySortList(params);
        if (code === "00000000") {
          const others = { uid: "", unitName: "请选择" };
          this.interOfficeList = [others, ...data];
        }
      } catch {
        // this.errorMessage("获取机构树失败!");
      }
    },
    // 获取人员位次列表
    async queryPersonSortList() {
      try {
        const params = {
          unitId: this.model.unitUid,
          interUnitUid: this.model.interUnitUid || null,
          interOfficeUid: this.model.interOfficeUid || null,
        };
        const { code, data } = await queryPersonSortList(params);
        if (code === "00000000") {
          this.sortIdList = data;
        }
      } catch {
        // this.errorMessage("获取机构树失败!");
      }
    },
    // 获取人员详情
    async getPersonDetail() {
      try {
        const params = { uid: this.uid };
        const { code, data } = await getPersonDetail(params);
        if (code === "00000000") {
          this.initEditData(data);
          this.initialData = data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 根据父级单位id生成位次
    async getPersonSortId() {
      try {
        const params = {
          unitId: this.model.unitUid,
          interUnitUid: this.model.interUnitUid || null,
          interOfficeUid: this.model.interOfficeUid || null,
        };
        const { code, data } = await getPersonSortId(params);
        if (code === "00000000") {
          this.model.sortId = Number(data).toFixed(2);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getIdCardTypeList() {
      try {
        const params = {
          dictType: "5",
        };
        const { code, data } = await getDicts(params);
        if (code === "00000000" && data) {
          this.idCardTypeList = data[0] && data[0].dictList;
          this.model.idCardType = this.idCardTypeList[0].dictKey;
          this.isEdit && this.getPersonDetail();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
tr {
  border: 1px solid $border_color;
  td {
    padding: 20px;
    border-left: 1px solid $border_color;
    &:first-child {
      border-left: none;
    }
  }
  .form_item {
    min-width: 550px;
    color: #333333;
    .el-form-item {
      width: 100%;
      margin-bottom: 0px;
    }
    .el-button {
      margin-left: 10px;
    }
    .psd_tip {
      position: absolute;
      left: 0px;
      top: 40px;
      font-size: 12px;
      line-height: 12px;
      padding-top: 4px;
    }
    .input_btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .select_group {
    display: flex;
    .el-select {
      flex: 1;
      & + .el-select {
        margin-left: 10px;
      }
    }
  }
  .phone_item {
    position: relative;
    .phone_item_content {
      display: flex;
      align-items: center;
      i {
        font-size: 22px;
        cursor: pointer;
        color: #5458fe;
        margin-left: 10px;
      }
    }
    & + .phone_item {
      margin-top: 20px;
    }
    .phone_tips {
      color: $error_color;
      font-size: 12px;
      line-height: 12px;
      position: absolute;
      left: 0px;
      top: 100%;
      padding-top: 4px;
    }
    &.is-error {
      /deep/ .el-input__inner {
        border-color: $error_color;
      }
    }
  }
  .remarks {
    width: 30%;
    font-size: 12px;
    color: #999999;
    .tips {
      color: #ff0000;
    }
  }
}
/deep/ .el-form-item__content {
  .el-select + .el-input {
    margin-left: 10px;
    width: 60%;
  }
  .title_td {
    .select_input {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.bottom_buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 44px;
  margin-bottom: 49px;
  .el-button {
    width: 130px;
    & + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
