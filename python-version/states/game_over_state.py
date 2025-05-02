import pygame
from states.base_state import BaseState
from states.play_state import PlayState
from timer_manager import TimerManager

class GameOverState(BaseState):
    _instance = None

    def __init__(self, manager):
        super().__init__(manager)

    @classmethod
    def get_instance(cls, manager):
        if cls._instance is None:
            cls._instance = cls(manager)
        return cls._instance

    def update(self, events):
        for e in events:
            if e.type == pygame.KEYDOWN and e.key == pygame.K_RETURN:
                PlayState._instance = None
                TimerManager.get_instance().reset()
                return 'MainMenu'
        return 'GameOver'

    def draw(self, surface):
        self.manager.ui.draw_game_over_screen(surface)
