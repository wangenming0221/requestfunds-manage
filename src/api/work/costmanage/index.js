import request from '@/utils/request'
import qs from 'qs'
import { oXHRHeadrsUrlencoded } from '@/utils/headers'
import formUtil from '@/utils/formUtils'



//费用项管理分页查询所有数据
export function getCostItemList(params) {
  return request({
    url: '/request-funds-expensemanage/costitemmanage/queryPage',
    method: 'get',
    params
  })
}

//费用项管理新增数据
export function addCostItem(data) {
  return request({
    url: '/request-funds-expensemanage/costitemmanage/insert',
    method: 'post',
    data
  })
}

//费用项管理修改数据
export function editCostItem(data) {
  return request({
    url: '/request-funds-expensemanage/costitemmanage/update',
    method: 'post',
    data
  })
}

//费用项管理根据id删除数据
export function deleteCostItem(data) {
  return request({
    url: '/request-funds-expensemanage/costitemmanage/delete',
    method: 'post',
    data
  })
}

//费用项管理根据id查询一条数据
export function getCostItemDetail(params) {
  return request({
    url: '/request-funds-expensemanage/costitemmanage/getById',
    method: 'get',
    params
  })
}



//场景管理分页查询所有数据
export function getCostSceneList(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/queryScene',
    method: 'post',
    data: formUtil(data)
  })
}

//场景管理新增数据
export function addCostScene(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/insert',
    method: 'post',
    data
  })
}

//场景管理修改数据
export function editCostScene(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/update',
    method: 'post',
    data
  })
}

//场景管理获取上级场景分类
export function getCostSceneTree(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/querySceneList',
    method: 'post',
    data
  })
}

//场景管理根据id查询一条数据
export function getCostSceneDetail(params) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/getById',
    method: 'get',
    params
  })
}

//场景管理导出文件
export function exportCostExcel(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/exportCostExcel',
    method: 'post',
    data
  })
}

//场景管理根据id删除数据
export function deleteCostScene(data) {
  return request({
    url: '/request-funds-expensemanage/costsceneinfo/remove',
    method: 'post',
    data
  })
}

//分公司费用管控
//分公司费用管控分页查询所有数据
export function getCostcontrol(params) {
  return request({
    url: '/request-funds-expensemanage/costcontrolinfo/queryPage',
    method: 'get',
    params
  })
}

//分公司费用管控新增数据
export function addCostcontrol(data) {
  return request({
    url: '/request-funds-expensemanage/costcontrolinfo/insert',
    method: 'post',
    data
  })
}

//分公司费用管控修改数据
export function editCostcontrol(data) {
  return request({
    url: '/request-funds-expensemanage/costcontrolinfo/update',
    method: 'post',
    data
  })
}



//分公司费用管控根据id查询一条数据
export function getCostcontrolDetail(params) {
  return request({
    url: '/request-funds-expensemanage/costcontrolinfo/getById',
    method: 'get',
    params
  })
}



//分公司费用管控根据id删除数据
export function deleteCostcontrol(data) {
  return request({
    url: '/request-funds-expensemanage/costcontrolinfo/delete',
    method: 'post',
    data
  })
}


//分公司营收数据
//分公司营收数据分页查询所有数据
export function getRevenuedata(params) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/queryPage',
    method: 'get',
    params
  })
}

//分公司营收数据新增数据
export function addRevenuedata(data) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/insert',
    method: 'post',
    data
  })
}

//分公司营收数据修改数据
export function editRevenuedata(data) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/update',
    method: 'post',
    data
  })
}



//分公司营收数据根据id查询一条数据
export function getRevenuedataDetail(params) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/getById',
    method: 'get',
    params
  })
}



//分公司营收数据根据id删除数据
export function deleteRevenuedata(data) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/delete',
    method: 'post',
    data
  })
}

//分公司营收数据导出文件
export function exportRevenueExcel(data) {
  return request({
    url: '/request-funds-expensemanage/revenuedatainfo/exportRevenueExcel',
    method: 'post',
    data
  })
}
