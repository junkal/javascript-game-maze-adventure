import { Game } from './game.js';
import { CONFIG } from './config.js';
import { EventHandler } from './event_handler.js';
import { AssetManager } from './asset_manager.js';

let game = null;
let eventHandler = new EventHandler(null);
window.gameStarted = false;

const assetList = [
    { name: "cover", type: "image", src: "assets/cover.png" },
    { name: "bg", type: "image", src: "assets/background.png" },
    { name: "player", type: "image", src: "assets/knight.png" },
    { name: "goal", type: "image", src: "assets/gate.png" },
    { name: "win-sfx", type: "audio", src: "assets/victory.ogg" },
    { name: "gameover-sfx", type: "audio", src: "assets/gameover.ogg" },
    { name: "bg-music", type: "audio", src: "assets/background_music.ogg" }
];

const assetManager = new AssetManager(assetList);

// Callback to run once all assets are loaded
assetManager.onReady(() => {
    const coverImg = document.getElementById("start-overlay");
    if (coverImg) {
        coverImg.src = assetManager.get("cover").src;
    }

    document.getElementById("start-overlay").style.display = "block";
});

// Start game when called (typically via Enter key)
window.startGame = function () {
    const gameOverOverlay = document.getElementById("game-over-overlay");
    if (gameOverOverlay) gameOverOverlay.style.display = "none";

    const startOverlay = document.getElementById("start-overlay");
    if (startOverlay) startOverlay.style.display = "none";

    const timerDisplay = document.getElementById("timer");
    if (timerDisplay) {
        timerDisplay.textContent = `Time Left: ${CONFIG.timeLimit}s`;
    }

    game = new Game("gameCanvas", CONFIG.tileSize, CONFIG.mazeWidth, CONFIG.mazeHeight, assetManager);
    eventHandler.game = game;
    window.gameStarted = true;

    const bgMusic = assetManager.get("bg-music");
    if (bgMusic && bgMusic.paused) {
        bgMusic.loop = true;
        bgMusic.volume = 0.5;
        bgMusic.play().catch(() => {});
    }

    requestAnimationFrame(loop);
};

// Main game loop: handles input and triggers rendering
function loop() {
    eventHandler?.update();
    game?.renderer?.draw();
    requestAnimationFrame(loop);
}