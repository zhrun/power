// 组织机构代码
// export const organizationCode = function (rule, value, callback) {
//   if (//) {
//     callback("不能多于15个字");
//   } else {
//     callback();
//   }
// }

// 邮编
export const postcode = function(rule, value, callback) {
  validateFn(rule, value, callback, /^[0-9]{6}$/, "请输入正确的邮编");
};

// 手机号码
export const mobilePhone = function(rule, value, callback) {
  validateFn(
    rule,
    value,
    callback,
    /^1\d{10}$|^0\d{2,3}-?\d{7,8}$/,
    "请输入正确的手机号码"
  );
};

// 号码组
// export const phoneGroup = function(rule, value, callback) {
//   let flag = false;
//   value.map((item) => {
//     if (
//       item &&
//       !/^\d{3,4}-\d{7,8}$/.test(item) &&
//       !/^1\d{10}$|^0\d{2,3}-?\d{7,8}$/.test(item)
//     ) {
//       flag = true;
//     }
//   });
//   if (flag) {
//     callback();
//   }
//   callback();
// };

// 值班室手机
export const roomPhone = mobilePhone;

// 位次
export const precedence = function(rule, value, callback) {
  if (value === "") {
    return callback(new Error("请输入位次"));
  }
  if (value) {
    const reg = /^([1-9][0-9]{0,2}|1000)(\.\d{1,2})?$/;
    const message = "请输入正确的位次";
    if (!reg.test(value)) {
      return callback(new Error(message));
    }
  }
  callback();
};

/**
 * 判断邮箱格式
 */
export const email = (rule, value, callback) => {
  validateFn(
    rule,
    value,
    callback,
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    "邮箱格式填写错误"
  );
};

function validateFn(rule, value, callback, reg, message) {
  if (value) {
    if (!reg.test(value)) {
      return callback(new Error(message));
    }
  }
  callback();
}
