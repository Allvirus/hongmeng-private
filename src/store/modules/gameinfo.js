import api from '@/api/'
export default {
  state: {
    areaList: [],
    gameList: [],
  },
  getters: {
    areaList: state => state.areaList,
    gameList: state => state.gameList,
  },
  actions: {
    // 获取区服列表
    getAreaList ({ commit, state }) {
      return api.getAreaName().then(data => {
        commit('areaList', data)
      })
    },
    // 获取游戏名称列表
    getGameList ({ commit, state }) {
      return api.getGameName().then(data => {
        commit('gameList', data)
      })
    },

  },
  mutations: {
    areaList (state, data) {
      for (const areaName of data) {
        const item = {
          value: areaName,
        }
        state.areaList.push(item)
      }
    },
    gameList (state, data) {
      for (const gameName of data) {
        const item = {
          value: gameName,
        }
        state.gameList.push(item)
      }
    },
  },
}
