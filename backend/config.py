import os

config = None

def fetch_config():
    global config
    
    if not config:
        config = os.environ
    
    return config