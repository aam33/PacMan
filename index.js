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
}

const map = [
    ['-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-']
]

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

boundaries.forEach((boundary) => {
    boundary.draw()
})

player.draw()

// listen for WASD movement indication
// we only want the key
window.addEventListener('keydown', ({key}) => {
    console.log(event)
})