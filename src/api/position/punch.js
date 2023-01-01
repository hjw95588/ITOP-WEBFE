import request from '@/utils/request'

// 查询打卡需要的常用位置列表
export function listPunchPosition(query) {
  return request({
    url: '/position/punch/list',
    method: 'get',
    params: query
  })
}

// 查询打卡需要的常用位置详细
export function getPunchPosition(id) {
  return request({
    url: '/position/punch/' + id,
    method: 'get'
  })
}

// 新增打卡需要的常用位置
export function addPunchPosition(data) {
  return request({
    url: '/position/punch',
    method: 'post',
    data: data
  })
}

// 修改打卡需要的常用位置
export function updatePunchPosition(data) {
  return request({
    url: '/position/punch',
    method: 'put',
    data: data
  })
}

// 删除打卡需要的常用位置
export function delPunchPosition(id) {
  return request({
    url: '/position/punch/' + id,
    method: 'delete'
  })
}

// 导出打卡需要的常用位置
export function exportPunchPosition(query) {
  return request({
    url: '/position/punch/export',
    method: 'get',
    params: query
  })
}
