import utils from '@/plugins/utils'
import api from '@/api/'
import router from '@/router'

export default {
  state: {
    panoInfo: {},
    userInfo: {}, // 用户信息 和 关联全景的信息(收藏/点赞...)
    // App运行流程完成状态
    appProcess: { // {promise, resolve}
      load: utils.getPromise(), // 加载动画
      startFile: utils.getPromise(), // 开场提示视频/图片
    },
    // App全局状态
    appStatus: {
      toolbarShow: true, // 是否显示侧菜单
      sceneShow: true, // 是否显示场景列表
      minimap: true, // 是否显示小地图
      isUserCtrl: true, // 用户是否在操作 (不切换场景)
      gyro: false, // 是否开启陀螺仪
      guide: false, // 一键导览
      screenSync: false, // 同屏互动
      pureMode: false, // logo 区域 作者/浏览量/logo/ 天气 等是否显示
    },
    wxShareData: {
      title: '',
      desc: '',
      link: '',
      imgUrl: '',
      success (res) { console.info('share:success:', res, this) },
      cancel (res) { console.info('share:cancel:', res, this) },
    },
  },
  getters: {
    panoInfo: state => state.panoInfo,
    wxShareData: state => state.wxShareData,
    userInfo: state => state.userInfo,
    appProcess: state => state.appProcess,
    appStatus: state => state.appStatus,
    curSceneGroup: state =>
      state.panoInfo.group_scene_list.find(item => item.active),
    curScene: state =>
      state.panoInfo.group_scene_list.find(item => item.active)
        .scene_list.find(item => item.active),
  },
  actions: {
    getPanoInfo ({ commit }) {
      return api.getPanoInfo().then(data => {
        if (!data.error_code) {
          // 设置当前场景组/场景
          let { scene_id } = router.currentRoute.query
          scene_id = scene_id || data.group_scene_list[0].scene_list[0].id
          data.group_scene_list = data.group_scene_list.filter(item => item.scene_list.length)
          let isTrueId = false
          data.group_scene_list.map((gItem) => {
            let flag = false
            gItem.scene_list.map((item) => {
              item.active = +item.id === +scene_id
              if (!flag) flag = item.active
            })
            if (!isTrueId) isTrueId = flag
            gItem.active = flag
          })
          // query scene_id 不存在
          if (!isTrueId) {
            data.group_scene_list[0].active = true
            data.group_scene_list[0].scene_list[0].active = true
          }
        }
        document.title = data.name
        // body 加class
        commit('savePanoInfo', data)
      })
    },

    // 获取用户关联全景的信息(收藏/点赞...)
    getUserPanoInfo ({ commit }) {
      return api.getUserPanoInfo().then(data => {
        commit('saveUserInfo', data)
      })
    },

    // 切场景分组
    switchSceneGroup ({ state }, id) {
      state.panoInfo.group_scene_list.map((gItem) => {
        gItem.active = id === gItem.id
        gItem.scene_list.map((item, idx) => {
          item.active = id === gItem.id && !idx
        })
      })
    },

    // 切场景
    switchScene ({ state }, id) {
      state.panoInfo.group_scene_list.map((gItem) => {
        let gActive = false
        gItem.scene_list.map((item) => {
          if (item.id === id) gActive = true
          item.active = item.id === id
        })
        gItem.active = gActive
      })
    },

    // 微信jssdk
    async wxJSSDKInit ({ state, commit }, readyCallback) {
      const data = await api.getWxJssdkConfig()
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名
        jsApiList: [ // 必填，需要使用的JS接口列表
          'openLocation',
          'getLocation',
          'showOptionMenu',
          'updateTimelineShareData',
          'updateAppMessageShareData',
        ],
      })
      const { wxShareData, panoInfo } = state
      wxShareData.title = panoInfo.share_title || panoInfo.name
      wxShareData.desc = panoInfo.share_content || ''
      wxShareData.link = location.href
      wxShareData.imgUrl = panoInfo.share_image_url || panoInfo.full_cover_image_url
      router.afterEach((to, from) => {
        setTimeout(() => {
          commit('wxShareData', {
            link: location.href,
            desc: panoInfo.share_content || '',
          })
        }, 100)
      })
      wx.ready(() => { // 需在用户可能点击分享按钮前就先调用
        readyCallback()
        wx.showOptionMenu() // 显示... 菜单
        wx.updateAppMessageShareData(wxShareData)
        wx.updateTimelineShareData(wxShareData)
      })
      wx.error((res) => {
        console.info('wwxjssdk:err:', res)
      })
    },
  },
  mutations: {
    savePanoInfo (state, data) {
      state.panoInfo = data
    },
    wxShareData (state, data) {
      state.wxShareData = Object.assign({}, state.wxShareData, data)
      wx.updateAppMessageShareData(state.wxShareData)
      wx.updateTimelineShareData(state.wxShareData)
    },
    saveUserInfo (state, data) {
      state.userInfo = Object.assign({}, state.userInfo, data)
    },
  },
}
