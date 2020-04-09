import { intersection, pick } from 'lodash-es'

const { random, floor } = Math

interface Sample {
  id: number
  hasCovid: boolean
}

interface Pool {
  id: number
  hasCovid: boolean
  samples: Sample['id'][]
}

interface SamplePools extends Record<Sample['id'], Pool['id'][]> {}

function testSamples(poolSamples: Sample[]): boolean {
  const hasCovid = poolSamples.reduce<boolean>((a, s) => a || s.hasCovid, false)
  return hasCovid
}

function generatePools(
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
    const pool = {
      id: pools.length,
      samples: poolSampleIds,
      hasCovid: testSamples(poolSamples),
    }
    for (const sample of poolSamples) {
      samplePools[sample.id] = samplePools[sample.id] || []
      samplePools[sample.id].push(pool.id)
    }
    pools.push(pool)
  }
  return [pools, samplePools]
}

export function mixSamples(samples: Sample[], poolSize: number, poolsNumber: number) {
  const [pools, samplePools] = generatePools(samples, poolSize, poolsNumber)
  let falsePositives = 0
  for (const sample of samples) {
    const { hasCovid, id } = sample
    const currentSamplePoolIds = samplePools[id]
    if (!currentSamplePoolIds) continue
    // a sample is considered positive unless at least one of its pools is negative
    const consideredPositive = currentSamplePoolIds.every(poolId => {
      const pool = pools[poolId]
      return pool.hasCovid
    })
    if (consideredPositive !== hasCovid) falsePositives++
  }
  return falsePositives
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
