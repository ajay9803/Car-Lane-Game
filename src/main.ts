import dimensions from "./constants";
import Point from "./shapes/point";

import { lines } from "./shapes/line";
import Car from "./shapes/car";
import {
  getHighScore,
  getRandomInt,
  randomObstacleImageGenerator,
  updateHighScore,
} from "./utilities/utility";

import heroCar from "./assets/player-car.png";
import { Positions } from "./enums/position";

// initial enemy position co-ordinates
const initialEnemyPositions = [
  { x: dimensions.canvasWidth / 2 - 250, y: -200, position: Positions.Left },
  { x: dimensions.canvasWidth / 2 - 50, y: -300, position: Positions.Center },
  { x: dimensions.canvasWidth / 2 + 150, y: -700, position: Positions.Center },
];

// main - player image
const heroImage = new Image();
heroImage.src = heroCar;

// const enemyImage = new Image();
// enemyImage.src = enemyCar;

let carSpeed = 5;

// define game over variable
export let gameOver = false;

// get basic starting html elements

const startButton = document.getElementById("startButton") as HTMLDivElement;
const startScreen = document.getElementById("startScreen") as HTMLDivElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d")! as CanvasRenderingContext2D;

// add event listener to the start button
startButton.addEventListener("click", () => {
  // hide the start screen
  startScreen.style.display = "none";
  // show the canvas
  canvas.style.display = "block";

  // call the function to start the game
  startGame();
});

// game starting - function
const startGame = () => {
  // define the initial score
  let score = 0;

  // get previous highscores
  let highScore = getHighScore();

  // create highscore element

  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.id = "scoreDisplay";
  highScoreDisplay.style.position = "absolute";
  highScoreDisplay.style.top = "20px";
  highScoreDisplay.style.right = "20px";
  highScoreDisplay.style.color = "white";
  highScoreDisplay.style.fontFamily = "Tiny5";
  highScoreDisplay.style.fontSize = "30px";
  highScoreDisplay.innerText = `Highscore: ${highScore}`;

  // append highscore element

  document.body.appendChild(highScoreDisplay);

  // create score display element

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "scoreDisplay";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "60px";
  scoreDisplay.style.right = "20px";
  scoreDisplay.style.color = "white";
  scoreDisplay.style.fontFamily = "Tiny5";
  scoreDisplay.style.fontSize = "30px";
  scoreDisplay.innerText = `Score: ${score}`;

  // append score display element

  document.body.appendChild(scoreDisplay);

  // set height and width of the canvas

  canvas.width = dimensions.canvasWidth;
  canvas.height = dimensions.canvasHeight;

  // initialize the player car

  const mainCar = new Car(
    new Point(dimensions.canvasWidth / 2 - 50, 520),
    100,
    150,
    Positions.Center,
    "red",
    false,
    heroImage
  );

  // initialize 3 enemy cars

  const randomCar1 = new Car(
    new Point(initialEnemyPositions[0].x, initialEnemyPositions[0].y),
    100,
    150,
    initialEnemyPositions[0].position,
    "blue",
    true,
    randomObstacleImageGenerator()
  );

  const randomCar2 = new Car(
    new Point(initialEnemyPositions[1].x, initialEnemyPositions[1].y),
    100,
    150,
    initialEnemyPositions[1].position,
    "blue",
    true,
    randomObstacleImageGenerator()
  );

  const randomCar3 = new Car(
    new Point(initialEnemyPositions[2].x, initialEnemyPositions[2].y),
    100,
    150,
    initialEnemyPositions[2].position,
    "blue",
    true,
    randomObstacleImageGenerator()
  );

  const randomcars = [randomCar1, randomCar2, randomCar3];

  const clearCanvasRects = () => {
    ctx.clearRect(0, 0, dimensions.canvasWidth, dimensions.canvasHeight);
  };

  // check for rectangular box collision

  const checkCollision = () => {
    randomcars.forEach((enemyCar) => {
      // main car bounding box
      const mainCarLeft = mainCar.point.x;
      const mainCarRight = mainCar.point.x + mainCar.width;
      const mainCarTop = mainCar.point.y;
      const mainCarBottom = mainCar.point.y + mainCar.height;

      // enemy car bounding box
      const enemyCarLeft = enemyCar.point.x;
      const enemyCarRight = enemyCar.point.x + enemyCar.width;
      const enemyCarTop = enemyCar.point.y;
      const enemyCarBottom = enemyCar.point.y + enemyCar.height;

      // check for collision using AABB method
      const isColliding =
        mainCarRight > enemyCarLeft && // main car's right edge is beyond enemy car's left edge
        mainCarLeft < enemyCarRight && // main car's left edge is before enemy car's right edge
        mainCarBottom > enemyCarTop && // main car's bottom edge is below enemy car's top edge
        mainCarTop < enemyCarBottom; // main car's top edge is above enemy car's bottom edge

      if (isColliding) {
        // update highscore if the current score is greater than the previous highscore

        if (score > highScore) {
          updateHighScore(score);
          highScore = score;
          highScoreDisplay.innerText = `Highscore: ${highScore}`;
        }

        // set gameOver to true
        gameOver = true;
      }
    });
  };

  const animate = () => {
    if (gameOver) {
      // display "Game Over" message
      ctx.fillStyle = "red";
      ctx.font = "60px Tiny5";
      ctx.textAlign = "center";
      ctx.fillText(
        "Game Over",
        dimensions.canvasWidth / 2,
        dimensions.canvasHeight / 2
      );

      ctx.fillStyle = "black";
      ctx.font = "30px Tiny5";
      ctx.fillText(
        `Your high score is: ${score}`,
        dimensions.canvasWidth / 2,
        dimensions.canvasHeight / 2 + 50
      );

      ctx.fillStyle = "black";
      ctx.font = "30px Tiny5";
      ctx.fillText(
        `Press space to continue`,
        dimensions.canvasWidth / 2,
        dimensions.canvasHeight / 2 + 100
      );

      // Stop the animation by not calling requestAnimationFrame
      return;
    }

    clearCanvasRects();

    // update the game speed when the score hits 30-divisible mark
    if (score >= 30 && score % 30 === 0) {
      carSpeed += 0.1; // increase speed by 1 every 30 points
    }

    // update the lane lines

    lines.forEach((theLine) => {
      theLine.start.y++;
      theLine.end.y++;

      theLine.draw();
      theLine.move();
    });

    // generate random cars
    randomcars.forEach((randomCar) => {
      randomCar.draw();
      randomCar.point.y += carSpeed;

      if (randomCar.point.y > dimensions.canvasHeight) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;

        let newRandomY = getRandomInt(-700, -100);

        // check if the new random car's y-coordinate is close to the other cars
        let closeToOtherCars = randomcars.some((otherCar) => {
          return (
            Math.abs(newRandomY - otherCar.point.y) < 180 &&
            Math.abs(newRandomY - otherCar.point.y) !== 0
          );
        });

        // if the new car is too close to the others, adjust its y-coordinate
        if (closeToOtherCars) {
          // find the maximum y-coordinate value within the running obstacles
          let maxY = Math.max(...randomcars.map((car) => car.point.y));
          // add 200 to the maximum y-coordinate value to ensure a safe distance between cars
          newRandomY = maxY + 200;
        }

        randomCar.point.y = newRandomY;
        randomCar.image = randomObstacleImageGenerator();
      }
    });

    mainCar.draw();
    checkCollision();

    requestAnimationFrame(animate);
  };

  animate();

  const restartGame = () => {
    // reset the game over flag
    gameOver = false;

    // reset the score
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;

    // reset the car speed
    carSpeed = 5;

    // reset main car position
    mainCar.point.x = dimensions.canvasWidth / 2 - 50;
    mainCar.point.y = 520;
    mainCar.currentPosition = Positions.Center;
    mainCar.targetX = dimensions.canvasWidth / 2 - 50;
    mainCar.isMoving = false;

    // reset enemy cars to their initial positions
    randomcars.forEach((randomCar, index) => {
      randomCar.point.x = initialEnemyPositions[index].x;
      randomCar.point.y = initialEnemyPositions[index].y;
      randomCar.currentPosition = initialEnemyPositions[index].position;
    });

    // clear the canvas before starting the game
    clearCanvasRects();

    // restart the game animation loop
    animate();
  };

  // listen for restart event on spacebar click

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameOver) {
      restartGame();
    }
  });
};
