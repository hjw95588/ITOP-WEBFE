import request from '@/utils/request'

// 查询流程节点组列表
export function listGroup(query) {
  return request({
    url: '/kylin/flow/group/list',
    method: 'get',
    params: query
  })
}

// 查询流程节点组详细
export function getGroup(groupId) {
  return request({
    url: '/kylin/flow/group/' + groupId,
    method: 'get'
  })
}

// 新增流程节点组
export function addGroup(data) {
  return request({
    url: '/kylin/flow/group',
    method: 'post',
    data: data
  })
}

// 修改流程节点组
export function updateGroup(data) {
  return request({
    url: '/kylin/flow/group',
    method: 'put',
    data: data
  })
}

// 删除流程节点组
export function delGroup(groupId) {
  return request({
    url: '/kylin/flow/group/' + groupId,
    method: 'delete'
  })
}

// 导出流程节点组
export function exportGroup(query) {
  return request({
    url: '/kylin/flow/group/export',
    method: 'get',
    params: query
  })
}