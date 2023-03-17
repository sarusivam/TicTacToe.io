window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let waiting = false;
    let isGameActive = true;
    

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';


    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */
    class Bot{
        constructor(){
            this.objective = getRandomItem(winningConditions)
        }
        decideMove(){
            
            for (let winningCondition in winningConditions){
                winningCondition = winningConditions[winningCondition]
                const a = board[winningCondition[0]];
                const b = board[winningCondition[1]];
                const c = board[winningCondition[2]];
                if (a == b && a != '' && c == ''){
                    return winningCondition[2]
                }
                else if (a == c && a != ''&& b == ''){ 
                    return winningCondition[1] 

                }
                else if (b == c && b != ''&& a == ''){
                    return winningCondition[0]
                }
                




                
            }
            let checked = []
            let t = true
            while (this.checkWhetherNeedToChangeObjective() && t){

                this.objective = getRandomItem(winningConditions)
                let already_there = false
                checked.forEach(o => {
                    if (o == this.objective){
                        already_there = true
                    }
                })
                if (!already_there){
                    checked.push(this.objective)

                }

                if (winningConditions.length == checked.length){
                    let index = 0
                    for (let place in board){

                        if (board[place] == ''){
                            t = false
                            return index
                         
                        }
                        index += 1
                    }
                }

            }


            let index;
            this.objective.forEach(i => {
                if (board[i] == ''){
                    index = i
                    
                }
            })

            return index

        }

        checkWhetherNeedToChangeObjective(){
            let shouldChange = false;
            this.objective.forEach(number => {
                if (board[number] == 'X'){

                    shouldChange = true
                }
            })
            if (!board.includes('')){
                shouldChange = false    
            }

            return shouldChange
        }
    }

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    function getRandomItem(arr) {

        // get random index value
        const randomIndex = Math.floor(Math.random() * arr.length);
    
        // get random item
        const item = arr[randomIndex];
    
        return item;
    }
    

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }


    if (roundWon) {
        announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
        isGameActive = false;
        return;
    }

    if (!board.includes(''))
        announce(TIE);

    }

    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Bot has Won';

                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'You have Won';
  
                break;
            case TIE:
                announcer.innerText = 'Tie';

        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    const updateBoard =  (index) => {

        board[index] = currentPlayer;

    }

    const changePlayer = () => {


        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';


        if (currentPlayer == 'O' && isGameActive    ){
            waiting = true
            var move_index = bot.decideMove()

            tiles.forEach((tile, index) => {
                if (move_index == index){

                    move(tile, index)
                    
                }
            });
        }
        else{

            waiting = false
        }
    }
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive && !waiting) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            

            updateBoard(index);
            handleResultValidation();




            changePlayer();


        }
    }
    
    const move = (tile, index) => {

        tile.innerText = currentPlayer;
        tile.classList.add(`player${currentPlayer}`);
        updateBoard(index);
        handleResultValidation();
        changePlayer();
    }
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });
    const bot = new Bot()


    resetButton.addEventListener('click', resetBoard);
});