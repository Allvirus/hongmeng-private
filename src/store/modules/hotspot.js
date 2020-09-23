import vgo from '@/plugins/bus'
import api from '@/api/'
import { HOTSPOT } from '@/config'
const getModule = file => vgo.getInstance(`dialogs/${file}/index`)
let curHotspotAudioId
export default {
  state: {
    hotspotList: [],
  },
  getters: {
    hotspotList: state => state.hotspotList,
  },
  actions: {
    // 获取场景热点
    async getPanoSceneHotspot ({ commit }) {
      const data = await api.getPanoSceneHotspot()
      data.map(item => { item.options = JSON.parse(item.options) })
      commit('hotspotList', data)
    },

    // 视频开始
    beforePlayVideo ({ getters, commit }, builtInVideoHotspotId) {
      getters.appStatus.isUserCtrl = true
      commit('pauseAllAudio') // 暂停音乐
      this._vm.$krp.playBuiltInVideoById(builtInVideoHotspotId) // 暂停其他内嵌视频 播放id视频/ 无id全部暂停
    },

    // 视频结束
    afterPlayVideo ({ commit, getters }) {
      getters.appStatus.isUserCtrl = false
      commit('recoverAllAudio') // 恢复音乐
    },

    // 获取场景热点
    handleHotspotClick ({ commit, getters }, data) {
      const { options, type_id } = data
      switch (type_id) {
        case HOTSPOT.IMAGE_IN_ID: // 内置图片
          getModule('img-preview').open(options.file_url)
          break
        case HOTSPOT.ROAM_ID: // 漫游 切换场景
          this.dispatch('switchScene', options.scene_id)
          break
        case HOTSPOT.LINK_ID: // 链接
          if (options.is_open_window || options.url.indexOf('https') !== 0) {
            window.open(options.url)
          } else getModule('link').open(options.url)
          break
        case HOTSPOT.ARTICLE_ID: // 文章
          api.getPanoMaterialDetail(options.material_id).then(data => {
            getModule('article').open(data.name, data.contents)
          })
          break
        case HOTSPOT.AUDIO_ID: // 音乐
          if (curHotspotAudioId !== data.id) commit('setAudioAttr', { keyVal: { hotspot: options.file_url }, attr: 'src' })
          // 热点不是当前播放的热点 || 暂停状态 ? 播放 : 暂停
          commit('handleAudioPlay', { scene: false, hotspot: curHotspotAudioId !== data.id || !getters.audioStatus.hotspot })
          curHotspotAudioId = data.id
          break
        case HOTSPOT.IMAGE_ID: // 轮播图
          getModule('swipe').open(options.image_list.map(item => item.file_url))
          break
        case HOTSPOT.VIDEO_ID: // 视频
          getModule('video').open(options.file_url)
          break
        case HOTSPOT.THREE_ID: // 360环物
          getModule('hotspot-surround').open(options.material_id)
          break
      }
    },
  },
  mutations: {
    hotspotList (state, data) {
      state.hotspotList = data
    },
  },
}
