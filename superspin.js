window.addEventListener('load', function(){
    const canvas = this.document.getElementById("viewPort");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight



    class InputHandler{
        constructor(){

            this.mouseX = 0;
            this.mouseY = 0;
            this.mouseDown = false;

            window.addEventListener('mousemove', e => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            })

            window.addEventListener('mousedown', e=> {
                this.mouseDown = true
            }) 
            window.addEventListener('mouseup', e=>{
                this.mouseDown = false
            })
        }
    }
    
    class GameControler{
        constructor(players, regions){
            this.players = players
            this.regions = regions
        
        }

        getElementsInsideObjectRegion(player){
            player.regionIn.forEach(objectRegion => {
                objectRegion.objectsInside.forEach(object =>{
                    if (object.globalX < (player.globalX + (viewPortWidth / 2)) && 
                        object.globalX > (player.globalX - (viewPortWidth / 2)) &&
                        object.globalY < (player.globalY + (viewPortHeight / 2)) &&
                        object.globalY > (player.globalY - (viewPortHeight / 2))){

                        let diffX = (((player.globalX + (viewPortWidth / 2)) - object.globalX) / viewPortWidth)
                        let diffY = (((player.globalY + (viewPortHeight / 2)) - object.globalY) / viewPortHeight)

                        let VPx = diffX * canvas.width
                        let VPy = diffY * canvas.height
    
                        let isTouchingPlayer = false

                        if (imagesTouching(player.x, player.y, player.size, player.size, VPx, VPy, object.size, object.size)){
                            isTouchingPlayer = true
                        }
    
                        // results.push([object, VPx, VPy, isTouchingPlayer])
                        // if (object.constructor.name == 'Bot') {console.log(true)}  
                        object.draw(ctx, player, VPx, VPy, isTouchingPlayer)
                    }
                })  
            });
        }

        isInsideRegion(region, object){
            // console.log(false, object.globalX, object.globalY, region.globalX, region.globalY)
            if (object.globalX > region.globalX &&
                object.globalX < (region.globalX + regionWidth) &&
                object.globalY > region.globalY &&
                object.globalY < (region.globalY + regionHeight)){
                return true
            }
        }
    }

    class Region{
        constructor(globalX, globalY){
            this.globalX = globalX
            this.globalY = globalY
            this.objectsInside = []

        }



    }

    class Spinner{
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.size = 200 
            this.image = document.getElementById('spinner')
            this.VPx = window.innerWidth / 2;
            this.VPy = window.innerHeight / 2;
            this.globalX = Math.random()* (Math.random() * 10000);
            this.globalY = Math.random()* (Math.random() * 10000);
            this.speedX = 0.5;
            this.speedY = 1;
            this.degrees = 1
            this.score = 0
            this.degreeIncrease = 0.1;
            this.isSprinting = false;
            this.sprintInterval = 15
            this.countInterval = 1
            this.regionIn = []


        }

        draw(context){
            context.clearRect(0,0,canvas.width,canvas.height);


            context.save();
        

            context.translate(canvas.width/2,canvas.height/2);
        

            context.rotate(this.degrees*Math.PI/180);
         

            context.drawImage(this.image, (-(this.size+10))/2, (-(this.size+10))/2, this.size+10, this.size+10);
        


            context.restore();


            if (this.degrees > 359){
                this.degrees = 0
            } else this.degrees += this.degreeIncrease



        }



        update(){
            this.x = (window.innerWidth / 2) - (this.size / 2);
            this.y = (window.innerHeight / 2) - (this.size / 2);

            
            let mouseXDiff = input.mouseX - this.x
            let mouseYDiff = input.mouseY  - this.y




            
            if (mouseXDiff > 0){
                 this.globalX -= this.speedX
            } else if(mouseXDiff < 0){
                this.globalX += this.speedX
            }   

            if (mouseYDiff > 0){
                this.globalY -= this.speedY
           } else if(mouseYDiff < 0){
               this.globalY += this.speedY
           }



            if (input.mouseDown) {
                this.isSprinting = true
            } else {
                this.isSprinting = false           
            }


            if (this.isSprinting  && this.score > 0){
                this.speedX = 1;
                this.speedY = 2;

                if (this.countInterval >= this.sprintInterval){
                    this.score -= 1
                    this.size -= 1

                    disturbuteFood(1, (this.globalX + ((Math.random() * (0.1 * (this.size + 20)) * (mouseXDiff / Math.abs(mouseXDiff))))), (this.globalY + ((Math.random() * (0.1 * (this.size + 20)) *  (mouseYDiff / Math.abs(mouseYDiff))))))

                    this.countInterval = 1;

                }else {
                    this.countInterval += 1;

                }
            } else {
                this.speedX = 0.5;
                this.speedY = 1;                     
            }       


        }



        increaseSize(){
            if (this.size < 1200){
                this.size += 1

            if (this.degreeIncrease < 30){
            this.degreeIncrease += 0.05;
            }
        } else {
            this.size += 0.005
        }
            this.score += 1
        }   

    }

    class Bot{
        constructor(globalX, globalY){
            this.globalX = globalX
            this.globalY = globalY
            this.size = 200
            this.score = 0
            this.image = document.getElementById('spinner')
            this.destinationX = 0
            this.destinationY = 0
            this.isMoving = false
            this.regionIn = []

        }

        move(){
            this.isMoving = true

            let diffX = this.globalX - this.destinationX
            let diffY = this.globalY - this.destinationY


            if (diffX > 0){
                this.globalX -= 0.5;
            } else if (diffX < 0){
                this.globalX += 0.5;
            }

            if (diffY > 0){
                 this.globalY -= 1;
            } else if (diffY < 0){
                this.globalY += 1;
            }
            if (diffX == 0 && diffY == 0){
                this.isMoving = false
            } 

    }

    increaseSize(){
        this.score += 1
        this.size += 1

    }




    draw(context, player, VPx, VPy, isTouchingPlayer){

        context.drawImage(this.image, VPx,  VPy, this.size, this.size)



        displayText(context, this.score, VPx + (this.size / 2) - (0.2  * this.size), VPy + this.size + 100, "80px Arial", "white")

    }
}

    class Food{
        constructor(gameWidth, gameHeight, globalX, globalY){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("burger");
            this.size = 100
            this.globalX  = globalX;
            this.globalY = globalY;



        }


        draw(context, player, VPx, VPy, isTouchingPlayer){

            if (isTouchingPlayer){
                player.increaseSize()
                player.regionIn.forEach(playerRegion =>{
                    playerRegion.objectsInside.forEach(objectInsideRegion =>{
                        if (objectInsideRegion == this){
                            playerRegion.objectsInside.splice(playerRegion.objectsInside.indexOf(this), 1)
                        }
                    })
                })

            } else {
                context.drawImage(this.image, VPx, VPy, this.size, this.size)
            }

            }
            

        }
        
    class MiniMap{
        constructor(x, y, width, height, playerX, playerY){
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.playerX = playerX
            this.playerY = playerY
        }

        render(context){
            context.fillStyle = '#0f0f0f'
            context.fillRect(this.x, this.y, this.width, this.height)
            let circleX = (((worldWidth - this.playerX) / worldWidth) * this.width) + this.x
            let circleY = (((worldHeight - this.playerY) / worldHeight) * this.height) + this.y
            context.strokeStyle = "#FFFFFF"
            context.beginPath();
            context.fillStyle = "#FFFFFF"
            context.arc(circleX, circleY, 10, 0, 2 * Math.PI)
            context.fill()        
            context.stroke()
         
        
        }

        update(playerx, playery, x, y, width, height){
            this.playerX = playerx
            this.playerY = playery
            this.x = x
            this.y = y
            this.width = width
            this.height = height

        }

    }

    function disturbuteFood(num, x=null, y=null){
        var g  = new GameControler([], [])
        for (let i = 0; i < num; i++) {
            if (x == null && y == null){
                foodX = Math.random() * worldWidth
                foodY = Math.random() * worldHeight
                var food = new Food(canvas.width, canvas.height, foodX, foodY)
                regions.forEach(region => {
                    isInside = g.isInsideRegion(region, food)
                    if (isInside){
                        region.objectsInside.push(food)
                    }
                })
            } else {
                regions.forEach(region =>{
                    var food = new Food(canvas.width, canvas.height, x, y)
                    isInside = g.isInsideRegion(region, food)
                    if (isInside){
                        region.objectsInside.push(food)
                    }
                })
       
            }
        } 
    }



    function imagesTouching(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 >= x2+w2 || x1+w1 <= x2) return false;   // too far to the side
        if (y1 >= y2+h2 || y1+h1 <= y2) return false; // too far above/below
        return true;                                                    // otherwise, overlap   
        }

    function displayText(context, text, x, y, fontSize, color){
        context.fillStyle = color
        context.font = fontSize
        context.fillText(text, x, y)
    }

    const worldWidth = 10000;
    const worldHeight = 10000;

    const input = new InputHandler()
    const player = new Spinner(canvas.width, canvas.height)



    var bots = []
    for (let i = 0; i < 10; i++) {
        bots.push(new Bot(Math.random() * worldWidth, Math.random() * worldHeight))
    }

    const regionWidth = 1000
    const regionHeight = 1000

    var regions = []
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++){
            regions.push(new Region(regionWidth*i, regionHeight*j) )
        }
    }


    var viewPortWidth = (player.size / 2) + 50;
    var viewPortHeight = (player.size / 2) + 50;   

    disturbuteFood(30000)

    setInterval(function(){
        disturbuteFood(250)
    }, 10000)

    const minimap = new MiniMap(canvas.width - (canvas.width / (0.0025*canvas.width) + 10), canvas.height - (canvas.height / (0.0025*canvas.height) + 10), canvas.width / (0.0025*canvas.width) , canvas.height / (0.0025*canvas.height), player.globalX, player.globalY)
    const spinnerGameControler = new GameControler([player], regions)

    function animate(){
    

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        minimap.update(
            player.globalX,
            player.globalY,
            canvas.width - (canvas.width / (0.0025*canvas.width) + 10), 
            canvas.height - (canvas.height / (0.0025*canvas.height) + 10), 
            canvas.width / (0.0025*canvas.width) , canvas.height / (0.0025*canvas.height), 
            player.globalX, player.globalY

        )


        regions.forEach(region =>{
            playerInside = spinnerGameControler.isInsideRegion(region, player)
            if (playerInside){
                player.regionIn = []
                player.regionIn.push(region)
            }

            bots.forEach(bot =>{
                botInside = spinnerGameControler.isInsideRegion(region, bot);
                index = region.objectsInside.indexOf(bot);
                if (botInside){
                    bot.regionIn = []
                    bot.regionIn.push(region)
                    if (index == -1) {
                        region.objectsInside.push(bot)
                    }
                } else {
                    if (index != -1) {
                        region.objectsInside.splice(index, 1);
                    }
                }
                spinnerGameControler.getElementsInsideObjectRegion(bot)
            }) 
        })

        player.draw(ctx);
        player.update(input);

        displayText(ctx, player.score, player.x + (player.size / 2) - (0.2  * player.size), player.y + player.size + 100, "80px Arial", "white") 
        
        spinnerGameControler.getElementsInsideObjectRegion(player)
        
        minimap.render(ctx)
  
        viewPortWidth = (player.size / 2) + 50;
        viewPortHeight = (player.size / 2) + 50;   
        
        requestAnimationFrame(animate);
    }
    animate()
});