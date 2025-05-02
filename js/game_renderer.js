export class GameRenderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
        this.canvas = game.canvas;

        this.bgImageLoaded = false;
        this.playerImageLoaded = false;
        this.goalImageLoaded = false;

        this.bgImage = new Image();
        this.bgImage.src = 'assets/background.png';
        this.bgImage.onload = () => { this.bgImageLoaded = true; };

        this.playerImage = new Image();
        this.playerImage.src = 'assets/knight.png';
        this.playerImage.onload = () => { this.playerImageLoaded = true; };

        this.goalImage = new Image();
        this.goalImage.src = 'assets/gate.png';
        this.goalImage.onload = () => { this.goalImageLoaded = true; };
    }

    draw() {
        this.drawBackground();
        this.drawMaze();
        this.drawGoal();
        this.drawPlayer();

        if (this.game.paused && !this.game.gameOver) {
            this.drawPauseOverlay();
        }
    }

    drawBackground() {
        if (this.bgImageLoaded) {
            const pattern = this.ctx.createPattern(this.bgImage, 'repeat');
            this.ctx.fillStyle = pattern;
        } else {
            this.ctx.fillStyle = "#f0f0f0";
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawMaze() {
        const tileSize = this.game.tileSize;
        const maze = this.game.maze;

        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                if (maze.grid[y][x] === 1) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                }
            }
        }
    }

    drawGoal() {
        const { x, y } = this.game.goal;
        const tileSize = this.game.tileSize;

        if (this.goalImageLoaded) {
            const scale = 2;
            const size = tileSize * scale;
            const offset = (size - tileSize) / 2;

            this.ctx.drawImage(
                this.goalImage,
                x * tileSize - offset,
                y * tileSize - offset,
                size,
                size
            );
        } else {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(
                x * tileSize + 4,
                y * tileSize + 4,
                tileSize - 8,
                tileSize - 8
            );
        }
    }

    drawPlayer() {
        const { x, y } = this.game.player;
        const tileSize = this.game.tileSize;

        if (this.playerImageLoaded) {
            const scale = 2;
            const size = tileSize * scale;
            const offset = (size - tileSize) / 2;

            this.ctx.drawImage(
                this.playerImage,
                x * tileSize - offset,
                y * tileSize - offset,
                size,
                size
            );
        } else {
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(
                x * tileSize,
                y * tileSize,
                tileSize,
                tileSize
            );
        }
    }

    drawPauseOverlay() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("⏸ Paused", this.canvas.width / 2, this.canvas.height / 2);
    }
}