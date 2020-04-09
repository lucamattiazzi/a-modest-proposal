import React, { useRef, useEffect, useState } from 'react'
import { drawWorld } from './world'
import { BASE_DIFFUSION_PERC, BASE_SAMPLE_PERC, BASE_ASYMPTOMATIC_PERC } from './constants'
import { renderRatio, onChangeWrapper } from '../utils'

const { min } = Math

export function Component() {
  const canvas = useRef<HTMLCanvasElement>()
  const [diffusion, setDiffusion] = useState(BASE_DIFFUSION_PERC)
  const [sample, setSample] = useState(BASE_SAMPLE_PERC)
  const [asymptomatic, setAsymptomatic] = useState(BASE_ASYMPTOMATIC_PERC)
  const [policy, setPolicy] = useState(false)

  const [apparent, setApparent] = useState(BASE_DIFFUSION_PERC)
  const [found, setFound] = useState(0)

  function togglePolicy() {
    setPolicy(!policy)
  }

  function drawNewWorld() {
    const [apparentRatio, sickFoundRatio] = drawWorld(
      canvas.current,
      diffusion,
      sample,
      asymptomatic,
      policy
    )
    setApparent(apparentRatio)
    setFound(sickFoundRatio)
  }

  function resizeCanvas() {
    if (!canvas.current) return
    const parent = canvas.current.parentNode as HTMLDivElement
    const { width, height } = parent.getBoundingClientRect()
    const side = min(width, height)
    canvas.current.width = side
    canvas.current.height = side
    drawNewWorld()
  }

  useEffect(() => {
    resizeCanvas()
    window.onresize = resizeCanvas
  }, [resizeCanvas])

  return (
    <div className="w-100 h-100 flex items-center justify-around">
      <div className="w-60 h-90 flex items-center justify-center">
        <canvas className="bg-black-10" ref={canvas} />
      </div>
      <div className="w-30 h-100 flex flex-column items-center justify-center">
        <div className="pv3 w-80">
          <div className="w-100 tc">Diffusion of COVID ({renderRatio(diffusion)})</div>
          <input
            type="range"
            className="w-100"
            min="0"
            max="1"
            step="0.01"
            value={diffusion}
            onChange={onChangeWrapper(setDiffusion)}
          />
        </div>
        <div className="pv3 w-80">
          <div className="w-100 tc">Size of people sampled ({renderRatio(sample)})</div>
          <input
            type="range"
            className="w-100"
            min="0"
            max="1"
            step="0.01"
            value={sample}
            onChange={onChangeWrapper(setSample)}
          />
        </div>
        <div className="pv3 w-80">
          <div className="w-100 tc">
            Part of people that show no symptoms ({renderRatio(asymptomatic)})
          </div>
          <input
            type="range"
            className="w-100"
            min="0"
            max="1"
            step="0.01"
            value={asymptomatic}
            onChange={onChangeWrapper(setAsymptomatic)}
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
          <div>APPARENT RATIO: {renderRatio(apparent)}</div>
        </div>
        <div className="w-100 tc pv4">
          <div>RATIO OF SICK PEOPLE FOUND: {renderRatio(found)}</div>
        </div>
      </div>
    </div>
  )
}
