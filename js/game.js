import { Maze } from './maze.js';
import { Player } from './player.js';

export class Game {
    constructor(canvasId, tileSize = 40, width = 10, height = 10) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tileSize = tileSize;

        // Dynamically set canvas size
        this.canvas.width = tileSize * width;
        this.canvas.height = tileSize * height;

        this.maze = new Maze(width, height);
        this.player = new Player(1, 1);
        this.goal = { x: width - 2, y: height - 2 };

        this.handleInput();
        this.draw();
    }

    handleInput() {
        document.addEventListener("keydown", (e) => {
            const keyMap = {
                ArrowUp: [0, -1],
                ArrowDown: [0, 1],
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
            };

            const move = keyMap[e.key];
            if (move) {
                this.player.move(move[0], move[1], this.maze);
                this.draw();

                if (this.player.x === this.goal.x && this.player.y === this.goal.y) {
                    setTimeout(() => alert("You reached the goal!"), 10);
                }
            }
        });
    }

    draw() {
        const wallPadding = this.tileSize * 0; // how much to inset walls
    
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                const isWall = this.maze.grid[y][x] === 1;
    
                if (isWall) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(
                        x * this.tileSize + wallPadding,
                        y * this.tileSize + wallPadding,
                        this.tileSize - 2 * wallPadding,
                        this.tileSize - 2 * wallPadding
                    );
                } else {
                    // Draw full tile for path
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    
        // Draw goal
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(
            this.goal.x * this.tileSize,
            this.goal.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );
    
        // Draw player
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(
            this.player.x * this.tileSize,
            this.player.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );
    }
}