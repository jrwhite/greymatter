import sys
import zerorpc
from cartpole import start, step, reset 

class CartPoleApi(object):
    def start(self):
        return start()

    def step(self, action):
        return step(int(action))

    def reset(self):
        reset()
        return 'ok'

def main():
    addr = 'tcp://127.0.0.1:4242' 
    server = zerorpc.Server(CartPoleApi())
    server.bind(addr)
    # print('started running on {}'.format(addr))
    server.run()

if __name__ == '__main__':
    main()