import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/request-funds-system/system/loginInfo/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/request-funds-system/system/loginInfo/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/request-funds-system/system/loginInfo/clean',
    method: 'delete'
  })
}