export const PEOPLE_PER_SIDE = 100
export const POPULATION_SIZE = PEOPLE_PER_SIDE * PEOPLE_PER_SIDE
export const BASE_SICK_RATIO = 0.1
export const BASE_SAMPLE_RATIO = 0.1
export const SAMPLE_POLICIES = ['sick', 'close', 'random'] as const
export type SamplePolicy = typeof SAMPLE_POLICIES[number]
