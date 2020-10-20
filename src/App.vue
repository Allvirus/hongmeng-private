<template lang='pug'>
#app
  router-view
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters(['userInfo']),
  },
  created () {
    // 开发环境获取token
    this.$store.dispatch('checkOS')
    const query = this.$utils.getURLQuery()
    if (process.env.NODE_ENV !== 'production') {
      if (query.access_token) {
        this.$utils.setToken(query.access_token)
      }
    }
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
