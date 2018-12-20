import * as React from 'react'
import {
  Ellipse,
  Arc,
  ellipseBoundarySetter,
  ellipsePathSetter
} from '../utils/geometry'

export interface IProps {
  ellipse: Ellipse
  arcs: Arc[]
}

export const EllipseSegments: React.SFC<IProps> = (props) => {
  const { major, minor, theta } = props.ellipse
  const { arcs } = props

  return (
    <g>
      <g>
        <path stroke='none' d={ellipseBoundarySetter(major, minor, theta)} />
      </g>
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
