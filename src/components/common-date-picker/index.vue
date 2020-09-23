<template lang="pug">
el-date-picker(
  v-model="type === 'date' ? valueSync : dateArray"
  v-bind="$attrs"
  v-on="$listeners"
  :type="type"
  unlink-panels
  :value-format="getValFormat"
  range-separator="-"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  :picker-options="pickerOptions")
  //- 组件使用
  //- CommonDatePicker(v-model='model.date' future)
  //- CommonDatePicker(:start.sync='model.start' :end.sync='model.end' @change='')
  //- CommonDatePicker(:start.sync='model.starttime' :end.sync='model.endtime' type='datetimerange' future)

</template>

<script>
export default {
  name: 'CommonDatePicker',
  props: {
    // 类型 默认日期选择 daterange , 日期时间选择 datetimerange 日期 date
    type: {
      type: String,
      default: 'daterange',
    },
    // 过去还是将来 默认过去
    future: {
      type: Boolean,
      default: false,
    },
    // 所有时间
    all: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    start: {
      type: String,
      default: '',
    },
    end: {
      type: String,
      default: '',
    },
    // 高于当前多少时间 分钟 快捷选择时, 高于当前时间
    fixedTime: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      daterange: [],
      pickerOptions: {},
    }
  },
  computed: {
    dateArray: {
      get () {
        return (this.start !== undefined || this.end !== undefined)
          ? [this.start, this.end]
          : this.daterange
      },
      set (arr) {
        arr = arr || ['', '']
        this.$emit('update:start', arr[0])
        this.$emit('update:end', arr[1])
        this.daterange = arr
      },
    },
    valueSync: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      },
    },
    getValFormat () {
      if (this.type === 'daterange' || this.type === 'date') return 'yyyy-MM-dd'
      if (this.type === 'datetimerange') return 'yyyy-MM-dd HH:mm:ss'
      return ''
    },
  },
  created () {
    const onClick = date => picker => {
      const end = new Date()
      const start = new Date()

      this.future ? end.setTime(end.getTime() + 3600 * 1000 * 24 * date + this.fixedTime * 60 * 1000)
        : start.setTime(start.getTime() - 3600 * 1000 * 24 * date)
      // 延迟时间
      if (this.fixedTime) {
        end.setTime(end.getTime() + this.fixedTime * 60 * 1000)
        start.setTime(start.getTime() + this.fixedTime * 60 * 1000)
      }
      picker.$emit('pick', [start, end])
    }
    this.pickerOptions = {
      shortcuts: this.type === 'date' ? null : [
      //   {
      //   text: '全部',
      //   onClick: picker => picker.$emit('pick', ['', ''])
      // },
        {
          text: '最近一周',
          onClick: onClick(7),
        }, {
          text: '最近一个月',
          onClick: onClick(30),
        }, {
          text: '最近三个月',
          onClick: onClick(90),
        }],
      disabledDate: (time) => {
        if (this.all) return false
        const now = new Date(new Date().toLocaleDateString()).getTime()
        return this.future ? time.getTime() < now : time.getTime() > now
      },
    }
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'
</style>
