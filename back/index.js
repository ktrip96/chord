// required
const fs = require('fs')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const client_io = require('socket.io-client')
const sha1 = require('sha1')

// src required
const {
  set_my_address, set_previous, set_next, set_front_socket, // set
  get_my_address, get_previous, get_next, // get
  show_event, // show
  hit_node, hit_next // hit
} = require('./src/globals.js')
const {
  on_join, non_bootstrap_join_events, on_update_neighbour, // join
  on_depart // depart
} = require('./src/join_depart.js')
const { command_events } = require('./src/commands.js')
const { replicate_events } = require('./src/replication.js')

// boilerplate
const server = http.createServer(express())
const io = socketio(server, { cors: { origin: '*' } })

// consts
const MODE = process.argv[2]
const REPLICATION_FACTOR = process.argv[3]

const BOOTSTRAP = '192.168.1.71:5000'

const ME = process.argv[4]
set_my_address(ME)

const MY_HASH = sha1(process.argv[4])
console.log('My hash:', MY_HASH)

const separator = ME.indexOf(':')
const MY_PORT = ME.slice(separator + 1)

// juice
if (ME == BOOTSTRAP) {
  // Bootstrap code: Initially next = previous = BOOTSTRAP

  set_previous(BOOTSTRAP)
  set_next(BOOTSTRAP)

  io.on('connection', (socket) => {
    // events

    on_join(socket, BOOTSTRAP)
    on_update_neighbour(socket)

    command_events(socket, MODE, REPLICATION_FACTOR)

    replicate_events(socket)

    on_front_connection(socket)
    on_create_nodes_file(socket)
  })
} else {
  // Non bootstrap code: Begin by asking BOOTSTRAP to join

  hit_node({ node: BOOTSTRAP, event_: 'join', object: { joiner:ME } })

  io.on('connection', (socket) => {
    // events

    non_bootstrap_join_events(socket)
    on_update_neighbour(socket)

    on_depart(socket)

    command_events(socket, MODE, REPLICATION_FACTOR)

    replicate_events(socket)

    on_front_connection(socket)
    on_create_nodes_file(socket)
  })
}

function on_front_connection(socket) {
  socket.on('front_connection', () => {
    show_event('front_connection', {})

    set_front_socket(socket)
    socket.emit('front_connection_response', { previous: get_previous() , next: get_next() })
  })
}

function on_create_nodes_file(socket) {
  socket.on('create_nodes_file', () => {
    show_event('create_nodes_file', {})

    fs.appendFile('/home/gnostis/chord/input/ips.txt', ME + '\n', function (err) {
      if (err) throw err;
      console.log('Saved!')
    })

    if (ME != BOOTSTRAP)
      hit_next({ event_:'create_nodes_file', object: {} })
  })
}

server.listen(MY_PORT, () => { console.log(`Server has started on: ${ME}`) })
