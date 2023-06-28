interface RangeOptions {
  include?: boolean
  step?: number
}

export const range = (start: number, stop: number, options?: RangeOptions) => {
  const { include, step } = { ...{ include: true, step: 1 }, ...options }
  if (step === 0)
    throw new Error('Using zero step is not allowed in range function')

  return Array(Math.floor((stop - start + (include ? step : 0)) / step))
    .fill(0)
    .map((_, index) => index * step + start)
}
