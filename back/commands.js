const sha1 = require('sha1')

const {
  show_event,
  hit_node, hit_previous, hit_next,
  get_front_socket, get_replication_factor
} = require('./globals.js')

const { hash_comparator } = require('./hash_comparator.js')

let my_key_value_pairs = {}
function show_key_value_pairs(){ console.log('\nKey-Value pairs:', my_key_value_pairs) }
function add_pair({ key, value }){
  show_key_value_pairs()
  console.log('\nAdding pair with key:', key)
  console.log('Key hash:', sha1(key))
  my_key_value_pairs = {...my_key_value_pairs, [key]:value }
  show_key_value_pairs()
}
function get_my_key_value_pairs(){ return my_key_value_pairs }
function set_my_key_value_pairs(pairs){ my_key_value_pairs = pairs }

function on_insert(socket, ME, REPLICATION_FACTOR) {
  on_command({ socket, event_: 'insert', function_: insert_key_value, ME, REPLICATION_FACTOR })
}

function insert_key_value({ key, value }) {
  add_pair({ key, value })
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
  show_key_value_pairs()
  if (my_key_value_pairs[key] == null)
    return { response_message: 'No such key' }
  console.log('\nDeleting pair with key:', key)
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
    // show_event(event_ + '_reached_destination', object)

    replication_and_response({ object, event_ })
  })

  socket.on(event_ + '_response', (object) => {
    // show_event(event_ + '_response', object)
    get_front_socket().emit(event_ + '_response', object)
  })

  function call_hash_comparator(object){
    hash_comparator({
      to_be_hashed: object['key'],
      ME,
      functions_list: [
        { function_: hit_previous,             argument: { event_: 'forward_' + event_, object }             },
        { function_: replication_and_response, argument: { object, event_ }                                  },
        { function_: hit_next,                 argument: { event_: event_ + '_reached_destination', object } },
        { function_: hit_next,                 argument: { event_: 'forward_' + event_, object }             }
      ]
    })
  }

  function replication_and_response({ object, event_ }){
    response = function_(object)
    if (REPLICATION_FACTOR == 1 || event_ == 'query')
      hit_node({
        node: object['initial_node'], event_: event_ + '_response', object: { ...response, destination_node:ME }
      })
    else
      hit_next({
        event_:'replicate_' + event_,
        object: {
          argument: object,
          n: REPLICATION_FACTOR - 1,
          replication_initial_node: ME
        }
      })
  }
}

function on_show_data(socket) {
  socket.on('show_data', () => {
    show_event('show_data', my_key_value_pairs)
    socket.emit('show_data_response', my_key_value_pairs)
  })
}

function command_events(socket, ME, REPLICATION_FACTOR) {
  on_insert(socket, ME, REPLICATION_FACTOR)
  on_query(socket, ME, REPLICATION_FACTOR)
  on_delete(socket, ME, REPLICATION_FACTOR)
  on_show_data(socket)
}

module.exports = {
  command_events,
  insert_key_value,
  delete_pair,
  get_my_key_value_pairs,
  set_my_key_value_pairs,
  show_key_value_pairs
 }
