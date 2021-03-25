// required
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

// my consts
const {
  set_previous,
  set_next,
  get_previous,
  get_next,
  get_front_socket,
  show_neighbours,
  show_event,
  hit_node,
  join_general_case,
  common_to_all,
  depart
} = require('./functions.js')

const ME = process.argv[2]
const BOOTSTRAP = '192.168.1.71:5000'

const separator = ME.indexOf(':')
const MY_PORT = ME.slice(separator + 1)
const MY_HASH = sha1(ME)
console.log('My hash:', MY_HASH)

if (ME == BOOTSTRAP) {
  // Bootstrap code: Initially next = previous = BOOTSTRAP

  set_previous(BOOTSTRAP)
  set_next(BOOTSTRAP)

  io.on('connection', (socket) => {

    socket.on('join', ({ joiner }) => {
      show_event('join', { joiner })

      // get_front_socket().emit('front_join', { joiner })

      if (get_next() == BOOTSTRAP) {
        // Special case: only bootstrap is in the network, make 2 node network
        hit_node({
          node: joiner,
          event_: 'join_response',
          object: { joiner_previous: BOOTSTRAP, joiner_next: BOOTSTRAP }
        })
        set_previous(joiner)
        set_next(joiner)
        show_neighbours()
      } else {
        join_general_case(joiner, ME)
      }

    })

    common_to_all(socket, ME)

  })
} else {
  // Non bootstrap code: Begin by asking BOOTSTRAP to join

  hit_node({
    node: BOOTSTRAP,
    event_: 'join',
    object: { joiner:ME }
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
      join_general_case(joiner, ME)
    })

    socket.on('depart', () => {
      show_event('depart', {})
      depart()
    })

    common_to_all(socket, ME)

  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on: ${ME}`)
})
