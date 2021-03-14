// Required

const {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  join_update_neighbours,
  join_general_case,
  depart
} = require('./functions.js')

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

// Juice
const ME = process.argv[2]
const BOOTSTRAP = 'localhost:3000'

const separator = ME.indexOf(':')
const MY_IP = ME.slice(0, separator)
const MY_PORT = ME.slice(separator + 1)
const MY_HASH = sha1(ME)
console.log('My hash:', MY_HASH)

if (ME == BOOTSTRAP) {
  // Bootstrap

  set_previous(BOOTSTRAP)
  set_next(BOOTSTRAP)

  io.on('connection', (socket) => {
    // On Connection

    socket.on('join', ({ joiner }) => {
      // On Join

      if (get_next() == BOOTSTRAP) {
        // Special case: Only bootstrap in the network

        // Joiner next/previous is bootstrap
        socket = client_io.connect('http://' + joiner)
        socket.emit('join_response', { joiner_previous: BOOTSTRAP, joiner_next: BOOTSTRAP })

        // Bootstrap next/previous is joiner
        set_previous(joiner)
        set_next(joiner)
        show_neighbours()

      } else {
        // General case

        join_general_case(joiner, ME);
      }
    })

    join_update_neighbours(socket)

  })
} else {
  // Non bootstrap

  // Join request to bootstrap
  bootstrap_socket = client_io.connect('http://' + BOOTSTRAP)
  bootstrap_socket.emit('join', { joiner:ME })

  io.on('connection', (socket) => {

    socket.on('join_response', ({ joiner_previous, joiner_next }) => {
      // On Join Response

      set_previous(joiner_previous)
      set_next(joiner_next)
      show_neighbours()
    })

    socket.on('join_forward', ({ joiner }) => {
      // On Join Forward

      console.log('They sent me this guy:', joiner)
      join_general_case(joiner, ME);
    })

    socket.on('depart', () => {
      // On Depart
      console.log('depart')

      depart()
    })

    join_update_neighbours(socket)

  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on port:${MY_PORT}`)
})
