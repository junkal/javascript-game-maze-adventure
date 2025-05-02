import { Maze } from './maze.js';
import { Player } from './player.js';
import { GameRenderer } from './game_renderer.js';
import { CONFIG } from './config.js';

/**
 * Game
 * ----
 * Manages core game logic, including initialization, player state, win/loss conditions,
 * countdown timer, pause handling, and coordination with the GameRenderer for drawing.
 */
export class Game {
    /**
     * Initializes a new Game instance.
     * Sets up canvas, maze, player, goal, and starts the render loop.
     * 
     * @param {string} canvasId - The ID of the canvas element to render into
     * @param {number} tileSize - Size of each tile in pixels
     * @param {number} width - Maze width in tiles
     * @param {number} height - Maze height in tiles
     */
    constructor(canvasId, tileSize = CONFIG.tileSize, width = CONFIG.mazeWidth, height = CONFIG.mazeHeight) {
        // Setup canvas
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tileSize = tileSize;

        this.canvas.width = tileSize * width;
        this.canvas.height = tileSize * height;

        // Game state
        this.maze = new Maze(width, height);
        this.player = new Player(1, 1);
        this.goal = { x: width - 2, y: height - 2 };
        this.readyToRestart = false;

        // Timer setup
        this.remainingTime = CONFIG.timeLimit;
        this.lastTimeUpdate = Date.now();
        this.gameOver = false;
        this.paused = false;

        // Initialize timer display
        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
            timerDisplay.textContent = `Time Left: ${CONFIG.timeLimit}s`;
        }

        // Instantiate the renderer and begin the game loop
        this.renderer = new GameRenderer(this);
        requestAnimationFrame(() => this.loop());
    }

    /**
     * The main game loop, called once per frame.
     * Handles logic updates, rendering, and win detection.
     */
    loop() {
        if (!this.gameOver && !this.paused) {
            this.updateTimer();
            this.player.update();

            // Win condition check
            if (this.player.gridX === this.goal.x && this.player.gridY === this.goal.y) {
                this.gameOver = true;
                this.readyToRestart = true;

                const overlay = document.getElementById("game-over-overlay");
                if (overlay) {
                    overlay.innerHTML = `
                        🎉 You Win!<br>
                        Maze Completed<br><br>
                        <div class="restart-prompt">Press Enter to Continue</div>
                    `;
                    overlay.style.display = "block";
                }

                const sfx = document.getElementById("win-sfx");
                if (sfx) sfx.play().catch(() => {});
            }
        }

        this.renderer.draw();
        requestAnimationFrame(() => this.loop());
    }

    /**
     * Updates the countdown timer every second.
     * Triggers game over and UI if time runs out.
     */
    updateTimer() {
        const now = Date.now();
        const delta = now - this.lastTimeUpdate;

        if (delta >= 1000) {
            this.remainingTime--;
            this.lastTimeUpdate = now;

            const timerDisplay = document.getElementById("timer");
            if (timerDisplay) {
                timerDisplay.textContent = `Time Left: ${this.remainingTime}s`;
            }

            if (this.remainingTime <= 0) {
                this.remainingTime = 0;
                this.gameOver = true;

                const overlay = document.getElementById("game-over-overlay");
                if (overlay) {
                    overlay.innerHTML = "⏰ Time’s Up<br>Game Over!";
                    overlay.style.display = "block";
                }

                const sfx = document.getElementById("gameover-sfx");
                if (sfx) sfx.play().catch(() => {});
            }
        }
    }

    /**
     * Toggles the paused state of the game.
     * Has no effect if the game is over.
     */
    togglePause() {
        if (!this.gameOver) {
            this.paused = !this.paused;
        }
    }
}