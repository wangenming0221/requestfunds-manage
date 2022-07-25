import request from '@/utils/request'
import qs from "qs";

// 物料库左侧物料分类tree
export function getTotalMaterial() {
  return request({
    url: '/total-material/totalmaterial/category/buildAllTree',
    method: 'get'
  })
}
// 通过实体翻页查询全成本物料系统物料分类
export function getMaterialPage(data,pageIndex,pageSize) {
  console.log("data",data)
  console.log("pageIndex",pageIndex)
  console.log("pageSize",pageSize)
  return request({
    url: `/total-material/totalmaterial/category/findByEntity?page=${pageIndex}&size=${pageSize}`,
    method: 'post',
    data:data
  })
}

// 新建全成本物料系统物料分类
export function addMaterialCategory(data) {
  console.log("data",data)
  return request({
    url: '/total-material/totalmaterial/category/add',
    method: 'post',
    data: data
  })
}
// 查询全成本物料系统物料分类
export function getMaterialCategory(params) {
  console.log("params",params)
  return request({
    url: '/total-material/totalmaterial/category/getById',
    method: 'get',
    params: params
  })
}
// 更新全成本物料系统物料分类
export function updateMaterialCategory(data) {
  return request({
    url: '/total-material/totalmaterial/category/updateById',
    method: 'post',
    data: data
  })
}
// 批量删除全成本物料系统物料分类
export function removeMaterialCategory(params) {
  return request({
    url: '/total-material/totalmaterial/category/removeByIds?materialCategoryIds='+params,
    method: 'get',
  })
}
