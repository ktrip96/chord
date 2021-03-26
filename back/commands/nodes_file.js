const client_io = require('socket.io-client')

socket = client_io.connect('http://192.168.1.71:5001')
socket.emit('create_nodes_file')

setTimeout(() => process.exit(),1000)
