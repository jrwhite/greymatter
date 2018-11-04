import * as React from 'react'
import {
  Button,
  Popover,
  Text,
  MenuItem,
  FormGroup,
  InputGroup
} from '@blueprintjs/core'
import { Select, ItemRenderer } from '@blueprintjs/select'
import { LineGraph } from './LineGraph'
import { SourceItem } from './DendInfo'
import NewEncodingForm from '../containers/NewEncodingForm'
import { GraphLine } from './GraphLine'
import EncodingGraph from '../containers/EncodingGraph'

export interface IProps {
  sourceItems: SourceItem[]
}

export class EncodingPanel extends React.Component<IProps> {
  props: IProps

  render () {
    const {} = this.props

    return (
      <div>
        <Popover>
          <Button icon='plus' />
          <Text />
        </Popover>
        <NewEncodingForm />
        <EncodingGraph
          id={'enc'}
          color={'blue'}
          rangeX={{ start: 0, stop: 1 }}
          rangeY={{ start: 0, stop: 1 }}
          width={50}
          height={50}
        />
      </div>
    )
  }
}
