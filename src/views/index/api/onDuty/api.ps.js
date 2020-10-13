import request from '@/config/axios';


/* ========== 上报值班信息 ========== */

/**
 * getReportDutyList 上报值班信息列表查询接口
 * @param { data }
 */
export function getReportDutyList(data) {
    return request({
        url: '/duty/report-duty/duty-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getDutyDetail     值班信息详情接口
 * @param { data }
 */
export function getDutyDetail(data) {
    return request({
        url: '/duty/receive-duty/detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putReportDutyReport 上报值班信息
 * @param { data }
 */
export function putReportDutyReport(data) {
    return request({
        url: '/duty/report-duty/report',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * deleteReportDuty 删除值班信息
 * @param { data }
 */
export function deleteReportDuty(data) {
    return request({
        url: '/duty/report-duty/duty',
        method: 'DELETE',
        mode: 'uem',
        params: data,
    })
}

/**
 * putReceipt 回执值班信息
 * @param { data }
 */
export function putReceipt(data) {
    return request({
        url: '/duty/report-duty/receipt',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putUndo 撤回值班信息
 * @param { data }
 */
export function putUndo(data) {
    return request({
        url: '/duty/report-duty/undo',
        method: 'PUT',
        mode: 'uem',
        params: data,
    })
}

/**
 * getGenerateNo 生成编号
 */
export function getGenerateNo(data) {
    return request({
        url: '/duty/receive-duty/generateNo',
        method: 'get',
        mode: 'uem',
        params: data
    })
}

/**
 * postReportDuty 新增值班信息
 * @param { data }
 */
export function postReportDuty(data) {
    return request({
        url: '/duty/report-duty/duty',
        method: 'post',
        mode: 'uem',
        data
    })
}

/**
 * putDutyReportDuty 编辑值班信息
 * @param { data }
 */
export function putDutyReportDuty(data) {
    return request({
        url: '/duty/report-duty/duty',
        method: 'PUT',
        mode: 'uem',
        data
    })
}

/**
 * getReportDutyRefuse 退回原因
 * @param { data }
 */
export function getReportDutyRefuse(data) {
    return request({
        url: '/duty/report-duty/duty-detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}


/* ========== 接报值班信息 ========== */

/**
 * getReceiveDutyList 接报值班信息列表查询接口
 * @param { data }
 */
export function getReceiveDutyList(data) {
    return request({
        url: '/duty/receive-duty/duty-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putReceiveDutyReceive     接收上报值班信息接口
 * @param { data }
 */
export function putReceiveDutyReceive(data) {
    return request({
        url: '/duty/receive-duty/receive',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * postReceiveDutyReportDuty 值班信息转为上报
 * @param { data }
 */
export function postReceiveDutyReportDuty(data) {
    return request({
        url: '/duty/receive-duty/duty-report',
        method: 'post',
        mode: 'uem',
        data
    })
}

/**
 * postReceiveDutyRefuse 退回原因
 * @param { data }
 */
export function postReceiveDutyRefuse(data) {
    return request({
        url: '/duty/receive-duty/refuse',
        method: 'post',
        mode: 'uem',
        data
    })
}

/* ========== 要情快报 ========== */

/**
 * postEventReport 要情快报新增接口
 * @param { data }
 */
export function postEventReport(data) {
    return request({
        url: '/duty/event-report/event',
        method: 'post',
        mode: 'uem',
        data
    })
}

/**
 * putEventReport 要情快报编辑接口
 * @param { data }
 */
export function putEventReport(data) {
    return request({
        url: '/duty/event-report/event',
        method: 'PUT',
        mode: 'uem',
        data
    })
}

/**
 * delEventReport 要情快报删除接口
 * @param { data }
 */
export function delEventReport(data) {
    return request({
        url: '/duty/event-report/event',
        method: 'DELETE',
        mode: 'uem',
        params: data,
    })
}

/**
 * getEventDetail 要情快报详情接口
 * @param { data }
 */
export function getEventDetail(data) {
    return request({
        url: '/duty/event-report/event-detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getEventPageList 接报值班信息列表查询接口
 * @param { data }
 */
export function getEventPageList(data) {
    return request({
        url: '/duty/event-report/event-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/* ========== 值班信息/要情快报批示下发 ========== */

/**
 * getInstructionPageList 下发批示列表查询接口
 * @param { data }
 */
export function getInstructionPageList(data) {
    return request({
        url: '/duty/issue-instruction/instruction-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * postIssueInstruction 保存批示信息
 * @param { data }
 */
export function postIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/instruction',
        method: 'post',
        mode: 'uem',
        data
    })
}

/**
 * postSaveIssueInstruction 保存批示下发信息
 * @param { data }
 */
export function postSaveIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/issue-instruction',
        method: 'post',
        mode: 'uem',
        data
    })
}

/**
 * putSaveIssueInstruction 修改批示下发信息
 * @param { data }
 */
export function putSaveIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/issue-instruction',
        method: 'put',
        mode: 'uem',
        data
    })
}

/**
 * deleteSaveIssueInstruction 修改批示下发信息
 * @param { data }
 */
export function deleteSaveIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/issue-instruction',
        method: 'delete',
        mode: 'uem',
        params: data,
    })
}

/**
 * putIssueInstruction 编辑批示接口
 * @param { data }
 */
export function putIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/instruction',
        method: 'put',
        mode: 'uem',
        data
    })
}

/**
 * deleteIssueInstruction 删除批示接口
 * @param { data }
 */
export function deleteIssueInstruction(data) {
    return request({
        url: '/duty/issue-instruction/instruction',
        method: 'delete',
        mode: 'uem',
        params: data,
    })
}


/* ========== 接收抄送信息 ========== */

/**
 * getCopyPageList 接收抄送信息查询接口
 * @param { data }
 */
export function getCopyPageList(data) {
    return request({
        url: '/duty/receive-copy/copy-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putCopyReceive 接收抄送信息接口
 * @param { data }
 */
export function putCopyReceive(data) {
    return request({
        url: '/duty/receive-copy/receive',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}


/* ========== 已退回信息 ========== */

/**
 * getRefusePageList 已退回信息查询
 * @param { data }
 */
export function getRefusePageList(data) {
    return request({
        url: '/duty/refuse-info/refuse-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getRefuseInfoReceipt 已退回信息回执
 * @param { data }
 */
export function getRefuseInfoReceipt(data) {
    return request({
        url: '/duty/refuse-info/receipt',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getRefuseInfoReason 退回原因
 * @param { data }
 */
export function getRefuseInfoReason(data) {
    return request({
        url: '/duty/refuse-info/reason',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getCommonCauses 常见退回原因
 * @param { data }
 */
export function getCommonCauses(data) {
    return request({
        url: '/duty/refuse-info/common-causes',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}


/* ========== 接收上级批示 ========== */

/**
 * getReceivePageList 上级批示查询接口
 * @param { data }
 */
export function getReceivePageList(data) {
    return request({
        url: '/duty/receive-instruction/instruction-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * postReceiveInstructionFeedback 批示反馈
 * @param { data }
 */
export function postReceiveInstructionFeedback(data) {
    return request({
        url: '/duty/receive-instruction/feedback',
        method: 'post',
        mode: 'uem',
        data,
    })
}

/**
 * putDutyReceive 上级批示接收接口
 * @param { data }
 */
export function putDutyReceive(data) {
    return request({
        url: '/duty/receive-instruction/receive',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}


/* ========== 查询批示反馈 ========== */

/**
 * getFeedbackPageList 批示反馈查询接口
 * @param { data }
 */
export function getFeedbackPageList(data) {
    return request({
        url: '/duty/feedback/feedback-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getFeedbackDetail 批示反馈详情接口
 * @param { data }
 */
export function getFeedbackDetail(data) {
    return request({
        url: '/duty/feedback/feedback-detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putFeedback 批示反馈编辑接口
 * @param { data }
 */
export function putFeedback(data) {
    return request({
        url: '/duty/feedback/feedback',
        method: 'put',
        mode: 'uem',
        data,
    })
}

/**
 * deleteFeedback 批示反馈删除接口
 * @param { data }
 */
export function deleteFeedback(data) {
    return request({
        url: '/duty/feedback/feedback',
        method: 'delete',
        mode: 'uem',
        params: data,
    })
}

/**
 * putReportFeedback 批示反馈上报接口
 * @param { data }
 */
export function putReportFeedback(data) {
    return request({
        url: '/duty/feedback/report',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * putUndoFeedback 批示反馈撤销接口
 * @param { data }
 */
export function putUndoFeedback(data) {
    return request({
        url: '/duty/feedback/undo',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}


/**
 * putDutyFeedbackReceive 批示反馈撤销接口
 * @param { data }
 */
export function putDutyFeedbackReceive(data) {
    return request({
        url: '/duty/feedback/receive',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * postDutyFeedbackRefuse 退回原因
 * @param { data }
 */
export function postDutyFeedbackRefuse(data) {
    return request({
        url: '/duty/feedback/refuse',
        method: 'post',
        mode: 'uem',
        data,
    })
}

/* ========== 查詢批示下发 ========== */

/**
 * getInstructionSendPageList 查询下发批示列表查询接口
 * @param { data }
 */
export function getInstructionSendPageList(data) {
    return request({
        url: '/duty/issue-instruction/instruction-send-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getInstructionDetail 批示列表详情
 * @param { data }
 */
export function getInstructionDetail(data) {
    return request({
        url: '/duty/issue-instruction/instruction-detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getIssueInstructionDetail 编辑下发批示详情
 * @param { data }
 */
export function getIssueInstructionDetail(data) {
    return request({
        url: '/duty/issue-instruction/detail',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getIssueInstructionReceipt 批示下发回执
 * @param { data }
 */
export function getIssueInstructionReceipt(data) {
    return request({
        url: '/duty/issue-instruction/receipt',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * putIssueInstructionIssue 下发批示接口
 * @param { data }
 */
export function putIssueInstructionIssue(data) {
    return request({
        url: '/duty/issue-instruction/issue',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * putIssueInstructionUndo 撤销批示接口
 * @param { data }
 */
export function putIssueInstructionUndo(data) {
    return request({
        url: '/duty/issue-instruction/undo',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * putIssueInstructionInstruction 编辑批示接口
 * @param { data }
 */
export function putIssueInstructionInstruction(data) {
    return request({
        url: '/duty/issue-instruction/instruction',
        method: 'put',
        mode: 'uem',
        params: data,
    })
}

/**
 * delIssueInstructionInstruction 删除批示接口
 * @param { data }
 */
export function delIssueInstructionInstruction(data) {
    return request({
        url: '/duty/issue-instruction/instruction',
        method: 'delete',
        mode: 'uem',
        params: data,
    })
}

/**
 * getIssueInstructionFeedbackPageList 查看反馈
 * @param { data }
 */
export function getIssueInstructionFeedbackPageList(data) {
    return request({
        url: '/duty/issue-instruction/feedback-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/* ========== 来电拟办 ========== */

/**
 * getDutyHandlePageList 来电拟办分页查询
 * @param { data }
 */
export function getDutyHandlePageList(data) {
    return request({
        url: '/duty/duty-hand-service/duty-handle-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * getDutyHandleDetails 来电拟办详情
 * @param { data }
 */
export function getDutyHandleDetails(data) {
    return request({
        url: '/duty/duty-hand-service/duty-handle-details',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * postDutyHandle 来电拟办新增
 * @param { data }
 */
export function postDutyHandle(data) {
    return request({
        url: '/duty/duty-hand-service/duty-handle',
        method: 'post',
        mode: 'uem',
        data,
    })
}

/**
 * putDutyHandle 来电拟办修改
 * @param { data }
 */
export function putDutyHandle(data) {
    return request({
        url: '/duty/duty-hand-service/duty-handle',
        method: 'put',
        mode: 'uem',
        data,
    })
}


/**
 * putDutyHandle 来电拟办删除
 * @param { data }
 */
export function deleteDutyHandle(data) {
    return request({
        url: '/duty/duty-hand-service/duty-handle',
        method: 'delete',
        mode: 'uem',
        params: data,
    })
}


/* ========== 机构服务 ========== */

/**
 * querySortList 查询平级/下级机构
 * @param { data }
 */
export function querySortList(data) {
    return request({
        url: '/duty/unit-service/query-sort-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}

/**
 * queryzbPageList 总后台-机构分页
 * @param { data }
 */
export function queryzbPageList(data) {
    return request({
        url: '/duty/unit-service/zb-page-list',
        method: 'get',
        mode: 'uem',
        params: data,
    })
}


/* ========== 上传服务 ========== */

/**
 * batchUpload   批量上传
 * @param { data }
 */
export function batchUpload(data) {
    return request({
        url: '/duty/file-upload-service/batch',
        method: 'post',
        mode: 'uem',
        timeout: 1800000,
        data
    });
  }


/* ========== 消息通知服务 ========== */

/**
 * getMessagePage   消息通知分页查询
 * @param { data }
 */
export function getMessagePage(data) {
    return request({
        url: '/duty/message/message-page',
        method: 'get',
        mode: 'uem',
        params: data,
    });
}

export function postEventReportSendMessage(data) {
    return request({
        url: '/duty/event-report/send-message',
        method: 'post',
        mode: 'uem',
        params: data,
    });
}


/* ========== 字典信息 ========== */

/**
 * getEventType   获取事件类型
 * @param { data }
 */
export function getEventType() {
    return request({
        url: '/duty/dict-service/event-Type',
        method: 'get',
        mode: 'uem',
    });
}



/* ========== 接收通知公告服务 ========== */

/**
 * putReceiveNoticeHandle   办理接口
 * @param { data }
 */
export function putReceiveNoticeHandle(data) {
    return request({
        url: '/duty/receive-notice/handle',
        method: 'put',
        mode: 'uem',
        params: data,
    });
}
