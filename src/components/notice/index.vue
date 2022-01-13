<template lang='pug'>
.ScrollNotice.ff-rn
  .icon.flex-center
    img.w20.h20(:src='require("@/assets/img/ic_notice.png")', fit='contain' v-if="data.length > 0")
  .flex-center
    transition-group.ff-cn.mgl3( name="slide" tag="p" mode="out-in")
      span.hand(
      v-for="item in msgShowList"
      v-bind:key="item.id"
      class="slide-item"
      @click='onNoticeClick(item)'
      )
        span 恭喜{{item.department}}在{{item.time | dateFormat}}玩家单笔消费
        span.danger {{ item.totalPrice }}
        span 元
</template>
<script>
import { MessageBox } from 'element-ui'
export default {
  name: 'ScrollNotice',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      },
    },
    rows: {
      type: Number,
      default: 3,
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data () {
    return {
      msgShowList: [],
      timerId: '',
      lastIdx: 0,
    }
  },
  watch: {
    data (newValue, oldValue) {
      const lines = (this.data.length > this.rows) ? this.rows : this.data.length
      for (let i = 0; i < lines; i++) {
        this.msgShowList.push(this.data[i])
        this.lastIdx = i
      }
      this.startMove()
    },
    immediate: true,
  },
  created: function () {
    const lines = (this.data.length > this.rows) ? this.rows : this.data.length
    for (let i = 0; i < lines; i++) {
      this.msgShowList.push(this.data[i])
      this.lastIdx = i
    }
  },
  beforeDestroy: function () {
    clearInterval(this.timerId)
  },
  methods: {
    startMove () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      if (this.data.length > 0 && this.data.length > this.rows) {
        this.timerId = setInterval(() => {
          if (this.lastIdx === this.data.length - 1) {
            this.lastIdx = 0
          } else {
            this.lastIdx++
          }
          // 删除第一个
          this.msgShowList.splice(0, 1)
          // 从尾部增加
          this.msgShowList.splice(this.msgShowList.length, 0, this.data[this.lastIdx])
        }, this.duration)
      }
    },
    onNoticeClick (item) {
      const msg = `恭喜${item.department}${item.userName}单笔消费${item.totalPrice}元`
      MessageBox.confirm(msg, '公告', {
        confirmButtonText: '确定',
        type: 'info',
        showCancelButton: false,
      })
    },
  },
}
</script>
<style lang='stylus' scoped>
.slide-item
  transition all 1s
  display inline-block
  margin-right 10px

.slide-leave
  transform translateY(-20px)

.slide-leave-active
  position absolute

.slide-leave-to
  opacity 0
  transform translateY(-20px)

.slide-enter
  opacity 0
  transform translateY(20px)

.ScrollNotice
  height 100%
</style>
