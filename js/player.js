export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dx, dy, maze) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (maze.isWalkable(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }
    }
}
