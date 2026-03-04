// Menu

function play(){
    gameState = {
    playerName : "John Skyrim",
    gameDifficulty : 1,
    maxHealth : 3,
    health : 3,
    timer : 0,
    ice : 0,
    crack : 0,
    tnt : 0,
    isGameover:false
}
    if(document.getElementById('playerNameInput').value == "" || document.getElementById('gameDifficulty').value == ""){
        return
    }
    console.log(document.getElementById('playerNameInput').value)
    gameState.playerName = document.getElementById('playerNameInput').value
    gameState.gameDifficulty = document.getElementById('gameDifficulty').value
    start()
}

function instructionToggle(){
    if(document.getElementById('instructionMenu').style.display == "block"){
        document.getElementById('instructionMenu').style.display = "none" 
    }else{
        document.getElementById('instructionMenu').style.display = "block"
    }
}

function gameOver(){
    isGameover = true
    clearInterval(updatePerSecond)
    document.getElementById('gameoverMenu').style.display = "flex"
    document.getElementById('uiGameMenu').style.display = "none"
    document.getElementById('screen').style.display = "none"
    document.body.style.backgroundColor = 'grey'
    document.getElementById('namePlayer').innerText = gameState.playerName
    minutes = Math.floor(gameState.timer/60)
    if(minutes < 10){
        minutes = "0"+minutes
    }
    second = gameState.timer%60
    if(second < 10){
        second = "0"+second
    }

    document.getElementById('tntTotal').innerText = "= "+gameState.tnt
    document.getElementById('iceTotal').innerText = "= "+gameState.ice
    document.getElementById('crackBrickTotal').innerText = "= "+gameState.crack
    
    document.getElementById('playerTimer').innerText = ": "+minutes+":"+second+" "
}

function LeaderBoardMenu(){
    document.getElementById('leaderboardMenu').style.display = "flex"
    document.getElementById('gameoverMenu').style.display = "none"
}
function mainMenu(){
    document.getElementById('leaderboardMenu').style.display = "none"
    document.getElementById('gameoverMenu').style.display = "none"
    document.getElementById('mainMenu').style.display = "flex"
    document.body.style.backgroundColor = 'white'
}
// Game 
let screen
let ctx
let lastRender = 0
const tileSize = 67
const tileRow = 11
const tileColumn = 9

let gameState = {
    playerName : "John Skyrim",
    gameDifficulty : 1,
    maxHealth : 3,
    health : 3,
    timer : 0,
    ice : 0,
    crack : 0,
    tnt : 0,
    isGameover:false
}

let player
const Dogs = new Set()
const Walls = new Set()
const Bricks = new Set()
const Bombs = new Set()
const Explosions = new Set()
const Items = new Set()


function start(){
    screen = document.getElementById('screen')
    document.getElementById('uiGameMenu').style.display = "block"
    document.getElementById('mainMenu').style.display = "none"
    screen.style.display = "block"
    screen.width = tileSize * tileRow 
    screen.height = tileSize * tileColumn
    ctx = screen.getContext('2d')

    getSprite()
    setGameObject()
    UiMenu()
    update(performance.now())
    updatePerSecond = setInterval(UpdateEverySecond, 1000)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
}

function update(timeStamp){
    if(gameState.isGameover){
        return
    }
    const deltaTime = timeStamp - lastRender
    lastRender = timeStamp

    draw()
    requestAnimationFrame(update)
    dirrection()
    player.move(deltaTime)
    player.takeitem()
    for(dog of Dogs.values()){
        dog.move(deltaTime)
    }
}

function UpdateEverySecond(){
    gameState.timer += 1
    for(bomb of Bombs.values()){
        bomb.timer -= 1
        checkEven = bomb.timer%2

        if(checkEven == 0){
            bomb.width += 4
            bomb.height += 4
            bomb.x -= 2
            bomb.y -= 2
        }else{
            bomb.width -= 4
            bomb.height -= 4
            bomb.x += 2
            bomb.y += 2
        }
        if(bomb.timer == 0){
            const offsets = [[0,0],[0,-1],[0,1],[-1,0],[1,0]]
            for(const [ox,oy] of offsets){
                summonExplosion(bomb.x + ox*tileSize, bomb.y + oy*tileSize, 2)
            }
            Bombs.delete(bomb)
            
        }
    }
    for(explosion of Explosions.values()){
        explosion.lifeTime -= 1
        if(explosion.lifeTime == 0){
            Explosions.delete(explosion)
        }
        for(brick of Bricks.values()){
            if(isColide(explosion, brick, 2)){
                brickDestroyed(brick)
                Bricks.delete(brick)
            }
        }
        if(isColide(player, explosion, 1)){
            gameState.health -= 1
            if(gameState.health == 0){
                player.x = 2000
                player.y = 2000
                gameOver()
            }
        }
    }
    UiMenu()

}

let tileMap = [
    "WWWWWWWWWWW",
    "WpssB B B W",
    "WsWBWBWBWBW",
    "WsB B B B W",
    "WBWBWBWBWBW",
    "W B B B B W",
    "WBWBWBWBWBW",
    "W B B B B W",
    "WWWWWWWWWWW",
]

function getSprite(){
    backgroundImage = new Image() ; backgroundImage.src = "Sprite/background.jpg"
    wallImage = new Image()       ; wallImage.src = "Sprite/wall.jpg"
    brickImage = new Image()      ; brickImage.src = "Sprite/brick.png"
    brick_crackImage = new Image()      ; brick_crackImage.src = "Sprite/brick_crack.png"
    bombImage = new Image()      ; bombImage.src = "Sprite/bomb.png"
    explosionImage = new Image()      ; explosionImage.src = "Sprite/explosion.png"
    logo_whiteImage = new Image()      ; logo_whiteImage.src = "Sprite/logo_white.png"
    iceImage = new Image()      ; iceImage.src = "Sprite/ice.png"
    tntImage = new Image()      ; tntImage.src = "Sprite/tnt.png"
    brick_crackImage = new Image()      ; brick_crackImage.src = "Sprite/brick_crack.png"

    char_downImage = new Image()      ; char_downImage.src = "Sprite/char_down.png"
    char_upImage = new Image()      ; char_upImage.src = "Sprite/char_up.png"
    char_leftImage = new Image()      ; char_leftImage.src = "Sprite/char_left.png"
    char_rightImage = new Image()      ; char_rightImage.src = "Sprite/char_right.png"
    
    dog_upImage = new Image()      ; dog_upImage.src = "Sprite/dog_up.png"
    dog_leftImage = new Image()      ; dog_leftImage.src = "Sprite/dog_left.png"
    dog_rightImage = new Image()      ; dog_rightImage.src = "Sprite/dog_right.png"
    dog_downImage = new Image()      ; dog_downImage.src = "Sprite/dog_down.png"
}

function setGameObject(){
    Dogs.clear()
    Walls.clear()
    Bricks.clear()
    Bombs.clear()
    Explosions.clear()
    Items.clear()
    for(r=0; r<11; r++){
        for(c=0 ; c<9; c++){
            row = tileMap[c]
            char = row[r]

            x = tileSize * r
            y = tileSize * c

            if(char == "W"){
                const wall = new GameObject(wallImage, x, y, tileSize, tileSize)
                Walls.add(wall)
            }
            if(char == "B"){
                const brick = new GameObject(brickImage, x, y, tileSize, tileSize)
                Bricks.add(brick)
            }
            if(char == "p"){
                player = new GameObject(char_downImage, x, y, 64, 64, )
            }
            if( char == " "){
                    isThereADog = Math.floor(Math.random()*4)
                    
                    if(isThereADog == 2 && Dogs.size < gameState.gameDifficulty){
                        console.log('2')
                        const dog = new GameObject(dog_downImage, x, y, tileSize, tileSize)
                        Dogs.add(dog)
                    }
            }
        }
    }
}

function draw(){
    ctx.drawImage(backgroundImage, 0, 0, 737, 603)
    for(brick of Bricks.values()){
        ctx.drawImage(brick.image,brick.x, brick.y, brick.width, brick.height)
    }
    for(explosion of Explosions.values()){
        ctx.drawImage(explosion.image,explosion.x, explosion.y, explosion.width, explosion.height)
    }
    for(wall of Walls.values()){
        ctx.drawImage(wall.image,wall.x, wall.y, wall.width, wall.height)
    }
    for(bomb of Bombs.values()){
        ctx.drawImage(bomb.image,bomb.x, bomb.y, bomb.width, bomb.height)
    }
    for(dog of Dogs.values()){
        ctx.drawImage(dog.image,dog.x, dog.y, dog.width, dog.height)
    }
    for(item of Items.values()){
        ctx.drawImage(item.image,item.x, item.y, item.width, item.height)
    }
    ctx.drawImage(player.image,player.x, player.y, player.width, player.height)
}

function dirrection(){
    if(player.velocityX > 0){
        player.image = char_rightImage
    }
    else if(player.velocityX < 0){
        player.image = char_leftImage
    }
    else if(player.velocityY > 0){
        player.image = char_downImage
    }
    else if(player.velocityY < 0){
        player.image = char_upImage
    }
}
function handleKeyDown(e){
    if(e.key === 'ArrowRight'|| e.key === 'd'){
        player.velocityX = 0.15
    }
    if(e.key === 'ArrowLeft'|| e.key === 'a'){
        player.velocityX = -0.15
    }
    if(e.key === 'ArrowDown'|| e.key === 's'){
        player.velocityY = 0.15
    }
    if(e.key === 'ArrowUp'|| e.key === 'w'){
        player.velocityY = -0.15
    }
    if(e.key === ' '){
        summonBomb()
    }
}
function handleKeyUp(e){
    if(e.key === 'ArrowRight'|| e.key === 'd'){
        player.velocityX = 0
    }
    if(e.key === 'ArrowLeft'|| e.key === 'a'){
        player.velocityX = 0
    }
    if(e.key === 'ArrowDown'|| e.key === 's'){
        player.velocityY = 0
    }
    if(e.key === 'ArrowUp'|| e.key === 'w'){
        player.velocityY = 0
    }
}
function summonBomb(){
    Xpos = Math.floor((player.x+30)/67)
    Ypos = Math.floor((player.y+30)/67)

    const bomb = new GameObject(bombImage, Xpos*tileSize, Ypos*tileSize, tileSize, tileSize)
    bomb.timer = 2 
    console.log(bomb)
    Bombs.add(bomb)
    console.log(Xpos)
}
function summonExplosion(x,y, lifeTime){
    explosion = new GameObject(explosionImage, x,y, tileSize, tileSize)
    explosion.lifeTime = lifeTime
    Explosions.add(explosion)
}
function brickDestroyed(brick){
    itemId = Math.floor(Math.random()*4)
    if(itemId == 1){
        item = new GameObject(iceImage, brick.x+tileSize/4, brick.y+tileSize/4, brick.width/2, brick.width/2)
        item.id = 1
    }else if(itemId == 2){
        item = new GameObject(tntImage, brick.x+tileSize/4, brick.y+tileSize/4, brick.width/2, brick.width/2)
        item.id = 2
    }else if(itemId == 3){
        item = new GameObject(brick_crackImage, brick.x+tileSize/4, brick.y+tileSize/4, brick.width/2, brick.width/2)
        item.id = 3
    }else(
        item = null
    )
    if(item){
        Items.add(item)
    }
}
function UiMenu(){
    document.getElementById('health').innerHTML = ""
    for(i = 0; i<gameState.health ; i++){
        document.getElementById('health').innerHTML += '<img src="Sprite/heart_icon.png" alt="">'
    }
    for(i = 0; i<gameState.maxHealth-gameState.health ; i++){
        document.getElementById('health').innerHTML += '<img src="Sprite/heart_empty.png" alt="">'
    }
    document.getElementById('tntUi').innerText = "= "+gameState.tnt
    document.getElementById('iceUi').innerText = "= "+gameState.ice
    document.getElementById('crackBrickUi').innerText = "= "+gameState.crack

    minutes = Math.floor(gameState.timer/60)
    if(minutes < 10){
        minutes = "0"+minutes
    }
    second = gameState.timer%60
    if(second < 10){
        second = "0"+second
    }

    document.getElementById('timer').innerText = ": "+minutes+":"+second
    document.getElementById('playerName').innerText = ": "+gameState.playerName
}
function isColide(obj1, obj2, padding){
    return  obj1.x < obj2.x + obj2.width - padding &&
            obj1.x + obj1.width - padding > obj2.x &&
            obj1.y < obj2.y + obj2.height - padding &&
            obj1.y + obj1.height - padding > obj2.y
}
class GameObject{
    constructor(image, x,y, width, height, velocityX = 0, velocityY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    move(deltaTime){
        this.x += this.velocityX * deltaTime
        for(let brick of Bricks.values()){
            if(isColide(this, brick, 8)){
                    if(this.velocityX >0){
                            this.x = brick.x - brick.width +10
                    }
                    if(this.velocityX < 0){
                            this.x = brick.x + brick.width -8
                    }
                }

        }
        for(let wall of Walls.values()){
                if(isColide(this, wall, 8)){
                    if(this.velocityX >0){
                            this.x = wall.x - wall.width +10
                    }
                    if(this.velocityX < 0){
                            this.x = wall.x + wall.width -8
                    }
                }
        }
        this.y += this.velocityY * deltaTime
        for(let brick of Bricks.values()){
                if(isColide(this, brick, 8)){
                    if(this.velocityY >0){
                            this.y = brick.y - brick.width +10
                    }
                    if(this.velocityY < 0){
                            this.y = brick.y + brick.width -8
                    }
                }
        }
        for(let wall of Walls.values()){
                if(isColide(this, wall, 8)){
                    if(this.velocityY >0){
                            this.y = wall.y - wall.width +10
                    }
                    if(this.velocityY < 0){
                            this.y = wall.y + wall.width -8
                    }
                }
        }
    }
    takeitem(){
        for(item of Items.values()){
            if(isColide(this, item, 5)){
                if(item.id == 1){
                    gameState.ice += 1
                }else if(item.id == 2){
                    gameState.tnt += 1
                }else{
                    gameState.crack += 1
                }
                Items.delete(item)
                UiMenu()
            }
        }
    }
    
}

// window.onload = start()