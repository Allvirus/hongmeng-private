<template lang='pug'>
.ScrollNotice.ff-rn
  .icon.flex-center
    img.w20.h20(:src='require("@/assets/img/ic_notice.png")', fit='contain')
  transition-group.ff-cn.jc-center.mgl3( name="list-complete" tag="p" mode="out-in")
    span.hand(
    v-for="item in items"
    v-bind:key="item"
    class="list-complete-item"
    ) {{ item }}
</template>
<script>
export default {
  name: 'ScrollNotice',
  props: {
    msgList: {
      type: Array,
      default: () => {
        return [
          {
            id: 1,
            title: '第1条公告111111111111111第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌',
          },
          {
            id: 2,
            title: '第2条公告111111111111111第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌',
          },
          {
            id: 3,
            title: '第3条公告111111111111111第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌',
          },
          {
            id: 4,
            title: '第4条公告111111111111111第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌',
          },
          {
            id: 5,
            title: '第5条公告111111111111111第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌',
          },
        ]
      },
      lines: {
        type: Number,
        default: 3,
      },
      duration: {
        type: Number,
        default: 3000,
      },
    },
  },
  data () {
    return {
      lineNum: 1,
      msgShowList: [],
      timerId: '',
      lastIdx: 0,

      items: [1, 2, 3],
      nextNum: 10,
    }
  },
  created: function () {
    const msgArr = this.msgList
    this.lineNum = (msgArr.length > 3) ? 3 : msgArr.length
    for (let i = 0; i < this.lineNum; i++) {
      this.msgShowList.push(this.msgList[i])
      this.lastIdx++
    }
    this.updateIndex()
  },
  mounted () {
    this.startMove()
  },
  beforeDestroy: function () {
    clearInterval(this.timerId)
  },
  methods: {
    startMove () {
      setInterval(() => {
        this.refreshShowList()
        this.updateIndex()
        this.add()
        this.remove()
      }, 2500)
    },
    updateIndex () {

    },
    refreshShowList () {
      this.msgShowList.shift()
      this.msgShowList.push(this.msgList[this.lastIdx])
    },

    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(0, 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.items.length - 1, 1)
    },
  },
}
</script>
<style lang='stylus' scoped>
.list-complete-item
  transition all 1s
  display inline-block
  margin-right 10px

.list-complete-enter
  opacity 0
  transform translateY(-30px)

.list-complete-leave-to
  opacity 0
  transform translateY(50px)

.list-complete-leave-active
  position absolute

.slide-enter-active, .slide-leave-active
  transition all 1s linear

.slide-enter
  transform translateY(20px)
  opacity 1

.slide-leave-to
  transform translateY(-20px)
  opacity 0

.ScrollNotice
  height 100%
</style>
