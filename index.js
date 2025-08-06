const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(canvas)

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

// add a Pac-man by creating a Player class
class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        // beginPath is built-in
        // start at 0
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    // add function called update that will change position
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}



const boundaries = []
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

// let instead of const
let lastKey = ''    // empty string by default

const map = [
    ['-', '-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-']
]

map.forEach((row, index) => {
    row.forEach((symbol, j) => {
        console.log(symbol)
        switch (symbol) {
            case "-":
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * index
                        }
                    })
                )
                break
        }
    })
})


function circleToRectangleCollision({
    circle,
    rectangle
}) {
    return (
        // detect if any boundary is overlapping the player -- circular-to-rectangular collision detection
        // issue: player position point is directly in the center
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
        // if top of player is overlapping with bottom of boundary, etc.
    )
}

// animate
function animate() {
    requestAnimationFrame(animate)
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
                    y: -5
                }},        // spread operator is ... and it allows us to edit a property
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = -5
            }
        }
        /*boundaries.forEach((boundary) => {
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 0,
                    y: -5
                }},        // spread operator is ... and it allows us to edit a property
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = -5
            }
        })*/
    } else if ((keys.a.pressed && lastKey === 'a') || (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: -5,
                    y: 0
                }},
                rectangle: boundary
            })) {
                player.velocity.x = 0       // colliding
                break
            } else {
                player.velocity.x = -5
            }
        }
    } else if ((keys.s.pressed && lastKey === 's') || (keys.ArrowDown.pressed && lastKey === 'ArrowDown')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 0,
                    y: 5
                }},
                rectangle: boundary
            })) {
                player.velocity.y = 0       // colliding
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if ((keys.d.pressed && lastKey === 'd') || (keys.ArrowRight.pressed && lastKey === 'ArrowRight')) {
        for (let i = 0; i < boundaries.length; i++)
        {
            const boundary = boundaries[i]
            if (circleToRectangleCollision({
                circle: {...player, velocity: {
                    x: 5,
                    y: 0
                }},
                rectangle: boundary
            })) {
                player.velocity.x = 0       // colliding
                break
            } else {
                player.velocity.x = 5
            }
        }
    } else if (keys.space.pressed && lastKey === ' ') {
        // pause if spacebar pressed
        player.velocity.x = 0
        player.velocity.y = 0
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
        console.log('we are colliding')
        // stop player when we hit a boundary
        player.velocity.x = 0
        player.velocity.y = 0
    }
})

player.update()
// clear before checking to see which keys pressed
//player.velocity.x = 0
//player.velocity.y = 0


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
            //player.velocity.y = -5
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            //player.velocity.x = -5
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            //player.velocity.y = 5
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            //player.velocity.x = 5
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