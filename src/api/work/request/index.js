import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'


// 用户账号-用户管理
export function getPorCompanyListPage(query) {
  return request({
    url: '/request-funds-operatemanage/company/getPorCompanyListPage',
    method: 'get',
    params: query
  })
}

// 手动开通服务费
export function updateAccountStatus(data) {
  return request({
    url: '/request-funds-operatemanage/company/updateAccountStatus',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取公司列表
export function getPorCompanyList(query) {
  return request({
    url: '/request-funds-operatemanage/company/getPorCompanyList',
    method: 'get',
    params: query
  })
}

// 根据业务id获取绑定公司列表
export function getPorContractListPage(query) {
  return request({
    url: '/request-funds-operatemanage/company/getPorContractListPage',
    method: 'get',
    params: query
  })
}

// 更新合同权限列表
export function updatePorContractBatch(data) {
  return request({
    url: '/request-funds-operatemanage/company/updatePorContractBatch',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取用户审核初始化数据分页
export function queryPage(data) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/queryPage',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 查询附件信息
export function getAttachInfo(params) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/getAttachInfo',
    method: 'get',
    params
  })
}

// 查询委托合同列表
export function getContractAccountTempList(params) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/getContractAccountTempList',
    method: 'get',
    params
  })
}

// 查询委托协议URL
export function getContractUrl(params) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/getContractUrl',
    method: 'get',
    params
  })
}

// 审核通过
export function auditPass(data) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/auditPass',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取丙方公司相关信息
export function getPorCompanyByMap(params) {
  return request({
    url: '/request-funds-operatemanage/company/getPorCompanyByMap',
    method: 'get',
    params
  })
}

// 审核不通过
export function auditNoPass(data) {
  return request({
    url: '/request-funds-operatemanage/userCompanyTemp/auditNoPass',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 请款所属类别列表Tree
export function getRequestBusinessDicTree(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/getRequestBusinessDicTree',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 请款所属类别列表增加
export function saveRequestBusinessDicTree(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/saveRequestBusinessDicTree',
    method: 'post',
    data
  })
}

// 请款所属类别列表更新
export function updateRequestBusinessDicTree(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/updateRequestBusinessDicTree',
    method: 'post',
    data
  })
}

// 请款所属类别列表删除
export function deleteRequestBusinessDicTree(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/deleteRequestBusinessDicTree',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 合同
export function selectContract(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/selectContract',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
// BPM
export function getSelectApprove(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/getSelectApprove',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取请款管理列表
export function getRequestRecordListPage(data) {
  return request({
    url: '/request-funds-operatemanage/request/getRequestRecordListPage',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取附件列表
export function getRequestEnclosureListPage(data) {
  return request({
    url: '/request-funds-operatemanage/enclosure/getRequestEnclosureListPage',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 新增附件
export function addRequestEnclosure(data) {
  return request({
    url: '/request-funds-operatemanage/enclosure/addRequestEnclosure',
    method: 'post',
    data
  })
}

// 编辑附件
export function updateRequestEnclosure(data) {
  return request({
    url: '/request-funds-operatemanage/enclosure/updateRequestEnclosure',
    method: 'post',
    data
  })
}

// 启用停用附件
export function deleteRequestEnclosure(data) {
  return request({
    url: '/request-funds-operatemanage/enclosure/deleteRequestEnclosure',
    method: 'post',
    data
  })
}

// 我的待办
export function getMyAgentFromBpm(data) {
  return request({
    url: '/request-funds-operatemanage/bpm/get/getMyAgentFromBpm',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 我的办理
export function setHandleBpm(data) {
  return request({
    url: '/request-funds-operatemanage/bpm/set/setHandleBpm',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 我的已办理
export function getMyDoneFromBpm(data) {
  return request({
    url: '/request-funds-operatemanage/bpm/get/getMyDoneFromBpm',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 合同分类
export function selectContractModel(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/selectContractModel',
    method: 'post',
    data
  })
}

// 合同二级分类
export function selectContractModelById(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/selectContractModelById',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 合同二级分类---新的
export function selectContractModelById2(params) {
  return request({
    url: '/request-funds-biddingcontract/subject/getContractModelDetailById',
    method: 'get',
    params
  })
}


// 物料分类
export function selectMaterialModel(params) {
  return request({
    url: '/request-funds-biddingcontract/subject/getMaterialTree',
    method: 'get',
    params
  })
}

// 物料二级分类
export function selectMaterialModelById(params) {
  return request({
    url: '/request-funds-biddingcontract/subject/getMaterialDetailById',
    method: 'get',
    params
  })
}

// 费用分类
export function selectFeeModel(params) {
  return request({
    url: '/request-funds-biddingcontract/subject/getFeeTree',
    method: 'get',
    params
  })
}

// 费用二级分类
export function selectFeeModelById(params) {
  return request({
    url: '/request-funds-biddingcontract/subject/getFeeDetailById',
    method: 'get',
    params
  })
}

// 合同信息回显
export function selectContractBindingModel(data) {
  return request({
    url: '/request-funds-operatemanage/requestBusiness/selectContractBindingModel',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 查询列表
export function listDocumentInfo(query) {
  return request({
    url: '/request-funds-operatemanage/DocumentInfo/queryPage',
    method: 'post',
    data: qs.stringify(query),
    ...oXHRHeadrsUrlencoded
  })
}

// 保存列表
export function saveDocumentInfo(data) {
  return request({
    url: '/request-funds-operatemanage/DocumentInfo/save',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取服务费记录表
export function getPayOrderRecord(data) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/getPayOrderRecord',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
//获取服务费配置列表
export function getPayManageList(query) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/getPayManageList',
    method: 'get',
    params: query
  })
}
//更新支付配置文件
export function updatePayManage(data) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/updatePayManage',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
//启用停用
export function updatePayManageStatus(data) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/updatePayManageStatus',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
//金额配置列表
export function getPayCategoryList(query) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/getPayCategoryList',
    method: 'get',
    params: query
  })
}
//修改支付类型金额
export function updateMoney(data) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/updateMoney',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

//根据订单编号退款
export function refundOrder(data) {
  return request({
    url: '/request-funds-operatemanage/payBusiness/refundOrder',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 查询发票单据分页
export function listInvoiceInfo(query) {
  return request({
    // url: '/request-funds-operatemanage/invoice/queryInvoiceBill' + `?userName=${query.userName}
    // &beginTime=${query.beginTime}&endTime=${query.endTime}&current=${query.current}&size=${query.size}
    // &phoneNumber=${query.phoneNumber}&deptName=${query.deptName}&status=${query.status}`,
    url: '/request-funds-operatemanage/invoice/queryInvoiceBill',
    params: query,
    method: 'get',
    ...oXHRHeadrsUrlencoded
  })
}

//发票详情
export function queryInvoiceDetails(query) {
  return request({
    url: '/request-funds-operatemanage/invoice/queryInvoiceDetails',
    params: query,
    method: 'get',
    ...oXHRHeadrsUrlencoded
  })
}

//修改发票开票状态
export function updateStatus(data) {
  return request({
    url: '/request-funds-operatemanage/invoice/updateStatus',
    method: 'put',
    data
  })
}

//批量修改发票开票状态
export function updateAllStatus(data) {
  return request({
    url: '/request-funds-operatemanage/invoice/updateAllStatus',
    method: 'put',
    data
  })
}

//获取分公司列表
export function getCompanyList(data) {
  return request({
    url: '/request-funds-operatemanage/company/getCompanyList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 运营人员操作日志表
export function getPayTypeTree(data) {
  return request({
    url: '/request-funds-operatemanage/public/getPayTypeTree',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取分公司编码
export function getCompanyCodeList(data) {
  return request({
    url: '/request-funds-operatemanage/public/getCompanyCodeList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取合同分类
export function getContractTypeDic(data) {
  return request({
    url: '/request-funds-operatemanage/public/getContractTypeDic',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取项目编码
export function getProjectCode(data) {
  return request({
    url: '/request-funds-operatemanage/public/getProjectCode',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 获取合同编码
export function getContractCode(data) {
  return request({
    url: '/request-funds-operatemanage/public/getContractCode',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 主页面统计
export function getProjectStatisticsMoney(data) {
  return request({
    url: '/request-funds-operatemanage/request/getProjectStatisticsMoney',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// bpm获取token-单点登录
export function getBpmToken(data) {
  return request({
    url: '/request-funds-operatemanage/bpm/get/getBpmToken',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
