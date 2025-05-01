import { Game } from './game.js';
import { CONFIG } from './config.js';

let game = null;
let gameStarted = false;

let heldKey = null;
let moveCooldown = 0;

function startGame() {
  // Reset overlays
  const gameOverOverlay = document.getElementById("game-over-overlay");
  if (gameOverOverlay) gameOverOverlay.style.display = "none";

  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) {
    timerDisplay.textContent = `Time Left: ${CONFIG.timeLimit}s`;
  }

  const startOverlay = document.getElementById("start-overlay");
  if (startOverlay) startOverlay.style.display = "none";

  game = new Game("gameCanvas", CONFIG.tileSize, CONFIG.mazeWidth, CONFIG.mazeHeight);
  gameStarted = true;

  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 1.0;
    bgMusic.play().catch(() => {});
  }

  requestAnimationFrame(loop);
}

function loop() {
  if (!game) return;

  // Process movement
  if (heldKey && !game.gameOver) {
    const keyMap = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };

    const move = keyMap[heldKey];
    if (move && moveCooldown === 0) {
      game.player.move(move[0], move[1], game.maze);
      moveCooldown = CONFIG.moveCooldownFrames;
    }

    if (moveCooldown > 0) moveCooldown--;
  }

  game.draw();
  requestAnimationFrame(loop);
}

// Input handlers
document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    heldKey = e.key;
  }

  if (e.key === "Enter") {
    if (!gameStarted || (game && game.gameOver && !game.readyToRestart)) {
        startGame();
      }

    if (game && game.readyToRestart) {
        game.readyToRestart = false;
      
        const overlay = document.getElementById("game-over-overlay");
        if (overlay) overlay.innerHTML = `<div class="restart-prompt">🔄 Restarting level...</div>`;
      
        setTimeout(() => {
          startGame();
        }, 2000);
      }    
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === heldKey) {
    heldKey = null;
    moveCooldown = 0;
  }
});