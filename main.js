// Menu

function play(){
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
    ice : 2,
    crack : 3,
    tnt : 1,
    isGameover:false
}

let player
const Dogs = new Set()
const Walls = new Set()
const Bricks = new Set()
const Bombs = new Set()
const Explosions = new Set()


function start(){
    screen = document.getElementById('screen')
    document.getElementById('uiGameMenu').style.display = "block"
    screen.style.display = "block"
    screen.width = tileSize * tileRow 
    screen.height = tileSize * tileColumn
    ctx = screen.getContext('2d')

    getSprite()
    setGameObject()
    UiMenu()
    update()
}

function update(timeStamp){
    const deltaTime = timeStamp - lastRender
    lastRender = timeStamp

    draw()
    requestAnimationFrame(update)
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
    logo_whiteImage = new Image()      ; logo_whiteImage.src = "Sprite/logo_white.png"

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
                player = new GameObject(char_downImage, x, y, 64, 64)
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
    for(wall of Walls.values()){
        ctx.drawImage(wall.image,wall.x, wall.y, wall.width, wall.height)
    }
    for(brick of Bricks.values()){
        ctx.drawImage(brick.image,brick.x, brick.y, brick.width, brick.height)
    }
    for(dog of Dogs.values()){
        ctx.drawImage(dog.image,dog.x, dog.y, dog.width, dog.height)
    }
    ctx.drawImage(player.image,player.x, player.y, player.width, player.height)
}

function UiMenu(){
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
    second = gameState.timer%60

    document.getElementById('timer').innerText = ": "+minutes+":"+second
    document.getElementById('playerName').innerText = ": "+gameState.playerName
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
}