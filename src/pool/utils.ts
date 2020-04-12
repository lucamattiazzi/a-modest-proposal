const { round } = Math

export interface CountableFunction extends Function {
  timesCalled?: number
}

export function renderRatio(ratio: number) {
  return `${round(ratio * 100)}%`
}

export function onChangeWrapper(setVariable: Function) {
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    setVariable(Number(e.target.value))
  }
}

export function makeFnCountable(fn: Function): CountableFunction {
  const wrapper: CountableFunction = (...args: any[]) => {
    wrapper.timesCalled = wrapper.timesCalled || 0
    wrapper.timesCalled++
    return fn(...args)
  }
  return wrapper
}
