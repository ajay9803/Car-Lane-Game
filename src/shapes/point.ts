interface IPoint {
  x: number;
  y: number;
}

// class - Point to refer to the x and y coordinate
export default class Point implements IPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
