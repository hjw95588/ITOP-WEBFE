import request from '@/utils/request'
// 查询待办任务列表
export function getTaskList(query) {
  return request({
    //url: '/center/taskTodo/list',
    url: '/kylin/taskTodo/list', //2022年4月20日17:12:20 筛选出 “角色”
    method: 'get',
    params: query
  })
}

// 撤回任务
export function revoTaskReq (data) {
  return request({
    url: '/kylin/taskTodo/revokeTask',
    method: 'post',
    data
  })
}

// 查询历史操作列表
export function getHistoryList(query) {
  return request({
    url: '/center/getHistory',
    method: 'get',
    params: query
  })
}

// 查询流程图
export function getChart(query) {
  return request({
    url: '/kylin/taskTodo/chart',
    method: 'get',
    params: query
  })
}

// 保存审批记录---对应保存
export function saveApproval(data) {
  return request({
    url: '/kylin/taskTodo/saveApproval',
    method: 'post',
    data
  })
}
// 保存审批记录---对应转派
export function assigneeSet(data) {
  return request({
    url: '/kylin/taskTodo/setAssignee',
    method: 'post',
    data
  })
}

// 完成代办任务---对应提交
export function submitTaskForm(data, vm) {
  return request({
    url: '/kylin/taskTodo/completeTask',
    method: 'post',
    data,
    cancelToken: new request.cancelToken(c => {
      vm.cancelSubTask = c
    })
  })
}

// 查询业务表单数据
export function getBaseForm(url,processInstanceId) {
  return request({
    url: url + processInstanceId,
    method: 'get'
  })
}

// 保存业务表单数据
export function saveBaseForm(url,data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 查询节点处理记录
export function getNodeAssignee(query) {
  return request({
    url: '/kylin/taskTodo/assignee',
    method: 'get',
    params: query
  })
}


// 根据流程实例ID查询流程图
export function getChartByInst(query) {
  return request({
    url: '/kylin/taskTodo/chart/inst',
    method: 'get',
    params: query
  })
}

//根据流程实例ID获取流程名称
export function getFlowNameByInst(query) {
  return request({
    url: '/center/getFlowName',
    method: 'get',
    params: query
  })
}
