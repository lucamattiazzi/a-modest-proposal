import { range, sampleSize } from 'lodash-es'
import { POPULATION_SIZE, PEOPLE_PER_SIDE, SamplePolicy } from './constants'

const { floor, random } = Math

const policies = {
  sick: applySickPolicy,
  random: applyRandomPolicy,
  close: applyClosePolicy,
} as const

interface Person {
  symptoms: number
  hasCovid: boolean
  hasSymptoms: boolean
  isSampled: boolean
  x: number
  y: number
}

function createPerson(x: number, y: number, diffusion: number, asymptomatic: number): Person {
  const hasCovid = random() < diffusion
  const symptoms = hasCovid ? random() : 0
  const hasSymptoms = symptoms > asymptomatic
  return {
    hasSymptoms,
    hasCovid,
    symptoms,
    isSampled: false,
    x,
    y,
  }
}

function generatePopulation(size: number, diffusion: number, asymptomatic: number): Person[] {
  const spacePerPeople = 1 / (PEOPLE_PER_SIDE + 1)
  return range(size).map(i => {
    const x = spacePerPeople / 2 + (i % PEOPLE_PER_SIDE) / PEOPLE_PER_SIDE
    const y = spacePerPeople / 2 + floor(i / PEOPLE_PER_SIDE) / PEOPLE_PER_SIDE
    const person = createPerson(x, y, diffusion, asymptomatic)
    return person
  })
}

function applySickPolicy(population: Person[], size: number): Person[] {
  const sampledIds = new Set()
  const visitedIds = new Set()
  const sampled = [] as Person[]
  while (true) {
    if (sampledIds.size === size) break
    if (visitedIds.size === population.length) break
    const randomId = floor(random() * population.length)
    if (sampledIds.has(randomId)) continue
    visitedIds.add(randomId)
    const person = population[randomId]
    if (!person.hasSymptoms) continue
    sampledIds.add(randomId)
    sampled.push(person)
  }
  return sampled
}

function applyRandomPolicy(population: Person[], size: number): Person[] {
  return sampleSize(population, size)
}

function applyClosePolicy(population: Person[], size: number): Person[] {
  return sampleSize(population, size)
}

function getPersonColor(person: Person): string {
  if (!person.isSampled) return 'lightgray'
  if (!person.hasCovid) return 'blue'
  if (!person.hasSymptoms) return 'orange'
  return 'darkred'
}

function samplePopulation(population: Person[], size: number, policy: SamplePolicy): number {
  const chosenPolicy = policies[policy]
  const sampled = chosenPolicy(population, size)

  let confirmedSick = 0
  for (const person of sampled) {
    person.isSampled = true
    if (person.hasCovid) confirmedSick++
  }
  return confirmedSick
}

export function drawWorld(
  canvas: HTMLCanvasElement,
  diffusion: number,
  sample: number,
  asymptomatic: number,
  onlySick: boolean
): [number, number] {
  const ctx = canvas.getContext('2d')
  const side = canvas.width

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const population = generatePopulation(POPULATION_SIZE, diffusion, asymptomatic)
  const totalSick = population.filter(p => p.hasCovid).length
  const policy = onlySick ? 'sick' : 'random'

  const sampleAbs = floor(sample * population.length)
  const confirmedSick = samplePopulation(population, sampleAbs, policy)
  const apparentRatio = confirmedSick / sampleAbs
  const sickFoundRatio = confirmedSick / totalSick

  const spacePerPeople = 1 / (PEOPLE_PER_SIDE + 1)
  const personSize = side * spacePerPeople
  for (const person of population) {
    const x = person.x * side
    const y = person.y * side
    const color = getPersonColor(person)
    ctx.beginPath()
    ctx.arc(x, y, Math.floor(personSize / 2), 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
  }
  return [apparentRatio, sickFoundRatio]
}
