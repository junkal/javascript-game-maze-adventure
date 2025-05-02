import pygame
import settings

class Player:
    def __init__(self, maze, assets):
        self.maze = maze
        self.assets = assets
        self.grid_x, self.grid_y = self.maze.get_start_position()
        self.pixel_x = self.grid_x * settings.TILE_SIZE
        self.pixel_y = self.grid_y * settings.TILE_SIZE + settings.HEADER_OFFSET

        self.idle_frame = self.assets.get_knight()
        self.current_frame = 0
        self.last_anim = pygame.time.get_ticks()
        self.anim_speed = 150

        self.image = self.idle_frame
        self.move_speed = settings.PLAYER_SPEED
        self.target_x = self.pixel_x
        self.target_y = self.pixel_y
        self.moving = False
        self.move_dir = (0,0)
        self.held_keys = set()

    def handle_input(self, events):
        for e in events:
            if e.type == pygame.KEYDOWN:
                self.held_keys.add(e.key)
            if e.type == pygame.KEYUP and e.key in self.held_keys:
                self.held_keys.remove(e.key)

    def update(self):
        if not self.moving:
            self.check_and_start()
        self.move()

    def check_and_start(self):
        dx = dy = 0
        if pygame.K_LEFT in self.held_keys: dx = -1
        elif pygame.K_RIGHT in self.held_keys: dx = 1
        elif pygame.K_UP in self.held_keys: dy = -1
        elif pygame.K_DOWN in self.held_keys: dy = 1

        if dx or dy:
            nx, ny = self.grid_x + dx, self.grid_y + dy
            if self.maze.can_move(nx, ny):
                self.moving = True
                self.move_dir = (dx, dy)
                self.target_x = self.pixel_x + dx * settings.TILE_SIZE
                self.target_y = self.pixel_y + dy * settings.TILE_SIZE
                self.assets.get_footstep().play()

    def move(self):
        if not self.moving: return
        dx, dy = self.move_dir
        step = self.move_speed
        if dx:
            if (dx > 0 and self.pixel_x + step >= self.target_x) or (dx < 0 and self.pixel_x - step <= self.target_x):
                self.pixel_x = self.target_x
            else:
                self.pixel_x += dx * step
        if dy:
            if (dy > 0 and self.pixel_y + step >= self.target_y) or (dy < 0 and self.pixel_y - step <= self.target_y):
                self.pixel_y = self.target_y
            else:
                self.pixel_y += dy * step
        if self.pixel_x == self.target_x and self.pixel_y == self.target_y:
            self.moving = False
            self.grid_x += dx
            self.grid_y += dy

    def draw(self, surface):
        rect = self.image.get_rect()
        rect.center = (self.pixel_x + settings.TILE_SIZE//2, self.pixel_y + settings.TILE_SIZE//2)
        surface.blit(self.image, rect)

    def at_goal(self):
        return self.maze.is_goal(self.grid_x, self.grid_y)
