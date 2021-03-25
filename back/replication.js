const { show_event, hit_next, hit_node } = require('./globals.js')
const { insert_key_value, delete_pair } = require('./commands.js')

function on_replicate_insert(socket) { on_replicate({ socket, event_: 'insert', function_: insert_key_value }) }
function on_replicate_delete(socket) { on_replicate({ socket, event_: 'delete', function_: delete_pair }) }

function on_replicate({ socket, event_, function_ }) {

  socket.on('replicate_' + event_, (object) => {
    show_event('replicate_' + event_, object)

    function_(object['argument'])
    if (object['n'] != 1)
      hit_next({ event_:'replicate_' + event_, object: { ...object, n : object['n'] -1 } })
    else
      hit_node({
        node: object['initial_node'],
        event_: event_ + '_replication_completed',
        object: { ...response, destination_node:ME }
      })
  })

  socket.on(event_ + '_replication_completed', (object) => {
    show_event(event_ + '_replication_completed', object)

  })
}

function replicate_events(socket) {
  on_replicate_insert(socket)
  on_replicate_delete(socket)
}

module.exports = { replicate_events }
