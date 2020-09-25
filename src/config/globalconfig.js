import router from '@/router'
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
