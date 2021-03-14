// Required

const {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  join_set,
  join_general_case
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
const MY_IP = ME.slice(0,separator)
const MY_PORT = ME.slice(separator+1)
const MY_HASH = sha1(ME)
console.log('My hash:', MY_HASH)

if (ME == BOOTSTRAP) {
  // Bootstrap

  set_previous(BOOTSTRAP)
  set_next(BOOTSTRAP)

  io.on('connection', (socket) => {
    // On Connection

    socket.on('join', ({join_ip_port}) => {
      // On Join

      if (get_next() == BOOTSTRAP) {
        // Special case: Only BOOTSTRAP in the network

        // 1st joiner next/previous is BOOTSTRAP
        socket = client_io.connect('http://' + join_ip_port)
        socket.emit('join_response', { join_previous: BOOTSTRAP, join_next: BOOTSTRAP })

        // Bootstrap next/previous is 1st joiner
        set_previous(join_ip_port)
        set_next(join_ip_port)
        show_neighbours()

      } else {
        join_general_case(join_ip_port, ME);
      }
    })

    join_set(socket)
  })
} else {
  // Non Bootstrap

  // Join
  bootstrap_socket = client_io.connect('http://' + BOOTSTRAP)
  bootstrap_socket.emit('join', { join_ip_port:ME })

  io.on('connection', (socket) => {
    // On Connection

    socket.on('join_response', ({ join_previous, join_next }) => {
      // On Join Response

      set_previous(join_previous)
      set_next(join_next)
      show_neighbours()
    })

    socket.on('join_forward', ({ join_ip_port }) => {
      // On Join Forward

      console.log('They sent me this guy:', join_ip_port)
      join_general_case(join_ip_port, ME);
    })

    join_set(socket)
  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on port:${MY_PORT}`)
})
