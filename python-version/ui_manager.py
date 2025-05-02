import pygame
import settings

class UIManager:
    def __init__(self, assets):
        self.assets = assets
        self.text_font = pygame.font.SysFont(None, 36)
        self.big_font = pygame.font.SysFont(None, 80)

        # Load cover image
        raw_cover = pygame.image.load(settings.COVER_IMAGE_PATH).convert()
        raw_width, raw_height = raw_cover.get_size()

        # Calculate scaling factor to fit screen
        scale_x = settings.SCREEN_WIDTH / raw_width
        scale_y = settings.SCREEN_HEIGHT / raw_height
        scale_factor = min(scale_x, scale_y)  # Fit to smaller dimension

        new_width = int(raw_width * scale_factor)
        new_height = int(raw_height * scale_factor)

        self.cover_image = pygame.transform.scale(raw_cover, (new_width, new_height))
        self.cover_rect = self.cover_image.get_rect()
        self.cover_rect.center = (settings.SCREEN_WIDTH // 2, settings.SCREEN_HEIGHT // 2)

        # Background tile (for gameplay)
        self.background_tile = pygame.image.load(settings.BACKGROUND_IMAGE_PATH).convert()
        self.background_tile = pygame.transform.scale(self.background_tile, (64, 64))

    def draw_background(self, surface):
        for x in range(0, settings.SCREEN_WIDTH, 64):
            for y in range(0, settings.SCREEN_HEIGHT, 64):
                surface.blit(self.background_tile, (x, y))

    def draw_main_menu(self, surface):
        surface.fill((0, 0, 0))
        surface.blit(self.cover_image, self.cover_rect.topleft)
        title_surface = self.big_font.render("Maze Adventure", True, (255, 255, 255))
        instruction_surface = self.text_font.render("Press ENTER to Start", True, (255, 255, 255))

        title_rect = title_surface.get_rect(center=(settings.SCREEN_WIDTH // 2, settings.SCREEN_HEIGHT // 2 - 100))
        instruction_rect = instruction_surface.get_rect(center=(settings.SCREEN_WIDTH // 2, settings.SCREEN_HEIGHT // 2 + 150))

        surface.blit(title_surface, title_rect)
        surface.blit(instruction_surface, instruction_rect)

    def draw_timer(self, surface, elapsed_time):
        remaining_time = max(0, int(settings.COUNTDOWN_TIME - elapsed_time))

        minutes = remaining_time // 60
        seconds = remaining_time % 60
        time_text = f"Count Down: {minutes:02}:{seconds:02}"

        timer_surface = self.text_font.render(time_text, True, (0, 0, 0))
        screen_rect = surface.get_rect()
        text_rect = timer_surface.get_rect(midtop=(screen_rect.centerx, 10))

        padding = 10
        background_rect = pygame.Rect(
            text_rect.left - padding,
            text_rect.top - padding // 2,
            text_rect.width + padding * 2,
            text_rect.height + padding
        )
        pygame.draw.rect(surface, (220, 220, 220), background_rect, border_radius=8)
        surface.blit(timer_surface, text_rect)

    def draw_hint(self, surface):
        hint_surface = self.text_font.render("Press P to Pause", True, settings.WHITE)
        surface.blit(hint_surface, (10, settings.SCREEN_HEIGHT - 25))

    def draw_pause_screen(self, surface):
        pause_surface = self.big_font.render("Paused", True, (0, 0, 0))
        instruction_surface = self.text_font.render("Press P to Resume", True, (0, 0, 0))

        screen_rect = surface.get_rect()
        pause_rect = pause_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery - 30))
        instruction_rect = instruction_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery + 40))

        surface.blit(pause_surface, pause_rect)
        surface.blit(instruction_surface, instruction_rect)

    def draw_win_screen(self, surface):
        win_surface = self.big_font.render("You Win!", True, (0, 200, 0))
        instruction_surface = self.text_font.render("Press ENTER to Restart", True, (0, 0, 0))

        screen_rect = surface.get_rect()
        win_rect = win_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery - 30))
        instruction_rect = instruction_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery + 40))

        surface.blit(win_surface, win_rect)
        surface.blit(instruction_surface, instruction_rect)

    def draw_game_over_screen(self, surface):
        game_over_surface = self.big_font.render("Game Over", True, (200, 0, 0))
        instruction_surface = self.text_font.render("Press ENTER to Retry", True, (0, 0, 0))

        screen_rect = surface.get_rect()
        game_over_rect = game_over_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery - 30))
        instruction_rect = instruction_surface.get_rect(center=(screen_rect.centerx, screen_rect.centery + 40))

        surface.blit(game_over_surface, game_over_rect)
        surface.blit(instruction_surface, instruction_rect)