export interface Constant {
  default: number
  max: number
  min: number
  step: number
}

export const DIFFUSION: Constant = {
  default: 0.1,
  max: 1,
  min: 0,
  step: 0.01,
}

export const SAMPLES_NUMBER: Constant = {
  default: 1000,
  max: 5000,
  min: 100,
  step: 100,
}

export const POOL_SIZE: Constant = {
  default: 5,
  max: 12,
  min: 2,
  step: 1,
}

export const POOL_NUMBER: Constant = {
  default: 750,
  max: 5000,
  min: 100,
  step: 100,
}

export const FALSE_POSITIVE_RATIO: Constant = {
  default: 0,
  max: 1,
  min: 0,
  step: 0.01,
}

export const FALSE_NEGATIVE_RATIO: Constant = {
  default: 0,
  max: 1,
  min: 0,
  step: 0.01,
}

export const THRESHOLD: Constant = {
  default: 1,
  max: 1,
  min: 0,
  step: 0.01,
}

export const FIRST_VISIT_KEY = 'firstvisit'
