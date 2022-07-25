import request from '@/utils/request'
import qs from "qs";

//采购制单-系统
// 通过实体翻页查询 物料系统入库表
export function getNewPurchaseData(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/from_bpm/getPurchaseList?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 通过id 查询单条制单信息
export function getNewPurchaseDetailById(params) {
  return request({
    url: `/total-material/from_bpm/getPurchaseDetail?id=${params.id}&type=${params.requisitiontype}`,
    method: 'get',
  })
}
// 通过 制单确定
export function addMaterialPurchase(params) {
  return request({
    url: `/total-material/totalmaterial/materialpurchase/add`,
    method: 'post',
    data: params
  })
}
