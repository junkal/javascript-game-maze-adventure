import random
import pygame
import settings

class Maze:
    def __init__(self, width, height, assets):
        self.width  = width
        self.height = height
        self.assets = assets

        # Initialize the grid: 1 = wall everywhere
        self.grid = [[1 for _ in range(self.width)] for _ in range(self.height)]

        self.generate_maze()

        # Set up start and goal
        self.start_x, self.start_y = 1, 1
        self.goal_x, self.goal_y = self.width - 3, self.height - 3

        self.grid[self.start_y][self.start_x] = 0
        self.grid[self.goal_y][self.goal_x] = 0

        self.gate_img = self.assets.get_gate()

        # Compute offset to center maze
        total_pixel_w = self.width * settings.TILE_SIZE
        total_pixel_h = self.height * settings.TILE_SIZE
        self.offset_x = (settings.SCREEN_WIDTH - total_pixel_w) // 2
        avail_h = settings.SCREEN_HEIGHT - settings.HEADER_OFFSET
        self.offset_y = settings.HEADER_OFFSET + (avail_h - total_pixel_h) // 2

    def generate_maze(self):
        """Carve paths inside the grid while leaving a solid wall boundary."""
        stack = []
        start_x, start_y = 1, 1
        self.grid[start_y][start_x] = 0
        stack.append((start_x, start_y))

        directions = [(-2, 0), (2, 0), (0, -2), (0, 2)]

        while stack:
            x, y = stack[-1]
            random.shuffle(directions)

            carved = False
            for dx, dy in directions:
                nx, ny = x + dx, y + dy

                if 1 <= nx < self.width - 1 and 1 <= ny < self.height - 1:
                    if self.grid[ny][nx] == 1:
                        self.grid[ny][nx] = 0
                        self.grid[y + dy // 2][x + dx // 2] = 0
                        stack.append((nx, ny))
                        carved = True
                        break

            if not carved:
                stack.pop()

    def can_move(self, x, y):
        """Check if the player can move into (x, y)."""
        return (
            0 <= x < self.width and
            0 <= y < self.height and
            self.grid[y][x] == 0
        )

    def is_goal(self, x, y):
        """Check if (x, y) is the goal."""
        return x == self.goal_x and y == self.goal_y

    def get_start_position(self):
        """Return starting position."""
        return (self.start_x, self.start_y)

    def draw(self, surface):
        """Draw walls and the goal gate."""
        wall_color = (0, 0, 0)

        for y in range(0, self.height -1):
            for x in range(0, self.width -1):
                px = self.offset_x + x * settings.TILE_SIZE
                py = self.offset_y + y * settings.TILE_SIZE

                if self.is_goal(x, y):
                    gate_rect = self.gate_img.get_rect()
                    gate_rect.center = (
                        px + settings.TILE_SIZE // 2,
                        py + settings.TILE_SIZE // 2
                    )
                    surface.blit(self.gate_img, gate_rect)

                elif self.grid[y][x] == 1:
                    rect = pygame.Rect(px, py,
                                       settings.TILE_SIZE,
                                       settings.TILE_SIZE)
                    pygame.draw.rect(surface, wall_color, rect)