import { checkForCovid } from '../../src/pool/lib'

const TRIALS_NUMBER = 500
const ERROR_RANGE = 0.3

describe(checkForCovid, () => {
  const positiveSample = { hasCovid: true, id: 1 }
  const negativeSample = { hasCovid: false, id: 2 }

  function runManyTrials(falsePositiveRatio: number, falseNegativeRatio: number) {
    let falsePositives = 0
    let falseNegatives = 0
    for (let i = 0; i < TRIALS_NUMBER; i++) {
      const positiveResult = checkForCovid(positiveSample, falsePositiveRatio, falseNegativeRatio)
      const negativeResult = checkForCovid(negativeSample, falsePositiveRatio, falseNegativeRatio)
      if (positiveResult !== true) falseNegatives++
      if (negativeResult !== false) falsePositives++
    }
    return [falsePositives, falseNegatives]
  }

  it('Should return the correct value with 0 false positives and 0 false negatives', () => {
    const [falsePositives, falseNegatives] = runManyTrials(0, 0)
    expect(falsePositives).toBe(0)
    expect(falseNegatives).toBe(0)
  })

  it('Should always return positive with 100% false positives', () => {
    const [falsePositives, falseNegatives] = runManyTrials(1, 0)
    expect(falsePositives).toBe(TRIALS_NUMBER)
    expect(falseNegatives).toBe(0)
  })

  it('Should always return negative with 100% false negatives', () => {
    const [falsePositives, falseNegatives] = runManyTrials(0, 1)
    expect(falsePositives).toBe(0)
    expect(falseNegatives).toBe(TRIALS_NUMBER)
  })

  it('Should always flip return with 100% false positives and 100% false negatives', () => {
    const [falsePositives, falseNegatives] = runManyTrials(1, 1)
    expect(falsePositives).toBe(TRIALS_NUMBER)
    expect(falseNegatives).toBe(TRIALS_NUMBER)
  })

  it('Should flip ~1/10 of the times the negative if there are 10% false positives, the positive should remain the same', () => {
    const [falsePositives, falseNegatives] = runManyTrials(0.1, 0)
    expect(falsePositives / TRIALS_NUMBER).toBeCloseTo((TRIALS_NUMBER * 0.1) / TRIALS_NUMBER, 1)
    expect(falseNegatives).toBe(0)
  })

  it('Should flip ~2/10 of the times the positive if there are 20% false negatives, the negatives should remain the same', () => {
    const [falsePositives, falseNegatives] = runManyTrials(0, 0.2)
    expect(falsePositives).toBe(0)
    expect(falseNegatives / TRIALS_NUMBER).toBeCloseTo((TRIALS_NUMBER * 0.2) / TRIALS_NUMBER, 1)
  })
})
