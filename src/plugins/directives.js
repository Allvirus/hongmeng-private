import Vue from "vue";
import Scroll from "./lib/scroll";
import utils from "./utils";

const resolvePermissionResult = binding => {
  const value = binding.value;

  if (Array.isArray(value)) {
    return utils.hasAnyPerm(value);
  }

  if (value && typeof value === "object") {
    const { allOf, anyOf, code } = value;
    if (Array.isArray(allOf)) {
      return utils.hasAllPerm(allOf);
    }
    if (Array.isArray(anyOf)) {
      return utils.hasAnyPerm(anyOf);
    }
    return utils.hasPerm(code);
  }

  return utils.hasPerm(value);
};

const setElementVisible = (el, visible) => {
  if (visible) {
    el.style.display = el.__vPermissionDisplay || "";
    return;
  }

  if (typeof el.__vPermissionDisplay === "undefined") {
    el.__vPermissionDisplay = el.style.display;
  }
  el.style.display = "none";
};

const setElementDisabled = (el, disabled) => {
  const buttonEl = el.tagName === "BUTTON" ? el : el.querySelector("button");
  if (buttonEl) {
    buttonEl.disabled = disabled;
    buttonEl.classList.toggle("is-disabled", disabled);
  }
  el.classList.toggle("is-disabled", disabled);
  el.style.pointerEvents = disabled ? "none" : "";
  el.style.opacity = disabled ? "0.6" : "";
};

const bindPermissionDirective = mode => ({
  inserted(el, binding) {
    const hasPermission = resolvePermissionResult(binding);
    if (mode === "disable") {
      setElementDisabled(el, !hasPermission);
      return;
    }
    setElementVisible(el, hasPermission);
  },
  update(el, binding) {
    const hasPermission = resolvePermissionResult(binding);
    if (mode === "disable") {
      setElementDisabled(el, !hasPermission);
      return;
    }
    setElementVisible(el, hasPermission);
  }
});

/**
 * 鼠标滑动可滚动的元素 v-slide.x.wheel
 * @param {v-slide.x|y} 在x|Y轴拖动
 * @param {v-slide.wheel} 是否滚轮控制x轴滚动 默认不滚动
 * @param {v-slide.x=value:300} 惯性速度越大滑动越快越远
 */
Vue.directive("slide", {
  bind(el, binding, vnode) {
    const { x, wheel } = binding.modifiers;
    const _speed = binding.value || 300;

    const scrollDirection = x ? "scrollLeft" : "scrollTop";
    const axis = x ? "clientX" : "clientY";

    const scrollSize = x ? "scrollWidth" : "scrollHeight";
    const clientSize = x ? "clientWidth" : "clientHeight";
    // 获取可滚动长
    const getCanScrollSize = () => distEl[scrollSize] - distEl[clientSize];

    // 目标元素
    const distEl = el.querySelector(".el-table__body-wrapper") || el;
    // 滚轮滚动
    wheel &&
      el.addEventListener("mousewheel", evt => {
        distEl[scrollDirection] -= evt.wheelDeltaY;
        evt.preventDefault();
      });

    // 鼠标拖动
    let position, distElScrollPostion, startTime, isMouseDownAtEl; // 鼠标按下时状态: 坐标轴位置 滚动条位置 惯性开始时间 是否鼠标按下在el

    const mousedownCb = evt => {
      if (!getCanScrollSize()) return;
      isMouseDownAtEl = true;
      evt.preventDefault(); // 阻止拖拽|选择文本
      // 记录状态
      startTime = Date.now();
      position = evt[axis];
      distElScrollPostion = distEl[scrollDirection];
      // window添加拖动
      window.addEventListener("mousemove", slideStart);
    };

    el.addEventListener("mousedown", mousedownCb);

    const slideStart = evt => {
      // chrome bug
      if (position === evt[axis]) return;
      el.style.pointerEvents = "none"; // 阻止点击
      document.body.style.userSelect = "none";

      evt.preventDefault(); // 阻止选择文本
      distEl[scrollDirection] = distElScrollPostion - (evt[axis] - position);
    };

    window.addEventListener("mouseup", evt => {
      if (isMouseDownAtEl) {
        isMouseDownAtEl = false;
        // window移除滑动
        const distance = evt[axis] - position;
        const timeCost = Date.now() - startTime; // 耗时
        const speed = (distance / timeCost) * _speed; // 速度
        Math.abs(speed) > 60 && inertiaAnimate(speed);
        window.removeEventListener("mousemove", slideStart);
        // 恢复点击
        el.style.pointerEvents = "auto";
        document.body.style.userSelect = "auto";
      }
    });

    // 惯性滚动
    const inertiaAnimate = speed => {
      if (speed) {
        const len = speed / 10;
        speed -= speed / 10;
        Math.abs(speed) < 10 && (speed = 0);
        // 到边界去除惯性
        if (
          getCanScrollSize() === distEl[scrollDirection] ||
          !distEl[scrollDirection]
        ) {
          speed = 0;
        }
        distEl[scrollDirection] -= len;
        requestAnimationFrame(() => inertiaAnimate(speed));
      }
    };
  }
});

// 鼠标模拟移动端滑动 v-scroll.x='bgc'
Vue.directive("scroll", {
  inserted(el, binding, vnode) {
    const { modifiers, value } = binding;
    new Scroll({
      el,
      bar: { x: modifiers.xbar, y: modifiers.ybar, bgc: value },
      direction: modifiers.x ? "x" : modifiers.y ? "y" : "xy"
    }).init();
  }
});

// el-input价格字符输入控制 0.0, 0 不受控制 v-price
Vue.directive("price", {
  inserted(el, binding, vnode) {
    const distEL = el.querySelector("input");
    const replaceFn = (n = 1, val = "", idx = 0) => (match, i) =>
      n > idx++ ? match : val;

    const limit = () => {
      let iptVal = distEL.value;
      iptVal = iptVal
        .replace(/^\.|[^\d.]/g, "") // . 开头 或 非数字与.
        .replace(/^0(?=\d)/, "") // 0开头后数字
        .replace(/\./g, replaceFn())
        .replace(/\..{2,}/g, match => match.slice(0, 3));

      vnode.componentInstance.$emit("input", iptVal);
    };
    distEL.addEventListener("keyup", limit);
    distEL.addEventListener("afterpaste", limit);
    distEL.addEventListener("blur", () => {
      let iptVal = distEL.value;
      if (+iptVal > 0) {
        iptVal = (+iptVal).toFixed(2);
      }
      vnode.componentInstance.$emit("input", iptVal);
    });
  }
});

// el-input 数字输入控制 v-number.zero zero 是否可以0开头 value 最大值
Vue.directive("number", {
  inserted(el, binding, vnode) {
    const { modifiers, value } = binding;
    const distEL = el.querySelector("input");
    const limit = () => {
      // eslint-disable-next-line no-useless-escape
      const reg1 = modifiers.zero ? /[^\d]/g : /^0|[^\d]/g;
      let iptVal = distEL.value;
      iptVal = iptVal.replace(reg1, "");
      if (value) iptVal = Math.min(+iptVal, +value);
      vnode.componentInstance.$emit("input", iptVal);
    };
    distEL.addEventListener("keyup", limit);
    distEL.addEventListener("afterpaste", limit);
  }
});

// v-preview
const hoverPreviewImg = document.createElement("img");
hoverPreviewImg.style.cssText = `border: 3px solid rgba(242, 242, 242, 0.6); 
border-radius: 2px; 
box-shadow: rgb(102, 102, 102) 0px 0px 2px; 
display: none; 
z-index: 9999999; 
max-width: 90%; 
max-height: 90%; 
position: fixed;`;
document.body.appendChild(hoverPreviewImg);
let isPreviewUnbind = false;
Vue.directive("preview", {
  inserted(el, binding, vnode) {
    isPreviewUnbind = false;
    let elRect, timer;
    const setpos = e => {
      if (e.pageY > window.innerHeight / 2) {
        // 鼠标超过下半屏
        hoverPreviewImg.style.top = "auto";
        hoverPreviewImg.style.bottom =
          window.innerHeight -
          Math.max(e.pageY, hoverPreviewImg.height + 30) +
          15 +
          "px";
      } else {
        hoverPreviewImg.style.bottom = "auto";
        hoverPreviewImg.style.top =
          Math.min(e.pageY, window.innerHeight - hoverPreviewImg.height - 30) +
          15 +
          "px";
      }
      if (e.pageX > window.innerWidth / 2) {
        // 鼠标超过左半屏
        hoverPreviewImg.style.left = "auto";
        hoverPreviewImg.style.right =
          window.innerWidth -
          Math.max(e.pageX, hoverPreviewImg.width + 30) +
          15 +
          "px";
      } else {
        hoverPreviewImg.style.right = "auto";
        hoverPreviewImg.style.left =
          Math.min(e.pageX, window.innerWidth - hoverPreviewImg.width - 30) +
          15 +
          "px";
      }
    };
    const move = e => {
      setpos(e);
      // 鼠标移出图片范围
      if (
        e.clientX < elRect.left ||
        e.clientX > elRect.left + elRect.width ||
        e.clientY < elRect.top ||
        e.clientY > elRect.top + elRect.height
      ) {
        window.removeEventListener("mousemove", move);
        hoverPreviewImg.style.display = "none";
        el.style.outline = "none";
      }
    };
    const hoverShow = e => {
      if (isPreviewUnbind) return;
      elRect = JSON.parse(JSON.stringify(el.getBoundingClientRect()));
      elRect.left = Math.min(e.clientX, elRect.left);
      elRect.top = Math.min(e.clientY, elRect.top);
      timer = setTimeout(() => {
        hoverPreviewImg.src = el.src;
        hoverPreviewImg.style.display = "block";
        el.style.outline = "1px dashed red";
        setpos(e);
      }, 500);
      window.addEventListener("mousemove", move);
    };
    el.addEventListener("mouseover", hoverShow);
    el.addEventListener("mouseout", () => {
      window.removeEventListener("mousemove", move);
      clearTimeout(timer);
      hoverPreviewImg.style.display = "none";
      el.style.outline = "none";
    });
  },
  unbind() {
    isPreviewUnbind = true;
  }
});

Vue.directive("permission", bindPermissionDirective("visible"));

Vue.directive("permission-disable", bindPermissionDirective("disable"));
