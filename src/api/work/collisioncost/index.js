import request from "@/utils/request";
import formUtil from '@/utils/formUtils';

export default {

  // 四成本详情列表
  queryVersionList(params) {
    const url = "/request-funds-cost4manage/edition/queryVersionList"
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 删除四成本详情列表项
  deleteVersion(params) {
    const url = '/request-funds-cost4manage/edition/deleteVersion'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 四成本详情列表
  queryGcbxflist(params) {
    const url = "/request-funds-cost4manage/costEngineeringInsurance/queryEngineeringInsuranceList"
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },

   // 投标报价取费说明
   queryTbbjfysmlist(params) {
    const url = "/request-funds-cost4manage/costBiddingFeeDescription/queryBiddingFeeDescriptionList"
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },

  // 项目管理费
  queryXmglflist(params) {
    const url = "/request-funds-cost4manage/costProjectManagementFee/queryProjectManagementFeeList"
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },

};
