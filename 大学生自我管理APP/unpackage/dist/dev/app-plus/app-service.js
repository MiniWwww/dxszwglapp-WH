var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$f = {
    name: "uniTh",
    options: {
      virtualHost: true
    },
    components: {},
    emits: ["sort-change", "filter-change"],
    props: {
      width: {
        type: [String, Number],
        default: ""
      },
      align: {
        type: String,
        default: "left"
      },
      rowspan: {
        type: [Number, String],
        default: 1
      },
      colspan: {
        type: [Number, String],
        default: 1
      },
      sortable: {
        type: Boolean,
        default: false
      },
      filterType: {
        type: String,
        default: ""
      },
      filterData: {
        type: Array,
        default() {
          return [];
        }
      },
      filterDefaultValue: {
        type: [Array, String],
        default() {
          return "";
        }
      }
    },
    data() {
      return {
        border: false,
        ascending: false,
        descending: false
      };
    },
    computed: {
      customWidth() {
        if (typeof this.width === "number") {
          return this.width;
        } else if (typeof this.width === "string") {
          let regexHaveUnitPx = new RegExp(/^[1-9][0-9]*px$/g);
          let regexHaveUnitRpx = new RegExp(/^[1-9][0-9]*rpx$/g);
          let regexHaveNotUnit = new RegExp(/^[1-9][0-9]*$/g);
          if (this.width.match(regexHaveUnitPx) !== null) {
            return this.width.replace("px", "");
          } else if (this.width.match(regexHaveUnitRpx) !== null) {
            let numberRpx = Number(this.width.replace("rpx", ""));
            let widthCoe = uni.getSystemInfoSync().screenWidth / 750;
            return Math.round(numberRpx * widthCoe);
          } else if (this.width.match(regexHaveNotUnit) !== null) {
            return this.width;
          } else {
            return "";
          }
        } else {
          return "";
        }
      },
      contentAlign() {
        let align = "left";
        switch (this.align) {
          case "left":
            align = "flex-start";
            break;
          case "center":
            align = "center";
            break;
          case "right":
            align = "flex-end";
            break;
        }
        return align;
      }
    },
    created() {
      this.root = this.getTable("uniTable");
      this.rootTr = this.getTable("uniTr");
      this.rootTr.minWidthUpdate(this.customWidth ? this.customWidth : 140);
      this.border = this.root.border;
      this.root.thChildren.push(this);
    },
    methods: {
      sort() {
        if (!this.sortable)
          return;
        this.clearOther();
        if (!this.ascending && !this.descending) {
          this.ascending = true;
          this.$emit("sort-change", { order: "ascending" });
          return;
        }
        if (this.ascending && !this.descending) {
          this.ascending = false;
          this.descending = true;
          this.$emit("sort-change", { order: "descending" });
          return;
        }
        if (!this.ascending && this.descending) {
          this.ascending = false;
          this.descending = false;
          this.$emit("sort-change", { order: null });
        }
      },
      ascendingFn() {
        this.clearOther();
        this.ascending = !this.ascending;
        this.descending = false;
        this.$emit("sort-change", { order: this.ascending ? "ascending" : null });
      },
      descendingFn() {
        this.clearOther();
        this.descending = !this.descending;
        this.ascending = false;
        this.$emit("sort-change", { order: this.descending ? "descending" : null });
      },
      clearOther() {
        this.root.thChildren.map((item) => {
          if (item !== this) {
            item.ascending = false;
            item.descending = false;
          }
          return item;
        });
      },
      ondropdown(e) {
        this.$emit("filter-change", e);
      },
      getTable(name) {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["uni-table-th", { "table--border": $data.border }]),
      style: vue.normalizeStyle({ width: $options.customWidth + "px", "text-align": $props.align })
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 6);
  }
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$c], ["__scopeId", "data-v-511e81f9"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-table/components/uni-th/uni-th.vue"]]);
  const _sfc_main$e = {
    name: "TableCheckbox",
    emits: ["checkboxSelected"],
    props: {
      indeterminate: {
        type: Boolean,
        default: false
      },
      checked: {
        type: [Boolean, String],
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        default: -1
      },
      cellData: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    watch: {
      checked(newVal) {
        if (typeof this.checked === "boolean") {
          this.isChecked = newVal;
        } else {
          this.isChecked = true;
        }
      },
      indeterminate(newVal) {
        this.isIndeterminate = newVal;
      }
    },
    data() {
      return {
        isChecked: false,
        isDisabled: false,
        isIndeterminate: false
      };
    },
    created() {
      if (typeof this.checked === "boolean") {
        this.isChecked = this.checked;
      }
      this.isDisabled = this.disabled;
    },
    methods: {
      selected() {
        if (this.isDisabled)
          return;
        this.isIndeterminate = false;
        this.isChecked = !this.isChecked;
        this.$emit("checkboxSelected", {
          checked: this.isChecked,
          data: this.cellData
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-table-checkbox",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.selected && $options.selected(...args))
    }, [
      !$props.indeterminate ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: vue.normalizeClass(["checkbox__inner", { "is-checked": $data.isChecked, "is-disable": $data.isDisabled }])
      }, [
        vue.createElementVNode("view", { class: "checkbox__inner-icon" })
      ], 2)) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "checkbox__inner checkbox--indeterminate"
      }, [
        vue.createElementVNode("view", { class: "checkbox__inner-icon" })
      ]))
    ]);
  }
  var tableCheckbox = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$b], ["__scopeId", "data-v-68100fa0"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-table/components/uni-tr/table-checkbox.vue"]]);
  const _sfc_main$d = {
    name: "uniTr",
    components: { tableCheckbox },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      keyValue: {
        type: [String, Number],
        default: ""
      }
    },
    options: {
      virtualHost: true
    },
    data() {
      return {
        value: false,
        border: false,
        selection: false,
        widthThArr: [],
        ishead: true,
        checked: false,
        indeterminate: false
      };
    },
    created() {
      this.root = this.getTable();
      this.head = this.getTable("uniThead");
      if (this.head) {
        this.ishead = false;
        this.head.init(this);
      }
      this.border = this.root.border;
      this.selection = this.root.type;
      this.root.trChildren.push(this);
      const rowData = this.root.data.find((v2) => v2[this.root.rowKey] === this.keyValue);
      if (rowData) {
        this.rowData = rowData;
      }
      this.root.isNodata();
    },
    mounted() {
      if (this.widthThArr.length > 0) {
        const selectionWidth = this.selection === "selection" ? 50 : 0;
        this.root.minWidth = this.widthThArr.reduce((a2, b2) => Number(a2) + Number(b2)) + selectionWidth;
      }
    },
    unmounted() {
      const index = this.root.trChildren.findIndex((i2) => i2 === this);
      this.root.trChildren.splice(index, 1);
      this.root.isNodata();
    },
    methods: {
      minWidthUpdate(width) {
        this.widthThArr.push(width);
      },
      checkboxSelected(e) {
        let rootData = this.root.data.find((v2) => v2[this.root.rowKey] === this.keyValue);
        this.checked = e.checked;
        this.root.check(rootData || this, e.checked, rootData ? this.keyValue : null);
      },
      change(e) {
        this.root.trChildren.forEach((item) => {
          if (item === this) {
            this.root.check(this, e.detail.value.length > 0 ? true : false);
          }
        });
      },
      getTable(name = "uniTable") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_checkbox = vue.resolveComponent("table-checkbox");
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-table-tr" }, [
      $data.selection === "selection" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: vue.normalizeClass(["checkbox", { "tr-table--border": $data.border }])
      }, [
        vue.createVNode(_component_table_checkbox, {
          checked: $data.checked,
          indeterminate: $data.indeterminate,
          disabled: $props.disabled,
          onCheckboxSelected: $options.checkboxSelected
        }, null, 8, ["checked", "indeterminate", "disabled", "onCheckboxSelected"])
      ], 2)) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  var __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$a], ["__scopeId", "data-v-c2c83a8e"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-table/components/uni-tr/uni-tr.vue"]]);
  const _sfc_main$c = {
    name: "uniTd",
    options: {
      virtualHost: true
    },
    props: {
      width: {
        type: [String, Number],
        default: ""
      },
      align: {
        type: String,
        default: "left"
      },
      rowspan: {
        type: [Number, String],
        default: 1
      },
      colspan: {
        type: [Number, String],
        default: 1
      }
    },
    data() {
      return {
        border: false
      };
    },
    created() {
      this.root = this.getTable();
      this.border = this.root.border;
    },
    methods: {
      getTable() {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== "uniTable") {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createCommentVNode(` :class="{'table--border':border}"  `),
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["uni-table-td", { "table--border": $data.border }]),
        style: vue.normalizeStyle({ width: $props.width + "px", "text-align": $props.align })
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 6)
    ], 2112);
  }
  var __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$9], ["__scopeId", "data-v-321f8e79"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-table/components/uni-td/uni-td.vue"]]);
  const _sfc_main$b = {
    name: "uniTable",
    options: {
      virtualHost: true
    },
    emits: ["selection-change"],
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      border: {
        type: Boolean,
        default: false
      },
      stripe: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ""
      },
      emptyText: {
        type: String,
        default: "\u6CA1\u6709\u66F4\u591A\u6570\u636E"
      },
      loading: {
        type: Boolean,
        default: false
      },
      rowKey: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        noData: true,
        minWidth: 0,
        multiTableHeads: []
      };
    },
    watch: {
      loading(val) {
      },
      data(newVal) {
        this.theadChildren;
        if (this.theadChildren) {
          this.theadChildren.rowspan;
        }
        this.noData = false;
      }
    },
    created() {
      this.trChildren = [];
      this.thChildren = [];
      this.theadChildren = null;
      this.backData = [];
      this.backIndexData = [];
    },
    methods: {
      isNodata() {
        this.theadChildren;
        let rowspan = 1;
        if (this.theadChildren) {
          rowspan = this.theadChildren.rowspan;
        }
        this.noData = this.trChildren.length - rowspan <= 0;
      },
      selectionAll() {
        let startIndex = 1;
        let theadChildren = this.theadChildren;
        if (!this.theadChildren) {
          theadChildren = this.trChildren[0];
        } else {
          startIndex = theadChildren.rowspan - 1;
        }
        let isHaveData = this.data && this.data.length > 0;
        theadChildren.checked = true;
        theadChildren.indeterminate = false;
        this.trChildren.forEach((item, index) => {
          if (!item.disabled) {
            item.checked = true;
            if (isHaveData && item.keyValue) {
              const row = this.data.find((v2) => v2[this.rowKey] === item.keyValue);
              if (!this.backData.find((v2) => v2[this.rowKey] === row[this.rowKey])) {
                this.backData.push(row);
              }
            }
            if (index > startIndex - 1 && this.backIndexData.indexOf(index - startIndex) === -1) {
              this.backIndexData.push(index - startIndex);
            }
          }
        });
        this.$emit("selection-change", {
          detail: {
            value: this.backData,
            index: this.backIndexData
          }
        });
      },
      toggleRowSelection(row, selected) {
        row = [].concat(row);
        this.trChildren.forEach((item, index) => {
          const select = row.findIndex((v2) => {
            if (typeof v2 === "number") {
              return v2 === index - 1;
            } else {
              return v2[this.rowKey] === item.keyValue;
            }
          });
          let ischeck = item.checked;
          if (select !== -1) {
            if (typeof selected === "boolean") {
              item.checked = selected;
            } else {
              item.checked = !item.checked;
            }
            if (ischeck !== item.checked) {
              this.check(item.rowData || item, item.checked, item.rowData ? item.keyValue : null, true);
            }
          }
        });
        this.$emit("selection-change", {
          detail: {
            value: this.backData,
            index: this.backIndexData
          }
        });
      },
      clearSelection() {
        let theadChildren = this.theadChildren;
        if (!this.theadChildren) {
          theadChildren = this.trChildren[0];
        }
        theadChildren.checked = false;
        theadChildren.indeterminate = false;
        this.trChildren.forEach((item) => {
          item.checked = false;
        });
        this.backData = [];
        this.backIndexData = [];
        this.$emit("selection-change", {
          detail: {
            value: [],
            index: []
          }
        });
      },
      toggleAllSelection() {
        let list = [];
        let startIndex = 1;
        let theadChildren = this.theadChildren;
        if (!this.theadChildren) {
          theadChildren = this.trChildren[0];
        } else {
          startIndex = theadChildren.rowspan - 1;
        }
        this.trChildren.forEach((item, index) => {
          if (!item.disabled) {
            if (index > startIndex - 1) {
              list.push(index - startIndex);
            }
          }
        });
        this.toggleRowSelection(list);
      },
      check(child, check, keyValue, emit) {
        let theadChildren = this.theadChildren;
        if (!this.theadChildren) {
          theadChildren = this.trChildren[0];
        }
        let childDomIndex = this.trChildren.findIndex((item, index) => child === item);
        if (childDomIndex < 0) {
          childDomIndex = this.data.findIndex((v2) => v2[this.rowKey] === keyValue) + 1;
        }
        this.trChildren.filter((v2) => !v2.disabled && v2.keyValue).length;
        if (childDomIndex === 0) {
          check ? this.selectionAll() : this.clearSelection();
          return;
        }
        if (check) {
          if (keyValue) {
            this.backData.push(child);
          }
          this.backIndexData.push(childDomIndex - 1);
        } else {
          const index = this.backData.findIndex((v2) => v2[this.rowKey] === keyValue);
          const idx = this.backIndexData.findIndex((item) => item === childDomIndex - 1);
          if (keyValue) {
            this.backData.splice(index, 1);
          }
          this.backIndexData.splice(idx, 1);
        }
        const domCheckAll = this.trChildren.find((item, index) => index > 0 && !item.checked && !item.disabled);
        if (!domCheckAll) {
          theadChildren.indeterminate = false;
          theadChildren.checked = true;
        } else {
          theadChildren.indeterminate = true;
          theadChildren.checked = false;
        }
        if (this.backIndexData.length === 0) {
          theadChildren.indeterminate = false;
        }
        if (!emit) {
          this.$emit("selection-change", {
            detail: {
              value: this.backData,
              index: this.backIndexData
            }
          });
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["uni-table-scroll", { "table--border": $props.border, "border-none": !$data.noData }])
    }, [
      vue.createElementVNode("view", {
        class: vue.normalizeClass(["uni-table", { "table--stripe": $props.stripe }]),
        style: vue.normalizeStyle({ "min-width": $data.minWidth + "px" })
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        $data.noData ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-table-loading"
        }, [
          vue.createElementVNode("view", {
            class: vue.normalizeClass(["uni-table-text", { "empty-border": $props.border }])
          }, vue.toDisplayString($props.emptyText), 3)
        ])) : vue.createCommentVNode("v-if", true),
        $props.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: vue.normalizeClass(["uni-table-mask", { "empty-border": $props.border }])
        }, [
          vue.createElementVNode("div", { class: "uni-table--loader" })
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 6)
    ], 2);
  }
  var __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$8], ["__scopeId", "data-v-6cd49106"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-table/components/uni-table/uni-table.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages && messages[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    const lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages, watcher, formater }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater || defaultFormatter;
      this.messages = messages || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn2) {
      const index = this.watchers.push(fn2) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      [locale, messages] = [
        messages,
        locale
      ];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn2) {
        return i18n.watchLocale(fn2);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const pages = [
    {
      path: "pages/index/index",
      style: {
        navigationBarTitleText: "uni-app"
      }
    },
    {
      path: "pages/todolist/todolist",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/self-record/self-record",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    },
    {
      path: "pages/self-manage/self-manage",
      style: {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8"
  };
  const tabBar = {
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        iconPath: "static/schedule.png",
        selectedIconPath: "static/schedule.png",
        text: "\u8BFE\u7A0B\u8868"
      },
      {
        pagePath: "pages/todolist/todolist",
        iconPath: "static/todolist.png",
        selectedIconPath: "static/todolist.png",
        text: "\u5F85\u529E"
      },
      {
        pagePath: "pages/self-record/self-record",
        iconPath: "static/self-record.png",
        selectedIconPath: "static/self-record.png",
        text: "\u4E2A\u4EBA\u8BB0\u5F55"
      },
      {
        pagePath: "pages/self-manage/self-manage",
        iconPath: "static/self-manage.png",
        selectedIconPath: "static/self-manage.png",
        text: "\u81EA\u6211\u7BA1\u7406"
      }
    ]
  };
  const uniIdRouter = {};
  var t = {
    pages,
    globalStyle,
    tabBar,
    uniIdRouter
  };
  function n(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
  }
  function s(e, t2, n2) {
    return e(n2 = { path: t2, exports: {}, require: function(e2, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(t3 == null && n2.path);
    } }, n2.exports), n2.exports;
  }
  var o = s(function(e, t2) {
    var n2;
    e.exports = (n2 = n2 || function(e2, t3) {
      var n3 = Object.create || function() {
        function e3() {
        }
        return function(t4) {
          var n4;
          return e3.prototype = t4, n4 = new e3(), e3.prototype = null, n4;
        };
      }(), s2 = {}, o2 = s2.lib = {}, r2 = o2.Base = { extend: function(e3) {
        var t4 = n3(this);
        return e3 && t4.mixIn(e3), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e3 = this.extend();
        return e3.init.apply(e3, arguments), e3;
      }, init: function() {
      }, mixIn: function(e3) {
        for (var t4 in e3)
          e3.hasOwnProperty(t4) && (this[t4] = e3[t4]);
        e3.hasOwnProperty("toString") && (this.toString = e3.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, i2 = o2.WordArray = r2.extend({ init: function(e3, n4) {
        e3 = this.words = e3 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e3.length;
      }, toString: function(e3) {
        return (e3 || c2).stringify(this);
      }, concat: function(e3) {
        var t4 = this.words, n4 = e3.words, s3 = this.sigBytes, o3 = e3.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var r3 = 0; r3 < o3; r3++) {
            var i3 = n4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
            t4[s3 + r3 >>> 2] |= i3 << 24 - (s3 + r3) % 4 * 8;
          }
        else
          for (r3 = 0; r3 < o3; r3 += 4)
            t4[s3 + r3 >>> 2] = n4[r3 >>> 2];
        return this.sigBytes += o3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e2.ceil(n4 / 4);
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3.words = this.words.slice(0), e3;
      }, random: function(t4) {
        for (var n4, s3 = [], o3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var o4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return o4 /= 4294967296, (o4 += 0.5) * (e2.random() > 0.5 ? 1 : -1);
          };
        }, r3 = 0; r3 < t4; r3 += 4) {
          var a3 = o3(4294967296 * (n4 || e2.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new i2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
          var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
          s3.push((r3 >>> 4).toString(16)), s3.push((15 & r3).toString(16));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e3.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new i2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e3) {
        for (var t4 = e3.words, n4 = e3.sigBytes, s3 = [], o3 = 0; o3 < n4; o3++) {
          var r3 = t4[o3 >>> 2] >>> 24 - o3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(r3));
        }
        return s3.join("");
      }, parse: function(e3) {
        for (var t4 = e3.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e3.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new i2.init(n4, t4);
      } }, l2 = a2.Utf8 = { stringify: function(e3) {
        try {
          return decodeURIComponent(escape(u2.stringify(e3)));
        } catch (e4) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e3) {
        return u2.parse(unescape(encodeURIComponent(e3)));
      } }, h2 = o2.BufferedBlockAlgorithm = r2.extend({ reset: function() {
        this._data = new i2.init(), this._nDataBytes = 0;
      }, _append: function(e3) {
        typeof e3 == "string" && (e3 = l2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, o3 = n4.sigBytes, r3 = this.blockSize, a3 = o3 / (4 * r3), c3 = (a3 = t4 ? e2.ceil(a3) : e2.max((0 | a3) - this._minBufferSize, 0)) * r3, u3 = e2.min(4 * c3, o3);
        if (c3) {
          for (var l3 = 0; l3 < c3; l3 += r3)
            this._doProcessBlock(s3, l3);
          var h3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new i2.init(h3, u3);
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3._data = this._data.clone(), e3;
      }, _minBufferSize: 0 });
      o2.Hasher = h2.extend({ cfg: r2.extend(), init: function(e3) {
        this.cfg = this.cfg.extend(e3), this.reset();
      }, reset: function() {
        h2.reset.call(this), this._doReset();
      }, update: function(e3) {
        return this._append(e3), this._process(), this;
      }, finalize: function(e3) {
        return e3 && this._append(e3), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e3) {
        return function(t4, n4) {
          return new e3.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e3) {
        return function(t4, n4) {
          return new d2.HMAC.init(e3, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = (s(function(e, t2) {
    var n2;
    e.exports = (n2 = o, function(e2) {
      var t3 = n2, s2 = t3.lib, o2 = s2.WordArray, r2 = s2.Hasher, i2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e2.abs(e2.sin(t4 + 1)) | 0;
      }();
      var c2 = i2.MD5 = r2.extend({ _doReset: function() {
        this._hash = new o2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e3, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, o3 = e3[s3];
          e3[s3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
        }
        var r3 = this._hash.words, i3 = e3[t4 + 0], c3 = e3[t4 + 1], f2 = e3[t4 + 2], p2 = e3[t4 + 3], g2 = e3[t4 + 4], m2 = e3[t4 + 5], y2 = e3[t4 + 6], _2 = e3[t4 + 7], w = e3[t4 + 8], v2 = e3[t4 + 9], k2 = e3[t4 + 10], T2 = e3[t4 + 11], S2 = e3[t4 + 12], A2 = e3[t4 + 13], P2 = e3[t4 + 14], I2 = e3[t4 + 15], b2 = r3[0], O2 = r3[1], C2 = r3[2], E2 = r3[3];
        b2 = u2(b2, O2, C2, E2, i3, 7, a2[0]), E2 = u2(E2, b2, O2, C2, c3, 12, a2[1]), C2 = u2(C2, E2, b2, O2, f2, 17, a2[2]), O2 = u2(O2, C2, E2, b2, p2, 22, a2[3]), b2 = u2(b2, O2, C2, E2, g2, 7, a2[4]), E2 = u2(E2, b2, O2, C2, m2, 12, a2[5]), C2 = u2(C2, E2, b2, O2, y2, 17, a2[6]), O2 = u2(O2, C2, E2, b2, _2, 22, a2[7]), b2 = u2(b2, O2, C2, E2, w, 7, a2[8]), E2 = u2(E2, b2, O2, C2, v2, 12, a2[9]), C2 = u2(C2, E2, b2, O2, k2, 17, a2[10]), O2 = u2(O2, C2, E2, b2, T2, 22, a2[11]), b2 = u2(b2, O2, C2, E2, S2, 7, a2[12]), E2 = u2(E2, b2, O2, C2, A2, 12, a2[13]), C2 = u2(C2, E2, b2, O2, P2, 17, a2[14]), b2 = l2(b2, O2 = u2(O2, C2, E2, b2, I2, 22, a2[15]), C2, E2, c3, 5, a2[16]), E2 = l2(E2, b2, O2, C2, y2, 9, a2[17]), C2 = l2(C2, E2, b2, O2, T2, 14, a2[18]), O2 = l2(O2, C2, E2, b2, i3, 20, a2[19]), b2 = l2(b2, O2, C2, E2, m2, 5, a2[20]), E2 = l2(E2, b2, O2, C2, k2, 9, a2[21]), C2 = l2(C2, E2, b2, O2, I2, 14, a2[22]), O2 = l2(O2, C2, E2, b2, g2, 20, a2[23]), b2 = l2(b2, O2, C2, E2, v2, 5, a2[24]), E2 = l2(E2, b2, O2, C2, P2, 9, a2[25]), C2 = l2(C2, E2, b2, O2, p2, 14, a2[26]), O2 = l2(O2, C2, E2, b2, w, 20, a2[27]), b2 = l2(b2, O2, C2, E2, A2, 5, a2[28]), E2 = l2(E2, b2, O2, C2, f2, 9, a2[29]), C2 = l2(C2, E2, b2, O2, _2, 14, a2[30]), b2 = h2(b2, O2 = l2(O2, C2, E2, b2, S2, 20, a2[31]), C2, E2, m2, 4, a2[32]), E2 = h2(E2, b2, O2, C2, w, 11, a2[33]), C2 = h2(C2, E2, b2, O2, T2, 16, a2[34]), O2 = h2(O2, C2, E2, b2, P2, 23, a2[35]), b2 = h2(b2, O2, C2, E2, c3, 4, a2[36]), E2 = h2(E2, b2, O2, C2, g2, 11, a2[37]), C2 = h2(C2, E2, b2, O2, _2, 16, a2[38]), O2 = h2(O2, C2, E2, b2, k2, 23, a2[39]), b2 = h2(b2, O2, C2, E2, A2, 4, a2[40]), E2 = h2(E2, b2, O2, C2, i3, 11, a2[41]), C2 = h2(C2, E2, b2, O2, p2, 16, a2[42]), O2 = h2(O2, C2, E2, b2, y2, 23, a2[43]), b2 = h2(b2, O2, C2, E2, v2, 4, a2[44]), E2 = h2(E2, b2, O2, C2, S2, 11, a2[45]), C2 = h2(C2, E2, b2, O2, I2, 16, a2[46]), b2 = d2(b2, O2 = h2(O2, C2, E2, b2, f2, 23, a2[47]), C2, E2, i3, 6, a2[48]), E2 = d2(E2, b2, O2, C2, _2, 10, a2[49]), C2 = d2(C2, E2, b2, O2, P2, 15, a2[50]), O2 = d2(O2, C2, E2, b2, m2, 21, a2[51]), b2 = d2(b2, O2, C2, E2, S2, 6, a2[52]), E2 = d2(E2, b2, O2, C2, p2, 10, a2[53]), C2 = d2(C2, E2, b2, O2, k2, 15, a2[54]), O2 = d2(O2, C2, E2, b2, c3, 21, a2[55]), b2 = d2(b2, O2, C2, E2, w, 6, a2[56]), E2 = d2(E2, b2, O2, C2, I2, 10, a2[57]), C2 = d2(C2, E2, b2, O2, y2, 15, a2[58]), O2 = d2(O2, C2, E2, b2, A2, 21, a2[59]), b2 = d2(b2, O2, C2, E2, g2, 6, a2[60]), E2 = d2(E2, b2, O2, C2, T2, 10, a2[61]), C2 = d2(C2, E2, b2, O2, f2, 15, a2[62]), O2 = d2(O2, C2, E2, b2, v2, 21, a2[63]), r3[0] = r3[0] + b2 | 0, r3[1] = r3[1] + O2 | 0, r3[2] = r3[2] + C2 | 0, r3[3] = r3[3] + E2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, o3 = 8 * t4.sigBytes;
        n3[o3 >>> 5] |= 128 << 24 - o3 % 32;
        var r3 = e2.floor(s3 / 4294967296), i3 = s3;
        n3[15 + (o3 + 64 >>> 9 << 4)] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8), n3[14 + (o3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var l3 = c3[u3];
          c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e3 = r2.clone.call(this);
        return e3._hash = this._hash.clone(), e3;
      } });
      function u2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 & n3 | ~t4 & s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function l2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 & s3 | n3 & ~s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function h2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (t4 ^ n3 ^ s3) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      function d2(e3, t4, n3, s3, o3, r3, i3) {
        var a3 = e3 + (n3 ^ (t4 | ~s3)) + o3 + i3;
        return (a3 << r3 | a3 >>> 32 - r3) + t4;
      }
      t3.MD5 = r2._createHelper(c2), t3.HmacMD5 = r2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), s(function(e, t2) {
    var n2, s2, r2;
    e.exports = (s2 = (n2 = o).lib.Base, r2 = n2.enc.Utf8, void (n2.algo.HMAC = s2.extend({ init: function(e2, t3) {
      e2 = this._hasher = new e2.init(), typeof t3 == "string" && (t3 = r2.parse(t3));
      var n3 = e2.blockSize, s3 = 4 * n3;
      t3.sigBytes > s3 && (t3 = e2.finalize(t3)), t3.clamp();
      for (var o2 = this._oKey = t3.clone(), i2 = this._iKey = t3.clone(), a2 = o2.words, c2 = i2.words, u2 = 0; u2 < n3; u2++)
        a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
      o2.sigBytes = i2.sigBytes = s3, this.reset();
    }, reset: function() {
      var e2 = this._hasher;
      e2.reset(), e2.update(this._iKey);
    }, update: function(e2) {
      return this._hasher.update(e2), this;
    }, finalize: function(e2) {
      var t3 = this._hasher, n3 = t3.finalize(e2);
      return t3.reset(), t3.finalize(this._oKey.clone().concat(n3));
    } })));
  }), s(function(e, t2) {
    e.exports = o.HmacMD5;
  })), i = s(function(e, t2) {
    e.exports = o.enc.Utf8;
  }), a = s(function(e, t2) {
    var n2;
    e.exports = (n2 = o, function() {
      var e2 = n2, t3 = e2.lib.WordArray;
      function s2(e3, n3, s3) {
        for (var o2 = [], r2 = 0, i2 = 0; i2 < n3; i2++)
          if (i2 % 4) {
            var a2 = s3[e3.charCodeAt(i2 - 1)] << i2 % 4 * 2, c2 = s3[e3.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
            o2[r2 >>> 2] |= (a2 | c2) << 24 - r2 % 4 * 8, r2++;
          }
        return t3.create(o2, r2);
      }
      e2.enc.Base64 = { stringify: function(e3) {
        var t4 = e3.words, n3 = e3.sigBytes, s3 = this._map;
        e3.clamp();
        for (var o2 = [], r2 = 0; r2 < n3; r2 += 3)
          for (var i2 = (t4[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255) << 16 | (t4[r2 + 1 >>> 2] >>> 24 - (r2 + 1) % 4 * 8 & 255) << 8 | t4[r2 + 2 >>> 2] >>> 24 - (r2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && r2 + 0.75 * a2 < n3; a2++)
            o2.push(s3.charAt(i2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; o2.length % 4; )
            o2.push(c2);
        return o2.join("");
      }, parse: function(e3) {
        var t4 = e3.length, n3 = this._map, o2 = this._reverseMap;
        if (!o2) {
          o2 = this._reverseMap = [];
          for (var r2 = 0; r2 < n3.length; r2++)
            o2[n3.charCodeAt(r2)] = r2;
        }
        var i2 = n3.charAt(64);
        if (i2) {
          var a2 = e3.indexOf(i2);
          a2 !== -1 && (t4 = a2);
        }
        return s2(e3, t4, o2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "FUNCTION", u = "OBJECT", l = "CLIENT_DB";
  function h(e) {
    return Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
  }
  function d(e) {
    return h(e) === "object";
  }
  function f(e) {
    return e && typeof e == "string" ? JSON.parse(e) : e;
  }
  const p = true, g = "app";
  let m;
  m = g;
  const y = f('{\n    "address": [\n        "127.0.0.1",\n        "192.168.56.1",\n        "192.168.1.106"\n    ],\n    "debugPort": 9000,\n    "initialLaunchType": "local",\n    "servePort": 7000,\n    "skipFiles": [\n        "<node_internals>/**",\n        "C:/HBuilderX.3.6.5.20221121/HBuilderX/plugins/unicloud/**/*.js"\n    ]\n}\n'), _ = f('[{"provider":"aliyun","spaceName":"show","spaceId":"mp-6b936a4d-0e84-4456-a9db-5840cda294c8","clientSecret":"VncPDYAUTzq0NXvZLRCShQ==","endpoint":"https://api.next.bspapp.com"}]') || [];
  let v = "";
  try {
    v = "__UNI__5176808";
  } catch (e) {
  }
  let k = {};
  function T(e, t2 = {}) {
    var n2, s2;
    return n2 = k, s2 = e, Object.prototype.hasOwnProperty.call(n2, s2) || (k[e] = t2), k[e];
  }
  m === "app" && (k = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {});
  const S = ["invoke", "success", "fail", "complete"], A = T("_globalUniCloudInterceptor");
  function P(e, t2) {
    A[e] || (A[e] = {}), d(t2) && Object.keys(t2).forEach((n2) => {
      S.indexOf(n2) > -1 && function(e2, t3, n3) {
        let s2 = A[e2][t3];
        s2 || (s2 = A[e2][t3] = []), s2.indexOf(n3) === -1 && typeof n3 == "function" && s2.push(n3);
      }(e, n2, t2[n2]);
    });
  }
  function I(e, t2) {
    A[e] || (A[e] = {}), d(t2) ? Object.keys(t2).forEach((n2) => {
      S.indexOf(n2) > -1 && function(e2, t3, n3) {
        const s2 = A[e2][t3];
        if (!s2)
          return;
        const o2 = s2.indexOf(n3);
        o2 > -1 && s2.splice(o2, 1);
      }(e, n2, t2[n2]);
    }) : delete A[e];
  }
  function b(e, t2) {
    return e && e.length !== 0 ? e.reduce((e2, n2) => e2.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function O(e, t2) {
    return A[e] && A[e][t2] || [];
  }
  function C(e) {
    P("callObject", e);
  }
  const E = T("_globalUniCloudListener"), R = "response", U = "needLogin", x = "refreshToken", L = "clientdb", D = "cloudfunction", N = "cloudobject";
  function q(e) {
    return E[e] || (E[e] = []), E[e];
  }
  function F(e, t2) {
    const n2 = q(e);
    n2.includes(t2) || n2.push(t2);
  }
  function M(e, t2) {
    const n2 = q(e), s2 = n2.indexOf(t2);
    s2 !== -1 && n2.splice(s2, 1);
  }
  function j(e, t2) {
    const n2 = q(e);
    for (let e2 = 0; e2 < n2.length; e2++) {
      (0, n2[e2])(t2);
    }
  }
  let $ = false;
  const B = new Promise((e) => {
    $ && e(), function t2() {
      if (typeof getCurrentPages == "function") {
        const t3 = getCurrentPages();
        t3 && t3[0] && ($ = true, e());
      }
      $ || setTimeout(() => {
        t2();
      }, 30);
    }();
  });
  function K() {
    return B;
  }
  function W(e, t2) {
    return t2 ? function(n2) {
      let s2 = false;
      if (t2 === "callFunction") {
        const e2 = n2 && n2.type || c;
        s2 = e2 !== c;
      }
      const o2 = t2 === "callFunction" && !s2;
      let r2;
      r2 = this.isReady ? Promise.resolve() : this.initUniCloud, n2 = n2 || {};
      const i2 = r2.then(() => s2 ? Promise.resolve() : b(O(t2, "invoke"), n2)).then(() => e.call(this, n2)).then((e2) => s2 ? Promise.resolve(e2) : b(O(t2, "success"), e2).then(() => b(O(t2, "complete"), e2)).then(() => (o2 && j(R, { type: D, content: e2 }), Promise.resolve(e2))), (e2) => s2 ? Promise.reject(e2) : b(O(t2, "fail"), e2).then(() => b(O(t2, "complete"), e2)).then(() => (j(R, { type: D, content: e2 }), Promise.reject(e2))));
      if (!(n2.success || n2.fail || n2.complete))
        return i2;
      i2.then((e2) => {
        n2.success && n2.success(e2), n2.complete && n2.complete(e2), o2 && j(R, { type: D, content: e2 });
      }, (e2) => {
        n2.fail && n2.fail(e2), n2.complete && n2.complete(e2), o2 && j(R, { type: D, content: e2 });
      });
    } : function(t3) {
      if (!((t3 = t3 || {}).success || t3.fail || t3.complete))
        return e.call(this, t3);
      e.call(this, t3).then((e2) => {
        t3.success && t3.success(e2), t3.complete && t3.complete(e2);
      }, (e2) => {
        t3.fail && t3.fail(e2), t3.complete && t3.complete(e2);
      });
    };
  }
  class H extends Error {
    constructor(e) {
      const t2 = e.code || "SYSTEM_ERROR", n2 = e.message || "unknown system error";
      super(n2), this.errMsg = n2, this.errCode = this.code = t2, this.requestId = e.requestId;
    }
  }
  function z() {
    let e, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e = s2, t2 = n2;
      }
    } catch (e2) {
    }
    return { channel: e, scene: t2 };
  }
  let J;
  function V() {
    const e = uni.getLocale && uni.getLocale() || "en";
    if (J)
      return __spreadProps(__spreadValues({}, J), { locale: e, LOCALE: e });
    const t2 = uni.getSystemInfoSync(), { deviceId: n2, osName: s2, uniPlatform: o2, appId: r2 } = t2, i2 = ["pixelRatio", "brand", "model", "system", "language", "version", "platform", "host", "SDKVersion", "swanNativeVersion", "app", "AppPlatform", "fontSizeSetting"];
    for (let e2 = 0; e2 < i2.length; e2++) {
      delete t2[i2[e2]];
    }
    return J = __spreadValues(__spreadValues({ PLATFORM: o2, OS: s2, APPID: r2, DEVICEID: n2 }, z()), t2), __spreadProps(__spreadValues({}, J), { locale: e, LOCALE: e });
  }
  var Y = { sign: function(e, t2) {
    let n2 = "";
    return Object.keys(e).sort().forEach(function(t3) {
      e[t3] && (n2 = n2 + "&" + t3 + "=" + e[t3]);
    }), n2 = n2.slice(1), r(n2, t2).toString();
  }, wrappedRequest: function(e, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e, { complete(e2) {
        e2 || (e2 = {}), m === "web" && e2.errMsg && e2.errMsg.indexOf("request:fail") === 0 && console.warn("\u53D1\u5E03H5\uFF0C\u9700\u8981\u5728uniCloud\u540E\u53F0\u64CD\u4F5C\uFF0C\u7ED1\u5B9A\u5B89\u5168\u57DF\u540D\uFF0C\u5426\u5219\u4F1A\u56E0\u4E3A\u8DE8\u57DF\u95EE\u9898\u800C\u65E0\u6CD5\u8BBF\u95EE\u3002\u6559\u7A0B\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.io/uniCloud/quickstart?id=useinh5");
        const t3 = e2.data && e2.data.header && e2.data.header["x-serverless-request-id"] || e2.header && e2.header["request-id"];
        if (!e2.statusCode || e2.statusCode >= 400)
          return s2(new H({ code: "SYS_ERR", message: e2.errMsg || "request:fail", requestId: t3 }));
        const o2 = e2.data;
        if (o2.error)
          return s2(new H({ code: o2.error.code, message: o2.error.message, requestId: t3 }));
        o2.result = o2.data, o2.requestId = t3, delete o2.data, n2(o2);
      } }));
    });
  }, toBase64: function(e) {
    return a.stringify(i.parse(e));
  } };
  var X = { request: (e) => uni.request(e), uploadFile: (e) => uni.uploadFile(e), setStorageSync: (e, t2) => uni.setStorageSync(e, t2), getStorageSync: (e) => uni.getStorageSync(e), removeStorageSync: (e) => uni.removeStorageSync(e), clearStorageSync: () => uni.clearStorageSync() }, G = { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" };
  const { t: Q } = initVueI18n({ "zh-Hans": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, "zh-Hant": { "uniCloud.init.paramRequired": "\u7F3A\u5C11\u53C2\u6570\uFF1A{param}", "uniCloud.uploadFile.fileError": "filePath\u5E94\u4E3AFile\u5BF9\u8C61" }, en: G, fr: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, es: { "uniCloud.init.paramRequired": "{param} required", "uniCloud.uploadFile.fileError": "filePath should be instance of File" }, ja: G }, "zh-Hans");
  var Z = class {
    constructor(e) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e, t2))
          throw new Error(Q("uniCloud.init.paramRequired", { param: t2 }));
      }), this.config = Object.assign({}, { endpoint: "https://api.bspapp.com" }, e), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = X, this._getAccessTokenPromise = null, this._getAccessTokenPromiseStatus = null;
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e) {
      this.accessToken = e;
    }
    requestWrapped(e) {
      return Y.wrappedRequest(e, this.adapter.request);
    }
    requestAuth(e) {
      return this.requestWrapped(e);
    }
    request(e, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e) : this.requestWrapped(e).catch((t3) => new Promise((e2, n2) => {
        !t3 || t3.code !== "GATEWAY_INVALID_TOKEN" && t3.code !== "InvalidParameter.InvalidToken" ? n2(t3) : e2();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e) {
      const t2 = Object.assign({}, e);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = Y.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = Y.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      if (this._getAccessTokenPromiseStatus === "pending")
        return this._getAccessTokenPromise;
      this._getAccessTokenPromiseStatus = "pending";
      return this._getAccessTokenPromise = this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e) => new Promise((t2, n2) => {
        e.result && e.result.accessToken ? (this.setAccessToken(e.result.accessToken), this._getAccessTokenPromiseStatus = "fulfilled", t2(this.accessToken)) : (this._getAccessTokenPromiseStatus = "rejected", n2(new H({ code: "AUTH_FAILED", message: "\u83B7\u53D6accessToken\u5931\u8D25" })));
      }), (e) => (this._getAccessTokenPromiseStatus = "rejected", Promise.reject(e))), this._getAccessTokenPromise;
    }
    authorize() {
      this.getAccessToken();
    }
    callFunction(e) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e.name, functionArgs: e.data || {} }) };
      return this.request(this.setupRequest(t2));
    }
    getOSSUploadOptionsFromPath(e) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new H({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2, config: o2 }) {
      if (h(t2) !== "string")
        throw new H({ code: "INVALID_PARAM", message: "cloudPath\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32\u7C7B\u578B" });
      if (!(t2 = t2.trim()))
        throw new H({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      if (/:\/\//.test(t2))
        throw new H({ code: "INVALID_PARAM", message: "cloudPath\u4E0D\u5408\u6CD5" });
      const r2 = o2 && o2.envType || this.config.envType, i2 = (await this.getOSSUploadOptionsFromPath({ env: r2, filename: t2 })).result, a2 = "https://" + i2.cdnDomain + "/" + i2.ossPath, { securityToken: c2, accessKeyId: u2, signature: l2, host: d2, ossPath: f2, id: p2, policy: g2, ossCallbackUrl: m2 } = i2, y2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: u2, Signature: l2, host: d2, id: p2, key: f2, policy: g2, success_action_status: 200 };
      if (c2 && (y2["x-oss-security-token"] = c2), m2) {
        const e2 = JSON.stringify({ callbackUrl: m2, callbackBody: JSON.stringify({ fileId: p2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        y2.callback = Y.toBase64(e2);
      }
      const _2 = { url: "https://" + i2.host, formData: y2, fileName: "file", name: "file", filePath: e, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, _2, { onUploadProgress: s2 })), m2)
        return { success: true, filePath: e, fileID: a2 };
      if ((await this.reportOSSUpload({ id: p2 })).success)
        return { success: true, filePath: e, fileID: a2 };
      throw new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" });
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ id: e[0] }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e) && e.length !== 0 || n2(new H({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" })), t2({ fileList: e.map((e2) => ({ fileID: e2, tempFileURL: e2 })) });
      });
    }
    async getFileInfo({ fileList: e } = {}) {
      if (!Array.isArray(e) || e.length === 0)
        throw new H({ code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e.map((e2) => e2.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var ee = { init(e) {
    const t2 = new Z(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const te = typeof location != "undefined" && location.protocol === "http:" ? "http:" : "https:";
  var ne;
  !function(e) {
    e.local = "local", e.none = "none", e.session = "session";
  }(ne || (ne = {}));
  var se = function() {
  };
  const oe = () => {
    let e;
    if (!Promise) {
      e = () => {
      }, e.promise = {};
      const t3 = () => {
        throw new H({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e.promise, "then", { get: t3 }), Object.defineProperty(e.promise, "catch", { get: t3 }), e;
    }
    const t2 = new Promise((t3, n2) => {
      e = (e2, s2) => e2 ? n2(e2) : t3(s2);
    });
    return e.promise = t2, e;
  };
  function re(e) {
    return e === void 0;
  }
  function ie(e) {
    return Object.prototype.toString.call(e) === "[object Null]";
  }
  var ae;
  function ce(e) {
    const t2 = (n2 = e, Object.prototype.toString.call(n2) === "[object Array]" ? e : [e]);
    var n2;
    for (const e2 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e2;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e) {
    e.WEB = "web", e.WX_MP = "wx_mp";
  }(ae || (ae = {}));
  const ue = { adapter: null, runtime: void 0 }, le = ["anonymousUuidKey"];
  class he extends se {
    constructor() {
      super(), ue.adapter.root.tcbObject || (ue.adapter.root.tcbObject = {});
    }
    setItem(e, t2) {
      ue.adapter.root.tcbObject[e] = t2;
    }
    getItem(e) {
      return ue.adapter.root.tcbObject[e];
    }
    removeItem(e) {
      delete ue.adapter.root.tcbObject[e];
    }
    clear() {
      delete ue.adapter.root.tcbObject;
    }
  }
  function de(e, t2) {
    switch (e) {
      case "local":
        return t2.localStorage || new he();
      case "none":
        return new he();
      default:
        return t2.sessionStorage || new he();
    }
  }
  class fe {
    constructor(e) {
      if (!this._storage) {
        this._persistence = ue.adapter.primaryStorage || e.persistence, this._storage = de(this._persistence, ue.adapter);
        const t2 = `access_token_${e.env}`, n2 = `access_token_expire_${e.env}`, s2 = `refresh_token_${e.env}`, o2 = `anonymous_uuid_${e.env}`, r2 = `login_type_${e.env}`, i2 = `user_info_${e.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: o2, loginTypeKey: r2, userInfoKey: i2 };
      }
    }
    updatePersistence(e) {
      if (e === this._persistence)
        return;
      const t2 = this._persistence === "local";
      this._persistence = e;
      const n2 = de(e, ue.adapter);
      for (const e2 in this.keys) {
        const s2 = this.keys[e2];
        if (t2 && le.includes(e2))
          continue;
        const o2 = this._storage.getItem(s2);
        re(o2) || ie(o2) || (n2.setItem(s2, o2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, o2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e, o2);
      } catch (e2) {
        throw e2;
      }
    }
    getStore(e, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e2) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e) {
      this._storage.removeItem(e);
    }
  }
  const pe = {}, ge = {};
  function me(e) {
    return pe[e];
  }
  class ye {
    constructor(e, t2) {
      this.data = t2 || null, this.name = e;
    }
  }
  class _e extends ye {
    constructor(e, t2) {
      super("error", { error: e, data: t2 }), this.error = e;
    }
  }
  const we = new class {
    constructor() {
      this._listeners = {};
    }
    on(e, t2) {
      return function(e2, t3, n2) {
        n2[e2] = n2[e2] || [], n2[e2].push(t3);
      }(e, t2, this._listeners), this;
    }
    off(e, t2) {
      return function(e2, t3, n2) {
        if (n2 && n2[e2]) {
          const s2 = n2[e2].indexOf(t3);
          s2 !== -1 && n2[e2].splice(s2, 1);
        }
      }(e, t2, this._listeners), this;
    }
    fire(e, t2) {
      if (e instanceof _e)
        return console.error(e.error), this;
      const n2 = typeof e == "string" ? new ye(e, t2 || {}) : e;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e2 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e2)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e) {
      return this._listeners[e] && this._listeners[e].length > 0;
    }
  }();
  function ve(e, t2) {
    we.on(e, t2);
  }
  function ke(e, t2 = {}) {
    we.fire(e, t2);
  }
  function Te(e, t2) {
    we.off(e, t2);
  }
  const Se = "loginStateChanged", Ae = "loginStateExpire", Pe = "loginTypeChanged", Ie = "anonymousConverted", be = "refreshAccessToken";
  var Oe;
  !function(e) {
    e.ANONYMOUS = "ANONYMOUS", e.WECHAT = "WECHAT", e.WECHAT_PUBLIC = "WECHAT-PUBLIC", e.WECHAT_OPEN = "WECHAT-OPEN", e.CUSTOM = "CUSTOM", e.EMAIL = "EMAIL", e.USERNAME = "USERNAME", e.NULL = "NULL";
  }(Oe || (Oe = {}));
  const Ce = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Ee = { "X-SDK-Version": "1.3.5" };
  function Re(e, t2, n2) {
    const s2 = e[t2];
    e[t2] = function(t3) {
      const o2 = {}, r2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: i3 } = n3.call(e, t3);
        Object.assign(o2, s3), Object.assign(r2, i3);
      });
      const i2 = t3.data;
      return i2 && (() => {
        var e2;
        if (e2 = i2, Object.prototype.toString.call(e2) !== "[object FormData]")
          t3.data = __spreadValues(__spreadValues({}, i2), o2);
        else
          for (const e3 in o2)
            i2.append(e3, o2[e3]);
      })(), t3.headers = __spreadValues(__spreadValues({}, t3.headers || {}), r2), s2.call(e, t3);
    };
  }
  function Ue() {
    const e = Math.random().toString(16).slice(2);
    return { data: { seqId: e }, headers: __spreadProps(__spreadValues({}, Ee), { "x-seqid": e }) };
  }
  class xe {
    constructor(e = {}) {
      var t2;
      this.config = e, this._reqClass = new ue.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `\u8BF7\u6C42\u5728${this.config.timeout / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD`, restrictedMethods: ["post"] }), this._cache = me(this.config.env), this._localCache = (t2 = this.config.env, ge[t2]), Re(this._reqClass, "post", [Ue]), Re(this._reqClass, "upload", [Ue]), Re(this._reqClass, "download", [Ue]);
    }
    async post(e) {
      return await this._reqClass.post(e);
    }
    async upload(e) {
      return await this._reqClass.upload(e);
    }
    async download(e) {
      return await this._reqClass.download(e);
    }
    async refreshAccessToken() {
      let e, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e = await this._refreshAccessTokenPromise;
      } catch (e2) {
        t2 = e2;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: o2 } = this._cache.keys;
      this._cache.removeStore(e), this._cache.removeStore(t2);
      let r2 = this._cache.getStore(n2);
      if (!r2)
        throw new H({ message: "\u672A\u767B\u5F55CloudBase" });
      const i2 = { refresh_token: r2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", i2);
      if (a2.data.code) {
        const { code: e2 } = a2.data;
        if (e2 === "SIGN_PARAM_INVALID" || e2 === "REFRESH_TOKEN_EXPIRED" || e2 === "INVALID_REFRESH_TOKEN") {
          if (this._cache.getStore(s2) === Oe.ANONYMOUS && e2 === "INVALID_REFRESH_TOKEN") {
            const e3 = this._cache.getStore(o2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e3, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          ke(Ae), this._cache.removeStore(n2);
        }
        throw new H({ code: a2.data.code, message: `\u5237\u65B0access token\u5931\u8D25\uFF1A${a2.data.code}` });
      }
      if (a2.data.access_token)
        return ke(be), this._cache.setStore(e, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new H({ message: "refresh token\u4E0D\u5B58\u5728\uFF0C\u767B\u5F55\u72B6\u6001\u5F02\u5E38" });
      let s2 = this._cache.getStore(e), o2 = this._cache.getStore(t2), r2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, o2) && (r2 = false), (!s2 || !o2 || o2 < Date.now()) && r2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: o2 };
    }
    async request(e, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let o2 = "application/x-www-form-urlencoded";
      const r2 = __spreadValues({ action: e, env: this.config.env, dataVersion: "2019-08-16" }, t2);
      if (Ce.indexOf(e) === -1) {
        const { refreshTokenKey: e2 } = this._cache.keys;
        this._cache.getStore(e2) && (r2.access_token = (await this.getAccessToken()).accessToken);
      }
      let i2;
      if (e === "storage.uploadFile") {
        i2 = new FormData();
        for (let e2 in i2)
          i2.hasOwnProperty(e2) && i2[e2] !== void 0 && i2.append(e2, r2[e2]);
        o2 = "multipart/form-data";
      } else {
        o2 = "application/json", i2 = {};
        for (let e2 in r2)
          r2[e2] !== void 0 && (i2[e2] = r2[e2]);
      }
      let a2 = { headers: { "content-type": o2 } };
      n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: l2, search: h2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), l2 && (d2 = __spreadValues(__spreadValues({}, l2), d2));
      let f2 = function(e2, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let o3 = "";
        for (let e3 in n3)
          o3 === "" ? !s3 && (t3 += "?") : o3 += "&", o3 += `${e3}=${encodeURIComponent(n3[e3])}`;
        return /^http(s)?\:\/\//.test(t3 += o3) ? t3 : `${e2}${t3}`;
      }(te, "//tcb-api.tencentcloudapi.com/web", d2);
      h2 && (f2 += h2);
      const p2 = await this.post(__spreadValues({ url: f2, data: i2 }, a2)), g2 = p2.header && p2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), Number(p2.status) !== 200 && Number(p2.statusCode) !== 200 || !p2.data)
        throw new H({ code: "NETWORK_ERROR", message: "network request error" });
      return p2;
    }
    async send(e, t2 = {}) {
      const n2 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
      if (n2.data.code === "ACCESS_TOKEN_EXPIRED" && Ce.indexOf(e) === -1) {
        await this.refreshAccessToken();
        const n3 = await this.request(e, t2, { onUploadProgress: t2.onUploadProgress });
        if (n3.data.code)
          throw new H({ code: n3.data.code, message: n3.data.message });
        return n3.data;
      }
      if (n2.data.code)
        throw new H({ code: n2.data.code, message: n2.data.message });
      return n2.data;
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
  }
  const Le = {};
  function De(e) {
    return Le[e];
  }
  class Ne {
    constructor(e) {
      this.config = e, this._cache = me(e.env), this._request = De(e.env);
    }
    setRefreshToken(e) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e);
    }
    setAccessToken(e, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e);
    }
  }
  class qe {
    constructor(e) {
      if (!e)
        throw new H({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e, this._cache = me(this._envId), this._request = De(this._envId), this.setUserInfo();
    }
    linkWithTicket(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e });
    }
    linkWithRedirect(e) {
      e.signInWithRedirect();
    }
    updatePassword(e, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e });
    }
    updateEmail(e) {
      return this._request.send("auth.updateEmail", { newEmail: e });
    }
    updateUsername(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e });
    }
    async getLinkedUidList() {
      const { data: e } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e;
      return n2.forEach((e2) => {
        e2.wxOpenId && e2.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e) {
      return this._request.send("auth.setPrimaryUid", { uid: e });
    }
    unlink(e) {
      return this._request.send("auth.unlink", { platform: e });
    }
    async update(e) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 } = e, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: o2, country: r2, city: i2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const { data: e } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e), e;
    }
    setUserInfo() {
      const { userInfoKey: e } = this._cache.keys, t2 = this._cache.getStore(e);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e2) => {
        this[e2] = t2[e2];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e), this.setUserInfo();
    }
  }
  class Fe {
    constructor(e) {
      if (!e)
        throw new H({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = me(e);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, o2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = this._cache.getStore(s2);
      this.credential = { refreshToken: o2, accessToken: r2, accessTokenExpire: i2 }, this.user = new qe(e);
    }
    get isAnonymousAuth() {
      return this.loginType === Oe.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === Oe.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === Oe.WECHAT || this.loginType === Oe.WECHAT_OPEN || this.loginType === Oe.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class Me extends Ne {
    async signIn() {
      this._cache.updatePersistence("local");
      const { anonymousUuidKey: e, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e) || void 0, s2 = this._cache.getStore(t2) || void 0, o2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
      if (o2.uuid && o2.refresh_token) {
        this._setAnonymousUUID(o2.uuid), this.setRefreshToken(o2.refresh_token), await this._request.refreshAccessToken(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.ANONYMOUS, persistence: "local" });
        const e2 = new Fe(this.config.env);
        return await e2.user.refresh(), e2;
      }
      throw new H({ message: "\u533F\u540D\u767B\u5F55\u5931\u8D25" });
    }
    async linkAndRetrieveDataWithTicket(e) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), o2 = this._cache.getStore(n2), r2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: o2, ticket: e });
      if (r2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), ke(Ie, { env: this.config.env }), ke(Pe, { loginType: Oe.CUSTOM, persistence: "local" }), { credential: { refreshToken: r2.refresh_token } };
      throw new H({ message: "\u533F\u540D\u8F6C\u5316\u5931\u8D25" });
    }
    _setAnonymousUUID(e) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e), this._cache.setStore(n2, Oe.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class je extends Ne {
    async signIn(e) {
      if (typeof e != "string")
        throw new H({ param: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new Fe(this.config.env);
      throw new H({ message: "\u81EA\u5B9A\u4E49\u767B\u5F55\u5931\u8D25" });
    }
  }
  class $e extends Ne {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token: r2, access_token_expire: i2 } = s2;
      if (o2)
        return this.setRefreshToken(o2), r2 && i2 ? this.setAccessToken(r2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.EMAIL, persistence: this.config.persistence }), new Fe(this.config.env);
      throw s2.code ? new H({ code: s2.code, message: `\u90AE\u7BB1\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new H({ message: "\u90AE\u7BB1\u767B\u5F55\u5931\u8D25" });
    }
    async activate(e) {
      return this._request.send("auth.activateEndUserMail", { token: e });
    }
    async resetPasswordWithToken(e, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e, newPassword: t2 });
    }
  }
  class Be extends Ne {
    async signIn(e, t2) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      typeof t2 != "string" && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: Oe.USERNAME, username: e, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: o2, access_token_expire: r2, access_token: i2 } = s2;
      if (o2)
        return this.setRefreshToken(o2), i2 && r2 ? this.setAccessToken(i2, r2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.USERNAME, persistence: this.config.persistence }), new Fe(this.config.env);
      throw s2.code ? new H({ code: s2.code, message: `\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25: ${s2.message}` }) : new H({ message: "\u7528\u6237\u540D\u5BC6\u7801\u767B\u5F55\u5931\u8D25" });
    }
  }
  class Ke {
    constructor(e) {
      this.config = e, this._cache = me(e.env), this._request = De(e.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), ve(Pe, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e = this.hasLoginState();
      return e && e.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new Me(this.config);
    }
    customAuthProvider() {
      return new je(this.config);
    }
    emailAuthProvider() {
      return new $e(this.config);
    }
    usernameAuthProvider() {
      return new Be(this.config);
    }
    async signInAnonymously() {
      return new Me(this.config).signIn();
    }
    async signInWithEmailAndPassword(e, t2) {
      return new $e(this.config).signIn(e, t2);
    }
    signInWithUsernameAndPassword(e, t2) {
      return new Be(this.config).signIn(e, t2);
    }
    async linkAndRetrieveDataWithTicket(e) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new Me(this.config)), ve(Ie, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e);
    }
    async signOut() {
      if (this.loginType === Oe.ANONYMOUS)
        throw new H({ message: "\u533F\u540D\u7528\u6237\u4E0D\u652F\u6301\u767B\u51FA\u64CD\u4F5C" });
      const { refreshTokenKey: e, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e);
      if (!s2)
        return;
      const o2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e), this._cache.removeStore(t2), this._cache.removeStore(n2), ke(Se), ke(Pe, { env: this.config.env, loginType: Oe.NULL, persistence: this.config.persistence }), o2;
    }
    async signUpWithEmailAndPassword(e, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e, password: t2 });
    }
    async sendPasswordResetEmail(e) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e });
    }
    onLoginStateChanged(e) {
      ve(Se, () => {
        const t3 = this.hasLoginState();
        e.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e.call(this, t2);
    }
    onLoginStateExpired(e) {
      ve(Ae, e.bind(this));
    }
    onAccessTokenRefreshed(e) {
      ve(be, e.bind(this));
    }
    onAnonymousConverted(e) {
      ve(Ie, e.bind(this));
    }
    onLoginTypeChanged(e) {
      ve(Pe, () => {
        const t2 = this.hasLoginState();
        e.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { refreshTokenKey: e } = this._cache.keys;
      return this._cache.getStore(e) ? new Fe(this.config.env) : null;
    }
    async isUsernameRegistered(e) {
      if (typeof e != "string")
        throw new H({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e) {
      return new je(this.config).signIn(e);
    }
    shouldRefreshAccessToken(e) {
      this._request._shouldRefreshAccessTokenHook = e.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e) => e.code ? e : __spreadProps(__spreadValues({}, e.data), { requestId: e.seqId }));
    }
    getAuthHeader() {
      const { refreshTokenKey: e, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e) {
      const { env: t2 } = e.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e) {
      const { loginType: t2, persistence: n2, env: s2 } = e.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const We = function(e, t2) {
    t2 = t2 || oe();
    const n2 = De(this.config.env), { cloudPath: s2, filePath: o2, onUploadProgress: r2, fileType: i2 = "image" } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e2, f2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: f2, file: o2, name: s2, fileType: i2, onUploadProgress: r2 }).then((e3) => {
        e3.statusCode === 201 ? t2(null, { fileID: l2, requestId: d2 }) : t2(new H({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e3.data}` }));
      }).catch((e3) => {
        t2(e3);
      });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, He = function(e, t2) {
    t2 = t2 || oe();
    const n2 = De(this.config.env), { cloudPath: s2 } = e;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e2) => {
      t2(null, e2);
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, ze = function({ fileList: e }, t2) {
    if (t2 = t2 || oe(), !e || !Array.isArray(e))
      return { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" };
    for (let t3 of e)
      if (!t3 || typeof t3 != "string")
        return { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u5B57\u7B26\u4E32" };
    const n2 = { fileid_list: e };
    return De(this.config.env).send("storage.batchDeleteFile", n2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.delete_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Je = function({ fileList: e }, t2) {
    t2 = t2 || oe(), e && Array.isArray(e) || t2(null, { code: "INVALID_PARAM", message: "fileList\u5FC5\u987B\u662F\u975E\u7A7A\u7684\u6570\u7EC4" });
    let n2 = [];
    for (let s3 of e)
      typeof s3 == "object" ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5305\u542BfileID\u548CmaxAge\u7684\u5BF9\u8C61" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : typeof s3 == "string" ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList\u7684\u5143\u7D20\u5FC5\u987B\u662F\u5B57\u7B26\u4E32" });
    const s2 = { file_list: n2 };
    return De(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e2) => {
      e2.code ? t2(null, e2) : t2(null, { fileList: e2.data.download_list, requestId: e2.requestId });
    }).catch((e2) => {
      t2(e2);
    }), t2.promise;
  }, Ve = async function({ fileID: e }, t2) {
    const n2 = (await Je.call(this, { fileList: [{ fileID: e, maxAge: 600 }] })).fileList[0];
    if (n2.code !== "SUCCESS")
      return t2 ? t2(n2) : new Promise((e2) => {
        e2(n2);
      });
    const s2 = De(this.config.env);
    let o2 = n2.download_url;
    if (o2 = encodeURI(o2), !t2)
      return s2.download({ url: o2 });
    t2(await s2.download({ url: o2 }));
  }, Ye = function({ name: e, data: t2, query: n2, parse: s2, search: o2 }, r2) {
    const i2 = r2 || oe();
    let a2;
    try {
      a2 = t2 ? JSON.stringify(t2) : "";
    } catch (e2) {
      return Promise.reject(e2);
    }
    if (!e)
      return Promise.reject(new H({ code: "PARAM_ERROR", message: "\u51FD\u6570\u540D\u4E0D\u80FD\u4E3A\u7A7A" }));
    const c2 = { inQuery: n2, parse: s2, search: o2, function_name: e, request_data: a2 };
    return De(this.config.env).send("functions.invokeFunction", c2).then((e2) => {
      if (e2.code)
        i2(null, e2);
      else {
        let t3 = e2.data.response_data;
        if (s2)
          i2(null, { result: t3, requestId: e2.requestId });
        else
          try {
            t3 = JSON.parse(e2.data.response_data), i2(null, { result: t3, requestId: e2.requestId });
          } catch (e3) {
            i2(new H({ message: "response data must be json" }));
          }
      }
      return i2.promise;
    }).catch((e2) => {
      i2(e2);
    }), i2.promise;
  }, Xe = { timeout: 15e3, persistence: "session" }, Ge = {};
  class Qe {
    constructor(e) {
      this.config = e || this.config, this.authObj = void 0;
    }
    init(e) {
      switch (ue.adapter || (this.requestClient = new ue.adapter.reqClass({ timeout: e.timeout || 5e3, timeoutMsg: `\u8BF7\u6C42\u5728${(e.timeout || 5e3) / 1e3}s\u5185\u672A\u5B8C\u6210\uFF0C\u5DF2\u4E2D\u65AD` })), this.config = __spreadValues(__spreadValues({}, Xe), e), true) {
        case this.config.timeout > 6e5:
          console.warn("timeout\u5927\u4E8E\u53EF\u914D\u7F6E\u4E0A\u9650[10\u5206\u949F]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0A\u9650\u6570\u503C"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout\u5C0F\u4E8E\u53EF\u914D\u7F6E\u4E0B\u9650[100ms]\uFF0C\u5DF2\u91CD\u7F6E\u4E3A\u4E0B\u9650\u6570\u503C"), this.config.timeout = 100;
      }
      return new Qe(this.config);
    }
    auth({ persistence: e } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e || ue.adapter.primaryStorage || Xe.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e2) {
        const { env: t3 } = e2;
        pe[t3] = new fe(e2), ge[t3] = new fe(__spreadProps(__spreadValues({}, e2), { persistence: "local" }));
      }(this.config), n2 = this.config, Le[n2.env] = new xe(n2), this.authObj = new Ke(this.config), this.authObj;
    }
    on(e, t2) {
      return ve.apply(this, [e, t2]);
    }
    off(e, t2) {
      return Te.apply(this, [e, t2]);
    }
    callFunction(e, t2) {
      return Ye.apply(this, [e, t2]);
    }
    deleteFile(e, t2) {
      return ze.apply(this, [e, t2]);
    }
    getTempFileURL(e, t2) {
      return Je.apply(this, [e, t2]);
    }
    downloadFile(e, t2) {
      return Ve.apply(this, [e, t2]);
    }
    uploadFile(e, t2) {
      return We.apply(this, [e, t2]);
    }
    getUploadMetadata(e, t2) {
      return He.apply(this, [e, t2]);
    }
    registerExtension(e) {
      Ge[e.name] = e;
    }
    async invokeExtension(e, t2) {
      const n2 = Ge[e];
      if (!n2)
        throw new H({ message: `\u6269\u5C55${e} \u5FC5\u987B\u5148\u6CE8\u518C` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e) {
      const { adapter: t2, runtime: n2 } = ce(e) || {};
      t2 && (ue.adapter = t2), n2 && (ue.runtime = n2);
    }
  }
  var Ze = new Qe();
  function et(e, t2, n2) {
    n2 === void 0 && (n2 = {});
    var s2 = /\?/.test(t2), o2 = "";
    for (var r2 in n2)
      o2 === "" ? !s2 && (t2 += "?") : o2 += "&", o2 += r2 + "=" + encodeURIComponent(n2[r2]);
    return /^http(s)?:\/\//.test(t2 += o2) ? t2 : "" + e + t2;
  }
  class tt {
    post(e) {
      const { url: t2, data: n2, headers: s2 } = e;
      return new Promise((e2, o2) => {
        X.request({ url: et("https:", t2), data: n2, method: "POST", header: s2, success(t3) {
          e2(t3);
        }, fail(e3) {
          o2(e3);
        } });
      });
    }
    upload(e) {
      return new Promise((t2, n2) => {
        const { url: s2, file: o2, data: r2, headers: i2, fileType: a2 } = e, c2 = X.uploadFile({ url: et("https:", s2), name: "file", formData: Object.assign({}, r2), filePath: o2, fileType: a2, header: i2, success(e2) {
          const n3 = { statusCode: e2.statusCode, data: e2.data || {} };
          e2.statusCode === 200 && r2.success_action_status && (n3.statusCode = parseInt(r2.success_action_status, 10)), t2(n3);
        }, fail(e2) {
          n2(new Error(e2.errMsg || "uploadFile:fail"));
        } });
        typeof e.onUploadProgress == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((t3) => {
          e.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const nt = { setItem(e, t2) {
    X.setStorageSync(e, t2);
  }, getItem: (e) => X.getStorageSync(e), removeItem(e) {
    X.removeStorageSync(e);
  }, clear() {
    X.clearStorageSync();
  } };
  var st = { genAdapter: function() {
    return { root: {}, reqClass: tt, localStorage: nt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  Ze.useAdapters(st);
  const ot = Ze, rt = ot.init;
  ot.init = function(e) {
    e.env = e.spaceId;
    const t2 = rt.call(this, e);
    t2.config.provider = "tencent", t2.config.spaceId = e.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e2) {
      const t3 = n2.call(this, e2);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e3) => {
        t3[e3] = W(t3[e3]).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var it = ot;
  function at(e) {
    return e && at(e.__v_raw) || e;
  }
  function ct() {
    return { token: X.getStorageSync("uni_id_token") || X.getStorageSync("uniIdToken"), tokenExpired: X.getStorageSync("uni_id_token_expired") };
  }
  function ut({ token: e, tokenExpired: t2 } = {}) {
    e && X.setStorageSync("uni_id_token", e), t2 && X.setStorageSync("uni_id_token_expired", t2);
  }
  function lt() {
    if (m !== "web")
      return;
    uni.getStorageSync("__LAST_DCLOUD_APPID") !== v && (uni.setStorageSync("__LAST_DCLOUD_APPID", v), console.warn("\u68C0\u6D4B\u5230\u5F53\u524D\u9879\u76EE\u4E0E\u4E0A\u6B21\u8FD0\u884C\u5230\u6B64\u7AEF\u53E3\u7684\u9879\u76EE\u4E0D\u4E00\u81F4\uFF0C\u81EA\u52A8\u6E05\u7406uni-id\u4FDD\u5B58\u7684token\u4FE1\u606F\uFF08\u4EC5\u5F00\u53D1\u8C03\u8BD5\u65F6\u751F\u6548\uFF09"), X.removeStorageSync("uni_id_token"), X.removeStorageSync("uniIdToken"), X.removeStorageSync("uni_id_token_expired"));
  }
  var ht = class extends Z {
    getAccessToken() {
      return new Promise((e, t2) => {
        const n2 = "Anonymous_Access_token";
        this.setAccessToken(n2), e(n2);
      });
    }
    setupRequest(e, t2) {
      const n2 = Object.assign({}, e, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      t2 !== "auth" && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = Y.sign(n2, this.config.clientSecret);
      const o2 = V();
      s2["x-client-info"] = encodeURIComponent(JSON.stringify(o2));
      const { token: r2 } = ct();
      return s2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: JSON.parse(JSON.stringify(s2)) };
    }
    uploadFileToOSS({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, onUploadProgress: r2 }) {
      return new Promise((i2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e, formData: t2, name: n2, filePath: s2, fileType: o2, success(e2) {
          e2 && e2.statusCode < 400 ? i2(e2) : a2(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        }, fail(e2) {
          a2(new H({ code: e2.code || "UPLOAD_FAILED", message: e2.message || e2.errMsg || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
        } });
        typeof r2 == "function" && c2 && typeof c2.onProgressUpdate == "function" && c2.onProgressUpdate((e2) => {
          r2({ loaded: e2.totalBytesSent, total: e2.totalBytesExpectedToSend });
        });
      });
    }
    uploadFile({ filePath: e, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new H({ code: "CLOUDPATH_REQUIRED", message: "cloudPath\u4E0D\u53EF\u4E3A\u7A7A" });
      let o2;
      return this.getOSSUploadOptionsFromPath({ cloudPath: t2 }).then((t3) => {
        const { url: r2, formData: i2, name: a2 } = t3.result;
        o2 = t3.result.fileUrl;
        const c2 = { url: r2, formData: i2, name: a2, filePath: e, fileType: n2 };
        return this.uploadFileToOSS(Object.assign({}, c2, { onUploadProgress: s2 }));
      }).then(() => this.reportOSSUpload({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e, fileID: o2 }) : s3(new H({ code: "UPLOAD_FAILED", message: "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25" }));
      }));
    }
    deleteFile({ fileList: e }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
    getTempFileURL({ fileList: e } = {}) {
      const t2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e }) };
      return this.request(this.setupRequest(t2));
    }
  };
  var dt = { init(e) {
    const t2 = new ht(e), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  function ft({ data: e }) {
    let t2;
    t2 = V();
    const n2 = JSON.parse(JSON.stringify(e || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e2 } = ct();
      e2 && (n2.uniIdToken = e2);
    }
    return n2;
  }
  function pt({ name: e, data: t2 } = {}) {
    const { localAddress: n2, localPort: s2 } = this.__dev__, o2 = { aliyun: "aliyun", tencent: "tcb" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${n2}:${s2}/system/check-function`, a2 = `http://${n2}:${s2}/cloudfunctions/${e}`;
    return new Promise((t3, n3) => {
      X.request({ method: "POST", url: i2, data: { name: e, platform: m, provider: o2, spaceId: r2 }, timeout: 3e3, success(e2) {
        t3(e2);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570\u3002" } });
      } });
    }).then(({ data: e2 } = {}) => {
      const { code: t3, message: n3 } = e2 || {};
      return { code: t3 === 0 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: n3, message: s3 }) => {
      if (n3 !== 0) {
        switch (n3) {
          case "MODULE_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u4F9D\u8D56\u52A0\u5BC6\u516C\u5171\u6A21\u5757\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`\u6B64\u4E91\u51FD\u6570\uFF08${e}\uFF09\u5DF2\u52A0\u5BC6\u4E0D\u53EF\u672C\u5730\u8C03\u8BD5\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u5DF2\u90E8\u7F72\u7684\u4E91\u51FD\u6570`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(s3 || "\u9700\u8981\u8BBF\u95EE\u52A0\u5BC6\u7684uni-clientDB-action\uFF0C\u81EA\u52A8\u5207\u6362\u4E3A\u4E91\u7AEF\u73AF\u5883");
            break;
          case "NETWORK_ERROR": {
            const e2 = "\u8FDE\u63A5\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5BA2\u6237\u7AEF\u662F\u5426\u548C\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B";
            throw console.error(e2), new Error(e2);
          }
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e2 = `\u68C0\u6D4B\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u51FA\u73B0\u9519\u8BEF\uFF1A${s3}\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u73AF\u5883\u6216\u91CD\u542F\u5BA2\u6237\u7AEF\u518D\u8BD5`;
            throw console.error(e2), new Error(e2);
          }
        }
        return this._callCloudFunction({ name: e, data: t2 });
      }
      return new Promise((e2, n4) => {
        const s4 = ft.call(this, { data: t2 });
        X.request({ method: "POST", url: a2, data: { provider: o2, platform: m, param: s4 }, success: ({ statusCode: t3, data: s5 } = {}) => !t3 || t3 >= 400 ? n4(new H({ code: s5.code || "SYS_ERR", message: s5.message || "request:fail" })) : e2({ result: s5 }), fail(e3) {
          n4(new H({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const gt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "\uFF0C\u4E91\u51FD\u6570[{functionName}]\u5728\u4E91\u7AEF\u4E0D\u5B58\u5728\uFF0C\u8BF7\u68C0\u67E5\u6B64\u4E91\u51FD\u6570\u540D\u79F0\u662F\u5426\u6B63\u786E\u4EE5\u53CA\u8BE5\u4E91\u51FD\u6570\u662F\u5426\u5DF2\u4E0A\u4F20\u5230\u670D\u52A1\u7A7A\u95F4", mode: "append" }];
  var mt = /[\\^$.*+?()[\]{}|]/g, yt = RegExp(mt.source);
  function _t(e, t2, n2) {
    return e.replace(new RegExp((s2 = t2) && yt.test(s2) ? s2.replace(mt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  function wt({ functionName: e, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function vt(e) {
    const t2 = e.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = ft.call(e, { data: n3.data });
      const o2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb" }[this.config.provider];
      return t2.call(this, n3).then((e2) => (e2.errCode = 0, wt.call(this, { functionName: s2, result: e2, logPvd: o2 }), Promise.resolve(e2)), (e2) => (wt.call(this, { functionName: s2, result: e2, logPvd: o2 }), e2 && e2.message && (e2.message = function({ message: e3 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: o3, content: r2, mode: i2 } = n4[s3], a2 = e3.match(o3);
          if (!a2)
            continue;
          let c2 = r2;
          for (let e4 = 1; e4 < a2.length; e4++)
            c2 = _t(c2, `{$${e4}}`, a2[e4]);
          for (const e4 in t3)
            c2 = _t(c2, `{${e4}}`, t3[e4]);
          return i2 === "replace" ? c2 : e3 + c2;
        }
        return e3;
      }({ message: `[${n3.name}]: ${e2.message}`, formatter: gt, extraInfo: { functionName: s2 } })), Promise.reject(e2)));
    };
    e.callFunction = function(t3) {
      let s2;
      e.__dev__.debugInfo && !e.__dev__.debugInfo.forceRemote && _ ? (e._callCloudFunction || (e._callCloudFunction = n2, e._callLocalFunction = pt), s2 = pt) : s2 = n2, s2 = s2.bind(e);
      const o2 = s2(t3);
      return Object.defineProperty(o2, "result", { get: () => (console.warn("\u5F53\u524D\u8FD4\u56DE\u7ED3\u679C\u4E3APromise\u7C7B\u578B\uFF0C\u4E0D\u53EF\u76F4\u63A5\u8BBF\u95EE\u5176result\u5C5E\u6027\uFF0C\u8BE6\u60C5\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), o2;
    };
  }
  const kt = Symbol("CLIENT_DB_INTERNAL");
  function Tt(e, t2) {
    return e.then = "DoNotReturnProxyWithAFunctionNamedThen", e._internalType = kt, e.__v_raw = void 0, new Proxy(e, { get(e2, n2, s2) {
      if (n2 === "_uniClient")
        return null;
      if (n2 in e2 || typeof n2 != "string") {
        const t3 = e2[n2];
        return typeof t3 == "function" ? t3.bind(e2) : t3;
      }
      return t2.get(e2, n2, s2);
    } });
  }
  function St(e) {
    return { on: (t2, n2) => {
      e[t2] = e[t2] || [], e[t2].indexOf(n2) > -1 || e[t2].push(n2);
    }, off: (t2, n2) => {
      e[t2] = e[t2] || [];
      const s2 = e[t2].indexOf(n2);
      s2 !== -1 && e[t2].splice(s2, 1);
    } };
  }
  const At = ["db.Geo", "db.command", "command.aggregate"];
  function Pt(e, t2) {
    return At.indexOf(`${e}.${t2}`) > -1;
  }
  function It(e) {
    switch (h(e = at(e))) {
      case "array":
        return e.map((e2) => It(e2));
      case "object":
        return e._internalType === kt || Object.keys(e).forEach((t2) => {
          e[t2] = It(e[t2]);
        }), e;
      case "regexp":
        return { $regexp: { source: e.source, flags: e.flags } };
      case "date":
        return { $date: e.toISOString() };
      default:
        return e;
    }
  }
  function bt(e) {
    return e && e.content && e.content.$method;
  }
  class Ot {
    constructor(e, t2, n2) {
      this.content = e, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e = this;
      const t2 = [e.content];
      for (; e.prevStage; )
        e = e.prevStage, t2.push(e.content);
      return { $db: t2.reverse().map((e2) => ({ $method: e2.$method, $param: It(e2.$param) })) };
    }
    getAction() {
      const e = this.toJSON().$db.find((e2) => e2.$method === "action");
      return e && e.$param && e.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e) => e.$method !== "action") };
    }
    get isAggregate() {
      let e = this;
      for (; e; ) {
        const t2 = bt(e), n2 = bt(e.prevStage);
        if (t2 === "aggregate" && n2 === "collection" || t2 === "pipeline")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e = this;
      for (; e; ) {
        if (bt(e) === "command")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e = this;
      for (; e; ) {
        const t2 = bt(e), n2 = bt(e.prevStage);
        if (t2 === "aggregate" && n2 === "command")
          return true;
        e = e.prevStage;
      }
      return false;
    }
    get count() {
      if (!this.isAggregate)
        return function() {
          return this._send("count", Array.from(arguments));
        };
      const e = this;
      return function() {
        return Ct({ $method: "count", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    get remove() {
      if (!this.isCommand)
        return function() {
          return this._send("remove", Array.from(arguments));
        };
      const e = this;
      return function() {
        return Ct({ $method: "remove", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    add() {
      return this._send("add", Array.from(arguments));
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      if (!this.isCommand)
        return function() {
          throw new Error("JQL\u7981\u6B62\u4F7F\u7528set\u65B9\u6CD5");
        };
      const e = this;
      return function() {
        return Ct({ $method: "set", $param: It(Array.from(arguments)) }, e, this._database);
      };
    }
    _send(e, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e, $param: It(t2) }), p) {
        const e2 = s2.$db.find((e3) => e3.$method === "collection"), t3 = e2 && e2.$param;
        t3 && t3.length === 1 && typeof e2.$param[0] == "string" && e2.$param[0].indexOf(",") > -1 && console.warn("\u68C0\u6D4B\u5230\u4F7F\u7528JQL\u8BED\u6CD5\u8054\u8868\u67E5\u8BE2\u65F6\uFF0C\u672A\u4F7F\u7528getTemp\u5148\u8FC7\u6EE4\u4E3B\u8868\u6570\u636E\uFF0C\u5728\u4E3B\u8868\u6570\u636E\u91CF\u5927\u7684\u60C5\u51B5\u4E0B\u53EF\u80FD\u4F1A\u67E5\u8BE2\u7F13\u6162\u3002\n- \u5982\u4F55\u4F18\u5316\u8BF7\u53C2\u8003\u6B64\u6587\u6863\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- \u5982\u679C\u4E3B\u8868\u6570\u636E\u91CF\u5F88\u5C0F\u8BF7\u5FFD\u7565\u6B64\u4FE1\u606F\uFF0C\u9879\u76EE\u53D1\u884C\u65F6\u4E0D\u4F1A\u51FA\u73B0\u6B64\u63D0\u793A\u3002");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function Ct(e, t2, n2) {
    return Tt(new Ot(e, t2, n2), { get(e2, t3) {
      let s2 = "db";
      return e2 && e2.content && (s2 = e2.content.$method), Pt(s2, t3) ? Ct({ $method: t3 }, e2, n2) : function() {
        return Ct({ $method: t3, $param: It(Array.from(arguments)) }, e2, n2);
      };
    } });
  }
  function Et({ path: e, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e.map((e2) => ({ $method: e2 })), { $method: t2, $param: this.param }] };
      }
    };
  }
  class Rt extends class {
    constructor({ uniClient: e = {} } = {}) {
      this._uniClient = e, this._authCallBacks = {}, this._dbCallBacks = {}, e.isDefault && (this._dbCallBacks = T("_globalUniCloudDatabaseCallback")), this.auth = St(this._authCallBacks), Object.assign(this, St(this._dbCallBacks)), this.env = Tt({}, { get: (e2, t2) => ({ $env: t2 }) }), this.Geo = Tt({}, { get: (e2, t2) => Et({ path: ["Geo"], method: t2 }) }), this.serverDate = Et({ path: [], method: "serverDate" }), this.RegExp = Et({ path: [], method: "RegExp" });
    }
    getCloudEnv(e) {
      if (typeof e != "string" || !e.trim())
        throw new Error("getCloudEnv\u53C2\u6570\u9519\u8BEF");
      return { $env: e.replace("$cloudEnv_", "") };
    }
    _callback(e, t2) {
      const n2 = this._dbCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    _callbackAuth(e, t2) {
      const n2 = this._authCallBacks;
      n2[e] && n2[e].forEach((e2) => {
        e2(...t2);
      });
    }
    multiSend() {
      const e = Array.from(arguments), t2 = e.map((e2) => {
        const t3 = e2.getAction(), n2 = e2.getCommand();
        if (n2.$db[n2.$db.length - 1].$method !== "getTemp")
          throw new Error("multiSend\u53EA\u652F\u6301\u5B50\u547D\u4EE4\u5185\u4F7F\u7528getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e });
    }
  } {
    _callCloudFunction({ action: e, command: t2, multiCommand: n2, queryList: s2 }) {
      function o2(e2, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const o3 = s2[n3];
            o3.udb && typeof o3.udb.setResult == "function" && (t3 ? o3.udb.setResult(t3) : o3.udb.setResult(e2.result.dataList[n3]));
          }
      }
      const r2 = this;
      function i2(e2) {
        return r2._callback("error", [e2]), b(O("database", "fail"), e2).then(() => b(O("database", "complete"), e2)).then(() => (o2(null, e2), j(R, { type: L, content: e2 }), Promise.reject(e2)));
      }
      const a2 = b(O("database", "invoke")), c2 = this._uniClient;
      return a2.then(() => c2.callFunction({ name: "DCloud-clientDB", type: l, data: { action: e, command: t2, multiCommand: n2 } })).then((e2) => {
        const { code: t3, message: n3, token: s3, tokenExpired: r3, systemInfo: a3 = [] } = e2.result;
        if (a3)
          for (let e3 = 0; e3 < a3.length; e3++) {
            const { level: t4, message: n4, detail: s4 } = a3[e3], o3 = console[m === "app" && t4 === "warn" ? "error" : t4] || console.log;
            let r4 = "[System Info]" + n4;
            s4 && (r4 = `${r4}
\u8BE6\u7EC6\u4FE1\u606F\uFF1A${s4}`), o3(r4);
          }
        if (t3) {
          return i2(new H({ code: t3, message: n3, requestId: e2.requestId }));
        }
        e2.result.errCode = e2.result.code, e2.result.errMsg = e2.result.message, s3 && r3 && (ut({ token: s3, tokenExpired: r3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: r3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: r3 }]), j(x, { token: s3, tokenExpired: r3 }));
        const c3 = [{ prop: "affectedDocs", tips: "affectedDocs\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528inserted/deleted/updated/data.length\u66FF\u4EE3" }, { prop: "code", tips: "code\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errCode\u66FF\u4EE3" }, { prop: "message", tips: "message\u4E0D\u518D\u63A8\u8350\u4F7F\u7528\uFF0C\u8BF7\u4F7F\u7528errMsg\u66FF\u4EE3" }];
        for (let t4 = 0; t4 < c3.length; t4++) {
          const { prop: n4, tips: s4 } = c3[t4];
          if (n4 in e2.result) {
            const t5 = e2.result[n4];
            Object.defineProperty(e2.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e3) {
          return b(O("database", "success"), e3).then(() => b(O("database", "complete"), e3)).then(() => (o2(e3, null), j(R, { type: L, content: e3 }), Promise.resolve(e3)));
        }(e2);
      }, (e2) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e2.message) && console.warn("clientDB\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5728web\u63A7\u5236\u53F0\u4FDD\u5B58\u4E00\u6B21schema\u4EE5\u5F00\u542FclientDB");
        return i2(new H({ code: e2.code || "SYSTEM_ERROR", message: e2.message, requestId: e2.requestId }));
      });
    }
  }
  function Ut(e) {
    e.database = function(t2) {
      if (t2 && Object.keys(t2).length > 0)
        return e.init(t2).database();
      if (this._database)
        return this._database;
      const n2 = function(e2, t3 = {}) {
        return Tt(new e2(t3), { get: (e3, t4) => Pt("db", t4) ? Ct({ $method: t4 }, null, e3) : function() {
          return Ct({ $method: t4, $param: It(Array.from(arguments)) }, null, e3);
        } });
      }(Rt, { uniClient: e });
      return this._database = n2, n2;
    };
  }
  const xt = "token\u65E0\u6548\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Lt = "token\u8FC7\u671F\uFF0C\u8DF3\u8F6C\u767B\u5F55\u9875\u9762", Dt = { TOKEN_INVALID_TOKEN_EXPIRED: Lt, TOKEN_INVALID_INVALID_CLIENTID: xt, TOKEN_INVALID: xt, TOKEN_INVALID_WRONG_TOKEN: xt, TOKEN_INVALID_ANONYMOUS_USER: xt }, Nt = { "uni-id-token-expired": Lt, "uni-id-check-token-failed": xt, "uni-id-token-not-exist": xt, "uni-id-check-device-feature-failed": xt };
  function qt(e, t2) {
    let n2 = "";
    return n2 = e ? `${e}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function Ft(e = [], t2 = "") {
    const n2 = [], s2 = [];
    return e.forEach((e2) => {
      e2.needLogin === true ? n2.push(qt(t2, e2.path)) : e2.needLogin === false && s2.push(qt(t2, e2.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function Mt(e) {
    return e.split("?")[0].replace(/^\//, "");
  }
  function jt() {
    return function(e) {
      let t2 = e && e.$page && e.$page.fullPath || "";
      return t2 ? (t2.charAt(0) !== "/" && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e = getCurrentPages();
      return e[e.length - 1];
    }());
  }
  function $t() {
    return Mt(jt());
  }
  function Bt(e = "", t2 = {}) {
    if (!e)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = Mt(e);
    return n2.some((e2) => e2.pagePath === s2);
  }
  const Kt = !!t.uniIdRouter;
  const { loginPage: Wt, routerNeedLogin: Ht, resToLogin: zt, needLoginPage: Jt, notNeedLoginPage: Vt, loginPageInTabBar: Yt } = function({ pages: e = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: o2 = {} } = t) {
    const { loginPage: r2, needLogin: i2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = Ft(e), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
      const t2 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: o3 = [] } = e3, { needLoginPage: r3, notNeedLoginPage: i3 } = Ft(o3, s3);
        t2.push(...r3), n3.push(...i3);
      }), { needLoginPage: t2, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: r2, routerNeedLogin: i2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: Bt(r2, o2) };
  }();
  if (Jt.indexOf(Wt) > -1)
    throw new Error(`Login page [${Wt}] should not be "needLogin", please check your pages.json`);
  function Xt(e) {
    const t2 = Mt(function(e2) {
      const t3 = $t(), n2 = e2.charAt(0), s2 = e2.split("?")[0];
      if (n2 === "/")
        return s2;
      const o2 = s2.replace(/^\//, "").split("/"), r2 = t3.split("/");
      r2.pop();
      for (let e3 = 0; e3 < o2.length; e3++) {
        const t4 = o2[e3];
        t4 === ".." ? r2.pop() : t4 !== "." && r2.push(t4);
      }
      return r2[0] === "" && r2.shift(), r2.join("/");
    }(e));
    return !(Vt.indexOf(t2) > -1) && (Jt.indexOf(t2) > -1 || Ht.some((t3) => function(e2, t4) {
      return new RegExp(t4).test(e2);
    }(e, t3)));
  }
  function Gt({ redirect: e }) {
    const t2 = Mt(e), n2 = Mt(Wt);
    return $t() !== n2 && t2 !== n2;
  }
  function Qt({ api: e, redirect: t2 } = {}) {
    if (!t2 || !Gt({ redirect: t2 }))
      return;
    const n2 = function(e2, t3) {
      return e2.charAt(0) !== "/" && (e2 = "/" + e2), t3 ? e2.indexOf("?") > -1 ? e2 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e2;
    }(Wt, t2);
    Yt ? e !== "navigateTo" && e !== "redirectTo" || (e = "switchTab") : e === "switchTab" && (e = "navigateTo"), setTimeout(() => {
      uni[e]({ url: n2 });
    });
  }
  function Zt({ url: e } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e2, tokenExpired: t3 } = ct();
      let n3;
      if (e2) {
        if (t3 < Date.now()) {
          const e3 = "uni-id-token-expired";
          n3 = { errCode: e3, errMsg: Nt[e3] };
        }
      } else {
        const e3 = "uni-id-check-token-failed";
        n3 = { errCode: e3, errMsg: Nt[e3] };
      }
      return n3;
    }();
    if (Xt(e) && n2) {
      n2.uniIdRedirectUrl = e;
      if (q(U).length > 0)
        return setTimeout(() => {
          j(U, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function en() {
    !function() {
      const e2 = jt(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Zt({ url: e2 });
      t2 || n2 && Qt({ api: "redirectTo", redirect: e2 });
    }();
    const e = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e.length; t2++) {
      const n2 = e[t2];
      uni.addInterceptor(n2, { invoke(e2) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Zt({ url: e2.url });
        return t3 ? e2 : s2 ? (Qt({ api: n2, redirect: e2.url }), false) : e2;
      } });
    }
  }
  function tn() {
    this.onResponse((e) => {
      const { type: t2, content: n2 } = e;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in Nt;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e2) {
            const { errCode: t3 } = e2;
            return t3 in Dt;
          }(n2);
      }
      s2 && function(e2 = {}) {
        const t3 = q(U);
        K().then(() => {
          const n3 = jt();
          if (n3 && Gt({ redirect: n3 }))
            return t3.length > 0 ? j(U, Object.assign({ uniIdRedirectUrl: n3 }, e2)) : void (Wt && Qt({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function nn(e) {
    !function(e2) {
      e2.onResponse = function(e3) {
        F(R, e3);
      }, e2.offResponse = function(e3) {
        M(R, e3);
      };
    }(e), function(e2) {
      e2.onNeedLogin = function(e3) {
        F(U, e3);
      }, e2.offNeedLogin = function(e3) {
        M(U, e3);
      }, Kt && (T("uni-cloud-status").needLoginInit || (T("uni-cloud-status").needLoginInit = true, K().then(() => {
        en.call(e2);
      }), zt && tn.call(e2)));
    }(e), function(e2) {
      e2.onRefreshToken = function(e3) {
        F(x, e3);
      }, e2.offRefreshToken = function(e3) {
        M(x, e3);
      };
    }(e);
  }
  let sn;
  const on = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", rn = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function an() {
    const e = ct().token || "", t2 = e.split(".");
    if (!e || t2.length !== 3)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(sn(s2).split("").map(function(e2) {
        return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e2) {
      throw new Error("\u83B7\u53D6\u5F53\u524D\u7528\u6237\u4FE1\u606F\u51FA\u9519\uFF0C\u8BE6\u7EC6\u9519\u8BEF\u4FE1\u606F\u4E3A\uFF1A" + e2.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  sn = typeof atob != "function" ? function(e) {
    if (e = String(e).replace(/[\t\n\f\r ]+/g, ""), !rn.test(e))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e += "==".slice(2 - (3 & e.length));
    for (var n2, s2, o2 = "", r2 = 0; r2 < e.length; )
      t2 = on.indexOf(e.charAt(r2++)) << 18 | on.indexOf(e.charAt(r2++)) << 12 | (n2 = on.indexOf(e.charAt(r2++))) << 6 | (s2 = on.indexOf(e.charAt(r2++))), o2 += n2 === 64 ? String.fromCharCode(t2 >> 16 & 255) : s2 === 64 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return o2;
  } : atob;
  var cn = s(function(e, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function o2(e2, t3) {
      return e2.tempFiles.forEach((e3, n3) => {
        e3.name || (e3.name = e3.path.substring(e3.path.lastIndexOf("/") + 1)), t3 && (e3.fileType = t3), e3.cloudPath = Date.now() + "_" + n3 + e3.name.substring(e3.name.lastIndexOf("."));
      }), e2.tempFilePaths || (e2.tempFilePaths = e2.tempFiles.map((e3) => e3.path)), e2;
    }
    function r2(e2, t3, { onChooseFile: s3, onUploadProgress: o3 }) {
      return t3.then((e3) => {
        if (s3) {
          const t4 = s3(e3);
          if (t4 !== void 0)
            return Promise.resolve(t4).then((t5) => t5 === void 0 ? e3 : t5);
        }
        return e3;
      }).then((t4) => t4 === false ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e3, t5, s4 = 5, o4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const r3 = t5.tempFiles, i2 = r3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= i2)
              return void (!r3.find((e4) => !e4.url && !e4.errMsg) && n3(t5));
            const u2 = r3[s5];
            e3.uploadFile({ filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, onUploadProgress(e4) {
              e4.index = s5, e4.tempFile = u2, e4.tempFilePath = u2.path, o4 && o4(e4);
            } }).then((e4) => {
              u2.url = e4.fileID, s5 < i2 && c2();
            }).catch((e4) => {
              u2.errMsg = e4.errMsg || e4.message, s5 < i2 && c2();
            });
          }
        });
      }(e2, t4, 5, o3));
    }
    t2.initChooseAndUploadFile = function(e2) {
      return function(t3 = { type: "all" }) {
        return t3.type === "image" ? r2(e2, function(e3) {
          const { count: t4, sizeType: n3, sourceType: r3 = ["album", "camera"], extension: i2 } = e3;
          return new Promise((e4, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: r3, extension: i2, success(t5) {
              e4(o2(t5, "image"));
            }, fail(e5) {
              a2({ errMsg: e5.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : t3.type === "video" ? r2(e2, function(e3) {
          const { camera: t4, compressed: n3, maxDuration: r3, sourceType: i2 = ["album", "camera"], extension: a2 } = e3;
          return new Promise((e4, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: r3, sourceType: i2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: r4, height: i3, width: a3 } = t5;
              e4(o2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: r4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: i3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e5) {
              c2({ errMsg: e5.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : r2(e2, function(e3) {
          const { count: t4, extension: n3 } = e3;
          return new Promise((e4, r3) => {
            let i2 = uni.chooseFile;
            if (typeof wx != "undefined" && typeof wx.chooseMessageFile == "function" && (i2 = wx.chooseMessageFile), typeof i2 != "function")
              return r3({ errMsg: s2 + " \u8BF7\u6307\u5B9A type \u7C7B\u578B\uFF0C\u8BE5\u5E73\u53F0\u4EC5\u652F\u6301\u9009\u62E9 image \u6216 video\u3002" });
            i2({ type: "all", count: t4, extension: n3, success(t5) {
              e4(o2(t5));
            }, fail(e5) {
              r3({ errMsg: e5.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), un = n(cn);
  const ln = "manual";
  function hn(e) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {} }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e2 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e2.push(this[t2]);
        }), e2;
      }, (e2, t2) => {
        if (this.loadtime === ln)
          return;
        let n2 = false;
        const s2 = [];
        for (let o2 = 2; o2 < e2.length; o2++)
          e2[o2] !== t2[o2] && (s2.push(e2[o2]), n2 = true);
        e2[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e2, t2) {
    }, mixinDatacomEasyGet({ getone: e2 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: o2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = o2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const r2 = e2 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = r2, t2 && t2(r2);
      }).catch((e3) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e3, n2 && n2(e3);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2 = e.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const o2 = t2.collection || this.collection;
      n2 = Array.isArray(o2) ? n2.collection(...o2) : n2.collection(o2);
      const r2 = t2.where || this.where;
      r2 && Object.keys(r2).length && (n2 = n2.where(r2));
      const i2 = t2.field || this.field;
      i2 && (n2 = n2.field(i2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      (t2.distinct !== void 0 ? t2.distinct : this.distinct) === true && (n2 = n2.distinct());
      const l2 = t2.orderby || this.orderby;
      l2 && (n2 = n2.orderBy(l2));
      const h2 = t2.pageCurrent !== void 0 ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = t2.pageSize !== void 0 ? t2.pageSize : this.mixinDatacomPage.size, f2 = t2.getcount !== void 0 ? t2.getcount : this.getcount, p2 = t2.gettree !== void 0 ? t2.gettree : this.gettree, g2 = t2.gettreepath !== void 0 ? t2.gettreepath : this.gettreepath, m2 = { getCount: f2 }, y2 = { limitLevel: t2.limitlevel !== void 0 ? t2.limitlevel : this.limitlevel, startWith: t2.startwith !== void 0 ? t2.startwith : this.startwith };
      return p2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function dn(e) {
    return function(t2, n2 = {}) {
      n2 = function(e2, t3 = {}) {
        return e2.customUI = t3.customUI || e2.customUI, Object.assign(e2.loadingOptions, t3.loadingOptions), Object.assign(e2.errorOptions, t3.errorOptions), typeof t3.secretMethods == "object" && (e2.secretMethods = t3.secretMethods), e2;
      }({ customUI: false, loadingOptions: { title: "\u52A0\u8F7D\u4E2D...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: o2, errorOptions: r2 } = n2, i2 = !s2;
      return new Proxy({}, { get: (s3, a2) => function({ fn: e2, interceptorName: t3, getCallbackArgs: n3 } = {}) {
        return async function(...s4) {
          const o3 = n3 ? n3({ params: s4 }) : {};
          let r3, i3;
          try {
            return await b(O(t3, "invoke"), __spreadValues({}, o3)), r3 = await e2(...s4), await b(O(t3, "success"), __spreadProps(__spreadValues({}, o3), { result: r3 })), r3;
          } catch (e3) {
            throw i3 = e3, await b(O(t3, "fail"), __spreadProps(__spreadValues({}, o3), { error: i3 })), i3;
          } finally {
            await b(O(t3, "complete"), i3 ? __spreadProps(__spreadValues({}, o3), { error: i3 }) : __spreadProps(__spreadValues({}, o3), { result: r3 }));
          }
        };
      }({ fn: async function s4(...c2) {
        let l2;
        i2 && uni.showLoading({ title: o2.title, mask: o2.mask });
        const h2 = { name: t2, type: u, data: { method: a2, params: c2 } };
        typeof n2.secretMethods == "object" && function(e2, t3) {
          const n3 = t3.data.method, s5 = e2.secretMethods || {}, o3 = s5[n3] || s5["*"];
          o3 && (t3.secret = o3);
        }(n2, h2);
        try {
          l2 = await e.callFunction(h2);
        } catch (e2) {
          l2 = { result: e2 };
        }
        const { errCode: d2, errMsg: f2, newToken: p2 } = l2.result || {};
        if (i2 && uni.hideLoading(), p2 && p2.token && p2.tokenExpired && (ut(p2), j(x, __spreadValues({}, p2))), d2) {
          if (i2)
            if (r2.type === "toast")
              uni.showToast({ title: f2, icon: "none" });
            else {
              if (r2.type !== "modal")
                throw new Error(`Invalid errorOptions.type: ${r2.type}`);
              {
                const { confirm: e3 } = await async function({ title: e4, content: t3, showCancel: n3, cancelText: s5, confirmText: o3 } = {}) {
                  return new Promise((r3, i3) => {
                    uni.showModal({ title: e4, content: t3, showCancel: n3, cancelText: s5, confirmText: o3, success(e5) {
                      r3(e5);
                    }, fail() {
                      r3({ confirm: false, cancel: true });
                    } });
                  });
                }({ title: "\u63D0\u793A", content: f2, showCancel: r2.retry, cancelText: "\u53D6\u6D88", confirmText: r2.retry ? "\u91CD\u8BD5" : "\u786E\u5B9A" });
                if (r2.retry && e3)
                  return s4(...c2);
              }
            }
          const e2 = new H({ code: d2, message: f2, requestId: l2.requestId });
          throw e2.detail = l2.result, j(R, { type: N, content: e2 }), e2;
        }
        return j(R, { type: N, content: l2.result }), l2.result;
      }, interceptorName: "callObject", getCallbackArgs: function({ params: e2 } = {}) {
        return { objectName: t2, methodName: a2, params: e2 };
      } }) });
    };
  }
  async function fn(e, t2) {
    const n2 = `http://${e}:${t2}/system/ping`;
    try {
      const e2 = await (s2 = { url: n2, timeout: 500 }, new Promise((e3, t3) => {
        X.request(__spreadProps(__spreadValues({}, s2), { success(t4) {
          e3(t4);
        }, fail(e4) {
          t3(e4);
        } }));
      }));
      return !(!e2.data || e2.data.code !== 0);
    } catch (e2) {
      return false;
    }
    var s2;
  }
  function pn(e) {
    if (e.initUniCloudStatus && e.initUniCloudStatus !== "rejected")
      return;
    let t2 = Promise.resolve();
    var n2;
    n2 = 1, t2 = new Promise((e2, t3) => {
      setTimeout(() => {
        e2();
      }, n2);
    }), e.isReady = false, e.isDefault = false;
    const s2 = e.auth();
    e.initUniCloudStatus = "pending", e.initUniCloud = t2.then(() => s2.getLoginState()).then((e2) => e2 ? Promise.resolve() : s2.signInAnonymously()).then(() => {
      if (m === "app") {
        const { osName: e2, osVersion: t3 } = uni.getSystemInfoSync();
        e2 === "ios" && function(e3) {
          if (!e3 || typeof e3 != "string")
            return 0;
          const t4 = e3.match(/^(\d+)./);
          return t4 && t4[1] ? parseInt(t4[1]) : 0;
        }(t3) >= 14 && console.warn("iOS 14\u53CA\u4EE5\u4E0A\u7248\u672C\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u9700\u8981\u5141\u8BB8\u5BA2\u6237\u7AEF\u67E5\u627E\u5E76\u8FDE\u63A5\u5230\u672C\u5730\u7F51\u7EDC\u4E0A\u7684\u8BBE\u5907\uFF08\u4EC5\u5F00\u53D1\u6A21\u5F0F\u751F\u6548\uFF0C\u53D1\u884C\u6A21\u5F0F\u4F1A\u8FDE\u63A5uniCloud\u4E91\u7AEF\u670D\u52A1\uFF09");
      }
      if (e.__dev__.debugInfo) {
        const { address: t3, servePort: n3 } = e.__dev__.debugInfo;
        return async function(e2, t4) {
          let n4;
          for (let s3 = 0; s3 < e2.length; s3++) {
            const o2 = e2[s3];
            if (await fn(o2, t4)) {
              n4 = o2;
              break;
            }
          }
          return { address: n4, port: t4 };
        }(t3, n3);
      }
    }).then(({ address: t3, port: n3 } = {}) => {
      const s3 = console[m === "app" ? "error" : "warn"];
      if (t3)
        e.__dev__.localAddress = t3, e.__dev__.localPort = n3;
      else if (e.__dev__.debugInfo) {
        let t4 = "";
        e.__dev__.debugInfo.initialLaunchType === "remote" ? (e.__dev__.debugInfo.forceRemote = true, t4 = "\u5F53\u524D\u5BA2\u6237\u7AEF\u548CHBuilderX\u4E0D\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\uFF08\u6216\u5176\u4ED6\u7F51\u7EDC\u539F\u56E0\u65E0\u6CD5\u8FDE\u63A5HBuilderX\uFF09\uFF0CuniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\u4E0D\u5BF9\u5F53\u524D\u5BA2\u6237\u7AEF\u751F\u6548\u3002\n- \u5982\u679C\u4E0D\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u76F4\u63A5\u5FFD\u7565\u6B64\u4FE1\u606F\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs") : t4 = "\u65E0\u6CD5\u8FDE\u63A5uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u5F53\u524D\u5BA2\u6237\u7AEF\u662F\u5426\u4E0E\u4E3B\u673A\u5728\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u3002\n- \u5982\u9700\u4F7F\u7528uniCloud\u672C\u5730\u8C03\u8BD5\u670D\u52A1\uFF0C\u8BF7\u5C06\u5BA2\u6237\u7AEF\u4E0E\u4E3B\u673A\u8FDE\u63A5\u5230\u540C\u4E00\u5C40\u57DF\u7F51\u4E0B\u5E76\u91CD\u65B0\u8FD0\u884C\u5230\u5BA2\u6237\u7AEF\u3002\n- \u5982\u679C\u5728HBuilderX\u5F00\u542F\u7684\u72B6\u6001\u4E0B\u5207\u6362\u8FC7\u7F51\u7EDC\u73AF\u5883\uFF0C\u8BF7\u91CD\u542FHBuilderX\u540E\u518D\u8BD5\n- \u68C0\u67E5\u7CFB\u7EDF\u9632\u706B\u5899\u662F\u5426\u62E6\u622A\u4E86HBuilderX\u81EA\u5E26\u7684nodejs", m === "web" && (t4 += "\n- \u90E8\u5206\u6D4F\u89C8\u5668\u5F00\u542F\u8282\u6D41\u6A21\u5F0F\u4E4B\u540E\u8BBF\u95EE\u672C\u5730\u5730\u5740\u53D7\u9650\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u542F\u7528\u4E86\u8282\u6D41\u6A21\u5F0F"), m.indexOf("mp-") === 0 && (t4 += "\n- \u5C0F\u7A0B\u5E8F\u4E2D\u5982\u4F55\u4F7F\u7528uniCloud\uFF0C\u8BF7\u53C2\u8003\uFF1Ahttps://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), s3(t4);
      }
    }).then(() => {
      lt(), e.isReady = true, e.initUniCloudStatus = "fulfilled";
    }).catch((t3) => {
      console.error(t3), e.initUniCloudStatus = "rejected";
    });
  }
  const gn = { tcb: it, tencent: it, aliyun: ee, private: dt };
  let mn = new class {
    init(e) {
      let t2 = {};
      const n2 = gn[e.provider];
      if (!n2)
        throw new Error("\u672A\u63D0\u4F9B\u6B63\u786E\u7684provider\u53C2\u6570");
      t2 = n2.init(e), t2.__dev__ = {}, t2.__dev__.debugLog = m === "web" && navigator.userAgent.indexOf("HBuilderX") > 0 || m === "app";
      const s2 = y;
      s2 && !s2.code && (t2.__dev__.debugInfo = s2), pn(t2), t2.reInit = function() {
        pn(this);
      }, vt(t2), function(e2) {
        const t3 = e2.uploadFile;
        e2.uploadFile = function(e3) {
          return t3.call(this, e3);
        };
      }(t2), Ut(t2), function(e2) {
        e2.getCurrentUserInfo = an, e2.chooseAndUploadFile = un.initChooseAndUploadFile(e2), Object.assign(e2, { get mixinDatacom() {
          return hn(e2);
        } }), e2.importObject = dn(e2);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e2) => {
        if (!t2[e2])
          return;
        const n3 = t2[e2];
        t2[e2] = function() {
          return t2.reInit(), n3.apply(t2, Array.from(arguments));
        }, t2[e2] = W(t2[e2], e2).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e = _;
    let t2 = {};
    if (e && e.length === 1)
      t2 = e[0], mn = mn.init(t2), mn.isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e && e.length > 0 ? "\u5E94\u7528\u6709\u591A\u4E2A\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u901A\u8FC7uniCloud.init\u65B9\u6CD5\u6307\u5B9A\u8981\u4F7F\u7528\u7684\u670D\u52A1\u7A7A\u95F4" : "\u5E94\u7528\u672A\u5173\u8054\u670D\u52A1\u7A7A\u95F4\uFF0C\u8BF7\u5728uniCloud\u76EE\u5F55\u53F3\u952E\u5173\u8054\u670D\u52A1\u7A7A\u95F4", t3.forEach((e2) => {
        mn[e2] = function() {
          return console.error(n2), Promise.reject(new H({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    Object.assign(mn, { get mixinDatacom() {
      return hn(mn);
    } }), nn(mn), mn.addInterceptor = P, mn.removeInterceptor = I, mn.interceptObject = C, m === "web" && (window.uniCloud = mn);
  })();
  var yn = mn;
  function uniHttpGet(name) {
    return new Promise((resolve, reject) => {
      yn.callFunction({
        name
      }).then((res) => {
        resolve(res.result);
      }).catch((err) => {
        reject(err);
      });
    }).catch((e) => {
    });
  }
  function formatScheduleData(data2) {
    return data2.reduce((prev, cur) => {
      const index = cur.index;
      const weekday = cur.weekday;
      prev[`${index}_${weekday}`] = cur;
      return prev;
    }, {});
  }
  async function getInitialData() {
    const {
      duration,
      singleBox
    } = await uniHttpGet("scheduleTable");
    return Promise.resolve({
      duration,
      singleBox: formatScheduleData(singleBox)
    });
  }
  const data = vue.reactive({
    singleBox: [],
    duration: []
  });
  function useInitialData() {
    function setInitialData({
      duration,
      singleBox
    }) {
      data.singleBox = singleBox;
      data.duration = duration;
    }
    function setSchedule({
      type,
      result
    }) {
    }
    return [data, setInitialData, setSchedule];
  }
  var weekdays = [
    {
      id: 1,
      title: "\u5468\u4E00"
    },
    {
      id: 2,
      title: "\u5468\u4E8C"
    },
    {
      id: 3,
      title: "\u5468\u4E09"
    },
    {
      id: 4,
      title: "\u5468\u56DB"
    },
    {
      id: 5,
      title: "\u5468\u4E94"
    }
  ];
  const _sfc_main$a = {
    name: "UniCard",
    emits: ["click"],
    props: {
      title: {
        type: String,
        default: ""
      },
      subTitle: {
        type: String,
        default: ""
      },
      padding: {
        type: String,
        default: "10px"
      },
      margin: {
        type: String,
        default: "15px"
      },
      spacing: {
        type: String,
        default: "0 10px"
      },
      extra: {
        type: String,
        default: ""
      },
      cover: {
        type: String,
        default: ""
      },
      thumbnail: {
        type: String,
        default: ""
      },
      isFull: {
        type: Boolean,
        default: false
      },
      isShadow: {
        type: Boolean,
        default: true
      },
      shadow: {
        type: String,
        default: "0px 0px 3px 1px rgba(0, 0, 0, 0.08)"
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      onClick(type) {
        this.$emit("click", type);
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["uni-card", { "uni-card--full": $props.isFull, "uni-card--shadow": $props.isShadow, "uni-card--border": $props.border }]),
      style: vue.normalizeStyle({ "margin": $props.isFull ? 0 : $props.margin, "padding": $props.spacing, "box-shadow": $props.isShadow ? $props.shadow : "" })
    }, [
      vue.createCommentVNode(" \u5C01\u9762 "),
      vue.renderSlot(_ctx.$slots, "cover", {}, () => [
        $props.cover ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-card__cover"
        }, [
          vue.createElementVNode("image", {
            class: "uni-card__cover-image",
            mode: "widthFix",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.onClick("cover")),
            src: $props.cover
          }, null, 8, ["src"])
        ])) : vue.createCommentVNode("v-if", true)
      ], true),
      vue.renderSlot(_ctx.$slots, "title", {}, () => [
        $props.title || $props.extra ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-card__header"
        }, [
          vue.createCommentVNode(" \u5361\u7247\u6807\u9898 "),
          vue.createElementVNode("view", {
            class: "uni-card__header-box",
            onClick: _cache[1] || (_cache[1] = ($event) => $options.onClick("title"))
          }, [
            $props.thumbnail ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "uni-card__header-avatar"
            }, [
              vue.createElementVNode("image", {
                class: "uni-card__header-avatar-image",
                src: $props.thumbnail,
                mode: "aspectFit"
              }, null, 8, ["src"])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "uni-card__header-content" }, [
              vue.createElementVNode("text", { class: "uni-card__header-content-title uni-ellipsis" }, vue.toDisplayString($props.title), 1),
              $props.title && $props.subTitle ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "uni-card__header-content-subtitle uni-ellipsis"
              }, vue.toDisplayString($props.subTitle), 1)) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode("view", {
            class: "uni-card__header-extra",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.onClick("extra"))
          }, [
            vue.createElementVNode("text", { class: "uni-card__header-extra-text" }, vue.toDisplayString($props.extra), 1)
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ], true),
      vue.createCommentVNode(" \u5361\u7247\u5185\u5BB9 "),
      vue.createElementVNode("view", {
        class: "uni-card__content",
        style: vue.normalizeStyle({ padding: $props.padding }),
        onClick: _cache[3] || (_cache[3] = ($event) => $options.onClick("content"))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 4),
      vue.createElementVNode("view", {
        class: "uni-card__actions",
        onClick: _cache[4] || (_cache[4] = ($event) => $options.onClick("actions"))
      }, [
        vue.renderSlot(_ctx.$slots, "actions", {}, void 0, true)
      ])
    ], 6);
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$7], ["__scopeId", "data-v-19622063"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/uni_modules/uni-card/components/uni-card/uni-card.vue"]]);
  const _sfc_main$9 = {
    __name: "Card",
    props: {
      data: Object
    },
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
        return vue.openBlock(), vue.createBlock(_component_uni_card, {
          "is-full": "true",
          padding: "2px 0"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("text", { class: "course" }, vue.toDisplayString(__props.data.course), 1),
            vue.createElementVNode("br"),
            vue.createElementVNode("text", { class: "teacher" }, vue.toDisplayString(__props.data.teacher), 1),
            vue.createElementVNode("br"),
            vue.createElementVNode("text", { class: "adress" }, vue.toDisplayString(__props.data.adress), 1),
            vue.createElementVNode("br"),
            vue.createElementVNode("text", { class: "score" }, vue.toDisplayString(__props.data.score) + "\u5B66\u5206", 1)
          ]),
          _: 1
        });
      };
    }
  };
  var Card = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-34fe1506"], ["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/index/Card.vue"]]);
  const _sfc_main$8 = {
    __name: "index",
    setup(__props) {
      const [
        data2,
        setInitialData,
        setSchedule
      ] = useInitialData();
      vue.onMounted(async () => {
        setInitialData(await getInitialData());
      });
      const handleTDClick = (index, weekday) => {
        formatAppLog("log", "at pages/index/index.vue:51", index + " " + weekday + " ");
      };
      const {
        duration,
        singleBox
      } = vue.toRefs(data2);
      return (_ctx, _cache) => {
        const _component_uni_th = resolveEasycom(vue.resolveDynamicComponent("uni-th"), __easycom_0$1);
        const _component_uni_tr = resolveEasycom(vue.resolveDynamicComponent("uni-tr"), __easycom_1);
        const _component_uni_td = resolveEasycom(vue.resolveDynamicComponent("uni-td"), __easycom_2);
        const _component_uni_table = resolveEasycom(vue.resolveDynamicComponent("uni-table"), __easycom_3);
        return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
          vue.createVNode(_component_uni_table, {
            border: "",
            stripe: "",
            emptyText: "\u6682\u65E0\u66F4\u591A\u6570\u636E"
          }, {
            default: vue.withCtx(() => [
              vue.createCommentVNode(" \u661F\u671F "),
              vue.createVNode(_component_uni_tr, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_th, { width: "1" }),
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(weekdays), (item) => {
                    return vue.openBlock(), vue.createBlock(_component_uni_th, {
                      align: "center",
                      keyt: item.id,
                      width: "1"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.title), 1)
                      ]),
                      _: 2
                    }, 1032, ["keyt"]);
                  }), 256))
                ]),
                _: 1
              }),
              vue.createCommentVNode(" \u8868\u683C\u6570\u636E\u884C "),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(duration), (item) => {
                return vue.openBlock(), vue.createBlock(_component_uni_tr, null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_uni_td, { style: { "font-size": "8px" } }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("view", null, "\u7B2C" + vue.toDisplayString(item.index) + "\u8282", 1),
                        vue.createElementVNode("view", null, vue.toDisplayString(item.title), 1)
                      ]),
                      _: 2
                    }, 1024),
                    (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(5, (n2) => {
                      return vue.createVNode(_component_uni_td, {
                        key: n2,
                        onClick: ($event) => handleTDClick(item.index, n2),
                        style: { "padding": "0", "margin": "0" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.unref(singleBox)[item.index + "_" + n2] ? (vue.openBlock(), vue.createBlock(Card, {
                            key: 0,
                            data: vue.unref(singleBox)[item.index + "_" + n2]
                          }, null, 8, ["data"])) : vue.createCommentVNode("v-if", true)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 64))
                  ]),
                  _: 2
                }, 1024);
              }), 256))
            ]),
            _: 1
          })
        ]);
      };
    }
  };
  var PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__file", "F:/code/\u5927\u521B/dxszwglapp/\u5927\u5B66\u751F\u81EA\u6211\u7BA1\u7406APP/pages/index/index.vue"]]);
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
          let isAll = childrens.find((n2, ids) => ids !== 0 && !n2.checkboxData.checked);
          childrens[0].checkboxData.checked = isAll ? false : true;
        }
        let fireArr = [];
        for (let i2 = 0; i2 < childrens.length; i2++) {
          if (childrens[i2].checkboxData.checked && i2 !== 0) {
            fireArr.push(childrens[i2].checkboxData.value - 1);
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
        for (let i2 = 0; i2 < len; i2++) {
          if (this.selectArr.indexOf(i2) >= 0) {
            this.selectArr.indexOf(i2);
          } else {
            arr.push(this.tableList[i2]);
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
})(Vue, uni.VueShared);
