// import enemy-assets
import enemyCar from "../assets/sprites/enemy-car.png";
import enemyCar1 from "../assets/sprites/enemy-car-1.png";
import enemyCar2 from "../assets/sprites/enemy-car-2.png";
import enemyCar3 from "../assets/sprites/enemy-car-3.png";
import enemyCar4 from "../assets/sprites/enemy-car-4.png";

// random number generator

export const getRandomInt: (min: number, max: number) => number = (
  min: number,
  max: number
) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// retrive highscore
export const getHighScore = (): number => {
  const storedHighScore = localStorage.getItem("highScore");
  if (storedHighScore !== null) {
    return parseInt(storedHighScore);
  } else {
    return 0; // If there's no stored high score yet
  }
};

// set high score
export const updateHighScore = (newHighScore: number): void => {
  localStorage.setItem("highScore", newHighScore.toString());
};

// generate random enemies
export const randomObstacleImageGenerator = () => {
  const obstacles = [enemyCar, enemyCar1, enemyCar2, enemyCar3, enemyCar4];
  const obstacleImages = obstacles.map((obstacle) => {
    let image = new Image();
    image.src = obstacle;
    return image;
  });
  let randIndex = Math.floor(Math.random() * obstacles.length);
  return obstacleImages[randIndex];
};
