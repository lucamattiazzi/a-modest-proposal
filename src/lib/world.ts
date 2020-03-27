import { range, sampleSize } from 'lodash-es'
import { POPULATION_SIZE, PEOPLE_PER_SIDE, SamplePolicy } from './constants'

const { max, floor, abs, random, min } = Math

const policies = {
  sick: applySickPolicy,
  random: applyRandomPolicy,
  close: applyClosePolicy,
} as const

interface Person {
  sickness: number
  isSick: boolean
  isSampled: boolean
  x: number
  y: number
}

function createPerson(x: number, y: number, diffusion: number): Person {
  const sickness = random()
  return {
    isSick: sickness < diffusion,
    sickness,
    isSampled: false,
    x,
    y,
  }
}

function generatePopulation(size: number, side: number, diffusion: number): Person[] {
  const spacePerPeople = 1 / (PEOPLE_PER_SIDE + 1)
  return range(POPULATION_SIZE).map(i => {
    const x = spacePerPeople / 2 + (i % PEOPLE_PER_SIDE) / PEOPLE_PER_SIDE
    const y = spacePerPeople / 2 + floor(i / PEOPLE_PER_SIDE) / PEOPLE_PER_SIDE
    const person = createPerson(x, y, diffusion)
    return person
  })
}

function applySickPolicy(population: Person[], size: number): Person[] {
  const sampledIds = new Set()
  const sampled = [] as Person[]
  while (sampledIds.size < size) {
    const randomId = floor(random() * population.length)
    if (sampledIds.has(randomId)) continue
    const person = population[randomId]
    const isChosen = random() ** 4 > person.sickness
    if (!isChosen) continue
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

function samplePopulation(population: Person[], size: number, policy: SamplePolicy): number {
  const chosenPolicy = policies[policy]
  const sampled = chosenPolicy(population, size)

  let confirmedSick = 0
  for (const person of sampled) {
    person.isSampled = true
    if (person.isSick) confirmedSick++
  }
  return confirmedSick
}

export function drawWorld(
  canvas: HTMLCanvasElement,
  diffusion: number,
  sampleRatio: number,
  onlySick: boolean
): [number, number] {
  const ctx = canvas.getContext('2d')
  const side = canvas.width

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const spacePerPeople = 1 / (PEOPLE_PER_SIDE + 1)
  const population = generatePopulation(POPULATION_SIZE, side, diffusion)
  const totalSick = population.filter(p => p.isSick).length
  const policy = onlySick ? 'sick' : 'random'

  const sample = floor(sampleRatio * population.length)
  const confirmedSick = samplePopulation(population, sample, policy)
  const apparentRatio = confirmedSick / sample
  const sickFoundRatio = confirmedSick / totalSick

  const personSize = side * spacePerPeople
  for (const person of population) {
    const x = person.x * side
    const y = person.y * side
    const color = !person.isSampled ? 'rgb(200, 200, 200)' : person.isSick ? 'red' : 'blue'
    ctx.beginPath()
    ctx.arc(x, y, Math.floor(personSize / 2), 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
  }
  return [apparentRatio, sickFoundRatio]
}
