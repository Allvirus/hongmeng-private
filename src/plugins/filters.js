import Vue from "vue";
/**
 * dateFormat 时间过滤
 * @param {String} type date,minute
 *
 */
Vue.filter("dateFormat", (val, type) => {
  if (!val) return "";
  if (type === "date") {
    return val.substr(0, 10);
  } else if (type === "minute") {
    return val.replace(/t/gi, " ").substr(0, 16);
  } else {
    return val.replace(/t/gi, " ").split(".")[0];
  }
});

Vue.filter("amountFormat", val => {
  if (val >= 1000) {
    return (val / 10000).toFixed(1) + "w";
  }
  return val;
});

Vue.filter("filePrefix", val => {
  if (val.slice(0, 4) !== "http") {
    val = window.$globalconfig.CLOUD_FILE_API + "files/" + val;
  }
  return val;
});

// 保留几位小数 默认二位 {{val | toFixed(2) }}
Vue.filter("toFixed", (val, num = 2) => {
  if (!isNaN(val)) val = (+val).toFixed(num);
  return val;
});

const weekFormatData = {
  1: { id: "1", label: "周一" },
  2: { id: "2", label: "周二" },
  3: { id: "3", label: "周三" },
  4: { id: "4", label: "周四" },
  5: { id: "5", label: "周五" },
  6: { id: "6", label: "周六" },
  0: { id: "0", label: "周日" },
  7: { id: "7", label: "周日" }
};
// 星期 格式化 '0,1,2,3,4,5,6'
Vue.filter("weekFormat", val => {
  weekFormatData["7"] = { id: "7", label: "周日" };
  if (!val) return "";
  val = val.replace("0", "7");
  const arrNum = val.split(",");
  const arr = arrNum.sort().map(day => weekFormatData[day].label);
  if (arr[0] === "周日") arr.push(arr.splice(0, 1));
  if (arrNum.length >= 3) {
    let flag = true;
    arrNum.reduce((pre, item) => {
      if (Math.abs(pre - item) !== 1) flag = false;
      return item;
    });
    if (flag) {
      return (
        weekFormatData[arrNum[0]].label +
        "至" +
        weekFormatData[arrNum[arrNum.length - 1]].label
      );
    }
  }
  return arr.join(", ");
});

// 账号等级
const levels = {
  1: "倔强青铜3",
  2: "倔强青铜2",
  3: "倔强青铜1",
  4: "秩序白银3",
  5: "秩序白银2",
  6: "秩序白银1",
  7: "荣耀黄金3",
  8: "荣耀黄金2",
  9: "荣耀黄金1",
  10: "尊贵铂金4",
  11: "尊贵铂金3",
  12: "尊贵铂金2",
  13: "尊贵铂金1",
  14: "永恒钻石5",
  15: "永恒钻石4",
  16: "永恒钻石3",
  17: "永恒钻石2",
  18: "永恒钻石1",
  19: "至尊星耀5",
  20: "至尊星耀4",
  21: "至尊星耀3",
  22: "至尊星耀2",
  23: "至尊星耀1",
  24: "超凡大师",
  25: "傲世宗师",
  26: "荣耀王者",
  27: "最强王者",
  28: "天选之子",
  29: "殿堂传奇",
  30: "九五至尊"
};
// 等级转换成青铜、白银等文本
Vue.filter("formatLevel", lev => {
  return levels[lev];
});

// 等级转换成徽章
Vue.filter("formatBadge", lev => {
  if (lev >= 7) {
    return require("@/assets/img/badge_gold.png");
  } else if (lev >= 4 && lev < 7) {
    return require("@/assets/img/badge_silver.png");
  } else {
    return require("@/assets/img/badge_bronze.png");
  }
});

// 岗位类型
const jobs = {
  0: "A岗",
  1: "B岗",
  2: "C岗",
  3: "后勤"
};
Vue.filter("formatJob", job => {
  return jobs[job];
});

Vue.filter("formatOSType", type => {
  return type === 1 ? "IOS" : "Android";
});

// 货币格式例如: 6535874元 转换成6,535,874元
Vue.filter("formatNumber", val => {
  return parseFloat(val).toLocaleString();
});
