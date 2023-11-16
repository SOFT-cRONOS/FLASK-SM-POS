class appCfg:
    def __init__(self):
        self._SECRET_KEY = 'app_123'
    
    def getSecretKey(self):
        return self._SECRET_KEY