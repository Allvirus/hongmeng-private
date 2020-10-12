import Vue from 'vue'
import Vuex from 'vuex'

const _importSync = file => require(`./modules/${file}`).default

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    app: _importSync('app'),
    gameinfo: _importSync('gameinfo'),
  },
})
