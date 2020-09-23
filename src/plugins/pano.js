import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import router from '@/router'
import { HOTSPOT } from '@/config'
const { CLOUD_APP_API } = $globalconfig
const IMAGE_URL = `${CLOUD_APP_API}panoeditor/static/images/`

export default new Vue({
  store,
  router,
  computed: {
    ...mapGetters(['panoInfo', 'curScene', 'hotspotList', 'appStatus', 'appProcess']),
  },
  methods: {
    initFirstScnene (krpano) {
      this.krpEl = krpano
    },

    // 移动视角到中心点
    moveViewCenter (atv, ath) {
      this.krpEl.call(`lookto(${ath},${atv},get(view.fov),tween(easeInOutQuad,0.5),true,true));)`)
    },

    // 下雪效果
    setSnowEffect (index) {
      this.krpEl.call('showsnow' + index + '()')
      this.krpEl.set('scene[get(xml.scene)].bgsnow', index)
    },

    // 球体效果
    screenToSphere () {
      this.krpEl.call('screentosphere(mouse.x ,mouse.y, toh, tov)')
    },

    // 获取场景列表
    getScene () {
      const count = this.krpEl.get('scene').count
      const scenePool = []
      for (let i = 0; i < count; i++) {
        scenePool.push(this.krpEl.get('scene[' + i + ']'))
      }
      return scenePool
    },

    // 获取场景名称
    getSceneName () {
      return this.krpEl.get('scene[get(xml.scene)].name')
    },

    // 获取场景数字Id
    getSceneId () {
      const name = this.getSceneName()
      if (name) {
        return name.split('_')[1]
      }
    },

    // 设置热点属性
    setProperty ({ hotId = 'get(hotspotid)', prop, val }) {
      this.krpEl.set(`hotspot[${hotId}].${prop}`, val)
    },

    // 设置全部场景视角范围
    setAllLimitView (options) {
      const sceneList = this.getScene()
      sceneList.map(scene => {
        this.setLimitView(options, `scene[${scene.scene_name}]`)
      })
    },

    // 设置视角最大、最小值
    setLimitView (options, name = 'view') {
      const viewArr = [
        'fov',
        'fovmin',
        'fovmax',
        'vlookat',
        'vlookatmin',
        'vlookatmax',
      ]
      viewArr.map(it => {
        if (options[it]) {
          this.krpEl.set(`${name}.${it}`, options[it])
        }
      })
    },

    // 获取视角最大、最小值
    getLimitView () {
      const viewArr = [
        'fov',
        'fovmin',
        'fovmax',
        'vlookat',
        'vlookatmin',
        'vlookatmax',
      ]
      const res = {}
      viewArr.map(it => {
        res[it] = Math.ceil(this.krpEl.get(`view.${it}`))
      })
      return res
    },

    // 获取当前视角中心位置
    getView () {
      const x = this.krpEl.get('mouse.x')
      const fov = this.krpEl.get('view.fov')
      const hlookat = this.krpEl.get('view.hlookat')
      const vlookat = this.krpEl.get('view.vlookat')

      return {
        x,
        fov,
        hlookat: Number(hlookat).toFixed(2),
        vlookat: Number(vlookat).toFixed(2),
      }
    },

    // 加载场景
    loadScene (id, effect) {
      this.krpEl.call(
        'loadscene(scene_' + id + ', null, MERGE, ' + effect + ')'
      )
    },

    // 补地图片
    setBottomPic (imgUrl) {
      this.krpEl.call(`reset_bottom_img('${imgUrl}')`)
    },

    // 加载xml
    reloadXML (xml) {
      const old = this.getSceneName()
      this.krpEl.call('loadxml(' + xml + ');loadscene(' + old + ');')
    },

    // 切换效果
    switchEffect (id) {
      const effect = store.getters.panoInfo.settings.scene_switch_animation

      switch (effect) {
        case 2:
          this.loadScene(id, 'ZOOMBLEND(2.0, 2.0, easeInOutSine)')
          break
        case 3: // 黑场过渡
          this.loadScene(id, 'COLORBLEND(2.0, 0x000000, easeOutSine)')
          break
        case 4: // 从右至左
          this.loadScene(id, 'SLIDEBLEND(1.0, 0.0, 0.2, linear)')
          break
        case 5: // 从上至下
          this.loadScene(id, 'SLIDEBLEND(1.0, 90.0, 0.01, linear)')
          break
        case 6: // 圆形展开
          this.loadScene(id, 'OPENBLEND(1.0, 0.0, 0.2, 0.0, linear)')
          break
        default:
          // 淡入淡出
          this.loadScene(id, 'BLEND(1.0, easeInCubic)')
          break
      }
    },

    // 删除某个热点
    removeKrpanoPoint (hotId) {
      this.krpEl.call(`removehotspot(hotspot_${hotId})`)
    },

    // 添加热点
    loadHotspot () {
      this.hotspotList.map(it => {
        const { item, opts } = this.processCommon(it)
        // 内嵌热点
        this.handleBuiltInText(item, opts)
        this.handleBuiltInImage(item, opts)
        this.handleBuiltInVideo(item, opts)
        // ar
        this.handleBuiltInAR(item, opts)

        // 漫游热点
        this.handleRoam(item, opts)
        this.handleLink(item, opts)
        this.handleGraphicAndThree(item, opts)
        this.handleMedia(item, opts)
        this.handleSlider(item, opts)
        this.handleMark(item, opts)
      })
    },

    // 热点属性写入krpano
    setHotspotProp (obj) {
      for (const key in obj) {
        this.krpEl.set(`hotspot[${obj.name}].${key}`, obj[key])
      }
    },

    processCommon (item) {
      const { options: opts } = item
      const { id, atv, ath, type_id, scene_id, hotspoticon } = item
      const hotspotName = `hotspot_${id}`
      const { is_vertical_text: dir, background_color: bgColor } = opts

      // 标题方向
      const titleDir = dir ? 'vertical' : 'horizontal'

      let onLoadedVal = `add_tooltip(${titleDir}, ${bgColor})`
      if (hotspoticon) {
        onLoadedVal = `${
            hotspoticon.type_id !== 102 ? '' : 'hotspot_animate();'
          }${onLoadedVal}`
      }

      // 非内置热点
      const notBuitIn =
          +item.type_id !== HOTSPOT.TEXT_IN_ID &&
          +item.type_id !== HOTSPOT.IMAGE_IN_ID &&
          +item.type_id !== HOTSPOT.VIDEO_IN_ID

      // 默认配置
      item.defaultOpts = {
        name: hotspotName,
        ath,
        atv,
        type_id,
        style: hotspoticon && hotspoticon.style,
        onclick: this.onHotspotClick,
        ondown: `draghotspot();set(hotspotid, ${hotspotName});set(sceneid, ${scene_id});`,
        onup: this.onHotspotUp,
        onloaded: notBuitIn && onLoadedVal,
        keep: false,
        enabled: true,
        bgcapture: true,
        ishotspot: true,
        handcursor: true,
        distorted: true,
      }
      this.krpEl.call(`addhotspot(${hotspotName})`)
      return {
        item,
        opts,
      }
    },

    // 内嵌文字
    handleBuiltInText (item, opts) {
      if (+item.type_id !== HOTSPOT.TEXT_IN_ID) return
      // 处理参数
      let { color, size, rx, ry, scale, rotate } = opts
      color = color.replace('#', '0x')

      // 乱码文字处理
      // let text = decodeURIComponent(name)

      const obj = {
        ...item.defaultOpts,
        id: item.id,
        url: `${CLOUD_APP_API}panorama/textimage?text=${item.name}&color=${color}&fontSize=${+size}`,
        rx,
        ry,
        rotate,
        scale: scale || 1,
        type: 'image',
      }
      this.setHotspotProp(obj)
    },

    // 内嵌图片
    handleBuiltInImage (item, opts) {
      if (+item.type_id !== HOTSPOT.IMAGE_IN_ID) { return }
      // 处理参数
      const { width, height, rx, ry, scale, rotate, file_url: url } = opts

      const obj = {
        ...item.defaultOpts,
        width,
        height,
        rx,
        ry,
        rotate,
        scale: scale || 1,
        url,
      }
      this.setHotspotProp(obj)
    },

    // 内嵌视频
    handleBuiltInVideo (item, opts) {
      if (+item.type_id !== HOTSPOT.VIDEO_IN_ID) return
      const { width, height, rx, ry, scale, rotate, file_url: url } = opts

      const obj = {
        ...item.defaultOpts,
        loop: true,
        pausedonstart: true,
        edge: 'center',
        width,
        height,
        rx,
        ry,
        rotate,
        scale: scale || 1,
        url: `${CLOUD_APP_API}krpano/plugins/videoplayer.js`,
        videourl: url,
      }
      this.setHotspotProp(obj)
    },

    handleBuiltInAR (item, opts) {
      if (+item.type_id !== HOTSPOT.AR_ID) return
      const { width, height, rx, ry, scale, rotate } = opts
      const { hotspoticon } = item
      const { image_url: url, data, type_id } = hotspoticon

      let obj = {
        ...item.defaultOpts,
        url,
        width,
        height,
        rx,
        ry,
        rotate,
        scale: scale || 1,
        type: 'image',
        edge: 'bottom',
        keep: false,
        bgcapture: true,
        ishotspot: true,
        handcursor: true,
      }
      if (type_id !== 103) {
        const { frame, crop } = JSON.parse(data)
        const framearr = crop.split('|')
        const onLoadedVal = 'hotspot_animate();'

        // gif图片
        obj = {
          ...obj,
          crop,
          framewidth: framearr[2],
          frameheight: framearr[3],
          frame: 0,
          lastframe: frame - 1,
          onloaded: onLoadedVal,
        }
      }
      this.setHotspotProp(obj)
    },

    // 普通热点共性处理
    handleNormal (item) {
      const { name: text } = item
      if (!item.hotspoticon) return
      const {
        type_id,
        thumb_url,
        image_url,
        scale,
        style,
        data,
      } = item.hotspoticon
      let obj = {
        url: type_id === 102 ? image_url : thumb_url,
        text,
        scale,
        y: 0,
        autowidth: true,
        zoom: false,
        distorted: false,
        edge: 'bottom',
      }

      if (style.indexOf('gif') > -1) {
        const { frame, crop } = JSON.parse(data)
        const framearr = crop.split('|')
        obj = {
          ...obj,
          crop,
          framewidth: framearr[2],
          frameheight: framearr[3],
          frame: 0,
          lastframe: frame - 1,
        }
      }

      return obj
    },

    // 漫游
    handleRoam (item, opts) {
      if (+item.type_id !== HOTSPOT.ROAM_ID) return
      const normalData = this.handleNormal(item)
      const {
        // title,
        scene_id: linkedscene,
        // is_vertical_text: titleDir,
        // background_color: bgColor,
      } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        linkedscene,
      }
      this.setHotspotProp(obj)
    },

    // 链接
    handleLink (item, opts) {
      if (+item.type_id !== HOTSPOT.LINK_ID) return
      const normalData = this.handleNormal(item)
      const { url: datastr, is_open_window: abank } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        abank,
        datastr,
      }
      this.setHotspotProp(obj)
    },

    // 图文/3d
    handleGraphicAndThree (item, opts) {
      const isGraphic = +item.type_id === HOTSPOT.ARTICLE_ID
      const isThree = +item.type_id === HOTSPOT.THREE_ID
      if (!isGraphic && !isThree) return
      const normalData = this.handleNormal(item)
      const { material_id: datastr } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        datastr,
      }
      this.setHotspotProp(obj)
    },

    // 3d物品
    handleThree (item, opts) {
      const isThree = +item.type_id === HOTSPOT.THREE_ID
      if (!isThree) return
      const normalData = this.handleNormal(item)
      const { material_id: datastr } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        datastr,
      }
      this.setHotspotProp(obj)
    },

    // 音频/视频
    handleMedia (item, opts) {
      if (+item.type_id !== HOTSPOT.AUDIO_ID && +item.type_id !== HOTSPOT.VIDEO_ID) return
      const normalData = this.handleNormal(item)
      const { file_id: datastr } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        datastr,
      }
      this.setHotspotProp(obj)
    },

    // 幻灯片
    handleSlider (item, opts) {
      if (+item.type_id !== HOTSPOT.IMAGE_ID) return
      const normalData = this.handleNormal(item)
      const { image_ids: datastr } = opts
      const obj = {
        ...item.defaultOpts,
        ...normalData,
        datastr,
      }
      this.setHotspotProp(obj)
    },

    // 场景标注
    handleMark (item, opts) {
      if (+item.type_id !== HOTSPOT.MARK_ID) return
      const obj = {
        ...item.defaultOpts,
        text: item.name,
        url: IMAGE_URL + 'mark.png',
      }
      this.setHotspotProp(obj)
    },

    // 多边形
    handlePolygon (item) {},

    // 热点点击事件
    onHotspotClick (e) {
      const hotId = this.krpEl.get('hotspotid').split('_')[1]

      if (!hotId) return
      // 热点编辑
      this.hotspotList.map(item => {
        if (+item.id === +hotId) {
          store.commit('editHotspotItem', item)
          store.commit('showDialog', {
            name: 'EDIT_BOX',
            data: item,
            type: 2,
          })
        }
      })
    },

    // 热点点击后up事件
    onHotspotUp () {
      const ath = this.krpEl.get('hotspot[get(hotspotid)].ath')
      const atv = this.krpEl.get('hotspot[get(hotspotid)].atv')
      const hotId = this.krpEl.get('hotspotid').split('_')[1]

      this.hotspotList.map(item => {
        if (+item.id === +hotId) {
          const isMovAtv = Math.floor(atv) === Math.floor(item.atv)
          const isMovAth = Math.floor(ath) === Math.floor(item.ath)
          if (isMovAtv && isMovAth) {
            // 如果只是点击操作，热点位置并没移动
            return
          }

          // 更新坐标位置
          item = {
            ...item,
            atv,
            ath,
          }

          store.dispatch('updateHotspotLocation', {
            item,
            ath,
            atv,
          })
        }
      })
    },

    // 一键导览相关热点
    onPointUp () {
      const id = this.krpEl.get('navguide').split('_')[1]
      const ath = this.krpEl.get('hotspot[get(navguide)].ath')
      const atv = this.krpEl.get('hotspot[get(navguide)].atv')

      this.navList.map(item => {
        if (+item.id === +id) {
          const {
            scene_id,
            transition_delay,
            transition_image_id,
            transition_music_name,
            transition_music_id,
          } = item
          const options = {
            ath,
            atv,
            scene_id,
            transition_delay,
            transition_image_id,
            transition_music_name,
            transition_music_id,
          }
          store.dispatch('updateNavGuide', { id, options })
          // 触发一键导览管理面板
          this.$vgo.emit('show:navGuide')
        }
      })
    },

    loopSetOpts (options) {
      for (const key in options) {
        this.krpEl.set(key, options[key])
      }
    },

    // 添加导览点
    addNavGuideToScene (list) {
      const sceneId = this.getSceneId()
      list = Array.isArray(list) ? list : [list]

      this.navList = list

      list.forEach((it, index) => {
        if (+sceneId !== +it.scene_id) return

        const { id, atv, ath } = it
        const navId = 'nav_' + id
        const prefix = `hotspot[${navId}]`

        this.krpEl.call(`addhotspot(${navId})`)
        this.krpEl.set(`${prefix}.onloaded`, 'add_navtext();')
        this.krpEl.set(`${prefix}.onup`, this.onPointUp)

        const options = {
          [`${prefix}.atv`]: atv,
          [`${prefix}.ath`]: ath,
          [`${prefix}.text`]: index + 1,
          [`${prefix}.url`]: IMAGE_URL + 'navpoint.png',
          [`${prefix}.ondown`]: `draghotspot();set(navguide, ${navId});`,
          [`${prefix}.onover`]: `set(tempnavname, ${navId});`,
        }

        this.loopSetOpts(options)
      })
    },

    // 删除导览点
    removeNavGuidePoint (navId) {
      this.krpEl.call('removehotspot(nav_' + navId + ');')
      this.krpEl.call("removeplugin('tooltip_nav_" + navId + "');")
    },

    // 太阳光特效相关事件
    createSun (list) {
      list = Array.isArray(list) ? list : [list]
      this.sunList = list

      list.forEach((it, index) => {
        const { id, atv, ath, dust_effect } = it
        const krname = 'edit_lensflare' + id

        this.krpEl.call('addhotspot(' + krname + ')')
        const prefix = `hotspot[${krname}]`
        this.krpEl.set(`${prefix}.onup`, this.onSunUp)

        const options = {
          [`${prefix}.atv`]: atv,
          [`${prefix}.ath`]: ath,
          [`${prefix}.index`]: index + 1,
          [`${prefix}.effectid`]: id,
          [`${prefix}.url`]: IMAGE_URL + 'sun1.png',
          [`${prefix}.dust_effect`]: dust_effect,
          [`${prefix}.ondown`]: 'draghotspot();',
          [`${prefix}.onover`]: `set(temp_lensflare, ${krname});`,
        }

        this.loopSetOpts(options)
      })
    },

    onSunUp () {
      const sunId = this.krpEl.get('hotspot[get(temp_lensflare)].effectid')
      const ath = this.krpEl.get('hotspot[get(temp_lensflare)].ath')
      const atv = this.krpEl.get('hotspot[get(temp_lensflare)].atv')

      const item = this.sunList.find(it => it.id === sunId)
      const { id } = item
      const options = {
        dust_effect: false,
        atv,
        ath,
      }

      // 更新服务器坐标
      store.dispatch('updateSceneSun', { id, options })
      // 触发太阳光特效管理面板
      this.$vgo.emit('show:sunShine')
    },

    onSunDelete (effectId) {
      const krname = 'edit_lensflare' + effectId
      this.krpEl.call('removehotspot(' + krname + ');')
    },
  },
})
