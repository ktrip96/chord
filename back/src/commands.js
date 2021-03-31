// required
const sha1 = require('sha1')

// src required
const {
  get_my_address, get_mode, get_replication_factor, get_front_socket, // get
  show_event, general_debugging, // show
  hit_node, hit_previous, hit_next // hit
} = require('./globals.js')
const { hash_comparator } = require('./hash_comparator.js')

// pairs
let my_key_value_pairs = {}

function set_my_key_value_pairs(pairs){ my_key_value_pairs = pairs }
function get_my_key_value_pairs(){ return my_key_value_pairs }
function show_key_value_pairs(){ console.log('\nKey-Value pairs:', my_key_value_pairs) }

// add
function add_pair({ key, value }){
  show_key_value_pairs()
  console.log('\nAdding pair with key:', key)
  console.log('Key hash:', sha1(key))
  my_key_value_pairs = {...my_key_value_pairs, [key]:value }
  show_key_value_pairs()
}
function add_pair_and_respond({ key, value }) {
  add_pair({ key, value })
  return { response_message: 'All good, I added the pair ;)' }
}

// query
function query_response({ key }) {
  show_key_value_pairs()
  return {
    response_message: 'Here\'s the value you asked for sir:',
    value: my_key_value_pairs[key]
  }
}

// delete
function delete_pair(key) {
  show_key_value_pairs()
  console.log('\nDeleting pair with key:', key)
  delete my_key_value_pairs[key]
  show_key_value_pairs()
}
function delete_pair_and_respond({ key }) {
  delete_pair(key)
  return { response_message: 'All good, I deleted the pair ;)' }
}

function on_insert(socket) { on_command({ socket, event_: 'insert', function_: add_pair_and_respond }) }
function on_query(socket) { on_command({ socket, event_: 'query', function_: query_response }) }
function on_delete(socket) { on_command({ socket, event_: 'delete', function_: delete_pair_and_respond }) }

let event_socket = null
function on_command({ socket, event_, function_ }) {
  socket.on(event_, (object) => {
    show_event(event_, object)

    event_socket = socket
    let key = object['key']
    if (get_mode() == 'eventual_consistency' && event_ == 'query' && key in my_key_value_pairs)
      socket.emit('query_response', query_response({ key }))
    else
      call_hash_comparator({ ...object, initial_node: get_my_address() })
  })

  socket.on('forward_' + event_, (object) => {
    show_event('forward_' + event_, object)

    let key = object['key']
    if (get_mode() == 'eventual_consistency' && event_ == 'query' && key in my_key_value_pairs)
      hit_node({
        node: object['initial_node'], event_: 'query_response',
        object: { ...query_response({ key }), initial_socket: object['initial_socket'] }
      })
    else
      call_hash_comparator(object)
  })

  socket.on(event_ + '_response', (object) => {
    show_event(event_ + '_response', object)

    // get_front_socket().emit(event_ + '_response', object)
    event_socket.emit(event_ + '_response', object)
  })

  function call_hash_comparator(object){
    hash_comparator({
      to_be_hashed: object['key'],
      functions_list: [
        { function_: hit_previous,                argument: { event_: 'forward_' + event_, object } },
        { function_: corresponding_node_function, argument: { object, event_ }                      },
        { function_: hit_next,                    argument: { event_: 'forward_' + event_, object } }
      ]
    })
  }

  function corresponding_node_function({ object, event_ }){
    let replication_factor = get_replication_factor()
    let have_key = object['key'] in my_key_value_pairs

    if ((event_ == 'query' || event_ == 'delete') && !have_key)
      hit_node({
        node: object['initial_node'], event_: event_ + '_response',
        object: { response_message: 'No such key', corresponding_node: get_my_address() }
      })
    else {
      function replicate() {
        hit_next({
          event_:'replicate_' + event_,
          object: {
            argument: object,
            n: replication_factor - 1,
            replication_initial_node: get_my_address()
          }
        })
      }

      let replication_needed = (replication_factor > 1 && event_ != 'query')
      let mode = get_mode()
      if (replication_needed && mode == 'linearizability')
        replicate()
      hit_node({
        node: object['initial_node'], event_: event_ + '_response',
        object: { ...function_(object), corresponding_node: get_my_address() }
      })
      if (replication_needed && mode == 'eventual_consistency')
        replicate()
    }
  }
}

function on_show_data(socket) {
  socket.on('show_data', () => {
    // show_event('show_data', my_key_value_pairs)
    socket.emit('show_data_response', my_key_value_pairs)
  })
}

function command_events(socket) {
  on_insert(socket)
  on_query(socket)
  on_delete(socket)
  on_show_data(socket)
}

module.exports = {
  command_events,
  add_pair_and_respond,
  delete_pair_and_respond,
  get_my_key_value_pairs,
  set_my_key_value_pairs,
  show_key_value_pairs
}
