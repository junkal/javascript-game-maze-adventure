import pygame
import settings

class AssetManager:
    def __init__(self):
        pygame.mixer.init()
        # Background tile
        self.background_tile = pygame.image.load(settings.BACKGROUND_IMAGE_PATH).convert()
        self.background_tile = pygame.transform.scale(
            self.background_tile,
            (settings.TILE_SIZE, settings.TILE_SIZE)
        )

        # Cover image
        raw_cover = pygame.image.load(settings.COVER_IMAGE_PATH).convert()
        rw, rh = raw_cover.get_size()
        sx = settings.SCREEN_WIDTH / rw
        sy = settings.SCREEN_HEIGHT / rh
        factor = min(sx, sy)
        cw, ch = int(rw * factor), int(rh * factor)
        self.cover_image = pygame.transform.scale(raw_cover, (cw, ch))
        self.cover_rect = self.cover_image.get_rect(
            center=(settings.SCREEN_WIDTH // 2, settings.SCREEN_HEIGHT // 2)
        )

        # Knight images
        self.knight = pygame.transform.smoothscale(
            pygame.image.load(settings.KNIGHT_IMAGE_PATH).convert_alpha(),
            (int(settings.TILE_SIZE * 1.5), int(settings.TILE_SIZE * 1.5))
        )

        # Gate
        self.gate = pygame.transform.smoothscale(
            pygame.image.load(settings.GATE_IMAGE_PATH).convert_alpha(),
            (settings.TILE_SIZE * 2, settings.TILE_SIZE * 2)
        )

        # Sounds
        self.background_music = settings.BACKGROUND_MUSIC_PATH
        self.footstep = pygame.mixer.Sound(settings.FOOTSTEP_SOUND_PATH)
        self.victory = pygame.mixer.Sound(settings.VICTORY_SOUND_PATH)
        self.game_over = pygame.mixer.Sound(settings.GAME_OVER_SOUND_PATH)

    def get_background_tile(self):
        return self.background_tile

    def get_cover(self):
        return self.cover_image, self.cover_rect

    def get_knight(self):
        return self.knight

    def get_gate(self):
        return self.gate

    def get_music_path(self):
        return self.background_music

    def get_footstep(self):
        return self.footstep

    def get_victory(self):
        return self.victory

    def get_game_over(self):
        return self.game_over
