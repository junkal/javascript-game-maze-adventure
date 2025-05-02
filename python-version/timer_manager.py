import pygame

class TimerManager:
    _instance = None

    def __init__(self):
        self.reset()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def reset(self):
        self.start_time = pygame.time.get_ticks()
        self.elapsed_time = 0
        self.paused = False
        self.pause_start = None
        self.total_paused_duration = 0

    def update(self):
        if not self.paused:
            self.elapsed_time = (pygame.time.get_ticks() - self.start_time - self.total_paused_duration) / 1000

    def pause(self):
        if not self.paused:
            self.paused = True
            self.pause_start = pygame.time.get_ticks()

    def resume(self):
        if self.paused:
            paused_duration = pygame.time.get_ticks() - self.pause_start
            self.total_paused_duration += paused_duration
            self.paused = False
            self.pause_start = None

    def get_elapsed_time(self):
        return self.elapsed_time

    def is_paused(self):
        return self.paused