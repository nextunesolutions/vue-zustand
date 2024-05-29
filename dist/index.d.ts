import { StoreApi, StoreMutatorIdentifier, StateCreator, Mutate } from 'zustand/vanilla';
import { Ref, UnwrapNestedRefs } from 'vue';

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type IsPrimitive<T> = T extends Primitive ? Ref<T> : UnwrapNestedRefs<T>;

type ExtractState<S> = S extends {
    getState: () => infer T;
} ? T : never;
declare function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>;
declare function useStore<S extends StoreApi<unknown>, U>(api: S, selector: (state: ExtractState<S>) => U, equalityFn?: (a: U, b: U) => boolean): U;
type UseBoundStore<S extends StoreApi<unknown>> = {
    (): ExtractState<S> extends (...args: any[]) => any ? ExtractState<S> : IsPrimitive<ExtractState<S>>;
    <U>(selector: (state: ExtractState<S>) => U, equals?: (a: U, b: U) => boolean): U extends (...args: any[]) => any ? U : IsPrimitive<IsPrimitive<U>>;
} & S;
interface Create {
    <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>) => UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <S extends StoreApi<unknown>>(store: S): UseBoundStore<S>;
}
declare const create: Create;

export { UseBoundStore, create as default, useStore };
