import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'

// 运营人员操作日志表
export function getPorLogList(data) {
  return request({
    url: '/request-funds-operatemanage/log/getPorLogList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 运营人员操作日志表
export function getSysUserLogList(data) {
  return request({
    url: '/request-funds-operatemanage/log/getSysUserLogList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}


// 支付日志表
export function getPayLogList(data) {
  return request({
    url: '/request-funds-operatemanage/log/getPayLogList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// BPM日志表
export function getBpmLogList(data) {
  return request({
    url: '/request-funds-operatemanage/log/getBpmLogList',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 基础数据同步
export function getSyncLogInfo(data) {
  return request({
    url: '/base-data/SyncLogInfo/getSyncLogInfo',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

// 手动同步
export function ManualSyncBaseProjectInfo(data) {
  return request({
    url: '/base-data/BaseProjectInfo/ManualSyncBaseProjectInfo',
    method: 'post',
    data: qs.stringify(data),
    ...oXHRHeadrsUrlencoded
  })
}

