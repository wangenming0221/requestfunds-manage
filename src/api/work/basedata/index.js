import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'

// 项目信息
export function getProjectCodeAndName(data) {
  return request({
    url: '/base-data/BaseProjectInfo/getProjectCodeAndName',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 项目信息列表
export function getProjectInfo(data) {
  return request({
    url: '/base-data/BaseProjectInfo/getProjectInfo',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 合同信息
export function getContractInfo(data) {
  return request({
    url: '/base-data/BaseProjectInfo/getContractInfo',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 供方信息
export function getPorCompanyInfo(data) {
  return request({
    url: '/base-data/BaseProjectInfo/getPorCompanyInfo',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

