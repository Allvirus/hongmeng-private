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
    const { access_token, ...query } = this.$route.query
    if (access_token) {
      this.$utils.setToken(access_token)
      this.$router.replace({
        path: this.$route.path,
        query,
      }).catch(() => { })
    }
  },
}
</script>

<style lang="stylus">
#app {
  height: 100%;
  width: 100%;
  display: flex;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
