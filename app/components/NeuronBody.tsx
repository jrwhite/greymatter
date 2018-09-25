import * as React from "react";
import { Ellipse } from "./Ellipse";
import { DendState } from "../reducers/network";
import { Dendrite } from "./Dendrite";
import { Arc, Ellipse as EllipseGeo } from "../utils/geometry";
import * as _ from "lodash";

export interface IProps {
  dends: Array<DendState>;
  theta: number;
}

export class NeuronBody extends React.Component<IProps> {
  props: IProps;

  render() {
    const { dends, theta } = this.props;

    const bodyArcs: Array<Arc> = _.reduce(
      dends,
      (body, d): Array<Arc> => {
        return _.concat(_.initial(body), [
          {
            start: _.last(body)!!.start,
            stop: d.arc.start
          },
          {
            start: d.arc.stop,
            stop: _.last(body)!!.stop
          }
        ]);
      },
      [{ start: 1 / 4, stop: 7 / 4 }]
    );

    const defaultEllipseGeo: EllipseGeo = {
      major: 50,
      minor: 30,
      theta: 0,
      ecc: 5 / 3
    };

    return (
      <g>
        <Ellipse {...defaultEllipseGeo} theta={theta} arcs={bodyArcs} />
        {dends.map(d => (
          <Dendrite
            key={d.id}
            dend={d}
            bodyEllipse={{
              ...defaultEllipseGeo,
              theta: theta
            }}
          />
        ))}
      </g>
    );
  }
}
