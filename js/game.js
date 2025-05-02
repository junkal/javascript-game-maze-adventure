import { Maze } from './maze.js';
import { Player } from './player.js';
import { GameRenderer } from './game_renderer.js';
import { CONFIG } from './config.js';

export class Game {
    constructor(canvasId, tileSize = CONFIG.tileSize, width = CONFIG.mazeWidth, height = CONFIG.mazeHeight) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tileSize = tileSize;

        this.canvas.width = tileSize * width;
        this.canvas.height = tileSize * height;

        this.maze = new Maze(width, height);
        this.player = new Player(1, 1);
        this.goal = { x: width - 2, y: height - 2 };
        this.readyToRestart = false;

        this.remainingTime = CONFIG.timeLimit;
        this.lastTimeUpdate = Date.now();
        this.gameOver = false;
        this.paused = false;

        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
          timerDisplay.textContent = `Time Left: ${CONFIG.timeLimit}s`;
        }        

        this.renderer = new GameRenderer(this);

        requestAnimationFrame(() => this.loop());
    }
    
    loop() {
        if (!this.gameOver && !this.paused) {
            this.updateTimer();
            this.player.update();

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
    
    togglePause() {
        if (!this.gameOver) {
            this.paused = !this.paused;
        }
    }
}
