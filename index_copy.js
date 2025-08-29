// Draw Pac-Man circles for each remaining life below the grid
function drawLives() {
    const radius = 15;
    const spacing = 40;
    // Position below the grid: y is just below the last row
    const y = Boundary.height * 13 + 30;
    // Start x a bit in from the left
    const startX = Boundary.width + radius;
    for (let i = 0; i < livesRemaining - 1; i++) {
        const x = startX + i * spacing;
        c.save();
        c.beginPath();
        // Draw Pac-Man facing right, mouth open
        c.arc(x, y, radius, 0.25 * Math.PI, 1.75 * Math.PI, false);
        c.lineTo(x, y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    }
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(canvas)

const score = document.querySelector('#score')
console.log(score)

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image, type = 'wall'}) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image      // passed through constructor
        this.type = type
    }

    draw() {
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// add a Pac-man by creating a Player class
class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75     // open mouth
        this.openRate = 0.12
        this.rotation = 0   // facing right by default
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)   // rotate from center of Pac-man
        c.rotate(this.rotation)        // global canvas function
        // rotate back
        c.translate(-this.position.x, -this.position.y)
        // beginPath is built-in
        // start at 0
        c.beginPath()
        //c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)    // changing start angle and end angle will not draw full circle!
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)      // to center of player
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    // add function called update that will change position
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // code for opening and closing mouth animation
        if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

        this.radians += this.openRate
    }
}

// copy of Player
class Pellet {
    constructor({ position, velocity }) {
        this.position = position
        //this.velocity = velocity      // pellets don't move
        this.radius = 3
    }

    draw() {
        // beginPath is built-in
        // start at 0
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#FFE5B4'
        c.fill()
        c.closePath()
    }

    // no update function because they don't move
}

class PowerUp {
    constructor({ position, velocity }) {
        this.position = position
        //this.velocity = velocity      // pellets don't move
        this.radius = 8
    }

    draw() {
        // beginPath is built-in
        // start at 0
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#FFE5B4'
        c.fill()
        c.closePath()
    }

    // no update function because they don't move
}

/*class Ghost {
    static speed = 2    // outside constructor
    constructor({ position, velocity, color = 'red' }) {
        this.position = position
        this.startingPosition = {...position}       // stores starting position, useful for respawn
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw() {
        // beginPath is built-in
        // start at 0
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color     // blue if true; else initial color
        c.fill()
        c.closePath()
    }

    // add function called update that will change position
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}*/

class Ghost {
    static speed = 2    // outside constructor
    constructor({ name, position, velocity, image, scaredImage, state }) {
        this.name = name
        this.position = position
        this.startingPosition = {...position}       // stores starting position, useful for respawn
        this.velocity = velocity
        this.radius = 12
        //this.color = color
        this.prevCollisions = []
        this.scared = false
        this.speed = this.scared ? 1 : 2
        this.image = image      // passed through constructor
        this.scaredImage = scaredImage
        this.state = state   // options: 'moveHorizontal', 'moveUp', 'normal'
    }

    draw() {
        // beginPath is built-in
        // start at 0
        //c.beginPath()
        //c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        //c.fillStyle = this.scared ? 'blue' : this.color     // blue if true; else initial color
        //c.fill()
        //c.closePath()
        //c.drawImage(this.image, this.position.x, this.position.y)
        const imageToDraw = this.scared ? this.scaredImage : this.image
        //c.drawImage(imageToDraw, this.position.x, this.position.y)      // this line draws the image with the top-left corner at this.position.x, this.position.y
        c.drawImage(
            imageToDraw,
            this.position.x - imageToDraw.width / 2,
            this.position.y - imageToDraw.height / 2
        )       // this block should center the center of the sprite at this.position.x, this.position.y
    }

    // add function called update that will change position
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // test
        this.radius = Math.abs(this.velocity.x) > 0 ? 11 : 14
    }
}

// arrays
const modal = document.getElementById('pause-modal')
const pellets = []
const boundaries = []
const powerups = []
const ghosts = [
    new Ghost({
        name: 'red',
        position: {
            //x: Boundary.width * 6 + Boundary.width / 2,
            //y: Boundary.height + Boundary.height / 2
            x: Boundary.width * 5 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2
        },
        velocity: {
            //x: Ghost.speed,
            x: 0,
            y: -Ghost.speed
        },
        image: createImage('./img/red-ghost-transparent-up.png'),
        scaredImage: createImage('./img/scared-ghost-transparent.png'),
        state: 'moveUp'
    }),
    new Ghost({
        name: 'pink',
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            //y: Boundary.height * 3 + Boundary.height / 2
            y: Boundary.height * 6 + Boundary.height / 2
        },
        velocity: {
            //x: Ghost.speed,
            x: -Ghost.speed,
            y: 0
        },
        image: createImage('./img/pink-ghost-transparent-up.png'),
        scaredImage: createImage('./img/scared-ghost-transparent.png'),
        state: 'moveHorizontal'
    }),
    new Ghost({
        name: 'blue',
        position: {
            //x: Boundary.width * 4 + Boundary.width / 2,
            //y: Boundary.height * 9 + Boundary.height / 2
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height * 6 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            //y: -Ghost.speed
            y: 0
        },
        image: createImage('./img/blue-ghost-transparent-up.png'),
        scaredImage: createImage('./img/scared-ghost-transparent.png'),
        state: 'moveHorizontal'
    })
]

// add new player
const player = new Player({
    position: {
        // dynamic so that it is perfectly within boundary
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const keys = {
    w: {
        // by default
        pressed: false
    },
    a: {
        // by default
        pressed: false
    },
    s: {
        // by default
        pressed: false
    },
    d: {
        // by default
        pressed: false
    },
    ArrowUp: {
        // by default
        pressed: false
    },
    ArrowLeft: {
        // by default
        pressed: false
    },
    ArrowDown: {
        // by default
        pressed: false
    },
    ArrowRight: {
        // by default
        pressed: false
    },
    space: {
        // by default
        pressed: false
    }
}

// let instead of const so you can edit within functions
let lastKey = ''    // empty string by default
let scoreVar = 0    // default
let oldScore = 0
let prevMultipleOfTenThousand = 0
let newMultipleOfTenThousand = 0
let ghostsEatenDuringPowerup = 0       // will come into use later
let livesRemaining = 3
let level = 1

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

function setMap() {
    //boundaries = []
    //powerups = []
    //pellets = []

    const map = [
    ['1', '=', '=', '=', '=', '=', '=', '=', '=', '=', '2'],
    ['|', 'q', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'o', ' ', '[', 't', ']', ' ', 'o', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '[', ']', ' ', 'v', ' ', '[', ']', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'o', ' ', 'a', 'b', 'c', ' ', 'o', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', '[', ']', ' ', 'n', ' ', '[', ']', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', '|'],
    ['|', ' ', 'o', ' ', '[', '_', ']', ' ', 'o', ' ', '|'],
    ['|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'p', '|'],
    ['4', '=', '=', '=', '=', '=', '=', '=', '=', '=', '3']
]



const image = new Image()
//image.src = './img/pipeHorizontal.png'

map.forEach((row, index) => {
    row.forEach((symbol, j) => {
        console.log(symbol)
        switch (symbol) {
            case "=":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeHorizontal.png')
                    })
                )
                break
            case "|":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeVertical.png')
                    })
                )
                break
            case "1":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeCorner1.png')
                    })
                )
                break
            case "2":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeCorner2.png')
                    })
                )
                break
            case "3":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeCorner3.png')
                    })
                )
                break
            case "4":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeCorner4.png')
                    })
                )
                break
            case "o":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/block.png')
                    })
                )
                break
            case "[":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capLeft.png')
                    })
                )
                break
            case "]":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capRight.png')
                    })
                )
                break
            case "t":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeConnectorBottom.png')
                    })
                )
                break
            case "u":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capBottom.png')
                    })
                )
                break
            case "_":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeConnectorTop.png')
                    })
                )
                break
            case "n":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capTop.png')
                    })
                )
                break
            case "x":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeCross.png')
                    })
                )
                break
            case " ":
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width /2,
                            y: Boundary.height * index + Boundary.height /2     // add this Boundary.__/2 to center pellets
                        }
                    })
                )
                break
            case "p":
                powerups.push(
                    new PowerUp({
                        position: {
                            x: Boundary.width * j + Boundary.width /2,
                            y: Boundary.height * index + Boundary.height /2     // add this Boundary.__/2 to center pellets
                        }
                    })
                )
                break
            case "a":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capLeft.png'),
                        type: 'ghostBox'
                    })
                )
                break
            case "c":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capRight.png'),
                        type: 'ghostBox'
                    })
                )
                break
            case "b":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/pipeConnectorTop.png'),
                        type: 'ghostBox'
                    })
                )
                break
            case "v":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        },
                        image: createImage('./img/capBottom.png'),
                        type: 'aboveWall'
                    })
                )
                break
        }
    })
})

}

setMap()

function circleToRectangleCollision({
    circle,
    rectangle
}) {
    // to account for different speeds
    const padding = Boundary.width /2 - circle.radius - 1   // at least 1 pixel
    return (
        // detect if any boundary is overlapping the player -- circular-to-rectangular collision detection
        // issue: player position point is directly in the center
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
        // if top of player is overlapping with bottom of boundary, etc.
    )
}

function setupForExit(ghost) {
    if (ghost.name === 'blue') {
        ghost.state = 'moveHorizontal'
        ghost.velocity = { x: ghost.speed, y: 0 }
    } else if (ghost.name === 'red') {
        ghost.state = 'moveUp'
        ghost.velocity = { x: 0, y: -ghost.speed }
    } else if (ghost.name === 'pink') {
        ghost.state = 'moveHorizontal'
        ghost.velocity = { x: -ghost.speed, y: 0 }
    }
}

function resetGame(fullReset, newLevel) {
    modal.style.display = 'none' // Hide modal

    // Reset key states and lastKey
    lastKey = ''
    Object.keys(keys).forEach(k => keys[k].pressed = false)

    if (fullReset) {
        scoreVar = 0
        score.innerHTML = scoreVar
        oldScore = 0
        prevMultipleOfTenThousand = 0
        newMultipleOfTenThousand = 0

        livesRemaining = 3
        lives.innerHTML = livesRemaining

        level = 1
        document.getElementById('levelText').innerText = level
        
        // reset pellets and powerups
        setMap()   // only reset map if full reset
    }

    if (newLevel) {
        level++
        document.getElementById('levelText').innerText = level

        setMap()   // reset map for new level, but don't reset score or lives counter
    }

    // Reset player position
    player.position = {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    }
        player.velocity = {
        x: 0,
        y: 0
    }
    // Reset player rotation
    player.rotation = 0

    // Reset ghosts
    ghosts.forEach(ghost => {
        ghost.position = {...ghost.startingPosition}
        ghost.velocity = {x: 0, y: 0}
        ghost.scared = false
        ghost.image = createImage('./img/' + ghost.name + '-ghost-transparent-up.png')

        setupForExit(ghost)
    })

    animate()
}





// animation ID
let animationID

// animate
function animate() {
    animationID = requestAnimationFrame(animate)
    console.log(animationID)
    // clear canvas to remove previous position
    c.clearRect(0, 0, canvas.width, canvas.height)

    
    // move within animate function, not event listener
    // === in JS
    // predict collision before it happens
    if ((keys.w.pressed && lastKey === 'w') || (keys.ArrowUp.pressed && lastKey === 'ArrowUp')) {
        // break does not work in forEach, so refactor to regular for loop
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 0,
                    y: -4
                }},        // spread operator is ... and it allows us to edit a property
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = -4
            }
        }
        /*boundaries.forEach((boundary) => {
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 0,
                    y: -4
                }},        // spread operator is ... and it allows us to edit a property
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = -4
            }
        })*/
    } else if ((keys.a.pressed && lastKey === 'a') || (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: -4,
                    y: 0
                }},
                rectangle: boundary
            })) {
                player.velocity.x = 0       // colliding
                break
            } else {
                player.velocity.x = -4
            }
        }
    } else if ((keys.s.pressed && lastKey === 's') || (keys.ArrowDown.pressed && lastKey === 'ArrowDown')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 0,
                    y: 4
                }},
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = 4
            }
        }
    } else if ((keys.d.pressed && lastKey === 'd') || (keys.ArrowRight.pressed && lastKey === 'ArrowRight')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 4,
                    y: 0
                }},
                rectangle: boundary
            })) {
                player.velocity.x = 0       // colliding
                break
            } else {
                player.velocity.x = 4
            }
        }
    } else if (keys.space.pressed && lastKey === ' ') {
        // store player velocity and ghost velocities
        playerPausedVelocity = {...player.velocity}
        ghosts.forEach(ghost => {
            if (ghost.name === 'red')
                redPausedVelocity = {...ghost.velocity}
            if (ghost.name === 'pink')
                pinkPausedVelocity = {...ghost.velocity}
            if (ghost.name === 'blue')
                bluePausedVelocity = {...ghost.velocity}
        })

        // pause if spacebar pressed
        player.velocity.x = 0
        player.velocity.y = 0

        ghosts.forEach(ghost => {
            ghost.velocity.x = 0
            ghost.velocity.y = 0
        })

        cancelAnimationFrame(animationID)
        ghosts.forEach(ghost => {
            console.log(ghost.state)
        })

        //const modal = document.getElementById('pause-modal')
        modal.querySelector('#modal-message').textContent = 'Game Paused'
        modal.querySelector('#resume-button').style.display = 'inline'; // Show resume button
        modal.querySelector('#restart-button').style.display = 'inline'; // Show restart button
        modal.querySelector('#next-level-button').style.display = 'none'; // Hide next level button
        modal.style.display = 'block'
    }

    // detect collision between ghosts and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {      // loop from end of array
        const ghost = ghosts[i]      // grab a ghost
        ghost.radius = Math.abs(ghost.velocity.x) > 0 ? 11 : 14     //"radius" is 11 if moving in x direction; 14 if moving in y direction
        // ghost touches player
        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
            ) <
                ghost.radius + player.radius
        ) {
            if (ghost.scared) {
                //ghosts.splice(i, 1)    // current index we're looping over; has to be (i, 1) because without the 1 it removes all ghosts from index i to the end of the array (up to 3 ghosts)

                const eatenGhost = ghosts.splice(i, 1)[0]

                ghostsEatenDuringPowerup++

                switch (ghostsEatenDuringPowerup) {
                    case 1:
                        oldScore = scoreVar
                        scoreVar += 200
             
                        prevMultipleOfTenThousand = Math.floor(oldScore / 10000)
                        newMultipleOfTenThousand = Math.floor(scoreVar / 10000)

                        if (newMultipleOfTenThousand > prevMultipleOfTenThousand) {
                            livesRemaining += 1  // new life
                            document.getElementById('lives').innerText = livesRemaining
                            // then draw a new Pac-Man at the bottom by default
                        }
                        break
                    case 2:
                        oldScore = scoreVar
                        scoreVar += 400

                        prevMultipleOfTenThousand = Math.floor(oldScore / 10000)
                        newMultipleOfTenThousand = Math.floor(scoreVar / 10000)

                        if (newMultipleOfTenThousand > prevMultipleOfTenThousand) {
                            livesRemaining += 1  // new life
                            document.getElementById('lives').innerText = livesRemaining
                            // then draw a new Pac-Man at the bottom by default
                        }
                        break
                    case 3:
                        oldScore = scoreVar
                        scoreVar += 800

                        prevMultipleOfTenThousand = Math.floor(oldScore / 10000)
                        newMultipleOfTenThousand = Math.floor(scoreVar / 10000)

                        if (newMultipleOfTenThousand > prevMultipleOfTenThousand) {
                            livesRemaining += 1  // new life
                            document.getElementById('lives').innerText = livesRemaining
                            // then draw a new Pac-Man at the bottom by default
                        }
                        break
                    case 4:     // this condition will never be hit unless I add another ghost
                        oldScore = scoreVar
                        scoreVar += 1600

                        prevMultipleOfTenThousand = Math.floor(oldScore / 10000)
                        newMultipleOfTenThousand = Math.floor(scoreVar / 10000)

                        if (newMultipleOfTenThousand > prevMultipleOfTenThousand) {
                            livesRemaining += 1  // new life
                            document.getElementById('lives').innerText = livesRemaining
                            // then draw a new Pac-Man at the bottom by default
                        }
                        break
                }

                score.innerHTML = scoreVar

                // respawn after delay
                eatenGhost.velocity = {x: 0, y: 0 }     // stop movement of eaten ghost
                setTimeout(() => {
                    eatenGhost.position = {...eatenGhost.startingPosition}
                    eatenGhost.scared = false
                    eatenGhost.prevCollisions = []
                    eatenGhost.speed = 2    // reset speed to normal
                    eatenGhost.image = createImage('./img/' + eatenGhost.name + '-ghost-transparent-up.png')
                    console.log(eatenGhost.image)
                    console.log('respawning ' + eatenGhost.name + ' ghost')
                    // pause after respawn?
                    eatenGhost.velocity = { x: 0, y: 0 }
                    setTimeout(() => {
                        setupForExit(eatenGhost)
                        /*if (eatenGhost.name === 'blue')
                        {
                            eatenGhost.velocity = { x: 0, y: -eatenGhost.speed }
                        } else {
                            eatenGhost.velocity = { x: eatenGhost.speed, y: 0 }
                        }*/
                    }, 500)
                    ghosts.push(eatenGhost)
                }, 4000)        // respawn 4s after eaten
            } /*else {
                // touch ghost that isn't scared
                cancelAnimationFrame(animationID)
                console.log('player touched normal ghost')
                //livesRemaining -= 1
                //document.getElementById('lives').innerText = livesRemaining
                
                //const
                //modal = document.getElementById('pause-modal');
                if (modal) {
                    modal.querySelector('#modal-message').textContent = 'You Lose!';
                    modal.querySelector('#resume-button').style.display = 'none'; // Hide resume button
                    modal.style.display = 'block';
                }
            }*/
        }
    }

    // win condition
    if (pellets.length === 0) {
        cancelAnimationFrame(animationID)
        console.log('you win!!!!!!!!!!')

        //const
        //modal = document.getElementById('pause-modal');
        if (modal) {
            modal.querySelector('#modal-message').textContent = 'Good Job!';
            modal.querySelector('#resume-button').style.display = 'none'; // Hide resume button
            modal.querySelector('#restart-button').style.display = 'inline'; // Show restart button
            modal.querySelector('#next-level-button').style.display = 'inline'; // Show next level button
            modal.style.display = 'block';
        }
    }

    // render powerup
    for (let i = powerups.length - 1; 0 <= i; i--) {
        const powerup = powerups[i]
        powerup.draw()

        // player collides with powerup
        if (
            Math.hypot(
                powerup.position.x - player.position.x,
                powerup.position.y - player.position.y
            ) <
            powerup.radius + player.radius
        ) {
            powerups.splice(i, 1)
            ghostsEatenDuringPowerup = 0    // reset counter as soon as a powerup is collected

            // make ghosts scared
            ghosts.forEach(ghost => {
                ghost.scaredImage = createImage('./img/scared-ghost-transparent.png')
                ghost.scared = true
                ghost.speed = 1     // scared ghosts should slow down

                // ghost blue for 4 seconds, then alternate between white and black
                setTimeout(() => {
                    // ChatGPT addition here
                    const alt1 = createImage('./img/scared-ghost-transparent-alternate.png')
                    const alt2 = createImage('./img/scared-ghost-transparent-alternate2.png')

                    // start with alternate1 (white)
                    ghost.scaredImage = alt1
                    let toggle = false      // toggle variable

                    // blink every 200 ms
                    const blinkInterval = setInterval(() => {
                        ghost.scaredImage = toggle ? alt1 : alt2
                        toggle = !toggle
                    }, 300)

                    //stop blinking after 2.5s (total scared time is 6s)
                    setTimeout(() => {
                        clearInterval(blinkInterval)
                    }, 2500)

                    //ghost.scaredImage = createImage('./img/scared-ghost-transparent-alternate.png')
                }, 3500)    // switch to alternate scared image (scared still === true) after 3.5s
                
                setTimeout(() => {
                    ghost.scared = false
                    ghost.speed = 2    // reset speed to normal
                    console.log(ghost.name + ' is scared? ' + ghost.scared)
                }, 6000)       // switch back to normal after 2 more seconds (scared for 6 total seconds)
            })
        }
    }

    // run through loop backwards (prevents flashing/rendering issue)
    for (let i = pellets.length - 1; 0 <= i; i--)
    {
        const pellet = pellets[i]       // no weird rendering issues
        pellet.draw()

        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) <
            pellet.radius + player.radius
        ) {
            console.log('player touching pellet')
            pellets.splice(i, 1)
            // update score
            oldScore = scoreVar
            scoreVar += 10
            score.innerHTML = scoreVar

            prevMultipleOfTenThousand = Math.floor(oldScore / 10000)
            newMultipleOfTenThousand = Math.floor(scoreVar / 10000)

            if (newMultipleOfTenThousand > prevMultipleOfTenThousand) {
                livesRemaining += 1  // new life
                document.getElementById('lives').innerText = livesRemaining
                // then draw a new Pac-Man at the bottom by default
            }
        }
    }


    // move in here
    boundaries.forEach((boundary) => {
    boundary.draw()

    // use reusable collision code
    if (circleToRectangleCollision({
        circle: player,
        rectangle: boundary
    }))
    {
        console.log('player colliding with boundary')
        // stop player when we hit a boundary
        player.velocity.x = 0
        player.velocity.y = 0
    }
})

player.update()

// commented out so that this isn't called every frame
/*ghosts.forEach(ghost => {
    setupForExit(ghost);
})*/

function GhostMovement() {
    
    // ghost logic
    ghosts.forEach(ghost => {

        if (ghost.state === 'moveHorizontal') {
            // detect when position is at door
            // change state to moveUp
            if ((ghost.position.x >= Boundary.width * 5 + Boundary.width / 2 && ghost.name === 'blue') || (ghost.position.x <= Boundary.width * 5 + Boundary.width / 2 && ghost.name === 'pink')) {
                ghost.state = 'moveUp'
                ghost.velocity.x = 0
                ghost.velocity.y = -ghost.speed
                //console.log ('working and ghosts stopped')
            }
        }

        if (ghost.state === 'moveUp') {
            // detect where type === 'wall'
            const aboveWall = boundaries.find(wall => wall.type === 'aboveWall')
            if (circleToRectangleCollision({
                circle: {...ghost},
                rectangle: aboveWall
            })) {
                ghost.velocity.x = 0
                ghost.velocity.y = 0
                //ghost.state = 'normal'
                //ghost.velocity.x = ghost.speed
                //ghost.velocity.y = 0
                /*setTimeout(() => {
                    ghost.state = 'normal'
                }, 500)*/
                ghost.state = 'normal'
                setTimeout(() => {
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    ghost.prevCollisions = ['up', 'down', 'left', 'right'] // Reset collisions so movement logic works
                }, 250)
                console.log(`state of ${ghost.name} is ${ghost.state}`, ghost.name, ghost.state)
            }
        }

        if (ghost.state === 'normal') {    
            //ghost.velocity.x = ghost.speed
            //ghost.velocity.y = 0
            ghost.radius = Math.abs(ghost.velocity.x) > 0 ? 11 : 14    
            if (
                    Math.hypot(
                        ghost.position.x - player.position.x,
                        ghost.position.y - player.position.y
                    ) <
                    ghost.radius + player.radius && !ghost.scared       // and ghost not scared
                ) {
                    cancelAnimationFrame(animationID)
                    console.log('you lose!')
                    livesRemaining -= 1
                    document.getElementById('lives').innerText = livesRemaining
                    //const
                    //modal = document.getElementById('pause-modal');

                    // life logic; reset unless lives <= 0
                    if (livesRemaining <= 0) {
                        modal.querySelector('#modal-message').textContent = 'Game Over';
                        modal.querySelector('#resume-button').style.display = 'none'; // Hide resume button
                        modal.querySelector('#next-level-button').style.display = 'none'; // Hide next level button
                        modal.querySelector('#restart-button').style.display = 'inline'; // Show restart button
                        modal.style.display = 'block';
                    }
                    else {
                        setTimeout(() => {
                            resetGame(false, false);   // Reset game without full reset
                        }, 1000);
                    }
                }

            // collisions array
            const collisions = []
            // detect boundaries
            boundaries.forEach(boundary => {
                if (
                    !collisions.includes('right') &&
                    circleToRectangleCollision({
                        circle: {
                            ...ghost,
                            velocity: {
                                x: ghost.speed,
                                y: 0
                            }   
                        },
                        rectangle: boundary
                    })
                ) {
                    collisions.push('right')
                }

                if (
                    !collisions.includes('left') &&
                    circleToRectangleCollision({
                        circle: {
                            ...ghost,
                            velocity: {
                                x: -4,
                                y: 0
                            }
                        },
                        rectangle: boundary
                    })
                ) {
                    collisions.push('left')
                }

                if (
                    !collisions.includes('up') &&
                    circleToRectangleCollision({
                        circle: {
                            ...ghost,
                            velocity: {
                                x: 0,
                                y: -4
                            }
                        },
                        rectangle: boundary
                    })
                ) {
                    collisions.push('up')
                }

                if (
                    !collisions.includes('down') &&
                    circleToRectangleCollision({
                        circle: {
                            ...ghost,
                            velocity: {
                                x: 0,
                                y: 4
                            }
                        },
                        rectangle: boundary
                    })
                ) {
                    collisions.push('down')
                }
            })

            if (collisions.length > ghost.prevCollisions.length)
                ghost.prevCollisions = collisions

            if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
                console.log('gogo')

                // Determine current and reverse directions
                let currentDirection = null;
                let reverseDirection = null;
                if (ghost.velocity.x > 0) {
                    currentDirection = 'right';
                    reverseDirection = 'left';
                } else if (ghost.velocity.x < 0) {
                    currentDirection = 'left';
                    reverseDirection = 'right';
                } else if (ghost.velocity.y < 0) {
                    currentDirection = 'up';
                    reverseDirection = 'down';
                } else if (ghost.velocity.y > 0) {
                    currentDirection = 'down';
                    reverseDirection = 'up';
                }

                if (currentDirection) ghost.prevCollisions.push(currentDirection);

                console.log(collisions)
                console.log(ghost.prevCollisions)

                // Build possible pathways
                let pathways = ghost.prevCollisions.filter(collision => {
                    return !collisions.includes(collision)
                });

                // If the current direction is NOT blocked, exclude the reverse direction from pathways
                if (currentDirection && !collisions.includes(currentDirection)) {
                    pathways = pathways.filter(dir => dir !== reverseDirection);
                }
                // If all other directions are blocked, allow reverse
                if (pathways.length === 0 && reverseDirection) {
                    // Only possible to go back
                    pathways = [reverseDirection];
                }

                console.log({pathways})

                // choose random path from pathways array
                const direction = pathways[Math.floor(Math.random() * pathways.length)]

                console.log({direction})

                switch (direction) {
                    case 'down':
                        ghost.velocity.y = ghost.speed
                        ghost.velocity.x = 0
                        if (ghost.name === 'red') ghost.image = createImage('./img/red-ghost-transparent-down.png')
                        else if (ghost.name === 'pink') ghost.image = createImage('./img/pink-ghost-transparent-down.png')
                        else if (ghost.name === 'blue') ghost.image = createImage('./img/blue-ghost-transparent-down.png')
                        break
                    case 'up':
                        ghost.velocity.y = -ghost.speed
                        ghost.velocity.x = 0
                        if (ghost.name === 'red') ghost.image = createImage('./img/red-ghost-transparent-up.png')
                        else if (ghost.name === 'pink') ghost.image = createImage('./img/pink-ghost-transparent-up.png')
                        else if (ghost.name === 'blue') ghost.image = createImage('./img/blue-ghost-transparent-up.png')
                        break
                    case 'right':
                        ghost.velocity.y = 0
                        ghost.velocity.x = ghost.speed
                        if (ghost.name === 'red') ghost.image = createImage('./img/red-ghost-transparent-right.png')
                        else if (ghost.name === 'pink') ghost.image = createImage('./img/pink-ghost-transparent-right.png')
                        else if (ghost.name === 'blue') ghost.image = createImage('./img/blue-ghost-transparent-right.png')
                        break
                    case 'left':
                        ghost.velocity.y = 0
                        ghost.velocity.x = -ghost.speed
                        if (ghost.name === 'red') ghost.image = createImage('./img/red-ghost-transparent-left.png')
                        else if (ghost.name === 'pink') ghost.image = createImage('./img/pink-ghost-transparent-left.png')
                        else if (ghost.name === 'blue') ghost.image = createImage('./img/blue-ghost-transparent-left.png')
                        break
                }

                // reset collision
                ghost.prevCollisions = []
            }
            //console.log(collisions)
        }

        ghost.update()  // always draw
        
    })
}

GhostMovement()

// proper rotation
if (player.velocity.x > 0) player.rotation = 0
else if (player.velocity.x < 0) player.rotation = Math.PI
else if (player.velocity.y > 0) player.rotation = Math.PI / 2
else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5

// Draw lives below the grid
drawLives();
}

animate()

//player.draw()

// listen for WASD movement indication
// we only want the key
window.addEventListener('keydown', ({key}) => {
    console.log(key)
    // respond to WASD keydown events
    switch (key) {
        case 'w':
            //player.velocity.y = -4
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            //player.velocity.x = -4
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            //player.velocity.y = 4
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            //player.velocity.x = 4
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break
        case ' ':
            keys.space.pressed = true
            lastKey = ' '
            break
    }

    console.log(player.velocity)
})

// if the restart button is pressed
const restartButton = document.getElementById('restart-button')
restartButton.addEventListener('click', () => {
    modal.style.display = 'none'
    resetGame(true, false); // Full reset
});

// if the resume button is pressed (only shows up on game pause)
const resumeButton = document.getElementById('resume-button')
resumeButton.addEventListener('click', () => {
    modal.style.display = 'none'

    keys.space.pressed = false
    //lastKey = ''

    // restore velocities
    player.velocity = {...playerPausedVelocity}
    ghosts.forEach(ghost => {
        if (ghost.name === 'red') ghost.velocity = {...redPausedVelocity}
        if (ghost.name === 'pink') ghost.velocity = {...pinkPausedVelocity}
        if (ghost.name === 'blue') ghost.velocity = {...bluePausedVelocity}
    })

    animate()
});

const nextLevelButton = document.getElementById('next-level-button')
nextLevelButton.addEventListener('click', () => {
    modal.style.display = 'none'
    resetGame(false, true) // Reset game for new level
});