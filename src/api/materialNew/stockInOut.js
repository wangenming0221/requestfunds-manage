import request from '@/utils/request'
import qs from "qs";

//出入库记录
// 通过实体翻页查询 物料系统入库table表
export function getStockInPage(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 通过实体翻页查询 物料系统出库table表
export function getStockOutPage(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/totalmaterial/outwarehouse/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 通过id 查询入库单信息
export function getInStockById(params) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/getById?inWareHouseId=${params}`,
    method: 'get',
  })
}
// 通过id 查询出库单信息
export function getOutStockById(params) {
  return request({
    url: `/total-material/totalmaterial/outwarehouse/getById?outWareHouseId=${params}`,
    method: 'get',
  })
}

// 添加入库单接口
export function addNewInwareHouse(data) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/addFromNC`,
    method: 'post',
    data:data
  })
}

//重新发起入库单
export function updateFromDataNC(data) {
  return request({
    url: `/total-material/totalmaterial/inwarehouse/updateFromNC`,
    method: 'post',
    data:data
  })
}
