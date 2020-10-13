
import request from '@/config/axios';
/**
 * 创建用户
 * @param {*} data
 */
export function createUser (data) {
    return request({
      url: '/duty/duty-user-service/user',
      data,
      mode: 'uem',
      method: 'post'
    });
  }
  
  /**
   * 获取用户列表数据
   * @param {*} data
   */
  export function getUserList (params) {
    return request({
      url: '/duty/duty-user-service/cur-user-unit/user-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
    /**
   * 是否重复
   * @param {*} data
   */
  export function getHasOverlapl (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/hasOverlap',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  /**
   * 新建排班
   * @param {*} data
   */

  export function createSchedule (data) {
    return request({
      url: '/duty/work-schedule-service/work-schedule',
      method: 'post',
      mode: 'uem',
      data:data
    });
  }
  //删除
  export function delSchedule (data) {
    return request({
      url: '/duty/work-schedule-service/work-schedule',
      method: 'delete',
      mode: 'uem',
      params:data
    });
  }
  //批量删除 
  export function delMoreSchedule (data) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/batch',
      method: 'delete',
      mode: 'uem',
      params:data
    });
  }
  //复制
  export function copySchedule (data) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/copy',
      method: 'put',
      mode: 'uem',
      data
    });
  }
  // export function getTest (data) {
  //   return request({
  //     url: '/duty/login',
  //     method: 'post',
  //     mode: 'uem',
  //     data:data
  //   });
  // }
  /**
   * 获取岗位列表数据
   * @param {*} data
   */
  export function getPostionList (params) {
    return request({
      url: '/duty/unit-title-service/unit-title-page-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  /**
   * 修改岗位
   * @param {*} data
   */
  export function putPostionList (params) {
    return request({
      url: '/duty/unit-title-service/unit-title',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }
  /**
   * 获取排班详情数据
   * @param {*} data
   */
  export function getDutyDetail (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/work-schedule-details',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
    /**
   * 修改排班
   * @param {*} data
   */
  export function putSchedule (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }

    /**
   * 下载排班模板
   * @param {*} data
   */
  export function getdownload (params) {
    return request({
      url: '/duty/work-schedule-service/download',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  //导出排班
  export function getExport (params) {
    return request({
      url: '/duty/work-schedule-service/download',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  /**
   * 导入排班
   * @param {*} data
   */

  export function importDutyList (data) {
    return request({
      url: '/duty/work-schedule-service/import',
      method: 'post',
      mode: 'uem',
      data:data
    });
  }
  //按时间查询班次信息
  export function getDutyList (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/work-schedule-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
      /**
   * 换班修改排班
   * @param {*} data
   */
  export function putScheduleChange (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/change',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }
      /**
   * 替班修改
   * @param {*} data
   */
  export function putScheduleReplace (params) {
    return request({
      url: '/duty/work-schedule-service/work-schedule/replace',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }



  //系统设置
  //新增职务
  
  export function createUnitJob (data) {
    return request({
      url: '/duty/unit-title-service/unit-title',
      method: 'post',
      mode: 'uem',
      data:data
    });
  }
  
  //修改职务
  export function putUnitJob (params) {
    return request({
      url: '/duty/unit-title-service/unit-title',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }

  //删除职务
  export function delUnitJob (data) {
    return request({
      url: '/duty/unit-title-service/unit-title',
      method: 'delete',
      mode: 'uem',
      params:data
    });
  }
  //批量删除 
  export function delUnitJobList (data) {
    return request({
      url: '/duty/unit-title-service/unit-title/batch',
      method: 'delete',
      mode: 'uem',
      params:data
    });
  }


  //新增敏感日
  export function createSenDay (data) {
    return request({
      url: '/duty/sensitive-day-service/sensitive-day',
      method: 'post',
      mode: 'uem',
      data:data
    });
  }
  
  //修改敏感日
  export function putSenDay (params) {
    return request({
      url: '/duty/sensitive-day-service/sensitive-day',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }

  //删除敏感日
  export function delSenDay (data) {
    return request({
      url: '/duty/sensitive-day-service/sensitive-day',
      method: 'delete',
      mode: 'uem',
      params:data
    });
  }
   /**
   * 获取敏感日 节假日列表数据
   * @param {*} data
   */
  export function getSenDayList (params) {
    return request({
      url: '/duty/sensitive-day-service/sensitive-day-page-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
     /**
   * 获取是否是敏感日 节假日列表数据
   * @param {*} data
   */
  export function getIsDay (params) {
    return request({
      url: '/duty/sensitive-day-service/is-sensitive-day',
      params,
      mode: 'uem',
      method: 'get'
    });
  }

  /**
   * 导出
   * @param {*} data
   */
  export function getExportSchedule (params) {
    return request({
      url: '/duty/work-schedule-service/export',
      params,
      mode: 'uem',
      method: 'get'
    });
  }

  /**
   * 导出
   * @param {*} data
   */
  export function getLowUint (params) {
    return request({
      url: '/duty/unit-service/query-sort-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  
  /**
   * 下发通知公告列表
   * @param {*} data
   */
  export function getNoticeList (params) {
    return request({
      url: '/duty/issue-notice/notice-page',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  

  // 添加通知公告
  export function addNotice(data) {
    // request.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    return request({
      url: '/duty/issue-notice/notice',
      data:data,
      mode: 'uem',
      method: 'post'
    });
  }
  // 修改通知公告
  export function putNotice(params) {
    return request({
      url: '/duty/issue-notice/notice',
      data:params,
      mode: 'uem',
      method: 'put'
    });
  }
  // 删除通知公告
  export function delNotice(params) {
    return request({
      url: '/duty/issue-notice/notice',
      params,
      mode: 'uem',
      method: 'delete'
    });
  }
  /**
   * 查询通知公告附件
   * @param {*} data
   */
  export function getFileList (params) {
    return request({
      url: '/duty/issue-notice/file-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  // 通知公告下发
  export function putNoticeNext(params) {
    return request({
      url: '/duty/issue-notice/issue',
      params,
      mode: 'uem',
      method: 'put'
    });
  }
  //查询回执
  export function getReceipt (params) {
    return request({
      url: '/duty/issue-notice/receipt',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  // 通知公告撤消
  export function putNoticeUndo(params) {
    return request({
      url: '/duty/issue-notice/undo',
      params,
      mode: 'uem',
      method: 'put'
    });
  }
  //接收通知公告列表
  export function getNoticePage (params) {
    return request({
      url: '/duty/receive-notice/notice-page',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  //接收通知公告 
  export function getNoticeReceive (params) {
    return request({
      url: '/duty/receive-notice/receive',
      params,
      mode: 'uem',
      method: 'get'
    });
  }

  //值班记录首页接口
  //获取当前值班记录
  export function getOnduy (params) {
    return request({
      url: '/duty/work-record-service/work-record/current/details',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  // 新增值班记录
  export function addOnduy(data) {
    return request({
      url: '/duty/work-record-service/work-record',
      data:data,
      mode: 'uem',
      method: 'post'
    });
  }
  //修改
  export function putOnduy(data) {
    return request({
      url: '/duty/work-record-service/work-record',
      data:data,
      mode: 'uem',
      method: 'put'
    });
  }
  //删除
  export function delOnduy(data) {
    return request({
      url: '/duty/work-record-service/work-record',
      params:data,
      mode: 'uem',
      method: 'delete'
    });
  }
  // 值班记录详情
  export function getOnduyDetail (params) {
    return request({
      url: '/duty/work-record-service/work-record-details',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
  //分页查询 
  export function getOnduyList (params) {
    return request({
      url: '/duty/work-record-service/work-record-page-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
    /**
   * 查询关联事项列表
   * @param {*} data
   */
  export function getRecordList (params) {
    return request({
      url: '/duty/work-matters/biz-list',
      params,
      mode: 'uem',
      method: 'get'
    });
  }
// 新增值班事项
export function addEvent(data) {
  return request({
    url: '/duty/work-matters',
    data:data,
    mode: 'uem',
    method: 'post'
  });
}
//修改事项
export function putEvent(data) {
  return request({
    url: '/duty/work-matters',
    data:data,
    mode: 'uem',
    method: 'put'
  });
}
//删除事项
export function delEvent(data) {
  return request({
    url: '/duty/work-matters',
    params:data,
    mode: 'uem',
    method: 'delete'
  });
}
//所有值班记录列表
export function getAllList (params) {
  return request({
    url: '/duty/work-matters/work-matters-page-list',
    params,
    mode: 'uem',
    method: 'get'
  });
}

//修改位次
export function putSort(data) {
  return request({
    url: '/duty/work-matters/sort/change',
    data:data,
    mode: 'uem',
    method: 'put'
  });
}
//要情快报列表
export function getNewflashList (params) {
  return request({
    url: '/duty/newflash-config-service/newflash-config-page-list',
    params,
    mode: 'uem',
    method: 'get'
  });
}
//修改快报文头
export function putNewflash(data) {
  return request({
    url: '/duty/newflash-config-service/newflash-config',
    data:data,
    mode: 'uem',
    method: 'put'
  });
}

//用uid 查值班用户列表
export function getUsersList (params) {
  return request({
    url: '/duty/user-service/duty-person-list',
    params,
    mode: 'uem',
    method: 'get'
  });
}
 
//查询通知公告 详情
export function getNoticeDetail (params) {
  return request({
    url: '/duty/issue-notice/notice',
    params,
    mode: 'uem',
    method: 'get'
  });
}
//查询最大位次号
export function getSortId (params) {
  return request({
    url: '/duty/unit-title-service/unit-title/next-sort-id',
    params,
    mode: 'uem',
    method: 'get'
  });
}

/**
 * batchUpload   批量上传
 * @param { data }
 */
export function batchUpload(data) {
  return request({
      url: '/duty/file-upload-service/batch?type=notice',
      method: 'post',
      mode: 'uem',
      timeout: 1800000,
      data
  });
}
 