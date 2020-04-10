import { range } from 'lodash-es'
import { runSimulation } from './lib'
import { renderRatio } from '../utils'

const GRID_SIZE = 50
const SAMPLES_NUMBER = 100
const POOL_SIZE = 5
const DIFFUSION_RANGE = [0.01, 0.2]
const COMPRESSION_RANGE = [0.01, 0.5]

const baseConfig = {
  type: 'heatmap',
  showscale: false,
  hoverinfo: 'text',
  colorscale: [[0, '#00ffff'], [1, '#ff0000']],
}

const layout = {
  title: 'Simulations heatmap',
  yaxis: {
    title: 'Covid diffusion',
  },
  xaxis: {
    title: 'Compression range',
  },
}

function buildRowText(compression: number, diffusion: number, falsePositives: number): string {
  const compressionText = `Compression: ${renderRatio(compression)}`
  const diffusionText = `Diffusion: ${renderRatio(diffusion)}`
  const falsePositiveText = `False Positives: ${renderRatio(falsePositives)}`
  return [compressionText, diffusionText, falsePositiveText].join('<br>')
}

function generateHeatmapData(): any {
  const diffusionStep = (DIFFUSION_RANGE[1] - DIFFUSION_RANGE[0]) / GRID_SIZE
  const compressionStep = (COMPRESSION_RANGE[1] - COMPRESSION_RANGE[0]) / GRID_SIZE
  const x = range(COMPRESSION_RANGE[0], COMPRESSION_RANGE[1], compressionStep).map(renderRatio)
  const y = range(DIFFUSION_RANGE[0], DIFFUSION_RANGE[1], diffusionStep).map(renderRatio)
  const z = []
  const text = []

  for (let i = 0; i < GRID_SIZE; i++) {
    const row = []
    const textRow = []
    const diffusion = DIFFUSION_RANGE[0] + diffusionStep * i
    for (let j = 0; j < GRID_SIZE; j++) {
      const compression = COMPRESSION_RANGE[0] + compressionStep * j
      const poolNumber = Math.round((1 - compression) * SAMPLES_NUMBER)
      const [falsePositives] = runSimulation(SAMPLES_NUMBER, diffusion, POOL_SIZE, poolNumber)
      const falsePositiveRatio = falsePositives / SAMPLES_NUMBER
      const rowText = buildRowText(compression, diffusion, falsePositiveRatio)
      textRow.push(rowText)
      row.push(falsePositiveRatio)
    }
    z.push(row)
    text.push(textRow)
  }
  return { x, y, z, text }
}

function retrieveHeatmapData(): Promise<any> {
  return window.fetch('/simulations.json').then(res => res.json())
}

export async function getHeatmapData(fresh: boolean = false): Promise<any> {
  const rawData = fresh ? generateHeatmapData() : await retrieveHeatmapData()
  const data = {
    ...baseConfig,
    ...rawData,
  }

  return [[data], layout]
}
