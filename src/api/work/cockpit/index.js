import request from '@/utils/request'
import qs from 'qs'
import formUtil from '@/utils/formUtils'

export default {
  // 支出合同类型和数量
  getContractTotalAndClassifyName(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getContractTotalAndClassifyName'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 驾驶舱上部分数据  产值完成率那一排
  getCockpitInfo(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getCockpitInfo'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },


  // 驾驶舱上部分数据  成本对比分析
  queryTwoSubject(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/queryTwoSubject'
    return request({
      url: url,
      method: 'get',
      params
    })
  },

  // 获取项目 下拉选
  getDeptAndProjectTree() {
    const url = '/request-funds-biddingcontract/dept/getDeptAndProjectTree'
    return request({
      url: url,
      method: 'get'
    })
  },

  // 驾驶舱成本对比分析
  getCostAnalysisList(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getCostAnalysisList'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 项目形象进度
  getProjectProgress(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getProjectProgress'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 分析弹窗详情
  getSecondSubjectMoney(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getSecondSubjectMoney'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 间接费 税金
  getFullCostMiddleOrTaxes(params) {
    const url = '/request-funds-biddingcontract/fullCostCockpit/getMiddleOrTaxes'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 获取驾驶舱列表
  getCockpitList(params) {
    const url = '/request-funds-biddingcontract/cockpit/queryPage'
    return request({
      url: url,
      method: 'get',
      params
    })
  },
  // 获取驾驶舱列表详情
  getCockpitDetail(params) {
    const url = '/request-funds-biddingcontract/cockpit/getById'
    return request({
      url: url,
      method: 'get',
      params
    })
  },
  // 删除驾驶舱列表
  deleteCockpit(data) {
    const url = '/request-funds-biddingcontract/cockpit/delete'
    return request({
      url: url,
      method: 'post',
      data
    })
  },
  // 删除驾驶舱列表
  saveCockpit(data) {
    const url = '/request-funds-biddingcontract/cockpit/save'
    return request({
      url: url,
      method: 'post',
      data
    })
  }
}
