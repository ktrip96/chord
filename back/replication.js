const { show_event, hit_previous, hit_next, hit_node } = require('./globals.js')
const { insert_key_value, delete_pair, get_my_key_value_pairs, show_key_value_pairs } = require('./commands.js')

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
        object: { ...response, initial_node: object['argument']['initial_node'] }
      })
  })

  socket.on(event_ + '_replication_completed', (object) => {
    show_event(event_ + '_replication_completed', object)

    response_message = object['response_message']
    hit_node({
      node: object['initial_node'], event_: event_ + '_response', object: { response_message, destination_node:ME }
    })
  })
}

function join_replication(ME) {
  console.log(`Join Replication ME: ${ME}`)
  hit_next({
    event_: 'join_replication',
    object: { pairs: get_my_key_value_pairs(), initial_node: ME }
  })
}

function on_join_replication(socket, ME) {
  socket.on('join_replication', (object) => {
    show_event('join_replication', object)

    let my_key_value_pairs = get_my_key_value_pairs()
    let pairs_I_have = {}
    let pairs_I_dont_have = {}

    Object.entries(object['pairs']).forEach(([key, value]) => {
      if (my_key_value_pairs[key] != null)
        pairs_I_have = { ...pairs_I_have, [key]: value }
      else 
        pairs_I_dont_have = { ...pairs_I_dont_have, [key]: value }
    })

    // console.log('Initial:', object['initial_node'])
    // console.log('ME:', ME)
    if (object['initial_node'] == ME) {
      hit_previous({ event_: 'join_replication_delete', object: pairs_I_have })
    } else {
      // console.log('Not initial')

      if (Object.keys(pairs_I_dont_have).length != 0) {
        console.log('Hit previous')
        hit_previous({ event_: 'join_replication_delete', object: pairs_I_dont_have })
      }

      console.log('Pairs I have:', pairs_I_have)
      if (Object.keys(pairs_I_have).length != 0) {
        console.log('Hit next')
        hit_next({
          event_: 'join_replication',
          object: { pairs: pairs_I_have, initial_node: object['initial_node'] }
        })
      }
    }
  })
}

function on_join_replication_delete(socket) {
  socket.on('join_replication_delete', (key_value_pairs_to_delete) => {
    show_event('join_replication_delete', key_value_pairs_to_delete)

    Object.keys(key_value_pairs_to_delete).forEach((key) => {
      delete_pair({ key })
     })
  })
}

function depart_replication() { hit_next({ event_: 'depart_replication', object: get_my_key_value_pairs() }) }

function on_depart_replication(socket) {
  socket.on('depart_replication', (key_value_pairs) => {
    show_event('depart_replication', key_value_pairs)

    let my_key_value_pairs = get_my_key_value_pairs()
    let pairs_I_have = {}

    Object.entries(key_value_pairs).forEach(([key, value]) => {
      if (my_key_value_pairs[key] != null)
        pairs_I_have = { ...pairs_I_have, [key]: value }
      else 
        insert_key_value({ key, value })
    })

    console.log('Pairs I have:', pairs_I_have)
    if (Object.keys(pairs_I_have).length != 0) {
      console.log('Hit next')
      hit_next({ event_: 'depart_replication', object: pairs_I_have })
    }
  })
}

function replicate_events(socket, ME) {
  on_replicate_insert(socket, ME)
  on_replicate_delete(socket, ME)
  on_depart_replication(socket)
  on_join_replication(socket, ME)
  on_join_replication_delete(socket)
}

module.exports = { replicate_events, join_replication, depart_replication }
