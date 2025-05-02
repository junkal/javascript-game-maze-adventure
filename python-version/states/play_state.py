import pygame
from states.base_state import BaseState
from player import Player
from maze import Maze
from timer_manager import TimerManager
import settings

class PlayState(BaseState):
    
    _instance = None

    def __init__(self, manager):
        super().__init__(manager)
        self.maze = Maze(settings.GRID_WIDTH, settings.GRID_HEIGHT, manager.assets)
        self.player = Player(self.maze, manager.assets)
        self.paused = False 
        manager.audio.play_music()

    @classmethod
    def get_instance(cls, manager):
        if cls._instance is None:
            cls._instance = cls(manager)
        return cls._instance
    
    def update(self, events):
        timer = TimerManager.get_instance()
        timer.update()

        for e in events:
            if e.type == pygame.KEYDOWN and e.key == pygame.K_p:
                timer.pause()
                return 'Pause'

        self.player.handle_input(events)
        self.player.update()

        if self.player.at_goal():
            self.manager.audio.play_victory()
            timer.pause()
            return 'Win'

        if timer.get_elapsed_time() > settings.COUNTDOWN_TIME:
            self.manager.audio.play_game_over()
            timer.pause()
            return 'GameOver'

        return 'Play'
        
    def draw(self, surface):
        self.manager.ui.draw_background(surface)
        self.maze.draw(surface)
        self.player.draw(surface)
        self.manager.ui.draw_timer(surface, TimerManager.get_instance().get_elapsed_time())
        self.manager.ui.draw_hint(surface)