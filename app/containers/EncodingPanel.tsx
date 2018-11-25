import * as React from 'react'
import { connect } from 'react-redux'
import { IState } from '../reducers'
import * as _ from 'lodash'
import { EncodedSourceState } from '../reducers/encodings'
import { SourceItem } from '../items/source'
import { EncodingPanel } from '../components/EncodingPanel'

const getSourceItems = (state: IState): SourceItem[] =>
  _.map(
    state.network.encodings,
    (enc: EncodedSourceState): SourceItem => {
      return {
        id: enc.id,
        name: enc.name,
        type: enc.type,
        domain: enc.domain ? enc.domain : { start: 0, stop: 1 },
        range: enc.range ? enc.range : { start: 0, stop: 1 }
      }
    }
  )

export default connect((state: IState) => ({
  sourceItems: getSourceItems(state)
}))(EncodingPanel)
