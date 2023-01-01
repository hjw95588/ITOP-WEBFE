import request from '@/utils/request'

// 查询打卡日历列表
export function listCalendars(query) {
  return request({
    url: '/punchInfo/calendars/list',
    method: 'get',
    params: query
  })
}

// 查询打卡日历详细
export function getCalendars(workDate) {
  return request({
    url: '/punchInfo/calendars/' + workDate,
    method: 'get'
  })
}

// 新增打卡日历
export function addCalendars(data) {
  return request({
    url: '/punchInfo/calendars',
    method: 'post',
    data: data
  })
}

// 修改打卡日历
export function updateCalendars(data) {
  return request({
    url: '/punchInfo/calendars',
    method: 'put',
    data: data
  })
}

// 删除打卡日历
export function delCalendars(workDate) {
  return request({
    url: '/punchInfo/calendars/' + workDate,
    method: 'delete'
  })
}

// 导出打卡日历
export function exportCalendars(query) {
  return request({
    url: '/punchInfo/calendars/export',
    method: 'get',
    params: query
  })
}
