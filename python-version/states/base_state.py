class BaseState:
    
    _instance = None

    def __init__(self, manager):
        self.manager = manager

    def update(self, events):
        raise NotImplementedError

    def draw(self, surface):
        raise NotImplementedError

    @classmethod
    def get_instance(cls, manager):
        if cls._instance is None:
            cls._instance = BaseState(manager)
        return cls._instance
