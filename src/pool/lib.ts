import { intersection, pick } from 'lodash-es'

const { random, floor } = Math

export interface Sample {
  id: number
  hasCovid: boolean
}

export interface Pool {
  id: number
  hasCovid: boolean
  samples: Sample['id'][]
}

interface SamplePools extends Record<Sample['id'], Pool['id'][]> {}

export function createPool(id: number, samples: Sample[]): Pool {
  const hasCovid = samples.reduce<boolean>((a, s) => a || s.hasCovid, false)
  return {
    samples: samples.map(s => s.id),
    id,
    hasCovid,
  }
}

export function checkForCovid(
  sample: Sample,
  falsePositiveRatio: number,
  falseNegativeRatio: number
): boolean {
  if (sample.hasCovid) {
    return random() > falseNegativeRatio
  } else {
    return !(random() > falsePositiveRatio)
  }
}

export function generatePools(
  samples: Sample[],
  poolSize: number,
  poolsNumber: number
): [Pool[], SamplePools] {
  const pools: Pool[] = []
  const samplePools: SamplePools = {}
  while (pools.length < poolsNumber) {
    // naive approach:
    // first pools are simply consecutive samples until all of the samples are in a pool
    // then, for each of the next rounds, consecutive numbers would cause pools with more
    // than one sample in common, therefore it will simply shift of poolSize + 1 (the first
    // time). then it simply moves of rounds * poolSize + 1
    const idx = (pools.length * poolSize) % samples.length
    const jdx = floor((pools.length * poolSize) / samples.length)
    const poolIndices = Array(poolSize)
      .fill(undefined)
      .map((_, i) => {
        return (idx + i + i * jdx * poolSize) % samples.length
      })
    const poolSamples = Object.values(pick(samples, poolIndices))
    const poolSampleIds = poolSamples.map(s => s.id)
    // checks that no couple is repeated among all pools
    const isValid = pools.every(p => intersection(p.samples, poolSampleIds).length < 2)
    if (!isValid) console.error('Something got replicated!')
    const pool = createPool(pools.length, poolSamples)
    for (const sample of poolSamples) {
      samplePools[sample.id] = samplePools[sample.id] || []
      samplePools[sample.id].push(pool.id)
    }
    pools.push(pool)
  }
  return [pools, samplePools]
}

export function runSimulation(
  samplesNumber: number,
  diffusion: number,
  poolSize: number,
  poolsNumber: number,
  falsePositiveRatio: number = 0,
  falseNegativeRatio: number = 0,
  threshold: number = 1
): [number, number] {
  const samples = generateSamples(samplesNumber, diffusion)
  const [pools, samplePools] = generatePools(samples, poolSize, poolsNumber)
  let falsePositives = 0
  let falseNegatives = 0
  for (const sample of samples) {
    const { hasCovid, id } = sample
    const currentSamplePoolIds = samplePools[id]
    if (!currentSamplePoolIds || currentSamplePoolIds.length === 0) {
      console.warn('wow')
      continue
    }
    // a sample is considered positive unless at least one of its pools is negative
    const positivePools = currentSamplePoolIds.filter(poolId => {
      const pool = pools[poolId]
      const hasCovid = checkForCovid(pool, falsePositiveRatio, falseNegativeRatio)
      return hasCovid
    })
    const positivePoolRatio = positivePools.length / currentSamplePoolIds.length
    const consideredPositive = positivePoolRatio >= threshold
    if (consideredPositive === hasCovid) continue
    if (consideredPositive) falsePositives++
    if (!consideredPositive) falseNegatives++ // yeah i like simmetry, sue me
  }
  return [falsePositives, falseNegatives]
}

export function generateSamples(size: number, diffusion: number): Sample[] {
  return Array(size)
    .fill(undefined)
    .map((_, idx) => {
      return {
        id: idx,
        hasCovid: random() < diffusion,
      }
    })
}
