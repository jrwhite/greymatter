import * as React from 'react'
import { EncodedSourceType } from '../reducers/encodings'
import { Select, ItemRenderer } from '@blueprintjs/select'
import { MenuItem, FormGroup, InputGroup, Button } from '@blueprintjs/core'
import { SourceSelect } from './DendInfo'

export interface IProps {
  //   addSourceEncoding: any
  observableItems: ObservableItem[]
}

export interface IState {
  name: string
  observable: ObservableItem
  encodingType: EncodedSourceType
}

const ObservableSelect = Select.ofType<ObservableItem>()

export interface ObservableItem {
  id: string
  name: string
  type: string
}

const renderObservableItem: ItemRenderer<ObservableItem> = (
  observable,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null
  }

  const text = ''
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={observable.type}
      key={observable.id}
      onClick={handleClick}
      text={observable.name}
    />
  )
}

const EncodingSelect = Select.ofType<EncodedSourceType>()

const renderEncodingType: ItemRenderer<EncodedSourceType> = (
  source,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null
  }

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={source}
      key={source}
      onClick={handleClick}
      text={source}
    />
  )
}

export class NewEncodingForm extends React.Component<IProps, IState> {
  prop: IProps
  state: IState

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  handleObservableSelect = (item: ObservableItem) => {
    this.setState({ observable: item })
  }

  handleEncodingSelect = (item: EncodedSourceType) => {
    this.setState({ encodingType: item })
  }

  render () {
    const { observableItems } = this.props
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup label={'New Encoding'}>
          <InputGroup placeholder='Name' />
        </FormGroup>
        <FormGroup label='Select Observable'>
          <ObservableSelect
            items={observableItems}
            itemRenderer={renderObservableItem}
            onItemSelect={this.handleObservableSelect}
          >
            <Button />
          </ObservableSelect>
        </FormGroup>
        <FormGroup label='Select Encoding'>
          <EncodingSelect
            items={[EncodedSourceType.GymAction, EncodedSourceType.Tonic]}
            itemRenderer={renderEncodingType}
            onItemSelect={this.handleEncodingSelect}
          >
            <Button />
          </EncodingSelect>
        </FormGroup>
        <Button>Cancel</Button>
        <Button type='submit'>Create</Button>
      </form>
    )
  }
}
