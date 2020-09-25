import { http, uploadApi } from './http'
import utils from '@/plugins/utils'
const {
  // CLOUD_APP_API,
  API,
  // CLOUD_FILE_API,
} = window.$globalconfig

export default {
  uploadApi,
  // 获取区域列表客户端根据版本号获取数据
  getRegions: () => http('get', 'api/common/regions?version=1'),

  // 用户--获取用户信息
  getUserInfo: () => http('get', 'api/user/'),

  // 获取二维码
  getQrcodeUrl: (url, iconUrl = '') => `${API}content/qrcode?data=${encodeURIComponent(url)}&icon_url=${iconUrl}&token=${utils.getToken()}`,

  // 用户--获取用户信息
  updateUserInfo: (model) => http('put', 'api/company/account', {
    data: {
      avatar: model.avatar, // "", //直接保存头像上传返回的file_url
      nickname: model.nickname, // "test",
      province_id: model.province_id, // 0, //省份id
      city_id: model.city_id, // 0, //城市id
      area_id: model.area_id, // 0, //区域id
      longitude: model.longitude, // 0, //经度
      latitude: model.latitude, // 0, //纬度
      address: model.address, // "", //详细地址，最大 250个字符串
      description: model.description, // "", //公司简介，最大1000个字符串
    },
  }),

  // 用户-- 获取当前用户可用套餐列表
  getUserPackages: () => http('get', 'api/company/packages'),

  // 6. 账户日志分页列表（GetBankLogPagedListAsync）
  getUserBankCount: (model) => http('get', `api/company/banklogs/${model.page}/${model.pageSize}`, {
    params: {
      startdate: model.startdate, // | String |  开始日期(yyyy-MM-dd)
      enddate: model.enddate, // | String |  结束日期(yyyy-MM-dd)
      orderBy: model.orderBy, // | String |
    },
  }),

  // 行走漫游相关接口

  // **登录接口地址:https://editor.vgoyun.com/user/login**
  // **接口地址（APP_URL）：http://122.9.89.59:4000/**
  // **配置信息js地址:http://122.9.89.59:4000/Config/config.js**

  // **获取登录接口的token需要放在headers中，eg："Authorization: {token}"**

  // 2. 查询项目接口
  getRoamProjectList: (model) => http('get', 'api/projects', {
    params: {
      mainCategory: model.mainCategory, // string |  否  | 类别 |
      searchQuery: model.searchQuery, // string |  否  | 搜索 |
      page: model.page,
      pageSize: model.pageSize,
    },
  }),

  // 3. 查询指定项目接口
  getRoamProjectDetail: (projectId) => http('get', `api/projects/${projectId}`),

  // 4. 创建项目接口
  roamProjectModel: (model) => http('id' in model ? 'put' : 'post', `api/projects/${model.id}`, {
    data: model,
    // data: {
    //   id: model.id,
    //   name: model.name, // "string",
    //   description: model.description, // "string",
    //   mainCategory: model.mainCategory, // "string",
    //   scenes: model.scenes, // [ { "name": "string" } ]
    // },
  }),

  // 6. 删除项目接口
  delRoamProject: (projectId) => http('delete', `api/projects/${projectId}`),

  // 7. 查询区域接口
  getRoamProjectAreaList: (projectId) => http('get', `api/projects/${projectId}/scenes`),

  // 8. 查询指定区域接口
  getRoamProjectArea: (projectId, senceId) => http('get', `api/projects/${projectId}/scenes/${senceId}`),

  // 9. 创建区域接口
  createRoamProjectArea: (model) => http('post', `api/projects/${model.projectId}/scenes`, {
    data: { name: model.name },
  }),

  // 10. 更新区域接口
  updateRoamProjectArea: (model) => http('put', `api/projects/${model.projectId}/scenes/${model.senceId}`, {
    data: { name: model.name },
  }),

  // 11. 删除区域接口
  delRoamProjectArea: (model) => http('delete', `api/projects/${model.projectId}/scenes/${model.senceId}`),

  // 12. 查询全景图接口
  getRoamProjectPanoInfo: (sceneId) => http('get', `api/scene/${sceneId}/pano`),

  // 13. 查询指定全景图接口
  getRoamProjectPanoImageInfo: (model) => http('get', `api/scene/${model.sceneId}/pano/${model.imageId}`),

  // 14. 创建全景图接口
  createRoamProjectPano: (model) => http('post', `api/scene/${model.sceneId}/pano`, {
    data: {
      x: model.x, // 0,
      z: model.z, // 0,
      angle: model.angle, // 0,
      imgUrl: model.imgUrl, // "string",
      isMain: model.isMain, // true
    },
  }),

  // 15 获取项目标签列表
  getProjectTagList: () => http('get', 'api/tag'),

  // 获取离线任务列表
  getOfflineTaskList: () => http('get', 'api/offline'),

  // 产生离线包
  generateOfflinePackage: (id, isRebuild) => http('post', `api/offline${isRebuild ? '/rebuild' : ''}/${id}`),

  // 注册
  userRegister: model => http('post', 'api/auth/register', {
    data: model,
    token: false,
  }),

  // 登录
  userLogin: model => http('post', 'api/auth/login', {
    data: model,
    token: false,
  }),

  // 5.获取所有部门
  getAllDeparts: () => http('get', '/api/department'),

  // 6.根据部门ID获取单个部门树形结构
  getDepartById: (id) => http('get', `/api/department/${id}`),

  // 7.创建部门
  addDepart: (model) => http('post', '/api/department/', {
    params: {
      name: model.name,
      userId: model.userId,
      superiorDepartmentId: model.superiorDepartmentId,
      IsAjobDepartment: model.IsAjobDepartment,
    },
  }),
  // 8.获取A岗部门集合
  getAJobs: () => http('get', '/api/department/ajob'),

}
