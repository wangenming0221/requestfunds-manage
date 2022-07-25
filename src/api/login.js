import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/request-funds-system/login',
    method: 'post',
    data
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/request-funds-system/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/request-funds-system/logout',
    method: 'delete'
  })
}
