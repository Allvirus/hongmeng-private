import router from '@/router'
window.$globalconfig = {
  VERSION: '1.0.0.0',
  COPYRIGHT: 'Copyright 2016 - 2020 © 逐浪网络 All Rights Reserved 闽ICP备17006851号',
  PANO_LOGIN_API: 'https://editor.vgoyun.com/user/login',
  API: 'http://lxy.gxzlwl.com/',
  '3DVIEW_URL': 'http://3d.vgoyun.com/',
  USER_URL: 'http://manage.vgoyun.com/',
  PANO_FILE_API: 'http://lxy.gxzlwl.com/api/common/file',
  COOKIE_NAME: 'ZhuLangUserAccount',
  COOKIE_DOMAIN: 'lxy.hmwl369.com',
}
$globalconfig.UPLOAD_IMAGE_PREFIX = $globalconfig.CLOUD_FILE_API + 'api/images/upload'
$globalconfig.UPLOAD_FILE_PREFIX = $globalconfig.CLOUD_FILE_API + 'api/files/upload'
$globalconfig.FILE_PREFIX = $globalconfig.CLOUD_FILE_API + 'files/'

export function LOGIN () {
  if (router.currentRoute.name !== 'Login') {
    router.push({
      name: 'Login',
      query: { redirect_uri: location.href },
    })
  }
}
// $globalconfig.COOKIE_DOMAIN = document.domain.split('.').slice(-2).join('.')
// $globalconfig.COOKIE_NAME = 'ZhuLangUserAccount'
