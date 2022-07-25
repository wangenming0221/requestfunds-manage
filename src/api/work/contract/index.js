import request from '@/utils/request'
import qs from 'qs'
import formUtil from '@/utils/formUtils'

export default {
  // 项目列表 经营模式
  listBusinessPatternTreeSelect() {
    const url = '/request-funds-biddingcontract/generalContract/getContractingModeList'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 项目列表 查看详情
  checkProjectListItem(params) {
    const url = '/request-funds-biddingcontract/generalContract/getGeneralContractByProjectCode'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 获取项目列表
  getContractProjectListByProjectCode(params) {
    const url = '/request-funds-biddingcontract/generalContract/listContractByProjectCode'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 获取合同计划 项目列表
  getContractProjectList(params) {
    const url = '/request-funds-biddingcontract/generalContract/getPlanContractList'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  getParentRegion() {
    const url = '/request-funds-biddingcontract/generalContract/getParentRegion'
    return request({
      url: url,
      method: 'post'
    })
  },
  checkDetails(params) {
    const url = '/request-funds-biddingcontract/generalContract/getContractUrl'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 获取项目权限分公司列表
  getDeptAndProjectTree() {
    const url = '/request-funds-biddingcontract/dept/getDeptAndProjectTree'
    return request({
      url: url,
      method: 'get'
    })
  },
  saveUserDataAuth(params) {
    const url = '/request-funds-biddingcontract/user/saveUserDataAuth'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  getUserDataAuth(params) {
    const url = '/request-funds-biddingcontract/user/getUserDataAuth'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 分公司列表
  getSubCompany() {
    const url = '/request-funds-system/system/dept/treeselect'
    return request({
      url: url,
      method: 'get'
    })
  },
  // 合同权限
  getContractAuth() {
    const url = '/request-funds-biddingcontract/generalContract/getUserAuthType'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 中心权限首页
  // 获取项目列表 （项目权限 （requestType 1）, 中心权限, 分公司权限）
  listCenterAuthList(params) {
    const url = '/request-funds-biddingcontract/generalContract/listProjectAndGeneral'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 中心权限首页 合同统计分类
  getCenterAuthContractClassify() {
    const url = '/request-funds-biddingcontract/generalContract/getAllContractClassify'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 查询所有分公司合同管理列表
  listAllContract(params) {
    const url = '/request-funds-biddingcontract/generalContract/contractListByAllDeptCode'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 合同审批趋势 { deptCode: , year:  }
  listApprovalTrend(params) {
    const url = '/request-funds-biddingcontract/generalContract/listApprovalTrendByYear'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 获取合同审批趋势下拉选
  getContractApprovalTrend(params) {
    const url = '/request-funds-biddingcontract/generalContract/getIfTemplateByClassifyId'
    return request({
      data: formUtil(params),
      url: url,
      method: 'post'
    })
  },
  // 获取合同统计列表
  // {
  //   "contractType":"1",      //Type合同类型 1.总包合同 2.承包人合同 3.专业分包合同 4.设备采购类 5.劳务分包类
  //   "contractState":"1",     //state合同状态 1.计划中 2.待审批 3.已拒绝 4.待生效 5.已完成 6.已终止
  //   "pageNum":1,
  //   "pageSize":100
  // }
  listCenterContractList(params) {
    const url = '/request-funds-biddingcontract/generalContract/listContractStatistics'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  //
  //
  //
  // 分公司权限首页
  // 合同审批趋势 { year:  }
  listContractTrend(params) {
    const url = '/request-funds-biddingcontract/generalContract/listApTdByDeptAndYear'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 甲方/乙方签约主体 { deptCode:  } 不传参查全部 传参查分公司
  getSignalMainInfo(params) {
    const url = '/request-funds-biddingcontract/generalContract/aOrBCompanyList'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 合同统计
  // state合同状态 1.计划中 2.待审批 3.已拒绝 4.待生效 5.已完成 6.已终止
  // {
  //   "contractState":"4"
  // }
  listCompanyStatistic(params) {
    const url = '/request-funds-biddingcontract/generalContract/listConStaByDept'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 获取日历红色提示
  getContractTips() {
    const url = '/request-funds-biddingcontract/generalContract/queryColorToCalendar'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 获取合同计划列表
  getContractPlanList(params) {
    const url = '/request-funds-biddingcontract/generalContract/queryPlanList'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 获取总包项目编码列表
  getAllContractProjectCodeList() {
    const url = '/request-funds-biddingcontract/generalContract/getGeneralProjectCode'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 根据项目编码返显项目名称
  getFilialeProjectNameByProjectCode(params) {
    const url = '/request-funds-biddingcontract/generalContract/getProjectNameByProjectCode'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 提交合同计划
  submitContractPlan(params) {
    const url = '/request-funds-biddingcontract/generalContract/insertContractPlan'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 获取合同相关人员
  getContractAboutPerson() {
    const url = '/request-funds-biddingcontract/generalContract/getAllUserByDeptCode'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 获取分包合同信息列表
  getPartyPackageInformation(params) {
    const url = '/request-funds-biddingcontract/generalContract/getSubContractList'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 通过id获取编辑合同计划详情
  getContractDetailsByPlanId(params) {
    const url = '/request-funds-biddingcontract/generalContract/getContractPlanById'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  //
  //
  //
  // 项目权限首页
  // 总包合同下拉选
  getGeneralContract() {
    const url = '/request-funds-biddingcontract/generalContract/listGeneralContractByUser'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 项目权限 获取列表
  listProjectAuthListByProjectStatus(params) {
    const url = '/request-funds-biddingcontract/generalContract/listSubContractByProjectCode'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 分公司权限首页
  // 合同统计
  // state合同状态 1.计划中 2.待审批 3.已拒绝 4.待生效 5.已完成 6.已终止
  // {
  //   "contractState":"4"
  // }
  listFilialeContractStatistic(params) {
    const url = '/request-funds-biddingcontract/generalContract/listConStaByDept'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  //
  //
  //
  // 通用接口
  // 项目列表 更多
  listMoreProjectList(params) {
    const url = '/request-funds-biddingcontract/generalContract/listProjectByMore'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 合同名称下拉选
  listContractNameOptions() {
    const url = '/request-funds-biddingcontract/generalContract/listContractName'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 合同编码下拉选
  listContractCodeOptions() {
    const url = '/request-funds-biddingcontract/generalContract/listContractCode'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 项目列表 查看详情 (废除)
  checkProjectListDetails(params) {
    const url = '/request-funds-biddingcontract/generalContract/listContractByProjectCode'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  //
  addAll(params) {
    const url = '/request-funds-biddingcontract/generalContract/drafGeneralContract'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  addAllTo(params) {
    const url = '/request-funds-biddingcontract/drafcontract/drafcontractbpm'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 合同起草开关
  isOpenApprove(params) {
    const url = '/request-funds-biddingcontract/generalContract/updateIfFirstPlan'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  getList(params) {
    return request({
      url: '/request-funds-biddingcontract/table/list',
      method: 'get',
      params
    })
  },
  // 新增企业信息
  newAddCompanyInfo(params) {
    const url = '/request-funds-biddingcontract/company/savecompany'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 本公司信息
  getCompanyInformation(params) {
    const url = '/request-funds-biddingcontract/company/listcompany'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 删除本公司信息
  deleteCompanyInformation(params) {
    const url = '/request-funds-biddingcontract/company/deletecompany'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 获取本公司信息详情
  getCompanyDetailsInformation(params) {
    const url = '/request-funds-biddingcontract/company/getcompany'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 编辑本公司信息保存
  saveUpdatedCompanyInformation(params) {
    const url = '/request-funds-biddingcontract/company/updatecompany'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 供方管理 新增
  supplierManagementNewAdd(params) {
    const url = '/request-funds-biddingcontract/providecompany/saveprovidecompany'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 供方管理 列表
  getSupplierManagementList(params) {
    const url = '/request-funds-biddingcontract/providecompany/listprovidecompany'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 供方管理 删除
  deleteSupplierManagementInfo(params) {
    const url = '/request-funds-biddingcontract/providecompany/deleteCompany'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 供方管理详情
  getSupplierManagementDetailInfo(params) {
    const url = '/request-funds-biddingcontract/providecompany/getProvideCompanyById'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 供方管理 修改
  updateSupplierManagementInfo(params) {
    const url = '/request-funds-biddingcontract/providecompany/updateprovidecompany'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },

  // 范本管理 新增
  contractTemplateNewAdd(params) {
    const url = '/request-funds-biddingcontract/contractmodel/savecontractmodel'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 范本管理 查询
  getContractTemplate(params) {
    const url = '/request-funds-biddingcontract/contractmodel/listcontractmodel'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 范本管理 详情
  getContractTemplateDetails(params) {
    const url = '/request-funds-biddingcontract/contractmodel/getcontractmodel'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 范本管理 修改
  updateContractTemplate(params) {
    const url = '/request-funds-biddingcontract/contractmodel/updatecontractmodel'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 合同范本获取分类
  getTemplateClassification() {
    const url = '/request-funds-biddingcontract/contractmodel/getAllContractClassify'
    return request({
      url: url,
      method: 'post'
    })
  },

  // 合同分类
  // 查询
  getAllClassification(params) {
    const url = '/request-funds-biddingcontract/classify/findClassify'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 新增
  newAddClassification(params) {
    const url = '/request-funds-biddingcontract/classify/saveClassify'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },
  // 获取上级分类
  getClassificationTree() {
    const url = '/request-funds-biddingcontract/classify/getClassifyTree'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 分类 修改获取详情
  getClassificationDetails(params) {
    const url = '/request-funds-biddingcontract/classify/getClassifyById'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 修改
  updateClassification(params) {
    const url = '/request-funds-biddingcontract/classify/updateClassify'
    return request({
      url: url,
      data: params,
      method: 'post'
    })
  },

  // 跳转行一印
  pageToXingYiYin() {
    const url = '/request-funds-biddingcontract/user/singlesign'
    return request({
      url: url,
      method: 'get'
    })
  },

  // 合同履约 列表
  listcontract(data) {
    const url = '/request-funds-biddingcontract/contract/listcontract'
    return request({
      url: url,
      method: 'post',
      data: formUtil(data)
    })
  },

  // 获取供应商下拉接口
  listprovidecompany() {
    const url = '/request-funds-biddingcontract/providecompany/listprovidecompany'
    return request({
      url: url,
      method: 'post',
      data: { pageSize: 9999, pageNum: 1 }
    })
  },

  // 合同改变状态
  updateKeepStatus(data) {
    const url = '/request-funds-biddingcontract/contract/updateKeepStatus'
    return request({
      url: url,
      method: 'post',
      data: formUtil(data)
    })
  },
  // 关联审批流程
  getApprove() {
    const url = '/request-funds-biddingcontract/drafcontract/listapprove'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 关联合同范本
  contractModel(params) {
    const url = '/request-funds-biddingcontract/contractmodel/listcontractmodelzeroorone'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 关联补充协议范本
  supplymentTemplate(params) {
    const url = '/request-funds-biddingcontract/contractmodel/listcontractmodelzeroorone'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 获取合同起草列表
  getContractDraftList(params) {
    const url = '/request-funds-biddingcontract/classify/getNewClassifyTree'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 获取分类
  getContractClassification(params) {
    const url = '/request-funds-biddingcontract/classify/getClassifyTree'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },

  // 分类 bpm
  draftClassificationToBPM(params) {
    const url = '/request-funds-biddingcontract/drafcontract/drafcontractbpm'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },

  // 合同名称
  contractName(params) {
    const url = '/request-funds-biddingcontract/contract/listcontractstateone'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 合同分类
  getContractCategory(params) {
    const url = '/request-funds-biddingcontract/classify/getfirst'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 子分类
  getLastChildrenCategory(params) {
    const url = '/request-funds-biddingcontract/classify/getlastbyfirst'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 删除合同
  deleteContract(params) {
    const url = '/request-funds-biddingcontract/contract/delcontract'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  toupdatebpm(params) {
    const url = '/request-funds-biddingcontract/drafcontract/toupdatebpm'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  getToken() {
    const url = '/request-funds-biddingcontract/drafcontract/gettoken'
    return request({
      url: url,
      method: 'post'
    })
  },
  getContractDetails(params) {
    const url = '/request-funds-biddingcontract/contract/getcontract'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },

  // 合同审批 列表
  getApproveContract(params) {
    const url = '/request-funds-biddingcontract/drafcontract/contractapprove'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  // 合同审批 所属项目
  getProjects() {
    const url = '/request-funds-biddingcontract/contract/listallproject'
    return request({
      url: url,
      method: 'get'
    })
  },
  // 合同审批 相关方
  getParty() {
    const url = '/request-funds-biddingcontract/contract/listcontractparty'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 合同审批 流程名称
  getFlowName() {
    const url = '/request-funds-biddingcontract/drafcontract/listapprove'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 合同审批 分类树
  getTypeTree() {
    const url = '/request-funds-biddingcontract/classify/getClassifyTree'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },

  // 总包合同
  getAllContract(params) {
    const url = '/request-funds-biddingcontract/generalContract/listContractDraft'
    return request({
      url: url,
      method: 'post',
      data: params
    })
  },
  getContractApproveInstance(params) {
    const url = '/request-funds-biddingcontract/contract/getContractByInstanceId'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params)
    })
  },
  // 查看详情
  checkDetailWithAllContract(params) {
    const url = '/request-funds-biddingcontract/generalContract/getGeneralContractById'
    return request({
      url: url,
      method: 'post',
      data: formUtil(params)
    })
  },
  // 补充协议下拉选
  getRelevanceSupplement() {
    const url = '/request-funds-biddingcontract/contractmodel/listcontractmodelzeroorone'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 合同范本类型
  getContractTemplateTypeClassify() {
    const url = '/request-funds-biddingcontract/generalContract/getAllContractTwoClassify'
    return request({
      url: url,
      method: 'post'
    })
  }
}
