import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'

// 项目信息分页查询/条件查询
export function projectInfoSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/selectAllPage',
    method: 'get',
    params
  })
}

// 项目信息页面保存接口
export function projectInfoSave(data) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/save',
    method: 'post',
    data
  })
}

// 项目信息页面保存接口------新
export function projectInfoVersionSave(data) {
  return request({
    url: '/request-funds-projectmanage/projectinfoVersion/save',
    method: 'post',
    data
  })
}

// 根据项目主键id查询项目信息.人员信息.楼栋信息
export function projectInfoSelectOne(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfoVersion/getProjectVersionById',
    method: 'get',
    params
  })
}



// 项目表单页下拉选项--版本
export function projectDropDownSelect(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfoVersion/dropDownSelect',
    method: 'get',
    params
  })

}

// 根据projectMdmId查项目
export function projectInfoById(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/getById',
    method: 'get',
    params
  })

}

//拉取项目版本列表
export function projectVersion(data) {
  return request({
    url: 'request-funds-projectmanage/projectinfoColor/conditionQuery',
    method: 'post',
    data
  })
}

//修改项目阶段
export function updateProjectPhase(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/updateProjectPhase',
    method: 'get',
    params
  })
}

//修改楼栋阶段
export function updateBuildingPhase(params) {
  return request({
    url: '/request-funds-projectmanage/projectBuilding/updateBuildingPhase',
    method: 'get',
    params
  })
}



// 项目信息逻辑删除
export function projectInfoLogicalDeletion(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/logicalDeletion',
    method: 'get',
    params
  })
}

// 查询分公司
export function projectInfoList(params = { ancestors: '1,3'}) {
  return request({
    url: '/request-funds-system/system/dept/list',
    method: 'get',
    params
  })
}

// 分公司总、项目经理、项目总
export function getUserLikeNickName(params) {
  return request({
    url: '/request-funds-system/system/user/getUserLikeNickName',
    method: 'get',
    params
  })
}

// 单体楼栋的分页查询和条件筛选查询
export function singleBuildingSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/projectBuilding/selectAllPage',
    method: 'get',
    params
  })
}

// 单体楼栋表单页下拉选项--版本
export function singleBuildingDropDownSelect(params) {
  return request({
    url: '/request-funds-projectmanage/BuildingVersion/dropDownSelect',
    method: 'get',
    params
  })

}

// 根据BuildingVersionById查询楼栋信息
export function singleBuildingSelectOne(params) {
  return request({
    url: '/request-funds-projectmanage/BuildingVersion/getBuildingVersionById',
    method: 'get',
    params
  })
}

// 根据buildingMdmId查询楼栋信息
export function singleBuildingById(params) {
  return request({
    url: '/request-funds-projectmanage/projectBuilding/getById',
    method: 'get',
    params
  })
}
// 根据projectMdmId查询楼栋
export function singleBuildingByProjectMdmId(params) {
  return request({
    url: '/request-funds-projectmanage/projectBuilding/selectByProjectMdmId',
    method: 'get',
    params
  })
}
//根据楼栋主键和楼栋的状态,查询开停工单的主键
export function selectWorkBuildingId(params) {
  return request({
    url: '/request-funds-projectmanage/workBuilding/selectWorkBuildingId',
    method: 'get',
    params
  })
}

//根据楼栋主键和楼栋的状态,查询停工单的主键
export function selectStopWorkBuildingId(params) {
  return request({
    url: '/request-funds-projectmanage/workBuilding/selectStopWorkBuildingId',
    method: 'get',
    params
  })
}



// 根据mdmId进行逻辑删除
export function singleBuildingLogicalDeletion(data) {
  return request({
    url: '/request-funds-projectmanage/projectBuilding/logicalDeletion',
    method: 'post',
    data
  })
}

//拉取楼栋版本列表
export function singleBuildingVersion(data) {
  return request({
    url: '/request-funds-projectmanage/BuildingColor/conditionQuery',
    method: 'post',
    data
  })
}

// 保存接口
export function singleBuildingSave(data) {
  return request({
    url: '/request-funds-projectmanage/BuildingVersion/save',
    method: 'post',
    data
  })
}

// 根据模糊查询
export function queryProjectLikeProjectName(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/queryProjectLikeProjectName',
    method: 'get',
    params
  })
}

// 根据模糊查询
export function queryProjectLikeProjectCode(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfo/queryProjectLikeProjectCode',
    method: 'get',
    params
  })
}

// 财务苑区分页查询
export function financeParkSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/projectsfinancepark/queryPage',
    method: 'get',
    params
  })
}

//财务苑区新增数据
export function addFinancePark(data) {
  return request({
    url: '/request-funds-projectmanage/projectsfinancepark/insert',
    method: 'post',
    data
  })
}

//财务苑区修改数据
export function editFinancePark(data) {
  return request({
    url: '/request-funds-projectmanage/projectsfinancepark/update',
    method: 'post',
    data
  })
}

//财务苑区根据id查询详情
export function getFinanceParkDetail(params) {
  return request({
    url: '/request-funds-projectmanage/projectsfinancepark/getById',
    method: 'get',
    params
  })
}

//财务苑区根据parkCode查询详情
export function queryFinanceByCode(params) {
  return request({
    url: '/request-funds-projectmanage/projectinfoVersion/queryFinanceByCode',
    method: 'get',
    params
  })
}




//财务苑区根据id删除数据
export function deleteFinancePark(data) {
  return request({
    url: '/request-funds-projectmanage/projectsfinancepark/delete',
    method: 'post',
    data
  })
}

// 承包人管理分页查询、条件查询
export function contractorSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/projectscontractorinfo/queryPage',
    method: 'get',
    params
  })
}

//承包人管理新增数据
export function addContractor(data) {
  return request({
    url: '/request-funds-projectmanage/projectscontractorinfo/insert',
    method: 'post',
    data
  })
}

//承包人管理修改数据
export function editContractor(data) {
  return request({
    url: '/request-funds-projectmanage/projectscontractorinfo/update',
    method: 'post',
    data
  })
}

//承包人管理根据id查询详情
export function getContractorDetail(params) {
  return request({
    url: '/request-funds-projectmanage/projectscontractorinfo/getById',
    method: 'get',
    params
  })
}

//财务苑区根据id删除数据
export function deleteContractor(data) {
  return request({
    url: '/request-funds-projectmanage/projectscontractorinfo/delete',
    method: 'post',
    data
  })
}

// 开工管理分页查询、条件查询
export function startWorkSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/startWork/selectAllPage',
    method: 'get',
    params
  })
}

//开工管理新增数据
export function addStartWork(data) {
  return request({
    url: '/request-funds-projectmanage/startWork/save',
    method: 'post',
    data
  })
}

//开工管理编辑数据
export function editStartWork(data) {
  return request({
    url: '/request-funds-projectmanage/startWork/update',
    method: 'post',
    data
  })
}


//开工管理根据id查询详情
export function getStartWorkDetail(params) {
  return request({
    url: '/request-funds-projectmanage/startWork/selectOne',
    method: 'get',
    params
  })
}

//开工管理删除数据
export function deleteStartWork(data) {
  return request({
    url: '/request-funds-projectmanage/startWork/logicalDeletion',
    method: 'post',
    data
  })
}

// 停工管理分页查询、条件查询
export function stopWorkSelectAllPage(params) {
  return request({
    url: '/request-funds-projectmanage/stopWork/selectAllPage',
    method: 'get',
    params
  })
}

//停工管理新增数据
export function addStopWork(data) {
  return request({
    url: '/request-funds-projectmanage/stopWork/save',
    method: 'post',
    data
  })
}

//停工管理编辑数据
export function editStopWork(data) {
  return request({
    url: '/request-funds-projectmanage/stopWork/update',
    method: 'post',
    data
  })
}


//停工管理根据id查询详情
export function getStopWorkDetail(params) {
  return request({
    url: '/request-funds-projectmanage/stopWork/selectOne',
    method: 'get',
    params
  })
}

//停工管理删除数据
export function deleteStopWork(data) {
  return request({
    url: '/request-funds-projectmanage/stopWork/logicalDeletion',
    method: 'post',
    data
  })
}
