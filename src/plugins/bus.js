import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import { Message, MessageBox, Loading, Notification } from 'element-ui'
let loadCount = 0
export default new Vue({
  data () {
    this.instanceObj = {}
    return {
    }
  },
  methods: {
    getInstance (path) {
      if (this.instanceObj[path]) return this.instanceObj[path]
      const el = document.createElement('div')
      document.body.querySelector('#app').appendChild(el)
      const ComponentConstructor = Vue.extend(require(`@/components/${path}`).default)
      this.instanceObj[path] = new ComponentConstructor({
        router,
        store,
      }).$mount(el)
      this.instanceObj[path].$vnode = this.instanceObj[path]._vnode
      return this.instanceObj[path]
    },
    tip (msg = '操作成功！', type = 'info', time = 2000, ctrl = true) {
      Message({
        message: msg,
        showClose: ctrl,
        duration: time,
        type: type,
        customClass: 'tip-message',
      })
    },
    throttle (cb, time) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        cb()
        clearTimeout(this.timer)
        this.timer = null
      }, time)
    },
    open (cb, text = '您是否确认当前操作? 是否继续?', opts = {}) {
      let { title = '警告', confirmText = '确定', cancelText = '取消', cancelCb = () => { }, autoClose = 0 } = opts
      clearInterval(this.timer2)
      MessageBox.confirm(text, title, {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        type: 'warning',
        beforeClose (action, instance, done) {
          instance.message = ''
          done()
        },
      }).then(cb).catch(cancelCb).finally(() => clearInterval(this.timer2))
      this.$nextTick(() => {
        if (autoClose) {
          const textDom = document.querySelector('.el-message-box .el-message-box__message p')
          textDom.innerHTML = `${text} ${autoClose / 1000}s后自动跳转`
          this.timer2 = setInterval(() => {
            autoClose -= 1000
            textDom.innerHTML = `${text} ${autoClose / 1000}s后自动跳转`
            if (autoClose <= 0) {
              clearInterval(this.timer2)
              cb()
              MessageBox.close()
            }
          }, 1000)
        }
      })
    },
    input (cb, text = '内容', opts = {}) {
      const { title = '提示', confirmText = '确定', regex = null, cancelText = '取消', cancelCb = () => { }, value = '', length = 0 } = opts
      MessageBox.prompt(`请输入${text}`, title, {
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        inputValue: String(value),
        inputPattern: regex,
        closeOnClickModal: false,
        inputValidator: val => {
          if (val === '') return `${text}不能为空!`
          if (length && val.length > length) return `长度不超过${length}字符!`
        },
        inputPlaceholder: '请输入',
      }).then(obj => cb(obj.value)).catch(cancelCb)
    },
    notify (message, type = 'warning', opts = {}) {
      const { position = 'top-left', title = '警告', duration = 0, center = false } = opts
      return Notification({
        title,
        type,
        position,
        duration,
        customClass: center ? 'el-notification-cneter' : '',
        message,
      })
    },
    openLoading (text = 'Loading', spinner = 'el-icon-loading', background = 'rgba(0, 0, 0, 0.5)') {
      loadCount++
      if (this.loading) return
      this.loading = Loading.service({
        lock: true,
        text,
        spinner,
        background,
      })
    },
    closeLoading () {
      loadCount--
      if (loadCount <= 0) {
        loadCount = 0
        this.loading && this.loading.close()
        this.loading = null
      }
    },
  },
})
