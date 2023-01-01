import request from '@/utils/request'

// 查询流程动态审批组用户关联列表
export function listDynamicGroupUser(query) {
  return request({
    url: '/kylin/dynamicGroupUser/list',
    method: 'get',
    params: query
  })
}

// 查询流程动态审批组用户关联详细
export function getDynamicGroupUser(groupDynamicUserId) {
  return request({
    url: '/kylin/dynamicGroupUser/' + groupDynamicUserId,
    method: 'get'
  })
}

// 新增流程动态审批组用户关联
export function addDynamicGroupUser(data) {
  return request({
    url: '/kylin/dynamicGroupUser',
    method: 'post',
    data: data
  })
}

// 修改流程动态审批组用户关联
export function updateDynamicGroupUser(data) {
  return request({
    url: '/kylin/dynamicGroupUser',
    method: 'put',
    data: data
  })
}

// 删除流程动态审批组用户关联
export function delDynamicGroupUser(groupDynamicUserId) {
  return request({
    url: '/kylin/dynamicGroupUser/' + groupDynamicUserId,
    method: 'delete'
  })
}

// 导出流程动态审批组用户关联
export function exportDynamicGroupUser(query) {
  return request({
    url: '/kylin/dynamicGroupUser/export',
    method: 'get',
    params: query
  })
}