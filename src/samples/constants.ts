export const PEOPLE_PER_SIDE = 50
export const POPULATION_SIZE = PEOPLE_PER_SIDE * PEOPLE_PER_SIDE
export const SAMPLE_POLICIES = ['sick', 'close', 'random'] as const

export const BASE_SAMPLE_PERC = 0.05
export const BASE_DIFFUSION_PERC = 0.1
export const BASE_ASYMPTOMATIC_PERC = 0.5
export const BASE_FALSE_POSITIVES_PERC = 0.1

export type SamplePolicy = typeof SAMPLE_POLICIES[number]
