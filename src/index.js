const canvasElement = document.getElementById("game");
const context = canvasElement.getContext("2d");

const background = new Image();
background.src = "../public/assets/images/layout.png";

const foodImage = new Image();
foodImage.src = "../public/assets/images/food.png";

const unit = 32;
let totalScore = 0;

let foodPosition = {
  x: Math.floor(Math.random() * 57 + 1) * unit,
  y: Math.floor(Math.random() * 26 + 3) * unit,
};

let snakeBody = [];
snakeBody[0] = {
  x: 9 * unit,
  y: 10 * unit,
};

document.addEventListener("keydown", changeDirection);
let currentDirection;

function changeDirection(event) {
  if (event.keyCode === 37 && currentDirection !== "right")
    currentDirection = "left";
  else if (event.keyCode === 38 && currentDirection !== "down")
    currentDirection = "up";
  else if (event.keyCode === 39 && currentDirection !== "left")
    currentDirection = "right";
  else if (event.keyCode === 40 && currentDirection !== "up")
    currentDirection = "down";
}

function checkCollision(head, array) {
  array.forEach((segment) => {
    if (head.x === segment.x && head.y === segment.y)
      clearInterval(gameInterval);
  });
}

function renderGame() {
  context.drawImage(background, 0, 0);
  context.drawImage(foodImage, foodPosition.x, foodPosition.y);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillStyle = i === 0 ? "green" : "red";
    context.fillRect(snakeBody[i].x, snakeBody[i].y, unit, unit);
  }

  context.fillStyle = "white";
  context.font = "50px Arial";
  context.fillText(totalScore, unit * 2.5, unit * 1.7);

  let snakeX = snakeBody[0].x;
  let snakeY = snakeBody[0].y;

  if (snakeX === foodPosition.x && snakeY === foodPosition.y) {
    totalScore++;
    foodPosition = {
      x: Math.floor(Math.random() * 30 + 1) * unit,
      y: Math.floor(Math.random() * 30 + 3) * unit,
    };
  } else {
    snakeBody.pop();
  }

  if (
    snakeX < unit ||
    snakeX > unit * 57 ||
    snakeY < 3 * unit ||
    snakeY > unit * 28
  ) {
    clearInterval(gameInterval);
  }

  if (currentDirection === "left") snakeX -= unit;
  if (currentDirection === "right") snakeX += unit;
  if (currentDirection === "up") snakeY -= unit;
  if (currentDirection === "down") snakeY += unit;

  let newHead = { x: snakeX, y: snakeY };

  checkCollision(newHead, snakeBody);

  snakeBody.unshift(newHead);
}

let gameInterval = setInterval(renderGame, 100);
