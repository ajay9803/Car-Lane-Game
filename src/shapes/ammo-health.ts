import { carSpeed, ctx } from "../../src/main";
import bullet from "../assets/sprites/bullet.png";

const image = new Image();
image.src = bullet;

class AmmoHealth {
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isActive = true;
  }

  draw() {
    if (this.isActive) {
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
  }

  move() {
    if (this.isActive) {
      this.y += carSpeed;
    }
  }
}

export default AmmoHealth;
