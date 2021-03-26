const { show_event, hit_next, hit_node } = require('./globals.js')
const { insert_key_value, delete_pair } = require('./commands.js')

function on_replicate_insert(socket, ME) {
  on_replicate({ socket, ME, event_: 'insert', function_: insert_key_value })
}
function on_replicate_delete(socket, ME) {
  on_replicate({ socket, ME, event_: 'delete', function_: delete_pair })
}

function on_replicate({ socket, ME, event_, function_ }) {

  socket.on('replicate_' + event_, (object) => {
    show_event('replicate_' + event_, object)

    response = function_(object['argument'])
    if (object['n'] != 1)
      hit_next({ event_:'replicate_' + event_, object: { ...object, n: object['n'] - 1 } })
    else
      hit_node({
        node: object['replication_initial_node'],
        event_: event_ + '_replication_completed',
        object: { ...response, initial_node: object['initial_node'] }
      })
  })

  socket.on(event_ + '_replication_completed', (object) => {
    show_event(event_ + '_replication_completed', object)
    // no initial node in this log???

    response_message = object['response_message']
    hit_node({
      node: object['initial_node'], event_: event_ + '_response', object: { response_message, destination_node:ME }
    })
  })
}

function replicate_events(socket, ME) {
  on_replicate_insert(socket, ME)
  on_replicate_delete(socket, ME)
}

module.exports = { replicate_events }
