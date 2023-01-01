import request from '@/utils/request'
import store from '@/store'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/dictType/' + dictType,
    method: 'get'
  })
}

// 缓存数据字典-DEMO
export function getDictsCatch(dictType) {
  const jsonparseVuex = JSON.parse(sessionStorage.getItem('vuex'))
  const dictArr = jsonparseVuex.dictTypeCatch
  const filtDict = dictArr.filter(item => dictType === item.type)
  return new Promise(resolve => {
    if (filtDict.length === 0) {
      request({
        url: '/system/dict/data/dictType/' + dictType,
        method: 'get'
      }).then(res => {
        if (res.code === 200) {
          questData = res
          store.dispatch('dict/changeDictType', {
            typename: dictType,
            typedata: res.data
          })
          let questData = {
            type: dictType,
            data: res.data
          }
          resolve(questData)
        }
      })
    } else {
      resolve(filtDict[0])
    }
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}