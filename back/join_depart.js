// required
const sha1 = require('sha1')

const {
  set_previous, set_next, get_previous, get_next,
  show_neighbours, show_event,
  hit_node, hit_previous, hit_next
} = require('./globals.js')
const { hash_comparator } = require('./hash_comparator.js')
const { depart_replication } = require('./replication.js')
const { get_my_key_value_pairs, set_my_key_value_pairs } = require('./commands.js')

function join_general_case(joiner, ME) {
  functions_list = [
    { function_: hit_previous, argument: { event_: 'forward_join', object: { joiner } } },
    { function_: place_node,   argument: { joiner, ME, side: 'previous' }               },
    { function_: place_node,   argument: { joiner, ME, side: 'next' }                   },
    { function_: hit_next,     argument: { event_: 'forward_join', object: { joiner } } }
  ]
  hash_comparator({ to_be_hashed: joiner, ME, functions_list })
}

function place_node({ joiner, ME, side }) {
  let joiner_previous
  let joiner_next

  if (side == 'previous') {
    joiner_previous = get_previous()
    joiner_next = ME

    hit_previous({ event_: 'update_neighbour', object: { neighbour: joiner, neighbour_side: 'next' } })

    set_previous(joiner)

    hit_node({ node: joiner, event_: 'joiner_pairs_response', object: joiner_pairs(joiner, ME) })
  } else if (side == 'next') {
    joiner_previous = ME
    joiner_next = get_next()

    hit_next({ event_: 'update_neighbour', object: { neighbour: joiner, neighbour_side: 'previous' } })

    set_next(joiner)

    hit_next({ event_: 'joiner_pairs_request', object: { joiner, ME } })
  } else 
    console.log('OH NO you SHOULDN\'T have seen that!')

  hit_node({
    node: joiner, event_: 'join_response',
    object: { joiner_previous, joiner_next }
  })

  show_neighbours()
}

function joiner_pairs(joiner, ME) {
  let joiner_pairs = {}
  Object.entries(get_my_key_value_pairs()).forEach( ([key, value]) => {
    if (sha1(key) < sha1(joiner) || sha1(key) > sha1(ME))
      joiner_pairs = { ...joiner_pairs, [key]: value }
  })
  return joiner_pairs
}

function on_joiner_pairs_request(socket) {
  socket.on('joiner_pairs_request', ({ joiner, ME }) => {
    show_event('joiner_pairs_request', { joiner, ME })

    hit_node({ node: joiner, event_: 'joiner_pairs_response', object: joiner_pairs(joiner, ME) })
  })
}

function on_joiner_pairs_response(socket) {
  socket.on('joiner_pairs_response', (joiner_pairs) => {
    show_event('joiner_pairs_response', joiner_pairs)

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

function join_depart_events(socket) {
  on_update_neighbour(socket)
  on_joiner_pairs_request(socket)
  on_joiner_pairs_response(socket)
}

module.exports = { join_general_case, join_depart_events, depart }
