const { round } = Math

export function renderRatio(ratio: number) {
  return `${round(ratio * 100)}%`
}

export function onChangeWrapper(setVariable: Function) {
  return function (e: React.ChangeEvent<HTMLInputElement>) {
    setVariable(Number(e.target.value))
  }
}
