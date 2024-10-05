const canvasElement = document.getElementById("game");
const context = canvasElement.getContext("2d");

const background = new Image();
background.src = "layout.png";

const foodImage = new Image();
foodImage.src = "rss-logo.svg";

const unit = 32;
const goal = 5;
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
    if (head.x === segment.x && head.y === segment.y) finishGame();
  });
}

function renderGame() {
  context.drawImage(background, 0, 0);
  context.drawImage(foodImage, 45, 20, 32, 32);
  context.drawImage(foodImage, foodPosition.x, foodPosition.y, 32, 32);

  for (let i = 0; i < snakeBody.length; i++) {
    context.fillStyle = i === 0 ? "yellow" : "red";
    context.fillRect(snakeBody[i].x, snakeBody[i].y, unit, unit);
  }

  context.fillStyle = "white";
  context.font = "50px Arial";
  context.fillText(totalScore, unit * 2.5, unit * 1.7);
  context.fillText(
    `Goal: ${goal - totalScore > 0 ? goal - totalScore : "You already win"}`,
    unit * 36.5,
    unit * 1.7
  );

  let snakeX = snakeBody[0].x;
  let snakeY = snakeBody[0].y;

  if (snakeX === foodPosition.x && snakeY === foodPosition.y) {
    totalScore++;
    beep(50, 0.05);
    foodPosition = {
      x: Math.floor(Math.random() * 57 + 1) * unit,
      y: Math.floor(Math.random() * 26 + 3) * unit,
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
    finishGame();
  }

  if (currentDirection === "left") snakeX -= unit;
  if (currentDirection === "right") snakeX += unit;
  if (currentDirection === "up") snakeY -= unit;
  if (currentDirection === "down") snakeY += unit;

  let newHead = { x: snakeX, y: snakeY };

  checkCollision(newHead, snakeBody);

  snakeBody.unshift(newHead);
}

function finishGame() {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  highScores.push(totalScore);

  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 10);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  clearInterval(gameInterval);
  context.fillStyle = "black";
  context.font = "150px Arial";
  context.fillText(
    `You ${totalScore >= goal ? "win" : "lost"}! Score: ${totalScore}`,
    200,
    400
  );

  context.fillStyle = "white";
  context.fillRect(450, 550, 320, 370);
  context.fillStyle = "black";
  context.font = "25px Arial";
  context.fillText("Top 10 Scores:", 500, 600);

  highScores.forEach((score, index) => {
    context.fillText(`${index + 1}. ${score}`, 500, 632 + index * 32);
  });
}

function beep(f, d) {
  var volume = 10000,
    u1 = -volume,
    u2 = volume,
    u = u1,
    samples = [],
    titlestring = decodeURIComponent(
      escape(
        window.atob("UklGRgAAAABXQVZFZm10IBAAAAABAAIARMKsAAAQwrECAAQAEABkYXRh")
      )
    ),
    title = [];
  for (i = 0; i < titlestring.length; i++) title[i] = titlestring.charCodeAt(i);
  for (i = 0; i < d * 44100; i++) {
    u += f;
    if (u > u2) u = u1;
    samples[i] = u;
  }
  var outbuffer = new Int16Array(title.length / 2 + samples.length * 2);
  for (i = 0; i < title.length; i += 2)
    outbuffer[i / 2] = title[i] + title[i + 1] * 256;
  for (i = 0; i < samples.length * 2; i++)
    outbuffer[i * 2 + 44] = outbuffer[i * 2 + 45] = samples[i];
  var audio = new Audio(URL.createObjectURL(new Blob([outbuffer])));
  audio.play();
}

let gameInterval = setInterval(renderGame, 100);
