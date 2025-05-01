import { Game } from './game.js';
import { CONFIG } from './config.js';

let gameStarted = false;

const startGame = () => {
  if (gameStarted) return;
  gameStarted = true;

  // Hide cover screen
  const overlay = document.getElementById("start-overlay");
  if (overlay) overlay.style.display = "none";

  // Create the game
  const game = new Game("gameCanvas", CONFIG.tileSize, CONFIG.mazeWidth, CONFIG.mazeHeight);

  // Start music if possible
  const music = document.getElementById("bg-music");
  if (music && music.paused) {
    music.volume = 1.0;
    music.play().catch(() => {});
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startGame();
  }
}, { once: true });