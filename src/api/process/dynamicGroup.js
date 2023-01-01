import request from '@/utils/request'

// 查询流程动态审批组列表
export function listDynamicGroup(query) {
  return request({
    url: '/kylin/flow/dynamicGroup/list',
    method: 'get',
    params: query
  })
}

// 查询流程动态审批组详细
export function getDynamicGroup(groupDynamicId) {
  return request({
    url: '/kylin/flow/dynamicGroup/' + groupDynamicId,
    method: 'get'
  })
}

// 新增流程动态审批组
export function addDynamicGroup(data) {
  return request({
    url: '/kylin/flow/dynamicGroup',
    method: 'post',
    data: data
  })
}

// 修改流程动态审批组
export function updateDynamicGroup(data) {
  return request({
    url: '/kylin/flow/dynamicGroup',
    method: 'put',
    data: data
  })
}

// 删除流程动态审批组
export function delDynamicGroup(groupDynamicId) {
  return request({
    url: '/kylin/flow/dynamicGroup/' + groupDynamicId,
    method: 'delete'
  })
}

// 导出流程动态审批组
export function exportDynamicGroup(query) {
  return request({
    url: '/kylin/flow/dynamicGroup/export',
    method: 'get',
    params: query
  })
}