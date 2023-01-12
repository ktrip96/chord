// required
const fs = require('fs')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const client_io = require('socket.io-client')
const sha1 = require('sha1')

// src required
const {
<<<<<<< HEAD
  set_previous,
  set_next,
  set_front_socket,
  get_previous,
  get_next,
  get_front_socket,
  show_neighbours,
  show_event,
  hit_node,
} = require('./globals.js')
const {
  join_general_case,
  join_depart_events,
  depart,
} = require('./join_depart.js')
const { command_events } = require('./commands.js')
const { replicate_events, join_replication } = require('./replication.js')
=======
  set_my_address, set_neighbours, set_parameters, set_front_socket, // set
  get_my_address, get_my_hash, get_previous, get_next, // get
  show_event, // show
  hit_node, hit_next // hit
} = require('./src/globals.js')
const {
  on_join, non_bootstrap_join_events, on_update_neighbour, // join
  on_depart // depart
} = require('./src/join_depart.js')
const { command_events } = require('./src/commands.js')
const { replicate_events } = require('./src/replication.js')
>>>>>>> baef280d40abd0223c30e410532fd305643cac78

// boilerplate
const server = http.createServer(express())
const io = socketio(server, { cors: { origin: '*' } })

<<<<<<< HEAD
const REPLICATION_FACTOR = process.argv[2]
const ME = process.argv[3]
const BOOTSTRAP = 'localhost:5000'
=======
// consts
const BOOTSTRAP = '192.168.1.71:5000'
const ME = process.argv[4]
const MY_PORT = ME.slice(ME.indexOf(':') + 1)
>>>>>>> baef280d40abd0223c30e410532fd305643cac78

// set globals
set_parameters({ mode: process.argv[2], replication_factor: process.argv[3] })
set_my_address(ME)
console.log('My hash:', get_my_hash())

// juice
if (ME == BOOTSTRAP) { // Bootstrap code

  set_neighbours({ previous: BOOTSTRAP, next: BOOTSTRAP})

<<<<<<< HEAD
  io.on('connection', (socket) => {
    socket.on('join', ({ joiner }) => {
      // show_event('join', { joiner })

      get_front_socket().emit('front_join', { joiner })
      if (get_next() == BOOTSTRAP) {
        // Special case: only bootstrap is in the network, make 2 node network
        hit_node({
          node: joiner,
          event_: 'join_response',
          object: { joiner_previous: BOOTSTRAP, joiner_next: BOOTSTRAP },
        })
        set_previous(joiner)
        set_next(joiner)
        show_neighbours()
      } else join_general_case(joiner, ME)
    })
=======
  io.on('connection', (socket) => { // events
    on_join(socket, BOOTSTRAP)
    on_update_neighbour(socket)

    command_events(socket)

    replicate_events(socket)
>>>>>>> baef280d40abd0223c30e410532fd305643cac78

    on_front_connection(socket)
    on_create_nodes_file(socket)
  })
<<<<<<< HEAD
} else {
  // Non bootstrap code: Begin by asking BOOTSTRAP to join

  hit_node({ node: BOOTSTRAP, event_: 'join', object: { joiner: ME } })

  io.on('connection', (socket) => {
    socket.on('join_response', ({ joiner_previous, joiner_next }) => {
      // show_event('join_response', { joiner_previous, joiner_next })
      set_previous(joiner_previous)
      set_next(joiner_next)
=======
} else { // Non bootstrap code
  hit_node({ node: BOOTSTRAP, event_: 'join', object: { joiner:ME } })

  io.on('connection', (socket) => { // events
    non_bootstrap_join_events(socket)
    on_update_neighbour(socket)
>>>>>>> baef280d40abd0223c30e410532fd305643cac78

    on_depart(socket)

    command_events(socket)

<<<<<<< HEAD
    socket.on('forward_join', ({ joiner }) => {
      // show_event('forward_join', { joiner })
      join_general_case(joiner, ME)
    })

    socket.on('depart', () => {
      show_event('depart', {})
      depart()
    })
=======
    replicate_events(socket)
>>>>>>> baef280d40abd0223c30e410532fd305643cac78

    on_front_connection(socket)
    on_create_nodes_file(socket)
  })
}

function on_front_connection(socket) {
  socket.on('front_connection', () => {
    show_event('front_connection', {})

    set_front_socket(socket)
    socket.emit('front_connection_response', {
      previous: get_previous(),
      next: get_next(),
    })
  })
}

<<<<<<< HEAD
server.listen(MY_PORT, () => {
  console.log(`Server has started on: ${ME}`)
})
=======
let create_nodes_file_socket = null
function on_create_nodes_file(socket) {
  socket.on('create_nodes_file', () => {
    show_event('create_nodes_file', {})

    function write_my_ip_to_file_and_hit_next() {
      fs.appendFile('../input/ips.txt', ME + '\n', function (err) {
        if (err) throw err;
        console.log('Saved!')
      })
      hit_next({ event_:'create_nodes_file' })
    }

    if (ME == BOOTSTRAP)
      if (create_nodes_file_socket == null) {
        create_nodes_file_socket = socket
        write_my_ip_to_file_and_hit_next()
      } else
        create_nodes_file_socket.emit('create_nodes_file_response', { response: 'file created!' })
    else
      write_my_ip_to_file_and_hit_next()
  })
}

server.listen(MY_PORT, () => { console.log(`Server has started on: ${ME}`) })
>>>>>>> baef280d40abd0223c30e410532fd305643cac78
