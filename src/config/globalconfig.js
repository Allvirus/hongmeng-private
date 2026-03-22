import router from "@/router";
const DEV_API = "https://localhost:44358/";
const PROD_API = "http://36.151.148.137:5000/";
const BASE_API = process.env.NODE_ENV === "production" ? PROD_API : DEV_API;

window.$globalconfig = {
  API: BASE_API, // 默认请求地址 baseURL
  COPYRIGHT: "Copyright 2016 - 2020 © All Rights Reserved",
  PANO_FILE_API: BASE_API + "api/common/file", // 文件上传 URL
  COOKIE_NAME: "ZhuLangUserAccount",
  COOKIE_DOMAIN: "lxy.hmwl369.com"
};

export function LOGIN() {
  if (router.currentRoute.name !== "Login") {
    router
      .push({
        name: "Login",
        query: { redirect_uri: location.href }
      })
      .catch(() => {});
  }
}
