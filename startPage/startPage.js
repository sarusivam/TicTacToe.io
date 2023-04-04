document.addEventListener('DOMContentLoaded', function(){
    let tips = [
        'When playing tic tac toe, try to take the center square first, as it gives you the most opportunities to create multiple lines of 3 in a row.',
        'pay attention to your opponents moves and try to anticipate their next move. This can help you block their potential lines and increase your chances of winning',
        'If you cant take the center square, aim to take one of the corner squares. This will give you two potential lines of 3 and force your opponent to react accordingly.',
        'Dont be afraid to play defensively in tic tac toe, especially if your opponent has a strong opening move. Sometimes, the best strategy is to focus on blocking their potential lines and waiting for a mistake.',
        'Try to avoid placing your Xs or Os in a row or column that already has two of your opponents marks. This will prevent your opponent from creating a line of 3 in that row or column.',
        'If you are playing against a more experienced player, try to mix up your opening moves and avoid patterns that can be easily predicted. This will make it more difficult for your opponent to anticipate your moves and block your potential lines.',
        'Always look for opportunities to create multiple potential lines of 3 in a row. This will force your opponent to block one line, which will then give you an opportunity to create another line and potentially win the game.',
        'If you are playing against someone who always takes the center square, try to take one of the squares adjacent to the center. This will give you more potential lines of 3 and increase your chances of winning.',
        'If you have played a few moves and neither player has taken the center square, try to create a fork by placing your X or O in a position that creates two potential lines of 3. This will force your opponent to block one line, giving you an opportunity to create the other and potentially win the game.',
        'If your opponent has taken one of the corner squares, try to take the opposite corner. This will prevent your opponent from creating a diagonal line of 3 and give you more potential lines to work with.',
        'If you are playing against someone who always takes one of the corner squares, try to take the center square. This will give you more potential lines of 3 and make it more difficult for your opponent to block all of them.',
        'If you have played a few moves and it looks like the game might end in a tie, try to place your X or O in a position that blocks your opponents potential lines of 3 while also creating your own. This will give you a better chance of winning if your opponent makes a mistake.',
        'One advanced strategy in tic tac toe is called the "double threat" or "two-way threat." This involves placing your X or O in a position that creates two potential lines of 3 while also blocking your opponents potential lines. This forces your opponent to choose which line to block, giving you an opportunity to win the game.'
    ]
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile){
        const onlineButton = document.getElementById('online')
        const twoPlayerButton = document.getElementById('2player')
        const botButton = document.getElementById('bot')

        onlineButton.style.width = '95vw'
        twoPlayerButton.style.width = '95vw'
        botButton.style.width = '95vw'
    }
    const tip = document.getElementById("tip")
    tip.innerHTML = "<p style='font-size : 20px'>Tip</p>" + tips[Math.round((Math.random() / 1) * (tips.length - 1))]
}, false)