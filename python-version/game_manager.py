import settings
from asset_manager import AssetManager
from audio_manager import AudioManager
from ui_manager import UIManager
from states.main_menu_state import MainMenuState
from states.play_state import PlayState
from states.pause_state import PauseState
from states.win_state import WinState
from states.game_over_state import GameOverState

class GameManager:
    def __init__(self, surface):
        self.surface = surface
        self.assets = AssetManager()
        self.audio = AudioManager(self.assets)
        self.ui = UIManager(self.assets)
        self.state_name = 'MainMenu'
        self.state = self.load_state(self.state_name)

    def load_state(self, name):
        if name == 'MainMenu':
            return MainMenuState.get_instance(self)
        if name == 'Play':
            return PlayState.get_instance(self)
        if name == 'Pause':
            return PauseState.get_instance(self)
        if name == 'Win':
            return WinState.get_instance(self)
        if name == 'GameOver':
            return GameOverState.get_instance(self)
        raise ValueError(f"Unknown state {name}")

    def change_state(self, new_state):
        self.state_name = new_state
        self.state = self.load_state(new_state)

    def update(self, events):
        next_state = self.state.update(events)
        if next_state and next_state != self.state_name:
            self.change_state(next_state)

    def draw(self):
        self.surface.fill(settings.WHITE)
        self.state.draw(self.surface)
