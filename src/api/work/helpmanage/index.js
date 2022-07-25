import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'

// 获取常见问题列表
export function getUsualQuestionListPage(query) {
  return request({
    url: '/request-funds-portal/helpCenter/getUsualQuestionListPage' + `?question=${query.question}&current=${query.current}&size=${query.size}`,
    method: 'get',
    ...oXHRHeadrsUrlencoded
  })
}

// 新增常见问题
export function insertUsualQuestion(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/insertUsualQuestion',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}


// 修改常见问题
export function updateUsualQuestion(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/updateUsualQuestion',
    method: 'put',
    data
  })
}

// 删除常见问题
export function deleteUsualQuestion(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/deleteUsualQuestion/' + data,
    method: 'delete',
    ...oXHRHeadrsUrlencoded
  })
}

// 获取操作指引
export function getOperateListPage(query) {
  return request({
    url: '/request-funds-portal/helpCenter/getOperateListPage' + `?operateName=${query.operateName}&current=${query.current}&size=${query.size}`,
    method: 'get',
    ...oXHRHeadrsUrlencoded
  })
}

// 新增操作指引
export function insertOperate(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/insertOperate',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}


// 修改操作指引
export function updateOperate(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/updateOperate',
    method: 'put',
    data
  })
}

// 删除操作指引
export function deleteOperate(data) {
  return request({
    url: '/request-funds-operatemanage/helpCenter/deleteOperate/' + data,
    method: 'delete',
    ...oXHRHeadrsUrlencoded
  })
}
