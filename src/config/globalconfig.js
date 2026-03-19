import router from "@/router";
window.$globalconfig = {
  //API: "https://localhost:44358/", // 默认请求地址 baseURL
  API: "http://47.120.40.127:5000//", // 默认请求地址 baseURL
  COPYRIGHT: "Copyright 2016 - 2020 © All Rights Reserved",
  PANO_FILE_API: "http://47.120.40.127:5000/api/common/file", // 文件上传 URL
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
