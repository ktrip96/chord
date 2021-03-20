// Required
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const client_io = require('socket.io-client')
const sha1 = require('sha1')

const server = http.createServer(express())
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})

// Consts
const {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  emit_to_node,
  join_general,
  common_to_all,
  depart
} = require('./functions.js')

const ME = process.argv[2]
const BOOTSTRAP = 'localhost:3000'

const separator = ME.indexOf(':')
const MY_IP = ME.slice(0, separator)
const MY_PORT = ME.slice(separator + 1)
const MY_HASH = sha1(ME)
console.log('My hash:', MY_HASH)

// Juice
if (ME == BOOTSTRAP) {
  // Bootstrap code

  set_previous(BOOTSTRAP)
  set_next(BOOTSTRAP)

  io.on('connection', (socket) => {

    socket.on('join', ({ joiner }) => {
      // On Join

      if (get_next() == BOOTSTRAP) {
        // On special case where only bootstrap is in the network, make 2 node network

        emit_to_node({
          node: joiner,
          event_: 'join_response',
          to_emit: { joiner_previous: BOOTSTRAP, joiner_next: BOOTSTRAP }
        })

        set_previous(joiner)
        set_next(joiner)
        show_neighbours()

      } else {
        // On general case, call the join general case function

        join_general(joiner, ME)
      }
    })

    common_to_all(socket, ME)

  })
} else {
  // Non bootstrap code

  // Send join request to bootstrap
  emit_to_node({
    node: BOOTSTRAP,
    event_: 'join',
    to_emit: { joiner:ME }
  })

  io.on('connection', (socket) => {

    socket.on('join_response', ({ joiner_previous, joiner_next }) => {
      // On join response, set neighbours

      set_previous(joiner_previous)
      set_next(joiner_next)

      show_neighbours()
    })

    socket.on('join_forward', ({ joiner }) => {
      // On join forward, call join general case function

      console.log('They sent me this guy:', joiner)
      join_general(joiner, ME)
    })

    socket.on('depart', () => {
      // On depart, call depart function

      console.log('depart')
      depart()
    })

    common_to_all(socket, ME)

  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on port:${MY_PORT}`)
})
