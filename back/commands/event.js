const client_io = require('socket.io-client')

node = process.argv[2]
event_ = process.argv[3] 
if (event_ != 'depart') {
  object = { key: process.argv[4] }
  if (event_ == 'insert')
    object = { ...object, value: process.argv[5] }
}

socket = client_io.connect('http://' + node)
socket.emit(event_, object)

socket.on(event_ + '_response', (object) => {
  console.log(object)
  socket.close()
})
