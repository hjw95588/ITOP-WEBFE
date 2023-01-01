import request from '@/utils/request'

// 查询点赞人信息列表
export function listGivelike(query) {
  return request({
    url: '/person/givelike/list',
    method: 'get',
    params: query
  })
}

// 查询点赞人信息详细
export function getGivelike(userId) {
  return request({
    url: '/person/givelike/' + userId,
    method: 'get'
  })
}

// 新增点赞人信息
export function addGivelike(data) {
  return request({
    url: '/person/givelike/add',
    method: 'post',
    data: data
  })
}

//反转打卡状态
export function reverseIsNeedGive(id) {
  return request({
    url: '/person/givelike/reverseIsNeedGive/' + id,
    method: 'get'
  })
}

// 修改点赞人信息
export function updateGivelike(data) {
  return request({
    url: '/person/givelike/add',
    method: 'post',
    data: data
  })
}

// 删除点赞人信息
export function delGivelike(userId) {
  return request({
    url: '/person/givelike/' + userId,
    method: 'delete'
  })
}

// 导出点赞人信息
export function exportGivelike(query) {
  return request({
    url: '/person/givelike/export',
    method: 'get',
    params: query
  })
}

//点赞
export function nowGiveLike(query) {
  return request({
    url: '/person/givelike/nowGiveLike',
    method: 'get',
    params: query
  })
}

