<template lang="pug">
span.v-audio--base.mgr2.ai-center(v-if="src")
  span(v-if="name") {{name}}
  span.audio--btn.mgl2
    i.el-icon-video-play.paly-btn(@click='play' v-if="!isPlay")
    i.el-icon-video-pause.paly-btn(@click='play' v-else)
    audio(autoplay ref='audio' loop)
</template>

<script>
export default {
  name: 'VAudio',
  props: {
    name: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isPlay: false,
    }
  },
  methods: {
    play () {
      if (this.isPlay) {
        this.$refs.audio.src = ''
        this.isPlay = false
      } else {
        this.isPlay = true
        this.$refs.audio.src = this.src
      }
    },
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
.v-audio--base
  vertical-align bottom
  .audio--btn
    margin-right 10px
    font-size 26px
    cursor pointer
    &:hover
      color $theme
</style>
