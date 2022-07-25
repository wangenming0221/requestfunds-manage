import request from '@/utils/request'
import qs from "qs";

//采购制单-制单员
// 通过实体翻页查询全成本
export function getPurchasePage(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/totalmaterial/materialpurchase/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 查询 采购制单信息(带物料)
export function getMaterialById(params) {
  return request({
    url: `/total-material/totalmaterial/materialpurchase/getInfoById?purchaseId=${params}`,
    method: 'get',
  })
}


// 更新全成本物料系统物料分类
export function updateMaterialById(data) {
  return request({
    url: '/total-material/totalmaterial/materialpurchase/updateById',
    method: 'post',
    data: data
  })
}

// 删除 采购制单信息
export function getRemoveById(params) {
  return request({
    url: `/total-material/totalmaterial/materialpurchase/removeById?purchaseId=${params}`,
    method: 'get',
  })
}

// 关联入库单 tab页接口
export function getStockInPage(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/findAllByPurchaseId?purchaseId=${params}`,
    method: 'get',
  })
}

// 通过id 查询关联入库单
export function getAtInOrder(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/findAllByPId?purchaseId=${params}`,
    method: 'get',
  })
}
