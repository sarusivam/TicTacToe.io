document.addEventListener('DOMContentLoaded', function(){

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile){
        const onlineButton = document.getElementById('online')
        const twoPlayerButton = document.getElementById('2player')
        const botButton = document.getElementById('bot')

        onlineButton.style.width = '95vw'
        twoPlayerButton.style.width = '95vw'
        botButton.style.width = '95vw'
    }
}, false)