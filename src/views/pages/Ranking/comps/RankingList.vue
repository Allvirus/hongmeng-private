<template lang='pug'>
  .rank.h650.ff-cn
    .top-bg.pr
      img.pa.tbimg(:src="themeList[theme].tpbg")
      h1.pa.fc-w3 {{mainTitle}}
    .content.mgx2.flex-1.bg-white
      .mgt2
        .ff-rn.ai-center.pd1.pr(v-for="(item,index) in data" :key="index")
          img.badge(v-if="index<3" :src="require(`@/assets/img/ic_rank${index+1}.png`)" alt="altText")
          span.badge.flex-center(v-else) {{index + 1}}
          img.avatar.mgl2(:src="testUrl", alt="alt")
          span.mgl1 {{item['account']}}
          span.flex-1.jc-end.mgr3 {{item['count']}}
    .footer.h50(:style="{ backgroundColor: themeList[theme].btbg }")
      p.fc-w3 我的排行
</template>
<script>
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
    defProp: {
      type: Object,
      default: () => {
        return {
          name: '',
          value: '',
        }
      },
    },
    theme: {
      type: String,
      default: 'darkblue',
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
      testUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602244834651&di=8a64567985c8b88137bbf1a63b5caba6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180313%2Fab29d548f2a54e2c81663261d4a11af0.jpeg',
    }
  },
  created: function () {
  },
  methods: {
  },
}
</script>
<style lang='stylus' scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.rank
  width 380px
  background-color #eeeeee
  .top-bg
    .tbimg
      left 0px
      top 0px
    h1
      top 30px
      left 50%
      transform translateX(-50%)
  .content
    z-index 100
    margin-top 100px
    border-top-left-radius 10px
    border-top-right-radius 10px
    .avatar
      width 40px
      height 40px
      border-radius 50%
    .badge
      width 30px
      height 30px
  // .footer
</style>
