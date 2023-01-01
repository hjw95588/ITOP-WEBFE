import request from '@/utils/request'
 // 查询父级文件目录
export function getDocReposiParent () {
  return request({
    url: '/kylin/docRepository/parentList',
    method: 'get'
  })
}

// 获取子目录
export function getDocReposiChild (query) {
  return request({
    url: 'kylin/docRepository/list/',
    method: 'get',
    params: query
  })
}

// 获取文件列表
export function getDocReposiList (query) {
  return request({
    url: '/doc/list',
    method: 'get',
    params: query
  })
}

// 文件统计
export function getFileStatics () {
  return request({
    url: '/doc/totalStatistics',
    method: 'get'
  })
}

// 文件预览
export function previewFile (fileId) {
  return request({
    url: `/common/filePreview/${fileId}`,
    method: 'get'
  })
}