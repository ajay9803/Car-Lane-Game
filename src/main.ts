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

import heroCar from "./assets/sprites/player-car.png";
import { Positions } from "./enums/position";
import Bullet from "./shapes/bullet";
import AmmoHealth from "./shapes/ammo-health";

// general sound effects
const crashSound = document.getElementById("crashSound") as HTMLAudioElement;
const bulletHitSound = document.getElementById("bulletHit") as HTMLAudioElement;
const themeSong = document.getElementById("themeSong") as HTMLAudioElement;

// ammo count
let bulletCount = 5;

// instances of bullet
const bullets: Bullet[] = [];

// instances of ammo-healths
const ammoHealthInstances: AmmoHealth[] = [];

// initial enemy position co-ordinates
const initialEnemyPositions = [
  { x: dimensions.canvasWidth / 2 - 250, y: -200, position: Positions.Left },
  { x: dimensions.canvasWidth / 2 - 50, y: -300, position: Positions.Center },
  { x: dimensions.canvasWidth / 2 + 150, y: -700, position: Positions.Center },
];

// initial ammo-health positions
const theAmmohealthPositions = [
  { x: dimensions.canvasWidth / 2 - 250, y: 0, position: Positions.Left },
  { x: dimensions.canvasWidth / 2 - 50, y: 0, position: Positions.Center },
  { x: dimensions.canvasWidth / 2 + 150, y: 0, position: Positions.Center },
];

// main - player image
const heroImage = new Image();
heroImage.src = heroCar;

// speed of the game
export let carSpeed = 5;

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
  // play the theme song
  themeSong.play();

  // define the initial score
  let score = 0;

  // get previous highscores
  let highScore = getHighScore();

  // display game elements: score, high-score and ammo-count

  // create highscore element

  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.id = "scoreDisplay";
  highScoreDisplay.style.position = "absolute";
  highScoreDisplay.style.top = "30px";
  highScoreDisplay.style.right = "20px";
  highScoreDisplay.style.color = "white";
  highScoreDisplay.style.fontFamily = "Tiny5";
  highScoreDisplay.style.fontSize = "30px";
  highScoreDisplay.innerText = `Highscore: ${highScore}`;

  // append highscore element

  document.body.appendChild(highScoreDisplay);

  // create score display element

  const scoreDisplay = document.createElement("div");
  scoreDisplay.id = "highScoreDisplay";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "70px";
  scoreDisplay.style.right = "20px";
  scoreDisplay.style.color = "white";
  scoreDisplay.style.fontFamily = "Tiny5";
  scoreDisplay.style.fontSize = "30px";
  scoreDisplay.innerText = `Score: ${score}`;

  // append score display element

  document.body.appendChild(scoreDisplay);

  // create score display element

  const bulletDisplay = document.createElement("div");
  bulletDisplay.id = "bulletDisplay";
  bulletDisplay.style.position = "absolute";
  bulletDisplay.style.top = "30px";
  bulletDisplay.style.left = "20px";
  bulletDisplay.style.color = "white";
  bulletDisplay.style.fontFamily = "Tiny5";
  bulletDisplay.style.fontSize = "30px";
  bulletDisplay.innerText = `Ammo: ${bulletCount}`;

  // append score display element

  document.body.appendChild(bulletDisplay);

  // set height and width of the canvas

  canvas.width = dimensions.canvasWidth;
  canvas.height = dimensions.canvasHeight;

  // spawn ammo healths
  const spawnAmmoHealth = () => {
    // randomly select one of the predefined positions
    const randomPosition =
      theAmmohealthPositions[
        Math.floor(Math.random() * initialEnemyPositions.length)
      ];

    // create a new ammo health instance at the selected position
    const newAmmoHealth = new AmmoHealth(randomPosition.x, -50, 100, 50);
    newAmmoHealth.draw();

    // add the new ammo health instance to the list
    ammoHealthInstances.push(newAmmoHealth);
  };

  // spawn ammo healths in span of certain time
  setInterval(spawnAmmoHealth, 10000);

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

  // clear rebuilding of canvas elements
  const clearCanvasRects = () => {
    ctx.clearRect(0, 0, dimensions.canvasWidth, dimensions.canvasHeight);
  };

  // check for rectangular box collision between the main player and enemy cars

  const checkCollision = () => {
    randomcars.forEach((enemyCar) => {
      // main car bounding box
      const mainCarLeft = mainCar.point.x + 15;
      const mainCarRight = mainCar.point.x + mainCar.width - 15;
      const mainCarTop = mainCar.point.y + 20;
      const mainCarBottom = mainCar.point.y + mainCar.height - 20;

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
        // play the crash sound
        crashSound.play();

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

  // check for collision between the bullet and enemy cars

  const checkBulletCollision = () => {
    bullets.forEach((bullet, bulletIndex) => {
      const bulletLeft = bullet.x - bullet.radius;
      const bulletRight = bullet.x + bullet.radius;
      const bulletTop = bullet.y - bullet.radius;
      const bulletBottom = bullet.y + bullet.radius;

      randomcars.forEach((enemyCar) => {
        const enemyCarLeft = enemyCar.point.x;
        const enemyCarRight = enemyCar.point.x + enemyCar.width;
        const enemyCarTop = enemyCar.point.y;
        const enemyCarBottom = enemyCar.point.y + enemyCar.height;

        const isCollidingWithBullet =
          bulletRight > enemyCarLeft &&
          bulletLeft < enemyCarRight &&
          bulletBottom > enemyCarTop &&
          bulletTop < enemyCarBottom;

        if (isCollidingWithBullet) {
          bulletHitSound.play();

          let newRandomY = getRandomInt(-700, -100);

          enemyCar.point.y = newRandomY;
          enemyCar.image = randomObstacleImageGenerator();

          bullets.splice(bulletIndex, 1);
          // bulletDisplay.innerText = `Ammo: ${bullets.length}`;
        }
      });
    });
  };

  // check for collisions between player and ammo health

  const checkAmmoHealthCollision = () => {
    // iterate over each ammo health instance
    ammoHealthInstances.forEach((ammoHealth, ammoIndex) => {
      // calculate the bounding box of the ammo health
      const ammoLeft = ammoHealth.x;
      const ammoRight = ammoHealth.x + ammoHealth.width;
      const ammoTop = ammoHealth.y;
      const ammoBottom = ammoHealth.y + ammoHealth.height;

      // calculate the bounding box of the player's car
      const carLeft = mainCar.point.x;
      const carRight = mainCar.point.x + mainCar.width;
      const carTop = mainCar.point.y;
      const carBottom = mainCar.point.y + mainCar.height;

      // check for collision between the player's car and the ammo health
      const isCollidingWithCar =
        ammoRight > carLeft &&
        ammoLeft < carRight &&
        ammoBottom > carTop &&
        ammoTop < carBottom;

      if (isCollidingWithCar) {
        // play the sound for collecting ammo health
        bulletHitSound.play();

        // increase the bullet count when you collide with ammo-health. thus increasing the ammo count
        bulletCount += 5;
        bulletDisplay.innerText = `Ammo: ${bulletCount}`;

        // remove the collected ammo health from the array
        ammoHealthInstances.splice(ammoIndex, 1);
      }
    });
  };

  // move the bullets by looping through the list of bullets

  const moveBullets = () => {
    // loop through each bullet
    bullets.forEach((bullet, index) => {
      // move the bullet upwards
      bullet.draw();
      bullet.move();
      console.log("bullet", index);

      // check if the bullet is out of the canvas
      if (bullet.y < 0) {
        // Remove the bullet from the array
        bullets.splice(index, 1);
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
        `Your score is: ${score}`,
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
      carSpeed += 0.05; // increase speed by 0.05 every 30 points
    }

    // update the lane lines

    lines.forEach((theLine) => {
      theLine.start.y++;
      theLine.end.y++;

      theLine.draw();
      theLine.move();
    });

    ammoHealthInstances.forEach((ammoHealth, index) => {
      ammoHealth.draw();
      ammoHealth.move();

      if (ammoHealth.y > canvas.height) {
        ammoHealthInstances.splice(index, 1);
      }
    });

    // generate random cars
    randomcars.forEach((randomCar) => {
      randomCar.draw();
      randomCar.point.y += carSpeed;

      if (randomCar.point.y > dimensions.canvasHeight) {
        score += 1;
        scoreDisplay.innerText = `Score: ${score}`;

        let newRandomY = getRandomInt(-800, -100);

        // check if the new random car's y-coordinate is close to the other cars
        let closeToOtherCars = randomcars.some((otherCar) => {
          return (
            otherCar !== randomCar && // exclude the current random car from comparison
            Math.abs(newRandomY - otherCar.point.y) < 250 // check if distance is less than 250
          );
        });

        // if the new car is too close to the others, adjust its y-coordinate
        if (closeToOtherCars) {
          let maxY = Math.min(...randomcars.map((car) => car.point.y));
          newRandomY = maxY - 350; // adjust the y-coordinate to ensure a safe distance
        }

        randomCar.point.y = newRandomY;
        randomCar.image = randomObstacleImageGenerator();
      }
    });

    // draw the player car
    mainCar.draw();

    moveBullets();

    // check multiple collision detections
    checkCollision();
    checkBulletCollision();
    checkAmmoHealthCollision();

    requestAnimationFrame(animate);
  };

  animate();

  const restartGame = () => {
    console.log("restart the game");
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

    // reset ammo healths and ammos
    bulletCount = 5;
    bulletDisplay.innerText = `Ammo: ${bulletCount}`;
    ammoHealthInstances.length = 0;

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

    if (event.code === "Enter" && bulletCount > 0) {
      console.log("enter clicked");
      // create a new bullet instance
      const bullet = new Bullet(
        mainCar.point.x + mainCar.width / 2, // set bullet's x-coordinate to the center of the player car
        mainCar.point.y, // set bullet's y-coordinate to the top of the player car
        8, // set bullet's radius
        "yellow" // set bullet's color
      );
      // add the bullet to the bullets array
      bullets.push(bullet);

      // decrease bullet count
      bulletCount--;
      bulletDisplay.innerText = `Ammo: ${bulletCount}`;
    }
  });
};
