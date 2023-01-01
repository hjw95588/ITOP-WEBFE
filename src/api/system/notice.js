import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}

// 消息中心相关api
// 消息中心获取通知公告详情
export function annouNotic (noticeId) {
  return request({
    url: `/system/notice/readNotice/${noticeId}`,
    method: 'get'
  })
}
export function noticeAnoun (query) {
  return request({
    url: '/system/notice/userList',
    method: 'get',
    params: query
  })
}
// 获取未读通知或公告total
export function getTotal (query) {
  return request({
    url: 'system/notice/unreadNum',
    method: 'get',
    params: query
  })
}
// 全部已读
export function toReadAll (query) {
  return request({
    url: 'system/notice/readAll',
    method: 'get',
    params: query
  })
}