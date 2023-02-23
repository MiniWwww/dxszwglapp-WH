if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
      throw reason;
    }));
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$8 = {
    data() {
      return {
        title: "Hello"
      };
    },
    onLoad() {
    },
    methods: {}
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("image", {
        class: "logo",
        src: "/static/logo.png"
      }),
      vue.createElementVNode("view", { class: "text-area" }, [
        vue.createElementVNode("text", { class: "title" }, vue.toDisplayString($data.title), 1)
      ])
    ]);
  }
  var PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/index/index.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main$7 = {
    props: {
      border: {
        type: String,
        default: "1"
      },
      borderColor: {
        type: String,
        default: "#d0dee5"
      },
      isCheck: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        table: this
      };
    },
    data() {
      return {};
    },
    created() {
      this.childrens = [];
      this.index = 0;
    },
    methods: {
      fire(e, index, len) {
        let childrens = this.childrens;
        formatAppLog("log", "at pages/todolist/components/t-table/t-table.vue:38", childrens);
        if (index === 0) {
          childrens.map((vm, index2) => {
            vm.checkboxData.checked = e;
            return vm;
          });
        } else {
          let isAll = childrens.find((n, ids) => ids !== 0 && !n.checkboxData.checked);
          childrens[0].checkboxData.checked = isAll ? false : true;
        }
        let fireArr = [];
        for (let i = 0; i < childrens.length; i++) {
          if (childrens[i].checkboxData.checked && i !== 0) {
            fireArr.push(childrens[i].checkboxData.value - 1);
          }
        }
        this.$emit("change", {
          detail: fireArr
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "t-table",
      style: vue.normalizeStyle({ "border-width": $props.border + "px", "border-color": $props.borderColor })
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 4);
  }
  var tTable = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-d527ddf8"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/todolist/components/t-table/t-table.vue"]]);
  const _sfc_main$6 = {
    props: {
      align: String
    },
    data() {
      return {
        thBorder: "1",
        borderColor: "#d0dee5",
        fontSize: "15",
        color: "#3b4246",
        thAlign: "center"
      };
    },
    inject: ["table", "tr"],
    created() {
      this.thBorder = this.table.border;
      this.borderColor = this.table.borderColor;
      this.fontSize = this.tr.fontSize;
      this.color = this.tr.color;
      if (this.align) {
        this.thAlign = this.align;
      } else {
        this.thAlign = this.tr.align;
      }
    },
    computed: {
      thAlignCpd() {
        let nameAlign = "";
        switch (this.thAlign) {
          case "left":
            nameAlign = "flex-start";
            break;
          case "center":
            nameAlign = "center";
            break;
          case "right":
            nameAlign = "flex-end";
            break;
          default:
            nameAlign = "center";
            break;
        }
        return nameAlign;
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "t-th",
      style: vue.normalizeStyle({ "border-width": $data.thBorder + "px", "border-color": $data.borderColor, "font-size": $data.fontSize + "px", "color": $data.color, "justify-content": $options.thAlignCpd })
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 4);
  }
  var tTh = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-54bc422e"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/todolist/components/t-table/t-th.vue"]]);
  const _sfc_main$5 = {
    props: {
      fontSize: String,
      color: String,
      align: String
    },
    inject: ["table"],
    provide() {
      return {
        tr: this
      };
    },
    data() {
      return {
        isCheck: false,
        checkboxData: {
          value: 0,
          checked: false
        },
        checked: false,
        thBorder: "1",
        borderColor: "#d0dee5"
      };
    },
    created() {
      this.thBorder = this.table.border;
      this.borderColor = this.table.borderColor;
      this.table.childrens.push(this);
      this.checkboxData.value = this.table.index++;
      this.isCheck = this.table.isCheck;
    },
    methods: {
      checkboxChange(e) {
        this.checkboxData.checked = !this.checkboxData.checked;
        this.table.childrens[this.checkboxData.value] = this;
        this.table.fire(e.detail.value[0] ? true : false, this.checkboxData.value, this.table.index);
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "t-tr" }, [
      $data.isCheck ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "t-check-box",
        style: vue.normalizeStyle({ "border-width": $data.thBorder + "px", "border-color": $data.borderColor })
      }, [
        vue.createElementVNode("checkbox-group", {
          onChange: _cache[0] || (_cache[0] = (...args) => $options.checkboxChange && $options.checkboxChange(...args))
        }, [
          vue.createElementVNode("checkbox", {
            value: $data.checkboxData.value + "",
            checked: $data.checkboxData.checked
          }, null, 8, ["value", "checked"])
        ], 32)
      ], 4)) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  var tTr = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-55492d38"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/todolist/components/t-table/t-tr.vue"]]);
  const _sfc_main$4 = {
    props: {
      align: String
    },
    data() {
      return {
        thBorder: "1",
        borderColor: "#d0dee5",
        fontSize: "14",
        color: "#555c60",
        tdAlign: "center"
      };
    },
    inject: ["table", "tr"],
    created() {
      this.thBorder = this.table.border;
      this.borderColor = this.table.borderColor;
      this.fontSize = this.tr.fontSize;
      this.color = this.tr.color;
      if (this.align) {
        this.tdAlign = this.align;
      } else {
        this.tdAlign = this.tr.align;
      }
    },
    computed: {
      tdAlignCpd() {
        let nameAlign = "";
        switch (this.tdAlign) {
          case "left":
            nameAlign = "flex-start";
            break;
          case "center":
            nameAlign = "center";
            break;
          case "right":
            nameAlign = "flex-end";
            break;
          default:
            nameAlign = "center";
            break;
        }
        return nameAlign;
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "t-td",
      style: vue.normalizeStyle({ "border-width": $data.thBorder + "px", "border-color": $data.borderColor, "font-size": $data.fontSize + "px", "color": $data.color, "justify-content": $options.tdAlignCpd })
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 4);
  }
  var tTd = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-5483e42a"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/todolist/components/t-table/t-td.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        user: {
          time: "",
          place: "",
          event: ""
        },
        Update: {
          time: "",
          place: "",
          event: ""
        },
        item: {},
        showUI: true,
        show: false,
        selectArr: [],
        allSelectLength: "",
        tableList: []
      };
    },
    components: {
      tTable,
      tTh,
      tTr,
      tTd
    },
    methods: {
      addDate() {
        formatAppLog("log", "at pages/todolist/todolist.vue:113", this.user);
        if (this.user) {
          this.tableList.push(this.user);
          this.user = {};
        }
      },
      allDel() {
        this.tableList = [];
      },
      done(item) {
        this.tableList.splice(item, 1);
      },
      update(item) {
        this.show = true;
        this.item = item;
        this.showUI = false;
      },
      confirm() {
        this.item.time = this.Update.time;
        this.item.place = this.Update.place;
        this.item.event = this.Update.event;
        this.show = false;
        this.Update = {};
        this.showUI = true;
      },
      change(e) {
        this.selectArr = e.detail;
      },
      selectDel() {
        let arr = [];
        let len = this.tableList.length;
        for (let i = 0; i < len; i++) {
          if (this.selectArr.indexOf(i) >= 0) {
            this.selectArr.indexOf(i);
          } else {
            arr.push(this.tableList[i]);
          }
        }
        this.tableList = arr;
        this.selectArr = [];
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_t_th = vue.resolveComponent("t-th");
    const _component_t_tr = vue.resolveComponent("t-tr");
    const _component_t_td = vue.resolveComponent("t-td");
    const _component_t_table = vue.resolveComponent("t-table");
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { class: "text" }, "\u6DFB\u52A0todo"),
      vue.createElementVNode("view", { class: "addDataBox" }, [
        $data.showUI ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "group"
        }, [
          vue.createElementVNode("text", null, "\u65F6\u95F4:"),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.user.time = $event),
            placeholder: "\u65F6\u95F4"
          }, null, 512), [
            [vue.vModelText, $data.user.time]
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.showUI ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "group"
        }, [
          vue.createElementVNode("text", null, "\u5730\u70B9:"),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.user.place = $event),
            placeholder: "\u5730\u70B9"
          }, null, 512), [
            [vue.vModelText, $data.user.place]
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.showUI ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "group"
        }, [
          vue.createElementVNode("text", null, "\u4E8B\u4EF6:"),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "text",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.user.event = $event),
            placeholder: "\u4E8B\u4EF6"
          }, null, 512), [
            [vue.vModelText, $data.user.event]
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("button", {
          type: "primary",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.addDate && $options.addDate(...args))
        }, "\u6DFB\u52A0\u4E8B\u4EF6")
      ]),
      vue.createCommentVNode("\u8868\u5355\u63D2\u4EF6\uFF1A https://ext.dcloud.net.cn/plugin?id=413 "),
      vue.createElementVNode("view", { class: "userList" }, [
        vue.createElementVNode("view", { class: "warp" }, [
          vue.createElementVNode("view", { class: "box" }, [
            vue.createElementVNode("view", { class: "title text" }, "\u4E8B\u4EF6\u5217\u8868"),
            vue.createVNode(_component_t_table, {
              border: "2",
              "border-color": "#95b99e",
              "is-check": true,
              onChange: $options.change
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_t_tr, {
                  "font-size": "16",
                  color: "#95b99e",
                  align: "left"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_t_th, { align: "center" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u65F6\u95F4")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_t_th, { align: "center" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u5730\u70B9")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_t_th, { align: "center" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u4E8B\u4EF6")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_t_th, { align: "center" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u64CD\u4F5C")
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_t_th, { align: "center" }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("\u64CD\u4F5C")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.tableList, (item) => {
                  return vue.openBlock(), vue.createBlock(_component_t_tr, {
                    "font-size": "14",
                    color: "#9fbda5",
                    align: "right",
                    key: item.id
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_t_td, { align: "center" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(item.time), 1)
                        ]),
                        _: 2
                      }, 1024),
                      vue.createVNode(_component_t_td, { align: "center" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(item.place), 1)
                        ]),
                        _: 2
                      }, 1024),
                      vue.createVNode(_component_t_td, { align: "center" }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(item.event), 1)
                        ]),
                        _: 2
                      }, 1024),
                      vue.createVNode(_component_t_td, { align: "center" }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("button", {
                            style: { "height": "50upx", "line-height": "50upx" },
                            size: "mini",
                            type: "primary",
                            onClick: ($event) => $options.done(item)
                          }, "\u5DF2\u5B8C\u6210", 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1024),
                      vue.createVNode(_component_t_td, { align: "center" }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("button", {
                            style: { "height": "50upx", "line-height": "50upx" },
                            size: "mini",
                            type: "primary",
                            onClick: ($event) => $options.update(item)
                          }, "\u4FEE\u6539", 8, ["onClick"])
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            }, 8, ["onChange"])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "btn-group" }, [
        vue.createElementVNode("button", {
          type: "warn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.allDel && $options.allDel(...args))
        }, "\u6E05\u7A7A\u6570\u636E"),
        vue.createElementVNode("button", {
          type: "warn",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.selectDel && $options.selectDel(...args))
        }, "\u6279\u91CF\u5220\u9664")
      ]),
      vue.createCommentVNode(" \u4FEE\u6539\u6570\u636E\u7684\u5F39\u7A97 "),
      $data.show ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "popupWindow"
      }, [
        vue.createElementVNode("text", null, "\u65F6\u95F4:"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "input",
          type: "text",
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.Update.time = $event),
          placeholder: "\u8BF7\u8F93\u5165\u65F6\u95F4"
        }, null, 512), [
          [vue.vModelText, $data.Update.time]
        ]),
        vue.createElementVNode("text", null, "\u5730\u70B9:"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "input",
          type: "text",
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.Update.place = $event),
          placeholder: "\u8BF7\u8F93\u5165\u5730\u70B9"
        }, null, 512), [
          [vue.vModelText, $data.Update.place]
        ]),
        vue.createElementVNode("text", null, "\u4E8B\u4EF6:"),
        vue.withDirectives(vue.createElementVNode("input", {
          class: "input",
          type: "text",
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.Update.event = $event),
          placeholder: "\u8BF7\u8F93\u5165\u4E8B\u4EF6"
        }, null, 512), [
          [vue.vModelText, $data.Update.event]
        ]),
        vue.createElementVNode("button", {
          type: "primary",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.confirm && $options.confirm(...args))
        }, "\u786E\u8BA4")
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  var PagesTodolistTodolist = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/todolist/todolist.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  var PagesSelfRecordSelfRecord = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/self-record/self-record.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  var PagesSelfManageSelfManage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/self-manage/self-manage.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/todolist/todolist", PagesTodolistTodolist);
  __definePage("pages/self-record/self-record", PagesSelfRecordSelfRecord);
  __definePage("pages/self-manage/self-manage", PagesSelfManageSelfManage);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
