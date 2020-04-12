import { fromPairs } from 'lodash-es'

const { round } = Math

export interface AppState extends Record<string, number> {}

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

export function loadStateFromQuery(): AppState {
  const queryParams = new URLSearchParams(window.location.search)
  const state: AppState = {}
  queryParams.forEach((v, k) => {
    state[k] = Number(v)
  })
  return state
}

export function saveStateInQuery(state: AppState) {
  const queryParams = new URLSearchParams()
  for (const key of Object.keys(state)) {
    const value = state[key]
    queryParams.append(key, value.toString())
  }
  const newUrl = `${window.location.pathname}?${queryParams}`
  window.history.replaceState({}, '', newUrl)
}
