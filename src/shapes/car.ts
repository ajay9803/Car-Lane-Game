import Point from "./point";
import { ctx, gameOver } from "../main";
import dimensions, { playerMovementSpeed } from "../constants";
import { Positions } from "../enums/position";

export interface ICar {
  point: Point;
  width: number;
  height: number;
  currentPosition: Positions;
  color: string;
  isEnemy: boolean;
  image: CanvasImageSource;

  draw: () => void;
  move: () => void;
}

// class-Car implements interface Icar

export default class Car implements ICar {
  point: Point;
  height: number;
  width: number;
  currentPosition: Positions;

  // prevents rapid repeated movements
  isMoving: boolean;
  color: string;

  // determine if the car is player or enemy
  isEnemy: boolean;

  // define target X for smooth movement of the player car
  targetX: number;
  image: CanvasImageSource;

  constructor(
    point: Point,
    width: number,
    height: number,
    currentPosition: Positions,
    color: string,
    isEnemy: boolean,
    image: CanvasImageSource
  ) {
    this.point = point;
    this.width = width;
    this.height = height;
    this.currentPosition = currentPosition;
    this.isMoving = false;
    this.color = color;
    this.isEnemy = isEnemy;

    // initialize target position to current position
    this.targetX = point.x;
    this.image = image;
    this.move();
    this.draw();
  }

  draw = () => {
    ctx.fillStyle = this.color;

    // test with rect first
    // ctx.fillRect(this.point.x, this.point.y, this.width, this.height);

    ctx.drawImage(
      this.image,
      this.point.x,
      this.point.y,
      this.width,
      this.height
    );
  };

  // general move function

  move = () => {
    if (!this.isEnemy) {
      window.addEventListener("keydown", (e) => {
        if (this.isMoving) {
          return;
        }

        // Determine the new target position based on the key pressed
        switch (e.key) {
          case "a": {
            // move left
            switch (this.currentPosition) {
              // run condition if the player's position is center
              case Positions.Center:
                this.currentPosition = Positions.Left;
                this.targetX = dimensions.canvasWidth / 2 - 250;
                break;

              // run condition if the player's position is right-side
              case Positions.Right:
                this.currentPosition = Positions.Center;
                this.targetX = dimensions.canvasWidth / 2 - 50;
                break;
            }
            break;
          }

          case "d": {
            // move right
            switch (this.currentPosition) {
              // run condition if the player's position is center
              case Positions.Center:
                this.currentPosition = Positions.Right;
                this.targetX = dimensions.canvasWidth / 2 + 150;
                break;

              // run condition if the player's position is left-side
              case Positions.Left:
                this.currentPosition = Positions.Center;
                this.targetX = dimensions.canvasWidth / 2 - 50;
                break;
            }
            break;
          }
        }

        // start the animation towards the target position
        this.isMoving = true;

        // run animate function
        this.animateMovement();
      });
    }
  };

  // animate the movement towards the target-x position
  animateMovement = () => {
    const speed = playerMovementSpeed;

    // direction defines the velocity
    // which will either be positive or negative
    // 1: refering to right hand movement
    // -1: refering to left movement
    let direction = this.targetX > this.point.x ? 1 : -1;
    const step = () => {
      // check if game is over
      if (gameOver) {
        this.isMoving = false;
        // stop further animation if game is over
        return;
      }

      // continue moving towards the target if game is not over

      // check if point-x has reached it's target
      if (
        (direction === 1 && this.point.x < this.targetX) ||
        (direction === -1 && this.point.x > this.targetX)
      ) {
        this.point.x += direction * speed;

        // ensure it ends exactly at target position
        if (
          (direction === 1 && this.point.x > this.targetX) ||
          (direction === -1 && this.point.x < this.targetX)
        ) {
          this.point.x = this.targetX;
        }
        this.draw();

        // continue the animation
        requestAnimationFrame(step);
      } else {
        // movement completed
        this.isMoving = false;
      }
    };
    step();
  };
}
