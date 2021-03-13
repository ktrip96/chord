const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const client_io = require('socket.io-client')
const { nextTick } = require('process')

// Με την εντολή process.argv, έχω πρόσβαση στα arguments που δίνω στο τέρμιναλ

const PORT = process.argv[2] || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})

// το παρακάτω γίνεται fireup, όταν στον client
// εκτελείται η γραμμή let socket = io(localhost:PORT)

io.on('connection', (socket) => {
  console.log('We have a new connection')

  socket.emit('message', { message: 'hello!!!' })

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
})

//* Client Code
if (PORT != 3000) {
  let socket = client_io.connect('http://localhost:3000')
  socket.on('message', () => {
    console.log('Someone send a message to me')
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
