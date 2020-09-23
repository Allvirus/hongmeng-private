<template lang="pug">
#pano.h100p(
  @mousedown='handleDown'
  @mouseup='handleUp')
</template>

<script>
import { mapGetters } from 'vuex'
const { $globalconfig, embedpano } = window

let isFirstLoad = true
export default {
  name: 'Pano',
  data () {
    this.waitLoadPano = this.$utils.getPromise() // 全景加载promise {promise, resolve}
    this.isMove = false // 是否控制全景
    return {
    }
  },
  computed: {
    ...mapGetters(['curScene', 'curSceneGroup', 'panoInfo', 'audioCanPlay', 'appProcess', 'appStatus']),
  },
  watch: {
    curScene: {
      async handler (scene) {
        this.appStatus.isUserCtrl = false

        // 首次加载
        if (isFirstLoad) {
          // 首次加载场景初始化需等待全景嵌入完成
          await this.waitLoadPano.promise
          // 自动旋转
        } else { // 首场景 在嵌入时已经加载
          this.$krp.loadScene(scene.id)
        }

        // 获取热点
        this.$store.dispatch('getPanoSceneHotspot', scene.id).then(() => {
          this.$krp.loadHotspot()
        })

        // 下雪等效果
        this.$krp.setSnowEffect(scene.background_effect_type)

        // 补地图片
        this.$krp.setBottomPic(scene.bottom_image_url)

        isFirstLoad = false
      },
      immediate: true,
    },
  },
  mounted () {
    this.initPano()
  },
  methods: {
    initPano () {
      embedpano({
        xml: $globalconfig.CLOUD_APP_API + 'panorama/' + this.$route.params.panoId + '/tourxml?r=edit',
        target: 'pano',
        html5: 'only',
        mobilescale: 1.0,
        passQueryParameters: true,
        onready: this.krpanoReady,
      })
    },
    krpanoReady (krp) {
      // 场景加载成功
      const timer = setInterval(() => {
        if (krp.get('scene').count) {
          clearInterval(timer)
          this.$krp.initFirstScnene(krp)
          this.waitLoadPano.resolve() // set pano loaded
        }
      }, 100)
    },
    // 全景旋转事件发出
    handleMove () {
      this.$vgo.$emit('panoRotate', this.$krp.getView('hlookat'))
    },
    handleDown () {
      this.isMove = true
      // 关闭所有活动菜单 天气详情/toolbar more 等
      this.$vgo.$emit('closeAllActiveMenu')
      this.$el.addEventListener('mousemove', this.handleMove)
      this.$el.addEventListener('touchmove', this.handleMove)
    },
    handleUp () {
      this.isMove = false
      this.$el.removeEventListener('mousemove', this.handleMove)
      this.$el.removeEventListener('touchmove', this.handleMove)
    },
  },
}
</script>
<style lang="stylus">
#pano
  flex 1
  #krpanoSWFObject
    z-index 0
  *
    box-sizing content-box
</style>
