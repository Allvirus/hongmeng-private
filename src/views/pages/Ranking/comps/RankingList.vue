<template lang='pug'>
.rank.h650.ff-cn.pr.flex-1.mgx3(:class="OS.isPc?'':'mgt3'")
  .top-bg.pr
    img.pa.tbimg(:src='themeList[theme].tpbg')
    h2.pa.fc-w3 {{ mainTitle }}
    .sub-title.pa.fs-s
      span {{ subTitle }}
  .content.bg-white.pa.full.overflow-auto.pr
    .ff-rn.ai-center.pd1.pr(v-for='(item, index) in data', :key='index')
      img.badge(
        v-if='index < 3',
        :src='require(`@/assets/img/ic_rank${index + 1}.png`)',
        alt='altText'
      )
      span.badge.flex-center(v-else) {{ index + 1 }}
      img.avatar.mgl2(:src='defAvatar', alt='alt')
      span.mgl1 {{ item["account"] }}
      span.flex-1.jc-end.mgr3(v-if='toFixed') {{ item[rankingKey] | toFixed}}
      span.flex-1.jc-end.mgr3(v-else) {{ item[rankingKey]}}
    .flex-center(v-if='data.length === 0')
      span 暂无数据
  .footer.h50.full.pa(:style='{ backgroundColor: themeList[theme].btbg }')
    .ff-rn.ai-center.pd1.pr.fc-w3(v-if="isShowMyRank")
      img.badge(
        v-if='myRank.ranking < 3',
        :src='require(`@/assets/img/ic_rank${myRank.ranking}.png`)',
        alt='altText'
      )
      span.badge.flex-center(v-else) {{ myRank.ranking }}
      img.avatar.mgl2(:src='defAvatar', alt='alt')
      span.mgl1 {{ myRank["account"] }}
      span.flex-1.jc-end.mgr3 {{ myRank[rankingKey] }}
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    mainTitle: {
      type: String,
      default: '排行榜',
    },
    subTitle: {
      type: String,
      default: '',
    },
    rankingKey: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'darkblue',
    },
    toFixed: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      themeList: {
        darkblue: {
          btbg: '#00479D',
          tpbg: require('@/assets/img/rank_bg1.png'),
        },
        green: {
          btbg: '#22AC38',
          tpbg: require('@/assets/img/rank_bg2.png'),
        },
        blue: {
          btbg: '#00A0E9',
          tpbg: require('@/assets/img/rank_bg3.png'),
        },
        orange: {
          btbg: '#F39800',
          tpbg: require('@/assets/img/rank_bg4.png'),
        },
      },
      dataList: [],
      myRank: {
        account: '唐兴龙',
        count: 1000,
        ranking: 10,
      },
      isShowMyRank: false,
      defAvatar: require('@/assets/img/ic_def_avatar.png'),
    }
  },
  computed: {
    ...mapGetters(['OS']),
  },
  created: function () {
  },
  methods: {
  },
}
</script>
<style lang='stylus' scoped>
::-webkit-scrollbar
  display none /* Chrome Safari */

$width = 300px

.rank
  background-color #eeeeee
  .avatar
    width 35px
    height 35px
    border-radius 50%
  .top-bg
    .tbimg
      width 100%
      left 0px
      top 0px
    h2
      top 30px
      left 50%
      transform translateX(-50%)
      white-space nowrap
  .content
    width calc(100% - 20px)
    height calc(100% - 150px)
    border-top-left-radius 10px
    border-top-right-radius 10px
    bottom 50px
    left 10px
    padding 25px 0px
  .badge
    width 30px
    height 30px
  .sub-title
    right 25px
    top 100px
    padding 3px 5px
    border-radius 10px
    background-color #FFAA00
    transform translateY(-50%)
    z-index 1
  .footer
    bottom 0px
    padding-left 10px
</style>
