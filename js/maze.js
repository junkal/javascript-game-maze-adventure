/**
 * Maze
 * ----
 * Represents a 2D maze grid and provides methods for generation and collision detection.
 * Maze generation is done using a randomized Depth-First Search (DFS) algorithm.
 */
export class Maze {
    /**
     * Constructs a Maze of given width and height.
     * Automatically generates a maze with walls (1) and paths (0).
     * 
     * @param {number} width - Number of columns in the maze
     * @param {number} height - Number of rows in the maze
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyMaze();      // Initialize a grid full of walls
        this.generateMazeDFS(1, 1);              // Start maze generation at (1,1)
    }

    /**
     * Creates a 2D grid where all cells are initially walls (value 1).
     * 
     * @returns {number[][]} - A 2D array filled with 1s
     */
    createEmptyMaze() {
        return Array.from({ length: this.height }, () =>
            Array(this.width).fill(1)
        );
    }

    /**
     * Shuffles an array in-place using the Fisher-Yates algorithm.
     * 
     * @param {Array} array - The array to shuffle
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Generates the maze using a recursive depth-first search (DFS) algorithm.
     * Carves paths by visiting new cells and knocking down walls between them.
     * 
     * @param {number} x - Current x position in the grid
     * @param {number} y - Current y position in the grid
     */
    generateMazeDFS(x, y) {
        // Direction vectors for N, E, S, W
        const dirs = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
        ];

        this.shuffle(dirs);       // Randomize direction order
        this.grid[y][x] = 0;      // Mark current cell as path

        for (const { dx, dy } of dirs) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;

            // Check bounds and whether the target cell is still a wall
            if (
                ny > 0 &&
                ny < this.height - 1 &&
                nx > 0 &&
                nx < this.width - 1 &&
                this.grid[ny][nx] === 1
            ) {
                // Carve a path through the wall between (x, y) and (nx, ny)
                this.grid[y + dy][x + dx] = 0;
                this.generateMazeDFS(nx, ny); // Recurse into new cell
            }
        }
    }

    /**
     * Determines if the given cell is walkable (i.e., a path).
     * 
     * @param {number} x - Column index
     * @param {number} y - Row index
     * @returns {boolean} - True if the cell is a path (0), false if wall or out of bounds
     */
    isWalkable(x, y) {
        return this.grid[y]?.[x] === 0;
    }
}