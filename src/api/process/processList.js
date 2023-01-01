import request from '@/utils/request'

// 查询流程列表
export function getProcessListPage(query) {
  return request({
    url: '/kylin/flowInfo/formList',
    method: 'get',
    params: query
  })
}

// 查询流程简要列表
export function getBriefProcessListPage(query) {
  return request({
    url: '/kylin/flowInfo/list',
    method: 'get',
    params: query
  })
}

/* // 查询流程详细信息
export function getProcessDetailById(data) {
  return request({
    url: '/kylin/flowInfo/'+data,
    method: 'get',
  })
} */

// 新增流程
export function insertProcess(data) {
  return request({
    url: '/kylin/flowInfo',
    method: 'post',
    data: data
  })
}

// 编辑/保存流程
export function updateProcess(data) {
  return request({
    url: '/kylin/flowInfo',
    method: 'put',
    data: data
  })
}

// 删除流程
export function deleteProcess(data) {
  return request({
    url: '/kylin/flowInfo/'+data,
    method: 'delete'
  })
}

// 发布流程
export function publishProcess(data) {
  return request({
    url: '/kylin/flowInfo/deployByStringBPMN',
    method: 'post',
    data: data
  })
}

