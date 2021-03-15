const sha1 = require('sha1')
const client_io = require('socket.io-client')

let previous = null
let previous_hash = null
let next = null
let next_hash = null

function set_previous(new_previous) { previous = new_previous; previous_hash = sha1(previous) }
function set_next(new_next) { next = new_next; next_hash = sha1(next) }

function get_previous() { return previous; }
function get_next() { return next; }

function show_neighbours() { console.log('Neighbours: ' +  previous + ', ' + next ) }

function join_forward(neighbour, joiner) {
  socket = client_io.connect('http://' + neighbour)
  socket.emit('join_forward', { joiner })
}

function send_neighbours(joiner, joiner_previous, joiner_next) {
  socket = client_io.connect('http://' + joiner)
  socket.emit('join_response', { joiner_previous, joiner_next })
}

function send_neighbour_update(receiving_neighbour, new_neighbor, side) {
  socket = client_io.connect('http://' + receiving_neighbour)
  socket.emit('update', { new_neighbor, side })
}

function join_update_neighbours(socket) {
  socket.on('update', ({ new_neighbor, side }) => {

    if (side == "previous")
      set_previous(new_neighbor)
    else if (side == "next")
      set_next(new_neighbor)
    else 
      console.log('What is this madness? (' + side + ')')

    show_neighbours()

  })

}

function oposite_of(side) {

  if (side == "previous")
    return "next";
  if (side == "next")
    return "previous";

  console.log("FUCK! I don't know this side:", side)
  process.exit()

}

function between_me_and_that_guy(joiner, that_guy, ME, side) {

  let joiner_previous
  let joiner_next
  if (side == "previous")
    { set_previous(joiner); joiner_previous = that_guy; joiner_next = ME }
  else if (side == "next")
    { set_next(joiner); joiner_previous = ME; joiner_next = that_guy }
  else 
    console.log("OH NO you SHOULDN'T have seen that!")
  send_neighbours(joiner, joiner_previous, joiner_next)

  send_neighbour_update(that_guy, joiner, oposite_of(side))

  show_neighbours()

}

function between_me_and_previous(joiner, ME) {
  between_me_and_that_guy(joiner, previous, ME, "previous")
}

function between_me_and_next(joiner, ME) {
  between_me_and_that_guy(joiner, next, ME, "next")
}

function chord_parser(to_be_hashed,ME,f_list,arg_list) {

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

function join_general_case(joiner, ME) {

  let hash = sha1(joiner)
  let MY_HASH = sha1(ME)

  if (hash < MY_HASH) {

    if (hash < previous_hash && MY_HASH > previous_hash)
      join_forward(previous, joiner)
    else
      between_me_and_previous(joiner, ME)

  } else {

    if (hash > next_hash && MY_HASH < next_hash)
      join_forward(next, joiner)
    else
      between_me_and_next(joiner, ME)

  } 

}

async function depart() {
  send_neighbour_update(next, previous, "previous")
  send_neighbour_update(previous, next, "next")
  setTimeout(() => process.exit(),1000)
} 

module.exports = {
  set_previous,
  set_next,
  get_previous,
  get_next,
  show_neighbours,
  join_update_neighbours,
  join_general_case,
  depart
}
