export interface RefreshedRef<T = any> extends Ref<T> {
  get value(): T

  /**
   * The function for value refreshing. Call emits recomputing.
   */
  refresh: () => void
}

/**
 * [`ComputedRef`](ComputedRef) over type [`T`](T) that supports refreshing.
 *
 * @param compute The function getter or computer, which will result fresh value
 * @returns [`RefreshedRef`](RefreshedRef) type over computer [`T`](T) type.
 */
export const refreshed = <T>(compute: () => T): RefreshedRef<T> => {
  const internal = ref(0)

  return {
    ...ref(),
    get value() {
      const _ = internal.value
      return compute()
    },
    refresh() { internal.value += 1 },
  }
}
