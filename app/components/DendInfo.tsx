import * as React from 'react'
import { HTMLSelect, Button, MenuItem, Text } from '@blueprintjs/core'
import { Select, ItemRenderer, ItemPredicate } from '@blueprintjs/select'
import { EncodedSourceType } from '../reducers/encodings'
import { SetDendSourceAction } from '../actions/neurons'
import { IProps as IIProps } from '../containers/DendInfo'

export interface IProps extends IIProps {
  setDendSource: (payload: SetDendSourceAction) => void
  id: string
  index: number
  weighting: number
  source?: SourceItem
  sourceItems: SourceItem[]
}

interface DendItem {
  index: number
  sourceName: string
  id: string
  weighting: number
}

const renderDendItem: ItemRenderer<DendItem> = (
  dend,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null
  }

  const text = '${dend.index}. ${dend.sourceName}'
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={dend.weighting.toString()}
      key={dend.index}
      onClick={handleClick}
      text={text}
    />
  )
}

const SourceSelect = Select.ofType<SourceItem>()

export interface SourceItem {
  id: string
  name: string
  type: EncodedSourceType
}

const renderSourceItem: ItemRenderer<SourceItem> = (
  source,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null
  }

  const text = '${source.name}'
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={source.type}
      key={source.id}
      onClick={handleClick}
      text={text}
    />
  )
}

export const DendInfo: React.SFC<IProps> = (props) => {
  const handleItemSelect = (item: SourceItem) => {
    props.setDendSource({
      dendId: props.id,
      sourceId: item.id
    })
  }

  return (
    <div>
      <p>{props.index}</p>
      <SourceSelect
        items={props.sourceItems}
        itemRenderer={renderSourceItem}
        onItemSelect={handleItemSelect}
      >
        <Button
          text={props.source ? props.source.name : ''}
          rightIcon='caret-down'
        />
      </SourceSelect>
    </div>
  )
}
