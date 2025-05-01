export class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyMaze();
        this.generateMazeDFS(1, 1);
    }

    createEmptyMaze() {
        return Array.from({ length: this.height }, () =>
            Array(this.width).fill(1)
        );
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    generateMazeDFS(x, y) {
        const dirs = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
        ];
        this.shuffle(dirs);
        this.grid[y][x] = 0;

        for (const { dx, dy } of dirs) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            if (
                ny > 0 &&
                ny < this.height - 1 &&
                nx > 0 &&
                nx < this.width - 1 &&
                this.grid[ny][nx] === 1
            ) {
                this.grid[y + dy][x + dx] = 0;
                this.generateMazeDFS(nx, ny);
            }
        }
    }

    isWalkable(x, y) {
        return this.grid[y]?.[x] === 0;
    }
}
