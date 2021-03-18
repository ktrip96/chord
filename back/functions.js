// required
const sha1 = require('sha1')
const client_io = require('socket.io-client')

// vars
let previous = null
let previous_hash = null
let next = null
let next_hash = null
let my_key_value_pairs = {}

// set
function set_previous(new_previous) {
  previous = new_previous
  previous_hash = sha1(previous)
}
function set_next(new_next) {
  next = new_next
  next_hash = sha1(next)
}

// get
function get_previous() { return previous; }
function get_next() { return next; }

// show
function show_neighbours() {
  console.log('Neighbours: ' +  previous + ', ' + next )
}

// emit
function emit_to_node({ node, event_, to_emit }) {
  socket = client_io.connect('http://' + node)
  socket.emit(event_, to_emit)
}

// join
function on_join_general_case(joiner, ME) {

  f_list = [
    emit_to_node,
    between_me_and_that_guy,
    emit_to_node,
    between_me_and_that_guy
  ]

  arg_list = [
    { node: previous, event_: 'join_forward', to_emit: { joiner } },
    { joiner, that_guy: previous, ME, side: "previous" },
    { node: next, event_: 'join_forward', to_emit: { joiner } },
    { joiner, that_guy: next, ME, side: "next" }
  ]

  chord_parser(joiner, ME, f_list, arg_list)

}

function between_me_and_that_guy({ joiner, that_guy, ME, side }) {

  let joiner_previous
  let joiner_next
  if (side == "previous") {
    set_previous(joiner)
    joiner_previous = that_guy
    joiner_next = ME
  } else if (side == "next") {
    set_next(joiner)
    joiner_previous = ME
    joiner_next = that_guy
  } else 
    console.log("OH NO you SHOULDN'T have seen that!")

  emit_to_node({
    node: joiner,
    event_: 'join_response',
    to_emit: { joiner_previous, joiner_next }
  })

  emit_to_node({
    node: that_guy,
    event_: 'update_neighbour',
    to_emit: { new_neighbour: joiner, new_neighbour_side: oposite_of(side) }
  })

  show_neighbours()

}

function on_update_neighbour(socket) {
  socket.on('update_neighbour', ({ new_neighbour, new_neighbour_side }) => {

    if (new_neighbour_side == "previous")
      set_previous(new_neighbour)
    else if (new_neighbour_side == "next")
      set_next(new_neighbour)
    else 
      console.log('What is this madness? (' + new_neighbour_side + ')')

    show_neighbours()

  })

}

function oposite_of(side) {

  if (side == "previous")
    return "next"
  if (side == "next")
    return "previous"

  console.log("FUCK! I don't know this side:", side)

}

// insert
function on_insert(socket, ME) {
  on_event({
    socket,
    event_: 'insert',
    case2func: insert_key_value,
    case4event: 'insert_key_value',
    ME
  })
}

function insert_key_value({ key, value }) {
  console.log('This pair is for me:', { key, value })
  console.log('Key hash:', sha1(key))
  my_key_value_pairs = {...my_key_value_pairs, [key]:value }
}

// query
function on_query(socket, ME) {
  on_event({
    socket,
    event_: 'query',
    case2func: return_query_value,
    case4event: 'return_query_value',
    ME
  })
}

function return_query_value({ key }) {
  console.log('Here\'s everything:', my_key_value_pairs)
  console.log({ key })
  console.log('Here\'s the value you asked for sir:', my_key_value_pairs[key])
}

// delete
function on_delete(socket, ME) {
  on_event({
    socket,
    event_: 'delete',
    case2func: delete_pair,
    case4event: 'delete_pair',
    ME
  })
}

function delete_pair({ key }) {
  console.log('Here\'s everything:', my_key_value_pairs)
  console.log('Deleting pair with key:', key)
  delete my_key_value_pairs[key]
  console.log('Here\'s everything after deletion:', my_key_value_pairs)
}

// depart
function depart() {
  emit_to_node({
    node: next,
    event_: 'update_neighbour',
    to_emit: { new_neighbour: previous, new_neighbour_side: "previous" }
  })
  emit_to_node({
    node: previous,
    event_: 'update_neighbour',
    to_emit: { new_neighbour: next, new_neighbour_side: "next" }
  })
  setTimeout(() => process.exit(),1000)
} 

// chord parser
function chord_parser(to_be_hashed, ME, f_list, arg_list) {

  let hash = sha1(to_be_hashed)
  let MY_HASH = sha1(ME)

  if (hash < MY_HASH) {

    if (hash < previous_hash && MY_HASH > previous_hash)
      f_list[0](arg_list[0])
    else
      f_list[1](arg_list[1])

  } else {

    if (hash > next_hash && MY_HASH < next_hash)
      f_list[2](arg_list[2])
    else
      f_list[3](arg_list[3])

  } 

}

// on event
function on_event({ socket, event_, case2func, case4event, ME }) {
  socket.on(event_, (event_object) => {
    console.log({ event_, event_object, case4event })

    f_list = [
      emit_to_node,
      case2func,
      emit_to_node,
      emit_to_node
    ]

    arg_list = [
      { node: previous, event_, to_emit: event_object },
      event_object,
      { node: next, event_, to_emit: event_object },
      { node: next, event_: case4event, to_emit: event_object },
    ]

    chord_parser(event_object['key'], ME, f_list, arg_list)
  })

  socket.on(case4event, (case4event_object) => {
    case2func(case4event_object)
  })
}

module.exports = {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  emit_to_node,
  on_update_neighbour,
  on_join_general_case,
  on_insert,
  on_query,
  on_delete,
  depart
}
