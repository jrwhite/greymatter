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
import NewEncodingForm from '../containers/NewEncodingForm'
import { GraphLine } from './GraphLine'
import EncodingGraph from '../containers/EncodingGraph'
import { SourceItem, renderSourceItem } from '../items/source'

export interface IProps {
  sourceItems: SourceItem[]
}

export const SourceSelect = Select.ofType<SourceItem>()

export interface IState {
  source?: SourceItem
}

export class EncodingPanel extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {}

  handleItemSelect = (item: SourceItem) => {
    this.setState({ source: item })
  }

  render () {
    const { sourceItems } = this.props
    const { source } = this.state

    return (
      <div>
        <Popover
          enforceFocus={false}
          canEscapeKeyClose={true}
          captureDismiss={false}
          usePortal={true}
        >
          <Button icon='plus' />
          <NewEncodingForm />
        </Popover>
        <SourceSelect
          items={sourceItems}
          itemRenderer={renderSourceItem}
          onItemSelect={this.handleItemSelect}
        >
          <Button text={source ? source.name : ''} rightIcon='caret-down' />
        </SourceSelect>
        <EncodingGraph
          id={source ? source.id : 'enc'}
          color={'blue'}
          rangeX={{ start: -260, stop: 30 }}
          rangeY={{ start: 0, stop: 0.1 }}
          width={250}
          height={150}
        />
      </div>
    )
  }
}
