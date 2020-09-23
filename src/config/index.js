// 热点类型id
export const HOTSPOT = {
  // 内置
  TEXT_IN_ID: 101, // 内置文字
  IMAGE_IN_ID: 102, // 内置图片
  VIDEO_IN_ID: 103, // 内置视频
  // 非内置
  ROAM_ID: 1, // 漫游
  LINK_ID: 2, // 链接
  ARTICLE_ID: 3, // 图文
  AUDIO_ID: 4, // 音乐
  VIDEO_ID: 5, // 视频
  MARK_ID: 6, // 标记
  IMAGE_ID: 7, // 幻灯片
  THREE_ID: 8, // 360环物
  AR_ID: 9, // ar
  MULTIFUNCTION: 9, // 多功能
}
HOTSPOT[HOTSPOT.TEXT_IN_ID] = { type: 'TEXT_IN_ID', text: '内置文字' }
HOTSPOT[HOTSPOT.IMAGE_IN_ID] = { type: 'IMAGE_IN_ID', text: '内置图片' }
HOTSPOT[HOTSPOT.VIDEO_IN_ID] = { type: 'VIDEO_IN_ID', text: '内置视频' }
HOTSPOT[HOTSPOT.ROAM_ID] = { type: 'ROAM_ID', text: '漫游' }
HOTSPOT[HOTSPOT.LINK_ID] = { type: 'LINK_ID', text: '链接' }
HOTSPOT[HOTSPOT.ARTICLE_ID] = { type: 'ARTICLE_ID', text: '图文' }
HOTSPOT[HOTSPOT.AUDIO_ID] = { type: 'AUDIO_ID', text: '音乐' }
HOTSPOT[HOTSPOT.VIDEO_ID] = { type: 'VIDEO_ID', text: '视频' }
HOTSPOT[HOTSPOT.MARK_ID] = { type: 'MARK_ID', text: '标记' }
HOTSPOT[HOTSPOT.IMAGE_ID] = { type: 'IMAGE_ID', text: '幻灯片' }
HOTSPOT[HOTSPOT.THREE_ID] = { type: 'THREE_ID', text: '360环物' }
HOTSPOT[HOTSPOT.AR_ID] = { type: 'AR_ID', text: 'ar' }
HOTSPOT[HOTSPOT.MULTIFUNCTION] = { type: 'MULTIFUNCTION', text: '多功能' }

// 视角
export const VIEW_EFFECT = [
  { title: '正常视角', type: 'cm_normal_view' },
  { title: '小行星视角', type: 'cm_littleplanet_view' },
  { title: '球体视角', type: 'skin_view_ball' },
  { title: '超小视角', type: 'cm_pannini_view' },
  { title: '建筑视角', type: 'cm_architectural_view' },
  { title: '立体视角', type: 'cm_stereographic_view' },
  { title: '鱼眼视角', type: 'cm_fisheye_view' },
]

// 场景切换效果
export const krpSwithEffect = {
  1: 'BLEND(1.0, easeInCubic)',
  2: 'ZOOMBLEND(2.0, 2.0, easeInOutSine)',
  3: 'COLORBLEND(2.0, 0x000000, easeOutSine)',
  4: 'SLIDEBLEND(1.0, 0.0, 0.2, linear)',
  5: 'SLIDEBLEND(1.0, 90.0, 0.01, linear)',
  6: 'OPENBLEND(1.0, 0.0, 0.2, 0.0, linear)',
  7: null,
}
// 素材类型
export const materialtype = {
  img: 1,
  audio: 2,
  video: 3,
  article: 4,
  three: 5,
  pano: 6,
}
materialtype[materialtype.img] = { text: '图片', id: 1, icon: 'el-icon-picture' }
materialtype[materialtype.audio] = { text: '音频', id: 2, icon: 'iconfont icon-Music' }
materialtype[materialtype.video] = { text: '视频', id: 3, icon: 'el-icon-video-camera' }
materialtype[materialtype.article] = { text: '图文', id: 4, icon: 'el-icon-tickets' }
materialtype[materialtype.three] = { text: '环物360', id: 5, icon: 'el-icon-box' }
materialtype[materialtype.pano] = { text: '全景图片', id: 6, icon: 'el-icon-picture' }

// 行业解决方案 类型id
export const BUSINESS = {
  pano: 0, // 全景
  decoration: 1, // 装饰
}
