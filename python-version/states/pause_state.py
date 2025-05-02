import pygame
from states.base_state import BaseState
from timer_manager import TimerManager

class PauseState(BaseState):

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
            if e.type == pygame.KEYDOWN and e.key == pygame.K_p:
                TimerManager.get_instance().resume()
                return 'Play'
        return 'Pause'
    
    def draw(self, surface):
        self.manager.ui.draw_pause_screen(surface)