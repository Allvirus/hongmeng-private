import Vue from "vue";
import store from "@/store";

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

Vue.filter("toFixed", (val, num = 2) => {
  if (!isNaN(val)) val = (+val).toFixed(num);
  return val;
});

const weekFormatData = {
  0: { id: "0", label: "周日" },
  1: { id: "1", label: "周一" },
  2: { id: "2", label: "周二" },
  3: { id: "3", label: "周三" },
  4: { id: "4", label: "周四" },
  5: { id: "5", label: "周五" },
  6: { id: "6", label: "周六" },
  7: { id: "7", label: "周日" }
};

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

const levels = {
  1: "倔强青铜3",
  2: "倔强青铜2",
  3: "倔强青铜1",
  4: "秩序白银3",
  5: "秩序白银2",
  6: "秩序白银1",
  7: "荣耀黄金4",
  8: "荣耀黄金3",
  9: "荣耀黄金2",
  10: "荣耀黄金1",
  11: "尊贵铂金4",
  12: "尊贵铂金3",
  13: "尊贵铂金2",
  14: "尊贵铂金1",
  15: "永恒钻石5",
  16: "永恒钻石4",
  17: "永恒钻石3",
  18: "永恒钻石2",
  19: "永恒钻石1",
  20: "至尊星耀5",
  21: "至尊星耀4",
  22: "至尊星耀3",
  23: "至尊星耀2",
  24: "至尊星耀1",
  25: "超凡大师",
  26: "傲世宗师",
  27: "荣耀王者",
  28: "最强王者",
  29: "天选之子",
  30: "殿堂传奇",
  31: "九五至尊"
};

const getLevelName = lev => {
  const levelNameMap =
    store.state.app && store.state.app.levelNameMap
      ? store.state.app.levelNameMap
      : {};

  return levelNameMap[lev] || levels[lev];
};

Vue.filter("formatLevel", lev => {
  return getLevelName(lev);
});

Vue.filter("formatBadge", lev => {
  if (lev >= 7) {
    return require("@/assets/img/badge_gold.png");
  } else if (lev >= 4 && lev < 7) {
    return require("@/assets/img/badge_silver.png");
  } else {
    return require("@/assets/img/badge_bronze.png");
  }
});

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

Vue.filter("formatNumber", val => {
  return parseFloat(val).toLocaleString();
});
