<template lang="pug">
el-cascader(
  ref='elca'
  v-model='getArea'
  :options="regions"
  v-bind="$attrs"
  v-on="$listeners"
  :props="{value:'id', label: 'name', checkStrictly: true, expandTrigger: 'hover'}"
  clearable)
  //- 组件标准使用
  //- CommonAreaSelector(
  //-   :provinceId.sync='model.province_id',
  //-   :province.sync='model.province',
  //-   :cityId.sync='model.city_id',
  //-   :city.sync='model.city',
  //-   :areaId.sync='model.area_id',
  //-   :area.sync='model.area')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CommonAreaSelector',
  props: {
    province: {
      type: String,
      default: '',
    },
    provinceId: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      default: '',
    },
    cityId: {
      type: Number,
      default: 0,
    },
    area: {
      type: String,
      default: '',
    },
    areaId: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      areaa: [],
    }
  },
  computed: {
    ...mapGetters(['regions']),
    getArea: {
      get () {
        if (this.areaId > 0) return [this.provinceId, this.cityId, this.areaId]
        if (this.cityId > 0) return [this.provinceId, this.cityId]
        else return [this.provinceId]
      },
      set (idArr) {
        idArr = idArr.length ? idArr : [-1, -1, -1]
        const nodes = this.$refs.elca.getCheckedNodes()
        const nameArr = nodes.length ? nodes[0].pathLabels : ['', '', '']
        this.$emit('update:province', nameArr[0])
        this.$emit('update:provinceId', idArr[0])
        this.$emit('update:city', nameArr[1])
        this.$emit('update:cityId', idArr[1])
        this.$emit('update:area', nameArr[2])
        this.$emit('update:areaId', idArr[2])
        this.$refs.elca.dropDownVisible = false
      },
    },
  },
  created () {
    this.$store.dispatch('getRegions')
  },
}
</script>
<style lang="stylus">
@import '~@/assets/style/var'

</style>
