import request from '@/utils/request'

// 上传附件
export function uploadFile(data) {
    return request({
      url: '/common/uploads',
      method: 'post',
      data: data
    })
  }

// 获取附件
export function getFileList(params) {
  return request({
    url: '/doc/list',
    method: 'get',
    params: params
  })
}
