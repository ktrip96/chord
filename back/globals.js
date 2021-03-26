const sha1 = require('sha1')
const client_io = require('socket.io-client')

let previous
let previous_hash
let previous_socket

let next
let next_hash
let next_socket

let front_socket

// set
function set_previous(new_previous) {
  previous = new_previous
  previous_hash = sha1(previous)
  if (previous_socket != null)
    previous_socket.close()
  previous_socket = client_io.connect('http://' + new_previous)
}

function set_next(new_next) {
  next = new_next
  next_hash = sha1(next)
  if (next_socket != null)
    next_socket.close()
  next_socket = client_io.connect('http://' + new_next)
}

function set_front_socket(socket) { front_socket = socket }

// get
function get_previous() { return previous }
function get_previous_hash() { return previous_hash }

function get_next() { return next }
function get_next_hash() { return next_hash }

function get_front_socket() { return front_socket }

// debugging
function show_neighbours() { console.log('\nNeighbours: ' +  previous + ', ' + next ) }
function show_event(event_, object) { general_debugging('Event: ' + event_, object) }
function general_debugging(string, object) { console.log('\n'+ string); console.log(object) }

// communication
function hit_node({ node, event_, object }) {
  socket = client_io.connect('http://' + node)
  socket.emit(event_, object)
}
function hit_previous({ event_, object }) { previous_socket.emit(event_, object) }
function hit_next({ event_, object }) { next_socket.emit(event_, object) }

module.exports = {
  set_previous, set_next, set_front_socket,
  get_previous, get_previous_hash, get_next, get_next_hash, get_front_socket,
  show_neighbours, show_event,
  hit_node, hit_previous, hit_next
}
