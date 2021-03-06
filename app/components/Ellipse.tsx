import * as React from 'react'
import {
  Arc,
  ellipseBoundarySetter,
  ellipsePathSetter
} from '../utils/geometry'

export interface IProps {
  major: number
  minor: number
  theta: number
  arcs: Arc[]
}

export const Ellipse: React.SFC<IProps> = (props) => {
  const { major, minor, theta, arcs } = props

  return (
    <g>
      <g>
        <path
          fill-rule='nonzero'
          stroke='none'
          d={ellipsePathSetter(arcs, major, minor, theta)}
        />
      </g>
    </g>
  )
}
