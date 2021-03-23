const sha1 = require('sha1')
const client_io = require('socket.io-client')

let front_socket
let previous
let previous_hash
let previous_socket
let next
let next_hash
let next_socket
let my_key_value_pairs = {}

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

function get_previous() { return previous; }
function get_next() { return next; }
function get_front_socket() { return front_socket; }

// debugging
function show_neighbours() {
  console.log('\nNeighbours: ' +  previous + ', ' + next )
}
function show_event(event_, object) {
  general_debugging('Event: ' + event_, object)
}
function general_debugging(string, object) {
  console.log('\n'+ string)
  console.log(object)
}

function hit_node({ node, event_, to_emit }) {
  socket = client_io.connect('http://' + node)
  socket.emit(event_, to_emit)
}
function hit_previous({ event_, to_emit }) {
  previous_socket.emit(event_, to_emit)
}
function hit_next({ event_, to_emit }) {
  next_socket.emit(event_, to_emit)
}

function join_general_case(joiner, ME) {

  functions_list = [
    {
      function_: hit_previous,
      argument: { event_: 'forward_join', to_emit: { joiner } }
    },
    {
      function_: place_node,
      argument: {
        joiner, ME, that_guy: previous, side: 'previous'
      }
    },
    {
      function_: place_node,
      argument: {
        joiner, ME, that_guy: next, side: 'next'
      }
    },
    {
      function_: hit_next,
      argument: { event_: 'forward_join', to_emit: { joiner } }
    }
  ]

  hash_comparator({ to_be_hashed: joiner, ME, functions_list })

}

// place new node between me and one of my neighbours
function place_node({ joiner, ME, that_guy, side }) {

  let joiner_previous
  let joiner_next

  // set neighbour values for me and joiner
  if (side == 'previous') {

    set_previous(joiner)
    joiner_previous = that_guy
    joiner_next = ME

  } else if (side == 'next') {

    set_next(joiner)
    joiner_previous = ME
    joiner_next = that_guy

  } else 
    console.log('OH NO you SHOULDN\'T have seen that!')

  // send neighbour values to joiner
  hit_node({
    node: joiner,
    event_: 'join_response',
    to_emit: { joiner_previous, joiner_next }
  })

  // send joiner as new neighbour to that_guy
  hit_node({
    node: that_guy,
    event_: 'update_neighbour',
    to_emit: {
      new_neighbour: joiner,
      new_neighbour_side: oposite_of(side)
    }
  })

  show_neighbours()

}

function on_update_neighbour(socket) {

  socket.on('update_neighbour', ({
                                   new_neighbour,
                                   new_neighbour_side
                                 }) => {
    show_event('update_neighbour',{
      new_neighbour,
      new_neighbour_side
    })

    // Update one of my neighbours according to object 
    if (new_neighbour_side == 'previous')
      set_previous(new_neighbour)
    else if (new_neighbour_side == 'next')
      set_next(new_neighbour)
    else 
      console.log(
        'That\'s a weird side (' + new_neighbour_side + ')'
      )

    show_neighbours()

  })

}

function oposite_of(side) {

  if (side == 'previous')
    return 'next'
  if (side == 'next')
    return 'previous'

  console.log('FUCK! I don\'t know this side:', side)

}

function on_insert(socket, ME) {

  function insert_key_value({ key, value }) {
    console.log('Key hash:', sha1(key))
    my_key_value_pairs = {...my_key_value_pairs, [key]:value }
    return { response_message: 'All good, I added the pair ;)' }
  }

  on_command({
    socket,
    event_: 'insert',
    destination_function: insert_key_value,
    ME
  })

}

function on_query(socket, ME) {

  function return_query_value({ key }) {
    return {
      response_message: 'Here\'s the value you asked for sir:',
      value: my_key_value_pairs[key]
    }
  }

  on_command({
    socket,
    event_: 'query',
    destination_function: return_query_value,
    ME
  })

}

function on_delete(socket, ME) {

  function delete_pair({ key }) {
    console.log('Here\'s everything:', my_key_value_pairs)
    console.log('Deleting pair with key:', key)
    delete my_key_value_pairs[key]
    console.log(
      'Here\'s everything after deletion:',
      my_key_value_pairs
    )
    return { response_message: 'All good, I deleted the pair ;)' }
  }

  on_command({
    socket,
    event_: 'delete',
    destination_function: delete_pair,
    ME
  })

}

// structure of commands: forward the command or run it yourself
function on_command({
    socket,
    event_,
    destination_function,
    ME
  }) {

  function call_hash_comparator(event_object){
    hash_comparator({
      to_be_hashed: event_object['key'],
      ME,
      functions_list: functions_list_from_object(event_object)
    })
  }

  function functions_list_from_object(object) {
    return [
      // case 1: forward command to previous
      {
        function_: hit_previous,
        argument: { event_: 'forward_' + event_, to_emit: object }
      },

      // case 2: run command yourself
      {
        function_: run_destination_function_and_respond,
        argument: object
      },

      // case 3: tell next to run command
      {
        function_: hit_next,
        argument: {
          event_: event_ + '_reached_destination',
          to_emit: object
        }
      },

      // case 4: forward command to next
      {
        function_: hit_next,
        argument: { event_: 'forward_' + event_, to_emit: object }
      }
    ]
  }

  function run_destination_function_and_respond(object){

    response = destination_function(object)
    hit_node({
      node: object['initial_node'],
      event_: event_ + '_response',
      to_emit: response
    })

  }

  socket.on('initial_' + event_, (event_initial_object) => {
    show_event('initial_' + event_, event_initial_object)

    // add your address to the object and call hash comparator
    let event_object = { ...event_initial_object, initial_node:ME }

    call_hash_comparator(event_object)

  })

  socket.on('forward_' + event_, (event_object) => {
    show_event('forward_' + event_, event_object)

    call_hash_comparator(event_object)
  })

  socket.on(event_ + '_reached_destination', (event_object) => {
    show_event(event_ + '_reached_destination', event_object)

    run_destination_function_and_respond(event_object)
  })

  socket.on(event_ + '_response', (event_object) => {
    show_event(event_ + '_response', event_object)
  })

}


function on_front_connection(socket) {
  socket.on('front_connection', () => {
    front_socket = socket
  })
}

function on_front_neighbours(socket) {
  socket.on('front_neighbours', () => {
    socket.emit('front_neighbours_response', { previous, next })
  })
}

function depart() {

  hit_node({
    node: next,
    event_: 'update_neighbour',
    to_emit: {
      new_neighbour: previous,
      new_neighbour_side: 'previous'
    }
  })
  hit_node({
    node: previous,
    event_: 'update_neighbour',
    to_emit: {
      new_neighbour: next,
      new_neighbour_side: 'next'
    }
  })
  setTimeout(() => process.exit(),1000)

} 

function hash_comparator({ to_be_hashed, ME, functions_list }) {

  let hash = sha1(to_be_hashed)
  let MY_HASH = sha1(ME)

  if (hash < MY_HASH) {

    if (hash < previous_hash && MY_HASH > previous_hash)
      functions_list[0]['function_'](functions_list[0]['argument'])
    else
      functions_list[1]['function_'](functions_list[1]['argument'])

  } else {

    if (hash < next_hash || MY_HASH > next_hash)
      functions_list[2]['function_'](functions_list[2]['argument'])
    else
      functions_list[3]['function_'](functions_list[3]['argument'])

  } 

}

// Events common to all nodes
function common_to_all(socket, ME) {
    on_front_connection(socket)
    on_front_neighbours(socket)
    on_update_neighbour(socket)
    on_insert(socket, ME)
    on_query(socket, ME)
    on_delete(socket, ME)
}

module.exports = {
  set_previous,
  set_next,
  get_previous,
  get_next,
  get_front_socket,
  show_neighbours,
  show_event,
  hit_node,
  join_general_case,
  common_to_all,
  depart
}
