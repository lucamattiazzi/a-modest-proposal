import React, { useState, useEffect, useRef } from 'react'
import { mixSamples, generateSamples } from './lib'
import { DIFFUSION, POOL_SIZE, SAMPLES_NUMBER, POOL_NUMBER } from './constants'
import { renderRatio } from '../utils'
import { Range } from '../Common'
import { generateHeatmapData, GRID_SIZE } from './generate-heatmap'

export function Component() {
  const [diffusion, setDiffusion] = useState(DIFFUSION.default)
  const [samplesNumber, setSamplesNumber] = useState(SAMPLES_NUMBER.default)
  const [poolSize, setPoolSize] = useState(POOL_SIZE.default)
  const [poolNumber, setPoolNumber] = useState(POOL_NUMBER.default)
  const [falsePositives, setFalsePositives] = useState(null)

  const canvas = useRef<HTMLCanvasElement>()

  function onCompute() {
    const samples = generateSamples(samplesNumber, diffusion)
    const newFalsePositives = mixSamples(samples, poolSize, poolNumber)
    setFalsePositives(newFalsePositives)
  }

  function resizeCanvas() {
    if (!canvas.current) return
    const parent = canvas.current.parentNode as HTMLDivElement
    const { width, height } = parent.getBoundingClientRect()
    const side = Math.min(width, height)
    canvas.current.width = side
    canvas.current.height = side
  }

  useEffect(() => {
    window.onresize = resizeCanvas
    resizeCanvas()
  }, [])

  useEffect(() => {
    if (!canvas.current) return
    const data = generateHeatmapData()
    const ctx = canvas.current.getContext('2d')
    const side = canvas.current.width
    const cellSize = side / GRID_SIZE
    for (const rowIdx in data) {
      const row = data[rowIdx]
      const x = cellSize * parseInt(rowIdx)
      for (const cellIdx in row) {
        const y = cellSize * parseInt(cellIdx)
        const cell = row[cellIdx]
        const bckgColor = cell.falsePositiveRatio * 255
        const color = 255 - bckgColor
        ctx.fillStyle = `rgb(${bckgColor}, 0, 0)`
        ctx.fillRect(x, y, cellSize, cellSize)
        ctx.fillStyle = `rgb(0, 255, 255)`
        ctx.font = `${cellSize / 2}px arial`
        ctx.fillText(cell.falsePositiveRatio.toFixed(2), x, y)
      }
    }
  }, [canvas])

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
      <div className="w-100 h-50 flex items-center justify-center">
        <canvas className="bg-black-10" ref={canvas} />
      </div>
    </div>
  )
}
