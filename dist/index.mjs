// src/index.ts
import { getCurrentInstance, onScopeDispose, readonly, ref } from "vue";
import { toReactive } from "@vueuse/core";
import { createStore as createZustandStore } from "zustand/vanilla";

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
  const state = ref(initialValue);
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
  if (getCurrentInstance()) {
    onScopeDispose(() => {
      unsubscribe();
    });
  }
  return isPrimitive(state.value) ? readonly(state) : toReactive(state);
}
function createImpl(createState) {
  const api = typeof createState === "function" ? createZustandStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
}
var create = (createState) => createState ? createImpl(createState) : createImpl;
var src_default = create;
export {
  src_default as default,
  useStore
};
