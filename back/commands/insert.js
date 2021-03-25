const client_io = require('socket.io-client')

socket = client_io.connect('http://' + process.argv[2])
socket.emit('initial_insert', { key: process.argv[3], value:'I\'m just a stupid value' })
setTimeout(() => process.exit(),1000)
