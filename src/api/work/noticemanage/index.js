import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'


// 获取列表
export function getNoticManageList(data) {
  return request({
    url: '/request-funds-operatemanage/noticemanage/getNoticManageList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}
export function getTypeTree(data) {
  return request({
    url: '/request-funds-operatemanage/noticemanage/getTypeTree',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

