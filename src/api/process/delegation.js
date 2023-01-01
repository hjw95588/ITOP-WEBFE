import request from '@/utils/request'

// 查询代理列表
export function list(query) {
  return request({
    url: '/kylin/delegation/list',
    method: 'get',
    params: query
  })
}

// 查询代理详细
export function get(id) {
  return request({
    url: '/kylin/delegation/' + id,
    method: 'get'
  })
}

// 新增代理
export function add(data) {
  return request({
    url: '/kylin/delegation',
    method: 'post',
    data: data
  })
}

// 修改代理
export function update(data) {
  return request({
    url: '/kylin/delegation',
    method: 'put',
    data: data
  })
}

// 获取流程数据
export function getFlowData () {
  return request({
    url: '/kylin/flowInfo/list?state=1',
    method: 'get'
  })
}

// 查询代理历史
export function listHistory(query) {
  return request({
    url: '/kylin/delegationHistory/list',
    method: 'get',
    params: query
  })
}

// 查询代理历史详细
export function getHistory(id) {
  return request({
    url: '/kylin/delegationHistory/' + id,
    method: 'get'
  })
}