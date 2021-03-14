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

// Juice
const ME = process.argv[2]
const BOOTSTRAP = 'localhost:3000'

const separator = ME.indexOf(':')
const MY_IP = ME.slice(0,separator)
const MY_PORT = ME.slice(separator+1)
const MY_HASH = sha1(ME)

if (ME == BOOTSTRAP) {
  // Bootstrap

  previous = BOOTSTRAP
  previous_hash = MY_HASH
  next = BOOTSTRAP
  next_hash = MY_HASH

  io.on('connection', (socket) => {
    // On Connection

    socket.on('join', ({join_ip_port}) => {
      // On Join

      if (next == BOOTSTRAP) {
        // Special case: Only BOOTSTRAP in the network

        // 1st joiner next/previous is BOOTSTRAP
        socket = client_io.connect('http://' + join_ip_port)
        socket.emit('join_response', { join_previous: BOOTSTRAP, join_next: BOOTSTRAP })

        // Bootstrap next/previous is 1st joiner
        hash = sha1(join_ip_port)
        previous = join_ip_port
        previous_hash = hash
        next = join_ip_port
        next_hash = hash
        show_neighbours(previous, next)

      } else {
        join_general_case(join_ip_port, previous_hash, next_hash, previous, next);
      }
    })

    socket.on('join_update_previous', ({ new_previous }) => {
      previous = new_previous
      show_neighbours(previous, next)
    })

    socket.on('join_update_next', ({ new_next }) => {
      next = new_next
      show_neighbours(previous, next)
    })
  })
} else {
  // Non Bootstrap

  previous = null
  previous_hash = null
  next = null
  next_hash = null

  bootstrap_socket = client_io.connect('http://' + BOOTSTRAP)

  bootstrap_socket.emit('join', { join_ip_port:ME })

  io.on('connection', (socket) => {
    // On Connection

    socket.on('join_response', ({ join_previous, join_next }) => {
      // On Join Response

      previous = join_previous
      next = join_next
      show_neighbours(previous, next)
      bootstrap_socket.close()
    })

    socket.on('join_forward', ({ join_ip_port }) => {
      // On Join Forward

      console.log('They sent me this guy:', join_ip_port)
      join_general_case(join_ip_port, previous_hash, next_hash, previous, next);
    })

    socket.on('join_update_previous', ({ new_previous }) => {
      previous = new_previous
      show_neighbours(previous, next)
    })

    socket.on('join_update_next', ({ new_next }) => {
      next = new_next
      show_neighbours(previous, next)
    })
  })

}

server.listen(MY_PORT, () => {
  console.log(`Server has started on port:${MY_PORT}`)
})

//? Πρόβλημα:
/*
    Πρέπει με κάποιο τρόπο να κρατήσουμε δεδομένα για κάθε server. 
    (π.χ. το previous, το next, τα Data κλπ.)
    Όμως έχουμε μόνο ένα αρχείο για όλους τους servers.
    - Κρατάμε ένα array που συνδέει PORTS με objects, κάνουμε import το array
    και ο κάθε κόμβος έχει πρόσβαση στο object, με array[MY_PORT].previous π.χ
*/

function join_general_case(join_ip_port, previous_hash, next_hash, previous, next) {

  let hash = sha1(join_ip_port)

  if (hash < MY_HASH) {
    if (hash < previous_hash) {
      // Send him to previous

      socket = client_io.connect('http://' + previous)
      socket.emit('join_forward', { join_ip_port })
    } else {
      // Put him between me and previous

      socket = client_io.connect('http://' + join_ip_port)
      socket.emit('join_response', { join_previous: previous, join_next: ME })

      socket = client_io.connect('http://' + previous)
      socket.emit('join_update_next', { new_next: join_ip_port })

      previous = join_ip_port
      show_neighbours(previous, next)
    }
  } else {
    if (hash > next_hash) {
      // Send him to next

      socket = client_io.connect('http://' + next)
      socket.emit('join_forward', { join_ip_port })
    } else {
      // Put him between me and next

      socket = client_io.connect('http://' + join_ip_port)
      socket.emit('join_response', { join_previous: ME, join_next: next })

      socket = client_io.connect('http://' + next)
      socket.emit('join_update_previous', { new_previous: join_ip_port })

      next = join_ip_port
      show_neighbours(previous, next)
    }
  } 

}

function show_neighbours(previous, next) {
  console.log('My Neighbours:', { previous, next })
}
