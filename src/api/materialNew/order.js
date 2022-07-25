import request from '@/utils/request'
import qs from "qs";

//采购订单列表-NC同步
// 项目下拉接口\
export function getProject(){
  return request({
    url: `/total-material/totalmaterial/dropdown/findAllProjectListByUserId`,
    method: 'get',
  })
}

// 通过实体翻页查询 NC数据
export function getNewPurchasePage(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/ncPurchase/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 查询 采购制单信息(带物料)
export function getNewMaterialById(params) {
  return request({
    url: `/total-material/ncPurchase/getInfoById?purchaseId=${params}`,
    method: 'get',
  })
}


// // 更新全成本物料系统物料分类
// export function addNewMaterialInwareHouse(data) {
//   return request({
//     url: '/total-material/totalmaterial/inwarehouse/add',
//     method: 'post',
//     data: data
//   })
// }

// // 删除 采购制单信息
// export function getNewRemoveById(params) {
//   return request({
//     url: `/total-material/totalmaterial/materialpurchase/removeById?purchaseId=${params}`,
//     method: 'get',
//   })
// }
//
// // 关联入库单 tab页接口
// export function getNewStockInPage(params) {
//   return request({
//     url: `/total-material/totalmaterial/inwarehouse/findAllByPurchaseId?purchaseId=${params}`,
//     method: 'get',
//   })
// }
//
// // 通过id 查询关联入库单
// export function getNewAtInOrder(params) {
//   return request({
//     url: `/total-material/totalmaterial/inwarehouse/findAllByPId?purchaseId=${params}`,
//     method: 'get',
//   })
// }
