import request from '@/utils/request'
import qs from 'qs'
import formUtil from '@/utils/formUtils'

export default {
  // 列表查询接口
  queryToSubjectList(params) {
    const url = '/request-funds-biddingcontract/subject/queryToSubjectList'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 新增编辑窗口上级科目下拉选
  getFirstSubjectList() {
    const url = '/request-funds-biddingcontract/subject/getFirstSubjectList'
    return request({
      url: url,
      method: 'get'
    })
  },
  // 新增OR编辑接口
  insertOrUpdateSubject(params) {
    const url = '/request-funds-biddingcontract/subject/insertOrUpdateSubject'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 编辑回显
  getSubjectById(params) {
    const url = '/request-funds-biddingcontract/subject/getSubjectById'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 回显未勾列表
  getDisableModelId(params) {
    const url = '/request-funds-biddingcontract/subject/getDisableModelId'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  }
}
