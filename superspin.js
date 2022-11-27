window.addEventListener('load', function(){
    const canvas = this.document.getElementById("viewPort");
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const foods = []

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
        constructor(player, players){
            this.player = player
            this.players = players
        
        }

        control(){
            let results = []
            this.players.forEach(element => {
                if (
                    element.globalX < (this.player.globalX + (viewPortWidth / 2)) && 
                    element.globalX > (this.player.globalX - (viewPortWidth / 2)) &&
                    element.globalY < (this.player.globalY + (viewPortHeight / 2)) &&
                    element.globalY > (this.player.globalY - (viewPortHeight / 2))
                    ){
                        let diffX = (((this.player.globalX + (viewPortWidth / 2)) - element.globalX) / viewPortWidth) * 100
                        let diffY = (((this.player.globalY + (viewPortHeight / 2)) - element.globalY) / viewPortHeight) * 100
    

                        let VPx = (diffX / 100) * canvas.width
                        let VPy = (diffY / 100) * canvas.height

                        let isTouchingPlayer = false

                        if (imagesTouching(this.player.x, this.player.y, this.player.size, this.player.size, VPx, VPy, element.size, element.size)){
                            isTouchingPlayer = true
                        }

                        results.push([element, VPx, VPy, isTouchingPlayer])
                }
            });
        return results
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
            this.sprintInterval = 25
            this.countInterval = 1

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
                foods.splice(foods.indexOf(this), 1)
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

    }

    function disturbuteFood(num, x=null, y=null){

            for (let i = 0; i < num; i++) {
                if (x == null && y == null){
   
                    foods.push(new Food(canvas.width, canvas.height, (Math.random() * worldWidth), (Math.random() * worldHeight)))
                } else {
         
                    foods.push(new Food(canvas.width, canvas.height, x, y))                    
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
    for (let i = 0; i < 31; i++) {
        bots.push(new Bot(Math.random() * (Math.random() * worldWidth), Math.random() * (Math.random() * worldHeight)))
    }


    var viewPortWidth = (player.size / 2) + 50;
    var viewPortHeight = (player.size / 2) + 50;   

    disturbuteFood(30000)

    setInterval(function(){
        disturbuteFood(250)
    }, 10000)

    function animate(){

        var spinnerGameControler = new GameControler(bots.concat(player), foods.concat(bots))

        var miniMap = new MiniMap(canvas.width - (canvas.width / (0.0025*canvas.width) + 10), canvas.height - (canvas.height / (0.0025*canvas.height) + 10), canvas.width / (0.0025*canvas.width) , canvas.height / (0.0025*canvas.height), player.globalX, player.globalY)

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // console.log(bots[0].globalX, bots[0].globalY, player.globalX, player.globalY)
        


        ctx.clearRect(0, 0, canvas.width, canvas.height)



        player.draw(ctx);
        player.update(input);
        
        let result = spinnerGameControler.control()

        displayText(ctx, player.score, player.x + (player.size / 2) - (0.2  * player.size), player.y + player.size + 100, "80px Arial", "white") 
        
        result.forEach(element => {    
            element[0].draw(ctx, player, element[1], element[2], element[3])

        })


        bots.forEach(bot =>{
            if (!bot.isMoving){

                bot.destinationX = Math.random() * (Math.random() * worldWidth),
                bot.destinationY = Math.random() * (Math.random() * worldHeight)          
                bot.move()
 
            } else if (bot.isMoving){

                bot.move()
            }
        })
        miniMap.render(ctx)

        viewPortWidth = (player.size / 2) + 50;
        viewPortHeight = (player.size / 2) + 50;   
        
        requestAnimationFrame(animate);
    }
    animate()
});