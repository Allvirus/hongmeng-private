<template lang='pug'>
.top-bar.h50.jc-between
  .logo.ai-center.pd1
    img.h100p(src='../../assets/img/logo.png')

  MenuList

  .advnce-options.ai-center.mgr2
    el-dropdown()
      el-button(type="success" @click='$WD.open(panoInfo.preview_url)') 预览 | 发布
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu(slot="dropdown")
        img.w100.mg1(:src='shareUrl')

    el-button.mgl1(@click='' type='danger') 作品设置

</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Topbar',
  components: {
    MenuList: _ => import('./MenuList'),
  },
  data () {
    return {
      shareUrl: '',
    }
  },
  computed: {
    ...mapGetters(['panoInfo']),
  },
  async created () {
    this.shareUrl = await this.$utils.getQrcodeUrl(this.panoInfo.preview_url)
  },
}
</script>
<style lang='stylus' scoped>
.top-bar
  position fixed
  top 0
  left 0
  width 100%
  bar-bg()
</style>
