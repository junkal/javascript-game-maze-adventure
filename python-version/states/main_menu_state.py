import pygame
from states.base_state import BaseState
from timer_manager import TimerManager

class MainMenuState(BaseState):
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
                TimerManager.get_instance().reset()
                return 'Play'
        TimerManager.get_instance().pause()
        return 'MainMenu'

    def draw(self, surface):
        self.manager.ui.draw_main_menu(surface)
