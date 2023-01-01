import request from '@/utils/request'

// 查询人力信息列表
export function listEmpInfo(query) {
  return request({
    url: '/sysEmpInfo/empInfo/list',
    method: 'get',
    params: query
  })
}

// 查询人力信息详细
export function getEmpInfo(empid) {
  return request({
    url: '/sysEmpInfo/empInfo/' + empid,
    method: 'get'
  })
}

// 新增人力信息
export function addEmpInfo(data) {
  return request({
    url: '/sysEmpInfo/empInfo',
    method: 'post',
    data: data
  })
}

// 修改人力信息
export function updateEmpInfo(data) {
  return request({
    url: '/sysEmpInfo/empInfo',
    method: 'put',
    data: data
  })
}

// 删除人力信息
export function delEmpInfo(empid) {
  return request({
    url: '/sysEmpInfo/empInfo/' + empid,
    method: 'delete'
  })
}

// 导出人力信息
export function exportEmpInfo(query) {
  return request({
    url: '/sysEmpInfo/empInfo/export',
    method: 'get',
    params: query
  })
}

// 查询人力信息详细
export function downLoadFile(query) {
  return request({
    url: '/sysEmpInfo/empInfo/downLoadFile',
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

// 图片
export function downImageFile(query) {
  return request({
    url: '/sysEmpInfo/empInfo/imageFile',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}


