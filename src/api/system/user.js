import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/king";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

// 用户注册
export function userRegiste (data) {
  return request({
    url: '/regist',
    method: 'post',
    data: data
  })
}
// 获取邮箱验证码
export function getEmailCode (data) {
  return request({
    url: '/captchaMailCode',
    method: 'post',
    data: data
  })
}
// 重置密码-验证码
export function forgetPwdCode (data) {
  return request({
    url: '/forgetPwdCaptchaMailCode',
    method: 'post',
    data: data
  })
}
// 重置密码提交
export function resetPwd (data) {
  return request({
    url: '/forgetPwd',
    method: 'post',
    data: data
  })
}
// 修改初始密码
export function updateIntPwd (data) {
  return request({
    url: '/updatePwdWhenInit',
    method: 'post',
    data: data
  })
}
// 恢复删除的用户
export function restore(data) {
  return request({
    url: '/system/user/restore',
    method: 'put',
    data: data
  })
}

//获取角色下拉
export function getRoles(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}