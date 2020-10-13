/*
* rule
* {"trigger":"change","max":10,"min":20,"field":"telegrpNo","fullField":"telegrpNo","type":"string", ...}
*  可自定义属性
*/
// 验证手机号
export const validatePhone = (rule, value, callback) => {
  if (value) {
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的手机号码"));
    }
  }
  callback();
};
// 验证传真
export const validateFax = (rule, value, callback) => {
  if (value) {
    if (
      !/^\d{3,4}-\d{7,8}$/.test(value) &&
      !/^1\d{10}$|^0\d{2,3}-?\d{7,8}$/.test(value)
    ) {
      return callback(new Error("请输入正确的传真"));
    }
  }
  callback();
};
// 密码验证
export const validatePwd = (rule, value, callback) => {
  if (value) {
    let reg = /^[a-zA-Z0-9]{6,16}$/;
    if (!reg.test(value)) {
      callback(new Error("密码为6-16个数字或英文字母组合"));
    } else {
      callback();
    }
  }
  callback();
};
// 身份证号码验证
export const checkIdCard = (rule, value, callback) => {
  let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/;
  if (value && !reg.test(value)) {
    callback(new Error("请正确输入身份证号码"));
  } else {
    callback();
  }
};
// 姓名验证
export const checkName = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5]+$/;
  if (value && !reg.test(value)) {
    callback(new Error("请正确输入姓名"));
  } else {
    callback();
  }
};
// 姓名加后缀验证
export const checkNameExt = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5]+(\d+)?$/;
  if (value && !reg.test(value)) {
    callback(new Error("请正确输入姓名"));
  } else {
    callback();
  }
};
// 车牌验证
export const checkPlateNumber = (rule, value, callback) => {
  let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
  if (value && !reg.test(value)) {
    callback(new Error("请输入正确的车牌号码"));
  } else {
    callback();
  }
};
/**
 * 判断邮箱格式
 */
export const checkEmail = (rule, value, callback) => {
  if (value) {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (!reg.test(value)) {
      callback(new Error("邮箱格式填写错误"));
    } else {
      callback();
    }
  }
  callback();
};

// 验证手机号
export const valiPhone = (rule, value, callback) => {
  if (value) {
    let reg = /^1\d{10}$|^0\d{2,3}-?\d{7,8}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的手机号码"));
    }
  }
  callback();
};

// 验证手机号
export const validateCode = (rule, value, callback) => {
  if (value) {
    let reg = /^\d{6}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的手机验证码"));
    }
  }
  callback();
};

/**
 * 验证数字（1-20位）
 */
export const valiNum = (rule, value, callback) => {
  let numReg = /^\d+$/;
  if (!numReg.test(value)) {
    return callback(new Error("请输入正整数"));
  }
  return callback();
};

/**
 * 校验添加事件
 */
export const checkAddEvent = (that, obj) => {
  if (obj.eventType == null || obj.eventType == "") {
    that.$message({
      message: "请选择事件类型",
      type: "error",
    });
    return false;
  }
  if (obj.eventLevel == null || obj.eventLevel == "") {
    if (obj.eventLevel == 0) {
      return true;
    } else {
      that.$message({
        message: "请选择事件等级",
        type: "error",
      });
      return false;
    }
  }
  if (obj.eventTime == null || obj.eventLevel == "") {
    that.$message({
      message: "请输入事发时间",
      type: "error",
    });
    return false;
  }
  if (obj.eventAddress == null || obj.eventAddress == "") {
    that.$message({
      message: "请输入事发地点",
      type: "error",
    });
    return false;
  }
  if (obj.eventDesc == null || obj.eventDesc == "") {
    that.$message({
      message: "请输入描述信息",
      type: "error",
    });
    return false;
  }
  return true;
};

/**
 * 校验处置步骤
 */
export const checkSolutionStep = (that, obj) => {
  let errMsg = [];
  obj.map((item) => {
    if (item.handleOrganizeUid == null || item.handleOrganizeUid == "") {
      if (errMsg.indexOf("处置单位") == -1) {
        errMsg.push("处置单位");
      }
    }
    if (item.acceptUserUid == null || item.acceptUserUid == "") {
      if (errMsg.indexOf("处置责任人") == -1) {
        errMsg.push("处置责任人");
      }
    }
    if (item.handlePersonCount == null || item.handlePersonCount == "") {
      if (errMsg.indexOf("处置人数") == -1) {
        errMsg.push("处置人数");
      }
    }
    if (item.handleContent == null || item.handleContent == "") {
      if (errMsg.indexOf("处置内容") == -1) {
        errMsg.push("处置内容");
      }
    }
  });
  if (errMsg.length > 0) {
    let msg = "";
    errMsg.map((item) => {
      msg = msg + item + " ";
    });
    that.$message({
      message: msg + "不能为空",
      type: "error",
    });
    return false;
  } else {
    return true;
  }
};

/**
 * 校验添加预案
 */
export const checkAddPlan = (that, obj) => {
  const numText = /^\d+$/;
  if (obj.handleOrganize == null || obj.handleOrganize == "") {
    that.$message({
      message: "请选择处置单位",
      type: "error",
    });
    return false;
  }
  if (obj.handleUser == null || obj.handleUser == "") {
    that.$message({
      message: "请选择处置责任人",
      type: "error",
    });
    return false;
  }
  if (obj.handlePersonCount == null || obj.handlePersonCount == "") {
    that.$message({
      message: "请输入建议处置人数",
      type: "error",
    });
    return false;
  } else if (!numText.test(obj.handlePersonCount)) {
    that.$message({
      message: "建议处置人数只能为正整数",
      type: "error",
    });
    return false;
  }
  if (!numText.test(obj.dispatchVehicleCount) && obj.dispatchVehicleCount) {
    that.$message({
      message: "建议出车数只能为正整数",
      type: "error",
    });
    return false;
  }
  if (obj.handleContent == null || obj.handleContent == "") {
    that.$message({
      message: "请输入处置内容",
      type: "error",
    });
    return false;
  }
  return true;
};

// 校验位次
export const checkSortId = (rule, value, callback) => {
  let reg = /^([1-9][0-9]{0,2})(\.\d{1,2})?$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的位次"));
  }
  callback();
};

// 校验邮编
export const checkZipCode = (rule, value, callback) => {
  let reg = /^\d{6}$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的邮编"));
  }
  callback();
};

// 校验社会信用代码
export const checkUnitCode = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^([0-9A-Z]{2}\d{6}[0-9A-Z]{10}|[1-9]\d{14})$/.test(value)) {
    return callback("请输入正确的组织机构代码");
  }
  callback();
};

// 校验组织机构代码
export const checkOrganizationCode = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[0-9A-Z]{9}$/.test(value)) {
    return callback("请输入正确的组织机构代码");
  }
  callback();
};

// 校验采购数量
export const checkPurchaseQuantity = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^\d{1,6}$/.test(value)) {
    return callback("请输入正确的数量");
  }
  callback();
};

// 校验采购单价
export const checkUnitPrice = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/(^[1-9]\d{0,7}(\.\d{1,2})?$)|(^0(\.\d{1,2})$)/.test(value)) {
    return callback("请输入正确的价格");
  }
  callback();
};
// 校验联系方式
export const checkContactWay = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  const phoneRegex = /^1\d{10}$/
  const telphoneRegex = /^(0\d{2,3}-)?([2-9]\d{6,7})+(-\d{1,6})?$/
  if (!phoneRegex.test(value) && !telphoneRegex.test(value)) {
    return callback("请输入正确的电话号码");
  }
  callback();
};
//校验上限预警阈值
export const checkMaxWarningValue = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]{1}\d{0,7}?$/.test(value)) {
    return callback("请输入1-99999999间的整数");
  }
  callback();
};
//校验下限预警阈值
export const checkMinWarningValue = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]\d*|0$/.test(value)) {
    return callback("请输入非负整数");
  }
  callback();
};

//校验有效期
export const checkShelfLifeValue = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
    if (!/^[1-9]{1}\d{0,3}?$/.test(value)) {
    return callback("请输入1-9999间的整数");
  }
  
  callback();
};
//校验保质期预警阈值
export const checkExpireWarning = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]{1}\d{0,7}?$/.test(value)) {
    return callback("请输入1-99999999间的整数");
  }
  callback();
};

// 校验面积
export const checkAreaSize = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})$)/.test(value)) {
    return callback("请输入正确的面积数值");
  }
  callback();
};
// 校验核载人数
export const checkLoads = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9][0-9]?$/.test(value)) {
    return callback("请输入1-99间的整数");
  }
  callback();
};
//校验标准单价
export const checkPrice = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/(^[1-9]\d{0,7}(\.\d{1,2})?$)|(^0(\.\d{1,2})$)/.test(value)) {
    return callback("请输入正确单价");
  }
  callback();
};

// 校验队伍人数
export const checkMembers = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]{1}\d{0,3}?$/.test(value)) {
    return callback("请输入1-9999间的整数");
  }
  callback();
};

//校验中文姓名
export const checkChineseName = (rule, value, callback) => {
  if (value) {
    let reg = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的中文姓名"));
    } else {
      callback();
    }
  }
  callback();
};
// 校验避难所容纳人数
export const checkCapacity = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]{1}\d{0,7}?$/.test(value)) {
    return callback("请输入1-99999999间的整数");
  }
  callback();
};




//校验座机或手机号码
export const checkTelOrPhone = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (value) {
    var reg = /^\d{3,4}-\d{7,8}?$|[1][3,4,5,7,8][0-9]{9}?$|[0-9]{1}\d{10,12}/;
    if(!reg.test(value) ){  
      callback(new Error("请输入正确的办公电话"));
    } else {
      callback();
    }
  }
  callback();
};
// 校验区号
export const checkOfficeCode = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^\d{3,4}?$/.test(value)) {
    return callback("请输入正确区号");
  }
  callback();
};
// 校验办公电话
export const checkOfficePhone = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^\d{7,8}?$/.test(value)) {
    return callback("请输入正确办公电话");
  }
  callback();
};

// 校验装备数量
export const checkQuantity = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  if (!/^[1-9]{1}\d{0,5}?$/.test(value)) {
    return callback("请输入1-999999间的整数");
  }
  callback();
};