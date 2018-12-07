import * as React from 'react'
import { connect } from 'react-redux'

export interface IProps {
  onChange: (newData: number) => void
  data: number
  shouldStep?: boolean
}

export class DataSource extends React.Component<IProps> {
  props: IProps

  shouldComponentUpdate (nextProps: IProps) {
    if (nextProps.shouldStep === false) return false
    return true
  }

  componentDidUpdate () {
    const { data, onChange } = this.props
    onChange(data)
  }

  render () {
    return null
  }
}
