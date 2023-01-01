import request from '@/utils/request'

// 查询点赞的所有人列表
export function listBirth(query) {
  return request({
    url: '/birthday/birth/list',
    method: 'get',
    params: query
  })
}


// 查询点赞的所有人详细
export function getBirth(birUserId) {
  return request({
    url: '/birthday/birth/' + birUserId,
    method: 'get'
  })
}

// 新增点赞的所有人
export function addBirth(data) {
  return request({
    url: '/birthday/birth',
    method: 'post',
    data: data
  })
}

// 修改点赞的所有人
export function updateBirth(data) {
  return request({
    url: '/birthday/birth',
    method: 'put',
    data: data
  })
}

// 删除点赞的所有人
export function delBirth(birUserId) {
  return request({
    url: '/birthday/birth/' + birUserId,
    method: 'delete'
  })
}

// 导出点赞的所有人
export function exportBirth(query) {
  return request({
    url: '/birthday/birth/export',
    method: 'get',
    params: query
  })
}
