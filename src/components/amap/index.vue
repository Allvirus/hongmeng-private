<template lang="pug">
.amap-search.ff-cn
  el-autocomplete.w100p.mgb2(
    v-if="!disabled"
    v-model='addressSync'
    :trigger-on-focus='false' :fetch-suggestions="areaSearch"
    @select="handleSelect" placeholder='请输入地址' suffix-icon='el-icon-search'
    :maxlength='maxlength' show-word-limit clearable)

    .el-icon-map-location.fs-b(slot="prepend")
  span(v-else) {{addressSync}}

  #mapContainer

</template>
<script>
const AMap = window.AMap
export default {
  name: 'AMap',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    lat: {
      type: [Number, String],
      default: '',
    },
    lng: {
      type: [Number, String],
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    maxlength: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      AMap: {
        map: null,
        marker: null,
        geocoder: null,
        placeSearch: null,
        geolocation: null,
      },
    }
  },
  computed: {
    addressSync: {
      get () { return this.address },
      set (val) { this.$emit('update:address', val) },
    },
  },
  watch: {
    lng: {
      handler (val) {
        this.$nextTick(async () => {
          await this.initMap()
          if (val) {
            const arr = [this.lng, this.lat]
            this.AMap.map.setZoomAndCenter(14, arr)
            this.AMap.marker.setPosition(arr)
          } else this.getCurrentPosition()
        })
      },
      immediate: true,
    },
  },
  methods: {
    initMap () {
      return new Promise((resolve, reject) => {
        if (!this.AMap.map) {
          this.AMap.map = new AMap.Map('mapContainer')
          this.AMap.map.plugin(['AMap.Geolocation', 'AMap.Geocoder', 'AMap.PlaceSearch'], () => {
            this.AMap.geocoder = new AMap.Geocoder()

            this.AMap.placeSearch = new AMap.PlaceSearch({ city: '全国' })

            this.AMap.geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              buttonPosition: 'RB', // 定位按钮的停靠位置
              timeout: 10000, // 超过10秒后停止定位，默认：无穷大
              zoomToAccuracy: false, // 定位成功后是否自动调整地图视野到定位点
            })

            this.AMap.marker = new AMap.Marker() // 添加标记点
            this.AMap.map.add(this.AMap.marker)
            this.AMap.map.setZoom(14)
            this.AMap.map.on('click', this.handleMapClick) // click
            this.AMap.map.addControl(this.AMap.geolocation)

            resolve(this.AMap.map)
          })
        } else resolve(this.AMap.map)
      })
    },

    handleMapClick (e) {
      if (this.disabled) return
      const { lat, lng } = e.lnglat
      this.$emit('update:lng', lng)
      this.$emit('update:lat', lat)
      this.getAddress(lng, lat)
      this.AMap.marker.setPosition([lng, lat]) // 更新点标记位置
    },
    // 定位
    getCurrentPosition () {
      return new Promise((resolve, reject) => {
        this.AMap.geolocation.getCurrentPosition((status, res) => {
          if (status === 'complete') {
            const { lat, lng } = res.position
            this.$emit('update:lng', lng)
            this.$emit('update:lat', lat)
            resolve({ lat, lng })
            this.AMap.marker.setPosition([lng, lat]) // 更新点标记位置
          } else reject(res)
        })
      })
    },
    // 经纬度获取地址
    getAddress (lng, lat) {
      return new Promise((resolve, reject) => {
        this.AMap.geocoder.getAddress([lng, lat], (status, res) => {
          if (status === 'complete') {
            this.addressSync = res.regeocode.formattedAddress
            resolve(res.regeocode)
          } else reject(res)
        })
      })
    },
    // 查找地址
    areaSearch (val, searchCb) {
      val && this.AMap.placeSearch.search(val, (status, res) => {
        if (status === 'complete') {
          searchCb(res.poiList.pois.map(item => ({ ...item, value: item.name + ` - (${item.address})` })))
        } else console.log('地址查询失败:', res)
      })
    },
    // 选择地址
    handleSelect (item) {
      this.addressSync = item.name
      this.$emit('update:lng', item.location.lng)
      this.$emit('update:lat', item.location.lat)
    },
  },
}
</script>
<style lang="stylus">
.amap-search
  #mapContainer
    flex 1
    .amap-geolocation-con
      z-index 1!important
    .amap-copyright
      height 26px
  .el-autocomplete .el-input
    width 100%!important
</style>
