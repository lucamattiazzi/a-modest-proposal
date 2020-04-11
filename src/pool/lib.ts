import { intersection, pick, shuffle, sampleSize } from 'lodash-es'

const { random, floor } = Math

const MAX_TRIALS = 5

export interface Sample {
  id: number
  hasCovid: boolean
  testResults: boolean | null
}

export interface Pool extends Sample {
  samples: Sample['id'][]
}

interface SamplePools extends Record<Sample['id'], Pool['id'][]> {}

export function createPool(id: number, samples: Sample[]): Pool {
  const hasCovid = samples.reduce<boolean>((a, s) => a || s.hasCovid, false)
  return {
    samples: samples.map(s => s.id),
    id,
    hasCovid,
    testResults: null,
  }
}

export function checkForCovid(
  pool: Sample,
  falsePositiveRatio: number,
  falseNegativeRatio: number
): void {
  if (pool.hasCovid) {
    pool.testResults = random() > falseNegativeRatio
  } else {
    pool.testResults = !(random() > falsePositiveRatio)
  }
}

export function generateSamples(size: number, diffusion: number): Sample[] {
  return Array(size)
    .fill(undefined)
    .map((_, idx) => {
      return {
        id: idx,
        hasCovid: random() < diffusion,
        testResults: null,
      }
    })
}

export function generatePools(
  samples: Sample[],
  poolSize: number,
  poolsNumber: number
): [Pool[], SamplePools] {
  const pools: Pool[] = []
  const samplePools: SamplePools = {}
  let availableSamples = shuffle(samples) // let's mix up the things
  let trials = 0 // number of max trials if a couple is repeated
  while (pools.length < poolsNumber) {
    // even naiver approach:
    // random as fuck, but avoid repeated couples, also should keeps the number
    // of pools for each sample around the same

    if (availableSamples.length < poolSize) {
      // when we get to the end, the last ones are be sadly ignored
      availableSamples = shuffle(samples)
    }

    const poolSamples = availableSamples.splice(0, poolSize)
    const poolSampleIds = poolSamples.map(p => p.id)
    // checks that no couple is repeated among all pools
    const isValid = pools.every(p => intersection(p.samples, poolSampleIds).length < 2)
    if (!isValid && trials < MAX_TRIALS) {
      trials++
      availableSamples = shuffle([...availableSamples, ...poolSamples])
      continue
    }
    trials = 0
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
  let minPoolsPerSample = Infinity
  let maxPoolsPerSample = -Infinity
  for (const sample of samples) {
    const { hasCovid, id } = sample
    const currentSamplePoolIds = samplePools[id]
    if (!currentSamplePoolIds || currentSamplePoolIds.length === 0) continue
    minPoolsPerSample = Math.min(currentSamplePoolIds.length, minPoolsPerSample)
    maxPoolsPerSample = Math.max(currentSamplePoolIds.length, maxPoolsPerSample)
    // a sample is considered positive if the positive/all ratio is higher than an
    // arbitrary threshold
    const positivePools = currentSamplePoolIds.filter(poolId => {
      const pool = pools[poolId]
      if (pool.testResults !== null) return pool.testResults
      checkForCovid(pool, falsePositiveRatio, falseNegativeRatio)
      return pool.testResults
    })
    const positivePoolRatio = positivePools.length / currentSamplePoolIds.length
    const consideredPositive = positivePoolRatio >= threshold
    if (consideredPositive === hasCovid) continue
    if (consideredPositive) falsePositives++
    if (!consideredPositive) falseNegatives++ // yeah i like simmetry, sue me
  }
  return [falsePositives, falseNegatives]
}
