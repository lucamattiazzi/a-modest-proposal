import React, { useState, useEffect } from 'react'
import { mixSamples, generateSamples } from './lib'
import { DIFFUSION, POOL_SIZE, SAMPLES_NUMBER, POOL_NUMBER } from './constants'
import { renderRatio } from '../utils'
import { Range } from '../Common'
import { getHeatmapData } from './generate-heatmap'
const Plotly = require('plotly.js-dist')

export function Component() {
  const [diffusion, setDiffusion] = useState(DIFFUSION.default)
  const [samplesNumber, setSamplesNumber] = useState(SAMPLES_NUMBER.default)
  const [poolSize, setPoolSize] = useState(POOL_SIZE.default)
  const [poolNumber, setPoolNumber] = useState(POOL_NUMBER.default)
  const [falsePositives, setFalsePositives] = useState(null)

  function onCompute() {
    const samples = generateSamples(samplesNumber, diffusion)
    const newFalsePositives = mixSamples(samples, poolSize, poolNumber)
    setFalsePositives(newFalsePositives)
  }

  useEffect(() => {
    getHeatmapData().then(plotlyData => {
      Plotly.newPlot('heatmap', ...plotlyData)
    })
  }, [])

  function refreshData() {
    getHeatmapData(true).then(plotlyData => {
      Plotly.newPlot('heatmap', ...plotlyData)
    })
  }

  return (
    <div className="w-100 h-100 flex flex-column items-center justify-around">
      <div className="w-100 h-50 flex flex-column items-center ">
        <div className="pv3 w-80 tc f3">RUN SINGLE SIMULATION</div>
        <div className="pv2 w-80">
          <div className="w-100 tc pv1">
            Diffusion of COVID among tested ({renderRatio(diffusion)})
          </div>
          <Range constants={DIFFUSION} variable={diffusion} setVariable={setDiffusion} />
        </div>
        <div className="pv2 w-80">
          <div className="w-100 tc pv1">Number of people to be tested ({samplesNumber})</div>
          <Range
            constants={SAMPLES_NUMBER}
            variable={samplesNumber}
            setVariable={setSamplesNumber}
          />
        </div>
        <div className="pv2 w-80">
          <div className="w-100 tc pv1">Number of pools to be tested ({poolNumber})</div>
          <Range constants={POOL_NUMBER} variable={poolNumber} setVariable={setPoolNumber} />
        </div>
        <div className="pv2 w-80">
          <div className="w-100 tc pv1">Number of people in each pool ({poolSize})</div>
          <Range constants={POOL_SIZE} variable={poolSize} setVariable={setPoolSize} />
        </div>
        <div className="pv2 w-80 tc">
          <button onClick={onCompute} className="pa3">
            COMPUTE
          </button>
        </div>
        <div className="pv2 w-80 f4">
          <div className="w-100 tc">False positives: {falsePositives}</div>
          <div className="w-100 tc">
            False positive ratio: {renderRatio(falsePositives / samplesNumber)}
          </div>
          <div className="w-100 tc">
            Compression ratio: {renderRatio(1 - poolNumber / samplesNumber)}
          </div>
        </div>
      </div>
      <div className="w-100 h-50" id="heatmap" onClick={refreshData} />
    </div>
  )
}
