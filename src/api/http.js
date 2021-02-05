import axios from 'axios'
import vgo from '@/plugins/bus'
import utils from '@/plugins/utils'
import { LOGIN } from '../config/globalconfig'

const axiosInstance = axios.create({
  baseURL: $globalconfig.API,
  timeout: 0,
})
/**
 * axios 请求封装
 * @param {String} method http请求方法
 * @param {String} url http请求url 默认前缀 window.$globalconfig.API
 * @param {Object} [config={loading = true, token = true}]  axios 请求配置 loading 是否打开加载提示 token 是否携带token  (https://www.kancloud.cn/yunye/axios/234845)
 * @returns {Promise}
 */
export const http = (method, url, config = {}) => {
  const { loading = false, token = true } = config
  // 是否需要token
  if (token) {
    const tk = utils.getToken()
    if (!tk) return Promise.reject(tk)
    config.headers = Object.assign(config.headers || {}, { Authorization: tk })
  }

  // 是否打开加载提示
  if (loading) vgo.openLoading()

  return axiosInstance(Object.assign(config, { method, url })).then(({ data }) => {
    if (+data.code === 200 && 'registerCount' in data) {
      return data
    }
    if (+data.code === 200 || +data.code === 100) {
      return data.data ? data.data : data
    } else if (!('code' in data)) {
      return data
    } else if (data.msg) {
      vgo.tip(data.msg, 'error')
      return Promise.reject(data)
    }
  }).catch(err => {
    // 对响应错误做点什么
    const { status } = err.response
    console.log('----', status, err.response.data)
    if (status === 401) LOGIN()
    if (status === 403) vgo.tip('您没有操作权限!', 'warning')
    if (status === 400) {
      if (err.response.data.data && err.response.data.data.errorMsg) {
        vgo.tip(err.response.data.data.errorMsg, 'error')
      } else if (err.response.data.data && err.response.data.data[0].description) {
        vgo.tip(err.response.data.data[0].description, 'error')
      } else if (err.response.data) {
        vgo.tip(err.response.data, 'error')
      }
    }
    return Promise.reject(err.response.data)
  }).finally(() => {
    // 最后处理关闭loading
    if (loading) vgo.closeLoading()
  })
}

const onUploadProgressDefault = (e, num) => {
  const precent = e.loaded / e.total
  if (precent < 1) {
    vgo.loading.text = `当前上传${num}项(单次上传限制10项), 已上传: ${(precent * 100).toFixed(1)}%`
  } else {
    vgo.loading.text = '文件已上传成功, 正在云端处理~ 请耐心等待!'
  }
}

/**
 * 文件上传接口
 * @param {Array|File} fileList element-ui fileObject
 * @param {String} action
 * @param {Object} [options={appendObj,isPicture,url,onUploadProgress}]
 *  options.appendObj formData 携带的数据
 *  options.isPicture 上传类型 true图片 false文件
 *  options.url 请求url
 *  options.onUploadProgress 上传进度回调函数, 返回上传 percent, event
 * @returns {Promise}
 */
export const uploadApi = (fileList, action, options = {}) => {
  const { isPicture = true, appendObj = {}, url, onUploadProgress, key = 'files' } = options
  const formData = new FormData()
  action && formData.append('action', action)
  for (const key in appendObj) {
    formData.append(key, appendObj[key])
  }
  const arr = Array.isArray(fileList) ? fileList.map(it => it.raw) : [fileList.raw]
  arr.forEach((item) => {
    formData.append(key, item)
  })

  return http('post', url || (isPicture ? $globalconfig.PANO_FILE_API : $globalconfig.PANO_FILE_API), {
    'Content-Type': 'multipart/form-data',
    timeout: 0,
    onUploadProgress: e => {
      if (onUploadProgress) onUploadProgress((e.loaded / e.total * 100).toFixed(1), e)
      else onUploadProgressDefault(e, fileList.length || 1)
    },
    data: formData,
    loading: !onUploadProgress,
  })
}

// 获取上传action
// https://cloudfs.vgoyun.com/api/file/configs?token=
0 && window.open(`https://cloudfs.vgoyun.com/api/file/configs?token=${utils.getToken()}`)
