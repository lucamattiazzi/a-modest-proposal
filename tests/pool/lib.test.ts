import {
  checkForCovid,
  createPool,
  generateSamples,
  generatePools,
  runSimulation,
} from '../../src/pool/lib'

const POOLS_NUMBER = 500

const positiveSample = { hasCovid: true, id: 1, testResults: null }
const negativeSample = { hasCovid: false, id: 2, testResults: null }

function testManySamples(falsePositiveRatio: number, falseNegativeRatio: number) {
  let falsePositives = 0
  let falseNegatives = 0
  for (let i = 0; i < POOLS_NUMBER; i++) {
    checkForCovid(positiveSample, falsePositiveRatio, falseNegativeRatio)
    checkForCovid(negativeSample, falsePositiveRatio, falseNegativeRatio)
    if (positiveSample.testResults !== true) falseNegatives++
    if (negativeSample.testResults !== false) falsePositives++
  }
  return [falsePositives, falseNegatives]
}

describe(createPool, () => {
  it('Should create a negative pool from only negative samples', () => {
    const samples = [negativeSample, negativeSample, negativeSample]
    const pool = createPool(1, samples)
    expect(pool).toHaveProperty('id', 1)
    expect(pool).toHaveProperty('hasCovid', false)
  })

  it('Should create a positive pool with 1 positive sample', () => {
    const samples = [negativeSample, negativeSample, positiveSample]
    const pool = createPool(1, samples)
    expect(pool).toHaveProperty('id', 1)
    expect(pool).toHaveProperty('hasCovid', true)
  })
})

describe(checkForCovid, () => {
  it('Should return the correct value with 0 false positives and 0 false negatives', () => {
    const [falsePositives, falseNegatives] = testManySamples(0, 0)
    expect(falsePositives).toBe(0)
    expect(falseNegatives).toBe(0)
  })

  it('Should always return positive with 100% false positives', () => {
    const [falsePositives, falseNegatives] = testManySamples(1, 0)
    expect(falsePositives).toBe(POOLS_NUMBER)
    expect(falseNegatives).toBe(0)
  })

  it('Should always return negative with 100% false negatives', () => {
    const [falsePositives, falseNegatives] = testManySamples(0, 1)
    expect(falsePositives).toBe(0)
    expect(falseNegatives).toBe(POOLS_NUMBER)
  })

  it('Should always flip return with 100% false positives and 100% false negatives', () => {
    const [falsePositives, falseNegatives] = testManySamples(1, 1)
    expect(falsePositives).toBe(POOLS_NUMBER)
    expect(falseNegatives).toBe(POOLS_NUMBER)
  })

  it('Should flip ~1/10 of the times the negative if there are 10% false positives, the positive should remain the same', () => {
    const [falsePositives, falseNegatives] = testManySamples(0.1, 0)
    expect(falsePositives / POOLS_NUMBER).toBeCloseTo((POOLS_NUMBER * 0.1) / POOLS_NUMBER, 1)
    expect(falseNegatives).toBe(0)
  })

  it('Should flip ~2/10 of the times the positive if there are 20% false negatives, the negatives should remain the same', () => {
    const [falsePositives, falseNegatives] = testManySamples(0, 0.2)
    const falseNegativeRatio = falseNegatives / POOLS_NUMBER
    const expectedRatio = (POOLS_NUMBER * 0.2) / POOLS_NUMBER
    expect(falsePositives).toBe(0)
    expect(falseNegativeRatio).toBeCloseTo(expectedRatio, 1)
  })
})

describe(generateSamples, () => {
  it('Should generate 0 positives if diffusion is 0', () => {
    const samples = generateSamples(POOLS_NUMBER, 0)
    const positives = samples.filter(s => s.hasCovid)
    expect(samples.length).toBe(POOLS_NUMBER)
    expect(positives.length).toBe(0)
  })

  it('Should generate only positives if diffusion is 1', () => {
    const samples = generateSamples(POOLS_NUMBER, 1)
    const positives = samples.filter(s => s.hasCovid)
    expect(samples.length).toBe(POOLS_NUMBER)
    expect(positives.length).toBe(POOLS_NUMBER)
  })

  it('Should generate ~10 positives if diffusion is 0.1', () => {
    const samples = generateSamples(POOLS_NUMBER, 0.1)
    const positives = samples.filter(s => s.hasCovid)
    const positivesRatio = positives.length / POOLS_NUMBER
    expect(samples.length).toBe(POOLS_NUMBER)
    expect(positivesRatio).toBeCloseTo(0.1, 1)
  })

  it('Should generate ~20 negatives if diffusion is 0.8', () => {
    const samples = generateSamples(POOLS_NUMBER, 0.8)
    const negatives = samples.filter(s => !s.hasCovid)
    const negativesRatio = negatives.length / POOLS_NUMBER
    expect(samples.length).toBe(POOLS_NUMBER)
    expect(negativesRatio).toBeCloseTo(0.2, 1)
  })
})

describe(generatePools, () => {
  const positives = Array(100).fill(positiveSample)
  const negatives = Array(100).fill(negativeSample)

  it('Should only generate positive pools from positive samples', () => {
    const [polls] = generatePools(positives, 10, 50)
    const positivePolls = polls.filter(p => p.hasCovid)
    expect(polls.length).toBe(50)
    expect(positivePolls.length).toBe(polls.length)
  })

  it('Should only generate negative pools from negative samples', () => {
    const [polls] = generatePools(negatives, 10, 50)
    const negativePolls = polls.filter(p => !p.hasCovid)
    expect(polls.length).toBe(50)
    expect(negativePolls.length).toBe(polls.length)
  })
})
