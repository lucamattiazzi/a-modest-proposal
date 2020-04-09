import React, { useState } from 'react'
import { mixSamples, generateSamples } from './lib'
import { Constant, DIFFUSION, POOL_SIZE, SAMPLES_NUMBER, POOL_NUMBER } from './constants'
import { renderRatio, onChangeWrapper } from '../utils'

interface RangeProps {
  constants: Constant
  setVariable: Function
  variable: number
}

function Range(p: RangeProps) {
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

export function Component() {
  const [diffusion, setDiffusion] = useState(DIFFUSION.default)
  const [samplesNumber, setSamplesNumber] = useState(SAMPLES_NUMBER.default)
  const [poolSize, setPoolSize] = useState(POOL_SIZE.default)
  const [poolNumber, setPoolNumber] = useState(POOL_NUMBER.default)
  const [falsePositives, setFalsePositives] = useState(0)

  function onCompute() {
    const samples = generateSamples(samplesNumber, diffusion)
    const newFalsePositives = mixSamples(samples, poolSize, poolNumber)
    console.log('newFalsePositives', newFalsePositives)
    setFalsePositives(newFalsePositives)
  }

  return (
    <div className="w-100 h-100 flex flex-column items-center justify-around">
      <div className="pv3 w-80">
        <div className="w-100 tc">Diffusion of COVID among tested ({renderRatio(diffusion)})</div>
        <Range constants={DIFFUSION} variable={diffusion} setVariable={setDiffusion} />
      </div>
      <div className="pv3 w-80">
        <div className="w-100 tc">Number of people to be tested ({samplesNumber})</div>
        <Range constants={SAMPLES_NUMBER} variable={samplesNumber} setVariable={setSamplesNumber} />
      </div>
      <div className="pv3 w-80">
        <div className="w-100 tc">Number of pools to be tested ({poolNumber})</div>
        <Range constants={POOL_NUMBER} variable={poolNumber} setVariable={setPoolNumber} />
      </div>
      <div className="pv3 w-80">
        <div className="w-100 tc">Number of people in each pool ({poolSize})</div>
        <Range constants={POOL_SIZE} variable={poolSize} setVariable={setPoolSize} />
      </div>
      <div className="w-100 tc pv4">
        <button onClick={onCompute}>COMPUTE</button>
      </div>
      <div className="pv3 w-80">
        <div className="w-100 tc">False positives: {falsePositives}</div>
        <div className="w-100 tc">
          False positive ratio: {renderRatio(falsePositives / samplesNumber)}
        </div>
        <div className="w-100 tc">
          Compression ratio: {renderRatio(1 - poolNumber / samplesNumber)}
        </div>
      </div>
    </div>
  )
}
