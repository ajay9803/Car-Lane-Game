import Point from "./point";
import { ctx } from "../main";
import dimensions from "../constants";

// class - line to separate the lanes 

export default class Line {
  start: Point;
  end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }

  move = () => {
    // move the line down
    this.start.y++;
    this.end.y++;

    // wrap the line to the top if it moves out of view
    if (this.start.y > dimensions.canvasHeight) {
      this.start.y = -200;
      this.end.y = 0;
    }
  };

  draw = () => {
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "white";
    ctx.stroke();
  };
}

// creation of initial lane separators 

const line0 = new Line(
  new Point(dimensions.canvasWidth / 2 - 100, 10),
  new Point(dimensions.canvasWidth / 2 - 100, 250)
);

const line1 = new Line(
  new Point(dimensions.canvasWidth / 2 + 100, 10),
  new Point(dimensions.canvasWidth / 2 + 100, 250)
);

const line2 = new Line(
  new Point(dimensions.canvasWidth / 2 - 100, 350),
  new Point(dimensions.canvasWidth / 2 - 100, 590)
);

const line3 = new Line(
  new Point(dimensions.canvasWidth / 2 + 100, 350),
  new Point(dimensions.canvasWidth / 2 + 100, 590)
);

const line4 = new Line(
  new Point(dimensions.canvasWidth / 2 - 100, 650),
  new Point(dimensions.canvasWidth / 2 - 100, 700)
);

const line5 = new Line(
  new Point(dimensions.canvasWidth / 2 + 100, 650),
  new Point(dimensions.canvasWidth / 2 + 100, 700)
);

export const lines = [line0, line1, line2, line3, line4, line5];
