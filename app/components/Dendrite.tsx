import * as React from "react";
import {
  Arc,
  Line as LineGeo,
  Point,
  calcDendCurves,
  Ellipse,
  Curve
} from "../utils/geometry";
import { Line } from "./Line";
import { CurveNatural } from "./CurveNatural";
const d3 = require("d3");
import * as _ from "lodash";
import { DendState } from "../reducers/network";

export interface IProps {
  dend: DendState;
  bodyEllipse: Ellipse;
}

export class Dendrite extends React.Component<IProps> {
  props: IProps;

  render() {
    const { dend, bodyEllipse } = this.props;

    const curves: Array<Curve> = calcDendCurves(
      dend.synCpos,
      dend.weighting / 12, // ctrlWidth
      dend.weighting / 5, // ctrlHeight
      dend.arc,
      bodyEllipse
    );

    return (
      <g>
        {curves.map((curve: Curve) => (
          <CurveNatural key={_.uniqueId("dl")} curve={curve} />
        ))}
      </g>
    );
  }
}
