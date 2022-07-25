import request from '@/utils/request'
import qs from "qs";

// 通过实体翻页查询全成本物料系统物料分类
export function getMaterialPage(data,pageIndex,pageSize) {
  return request({
    url: `/total-material/totalmaterial/materialwarehouse/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 新建全成本物料系统物料分类
export function addMaterialStore(data) {
  console.log("data",data)
  return request({
    url: '/total-material/totalmaterial/materialwarehouse/add',
    method: 'post',
    // data: qs.stringify(data)
    data: data
  })
}
// 查询全成本物料系统物料分类
export function getMaterialStore(params) {
  console.log("params",params)
  return request({
    url: '/total-material/totalmaterial/materialwarehouse/getById',
    method: 'get',
    params: params
  })
}
// 更新全成本物料系统物料分类
export function updateMaterialStore(data) {
  return request({
    url: '/total-material/totalmaterial/materialwarehouse/updateById',
    method: 'post',
    data: data
  })
}
// 批量删除全成本物料系统物料分类
export function removeMaterialStore(params) {
  return request({
    url: '/total-material/totalmaterial/materialwarehouse/removeByIds?materialIds='+params,
    method: 'get',
  })
}
