import React from 'react'
import { onChangeWrapper, renderRatio } from './utils'
import { Constant } from './constants'

interface RangeProps {
  constants: Constant
  setVariable: Function
  variable: number
}

export function Range(p: RangeProps) {
  return (
    <input
      type="range"
      className="w-100"
      min={p.constants.min}
      max={p.constants.max}
      step={p.constants.step}
      value={p.variable}
      onChange={onChangeWrapper(p.setVariable)}
    />
  )
}

interface ColumnProps {
  title: string
  buttonText: string
  buttonFn: () => void
  children: React.ReactNode[]
}

export function Column(p: ColumnProps) {
  return (
    <div className="w-50 h-100 flex flex-column items-center">
      <div className="w-100 h-20 f2 flex items-center justify-center">{p.title}</div>
      <div className="w-100 h-60 flex flex-column items-center justify-center">{p.children}</div>
      <div className="w-100 h-20 f4 flex items-center justify-center">
        <button onClick={p.buttonFn} className="pa3">
          {p.buttonText}
        </button>
      </div>
    </div>
  )
}
