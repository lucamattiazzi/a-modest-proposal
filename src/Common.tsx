import React from 'react'
import { onChangeWrapper } from './utils'

interface RangeProps {
  constants: Constant
  setVariable: Function
  variable: number
}

export interface Constant {
  default: number
  max: number
  min: number
  step: number
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
