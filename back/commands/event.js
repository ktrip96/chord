const client_io = require('socket.io-client')

node = process.argv[2]
event_ = process.argv[3] 

socket = client_io.connect('http://' + node)
if (event_ == 'depart')
  socket.emit('depart')
else {
  object = { key: process.argv[4] }
  if (event_ == 'insert')
    object =
  socket.emit('initial_' + event_, { key })
}

setTimeout(() => process.exit(),1000)
