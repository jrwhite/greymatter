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

export interface IProps {
  sourceItems: SourceItem[]
}

export class EncodingPanel extends React.Component<IProps> {
  props: IProps

  render () {
    const {  } = this.props

    return (
      <div>
        <Popover>
          <Button icon='plus' />
        </Popover>
        <LineGraph />
      </div>
    )
  }
}