import { type Ref, getCurrentInstance, shallowRef } from 'vue';
import { getKebabCase } from '@/utils';
import { useVModel } from './v-model';
import type { Getter } from '@/types';

interface Options<T> {
  propName?: string;
  setter?: (newValue: T) => T;
}

/**
 * Creates a controllable state using a getter function and optional settings.
 *
 * @param {Getter<T>} getter - A function that returns the current state value.
 * @param {Options<T>} [options={}] - Optional settings for the controllable state.
 * @param {string} [options.propName] - The name of the prop to bind the model value.
 * @param {(newValue: T) => T} [options.setter] - A function to set the new value.
 * @returns {Ref<T>} A reactive reference to the state value.
 */
export function useControllableState<T>(getter: Getter<T>, options: Options<T> = {}): Ref<T> {
  const { propName = 'modelValue', setter } = options;
  const isControlled = hasVModelBound(propName);

  return isControlled
    ? useVModel(getter, { eventName: `update:${propName}`, setter })
    : shallowRef(getter());
}

function hasVModelBound(propName: string) {
  const vm = getCurrentInstance();
  const kebabPropName = getKebabCase(propName);

  const hasPropBound = hasOwn(vm?.vnode.props, propName) || hasOwn(vm?.vnode.props, kebabPropName);
  const hasEventBound =
    hasOwn(vm?.vnode.props, `onUpdate:${propName}`) ||
    hasOwn(vm?.vnode.props, `onUpdate:${kebabPropName}`);

  return hasPropBound && hasEventBound;
}

function hasOwn(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
