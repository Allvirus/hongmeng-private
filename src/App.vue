<template lang='pug'>
#app
  router-view
</template>

<script>
export default {
  name: 'App',
  computed: {
  },
  created () {
    // 开发环境获取token
    if (process.env.NODE_ENV !== 'production') {
      const url = window.location.href
      if (url.includes('access_token')) {
        const arrTemp = url.split('?')
        // const arr = arrTemp[arrTemp.length - 1].split('&')
        this.$utils.setCookie($globalconfig.COOKIE_NAME, arrTemp[1], { exHours: 2 })
        window.location.href = url.split('?')[0]
      }
    }
    // if (window.location.href.includes('test_token=')) {
    //   const url = window.location.href
    //   const arr = url.split('?')[1].split('&')
    //   this.$utils.setCookie(this.GLOBALCONFIG.COOKIE_NAME, arr[0].split('=')[1], { exHours: 1111 })
    // }
    // this.$store.dispatch('getOfficialAccountBindInfo')
  },
}
</script>

<style lang="stylus">
#app
  height 100%
  width 100%
  display flex
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
