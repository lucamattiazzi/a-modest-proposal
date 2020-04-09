import { generateSamples, mixSamples } from './lib'

export interface Result {
  diffusion: number
  compression: number
  falsePositiveRatio: number
}

export const GRID_SIZE = 20
const SAMPLES_NUMBER = 200
const POOL_SIZE = 5
export const DIFFUSION_RANGE = [0, 1]
export const COMPRESSION_RANGE = [0, 1]

export function generateHeatmapData(): Result[][] {
  const diffusionStep = (DIFFUSION_RANGE[1] - DIFFUSION_RANGE[0]) / GRID_SIZE
  const compressionStep = (COMPRESSION_RANGE[1] - COMPRESSION_RANGE[0]) / GRID_SIZE

  const grid: Result[][] = []

  for (let i = 0; i < GRID_SIZE; i++) {
    const row = []
    const diffusion = DIFFUSION_RANGE[0] + diffusionStep * i
    for (let j = 0; j < GRID_SIZE; j++) {
      const compression = COMPRESSION_RANGE[0] + compressionStep * j
      const poolNumber = Math.round(compression * SAMPLES_NUMBER)
      const samples = generateSamples(SAMPLES_NUMBER, diffusion)
      const falsePositives = mixSamples(samples, POOL_SIZE, poolNumber)
      const falsePositiveRatio = falsePositives / SAMPLES_NUMBER
      row.push({ diffusion, compression, falsePositiveRatio })
    }
    grid.push(row)
  }

  return grid
}
