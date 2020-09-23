// > 1.场景漫游（type_id = 1）
import { HOTSPOT } from '@/config'
const common = {
  is_vertical_text: false, // 是否竖排文字
  background_color: '#000', // 热点背景颜色
}
const option1 = {
  ...common,
  // title: '', // 场景名称
  scene_id: 10002, // 场景id
}
// > 2.超链接（type_id = 2）
const option2 = {
  ...common,
  url: '', // 超链接地址必须以http或https
  is_open_window: true, // 是否内外弹模式
}
// > 3.图文信息（type_id = 3）.环物360（type_id = 8）
const option3 = {
  ...common,
  title: '', // 图文信息标题或环物标题
  material_id: 3, // 素材库id
}
// > 4.音频语音（type_id = 4）.视频影音（type_id = 5）
const option4 = {
  ...common,
  title: '', // 音频语音标题或视频影音标题
  file_id: '', // 素材库媒体源文件id8d992d75c5604ac582a5c7d6a19139f7
}
// > 5.场景标注（type_id = 6）
const option5 = {
  ...common,
  mark_color: '#000', // 场景标注颜色
}
// > 6.幻灯片（type_id = 7）
const option6 = {
  ...common,
  image_list: [], // 幻灯片图片id集合，不超过50张{ file_id: '940f0fc6acdc401391bdfe32cd212dd7' }, { file_id: '867f7f1db4a14317beba70ac9ac5e0c2' }
}
// > 7.AR动画（type_id = 9）
const option7 = {
  width: 50, // 宽度
  height: 30, // 高度
  rx: 0, // 三维旋转度(上.下) -360~360
  ry: 0, // 三维旋转度(左.右) -360~360
  rotate: 0, // 热点旋转角度  -360~360
  scale: 0.5, // 缩放 0.1~2.0
}
// > 8.多功能（type_id = 10）
const option8 = {
  ...common,
  gif_image_id: '', // gif动画图片id
  material360_items: [], // 360环物列表，最多6个{ title: 'toyota', material_id: 356 }, { title: '手机', material_id: 403 }
  richtext_item: { title: '图文', material_id: 146 }, // 富文本
  audio_item: { title: '', file_id: '' }, // 音频
  video_item: { title: '', file_id: '' }, // 视频
  slide_item: { image_list: [] }, // 幻灯片图片id集合，不超过50张{ file_id: '97c77eb93174421794c832291c91836a' }
}
// > 9.内嵌文字（type_id = 101）
const option9 = {
  color: '#000', // 文字颜色
  size: 99, // 热点文字大小 10~100
  rx: 65, // 三维旋转度(上.下) -360~360
  ry: 52, // 三维旋转度(左.右) -360~360
  rotate: 3, // 热点旋转角度  -360~360
  scale: 0.5, // 缩放 0.1~2.0
}
// > 10.内嵌图片（type_id = 102）,内嵌视频（type_id = 103）
const option10 = {
  title: '', // 内嵌图片.视频标题
  file_id: '', // 素材库媒体文件id
  width: 50, // 宽度
  height: 30, // 高度
  rx: 45, // 三维旋转度(上.下) -360~360
  ry: 67, // 三维旋转度(左.右) -360~360
  rotate: 6, // 热点旋转角度  -360~360
  scale: 0.5, // 缩放 0.1~2.0
}

export default {
  [HOTSPOT.TEXT_IN_ID]: option9, // 内置文字  101
  [HOTSPOT.IMAGE_IN_ID]: option10, // 内置图片  102
  [HOTSPOT.VIDEO_IN_ID]: option10, // 内置视频  103
  [HOTSPOT.ROAM_ID]: option1, // 漫游  1
  [HOTSPOT.LINK_ID]: option2, // 链接  2
  [HOTSPOT.ARTICLE_ID]: option3, // 图文  3
  [HOTSPOT.AUDIO_ID]: option4, // 音乐  4
  [HOTSPOT.VIDEO_ID]: option4, // 视频  5
  [HOTSPOT.MARK_ID]: option5, // 标记  6
  [HOTSPOT.IMAGE_ID]: option6, // 幻灯片  7
  [HOTSPOT.THREE_ID]: option3, // 360环物  8
  [HOTSPOT.AR_ID]: option7, // ar  9
  [HOTSPOT.MULTIFUNCTION]: option8, // 多功能  10
}
