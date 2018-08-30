import { inUnitArcs, ellipsePathSetter } from '../../app/utils/geometry'
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
})