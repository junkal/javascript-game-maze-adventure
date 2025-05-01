import { CONFIG } from './config.js';

export class Player {
    constructor(x, y) {
        this.gridX = x;
        this.gridY = y;
        this.x = x;
        this.y = y;
        this.speed = CONFIG.playerSpeed; // 0.1–0.3 = smooth animation
    }

    move(dx, dy, maze) {
        const newX = this.gridX + dx;
        const newY = this.gridY + dy;
        if (maze.isWalkable(newX, newY)) {
            this.gridX = newX;
            this.gridY = newY;
        }
    }

    update() {
        // Smoothly animate position toward gridX/gridY
        this.x += (this.gridX - this.x) * this.speed;
        this.y += (this.gridY - this.y) * this.speed;
    }
}