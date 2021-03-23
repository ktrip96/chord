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
  show_event,
  hit_node,
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
      show_event('join', { joiner })

      if (get_next() == BOOTSTRAP) {
        // Special case: only bootstrap is in the network, make 2 node network

        hit_node({
          node: joiner,
          event_: 'join_response',
          to_emit: { joiner_previous: BOOTSTRAP, joiner_next: BOOTSTRAP }
        })

        set_previous(joiner)
        set_next(joiner)
        show_neighbours()

      } else {
        join_general(joiner, ME)
      }
    })

    common_to_all(socket, ME)

  })
} else {
  // Non bootstrap code

  hit_node({
    node: BOOTSTRAP,
    event_: 'join',
    to_emit: { joiner:ME }
  })

  io.on('connection', (socket) => {

    socket.on('join_response', ({ joiner_previous, joiner_next }) => {
      show_event('join_response', { joiner_previous, joiner_next })

      set_previous(joiner_previous)
      set_next(joiner_next)

      show_neighbours()
    })

    socket.on('forward_join', ({ joiner }) => {
      show_event('forward_join', { joiner })

      join_general(joiner, ME)
    })

    socket.on('depart', () => {
      show_event('depart', {})

      depart()
    })

    common_to_all(socket, ME)

  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on port:${MY_PORT}`)
})
