/**
* @module addressBookMgt
* @author yaoyun <yaoyun@umxwe.com>
* @creatDate 2020-06-09
* @description 单位通讯录提示文本
*/
export const unitConfig = {
  unitType: [
    `独立法人单位是拥有独立上报下发权限的机构；</br>
      内设机构下只能添加内设处（科、股）室；</br>
      内设处（科、股）室下不可添加下级机构；</br>
      选择类别创建的机构不能维护人员信息。`,
    "<span style='color:red'>注：机构创建成功后，该项不可更改。</span>",
  ],
  parentUnitName: [
    "该机构上级主管单位的中文全称",
    "如长沙市应急管理局下的办公室，应急办等内设机构或内设处室，此处应该选择长沙市应急管理局",
  ],
  workArea: [
    "单位所负责的行政区域,如果所负责的行政区域是市级，仅选到市级就可以，如果是乡镇，选择到乡镇名称",
    "如：湖南省、湖南省长沙市、湖南省怀化市溆浦县、湖南省怀化市溆浦县卢锋镇",
  ],
  unitName: [
    "指该机构的官方中文全称。如：芙蓉区卫生和计划生育局填写长沙市芙蓉区卫生和计划生育局。",
    "如：长沙市芙蓉区卫生和计划生育局。",
  ],
  unitShortName: ["官方规范简称，参照机要规范填写。", "如：芙蓉区卫计局。"],
  unitCode: [
    "全国组织机构代码由八位数字（或大写拉丁字母）本体代码和一位数字（或大写拉丁字母）校验码组成，当机构类别为“内设处、科、股室”时该数据可空",
    "如：160620540",
  ],
  unitPhone: [
    "1、格式为【区号-电话号码】;</br>2、点“+”号可以填写多个[区号-电话号码】或【手机号码】；</br>3、【区号-电话号码】规则：区号小于等于4位，电话号码小于等于8位；</br>4、【手机号码】规则：位数为11位",
    "【区号-电话号码】如：</br>010-88888888</br>0803-9999999</br>0731-66666666</br>【手机号码】如：</br>13800000001",
  ],
  dutyPhone: [
    "1、格式为【区号-电话号码】;</br>2、点“+”号可以填写多个[区号-电话号码】或【手机号码】；</br>3、【区号-电话号码】规则：区号小于等于4位，电话号码小于等于8位；</br>4、【手机号码】规则：位数为11位",
    "【区号-电话号码】如：</br>010-88888888</br>0803-9999999</br>0731-66666666</br>【手机号码】如：</br>13800000001",
  ],
  fax: [
    "1、格式为【区号-电话号码】;</br>2、点“+”号可以填写多个[区号-电话号码】或【手机号码】；</br>3、【区号-电话号码】规则：区号小于等于4位，电话号码小于等于8位；</br>4、【手机号码】规则：位数为11位",
    "【区号-电话号码】如：</br>010-88888888</br>0803-9999999</br>0731-66666666</br>【手机号码】如：</br>13800000001",
  ],
  roomPhone: [
    "各级政府值班室用来接收系统推送通知的手机号，格式为11位数字",
    "如：18700000000",
  ],
  principal: ["该机构的负责人姓名", "如：张三"],
  address: [
    "该机构的具体地址",
    "如：湖南省XX委员会地址是湖南省长沙市XX区XX院XX号楼，评审中心是湖南省XX委员会内设机构，当维护评审中心的地址时，系统默认为湖南省长沙市XX区XX院XX号楼",
  ],
  zipCode: [
    "该机构所在的乡/镇/街道办的邮政编码、应包括6位数字",
    "如：湖南省长沙市XX区XX街道办XX街XX号，应该填写街道办的邮政编码510000",
  ],
  sortId: [
    "该机构在父节点下的位次，限值大于等于1、小于1000的数字",
    "如省应急办下辖值守处、指导处、处置处， 指导处在父节点下的位次为2，即2.00",
  ],
  remark: ["除以上数据项不能涵盖的与该机构相关的其它信息", ""],
};
