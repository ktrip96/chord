const client_io = require('socket.io-client')

console.log('http://localhost:' + process.argv[2])
socket = client_io.connect('http://localhost:' + process.argv[2])
socket.emit('depart')
setTimeout(() => process.exit(),1000)
