import fetch from '@/utils/request'
const qs = require('qs')

// 业务流
const ywlApi = {
  /* ******************* 名称列表 ******************* */
  tableList: '/table/list' // get
}

// 基础相关
const baseApi = {
}
// 用户相关
const partyApi = {
}
// 小二用户相关 权限等
const userApi = {
}

export default {
  fetch,
  qs,
  ywlApi,
  baseApi,
  partyApi,
  userApi
}
