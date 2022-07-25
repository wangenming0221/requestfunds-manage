import request from '@/utils/request'
import qs from "qs";

// 材料验收记录
// 通过实体翻页查询全成本
export function getMaterialRecord(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/findAllByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 查询 材料验收记录 单条信息 物料信息和附件
export function getMaterialAndEnclosure(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/getInfoById?inWareHouseId=${params}`,
    method: 'get',
  })
}
// 查询 采购制单信息(没物料)
export function getMaterialNoById(params) {
  return request({
    url: `/total-material/totalmaterial/materialpurchase/getById?purchaseId=${params}`,
    method: 'get',
  })
}

// 通过id 查看行一印电子签情况
export function getXYY(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/signStues?docId=${params}`,
    method: 'get',
  })
}

//点击现在行一印电子签
export function getFlie(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/getXyyContract?xyyContractId=${params}`,
    method: 'get',
  })
}
