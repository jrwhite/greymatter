import gym
import numpy as np
import time
import json

env = gym.make('CartPole-v1')
running = False

def start():
    global running, env
    assert running == False
    env.seed(1) # doesnt work
    env.reset()
    env.render()
    running = True
    return 'started'

def step(action):
    global running, env
    assert running == True
    state, reward, done, _ = env.step(action)
    # TODO: make separate api call for checking if simulation is done
    if done:
        running = False
        return "done"
    else:
        # return str(state[2])
        return state[2]

def reset():
    env.reset()


    
    
