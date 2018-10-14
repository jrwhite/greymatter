import * as React from 'react'
import { connect } from 'react-redux'

export interface IProps {
  onChange: (newData: number) => void
  data: number
}

export class DataSource extends React.Component<IProps> {
  props: IProps

  componentDidUpdate () {
    const { data, onChange } = this.props
    onChange(data)
  }

  render () {
    return null
  }
}
