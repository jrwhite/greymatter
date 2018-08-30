import * as _ from 'lodash'
const d3 = require('d3')

const PI = Math.PI

export type Arc = {
    start: number,
    stop: number
}

export type Point = {
    x: number,
    y: number
}

export type Line = {
    start: Point,
    stop: Point
}

export type Ellipse = {
    major: number,
    minor: number,
    theta: number,
    ecc: number
}

export type DendGeo = {
    point: Point,
    nu: number,
    inTheta: number,
}

type ArcBezier = {
    p1: Point,
    p2: Point,
    q1: Point,
    q2: Point
}

export const addPoints = (p1: Point, p2: Point): Point => ({
    x: p1.x + p2.x,
    y: p1.y + p2.y
})

export const calcClosestDend = (to: Point, from: Point, ellipse: Ellipse) : DendGeo => {

    const mCircleIn = (to.y - from.y) / (to.x - from.x)
    const nu = Math.PI+ Math.atan(mCircleIn) 
    const point = el(ellipse, nu)

    const elPrimeIn = elPrime(ellipse, nu)
    const mEllipseIn =  elPrimeIn.y / elPrimeIn.x
    // const mCircleTan = -1 * ((point.x - to.x) / (point.y - to.y))
    const thetaIn = Math.atan(mEllipseIn) - nu

    return {
        point: point,
        nu: nu / PI,
        inTheta: thetaIn
    }
}

const el = (ellipse: Ellipse, nu: number) : Point => ({
    "x": (ellipse.major * Math.cos(ellipse.theta) * Math.cos(nu)) - (ellipse.minor * Math.sin(ellipse.theta) * Math.sin(nu)),
    "y": (ellipse.major * Math.sin(ellipse.theta) * Math.cos(nu)) + (ellipse.minor * Math.cos(ellipse.theta) * Math.sin(nu))
})

const elPrime = (ellipse: Ellipse, nu: number) : Point => ({
    "x": (-ellipse.major * Math.cos(ellipse.theta) * Math.sin(nu)) - (ellipse.minor * Math.sin(ellipse.theta) * Math.cos(nu)),
    "y": (-ellipse.major * Math.sin(ellipse.theta) * Math.sin(nu)) + (ellipse.minor * Math.cos(ellipse.theta) * Math.cos(nu))
})

function ellipseArcBezier(ellipse: Ellipse, nu1: number, nu2: number) : ArcBezier {
    const alpha = Math.sin(nu2 - nu1) * ((Math.sqrt(4.00 + 3.00 * Math.pow(Math.tan((nu2 - nu1) / 2.00), 2)) - 1.00) / 3.00)
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

export function ellipseBoundarySetter(
    major: number,
    minor: number,
    angle: number
) : string{
    let pathSetter = d3.path()

    const ellipse: Ellipse = {
        major: major,
        minor: minor,
        theta: angle,
        ecc: major / minor
    }

    const arcs = [
        // in pi radians
        [0, 1/4],
        [1/4, 1/2],
        [1/2, 3/2],
        [3/2, 2]
    ].map(
        x => x.map(xx => xx * PI)
    ).map(
        arc => ellipseArcBezier(ellipse, arc[0], arc[1])
    )
    _.forEach(arcs, 
        (b: ArcBezier, i: number) => {
            if (i == 0) pathSetter.moveTo(b.p1.x, b.p1.y)
            pathSetter.bezierCurveTo(
                b.q1.x, b.q1.y,
                b.q2.x, b.q2.y,
                b.p2.x, b.p2.y
            )
        }
    )
    return pathSetter.toString()
} 

export const inUnitArcs = (a: Arc): Array<Arc> => {
    if (a.stop - a.start > 1 / 2) {
        return _.flatMap([
            {
                start: a.start,
                stop: a.start + ((a.stop - a.start) / 2)
            },
            {
                start: a.start + ((a.stop - a.start) / 2),
                stop: a.stop
            }
        ], inUnitArcs)
    }
    return [a]
}

export function ellipsePathSetter(
    arcs: Array<Arc>,
    major: number,
    minor: number,
    angle: number
) : string {
    let pathSetter = d3.path()

    const ellipse: Ellipse = {
        major: major,
        minor: minor,
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
    const bezierCurves: Array<ArcBezier> = unitArcs.map((a: Arc) => ellipseArcBezier(ellipse, a.start, a.stop))
    _.forEach(bezierCurves, (b: ArcBezier, i: number) => {
        pathSetter.moveTo(b.p1.x, b.p1.y)
        pathSetter.bezierCurveTo(
            b.q1.x, b.q1.y,
            b.q2.x, b.q2.y,
            b.p2.x, b.p2.y
        )
    })

    return pathSetter.toString()
}
