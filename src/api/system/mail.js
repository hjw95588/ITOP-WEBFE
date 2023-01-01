import request from '@/utils/request'
// 查询邮件记录列表
export function listMail(query) {
  return request({
    url: '/system/mail/list',
    method: 'get',
    params: query
  })
}

// 查询邮件记录详细
export function getMail(mailId) {
  return request({
    url: '/system/mail/' + mailId,
    method: 'get'
  })
}

// 删除邮件记录
export function delMail(mailId) {
  return request({
    url: '/system/mail/' + mailId,
    method: 'delete'
  })
}

// 导出邮件记录
export function exportMail(query) {
  return request({
    url: '/system/mail/export',
    method: 'get',
    params: query
  })
}