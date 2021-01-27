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

  // 3.创建用户
  addUser: (model) => http('post', 'api/user/', {
    loading: true,
    data: {
      realName: model.realName,
      phoneNumber: model.phoneNumber,
      account: model.account,
      departmentId: model.departmentId,
      job: model.job,
      userRoles: model.userRoles,
      hiredate: model.hiredate,
      remark: model.remark,
      jobNumber: model.jobNumber,
      workingStatus: model.workingStatus,
      manageDepartmentId: model.manageDepartmentId,
    },
  }),

  // 4.获取单个用户信息
  getUserInfoById: (id) => http('get', `api/user/${id}`),

  // 4.5获取所有用户信息
  getAllUser: () => http('get', 'api/user/all'),

  // 4.6 获取B岗用户信息
  getBJobs: () => http('get', 'api/user/b'),

  // 4.7 获取C岗用户信息
  getCJobs: () => http('get', 'api/user/c'),

  // 4.7.5 获取A岗用户信息
  getAJobsUserList: () => http('get', 'api/user/a'),

  // 4.8 根据部门ID获取用户信息
  getDepartMembers: (departmentId, Resigned = true) => http('get', `api/user/department/${departmentId}?Resigned=${Resigned}`),

  // 4.9 根据用户ID修改用户信息
  updateUser: (model) => http('put', `api/user/${model.id}`, {
    data: {
      realName: model.realName,
      phoneNumber: model.phoneNumber,
      account: model.account,
      departmentId: model.departmentId,
      job: model.job,
      userRoles: model.userRoles,
      hiredate: model.hiredate,
      remark: model.remark,
      workingStatus: model.workingStatus,
      jobNumber: model.jobNumber,
      manageDepartmentId: model.manageDepartmentId,
      photo: model.photo,
    },
  }),

  // 4.10 根据用户ID锁定用户
  lockUser: (id) => http('post', `api/user/${id}/lock`, {
    params: {
      userId: id,
    },
  }),

  // 4.10.1 根据用户ID解锁用户
  unlockUser: (id) => http('post', `api/user/${id}/unlock`, {
    params: {
      userId: id,
    },
  }),
  // 4.11 获取所有角色
  getRoles: () => http('get', 'api/role'),

  // 4.12 修改当前用户头像
  updateAvatar: (url) => http('post', 'api/user/photo?photoUrl=' + url),

  // 4.13 修改当前用户密码
  updatePswd: (model) => http('post', 'api/auth/changepwd', {
    data: {
      oldpassword: model.oldpswd,
      newpassword: model.passwordre,
    },
  }),
  // 5.获取所有部门
  getAllDeparts: () => http('get', '/api/department'),

  // 6.根据部门ID获取单个部门树形结构
  getDepartById: (id) => http('get', `/api/department/${id}`),

  // 7.创建部门
  addDepart: (model) => http('post', '/api/department/', {
    data: {
      name: model.name,
      userId: model.userId,
      superiorDepartmentId: model.superiorDepartmentId,
      isAjobDepartment: model.isAjobDepartment,
    },
  }),
  // 7.1.修改部门
  updateDepart: (model) => http('put', `/api/department/${model.departmentId}`, {
    data: {
      name: model.name,
      userId: model.userId,
      isAjobDepartment: model.isAjobDepartment,
      superiorDepartmentId: model.superiorDepartmentId,
    },
  }),

  // 7.2.删除部门
  delDepart: (id) => http('delete', `/api/department/${id}`),

  // 8.获取A岗部门集合
  getAJobs: () => http('get', '/api/department/ajob'),

  // 9.获取业务配置分页信息
  getBizConfig: (model) => http('get', '/api/bizconfig', {
    loading: true,
    params: (() => {
      if (model.startTime === '' || model.endTime === '') {
        delete model.startTime
        delete model.endTime
      }
      return model
    })(),
  }),

  // 10.通过业务配置Id查询单个业务配置
  getBizCfgById: (bizId) => http('get', `/api/bizconfig/${bizId}`),

  // 11.创建业务配置
  addBizCfg: (model) => http('post', '/api/bizconfig/', {
    data: {
      startTime: model.startTime,
      endTime: model.endTime,
      departmentId: model.departmentId,
      departmentName: model.departmentName,
      bUserId: model.bUserId,
      bUserName: model.bUserName,
      cUserId: model.cUserId,
      cUserName: model.cUserName,
    },
  }),

  // 12.根据业务配置Id删除业务配置
  delBizCfg: (bizId) => http('delete', `/api/bizconfig/${bizId}`),

  // 13.根据业务配置Id和实体全更新
  updateCfgByIf: (model) => http('put', `/api/bizconfig/${model.id}`, {
    data: {
      id: model.id,
      startTime: model.startTime,
      endTime: model.endTime,
      departmentId: model.departmentId,
      departmentName: model.departmentName,
      bUserId: model.bUserId,
      bUserName: model.bUserName,
      cUserId: model.cUserId,
      cUserName: model.cUserName,
    },
  }),
  // 14.查询所有等级（不分页）
  getAllLevel: () => http('get', '/api/level/'),

  // 14.5.查询我的等级和下一等级信息
  getMyLevel: () => http('get', '/api/level/my'),

  // 14.6.查询我的等级配置信息
  getMyLevInfo: () => http('get', '/api/level/config'),

  // 15.查询单个等级
  getLevelById: (levId) => http('get', `/api/level/${levId}`),

  // 16.创建等级
  addLevel: (model) => http('post', '/api/level/', {
    data: {
      level: model.level,
      experience: model.experience,
      basicSalary: model.basicSalary,
      commission: model.commission,
      ajobAndroidExp: model.ajobAndroidExp,
      ajobIOSExp: model.ajobIOSExp,
      bjobAndroidExp: model.bjobAndroidExp,
      bjobIOSExp: model.bjobIOSExp,
      ajobRechargeExp: model.ajobRechargeExp,
      bjobRechargeExp: model.bjobRechargeExp,
      cjobRechargeExp: model.cjobRechargeExp,
      ajobRechargeExpAfter: model.ajobRechargeExpAfter,
      bjobRechargeExpAfter: model.bjobRechargeExpAfter,
      cjobRechargeExpAfter: model.cjobRechargeExpAfter,
    },
  }),

  // 17.根据ID删除等级
  delLevelById: (levId) => http('delete', `/api/level/${levId}`),

  // 18.根据ID和实体更新等级
  updateLevById: (model) => http('put', `/api/level/${model.id}`, {
    data: {
      level: model.level,
      experience: model.experience,
      basicSalary: model.basicSalary,
      commission: model.commission,
      ajobAndroidExp: model.ajobAndroidExp,
      ajobIOSExp: model.ajobIOSExp,
      bjobAndroidExp: model.bjobAndroidExp,
      bjobIOSExp: model.bjobIOSExp,
      ajobRechargeExp: model.ajobRechargeExp,
      bjobRechargeExp: model.bjobRechargeExp,
      cjobRechargeExp: model.cjobRechargeExp,
      ajobRechargeExpAfter: model.ajobRechargeExpAfter,
      bjobRechargeExpAfter: model.bjobRechargeExpAfter,
      cjobRechargeExpAfter: model.cjobRechargeExpAfter,
    },
  }),
  // 19.获取游戏注册分页信息
  getPlayerList: (model) => http('get', '/api/player/info', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        Account: model.Account,
        CreateIp: model.CreateIp,
        DeviceNo: model.DeviceNo,
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 19.5 获取管理游戏注册分页信息
  getDptRegisterInfo: (model) => http('get', '/api/player/info/manage', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        Account: model.Account,
        CreateIp: model.CreateIp,
        DeviceNo: model.DeviceNo,
        userId: model.userId,
        resDepId: model.resDepId,
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 20.获取游戏订单分页信息
  getGameOrders: (model) => http('get', '/api/player/order', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        GameOrderID: model.GameOrderID,
        Account: model.Account,
        UserCode: model.UserCode,
        GameName: model.GameName,
        RoleName: model.RoleName,
        RoleCode: model.RoleCode,
        AreaName: model.AreaName,
        AreaCode: model.AreaCode,
        TotalPrice: model.TotalPrice,
        OSType: model.OSType,
        Page: model.page,
        PageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),

  // 20.1 获取游戏区服信息
  getAreaName: (areaname) => http('get', '/api/player/areaname', {
    params: {
      areaName: areaname,
    },
  }),
  // 20.2 获取游戏名称信息
  getGameName: (gameName) => http('get', '/api/player/gameName', {
    params: {
      gameName: gameName,
    },
  }),

  // 20.5 获取游戏订单分页信息
  getDptGameOrders: (model) => http('get', '/api/player/order/manage', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        GameOrderID: model.GameOrderID,
        Account: model.Account,
        GameName: model.GameName,
        RoleName: model.RoleName,
        AreaName: model.AreaName,
        AreaCode: model.AreaCode,
        userId: model.userId,
        resDepId: model.resDepId,
        TotalPrice: model.TotalPrice,
        OSType: model.OSType,
        Page: model.page,
        PageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 21.获取游戏角色分页信息
  getRoleInfos: (model) => http('get', '/api/player/role', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        Account: model.Account,
        UserCode: model.UserCode,
        GameName: model.GameName,
        RoleName: model.RoleName,
        AreaName: model.AreaName,
        Page: model.page,
        PageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 21.5 获取游戏角色分页信息
  getDptRoleInfos: (model) => http('get', '/api/player/role/manage', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserAccount: model.UserAccount,
        Account: model.Account,
        UserCode: model.UserCode,
        GameName: model.GameName,
        RoleName: model.RoleName,
        AreaName: model.AreaName,
        userId: model.userId,
        resDepId: model.resDepId,
        Page: model.page,
        PageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 22.获取充值玩家信息和订单统计分页数据
  getRechInfo: (model) => http('get', '/api/player/recharge', {
    loading: true,
    params: (() => {
      const p = {
        UserAccount: model.UserAccount,
        startTime: model.startTime,
        endTime: model.endTime,
        Account: model.Account,
        GameName: model.GameName,
        RoleName: model.RoleName,
        AreaName: model.AreaName,
        AreaCode: model.AreaCode,
        TotalPrice: model.TotalPrice,
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 23.获取充值玩家信息充值记录分页
  getDptRechInfo: (model) => http('get', 'api/player/recharge/manage', {
    loading: true,
    params: (() => {
      const p = {
        UserAccount: model.UserAccount,
        startTime: model.startTime,
        endTime: model.endTime,
        Account: model.Account,
        GameName: model.GameName,
        RoleName: model.RoleName,
        AreaName: model.AreaName,
        AreaCode: model.AreaCode,
        TotalPrice: model.TotalPrice,
        userId: model.userId,
        resDepId: model.resDepId,
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 24.获取我的业务的所有玩家订单分页数据（自动区分ABC岗）
  getAchiData: (model) => http('get', '/api/achievement', {
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      page: model.page,
      pageSize: model.pageSize,
    },
  }),

  // 25. 获取我本日的业务数据
  getAchiByDay: (model) => http('get', '/api/achievement/day', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
    },
  }),

  // 25.5 获取部门我的业务的当天数据
  getDptAchiByDay: (model) => http('get', '/api/achievement/day/manage', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      ResDepId: model.dtpId,
      UserId: model.UserId,
    },
  }),

  // 25.6 获取我的业务的昨天数据
  getAchiYesterday: (model) => http('get', 'api/achievement/yesterday', {
    params: {
      GameName: model.gameName, // | string |  否  | 游戏名称 |
      AreaName: model.areaName, // | string |  否  | 区服名称 |
    },
  }),

  // 25.7 获取部门管理我的业务的昨天数据
  getDptAchiYesterday: (model) => http('get', '/api/achievement/yesterday/manage', {
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      ResDepId: model.dtpId,
      UserId: model.UserId,
    },
  }),
  // 26.获取我本周的业务数据
  getAchiByWeek: (model) => http('get', '/api/achievement/week', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
    },
  }),

  // 26.5 获取我的业务的本周数据
  getDptAchiByWeek: (model) => http('get', '/api/achievement/week/manage', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      ResDepId: model.dtpId,
      UserId: model.UserId,
    },
  }),
  // 27.4 获取我的业务的上月数据
  getAchiLastMonth: (model) => http('get', '/api/achievement/lastmonth', {
    params: {
      GameName: model.GameName, // | string | 否 | 游戏名称 |
      AreaName: model.AreaName, // | string | 否 | 区服名称 |
    },
  }),
  // 27.5 获取部门管理我的业务的上月数据
  getDptAchiLastMonth: (model) => http('get', '/api/achievement/lastmonth/manage', {
    params: {
      GameName: model.GameName, // | string | 否 | 游戏名称 |
      AreaName: model.AreaName, // | string | 否 | 区服名称 |
      ResDepId: model.ResDepId, // | int | 否 | 查询部门ID |
      UserId: model.UserId, // | int | 否 | 查询用户ID |
    },
  }),
  // 27.获取我本月的业务数据
  getAchiByMonth: (model) => http('get', '/api/achievement/month', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
    },
  }),

  // 27.5 获取我的业务的本月数据
  getDptAchiByMonth: (model) => http('get', '/api/achievement/month/manage', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      ResDepId: model.dtpId,
      UserId: model.UserId,
    },
  }),
  // 27.6 获取我的业务的本年数据
  getAchiByYear: (model) => http('get', '/api/achievement/year', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
    },
  }),

  // 27.7 获取部门管理我的业务的本年数据
  getDptAchiByYear: (model) => http('get', '/api/achievement/year/manage', {
    loading: true,
    params: {
      gameName: model.gameName,
      areaName: model.areaName,
      ResDepId: model.dtpId,
      UserId: model.UserId,
    },
  }),

  // 27.8 获取我的业务的去年数据
  getAchiLastYear: (model) => http('get', '/api/achievement/lastyear', {
    params: {
      GameName: model.GameName, // | string | 否 | 游戏名称 |
      AreaName: model.AreaName, // | string | 否 | 区服名称 |
    },
  }),
  // 27.9 获取部门管理我的业务的去年数据
  getDptAchiLastYear: (model) => http('get', '/api/achievement/lastyear/manage', {
    params: {
      GameName: model.GameName, // | string | 否 | 游戏名称 |
      AreaName: model.AreaName, // | string | 否 | 区服名称 |
      ResDepId: model.ResDepId, // | int | 否 | 查询部门ID |
      UserId: model.UserId, // | int | 否 | 查询用户ID |
    },
  }),

  // 28.获取我的游戏接口
  getMyGames: () => http('get', '/api/mygame/'),

  // 28.1.根据部门id获取游戏接口
  getGameByDptId: (model) => http('get', `/api/mygame/department/${model.departmentId}`, {
    params: {
      departmentId: model.departmentId,
      Page: model.page,
      PageSize: model.pageSize,
    },
  }),

  // 29.根据游戏表ID获取游戏
  getGameById: (id) => http('get', `/api/mygame/${id}`),

  // 30.创建游戏表
  addGame: (model) => http('post', '/api/mygame/', {
    data: {
      gameContentId: model.gameContentId, // 游戏名称
      userId: model.userId, // 推广人员
      linkUrl: model.linkUrl, // 推广链接
    },
  }),

  // 31.根据游戏ID表删除游戏表
  delGameById: (id) => http('delete', `/api/mygame/${id}`),

  // 31.5.获取游戏目录表
  getGameCtx: () => http('get', '/api/mygame/gamecontext'),

  // 32.获取今天排行接口
  getRankToday: (model) => http('get', '/api/rank/today', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 33.获取昨天排行接口
  getRankYesterday: (model) => http('get', '/api/rank/yesterday', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 33.获取本周排行接口
  getRankWeek: (model) => http('get', '/api/rank/week', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 34.获取上周排行接口
  getRankLastweek: (model) => http('get', '/api/rank/lastweek', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 35.获取本月排行接口
  getRankMonth: (model) => http('get', '/api/rank/month', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 36.获取上月排行接口
  getRankLastMonth: (model) => http('get', '/api/rank/lastmonth', {
    params: {
      areaName: model.areaName,
    },
  }),

  // 37.获取前10大于100订单接口
  getTop10: () => http('get', 'api/player/top10'),

  // 38. 图片上传通用接口（不启用权限认证）
  // 39.获取公告接口
  getNotices: () => http('get', 'api/notice/'),
  // 40.获取经验值明细分页接口
  getDptExpList: (model) => http('get', '/api/experience/', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        UserId: Number(model.UserId),
        Origin: model.Origin,
        ExpChange: Number(model.ExpChange),
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 40. 5 获取个人经验值明细分页接口
  getMyExp: (model) => http('get', '/api/experience/user', {
    loading: true,
    params: (() => {
      const p = {
        startTime: model.startTime,
        endTime: model.endTime,
        Origin: model.Origin,
        ExpChange: model.ExpChange,
        page: model.page,
        pageSize: model.pageSize,
      }
      utils.filterNull(p)
      return p
    })(),
  }),
  // 41.获取单个经验值明细接口
  getExpById: (expId) => http('get', `/api/experience/${expId}`),

  // 42.创建经验值明细接口
  createExp: (model) => http('post', '/api/experience/', {
    loading: true,
    data: {
      userId: model.userId,
      expChange: model.expChange,
      origin: model.origin,
      remark: model.remark,
      effectiveDate: model.effectiveDate,
    },
  }),

  // 43.删除经验值明细接口
  delExpById: (expId) => http('delete', `/api/experience/${expId}`),

  // 44.玩家换绑记录分页接口
  getBindChangeList: (model) => http('get', '/api/playerswitch/', {
    loading: true,
    params: {
      UserAccount: model.UserAccount,
      Page: model.Page,
      PageSize: model.PageSize,
    },
  }),
  // 45 根据Id玩家换绑记录接口
  getBCRecById: (id) => http('get', `/api/playerswitch/${id}`),
  // 46.按玩家账号模糊查询相关abc岗人员Id信息
  getOriginBind: (useraccount) => http('get', `/api/playerswitch/useraccount/${useraccount}`),
  // 47.创建玩家换绑记录接口
  switchBind: (model) => http('post', '/api/playerswitch/', {
    data: {
      userAccount: model.userAccount,
      aJobId: model.aJobId,
      aJob: model.aJob,
      bJobId: model.bJobId,
      bJob: model.bJob,
      cJobId: model.cJobId,
      cJob: model.cJob,
      aJobIdAfter: model.aJobIdAfter,
      bJobIdAfter: model.bJobIdAfter,
      cJobIdAfter: model.cJobIdAfter,
    },
  }),
  // 48.删除玩家换绑记录接口
  delBindRec: (id) => http('delete', `/api/playerswitch/${id}`),
  // 49.在职员工通讯录分页接口
  getContacts: (model) => http('get', '/api/contacts/', {
    params: {
      RealName: model.RealName, // | string |  否  | 员工姓名 |
      Page: model.Page, // | string |  否  | 页码默认为1 |
      PageSize: model.PageSize, // | string |  否  | 页数大小默认为5最大为20 |
    },
  }),
  // 50.获取自己微信达标员工列表
  getMyWxAchievedList: (model) => http('get', '/api/quota', {
    params: (() => {
      const p = {
        startTime: model.startTime, // | string |  否  | 开始时间 |
        endTime: model.endTime, // | string |  否  | 结束时间 |
        Page: model.Page, // | string |  否  | 页码默认为1 |
        PageSize: model.PageSize, // | string |  否  | 页数大小默认为5最大为20 |
      }
      utils.filterNull(p)
      return p
    })(),

  }),

  // 51.获取全部微信达标员工列表(管理员或者B岗人员)
  getAllWxAchievedList: (model) => http('get', '/api/quota/manage', {
    params: (() => {
      const p = {
        userId: model.userId, // | int |  否  | 查询员工Id |
        startTime: model.startTime, // | string |  否  | 开始时间 |
        endTime: model.endTime, // | string |  否  | 结束时间 |
        Page: model.Page, // | string |  否  | 页码默认为1 |
        PageSize: model.PageSize, // | string |  否  | 页数大小默认为5最大为20 |
      }
      utils.filterNull(p)
      return p
    })(),
  }),

  // 52.创建微信达标记录接口
  createWxAchievRec: (model) => http('post', '/api/quota/', {
    data: {
      userId: model.userId, //
      receivedPeople: model.receivedPeople, //
      joinPeople: model.joinPeople, //
    },
  }),

  // 53.更新微信达标记录接口
  updateWxAchievRec: (model) => http('put', `/api/quota/${model.id}`, {
    data: {
      receivedPeople: model.receivedPeople, //
      joinPeople: model.joinPeople, //
    },
  }),

  // 54.删除微信达标记录接口
  deleteWxAchievRec: (quotaId) => http('delete', `/api/quota/${quotaId}`, {
    params: {
      quotaId: quotaId,
    },
  }),

  // 55.获取微信达标配置
  getAchievTarget: () => http('get', '/api/quota/config'),

  // 56.获取运营商列表 (不分页)
  getOperators: () => http('get', '/api/channel/operator/'),

  // 57.获取游戏类型列表(不分页)
  getGameType: () => http('get', '/api/channel/gametype/'),

  // 58.获取游戏渠道列表
  getGameChannel: (model) => http('get', '/api/channel/', {
    params: {
      GameName: model.GameName, // | string | 否 | 游戏名称 |
      Operator: model.Operator, // | string | 否 | 运营商 |
      GameType: model.GameType, // | string | 否 | 游戏类型 |
      Page: model.Page, // | string | 否 | 页码默认为1 |
      PageSize: model.PageSize, // | string | 否 | 页数大小默认为5最大为20 |
    },
  }),
  // 59.创建游戏渠道
  createChannel: (model) => http('post', '/api/channel/', {
    data: {
      gameName: model.gameName, // "string",
      equipmentType: model.equipmentType, // 0,
      operator: model.operator, // "string",
      gameType: model.gameType, // "string",
      downloadUrl: model.downloadUrl, // "string",
      gamePicUrl: model.gamePicUrl, // "string",
      remark: model.remark, // "string",
      juntoChatLevel: model.juntoChatLevel, // "string",
      privateChatLevel: model.privateChatLevel, // "string",
      worldChatLevel: model.worldChatLevel, // "string",
      ceateJuntoLevel: model.ceateJuntoLevel, // "string",
      ceateJuntoCost: model.ceateJuntoCost, // "string",
      isInviteJunto: model.isInviteJunto, // true,
      isPostInviteJunto: model.isPostInviteJunto, // true
    },
  }),

  // 60.删除游戏渠道
  deleteChannel: (gameChannelId) => http('delete', `/api/channel/${gameChannelId}`),

  // 61.更新游戏渠道
  updateChannel: (model) => http('put', `/api/channel/${model.gameChannelId}`, {
    data: {
      gameName: model.gameName, // "测试121231212",
      equipmentType: model.equipmentType, // 0,
      operator: model.operator, // "string11",
      gameType: model.gameType, // "string11",
      downloadUrl: model.downloadUrl, // "string1",
      gamePicUrl: model.gamePicUrl, // "string1",
      remark: model.remark, // "string1",
      juntoChatLevel: model.juntoChatLevel, // "string",
      privateChatLevel: model.privateChatLevel, // "string",
      worldChatLevel: model.worldChatLevel, // "string",
      ceateJuntoLevel: model.ceateJuntoLevel, // "string",
      ceateJuntoCost: model.ceateJuntoCost, // "string",
      isInviteJunto: model.isInviteJunto, // true,
      isPostInviteJunto: model.isPostInviteJunto, // true
    },
  }),
}
