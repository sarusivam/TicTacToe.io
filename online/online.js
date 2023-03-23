document.addEventListener('DOMContentLoaded', function(){
    const websocketClient = new WebSocket('wss://' + document.location.hostname + '/ws')
    const loader = document.getElementById('spinner')
    const loaderText = document.getElementById('spinner text')
    const b = document.getElementById('container')
    const turn = document.getElementById('turn')
    const screen = document.getElementById('body')
    const tiles = Array.from(document.querySelectorAll('.tile'));
    var waiting
    var yourSymbol
    var opponentSymbol
    
    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const userAction = (tile, index) => {
        if(isValidAction(tile) && waiting == false) {
            tile.innerText = yourSymbol;
            tile.classList.add(`player${yourSymbol}`);
            websocketClient.send('Finished ' + index)

        }
    }

    websocketClient.onopen = function(){

        b.hidden = true
            
    }
    websocketClient.onmessage = function(message){
        if (message.data == 'Connected'){
            loader.remove()
            loaderText.innerHTML = 'Tic Tac Toe'
            document.title = 'Tic Tac Toe'
            b.hidden = false
        }
        else if (message.data == 'Play'){
            let timer = 0
            turn.innerHTML = 'Your turn'
            waiting = false
            tiles.forEach( (tile, index) => {
                tile.addEventListener('click', () => userAction(tile, index));
            });
            const addTimer = setInterval(function() {
                if (!waiting){
                    timer++
                    turn.innerHTML = 'Your turn (Time left : ' + (60 - timer) + 'seconds )' 
                    if (timer > 59){
                        websocketClient.send('TimeUp')
                    } 
                } else {
                    timer = 0
                }

            }, 1000)
                
        }
        else if (message.data == 'Wait'){
        
            turn.innerHTML = 'Opponents turn'
            waiting = true
        }
        else if (message.data == 'You X'){

            yourSymbol = 'X'
            opponentSymbol = 'O'
        }
        else if (message.data == 'You O'){

            yourSymbol = 'O'
            opponentSymbol = 'X'
        }
        else if (message.data == 'Win'){
            turn.hidden =  true
            loaderText.innerHTML = 'You Win'
            tiles.forEach( (tile, index) => {
                tile.hidden = true;
            });
            window.location="win/win.html"
        }
        else if (message.data == 'Lose'){
            turn.hidden =  true
            tiles.forEach( (tile, index) => {
                tile.hidden = true;
            });
            window.location = "lose/lose.html"
        }
        else if (message.data == 'restart'){
            tiles.forEach( (tile, index) => {
                tile.innerHTML = '';
                tile.classList.remove(`player${opponentSymbol}`);
                tile.classList.remove(`player${yourSymbol}`);
            });
            console.log(yourSymbol, "BEFORe")
            if (yourSymbol == 'X'){
                yourSymbol = 'O'
                opponentSymbol = 'X'

            } else{
                yourSymbol = 'X'
                opponentSymbol = 'O'
            }
            console.log(yourSymbol, "AFTER")
        }
        else{
            console.log(message.data)
            tiles.forEach( (tile, index) => {
                if (index == message.data){
                    tile.innerText = opponentSymbol;
                    tile.classList.add(`player${opponentSymbol}`);
                }
            });
        }

    }




}, false)
