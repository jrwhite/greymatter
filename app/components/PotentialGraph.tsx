import * as React from "react";
import { PotentialGraphLine } from "./PotentialGraphLine";
const d3 = require("d3");

export interface IProps {
  neurons: Array<{ id: string }>;
  scaleX: number;
  rangeX: number;
  scaleY: number;
  rangeY: { start: number; stop: number };
}

export class PotentialGraph extends React.Component<IProps> {
  props: IProps;

  render() {
    const {
      neurons,
      scaleX, // unit pixels
      rangeX, // total number of values to store
      scaleY, // unit pixels
      rangeY // {start, stop} number e.g. -150% - 150%
    } = this.props;

    const maxN = rangeX;
    const height = (rangeY.stop - rangeY.start) * scaleY;
    const scale = d3
      .scaleLinear()
      .domain([rangeY.start, rangeY.stop])
      .range([0, height]);
    // .clamp(true)
    const axis = d3.axisRight(scale).ticks(5);

    return (
      <g
      // transform="translate(100,100)"
      >
        <g
          ref={node =>
            d3
              .select(node)
              .attr("transform", "translate(0,0)")
              .call(axis)
          }
        />
        {neurons.map((neuron: { id: string; color: string }) => (
          <PotentialGraphLine
            key={neuron.id}
            id={neuron.id}
            color="red"
            deltaX={scaleX}
            height={height}
            maxN={maxN}
            rangeY={rangeY}
          />
        ))}
      </g>
    );
  }
}
