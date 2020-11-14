<template lang='pug'>
.data-box.pd2.pr.flex-1
  h3 {{ data.title }}
  .flex-center.warning.mgt3(v-if='!data.isShowY')
    h1(v-if='toFixed') {{ data.value | toFixed }}
    h1(v-else) {{ data.value | formatNumber }}
  .flex-center.warning.mgt3.ff-rn(v-if='data.isShowY')
    h3 昨日
    h1.mgl1 {{ data.yesterday | formatNumber }}
    h3.mgl6 今日
    h1.mgl1 {{ data.today | formatNumber }}
  .triangle.pa(:style='labelColor')
  .tria-cover.pa
</template>
<script>
export default {
  name: '',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          title: '',
          value: 0,
          increase: true,
          rate: '0',
        }
      },
    },
    colIdx: {
      type: Number,
      default: 0,
    },
    toFixed: {
      type: Boolean,
      default: false,
    },
    // 是否现实的昨天，今日数据
    isShowY: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      colors: ['#00479D', '#00A0E9', '#22AC38', '#E60012', '#EA68A2', '#F39800'],
    }
  },
  computed: {
    icStyle () {
      const style = {
        color: this.data.increase ? '#22AC38' : 'red',
      }
      return style
    },
    labelColor () {
      const color = this.colors[(this.colIdx % this.colors.length)]
      const styl = {
        'border-top': '28px solid' + color,
      }
      return styl
    },
  },
}
</script>
<style lang='stylus' scoped>
.data-box
  background-color #fff
  border-radius 10px
  min-height 132px
  .green
    color green
  .triangle
    top 0px
    right 0px
    border-left 67px solid transparent
    border-top-right-radius 10px
  .tria-cover
    width 0
    height 0
    border-bottom 28px solid @background-color
    border-right 67px solid transparent
    top 0px
    right 0px
</style>
