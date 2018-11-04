import { EncodedSourceType } from '../reducers/encodings'
import { ItemRenderer } from '@blueprintjs/select'
import { MenuItem } from '@blueprintjs/core'
import * as React from 'react'

// SourceItem should be called EncodingItem

export interface SourceItem {
  id: string
  name: string
  type: EncodedSourceType
}

export const renderSourceItem: ItemRenderer<SourceItem> = (
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
