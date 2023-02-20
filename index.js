
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const score = document.querySelector('#score')
const startButton = document.getElementById('startButton')
const tscore = document.querySelector('#tscore')
let started = false
//let pacmanEatDot = new Audio('./sound/pacman mange dot.mp3')
let leader = false
let playerNumber = 0;

let pacmanVelocity = 1
const ghostVelocity = 1

startButton.addEventListener('click', function() {
    startButton.hidden = true
    setTimeout(() => {
        started = true
        tscore.innerHTML = 'Score : '
    }, 3000)
})

//pour que le canevas prennent toute la fenetre
canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Border {
    static width = 40
    static height = 40

    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() { //dessine un carré de la bordure
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image,this.position.x, this.position.y)
    }
}

class Pacman {
    constructor( {position, velocity, color} ) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.05
        this.direction = 'right'
        this.lives = 3
        this.alive = true
        this.color = color
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)

        if (this.velocity.x > 0) {
            this.direction = 'right'
        }
        else if (this.velocity.x < 0) {
            this.direction = 'left'
        }
        else if (this.velocity.y > 0) {
            this.direction = 'down'
        }
        else if (this.velocity.y < 0) {
            this.direction = 'up'
        }
        switch (this.direction) {
            case 'right':
                c.rotate(0)
                break
            case 'left':
                c.rotate(Math.PI)
                break
            case 'up':
                c.rotate(-Math.PI/2)
                break
            case 'down':
                c.rotate(Math.PI/2)
                break
        }
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        if (started) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y

            if (this.radians < 0 || this.radians > 0.75) {
                this.openRate = -this.openRate
            }
            this.radians += this.openRate
        }
    }
    
}

const heightCage = 19/2 * Border.height
const cage = [17/2 * Border.width, 21/2 * Border.width]

class Ghost {
    constructor( {position, velocity, color, isFree, delay, playing} ) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.scared = false
        this.blink = false
        this.isFree = isFree
        this.delay = delay
        this.freeing = false
        this.playing = playing
    }

    draw() {
        if (this.scared) {
            if (this.blink) {
                c.drawImage(createImage('./img/ghostBlink.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
            }
            else {
                c.drawImage(createImage('./img/ghostScared.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
            }
        }
        else {
            switch (this.color) {
                case 'red':
                    if (this.velocity.y < 0)
                        c.drawImage(createImage('./img/ghostRedUp.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.x < 0)
                        c.drawImage(createImage('./img/ghostRedLeft.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.y > 0)
                        c.drawImage(createImage('./img/ghostRedBot.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else
                        c.drawImage(createImage('./img/ghostRedRight.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    break
                case 'pink':
                    if (this.velocity.x > 0)
                        c.drawImage(createImage('./img/ghostPinkRight.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.x < 0)
                        c.drawImage(createImage('./img/ghostPinkLeft.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.y < 0)
                        c.drawImage(createImage('./img/ghostPinkUp.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else
                        c.drawImage(createImage('./img/ghostPinkBot.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    break
                case 'orange':
                    if (this.velocity.x > 0)
                        c.drawImage(createImage('./img/ghostOrangeRight.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.x < 0)
                        c.drawImage(createImage('./img/ghostOrangeLeft.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.y > 0)
                        c.drawImage(createImage('./img/ghostOrangeBot.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else
                        c.drawImage(createImage('./img/ghostOrangeUp.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    break
                case 'cyan':
                    if (this.velocity.y < 0)
                        c.drawImage(createImage('./img/ghostCyanUp.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.x > 0)
                        c.drawImage(createImage('./img/ghostCyanRight.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else if (this.velocity.y > 0)
                        c.drawImage(createImage('./img/ghostCyanBot.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    else
                        c.drawImage(createImage('./img/ghostCyanLeft.png'),this.position.x - Border.width/2, this.position.y - Border.height/2)
                    break
            }
        }
    }

    freeGhost() {
        this.position.y = 15/2 * Border.height
        this.isFree = true
        this.playing = true
    }

    update() {
        this.draw()
        if (started) {
            if (this.isFree) {
                this.position.x += this.velocity.x
                this.position.y += this.velocity.y
            }
            else if (!this.freeing) {
                this.freeing = true
                setTimeout(() => {
                    this.freeGhost()
                }, this.delay)
            }
        }
        
    }
}

class Dot {
    constructor( {position} ) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'rgb(182, 136, 56)'
        c.fill()
        c.closePath()
    }
}

class PowerUp {
    constructor( {position} ) {
        this.position = position
        this.radius = 10
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'rgb(182, 136, 56)'
        c.fill()
        c.closePath()
    }
}

const pacman = new Pacman({
    position: {
        x: Border.width * 3/2,
        y: Border.height * 3/2,
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'yellow'
})

let dots = []
//les bordures sont représentées par une liste de bordure (des carrés)
let borders = []
let powerUps = []

let ghosts 
let playingGhosts

function setupGhosts() {
    ghosts = [
        new Ghost({
            position : {
                x: Border.width * 17/2,
                y: Border.height * 19/2,
            },
            velocity: {
                x: ghostVelocity,
                y: 0
            },
            color : 'pink',
            isFree : false,
            delay : 1500,
            playing : false
        }),
        new Ghost({
            position : {
                x: Border.width * 21/2,
                y: Border.height * 19/2,
            },
            velocity: {
                x: ghostVelocity,
                y: 0
            },
            color : 'orange',
            isFree : false,
            delay : 5000,
            playing : false
        }),
        new Ghost({
            position : {
                x: Border.width * 19/2,
                y: Border.height * 19/2,
            },
            velocity: {
                x: ghostVelocity,
                y: 0
            },
            color : 'cyan',
            isFree : false,
            delay : 8500,
            playing : false
        }),
    ]
    
    playingGhosts = [
        new Ghost({
            position: {
                x: Border.width * 19/2,
                y: Border.height * 15/2,
            },
            velocity: {
                x: ghostVelocity,
                y: 0
            },
            color : 'red',
            isFree : true,
            delay : 0,
            playing : true
        })]
}

setupGhosts()

let score1 = 0
let lastKey = ''

let keys = {
    up: {
        pressed: false
    },
    left: {
        pressed: false
    },
    down: {
        pressed: false
    },
    right: {
        pressed: false
    },
}

//représentation de la map
const map = [
    ['1','-','-','-','-','-','-','7','-','-','-','7','-','-','-','-','-','-','2'],
    ['|','.','.','.','.','.','.','|','.','.','.','|','.','.','.','.','.','.','|'],
    ['|','.','[',']','.','^','.','_','.','^','.','_','.','^','.','[',']','.','|'],
    ['|','.','.','*','.','|','.','.','.','|','.','.','.','|','.','*','.','.','|'],
    ['|','.','1',']','.','4','-',']','.','|','.','[','-','3','.','[','2','.','|'],
    ['|','.','|','.','.','.','.','.','.','|','.','.','.','.','.','.','|','.','|'],
    ['3','.','_','.','[',']','.','[','-','5','-',']','.','[',']','.','_','.','4'],
    ['t','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','t'],
    ['2','.','1','2','.','^','.','1',']','p','[','2','.','^','.','1','2','.','1'],
    ['|','.','4','3','.','|','.','|',' ',' ',' ','|','.','|','.','4','3','.','|'],
    ['|','.','.','.','.','|','.','4','-','-','-','3','.','|','.','.','.','.','|'],
    ['|','.','[','2','.','|','.','.','.','.','.','.','.','|','.','1',']','.','|'],
    ['|','.','.','|','.','_','.','[','-','7','-',']','.','_','.','|','.','.','|'],
    ['4',']','.','|','.','.','.','.','.','|','.','.','.','.','.','|','.','[','3'],
    ['t','.','.','|','.','1','-',']','.','_','.','[','-','2','.','|','.','.','t'],
    ['2','.','[','3','.','|','.','.','.','.','.','.','.','|','.','4',']','.','1'],
    ['|','.','.','.','.','|','.','^','.','^','.','^','.','|','.','.','.','.','|'],
    ['|','.','^','.','[','3','.','|','.','_','.','|','.','4',']','.','^','.','|'],
    ['|','.','|','.','*','.','.','|','.','.','.','|','.','.','*','.','|','.','|'],
    ['|','.','4','-','-',']','.','4','-','-','-','3','.','[','-','-','3','.','|'],
    ['|','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','|'],
    ['4','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','3']
]

//crée une image pour HTML à partir du chemin src
function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

//on itere sur la map pour créer les bordures et les dots
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == '-') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Horizontal.png')
            }))
        }
        else if (symbol == '|') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Vertical.png')
            }))
        }
        else if (symbol == '1') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Corner1.png')
            }))
        }
        else if (symbol == '2') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Corner2.png')
            }))
        }
        else if (symbol == '3') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Corner3.png')
            }))
        }
        else if (symbol == '4') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Corner4.png')
            }))
        }
        else if (symbol == 'b') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/block.png')
            }))
        }
        else if (symbol == '[') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Left.png')
            }))
        }
        else if (symbol == ']') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Right.png')
            }))
        }
        else if (symbol == '_') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Bottom.png')
            }))
        }
        else if (symbol == '^') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/Top.png')
            }))
        }
        else if (symbol == '5') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/ConnectorTop.png')
            }))
        }
        else if (symbol == '6') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/ConnectorLeft.png')
            }))
        }
        else if (symbol == '7') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/ConnectorBottom.png')
            }))
        }
        else if (symbol == '8') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/ConnectorRight.png')
            }))
        }
        else if (symbol == 'p') {
            borders.push(new Border({
                position: {
                    x: j * Border.width,
                    y: i * Border.height
                },
                image: createImage('./img/door.png')
            }))
        }
        else if (symbol == '.') {
            dots.push(new Dot({
                position: {
                    x: (2*j + 1)/2 * Border.width ,
                    y: (2*i + 1)/2 * Border.height
                },
            }))
        }
        else if (symbol == '*') {
            powerUps.push(new PowerUp({
                position: {
                    x: (2*j + 1)/2 * Border.width ,
                    y: (2*i + 1)/2 * Border.height
                },
            }))
        }
    })
})

//détecte collisions entre un cercle et un rectangle
function pacmanCollision({
    circle,
    rectangle
}) {
    const padding = Border.width/2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
        && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width  + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding)
}

let animationId
let direction


function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)


    //mise à jour direction pacman en fonction touche pressée si possible
    if (started) {
        if (keys.up.pressed && lastKey === 'up') {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i]
                if (pacmanCollision({
                    circle: {...pacman, velocity: {
                        x: 0,
                        y: -pacmanVelocity
                    }},
                    rectangle: border
                })) {
                    pacman.velocity.y = 0
                    break
                } else {
                    pacman.velocity.y = -pacmanVelocity
                }
            }
        }
        else if (keys.left.pressed && lastKey === 'left') {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i]
                if (pacmanCollision({
                    circle: {...pacman, velocity: {
                        x: -pacmanVelocity,
                        y: 0
                    }},
                    rectangle: border
                })) {
                    pacman.velocity.x = 0
                    break
                } else {
                    pacman.velocity.x = -pacmanVelocity
                }
            }
        }
        else if (keys.down.pressed && lastKey === 'down') {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i]
                if (pacmanCollision({
                    circle: {...pacman, velocity: {
                        x: 0,
                        y: pacmanVelocity
                    }},
                    rectangle: border
                })) {
                    pacman.velocity.y = 0
                    break
                } else {
                    pacman.velocity.y = pacmanVelocity
                }
            }
        }
        else if (keys.right.pressed && lastKey === 'right') {
            for (let i = 0; i < borders.length; i++) {
                const border = borders[i]
                if (pacmanCollision({
                    circle: {...pacman, velocity: {
                        x: pacmanVelocity,
                        y: 0
                    }},
                    rectangle: border
                })) {
                    pacman.velocity.x = 0
                    break
                } else {
                    pacman.velocity.x = pacmanVelocity
                }
            }
        }
        if (pacman.position.x < -40) {
            pacman.position.x = 760
        }
        if (pacman.position.x > 760) {
            pacman.position.x = -40
        }
    }
    
    //dessin des vies
    for (let i = 0; i < pacman.lives - 1; i++) {
        c.beginPath()
        c.arc((1 + 2*i)/2 * Border.width, 45/2 * Border.height,pacman.radius, 0, 2*Math.PI)
        c.fillStyle = pacman.color
        c.fill()
        c.closePath()
    }

    //nouveau fantôme entre en jeu    
    ghosts.forEach((ghost, i) => {
        ghost.update()
        if (started) {
            if (ghost.playing) {
                playingGhosts.push(ghost)
                ghosts.splice(i,1)
            }
        }
    })
    
    //pacman mange dots
    for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i]
        dot.draw()

        if (started) {
            if (Math.hypot(dot.position.x - pacman.position.x, dot.position.y - pacman.position.y) < dot.radius + pacman.radius) {
                //pacmanEatDot.play()
                dots.splice(i, 1)
                score1 += 10
                score.innerHTML = score1
            }
        }
    }

    //vérifie collisions pacman / ghost
    for (let i = playingGhosts.length - 1; i >= 0; i--) {
        const ghost = playingGhosts[i]
        if (Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y) < ghost.radius + pacman.radius) {
            if (ghost.scared) {
                score1 += 200
                score.innerHTML = score1
                playingGhosts.splice(i,1)
                ghosts.push(new Ghost({
                    position : {
                        x: Border.width * 19/2,
                        y: Border.height * 19/2,
                    },
                    velocity: {
                        x: ghostVelocity,
                        y: 0
                    },
                    color : ghost.color,
                    isFree : false,
                    delay : 2000,
                    playing : false
                }))
            
            }
            else {
                cancelAnimationFrame(animationId)
                pacman.lives--
                if (pacman.lives !== 0) {
                    setTimeout(() => {
                        pacman.position.x = 3/2 * Border.width
                        pacman.position.y = 3/2 * Border.height
                        pacman.velocity.x = 0
                        pacman.velocity.y = 0
                        setupGhosts()
                        requestAnimationFrame(animate)
                    },3000)
                }
                else {
                    console.log("perdu")
                }
            }
        }
    }

    //pacman mange powerup
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        if (started) {
            if (Math.hypot(powerUp.position.x - pacman.position.x, powerUp.position.y - pacman.position.y) < powerUp.radius + pacman.radius) {
                powerUps.splice(i, 1)
                pacmanVelocity = 1.5
                setTimeout(() => {
                    pacmanVelocity = 1
                }, 7000)
                playingGhosts.forEach((ghost => {
                    ghost.scared = true
                    setTimeout(() => {
                        ghost.scared = false
                        ghost.blink = false
                    }, 7000)
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => {
                            ghost.blink = !ghost.blink
                        }, 5000 + i * 250)
                    }
                }))
            }
        }
    }

    //vérife collision pacman / bordure
    borders.forEach((border) => {
        border.draw()

        if (started) {
            if (pacmanCollision({
                circle: pacman,
                rectangle: border
            })) 
            {
                pacman.velocity.x = 0
                pacman.velocity.y = 0
            } 
        }
    })
    
    pacman.update()
    
    //parcourt la liste de playingGhosts
    playingGhosts.forEach((ghost) => {
        ghost.update()

        if (started) {
            const collisions = [] //liste des bordures adjacentes au ghost

            //vérifie collisions borudres / ghost et l'ajoute à collisions
            borders.forEach((border) => {
                if (!collisions.includes('right') && pacmanCollision({
                    circle: {...ghost, velocity: {
                        x: ghostVelocity,
                        y: 0
                    }},
                    rectangle: border
                })) {
                    collisions.push('right')
                }
                if (!collisions.includes('left') && pacmanCollision({
                    circle: {...ghost, velocity: {
                        x: -ghostVelocity,
                        y: 0
                    }},
                    rectangle: border
                })) {
                    collisions.push('left')
                }
                if (!collisions.includes('up') && pacmanCollision({
                    circle: {...ghost, velocity: {
                        x: 0,
                        y: -ghostVelocity
                    }},
                    rectangle: border
                })) {
                    collisions.push('up')
                }
                if (!collisions.includes('down') && pacmanCollision({
                    circle: {...ghost, velocity: {
                        x: 0,
                        y: ghostVelocity
                    }},
                    rectangle: border
                })) {
                    collisions.push('down')
                }
            })
            if (collisions.length > ghost.prevCollisions.length) {
                ghost.prevCollisions = collisions
            }
            if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
                if (ghost.velocity.x > 0) {
                    ghost.prevCollisions.push('right')
                }
                else if (ghost.velocity.x < 0) {
                    ghost.prevCollisions.push('left')
                }
                else if (ghost.velocity.y > 0) {
                    ghost.prevCollisions.push('down')
                }
                else if (ghost.velocity.y < 0) {
                    ghost.prevCollisions.push('up')
                }

                //ajoute nouvelle direction possible
                const pathways = ghost.prevCollisions.filter((collision) => {
                        return !collisions.includes(collision)
                })
                //choisi une nouvelle direction pour le ghost
                if (ghost.position.x < 0) {
                    direction = (direction === 'right')?('right'):('left')
                }
                else if (ghost.position.x > 740) {
                    direction = (direction === 'left')?('left'):('right')
                }
                else if (ghost.position.x > -40 && ghost.position.x < 780) {
                    direction = pathways[Math.floor(Math.random() * pathways.length)]
                }
                switch (direction) {
                    case 'down':
                        ghost.velocity.y = ghostVelocity
                        ghost.velocity.x = 0
                        break
                    case 'up':
                        ghost.velocity.y = -ghostVelocity
                        ghost.velocity.x = 0
                        break
                    case 'left':
                        ghost.velocity.x = -ghostVelocity
                        ghost.velocity.y = 0
                        break
                    case 'right':
                        ghost.velocity.x = ghostVelocity
                        ghost.velocity.y = 0
                        break
                }
                if (ghost.position.x < 0) {
                    ghost.position.x = 740
                    direction = 'left'
                }
                if (ghost.position.x > 740) {
                    ghost.position.x = 0
                    direction = 'right'
                }
                ghost.prevCollisions = []
            }
        }
    })

    //win condition
    if (dots.length === 0) {
        cancelAnimationFrame(animationId)
        console.log("gagné")
    }
}

animate()

//détection touches pressées
window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'ArrowUp':
            keys.up.pressed = true
            lastKey = 'up'
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            lastKey = 'left'
            break
        case 'ArrowDown':
            keys.down.pressed = true
            lastKey = 'down'
            break
        case 'ArrowRight':
            keys.right.pressed = true
            lastKey = 'right'
            break
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowUp':
            keys.up.pressed = false
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'ArrowDown':
            keys.down.pressed = false
            break
        case 'ArrowRight':
            keys.right.pressed = false
            break
    }
})


