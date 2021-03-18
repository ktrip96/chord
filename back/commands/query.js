const client_io = require('socket.io-client')

console.log('http://localhost:' + process.argv[2])
socket = client_io.connect('http://localhost:' + process.argv[2])
socket.emit('query', { key:process.argv[3] })
setTimeout(() => process.exit(),1000)
