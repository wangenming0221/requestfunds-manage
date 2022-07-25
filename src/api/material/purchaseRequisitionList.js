import request from '@/utils/request'
import qs from "qs";

//采购制单-系统
// 通过实体翻页查询 物料系统入库表
export function getPurchaseData(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/from_bpm/purchase_list?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 通过id 查询单条制单信息
export function getPurchaseDetailById(params) {
  return request({
    url: `/total-material/from_bpm/purchase_detail?id=${params}`,
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
//
// // materialNoById tab页接口
// export function getStockInPage(params) {
//   return request({
//     url: `/total-material/totalmaterial/inwarehouse/findAllByPurchaseId?purchaseId=${params}`,
//     method: 'get',
//   })
// }

