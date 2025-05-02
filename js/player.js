import { CONFIG } from './config.js';

/**
 * Player
 * ------
 * Represents the player character in the game.
 * Manages position, movement, and smooth animation.
 */
export class Player {
    /**
     * Initializes a player at the specified grid location.
     * 
     * @param {number} x - Starting column position on the grid
     * @param {number} y - Starting row position on the grid
     */
    constructor(x, y) {
        // Grid-based position (used for game logic and collisions)
        this.gridX = x;
        this.gridY = y;

        // Actual position (used for rendering with smooth animation)
        this.x = x;
        this.y = y;

        // Speed factor for smooth movement interpolation
        this.speed = CONFIG.playerSpeed;
    }

    /**
     * Attempts to move the player in the specified direction.
     * Only updates grid coordinates if the destination is walkable.
     * 
     * @param {number} dx - Change in x direction (e.g., -1, 0, 1)
     * @param {number} dy - Change in y direction (e.g., -1, 0, 1)
     * @param {Maze} maze - The Maze instance for walkability checks
     */
    move(dx, dy, maze) {
        const newX = this.gridX + dx;
        const newY = this.gridY + dy;

        // Only move if the target cell is a valid path
        if (maze.isWalkable(newX, newY)) {
            this.gridX = newX;
            this.gridY = newY;
        }
    }

    /**
     * Smoothly interpolates the actual position (`x`, `y`) toward the grid position.
     * Called every frame to create fluid movement animations.
     */
    update() {
        this.x += (this.gridX - this.x) * this.speed;
        this.y += (this.gridY - this.y) * this.speed;
    }
}