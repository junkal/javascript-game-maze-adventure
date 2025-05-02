import pygame

class AudioManager:
    def __init__(self, assets):
        self.assets = assets

    def play_music(self):
        pygame.mixer.music.load(self.assets.get_music_path())
        pygame.mixer.music.set_volume(1.0)
        pygame.mixer.music.play(-1)

    def stop_music(self):
        pygame.mixer.music.stop()

    def play_footstep(self):
        self.assets.get_footstep().play()

    def play_victory(self):
        self.assets.get_victory().play()

    def play_game_over(self):
        self.assets.get_game_over().play()
