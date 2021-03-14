const sha1 = require('sha1')
const client_io = require('socket.io-client')

let previous = null
let previous_hash = null
let next = null
let next_hash = null

function set_previous(new_previous) {
  previous = new_previous
  previous_hash = sha1(previous)
}

function set_next(new_next) {
  next = new_next
  next_hash = sha1(next)
}

function get_previous() {
  return previous;
}

function get_next() {
  return next;
}

function join_general_case(join_ip_port, ME) {

  let hash = sha1(join_ip_port)
  let MY_HASH = sha1(ME)

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
      socket.emit('join_set_next', { new_next: join_ip_port })

      set_previous(join_ip_port)
      show_neighbours()
    }
  } else {
    if (hash > next_hash && MY_HASH < next_hash) {
      // Send him to next

      socket = client_io.connect('http://' + next)
      socket.emit('join_forward', { join_ip_port })
    } else {
      // Put him between me and next

      socket = client_io.connect('http://' + join_ip_port)
      socket.emit('join_response', { join_previous: ME, join_next: next })

      socket = client_io.connect('http://' + next)
      socket.emit('join_set_previous', { new_previous: join_ip_port })

      set_next(join_ip_port)
      show_neighbours()
    }
  } 

}

function show_neighbours() {
  console.log('My Neighbours:', { previous, next })
}

function set_previous(new_previous) {
  previous = new_previous
  previous_hash = sha1(previous)
}

function set_next(new_next) {
  next = new_next
  next_hash = sha1(next)
}

function join_set(socket) {
  socket.on('join_set_previous', ({ new_previous }) => {
    set_previous(new_previous)
    show_neighbours()
  })

  socket.on('join_set_next', ({ new_next }) => {
    set_next(new_next)
    show_neighbours()
  })
}

module.exports = {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  join_set,
  join_general_case
}
