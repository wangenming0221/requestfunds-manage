import request from '@/utils/request'
import qs from "qs";

// 通过实体翻页查询全成本物料系统物料分类
export function getMaterialPage(data,pageIndex,pageSize) {
  console.log("data",data)
  console.log("pageIndex",pageIndex)
  console.log("pageSize",pageSize)
  return request({
    url: `/total-material/totalmaterial/material/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 新建全成本物料系统物料分类
export function addMaterialMaterial(data) {
  console.log("data",data)
  return request({
    url: '/total-material/totalmaterial/material/add',
    method: 'post',
    // data: qs.stringify(data)
    data: data
  })
}
// 查询全成本物料系统物料分类
export function getMaterialMaterial(params) {
  console.log("params",params)
  return request({
    url: '/total-material/totalmaterial/material/getById',
    method: 'get',
    params: params
  })
}
// 更新全成本物料系统物料分类
export function updateMaterialMaterial(data) {
  return request({
    url: '/total-material/totalmaterial/material/updateById',
    method: 'post',
    data: data
  })
}
// 批量删除全成本物料系统物料分类
export function removeMaterialMaterial(params) {
  return request({
    url: '/total-material/totalmaterial/material/removeByIds?materialIds='+params,
    method: 'get',
  })
}
