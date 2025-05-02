/**
 * GameRenderer
 * ------------
 * Responsible for rendering all visual elements of the game using the Canvas API.
 * This includes the background, maze layout, player sprite, goal image, and pause overlay.
 * All rendering is delegated here to keep game logic and visuals cleanly separated.
 */
export class GameRenderer {
    /**
     * Constructs a new GameRenderer tied to the provided game instance.
     * Sets up image loading for background, player, and goal.
     * 
     * @param {Game} game - Reference to the main game instance
     */    
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

    /**
     * The main draw method called every frame.
     * Draws background, maze, goal, player, and pause overlay if applicable.
     */    
    draw() {
        this.drawBackground();
        this.drawMaze();
        this.drawGoal();
        this.drawPlayer();

        if (this.game.paused && !this.game.gameOver) {
            this.drawPauseOverlay();
        }
    }

    /**
     * Draws the canvas background using a repeating image pattern,
     * or a fallback color if the image isn't loaded yet.
     */    
    drawBackground() {
        if (this.bgImageLoaded) {
            const pattern = this.ctx.createPattern(this.bgImage, 'repeat');
            this.ctx.fillStyle = pattern;
        } else {
            this.ctx.fillStyle = "#f0f0f0";
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the maze walls using solid black rectangles for each wall cell.
     */    
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

    /**
     * Draws the goal image at its grid position.
     * If the image is not loaded, draws a green placeholder square.
     */    
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

    /**
     * Draws the player sprite at its interpolated (animated) position.
     * If the image is not loaded, draws a blue square.
     */    
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


    /**
     * Displays a translucent "⏸ Paused" overlay when the game is paused.
     */    
    drawPauseOverlay() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "48px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("⏸ Paused", this.canvas.width / 2, this.canvas.height / 2);
    }
}