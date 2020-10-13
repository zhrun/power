import Vue from 'vue';
const mixin = {
  data() {
    return {
      $_loading: false,
      $_loadingObj: null
    }
  },
  methods: {
  }
}
Vue.mixin(mixin);


Vue.prototype.dicFormater = function (dictType, dictKey) {
  let dicObj;
  if (localStorage.getItem('dic')) {
    dicObj = JSON.parse(localStorage.getItem('dic'));
  } else {
    return '';
  }
  let haveValue = false;
  if (dictKey === 0) {
    haveValue = true;
  }
  if (dictKey) {
    haveValue = true;
  }
  if (!dictType && !haveValue) {
    return '';
  } else if (dictType && !haveValue) {
    let dict = dicObj.filter((item) => {
      return item.dictType === dictType;
    }).map(item => {
      return item.dictList;
    });
    if (dict.length) {
      return dict[0];
    } else {
      return '';
    }
  } else if (dictType && haveValue) {
    let dict = dicObj.filter((item) => {
      return item.dictType === dictType;
    }).map(item => {
      return item.dictList;
    });
    if (dict.length > 0) {
      const dict0 = dict[0];
      for (let i = 0; i < dict0.length; i++) {
        if (dict0[i].dictKey == dictKey) {
          return dict0[i].dictValue;
        }
      }
      return '';
    } else {
      return '';
    }
  }
  return '';
}
