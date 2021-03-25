const sha1 = require('sha1')

const {
  show_event,
  hit_node, hit_previous, hit_next,
  get_front_socket, get_replication_factor
} = require('./globals.js')

const { hash_comparator } = require('./hash_comparator.js')

let my_key_value_pairs = {}
function show_key_value_pairs(){
  console.log('Key-Value pairs:', my_key_value_pairs)
}

function on_insert(socket, ME, REPLICATION_FACTOR) {
  on_command({ socket, event_: 'insert', function_: insert_key_value, ME, REPLICATION_FACTOR })
}

function insert_key_value({ key, value }) {
  show_key_value_pairs()
  console.log('Adding pair with key:', key)
  console.log('Key hash:', sha1(key))
  my_key_value_pairs = {...my_key_value_pairs, [key]:value }
  show_key_value_pairs()
  return { response_message: 'All good, I added the pair ;)' }
}

function on_query(socket, ME, REPLICATION_FACTOR) {
  on_command({ socket, event_: 'query', function_: return_query_value, ME, REPLICATION_FACTOR })
}

function return_query_value({ key }) {
  show_key_value_pairs()
  return {
    response_message: 'Here\'s the value you asked for sir:',
    value: my_key_value_pairs[key]
  }
}

function on_delete(socket, ME, REPLICATION_FACTOR) {
  on_command({ socket, event_: 'delete', function_: delete_pair, ME, REPLICATION_FACTOR })
}

function delete_pair({ key }) {
  if (my_key_value_pairs[key] == null)
    return { response_message: 'No such key' }
  show_key_value_pairs()
  console.log('Deleting pair with key:', key)
  delete my_key_value_pairs[key]
  show_key_value_pairs()
  return { response_message: 'All good, I deleted the pair ;)' }
}

function on_command({ socket, event_, function_, ME, REPLICATION_FACTOR }) {
  socket.on('initial_' + event_, (object) => {
    show_event('initial_' + event_, object)
    call_hash_comparator({ ...object, initial_node:ME })
  })

  socket.on('forward_' + event_, (object) => {
    show_event('forward_' + event_, object)
    call_hash_comparator(object)
  })

  socket.on(event_ + '_reached_destination', (object) => {
    show_event(event_ + '_reached_destination', object)

    if (REPLICATION_FACTOR == 1)
      function_and_response(object)
    else
      hit_next({ event_:'replicate_' + event_, object: { argument: object, n: REPLICATION_FACTOR - 1 } })
  })

  socket.on(event_ + '_response', (object) => {
    show_event(event_ + '_response', object)
    // get_front_socket().emit(event_ + '_response', object)
  })

  function call_hash_comparator(object){
    hash_comparator({
      to_be_hashed: object['key'],
      ME,
      functions_list: [
        { function_: hit_previous,          argument: { event_: 'forward_' + event_, object }             },
        { function_: function_and_response, argument: object                                              },
        { function_: hit_next,              argument: { event_: event_ + '_reached_destination', object } },
        { function_: hit_next,              argument: { event_: 'forward_' + event_, object }             }
      ]
    })
  }

  function function_and_response(object){
    response = function_(object)
    hit_node({
      node: object['initial_node'], event_: event_ + '_response', object: { ...response, destination_node:ME }
    })
  }
}

function command_events(socket, ME, REPLICATION_FACTOR) {
    on_insert(socket, ME, REPLICATION_FACTOR)
    on_query(socket, ME, REPLICATION_FACTOR)
    on_delete(socket, ME, REPLICATION_FACTOR)
}

module.exports = { command_events, insert_key_value, delete_pair  }
