import request from '@/utils/request'

// 查询列表
export function getFormList(query) {
  return request({
    url: '/kylin/formData/list',
    method: 'get',
    params: query
  })
}

// 查询列表-工作台
export function findList(query) {
  return request({
    url: '/kylin/formData/findList',
    method: 'get',
    params: query
  })
}

// 新增表单
export function saveForm(data) {
  return request({
    url: '/kylin/formData',
    method: 'post',
    data: data
  })
}

// 修改表单
export function updateForm(data) {
  return request({
    url: '/kylin/formData',
    method: 'put',
    data: data
  })
}

// 删除表单
export function deleteById(data) {
  return request({
    url: '/kylin/formData/'+data,
    method: 'delete'
  })
}
