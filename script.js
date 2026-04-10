const board = document.querySelector(".board");
const startbuttoon = document.querySelector(".start-btn");
const modal = document.querySelector(".modal");
const startgamemodal = document.querySelector(".Start-btn");
const gameOverModal = document.querySelector(".game-over");
const restartbutton = document.querySelector(".restart-btn");
const highscoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const keybordshow = document.getElementById(".keybord");

const blockHeight = 30;
const blockWidth = 30;

let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00-00`;

highscoreElement.innerText = highscore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let Intervalid = null;
let timeIntervalid = null;

let food = randomFood();

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "down";

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
}

function render() {
  let head = null;

  const foodBlock = blocks[`${food.x}-${food.y}`];
  foodBlock.classList.add("food");

  if (!foodBlock.querySelector(".food-tail")) {
    const tail = document.createElement("div");
    tail.classList.add("food-tail");
    foodBlock.appendChild(tail);
  }

  if (direction === "left") head = { x: snake[0].x, y: snake[0].y - 1 };
  else if (direction === "right") head = { x: snake[0].x, y: snake[0].y + 1 };
  else if (direction === "down") head = { x: snake[0].x + 1, y: snake[0].y };
  else if (direction === "up") head = { x: snake[0].x - 1, y: snake[0].y };

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(Intervalid);
    clearInterval(timeIntervalid);

    modal.style.display = "flex";

    gameOverModal.style.display = "flex";

    startgamemodal.style.display = "none";

    return;
  }

  if (head.x == food.x && head.y == food.y) {
    const block = blocks[`${food.x}-${food.y}`];
    block.classList.remove("food");
    block.innerHTML = "";

    food = randomFood();

    snake.unshift(head);
    score++;
    scoreElement.innerText = score;

    if (score > highscore) {
      highscore = score;
      localStorage.setItem("highscore", highscore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove(
      "fill",
      "head",
      "tail",
      "up",
      "down",
      "left",
      "right",
    );
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x}-${segment.y}`];

    if (index === 0) {
      block.classList.add("head");
      block.classList.add(direction);
    } else if (index === snake.length - 1) {
      block.classList.add("tail");
    } else {
      block.classList.add("fill");
    }
  });
}

startbuttoon.addEventListener("click", () => {
  modal.style.display = "none";

  Intervalid = setInterval(render, 200);

  timeIntervalid = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    sec++;
    if (sec === 60) {
      min++;
      sec = 0;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

restartbutton.addEventListener("click", () => {
  clearInterval(Intervalid);
  clearInterval(timeIntervalid);

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove(
      "fill",
      "head",
      "tail",
      "up",
      "down",
      "left",
      "right",
    );
  });

  blocks[`${food.x}-${food.y}`].classList.remove("food");
  blocks[`${food.x}-${food.y}`].innerHTML = "";

  score = 0;
  time = `00-00`;

  scoreElement.innerText = score;
  timeElement.innerText = time;

  direction = "down";
  snake = [{ x: 1, y: 3 }];
  food = randomFood();

  modal.style.display = "none";

  Intervalid = setInterval(render, 100);

  timeIntervalid = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);
    sec++;
    if (sec === 60) {
      min++;
      sec = 0;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
  else if (event.key === "ArrowLeft" && direction !== "right")
    direction = "left";
  else if (event.key === "ArrowRight" && direction !== "left")
    direction = "right";
});
