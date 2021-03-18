const client_io = require('socket.io-client')

socket = client_io.connect('http://localhost:3000')
socket.emit('insert', {
  key: process.argv[2],
  value:'I\'m just a stupid value'
})
setTimeout(() => process.exit(),1000)
