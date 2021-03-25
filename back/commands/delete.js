const client_io = require('socket.io-client')

socket = client_io.connect('http://' + process.argv[2])
socket.emit('initial_delete', { key:process.argv[3] })
setTimeout(() => process.exit(),1000)
