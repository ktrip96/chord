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

function get_previous() { return previous; }
function get_next() { return next; }

function show_neighbours() { console.log('My Neighbours:', { previous, next }) }

function join_forward(neighbour, joiner) {
  socket = client_io.connect('http://' + neighbour)
  socket.emit('join_forward', { joiner })
}

function send_neighbours(joiner, joiner_previous, joiner_next) {
  socket = client_io.connect('http://' + joiner)
  socket.emit('join_response', { joiner_previous, joiner_next })
}

function send_neighbour_update(receiving_neighbour, new_neighbor, side) {
  socket = client_io.connect('http://' + receiving_neighbour)
  socket.emit('join_update', { new_neighbor, side })
}

function join_update_neighbours(socket) {
  socket.on('join_update', ({ new_neighbor, side }) => {

    if ( side == "previous" ) {
      set_previous(new_neighbor)
      show_neighbours()
    } else if ( side == "previous" ) {
      set_next(new_next)
      show_neighbours()
    } else {
      console.log('What is this madness? (' + side + ')')
    }

  })

}

function join_general_case(joiner, ME) {

  let hash = sha1(joiner)
  let MY_HASH = sha1(ME)

  if (hash < MY_HASH) {

    if (hash < previous_hash) {
      // Send him to previous

      join_forward(previous, joiner)
    } else {
      // Put him between me and previous

      send_neighbours(joiner, previous, ME)
      send_neighbour_update(previous, joiner, "next")
      set_previous(joiner)

      show_neighbours()
    }

  } else {

    if (hash > next_hash && MY_HASH < next_hash) {
      // Send him to next

      join_forward(next, joiner)

    } else {
      // Put him between me and next

      send_neighbours(joiner, ME, next)
      send_neighbour_update(next, joiner, "previous")
      set_next(joiner)

      show_neighbours()
    }
  } 
}

module.exports = {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  join_update_neighbours,
  join_general_case
}
