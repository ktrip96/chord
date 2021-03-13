
// Required
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const client_io = require('socket.io-client')
const sha1 = require('sha1')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})

// Juice
const IP_PORT = process.argv[2]
const HASH = sha1(IP_PORT)

const separator = IP_PORT.indexOf(':')
const IP = IP_PORT.slice(0,separator)
const PORT = IP_PORT.slice(separator+1)

const BOOTSTRAP ='localhost:3000'

// το παρακάτω γίνεται fireup, όταν στον client
// εκτελείται η γραμμή let socket = io(localhost:PORT)

if (PORT == 3000) {
  // Bootstrap

  let next = BOOTSTRAP
  let previous = BOOTSTRAP

  io.on('connection', (socket) => {

    // Call Bootstrap Join
    socket.on('join', ({IP_PORT}) => {
      if (next == BOOTSTRAP) {
        previous = IP_PORT
        next = IP_PORT
        console.log('Join In Bootstrap:', { previous, next })
        socket.emit('join_response', { previous: BOOTSTRAP, next: BOOTSTRAP })
      }

    })

    socket.on('disconnect', () => {
      console.log('Disconnected')
    })

  })
} else {
  // Non Bootstrap

  let socket = client_io.connect('http://' + BOOTSTRAP)

  socket.emit('join', { IP_PORT })

  socket.on('join_response', ( {previous,next} ) => {
      console.log('Join Response Object:', {previous,next})
  })

}

server.listen(PORT, () => {
  console.log(`Server has started on port:${PORT}`)
})

//? Πρόβλημα:
/*
    Πρέπει με κάποιο τρόπο να κρατήσουμε δεδομένα για κάθε server. 
    (π.χ. το previous, το next, τα Data κλπ.)
    Όμως έχουμε μόνο ένα αρχείο για όλους τους servers.
    - Κρατάμε ένα array που συνδέει PORTS με objects, κάνουμε import το array
    και ο κάθε κόμβος έχει πρόσβαση στο object, με array[PORT].previous π.χ
*/
