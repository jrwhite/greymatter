import { inUnitArcs, ellipsePathSetter, getUnitLine } from '../../app/utils/geometry'
import * as _ from 'lodash'

describe('geometry', () => {

    describe('inUnitArcs', () => {
        it('should break up a semicircle into unit arcs', () => {
            expect(inUnitArcs(
                { start: 0, stop: 1}
            )).toEqual([
                { start: 0, stop: 1 / 2 },
                { start: 1 / 2, stop: 1 }
            ])
        })
        it('should break up a semicircle using flatmap', () => {
            expect(_.flatMap([
                { start: 0, stop: 1}
            ], inUnitArcs)).toEqual([
                { start: 0, stop: 1 / 2 },
                { start: 1 / 2, stop: 1 }
            ])
        })
        it('should break up second semicircle into unit arcs', () => {
            expect(inUnitArcs(
                { start: 1, stop: 2}
            )).toEqual([
                { start: 1, stop: 3 / 2 },
                { start: 3 / 2, stop: 2 }
            ])
        })
        it('should break up arcs into unit arcs', () => {
            expect(inUnitArcs(
                { start: 0, stop: 2 }
            )).toEqual([
                { start: 0, stop: 1 / 2 },
                { start: 1 / 2, stop: 1 },
                { start: 1, stop: 3 / 2 },
                { start: 3 / 2, stop: 2 }
            ])
        })
    })
    describe('ellipsePathSetter', () => {
        // it('should make path string', () => {
        //     expect(ellipsePathSetter([{ start: 0, stop: 2 }], 50, 30, 0))
        //         .toEqual('')
        // })
    })
    describe('getUnitLine', () => {
        it('should make simply unit line', () => {
            const line = getUnitLine(
                {
                    start: { x: 0, y: 0 },
                    stop: { x: 10, y: 10 }
                }
            )
            expect(line.start).toEqual({x: 0, y: 0})
            expect(line.stop.x).toBeCloseTo(Math.sqrt(0.5), 5)
            expect(line.stop.y).toBeCloseTo(Math.sqrt(0.5), 5)
        })
        it('should make negative simple unit line', () => {
            const line = getUnitLine(
                {
                    start: { x: 0, y: 0 },
                    stop: { x: -10, y: -10 }
                }
            )
            expect(line.start).toEqual({x: 0, y: 0})
            expect(line.stop.x).toBeCloseTo(-Math.sqrt(0.5), 5)
            expect(line.stop.y).toBeCloseTo(-Math.sqrt(0.5), 5)
        })
        it('should make offset simple unit line', () => {
            const line = getUnitLine(
                {
                    start: { x: 10, y: 10},
                    stop: {x: 100, y: 100}
                }
            )
            expect(line.start).toEqual({x: 10, y: 10})
            expect(line.stop.x).toBeCloseTo(10+Math.sqrt(0.5), 5)
            expect(line.stop.y).toBeCloseTo(10+Math.sqrt(0.5), 5)
        })
        it('should make simple offset negative unit line', () => {
            const line = getUnitLine(
                {
                    start: {x: 10, y: 10},
                    stop: {x: 2, y: 2}
                }
            )
            expect(line.start).toEqual({x: 10, y: 10})
            expect(line.stop.x).toBeCloseTo(10-Math.sqrt(0.5), 5)
            expect(line.stop.y).toBeCloseTo(10-Math.sqrt(0.5), 5)
        })
        it('should make simple negative offset negative unit line', () => {
            const line = getUnitLine(
                {
                    start: {x: -10, y: -10},
                    stop: {x: 2, y: 2}
                }
            )
            expect(line.start).toEqual({x: -10, y: -10})
            expect(line.stop.x).toBeCloseTo(-10+Math.sqrt(0.5), 5)
            expect(line.stop.y).toBeCloseTo(-10+Math.sqrt(0.5), 5)
        })
    })
})