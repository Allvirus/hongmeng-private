<template lang='pug'>
.rank.pr(:class='OS.isPc ? "" : "mgt3"')
  .top-bg.pr
    img.pa.tbimg(:src='themeList[theme].tpbg')
    h2.pa.fc-w3 {{ mainTitle }}
    .sub-title.pa.fs-s
      span {{ subTitle }}
  .content.bg-white.pa.full.overflow-auto.pr
    .ff-rn.ai-center.pd1.pr(v-for='(item, index) in data', :key='index')
      img.badge(
        v-if='isTopThree(item, index)',
        :src='require(`@/assets/img/ic_rank${getRankNumber(item, index)}.png`)',
        alt='altText'
      )
      span.badge.flex-center(v-else) {{ getRankNumber(item, index) }}
      img.avatar.mgl2(:src='defAvatar', alt='alt', v-if='isShowMyRank')
      span.mgl1 {{ getDisplayName(item) }}
      span.flex-1.jc-end.mgr3.danger.strong(v-if='toFixed') {{ getDisplayValue(item) | toFixed }}
      span.flex-1.jc-end.mgr3(v-else) {{ getDisplayValue(item) }}
    .flex-center(v-if='data.length === 0')
      span 暂无数据
  .footer.h50.full.pa(:style='{ backgroundColor: themeList[theme].btbg }')
    .ff-rn.ai-center.pd1.pr.fc-w3(v-if='isShowMyRank')
      img.badge(
        v-if='isTopThree(myRank, 0)',
        :src='require(`@/assets/img/ic_rank${getRankNumber(myRank, 0)}.png`)',
        alt='altText'
      )
      span.badge.flex-center(v-else) {{ getRankNumber(myRank, 0) }}
      img.avatar.mgl2(:src='defAvatar', alt='alt')
      span.mgl1 {{ getDisplayName(myRank) }}
      span.flex-1.jc-end.mgr3 {{ getDisplayValue(myRank) }}
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
    // 兼容统一接口 rank 字段和旧接口 ranking 字段。
    getRankNumber (item, index) {
      if (item && Number(item.rank) > 0) return Number(item.rank)
      if (item && Number(item.ranking) > 0) return Number(item.ranking)
      return index + 1
    },
    isTopThree (item, index) {
      const rankNo = this.getRankNumber(item, index)
      return rankNo > 0 && rankNo <= 3
    },
    getDisplayName (item) {
      if (!item) return ''
      if (item.name !== undefined && item.name !== null && item.name !== '') return item.name
      if (item.account !== undefined && item.account !== null) return item.account
      return ''
    },
    getDisplayValue (item) {
      if (!item) return ''
      if (this.rankingKey && Object.prototype.hasOwnProperty.call(item, this.rankingKey)) {
        return item[this.rankingKey]
      }
      if (Object.prototype.hasOwnProperty.call(item, 'value')) return item.value
      return ''
    },
  },
}
</script>
<style lang='stylus' scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

$width = 300px;

.rank {
  width: 100%;
  height: 560px;
  background-color: #eeeeee;
  border-radius: 16px;
  overflow: hidden;

  .avatar {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .top-bg {
    height: 132px;

    .tbimg {
      width: 100%;
      height: 100%;
      left: 0px;
      top: 0px;
      object-fit: cover;
    }

    h2 {
      top: 28px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }
  }

  .content {
    width: calc(100% - 16px);
    height: calc(100% - 148px);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    bottom: 50px;
    left: 8px;
    padding: 20px 0px;
  }

  .badge {
    width: 30px;
    height: 30px;
  }

  .sub-title {
    right: 25px;
    top: 98px;
    padding: 3px 5px;
    border-radius: 10px;
    background-color: #FFAA00;
    transform: translateY(-50%);
    z-index: 1;
  }

  .footer {
    bottom: 0px;
    padding-left: 12px;
  }
}
</style>
