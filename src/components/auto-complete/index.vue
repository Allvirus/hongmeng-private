<template lang='pug'>
.ff-cn
  el-autocomplete.winput(
    v-bind='$attrs',
    v-on='$listeners',
    :clearable="clearable"
    @select="handleSelect"
    :fetch-suggestions='querySearchAsync'
  )
</template>
<script>
export default {
  name: 'AutoComplete',
  props: {
    data: Array,
    default: () => {
      return []
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      timeout: null,
    }
  },
  computed: {
  },
  created: function () {
  },
  methods: {
    querySearchAsync (queryString, cb) {
      var restaurants = this.data
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 1000)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.indexOf(queryString) === 0)
      }
    },
    handleSelect (item) {
      this.$vgo.$emit('onselec', item)
    },
  },
}
</script>
<style lang='stylus' scoped></style>
