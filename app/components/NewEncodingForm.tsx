import * as React from 'react'
import { EncodedSourceType } from '../reducers/encodings'
import { Select, ItemRenderer } from '@blueprintjs/select'
import { MenuItem, FormGroup, InputGroup, Button } from '@blueprintjs/core'
import { SourceSelect } from './DendInfo'
import { AddEncodingAction, AddNewEncodingAction } from '../actions/encodings'
import { POPOVER_DISMISS } from '@blueprintjs/core/lib/esm/common/classes'

export interface IProps {
  addNewEncoding: (payload: AddNewEncodingAction) => void
  observableItems: ObservableItem[]
}

export interface IState {
  observable?: ObservableItem
  encodingType?: EncodedSourceType
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
  state: IState = {
    observable: undefined,
    encodingType: undefined
  }

  isValid = (): boolean => {
    const { observable, encodingType } = this.state
    return name && observable && encodingType ? true : false
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { addNewEncoding } = this.props
    const { observable, encodingType } = this.state
    e.preventDefault()
    const data: FormData = new FormData(e.currentTarget)
    if (observable && encodingType) {
      addNewEncoding({
        name: data.get('name-input') as string,
        obsId: observable.id,
        type: encodingType
      })
    }
  }

  handleObservableSelect = (item: ObservableItem) => {
    this.setState({ observable: item })
  }

  handleEncodingSelect = (item: EncodedSourceType) => {
    this.setState({ encodingType: item })
  }

  render () {
    const { observableItems } = this.props
    const { observable, encodingType } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup label={'New Encoding'}>
          <InputGroup id='name-input' placeholder='Name' />
        </FormGroup>
        <FormGroup label='Select Observable'>
          <ObservableSelect
            items={observableItems}
            itemRenderer={renderObservableItem}
            onItemSelect={this.handleObservableSelect}
          >
            <Button
              text={observable ? observable.name : 'Choose Observable...'}
            />
          </ObservableSelect>
        </FormGroup>
        <FormGroup label='Select Encoding'>
          <EncodingSelect
            items={[EncodedSourceType.GymAction, EncodedSourceType.Tonic]}
            itemRenderer={renderEncodingType}
            onItemSelect={this.handleEncodingSelect}
          >
            <Button text={encodingType ? encodingType : 'Choose Encoding...'} />
          </EncodingSelect>
        </FormGroup>
        <Button
          type='submit'
          className={this.isValid() ? POPOVER_DISMISS : undefined}
        >
          Create
        </Button>
      </form>
    )
  }
}
