// required
const sha1 = require('sha1')

// src required
const {
  set_previous, set_next, set_neighbours, // set
  get_my_address, get_my_hash, get_previous, get_next, // get
  show_neighbours, show_event, // show
  hit_node, hit_previous, hit_next // hit
} = require('./globals.js')
const { hash_comparator } = require('./hash_comparator.js')
const { join_replication, depart_replication } = require('./replication.js')
const { get_my_key_value_pairs, set_my_key_value_pairs } = require('./commands.js')

// event group
function non_bootstrap_join_events(socket) {
  on_forward_join(socket)
  on_join_neighbours_response(socket)
  on_join_pairs_response(socket)
}

// events
function on_join(socket, BOOTSTRAP) {
  socket.on('join', ({ joiner }) => {
    // show_event('join', { joiner })

    // get_front_socket().emit('front_join', { joiner })

    if (get_next() == BOOTSTRAP) {
      hit_node({
        node: joiner, event_: 'join_neighbours_response',
        object: { previous: BOOTSTRAP, next: BOOTSTRAP }
      })
      set_neighbours({ previous: joiner, next: joiner })

      show_neighbours()
    } else 
      join_general_case(joiner, BOOTSTRAP)
  })
}
function on_forward_join(socket) {
  socket.on('forward_join', ({ joiner }) => {
    // show_event('forward_join', { joiner })

    join_general_case(joiner)
  })
}
function on_join_neighbours_response(socket) {
  socket.on('join_neighbours_response', (neighbours) => {
    // show_event('join_neighbours_response', neighbours)

    set_neighbours(neighbours)
    join_replication(get_my_address())

    show_neighbours()
  })
}
function on_join_pairs_response(socket) {
  socket.on('join_pairs_response', (joiner_pairs) => {
    // show_event('join_pairs_response', joiner_pairs)

    set_my_key_value_pairs(joiner_pairs)
  })
}

function on_update_neighbour(socket) {
  socket.on('update_neighbour', ({ neighbour, neighbour_side }) => {
    // show_event('update_neighbour',{ neighbour, neighbour_side })

    if (neighbour_side == 'previous')
      set_previous(neighbour)
    else if (neighbour_side == 'next')
      set_next(neighbour)
    else 
      console.log( 'That\'s a weird side (' + neighbour_side + ')')

    show_neighbours()
  })
}

function on_depart(socket) {
  socket.on('depart', () => { show_event('depart', {}); depart() })
}

// functions
function join_general_case(joiner) {
  let hit_argument = { event_: 'forward_join', object: { joiner } }
  functions_list = [
    { function_: hit_previous, argument: hit_argument   },
    { function_: place_node,   argument: { joiner } },
    { function_: hit_next,     argument: hit_argument   }
  ]
  hash_comparator({ to_be_hashed: joiner, functions_list })
}

function place_node({ joiner }) {
  hit_previous({
    event_: 'update_neighbour',
    object: { neighbour: joiner, neighbour_side: 'next' }
  })
  hit_node({
    node: joiner, event_: 'join_neighbours_response',
    object: { previous: get_previous(), next: get_my_address() }
  })
  hit_node({
    node: joiner, event_: 'join_pairs_response',
    object: joiner_pairs(joiner)
  })
  set_previous(joiner)

  show_neighbours()
}

function joiner_pairs(joiner) {
  let joiner_pairs = {}
  Object.entries(get_my_key_value_pairs()).forEach( ([key, value]) => {
    if (sha1(key) < sha1(joiner) || sha1(key) > get_my_hash())
      joiner_pairs = { ...joiner_pairs, [key]: value }
  })
  return joiner_pairs
}

function depart() {
  hit_node({
    node: get_next(), event_: 'update_neighbour',
    object: { neighbour: get_previous(), neighbour_side: 'previous' }
  })
  hit_node({
    node: get_previous(), event_: 'update_neighbour',
    object: { neighbour: get_next(), neighbour_side: 'next' }
  })
  depart_replication()
  setTimeout(() => process.exit(),1000)
} 

module.exports = {
  on_join,
  non_bootstrap_join_events,
  on_update_neighbour,
  on_depart
}
