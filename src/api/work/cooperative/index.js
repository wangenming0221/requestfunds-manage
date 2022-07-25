import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'


export default {
  getMyWorkInstanceCountFromBpm() {
    const url = '/request-funds-operatemanage/bpm/get/getMyWorkInstanceCountFromBpm'
    return request({
      url: url,
      method: 'post'
    })
  },
  // 我的待办
  getMyAgentFromBpm(params) {
    const url = '/request-funds-operatemanage/bpm/get/getMyAgentFromBpm'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  },
  // 我的已办
  getMyDoneFromBpm(params) {
    const url = '/request-funds-operatemanage/bpm/get/getMyDoneFromBpm'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  },
  // 我的待阅
  getMyToReadFromBpm(params) {
    const url = '/request-funds-operatemanage/bpm/get/getMyToReadFromBpm'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  },
  // 我的已阅
  getMyHaveReadFromBpm(params) {
    const url = '/request-funds-operatemanage/bpm/get/getMyHaveReadFromBpm'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  },
  // bpm办理
  setHandleBpm(params) {
    const url = '/request-funds-operatemanage/bpm/set/setHandleBpm'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  },
  // 请款类别
  getRequestBusinessDicTree(params) {
    const url = '/request-funds-operatemanage/requestBusiness/getRequestBusinessDicTree'
    return request({
      url: url,
      method: 'post',
      data: qs.stringify(params),
      ...oXHRHeadrsUrlencoded
    })
  }
}
