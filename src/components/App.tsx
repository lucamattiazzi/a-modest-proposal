import React, { useRef, useEffect, useState } from 'react'
import { drawWorld } from '../lib/world'
import { BASE_SICK_RATIO, BASE_SAMPLE_RATIO } from '../lib/constants'

export function App() {
  const canvas = useRef<HTMLCanvasElement>()
  const [diffusion, setDiffusion] = useState(BASE_SICK_RATIO)
  const [sample, setSample] = useState(BASE_SAMPLE_RATIO)
  const [policy, setPolicy] = useState(false)
  const [apparent, setApparent] = useState(BASE_SICK_RATIO)
  const [found, setFound] = useState(0)

  function onChangeDiffusion(e: React.ChangeEvent<HTMLInputElement>) {
    setDiffusion(Number(e.target.value))
  }

  function onChangeSample(e: React.ChangeEvent<HTMLInputElement>) {
    setSample(Number(e.target.value))
  }

  function togglePolicy() {
    setPolicy(!policy)
  }

  function drawNewWorld() {
    const [apparentRatio, sickFoundRatio] = drawWorld(canvas.current, diffusion, sample, policy)
    setApparent(apparentRatio)
    setFound(sickFoundRatio)
  }

  function resizeCanvas() {
    if (!canvas.current) return
    const parent = canvas.current.parentNode as HTMLDivElement
    const { width, height } = parent.getBoundingClientRect()
    const side = Math.min(width, height)
    canvas.current.width = side
    canvas.current.height = side
    drawNewWorld()
  }

  useEffect(() => {
    resizeCanvas()
    window.onresize = resizeCanvas
  }, [])

  return (
    <div className="w-100 h-100 flex items-center justify-around">
      <div className="w-60 h-90 flex items-center justify-center">
        <canvas className="bg-black-10" ref={canvas} />
      </div>
      <div className="w-30 h-100 flex flex-column items-center justify-center">
        <div className="pv3 w-80">
          <div className="w-100 tc">Sick ratio ({diffusion.toFixed(2)})</div>
          <input
            type="range"
            className="w-100"
            min="0"
            max="1"
            step="0.01"
            value={diffusion}
            onChange={onChangeDiffusion}
          />
        </div>
        <div className="pv3 w-80">
          <div className="w-100 tc">Sample size ({sample.toFixed(2)})</div>
          <input
            type="range"
            className="w-100"
            min="0"
            max="1"
            step="0.01"
            value={sample}
            onChange={onChangeSample}
          />
        </div>
        <div className="pv3 w-80 tc">
          <input id="onlysick" type="checkbox" checked={policy} onChange={togglePolicy} />
          <label className="w-100 tc pl3" htmlFor="onlysick">
            Only sample sick people
          </label>
        </div>
        <div className="w-100 tc pv4">
          <button onClick={drawNewWorld}>DRAW</button>
        </div>
        <div className="w-100 tc pv4">
          <div>APPARENT RATIO: {apparent.toFixed(2)}</div>
        </div>
        <div className="w-100 tc pv4">
          <div>RATIO OF SICK PEOPLE FOUND: {found.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
