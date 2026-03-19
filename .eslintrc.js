module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  globals: {
    wx: true,
    $globalconfig: true
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": [
      process.env.NODE_ENV === "production" ? "error" : "warn"
    ],
    camelcase: "off",
    // 关闭常见格式类规则，避免本地开发时频繁报错
    "space-before-function-paren": "off",
    indent: "off",
    semi: "off",
    quotes: "off",
    "eol-last": "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off",
    "key-spacing": "off",
    "object-curly-spacing": "off",
    "space-before-blocks": "off",
    "keyword-spacing": "off",
    "spaced-comment": "off",
    "comma-spacing": "off",
    "space-infix-ops": "off",
    "comma-dangle": "off",
    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "emits",
          "setup",
          "fetch",
          "asyncData",
          "data",
          "head",
          "computed",
          "watch",
          "watchQuery",
          "LIFECYCLE_HOOKS",
          "methods",
          ["template", "render"],
          "renderError"
        ]
      }
    ]
  }
};
