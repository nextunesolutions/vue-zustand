"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  useStore: () => useStore
});
module.exports = __toCommonJS(src_exports);
var import_vue = require("vue");
var import_core = require("@vueuse/core");
var import_vanilla = require("zustand/vanilla");

// src/util.ts
function isPrimitive(val) {
  if (typeof val === "object")
    return val === null;
  return typeof val !== "function";
}

// src/index.ts
function useStore(api, selector = api.getState, equalityFn) {
  const initialValue = selector(api.getState());
  if (typeof initialValue === "function")
    return initialValue;
  const state = (0, import_vue.ref)(initialValue);
  const listener = (nextState, previousState) => {
    const prevStateSlice = selector(previousState);
    const nextStateSlice = selector(nextState);
    if (equalityFn !== void 0) {
      if (!equalityFn(prevStateSlice, nextStateSlice))
        state.value = nextStateSlice;
    } else {
      state.value = nextStateSlice;
    }
  };
  const unsubscribe = api.subscribe(listener);
  if ((0, import_vue.getCurrentInstance)()) {
    (0, import_vue.onScopeDispose)(() => {
      unsubscribe();
    });
  }
  return isPrimitive(state.value) ? (0, import_vue.readonly)(state) : (0, import_core.toReactive)(state);
}
function createImpl(createState) {
  const api = typeof createState === "function" ? (0, import_vanilla.createStore)(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
}
var create = (createState) => createState ? createImpl(createState) : createImpl;
var src_default = create;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useStore
});
