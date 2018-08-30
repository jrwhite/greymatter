import * as React from 'react'
import { RouteComponentProps } from 'react-router';

export interface IProps extends RouteComponentProps<any> {
    dataSets: {label: string, data: Array<number>}
}