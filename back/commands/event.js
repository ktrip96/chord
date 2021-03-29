const client_io = require('socket.io-client')

node = process.argv[2]
event_ = process.argv[3] 

socket = client_io.connect('http://' + node)
if (event_ == 'depart')
  socket.emit('depart')
else {
  object = { key: process.argv[4] }
  if (event_ == 'insert')
    object = { ...object, value: process.argv[5] }
  socket.emit('initial_' + event_, object)
}

socket.on(event_ + 'response' , object => {
  console.log(object)
  socket.close()
})
