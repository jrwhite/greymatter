import * as _ from 'lodash'
const d3 = require('d3')

const PI = Math.PI

export interface Arc {
  start: number
  stop: number
}
export interface Point {
  x: number
  y: number
}
export interface Line {
  start: Point
  stop: Point
}
export interface Curve {
  points: Point[]
}
export interface Ellipse {
  major: number
  minor: number
  theta: number
  ecc: number
}
export interface DendGeo {
  point: Point
  nu: number
  inTheta: number
}
interface ArcBezier {
  p1: Point
  p2: Point
  q1: Point
  q2: Point
}
enum Quadrant {
  TopRight,
  TopLeft,
  BottomLeft,
  BottomRight
}

export const addPoints = (p1: Point, p2: Point): Point => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
})

export const lineSlope = (line: Line) => {
  return (line.stop.y - line.start.y) / (line.stop.x - line.start.x)
}

export const calc = (to: Point, from: Point, ellipse: Ellipse) => {
  const mCircleIn = (to.y - from.y) / (to.x - from.x)
  const nu = Math.PI + Math.atan(mCircleIn)
  const point = el(ellipse, nu)

  const thetaIn = Math.atan((point.y - from.y) / (point.x - from.x))
}

export const calcAxonPos = (ellipse: Ellipse): Point => {
  return {
    x: ellipse.major * Math.cos(ellipse.theta),
    y: ellipse.major * Math.sin(ellipse.theta)
  }
}

export const calcClosestDend = (
  to: Point,
  from: Point,
  ellipse: Ellipse
): DendGeo => {
  const mCircleIn = (from.y - to.y) / (from.x - to.x)
  console.log(ellipse.theta)
  const nu = Math.PI + Math.atan(mCircleIn) - ellipse.theta
  const cpos = el(ellipse, nu)

  const point = addPoints(cpos, to)
  const thetaIn = Math.PI + Math.atan((point.y - from.y) / (point.x - from.x))

  return {
    point: cpos,
    nu: nu / PI, // position along ellipse
    inTheta: thetaIn / PI // incoming angle
  }
}

const getThetaQuadrant = (theta: number): Quadrant => {
  if (theta > 1.5) {
    return Quadrant.BottomRight
  } else if (theta > 1) {
    return Quadrant.BottomLeft
  } else if (theta > 0.5) {
    return Quadrant.TopLeft
  } else {
    return Quadrant.TopRight
  }
}

const getMidPoint = (line: Line): Point => {
  return {
    x: (line.start.x + line.stop.x) / 2,
    y: (line.start.y + line.stop.y) / 2
  }
}

const getVectorMag = (vector: Point): number => {
  return Math.hypot(vector.x, vector.y)
}

const getLineMag = (line: Line): number => {
  return getVectorMag(getLineVector(line))
}

export const getUnitLine = (line: Line): Line => {
  const mag = getLineMag(line)
  return {
    start: line.start,
    stop: {
      x: line.start.x + (line.stop.x - line.start.x) / mag,
      y: line.start.y + (line.stop.y - line.start.y) / mag
    }
  }
}

const getLineVector = (line: Line): Point => {
  return {
    x: line.stop.x - line.start.x,
    y: line.stop.y - line.start.y
  }
}

const vectorMultiply = (l1: Point, l2: Point): Point => {
  return {
    x: l1.x * l2.x,
    y: l1.y * l2.y
  }
}

const vectorScalarMultiply = (vec: Point, scal: number): Point => {
  return {
    x: vec.x * scal,
    y: vec.y * scal
  }
}

export const calcDendCurves = (
  synCpos: Point,
  // synWidth: number,
  ctrlWidth: number, // % of base width maybe?
  ctrlHeight: number,
  arc: Arc,
  ellipse: Ellipse
): Curve[] => {
  // this is mostly trapezoidal calculations
  const baseRight = el(ellipse, arc.start * PI)
  const baseLeft = el(ellipse, arc.stop * PI)
  const baseLine = { start: baseLeft, stop: baseRight }
  const baseMag = getLineMag(baseLine)
  const baseUnitVector = getLineVector(getUnitLine(baseLine))

  const getUnitPerpLine = (line: Line, perp: Point): Line => {
    const unitVector = getLineVector(getUnitLine(line))
    const swapVector = (vec: Point) => ({ x: vec.y, y: vec.x })
    return {
      start: getMidPoint(line),
      stop: addPoints(
        getMidPoint(line),
        vectorMultiply(swapVector(unitVector), perp)
      )
    }
  }
  const BasePerpMap = new Map<Quadrant, (line: Line) => Line>([
    [Quadrant.TopLeft, (line: Line) => getUnitPerpLine(line, { x: -1, y: 1 })],
    [
      Quadrant.BottomLeft,
      (line: Line) => getUnitPerpLine(line, { x: -1, y: 1 })
    ],
    [
      Quadrant.BottomRight,
      (line: Line) => getUnitPerpLine(line, { x: -1, y: 1 })
    ],
    [Quadrant.TopRight, (line: Line) => getUnitPerpLine(line, { x: -1, y: 1 })]
  ])
  const baseUnitPerpLine: Line = BasePerpMap.get(getThetaQuadrant(arc.start))!(
    baseLine
  )
  // const baseUnitPerpLine = getUnitPerpLine(baseLine, {x: -1, y: 1})
  const baseUnitPerpVector = getLineVector(baseUnitPerpLine)

  const midLine: Line = {
    ...baseUnitPerpLine,
    stop: addPoints(
      baseUnitPerpLine.start,
      vectorMultiply(baseUnitPerpVector, { x: ctrlHeight, y: ctrlHeight })
    )
  }
  const midVector: Point = getLineVector(midLine)
  const ctrlLeft = addPoints(
    baseLeft,
    addPoints(
      midVector,
      vectorScalarMultiply(baseUnitVector, (baseMag - ctrlWidth) / 2)
    )
  )

  const ctrlRight = addPoints(
    ctrlLeft,
    vectorScalarMultiply(baseUnitVector, ctrlWidth)
  )

  return [
    {
      points: [baseLeft, ctrlLeft, synCpos]
    },
    {
      points: [baseRight, ctrlRight, synCpos]
    }
  ]
}

const el = (ellipse: Ellipse, nu: number): Point => ({
  x:
    ellipse.major * Math.cos(ellipse.theta) * Math.cos(nu) -
    ellipse.minor * Math.sin(ellipse.theta) * Math.sin(nu),
  y:
    ellipse.major * Math.sin(ellipse.theta) * Math.cos(nu) +
    ellipse.minor * Math.cos(ellipse.theta) * Math.sin(nu)
})

const elPrime = (ellipse: Ellipse, nu: number): Point => ({
  x:
    -ellipse.major * Math.cos(ellipse.theta) * Math.sin(nu) -
    ellipse.minor * Math.sin(ellipse.theta) * Math.cos(nu),
  y:
    -ellipse.major * Math.sin(ellipse.theta) * Math.sin(nu) +
    ellipse.minor * Math.cos(ellipse.theta) * Math.cos(nu)
})

function ellipseArcBezier (
  ellipse: Ellipse,
  nu1: number,
  nu2: number
): ArcBezier {
  const alpha =
    Math.sin(nu2 - nu1) *
    ((Math.sqrt(4.0 + 3.0 * Math.pow(Math.tan((nu2 - nu1) / 2.0), 2)) - 1.0) /
      3.0)
  const p1 = el(ellipse, nu1)
  const pp1 = elPrime(ellipse, nu1)
  const p2 = el(ellipse, nu2)
  const pp2 = elPrime(ellipse, nu2)
  return {
    p1,
    p2,
    q1: {
      x: p1.x + alpha * pp1.x,
      y: p1.y + alpha * pp1.y
    },
    q2: {
      x: p2.x - alpha * pp2.x,
      y: p2.y - alpha * pp2.y
    }
  }
}

export function ellipseBoundarySetter (
  major: number,
  minor: number,
  angle: number
): string {
  const pathSetter = d3.path()

  const ellipse: Ellipse = {
    major,
    minor,
    theta: angle,
    ecc: major / minor
  }

  const arcs = [
    // in pi radians
    [0, 1 / 4],
    [1 / 4, 1 / 2],
    [1 / 2, 3 / 2],
    [3 / 2, 2]
  ]
    .map((x) => x.map((xx) => xx * PI))
    .map((arc) => ellipseArcBezier(ellipse, arc[0], arc[1]))
  _.forEach(arcs, (b: ArcBezier, i: number) => {
    if (i === 0) pathSetter.moveTo(b.p1.x, b.p1.y)
    pathSetter.bezierCurveTo(b.q1.x, b.q1.y, b.q2.x, b.q2.y, b.p2.x, b.p2.y)
  })
  return pathSetter.toString()
}

export const inUnitArcs = (a: Arc): Arc[] => {
  if (a.stop - a.start > 1 / 2) {
    return _.flatMap(
      [
        {
          start: a.start,
          stop: a.start + (a.stop - a.start) / 2
        },
        {
          start: a.start + (a.stop - a.start) / 2,
          stop: a.stop
        }
      ],
      inUnitArcs
    )
  }
  return [a]
}

export function ellipsePathSetter (
  arcs: Arc[],
  major: number,
  minor: number,
  angle: number
): string {
  const pathSetter = d3.path()

  const ellipse: Ellipse = {
    major,
    minor,
    theta: angle,
    ecc: major / minor
  }

  const inRadians = (a: Arc) => {
    return {
      start: a.start * PI,
      stop: a.stop * PI
    }
  }

  // TODO: refactor below with currying
  const unitArcs = _.flatMap(arcs, inUnitArcs).map(inRadians)
  const bezierCurves: ArcBezier[] = unitArcs.map((a: Arc) =>
    ellipseArcBezier(ellipse, a.start, a.stop)
  )
  _.forEach(bezierCurves, (b: ArcBezier, i: number) => {
    pathSetter.moveTo(b.p1.x, b.p1.y)
    pathSetter.bezierCurveTo(b.q1.x, b.q1.y, b.q2.x, b.q2.y, b.p2.x, b.p2.y)
  })

  return pathSetter.toString()
}
