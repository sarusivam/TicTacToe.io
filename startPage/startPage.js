document.addEventListener('DOMContentLoaded', function(){

    const isMobile = navigator.userAgentData.mobile;
    if (isMobile){
        const onlineButton = document.getElementById('online')
        const twoPlayerButton = document.getElementById('2player')
        const botButton = document.getElementById('bot')

        onlineButton.style.width = '95vw'
        twoPlayerButton.style.width = '45vw'
        botButton.style.width = '45vw'
    }
}, false)