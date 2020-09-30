<template lang='pug'>
  .data-box.pd2.pr
    h3 {{data.title}}
    h1.jc-end.mgy3.mgr2.warning {{data.value | formatNumber}}
    p
      span.info 同比
      span.mgl2(:class="data.increase?'green':'danger'") {{data.rate}}%
      i(:class="data.increase?'el-icon-top':'el-icon-bottom'" :style="icStyle")
    .triangle.pa(:style="labelColor")
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
    min-width 224px
    max-width 250px
    min-height 132px
    .green
      color green
    .triangle
      top 0px
      right 0px
      border-left 67px solid transparent
      border-top-right-radius 10px

    .tria-cover
      width: 0;
      height: 0;
      border-bottom: 28px solid @background-color;
      border-right: 67px solid transparent;
      top 0px
      right 0px

</style>
