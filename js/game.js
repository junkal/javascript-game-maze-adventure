import { Maze } from './maze.js';
import { Player } from './player.js';
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

        // Load background image
        this.bgImage = new Image();
        this.bgImage.src = 'assets/background.png';
        this.bgImageLoaded = false;
        this.bgImage.onload = () => {
            this.bgImageLoaded = true;
            this.draw();
        };

        // Load player sprite
        this.playerImage = new Image();
        this.playerImage.src = 'assets/knight.png';
        this.playerImageLoaded = false;
        this.playerImage.onload = () => {
            this.playerImageLoaded = true;
            this.draw();
        };

        // Load goal sprite
        this.goalImage = new Image();
        this.goalImage.src = 'assets/gate.png';
        this.goalImageLoaded = false;
        this.goalImage.onload = () => {
            this.goalImageLoaded = true;
            this.draw();
        };

        this.remainingTime = CONFIG.timeLimit;
        this.lastTimeUpdate = Date.now();
        this.gameOver = false;

        const timerDisplay = document.getElementById("timer");
        if (timerDisplay) {
          timerDisplay.textContent = `Time Left: ${CONFIG.timeLimit}s`;
        }        
        // this.handleInput();
        requestAnimationFrame(() => this.loop());
    }
    
    loop() {
        if (!this.gameOver) {
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

        this.draw();
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

    draw() {
        if (this.bgImageLoaded) {
            const pattern = this.ctx.createPattern(this.bgImage, 'repeat');
            this.ctx.fillStyle = pattern;
        } else {
            this.ctx.fillStyle = "#f0f0f0";
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawMaze();
        this.drawGoal();
        this.drawPlayer();

    }

    drawMaze() {
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                if (this.maze.grid[y][x] === 1) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    }

    drawGoal() {
        const { x, y } = this.goal;
    
        if (this.goalImageLoaded) {
            const scale = 2;
            const size = this.tileSize * scale;
            const offset = (size - this.tileSize) / 2;
    
            this.ctx.drawImage(
                this.goalImage,
                x * this.tileSize - offset,
                y * this.tileSize - offset,
                size,
                size
            );
        } else {
            // fallback green square
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(
                x * this.tileSize + 4,
                y * this.tileSize + 4,
                this.tileSize - 8,
                this.tileSize - 8
            );
        }
    }

    drawPlayer() {
        const { x, y } = this.player;

        if (this.playerImageLoaded) {
            const scale = 2;
            const size = this.tileSize * scale;
            const offset = (size - this.tileSize) / 2;
            this.ctx.drawImage(
                this.playerImage,
                x * this.tileSize - offset,
                y * this.tileSize - offset,
                size,
                size
            ); 
        } else {
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(
                x * this.tileSize,
                y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        }
    }
}
