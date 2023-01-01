import request from '@/utils/request'

// 查询打卡人信息列表
export function listPunchPerson(query) {
  return request({
    url: '/punchInfo/punch/list',
    method: 'get',
    params: query
  })
}

// 查询打卡人信息详细
export function getPunchPerson(id) {
  return request({
    url: '/punchInfo/punch/' + id,
    method: 'get'
  })
}

// 新增打卡人信息
export function addPunchPerson(data) {
  return request({
    url: '/punchInfo/punch',
    method: 'post',
    data: data
  })
}

// 修改打卡人信息
export function updatePunchPerson(data) {
  return request({
    url: '/punchInfo/punch',
    method: 'put',
    data: data
  })
}

// 删除打卡人信息
export function delPunchPerson(id) {
  return request({
    url: '/punchInfo/punch/' + id,
    method: 'delete'
  })
}

//反转打卡状态
export function reversePunch(id) {
  return request({
    url: '/punchInfo/punch/reversePunch/' + id,
    method: 'get'
  })
}
//改变打卡状态 type:0 需要变成不打卡  type:1 需要变成打卡
export function changePunchStatue(id,type) {
  return request({
    url: '/punchInfo/punch/changePunchStatue/' + id+'/'+type,
    method: 'get'
  })
}



// 导出打卡人信息
export function exportPunchPerson(query) {
  return request({
    url: '/punchInfo/punch/export',
    method: 'get',
    params: query
  })
}
