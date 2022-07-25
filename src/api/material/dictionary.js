import request from '@/utils/request'

// 读取项目信息表
export function baseProjectInfo() {
  return request({
    url: '/total-material/totalmaterial/dropdown/findAllBaseProjectInfoForList',
    method: 'get'
  })
}

// 读取供应商列表
export function allConProvide() {
  return request({
    url: '/total-material/totalmaterial/dropdown/findAllConProvideCompanyForList',
    method: 'get'
  })
}

// 读取用户列表
export function allSysUser() {
  return request({
    url: '/totalmaterial/dropdown/findAllSysUserForList',
    method: 'get'
  })
}

// 获取料物系统仓库表
export function allWarehouse() {
  return request({
    url: '/total-material/totalmaterial/dropdown/findAllWarehouseForList',
    method: 'get'
  })
}
