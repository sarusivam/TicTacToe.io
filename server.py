import asyncio
import websockets
import random
import os

all_clients = []
games = []

winning_conditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

class Game():
    def __init__(self, players : list, board) -> None:
        self.players = players
        self.board = board
        self.playerX = None
        self.playerY = None
        self.occupied = False if len(players) < 2 else True
    
    def add_player(self, player):
        self.players.append(player)
        self.occupied = True

    def clear(self):
        self.board = ['', '', '', '', '', '', '', '', '']

    def restart(self):

        self.playerX, self.playerY = self.playerY, self.playerX


    
    

async def send_message(message : str, target_clients=all_clients):
    for client in target_clients:
        await client.send(message)

async def new_client_connected(client_scoket, path):
    print('New client !')
    all_clients.append(client_scoket)
    if len(games) == 0:
        print('Created a New Game for Client')
        games.append(Game([client_scoket], ['', '', '', '', '', '', '', '', '']))
    else:
        for game in games:
            if game.occupied == False:

                game.add_player(client_scoket)
                await send_message('Connected', game.players)
                random_player = random.choice(game.players)
                game.playerX = random_player
                await send_message('Play', [random_player])
                await send_message('You X', [random_player])
                other_player = game.players[0] if random_player == game.players[1] else game.players[1]
                game.playerY = random_player
                await send_message('Wait', [other_player])
                await send_message('You O', [other_player])

                break
        else:
            games.append(Game([client_scoket], ['', '', '', '', '', '', '', '', '']))
    while True:
        try:
            new_message = await client_scoket.recv()
        except Exception as e:
            for game in games:
                if client_scoket in game.players:  
                    other_player = game.players[0] if client_scoket == game.players[1] else game.players[1]
                    await send_message('Win', [other_player])



        
        if 'Finished' in new_message:
            command, message = new_message.split(' ')[0], new_message.split(' ')[1]

            for game in games:
                if client_scoket in game.players:
                    other_player = game.players[0] if client_scoket == game.players[1] else game.players[1]
                    if client_scoket == game.playerX:
                        # print(games, games[0].board, games[0].players, game, message)
                        game.board[int(message)] = 'X'
                    else:
                        game.board[int(message)] = 'O'
                    for winning_condition in winning_conditions:
                        a = game.board[winning_condition[0]]
                        b = game.board[winning_condition[1]]
                        c = game.board[winning_condition[2]]
                        if a == '' or b == '' or c == '':
                            continue
                        if a == b and b == c:
                            await send_message('Win', [])
                            await send_message('Lose', [other_player])
                            games.remove(game)
                    await send_message(message, [other_player])
                    await send_message('Play', [other_player])
                    await send_message('Wait', [client_scoket]) 
                    if not('' in game.board):
                        print('TIE')
                        game.clear()
                        game.restart()

                        await send_message('restart', game.players)
                    break
        if 'TimeUp' in new_message:
            for game in games:
                if client_scoket in game.players:
                    other_player = game.players[0] if client_scoket == game.players[1] else game.players[1]
                    await send_message('Lose', [client_scoket])
                    await send_message('Win', [other_player])

async def start_server():
    print('SERVER STARTED')
    await websockets.serve(new_client_connected, '0.0.0.0', os.environ["PORT"])

if __name__ == '__main__':
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
