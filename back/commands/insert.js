const client_io = require('socket.io-client')
 
console.log('http://' + process.argv[2])
socket = client_io.connect('http://' + process.argv[2])
socket.emit('initial_insert', { key: process.argv[3], value:'I\'m just a stupid value' })
setTimeout(() => process.exit(),1000)
