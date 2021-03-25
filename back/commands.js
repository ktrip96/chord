const sha1 = require('sha1')

const {
  show_event,
  hit_node,
  hit_previous,
  hit_next,
  get_front_socket
} = require('./globals.js')


let my_key_value_pairs = {}

function on_insert(socket, ME) {
  function insert_key_value({ key, value }) {
    console.log('Key hash:', sha1(key))
    my_key_value_pairs = {...my_key_value_pairs, [key]:value }
    return { response_message: 'All good, I added the pair ;)' }
  }

  on_command({ socket, event_: 'insert', destination_function: insert_key_value, ME })
}

function on_query(socket, ME) {
  function return_query_value({ key }) {
    return {
      response_message: 'Here\'s the value you asked for sir:',
      value: my_key_value_pairs[key]
    }
  }

  on_command({ socket, event_: 'query', destination_function: return_query_value, ME })
}

function on_delete(socket, ME) {
  function delete_pair({ key }) {
    console.log('Here\'s everything:', my_key_value_pairs)
    console.log('Deleting pair with key:', key)
    delete my_key_value_pairs[key]
    console.log( 'Here\'s everything after deletion:', my_key_value_pairs)
    return { response_message: 'All good, I deleted the pair ;)' }
  }

  on_command({ socket, event_: 'delete', destination_function: delete_pair, ME })
}

function on_command({ socket, event_, destination_function, ME }) {
  function call_hash_comparator(object){
    hash_comparator({
      to_be_hashed: object['key'],
      ME,
      functions_list: [
        { function_: hit_previous,                 argument: { event_: 'forward_' + event_, object }             },
        { function_: destination_fun_and_response, argument: object                                              },
        { function_: hit_next,                     argument: { event_: event_ + '_reached_destination', object } },
        { function_: hit_next,                     argument: { event_: 'forward_' + event_, object }             }
      ]
    })
  }

  function destination_fun_and_response(object){
    response = destination_function(object)
    hit_node({ node: object['initial_node'], event_: event_ + '_response', object: response })
  }

  socket.on('initial_' + event_, (event_initial_object) => {
    show_event('initial_' + event_, event_initial_object)
    call_hash_comparator({ ...event_initial_object, initial_node:ME })
  })

  socket.on('forward_' + event_, (event_object) => {
    show_event('forward_' + event_, event_object)
    call_hash_comparator(event_object)
  })

  socket.on(event_ + '_reached_destination', (event_object) => {
    show_event(event_ + '_reached_destination', event_object)
    destination_fun_and_response(event_object)
  })

  socket.on(event_ + '_response', (event_object) => {
    show_event(event_ + '_response', event_object)
    get_front_socket().emit(event_ + '_response', event_object)
  })
}

function command_events(socket, ME) {
    on_insert(socket, ME)
    on_query(socket, ME)
    on_delete(socket, ME)
}

module.exports = { command_events }
