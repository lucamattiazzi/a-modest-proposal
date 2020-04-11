import { checkForCovid, createPool, generateSamples } from '../../src/pool/lib'

const POOLS_NUMBER = 500

const positiveSample = { hasCovid: true, id: 1 }
const negativeSample = { hasCovid: false, id: 2 }

function testManySamples(falsePositiveRatio: number, falseNegativeRatio: number) {
  let falsePositives = 0
  let falseNegatives = 0
  for (let i = 0; i < POOLS_NUMBER; i++) {
    const positiveResult = checkForCovid(positiveSample, falsePositiveRatio, falseNegativeRatio)
    const negativeResult = checkForCovid(negativeSample, falsePositiveRatio, falseNegativeRatio)
    if (positiveResult !== true) falseNegatives++
    if (negativeResult !== false) falsePositives++
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
    expect(falsePositives).toBe(0)
    expect(falseNegatives / POOLS_NUMBER).toBeCloseTo((POOLS_NUMBER * 0.2) / POOLS_NUMBER, 1)
  })
})

describe(generateSamples, () => {
  it('Should generate 0 positives if diffusion is 0', () => {
    const samples = generateSamples(100, 0)
    const positives = samples.filter(s => s.hasCovid)
    expect(samples.length).toBe(100)
    expect(positives.length).toBe(0)
  })

  it('Should generate only positives if diffusion is 1', () => {
    const samples = generateSamples(100, 0)
    const positives = samples.filter(s => s.hasCovid)
    expect(samples.length).toBe(100)
    expect(positives.length).toBe(100)
  })

  it('Should generate ~10 positives if diffusion is 0.1', () => {
    const samples = generateSamples(100, 0)
    const positives = samples.filter(s => s.hasCovid)
    expect(samples.length).toBe(100)
    expect(positives.length).toBe(100)
  })
})
